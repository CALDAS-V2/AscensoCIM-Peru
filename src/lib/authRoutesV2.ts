import { Router, Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'
import { hashPassword, verifyPassword } from './password'
import { validateAuthInput } from './validation'
import { transporter } from './mailer'
import { 
  recordFailedLoginAttempt,
  resetLoginAttempts,
  isAccountLocked,
  createSession,
  cleanExpiredSessions
} from './security'
import { authMiddleware, adminOnly, logActivity, AuthenticatedRequest } from './middleware'
import { loginLimiter } from './rateLimiter'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { createResetToken, verifyResetToken, consumeResetToken } from './passwordReset'

const prisma = new PrismaClient()
const authRouter = Router()
const JWT_SECRET = process.env.JWT_SECRET
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET no configurado. Define JWT_SECRET en .env')
}

// Supabase Admin client (requires SUPABASE_SERVICE_ROLE_KEY in .env)
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
let supabaseAdmin: any = null
if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
  try {
    supabaseAdmin = createSupabaseClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false }
    })
  } catch (err) {
    console.warn('No se pudo inicializar Supabase Admin client:', err)
    supabaseAdmin = null
  }
} else {
  console.warn('SUPABASE_SERVICE_ROLE_KEY o SUPABASE_URL no configurados. Acciones admin de Supabase deshabilitadas.')
}

// Helper: enviar WhatsApp vía Twilio
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN
const TWILIO_WHATSAPP_FROM = process.env.TWILIO_WHATSAPP_FROM // e.g. 'whatsapp:+1415XXXXXXX'
const ADMIN_WHATSAPP_TO = process.env.ADMIN_WHATSAPP_TO // e.g. 'whatsapp:+51XXXX'

async function sendWhatsAppViaTwilio(body: string) {
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_WHATSAPP_FROM || !ADMIN_WHATSAPP_TO) {
    return // not configured
  }

  const url = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`
  const params = new URLSearchParams()
  params.append('From', TWILIO_WHATSAPP_FROM)
  params.append('To', ADMIN_WHATSAPP_TO)
  params.append('Body', body)

  const auth = Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString('base64')

  try {
    await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    })
  } catch (err) {
    console.error('Error sending WhatsApp via Twilio:', err)
  }
}

// GET /api/auth/modules - Obtener lista de módulos
authRouter.get('/modules', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const modules = await prisma.module.findMany({
      include: {
        blockedModules: {
          where: { userId: req.user?.id },
          select: { id: true, reason: true }
        },
        permissions: {
          where: { userId: req.user?.id },
          select: { canAccess: true }
        }
      }
    })

    const modulesWithAccess = modules.map(m => ({
      id: m.id,
      name: m.name,
      slug: m.slug,
      blocked: m.blockedModules.length > 0,
      blockedReason: m.blockedModules[0]?.reason,
      canAccess: m.permissions[0]?.canAccess ?? true
    }))

    res.json({ modules: modulesWithAccess })
  } catch (error) {
    console.error('Error getting modules:', error)
    res.status(500).json({ error: 'Error obteniendo módulos' })
  }
})

// GET /api/auth/module-access/:moduleId - Verificar acceso a un módulo específico
authRouter.get('/module-access/:moduleId', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { moduleId } = req.params
    const userId = req.user?.id

    // Verificar si el módulo está bloqueado para este usuario
    const blockedModule = await prisma.blockedModule.findUnique({
      where: { userId_moduleId: { userId: userId!, moduleId } }
    })

    if (blockedModule) {
      return res.json({ hasAccess: false, reason: blockedModule.reason })
    }

    // Verificar permisos del usuario
    const permission = await prisma.permission.findUnique({
      where: { userId_moduleId: { userId: userId!, moduleId } }
    })

    // Si hay permiso explícito, usarlo; si no, asumir acceso por defecto
    const hasAccess = permission?.canAccess ?? true

    res.json({ hasAccess })
  } catch (error) {
    console.error('Error checking module access:', error)
    res.status(500).json({ error: 'Error verificando acceso' })
  }
})

// GET /api/auth/pending-users - Listar usuarios pendientes de aprobación (Solo Admin)
authRouter.get('/pending-users', authMiddleware, adminOnly, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      where: { status: 'pending' },
      include: { role: true },
      orderBy: { createdAt: 'desc' }
    })

    res.json({
      users: users.map(u => ({
        id: u.id,
        email: u.email,
        nombres: u.name,
        apellidoPaterno: u.apellidoPaterno,
        apellidoMaterno: u.apellidoMaterno,
        cip: u.cip,
        status: u.status,
        createdAt: u.createdAt
      }))
    })
  } catch (error) {
    console.error('Error listing pending users:', error)
    res.status(500).json({ error: 'Error listando usuarios pendientes' })
  }
})

// POST /api/auth/approve-user/:userId - Aprobar usuario pendiente (Solo Admin)
authRouter.post(
  '/approve-user/:userId',
  authMiddleware,
  adminOnly,
  logActivity('approve_user'),
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { userId } = req.params

      const user = await prisma.user.update({
        where: { id: userId },
        data: { status: 'approved' },
        include: { role: true }
      })

      // Intentar crear el usuario en Supabase Auth usando la Service Role Key
      if (supabaseAdmin) {
        try {
          // Intentar usar API admin de supabase-js
          if (supabaseAdmin.auth && (supabaseAdmin.auth as any).admin && (supabaseAdmin.auth as any).admin.createUser) {
            await (supabaseAdmin.auth as any).admin.createUser({
              email: user.email,
              email_confirm: true,
              user_metadata: {
                full_name: user.name || null,
                apellido_paterno: user.apellidoPaterno || null,
                apellido_materno: user.apellidoMaterno || null,
                cip: user.cip || null
              }
            })
          } else {
            // Fallback REST call
            const adminUrl = SUPABASE_URL!.replace(/(^https?:\/\/)/, '')
            const createUrl = `${SUPABASE_URL}/auth/v1/admin/users`
            await fetch(createUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`
              },
              body: JSON.stringify({
                email: user.email,
                email_confirm: true,
                user_metadata: {
                  full_name: user.name || null,
                  apellido_paterno: user.apellidoPaterno || null,
                  apellido_materno: user.apellidoMaterno || null,
                  cip: user.cip || null
                }
              })
            })
          }

          // Enviar correo para que el usuario establezca su contraseña usando resetPasswordForEmail
          try {
            if (supabaseAdmin.auth && supabaseAdmin.auth.resetPasswordForEmail) {
              await supabaseAdmin.auth.resetPasswordForEmail(user.email, { redirectTo: `${process.env.CLIENT_URL}/reset-password` })
            } else {
              // Fallback: usar el endpoint público para enviar enlace (esto puede funcionar si SMTP está configurado)
              await fetch(`${SUPABASE_URL}/auth/v1/recover`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: user.email, redirect_to: `${process.env.CLIENT_URL}/reset-password` })
              })
            }
          } catch (emailErr) {
            console.error('Error sending Supabase reset email:', emailErr)
          }
        } catch (supErr) {
          console.error('Error creating user in Supabase admin:', supErr)
        }
      } else {
        console.warn('Supabase admin client no configurado, no se creó usuario en Supabase Auth')
      }

      // Notificar vía webhook (WhatsApp) al admin sobre la aprobación
      try {
        const webhook = process.env.ADMIN_WHATSAPP_WEBHOOK
        if (webhook) {
          await fetch(webhook, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'user_approved',
              user: {
                id: user.id,
                email: user.email,
                name: user.name
              }
            })
          })
        }
      } catch (whErr) {
        console.error('Error notifying webhook on approval:', whErr)
      }

      // Enviar WhatsApp directamente vía Twilio si está configurado
      try {
        const msg = `Usuario aprobado:\nEmail: ${user.email}\nNombres: ${user.name || '-'}\nRevisar: ${process.env.CLIENT_URL}/admin`
        await sendWhatsAppViaTwilio(msg)
      } catch (twErr) {
        console.error('Error sending Twilio WhatsApp on approval:', twErr)
      }

      res.json({
        message: 'Usuario aprobado correctamente',
        user: {
          id: user.id,
          email: user.email,
          status: user.status
        }
      })
    } catch (error) {
      console.error('Error approving user:', error)
      res.status(500).json({ error: 'Error aprobando usuario' })
    }
  }
)

// POST /api/auth/reject-user/:userId - Rechazar usuario pendiente (Solo Admin)
authRouter.post('/reject-user/:userId', authMiddleware, adminOnly, logActivity('reject_user'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { userId } = req.params

    await prisma.user.delete({
      where: { id: userId }
    })

    res.json({ message: 'Usuario rechazado y eliminado' })
  } catch (error) {
    console.error('Error rejecting user:', error)
    res.status(500).json({ error: 'Error rechazando usuario' })
  }
})

// GET /api/auth/activity-logs - Ver logs de actividad (Solo Admin)
authRouter.get('/activity-logs', authMiddleware, adminOnly, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const logs = await prisma.activityLog.findMany({
      include: { user: { select: { email: true, name: true } } },
      orderBy: { createdAt: 'desc' },
      take: 100
    })

    res.json({
      logs: logs.map(log => ({
        id: log.id,
        userId: log.userId,
        action: log.action,
        details: log.details,
        createdAt: log.createdAt,
        user: log.user
      }))
    })
  } catch (error) {
    console.error('Error getting activity logs:', error)
    res.status(500).json({ error: 'Error obteniendo logs' })
  }
})

// POST /api/auth/login - Login con verificación de estado
authRouter.post('/login', loginLimiter, logActivity('login'), async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Correo y contraseña requeridos' })
    }

    // Verificar si la cuenta está bloqueada por intentos fallidos
    const isLocked = await isAccountLocked(email)
    if (isLocked) {
      return res.status(429).json({ error: 'Cuenta bloqueada temporalmente. Intenta más tarde.' })
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: { role: true }
    })

    if (!user) {
      await recordFailedLoginAttempt(email, req.ip)
      return res.status(401).json({ error: 'Correo o contraseña incorrectos' })
    }

    // Verificar estado del usuario
    if (user.status === 'pending') {
      await recordFailedLoginAttempt(email, req.ip)
      return res.status(403).json({ error: 'Tu cuenta aún no ha sido aprobada por un administrador' })
    }

    if (user.status === 'suspended') {
      await recordFailedLoginAttempt(email, req.ip)
      return res.status(403).json({ error: 'Tu cuenta ha sido suspendida' })
    }

    // Verificar contraseña
    const passwordValid = await verifyPassword(password, user.passwordHash)
    if (!passwordValid) {
      const lockInfo = await recordFailedLoginAttempt(email, req.ip)
      if (lockInfo.blocked) {
        return res.status(429).json({
          error: 'Demasiados intentos fallidos. Cuenta bloqueada temporalmente.',
          lockedUntil: lockInfo.lockedUntil
        })
      }
      return res.status(401).json({ error: 'Correo o contraseña incorrectos' })
    }

    // Generar JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    // Crear sesión
    await createSession(user.id, token)

    // Resetear intentos fallidos
    await resetLoginAttempts(email)

    res.json({
      message: 'Inicio de sesión exitoso',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        nombres: user.name,
        apellidoPaterno: user.apellidoPaterno,
        apellidoMaterno: user.apellidoMaterno,
        cip: user.cip,
        roleId: user.roleId,
        role: user.role.name,
        status: user.status,
        loginAttempts: user.loginAttempts,
        lockedUntil: user.lockedUntil?.toISOString(),
        lastLogin: user.lastLogin?.toISOString(),
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString()
      }
    })
  } catch (error) {
    console.error('Error en login:', error)
    res.status(500).json({ error: 'Error al iniciar sesión' })
  }
})

// POST /api/auth/register - Registro como SOLICITUD (estado PENDING)
authRouter.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password, nombres, apellidoPaterno, apellidoMaterno, cip, modules } = req.body

    const validation = validateAuthInput(email, password)
    if (!validation.valid) {
      return res.status(400).json({ error: validation.error })
    }

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return res.status(409).json({ error: 'El correo ya está registrado' })
    }

    const passwordHash = await hashPassword(password)

    // Obtener o crear rol de usuario
    let userRole = await prisma.role.findUnique({ where: { name: 'usuario' } })
    if (!userRole) {
      userRole = await prisma.role.create({
        data: { name: 'usuario', description: 'Usuario estándar' }
      })
    }

    // Crear solicitud de acceso en estado PENDING
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name: nombres,
        apellidoPaterno,
        apellidoMaterno,
        cip,
        status: 'pending', // Solicitud pendiente
        roleId: userRole.id
      }
    })

    // Crear permisos para módulos seleccionados
    if (modules && Array.isArray(modules) && modules.length > 0) {
      for (const moduleSlug of modules) {
        let module = await prisma.module.findUnique({ where: { slug: moduleSlug } })
        if (!module) {
          module = await prisma.module.create({
            data: {
              name: moduleSlug.replace(/-/g, ' ').toUpperCase(),
              slug: moduleSlug,
              description: `Acceso a ${moduleSlug}`
            }
          })
        }

        await prisma.permission.create({
          data: {
            userId: user.id,
            moduleId: module.id,
            canAccess: true
          }
        })
      }
    }

    // Notificar al administrador vía webhook (ej. integrador de WhatsApp) si está configurado
    try {
      const webhook = process.env.ADMIN_WHATSAPP_WEBHOOK
      if (webhook) {
        await fetch(webhook, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'new_access_request',
            user: {
              id: user.id,
              email: user.email,
              name: user.name,
              apellidoPaterno: user.apellidoPaterno,
              apellidoMaterno: user.apellidoMaterno,
              cip: user.cip,
              modules: modules || []
            },
            adminUrl: `${process.env.CLIENT_URL}/admin`
          })
        })
      }
    } catch (whErr) {
      console.error('Error notifying admin webhook for new request:', whErr)
    }

    // Enviar WhatsApp directamente vía Twilio si está configurado
    try {
      const msg = `Nueva solicitud de acceso:\nEmail: ${user.email}\nNombres: ${user.name || '-'}\nCIP: ${user.cip || '-'}\nRevisar: ${process.env.CLIENT_URL}/admin`
      await sendWhatsAppViaTwilio(msg)
    } catch (twErr) {
      console.error('Error sending Twilio WhatsApp for new request:', twErr)
    }

    res.status(201).json({
      message: 'Solicitud registrada. Tu cuenta está pendiente de aprobación por un administrador.',
      user: {
        id: user.id,
        email: user.email,
        status: 'pending',
        modules: modules || []
      }
    })
  } catch (error) {
    console.error('Error en registro:', error)
    res.status(500).json({ error: 'Error al registrarse' })
  }
})

// POST /api/auth/logout - Logout
authRouter.post('/logout', authMiddleware, logActivity('logout'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (req.user && req.token) {
      await prisma.session.updateMany({
        where: { token: req.token },
        data: { isActive: false }
      })
    }

    res.json({ message: 'Sesión cerrada' })
  } catch (error) {
    console.error('Error en logout:', error)
    res.status(500).json({ error: 'Error al cerrar sesión' })
  }
})

// POST /api/auth/verify - Verificar token
authRouter.post('/verify', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user?.id },
      include: { role: true }
    })

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        nombres: user.name,
        apellidoPaterno: user.apellidoPaterno,
        apellidoMaterno: user.apellidoMaterno,
        cip: user.cip,
        roleId: user.roleId,
        role: user.role.name,
        status: user.status,
        loginAttempts: user.loginAttempts,
        lockedUntil: user.lockedUntil?.toISOString(),
        lastLogin: user.lastLogin?.toISOString(),
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString()
      }
    })
  } catch (error) {
    res.status(401).json({ error: 'Token inválido' })
  }
})

// ===== ENDPOINTS ADMINISTRATIVOS =====

// GET /api/auth/admin/users - Listar todos los usuarios (Solo Admin)
authRouter.get('/admin/users', authMiddleware, adminOnly, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      include: { role: true },
      orderBy: { createdAt: 'desc' }
    })

    res.json({
      users: users.map(u => ({
        id: u.id,
        email: u.email,
        name: u.name,
        status: u.status,
        roleName: u.role.name,
        lastLogin: u.lastLogin,
        createdAt: u.createdAt
      }))
    })
  } catch (error) {
    console.error('Error listing users:', error)
    res.status(500).json({ error: 'Error listando usuarios' })
  }
})

// POST /api/auth/admin/approve - Aprobar usuario (Solo Admin)
authRouter.post('/admin/approve/:userId', authMiddleware, adminOnly, logActivity('approve_user'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { userId } = req.params

    const user = await prisma.user.update({
      where: { id: userId },
      data: { status: 'approved' },
      include: { role: true }
    })

    // Intentar crear en Supabase Auth
    if (supabaseAdmin) {
      try {
        if (supabaseAdmin.auth && (supabaseAdmin.auth as any).admin && (supabaseAdmin.auth as any).admin.createUser) {
          await (supabaseAdmin.auth as any).admin.createUser({
            email: user.email,
            email_confirm: true,
            user_metadata: {
              full_name: user.name || null,
              apellido_paterno: user.apellidoPaterno || null,
              apellido_materno: user.apellidoMaterno || null,
              cip: user.cip || null
            }
          })
        } else {
          await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`
            },
            body: JSON.stringify({
              email: user.email,
              email_confirm: true,
              user_metadata: {
                full_name: user.name || null,
                apellido_paterno: user.apellidoPaterno || null,
                apellido_materno: user.apellidoMaterno || null,
                cip: user.cip || null
              }
            })
          })
        }

        // Enviar enlace de restablecimiento desde Supabase
        try {
          if (supabaseAdmin.auth && supabaseAdmin.auth.resetPasswordForEmail) {
            await supabaseAdmin.auth.resetPasswordForEmail(user.email, { redirectTo: `${process.env.CLIENT_URL}/reset-password` })
          } else {
            await fetch(`${SUPABASE_URL}/auth/v1/recover`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email: user.email, redirect_to: `${process.env.CLIENT_URL}/reset-password` })
            })
          }
        } catch (emailErr) {
          console.error('Error sending Supabase reset email:', emailErr)
        }
      } catch (supErr) {
        console.error('Error creating user in Supabase admin:', supErr)
      }
    } else {
      console.warn('Supabase admin client no configurado, no se creó usuario en Supabase Auth')
    }

    // Informar al usuario: se espera que Supabase envíe el correo de recuperación
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: 'Cuenta aprobada - AscensoCIM Perú',
        html: `Hola ${user.name || ''},<br/><br/>Tu cuenta ha sido aprobada por el administrador. Recibirás un correo desde nuestro sistema de autenticación (Supabase) con un enlace para establecer tu contraseña. Si no lo recibes, contacta al administrador.`
      })
    } catch (emailErr) {
      console.error('Error sending informational approval email:', emailErr)
    }

    res.json({
      message: 'Usuario aprobado',
      user: { id: user.id, email: user.email, status: user.status }
    })
  } catch (error) {
    res.status(500).json({ error: 'Error aprobando usuario' })
  }
})

// POST /api/auth/admin/suspend - Suspender usuario (Solo Admin)
authRouter.post('/admin/suspend/:userId', authMiddleware, adminOnly, logActivity('suspend_user'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { userId } = req.params
    const { reason } = req.body

    await prisma.user.update({
      where: { id: userId },
      data: { status: 'suspended' }
    })

    res.json({ message: 'Usuario suspendido' })
  } catch (error) {
    res.status(500).json({ error: 'Error suspendiendo usuario' })
  }
})

// POST /api/auth/admin/block-module - Bloquear módulo específico (Solo Admin)
authRouter.post('/admin/block-module/:userId', authMiddleware, adminOnly, logActivity('block_module'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { userId } = req.params
    const { moduleId, reason } = req.body

    await prisma.blockedModule.upsert({
      where: {
        userId_moduleId: { userId, moduleId }
      },
      create: { userId, moduleId, reason },
      update: { reason }
    })

    res.json({ message: 'Módulo bloqueado' })
  } catch (error) {
    res.status(500).json({ error: 'Error bloqueando módulo' })
  }
})

// POST /api/auth/admin/unblock-module - Desbloquear módulo (Solo Admin)
authRouter.post('/admin/unblock-module/:userId/:moduleId', authMiddleware, adminOnly, logActivity('unblock_module'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { userId, moduleId } = req.params

    await prisma.blockedModule.delete({
      where: {
        userId_moduleId: { userId, moduleId }
      }
    })

    res.json({ message: 'Módulo desbloqueado' })
  } catch (error) {
    res.status(500).json({ error: 'Error desbloqueando módulo' })
  }
})

// GET /api/auth/admin/activity-logs - Ver logs de actividad (Solo Admin)
authRouter.get('/admin/activity-logs', authMiddleware, adminOnly, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const logs = await prisma.activityLog.findMany({
      include: { user: { select: { email: true } } },
      orderBy: { createdAt: 'desc' },
      take: 100
    })

    res.json({ logs })
  } catch (error) {
    res.status(500).json({ error: 'Error obteniendo logs' })
  }
})

// ===== ENDPOINTS DE INICIALIZACIÓN =====

// POST /api/auth/roles - Crear rol (Solo Admin)
authRouter.post('/roles', authMiddleware, adminOnly, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, description } = req.body

    if (!name) {
      return res.status(400).json({ error: 'Nombre de rol requerido' })
    }

    // Verificar si ya existe
    const existingRole = await prisma.role.findUnique({ where: { name } })
    if (existingRole) {
      return res.status(409).json({ error: 'El rol ya existe' })
    }

    const role = await prisma.role.create({
      data: { name, description }
    })

    res.status(201).json({ message: 'Rol creado', role })
  } catch (error) {
    console.error('Error creating role:', error)
    res.status(500).json({ error: 'Error creando rol' })
  }
})

// POST /api/auth/modules - Crear módulo (Solo Admin)
authRouter.post('/modules', authMiddleware, adminOnly, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, slug, description } = req.body

    if (!name || !slug) {
      return res.status(400).json({ error: 'Nombre y slug de módulo requeridos' })
    }

    // Verificar si ya existe
    const existingModule = await prisma.module.findUnique({ where: { slug } })
    if (existingModule) {
      return res.status(409).json({ error: 'El módulo ya existe' })
    }

    const module = await prisma.module.create({
      data: { name, slug, description }
    })

    res.status(201).json({ message: 'Módulo creado', module })
  } catch (error) {
    console.error('Error creating module:', error)
    res.status(500).json({ error: 'Error creando módulo' })
  }
})

// ===== ENDPOINTS DE RECUPERACIÓN DE CONTRASEÑA =====

// POST /api/auth/forgot-password - Enviar enlace de recuperación (nodemailer + Gmail)
authRouter.post('/forgot-password', async (req: Request, res: Response) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({ error: 'El correo es requerido' })
    }

    const user = await prisma.user.findUnique({ where: { email } })

    // Por seguridad, siempre responder igual
    if (!user) {
      return res.json({ message: 'Si el correo existe en nuestro sistema, recibirás un enlace de recuperación.' })
    }

    // Crear token interno y guardarlo en BD
    const token = await createResetToken(user.id)
    const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${token}`

    // Enviar correo via nodemailer (Gmail SMTP)
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: 'Recuperar contraseña - AscensoCIM Perú',
        html: `
          <h2>Recuperación de Contraseña</h2>
          <p>Hola ${user.name || ''},</p>
          <p>Recibimos una solicitud para recuperar tu contraseña. Haz clic en el enlace de abajo para establecer una nueva contraseña:</p>
          <p><a href="${resetLink}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Recuperar Contraseña</a></p>
          <p>Este enlace expira en 1 hora.</p>
          <p>Si no solicitaste esto, ignora este correo.</p>
          <p>AscensoCIM Perú</p>
        `
      })
    } catch (emailError) {
      console.error('Error sending email via nodemailer:', emailError)
      // No revelar error al usuario
    }

    res.json({ message: 'Si el correo existe en nuestro sistema, recibirás un enlace de recuperación.' })
  } catch (error) {
    console.error('Error en forgot-password:', error)
    res.status(500).json({ error: 'Error al procesar solicitud de recuperación' })
  }
})

// POST /api/auth/verify-reset-token - Verificar si el token es válido
authRouter.post('/verify-reset-token', async (req: Request, res: Response) => {
  try {
    const { token } = req.body

    if (!token) {
      return res.status(400).json({ error: 'Token requerido' })
    }

    const result = await verifyResetToken(token)

    if (!result.valid) {
      return res.status(400).json({ error: result.error })
    }

    res.json({ valid: true, message: 'Token válido' })
  } catch (error) {
    console.error('Error verifying reset token:', error)
    res.status(500).json({ error: 'Error verificando token' })
  }
})

// POST /api/auth/reset-password - Restablecer contraseña con token
authRouter.post('/reset-password', async (req: Request, res: Response) => {
  try {
    const { token, newPassword, confirmPassword } = req.body

    if (!token || !newPassword || !confirmPassword) {
      return res.status(400).json({ error: 'Token, contraseña y confirmación requeridos' })
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ error: 'Las contraseñas no coinciden' })
    }

    const validation = validateAuthInput('test@test.com', newPassword)
    if (!validation.valid) {
      return res.status(400).json({ error: validation.error })
    }

    // Verificar token
    const result = await verifyResetToken(token)
    if (!result.valid || !result.userId) {
      return res.status(400).json({ error: result.error })
    }

    // Hash de la nueva contraseña
    const passwordHash = await hashPassword(newPassword)

    // Actualizar contraseña del usuario
    await prisma.user.update({
      where: { id: result.userId },
      data: { passwordHash }
    })

    // Consumir el token (eliminarlo después de usarlo)
    await consumeResetToken(token)

    // Enviar correo de confirmación
    const user = await prisma.user.findUnique({ where: { id: result.userId } })
    if (user) {
      try {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: user.email,
          subject: 'Contraseña actualizada - AscensoCIM Perú',
          html: `
            <h2>Contraseña Actualizada</h2>
            <p>Hola ${user.name},</p>
            <p>Tu contraseña ha sido actualizada exitosamente.</p>
            <p>Si no realizaste este cambio, contáctanos inmediatamente.</p>
            <p>AscensoCIM Perú</p>
          `
        })
      } catch (emailError) {
        console.error('Error sending confirmation email:', emailError)
      }
    }

    res.json({ message: 'Contraseña actualizada correctamente' })
  } catch (error) {
    console.error('Error resetting password:', error)
    res.status(500).json({ error: 'Error al restablecer contraseña' })
  }
})


// POST /api/auth/sync-reset-password - Sincronizar contraseña actualizada en Supabase con Prisma
authRouter.post('/sync-reset-password', async (req: Request, res: Response) => {
  try {
    const { newPassword, accessToken } = req.body

    if (!newPassword || !accessToken) {
      return res.status(400).json({ error: 'Contraseña y token requeridos' })
    }

    if (!supabaseAdmin) {
      return res.status(500).json({ error: 'Supabase Admin no configurado' })
    }

    // Verificar que el accessToken sea válido en Supabase
    const { data: { user: supabaseUser }, error: verifyError } = await supabaseAdmin.auth.getUser(accessToken)

    if (verifyError || !supabaseUser?.email) {
      return res.status(401).json({ error: 'Token de sesión inválido o expirado' })
    }

    // Buscar al usuario en la base de datos local por email
    const prismaUser = await prisma.user.findUnique({ where: { email: supabaseUser.email } })
    if (!prismaUser) {
      return res.status(404).json({ error: 'Usuario no encontrado en el sistema' })
    }

    const validation = validateAuthInput('test@test.com', newPassword)
    if (!validation.valid) {
      return res.status(400).json({ error: validation.error })
    }

    // Actualizar la contraseña en Prisma
    const passwordHash = await hashPassword(newPassword)
    await prisma.user.update({
      where: { id: prismaUser.id },
      data: { passwordHash }
    })

    res.json({ message: 'Contraseña sincronizada correctamente' })
  } catch (error) {
    console.error('Error syncing password:', error)
    res.status(500).json({ error: 'Error al sincronizar contraseña' })
  }
})

// Endpoint de prueba: enviar WhatsApp vía Twilio (Solo Admin)
authRouter.post('/debug/send-test-whatsapp', authMiddleware, adminOnly, async (req: Request, res: Response) => {
  try {
    const { message } = req.body as { message?: string }
    const msg = message || `Mensaje de prueba AscensoCIM - ${new Date().toLocaleString()}`
    await sendWhatsAppViaTwilio(msg)
    res.json({ ok: true, message: 'Mensaje enviado (si Twilio está configurado).' })
  } catch (error) {
    console.error('Error sending test WhatsApp:', error)
    res.status(500).json({ error: 'Error enviando WhatsApp de prueba', details: String(error) })
  }
})

// Endpoint de prueba: enviar correo SMTP (Solo Admin)
authRouter.post('/debug/send-test-email', authMiddleware, adminOnly, async (req: Request, res: Response) => {
  try {
    const to = process.env.EMAIL_USER
    if (!to) return res.status(400).json({ error: 'EMAIL_USER no configurado' })

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject: 'Prueba de correo - AscensoCIM Perú',
      text: 'Este es un correo de prueba enviado desde el endpoint /api/auth/debug/send-test-email'
    })

    res.json({ ok: true, message: 'Correo enviado (si SMTP está configurado).' })
  } catch (err) {
    console.error('Error sending test email:', err)
    res.status(500).json({ error: 'Error enviando correo de prueba', details: String(err) })
  }
})

// Limpiar sesiones expiradas periódicamente
setInterval(() => {
  cleanExpiredSessions().catch(err => console.error('Error cleaning sessions:', err))
}, 60 * 60 * 1000) // Cada hora

export default authRouter
