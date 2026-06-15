import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET no configurado. Define JWT_SECRET en .env')
}

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string
    email: string
    roleId: string
    status: string
  }
  token?: string
}

// Middleware de autenticación - verifica JWT y estado del usuario
export const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    
    if (!token) {
      return res.status(401).json({ error: 'Token no proporcionado' })
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string }
    
    // Verificar que el usuario siga existiendo y esté aprobado
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      include: { role: true }
    })

    if (!user) {
      return res.status(401).json({ error: 'Usuario no encontrado' })
    }

    if (user.status === 'suspended') {
      return res.status(403).json({ error: 'Cuenta suspendida' })
    }

    if (user.status !== 'approved') {
      return res.status(403).json({ error: 'Cuenta no aprobada' })
    }

    // Verificar si la sesión está bloqueada
    if (user.lockedUntil && new Date(user.lockedUntil) > new Date()) {
      return res.status(429).json({ error: 'Cuenta temporalmente bloqueada. Intenta más tarde.' })
    }

    req.user = {
      id: user.id,
      email: user.email,
      roleId: user.roleId,
      status: user.status
    }
    req.token = token

    next()
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido o expirado' })
  }
}

// Middleware de permisos - verifica si el usuario tiene acceso a un módulo
export const checkModuleAccess = (moduleName: string) => {
  return async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Usuario no autenticado' })
      }

      // Admin tiene acceso a todo
      const role = await prisma.role.findUnique({ where: { id: req.user.roleId } })
      if (role?.name === 'admin') {
        return next()
      }

      // Verificar si el módulo está bloqueado para este usuario
      const blockedModule = await prisma.blockedModule.findUnique({
        where: {
          userId_moduleId: {
            userId: req.user.id,
            moduleId: moduleName
          }
        }
      })

      if (blockedModule) {
        return res.status(403).json({
          error: 'Acceso denegado a este módulo',
          reason: blockedModule.reason
        })
      }

      // Verificar permisos específicos
      const permission = await prisma.permission.findUnique({
        where: {
          userId_moduleId: {
            userId: req.user.id,
            moduleId: moduleName
          }
        }
      })

      if (!permission?.canAccess) {
        return res.status(403).json({ error: 'No tienes permiso para acceder a este módulo' })
      }

      next()
    } catch (error) {
      console.error('Error en checkModuleAccess:', error)
      res.status(500).json({ error: 'Error verificando permisos' })
    }
  }
}

// Middleware para solo admin
export const adminOnly = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Usuario no autenticado' })
    }

    const role = await prisma.role.findUnique({ where: { id: req.user.roleId } })

    if (role?.name !== 'admin') {
      return res.status(403).json({ error: 'Solo administradores pueden acceder' })
    }

    next()
  } catch (error) {
    res.status(500).json({ error: 'Error verificando permisos' })
  }
}

// Middleware para registrar actividad
export const logActivity = (action: string) => {
  return async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (req.user) {
        await prisma.activityLog.create({
          data: {
            userId: req.user.id,
            action,
            details: JSON.stringify({
              method: req.method,
              path: req.path,
              params: req.params,
              query: req.query
            }),
            ipAddress: req.ip || 'unknown'
          }
        })
      }

      next()
    } catch (error) {
      console.error('Error logging activity:', error)
      next()
    }
  }
}
