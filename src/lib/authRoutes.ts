import express, { Router, Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'
import { hashPassword, verifyPassword } from './password'
import { validateAuthInput } from './validation'

const prisma = new PrismaClient()
const authRouter = Router()
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

interface AuthRequest extends Request {
  user?: { id: string; email: string }
}

// POST /api/auth/register
authRouter.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password, nombres, apellidoPaterno, apellidoMaterno, cip } = req.body

    // Validar entrada
    const validation = validateAuthInput(email, password)
    if (!validation.valid) {
      return res.status(400).json({ error: validation.error })
    }

    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return res.status(409).json({ error: 'El correo ya está registrado' })
    }

    // Hash de la contraseña
    const passwordHash = await hashPassword(password)

    // Obtener o crear rol por defecto
    let role = await prisma.role.findUnique({ where: { name: 'user' } })
    if (!role) {
      role = await prisma.role.create({
        data: { name: 'user', description: 'Usuario estándar' }
      })
    }

    // Crear el usuario
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name: nombres,
        apellidoPaterno,
        apellidoMaterno,
        cip,
        roleId: role.id
      }
    })

    // Generar JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        apellidoPaterno: user.apellidoPaterno,
        apellidoMaterno: user.apellidoMaterno,
        cip: user.cip
      }
    })
  } catch (error) {
    console.error('Error en registro:', error)
    res.status(500).json({ error: 'Error al registrar el usuario' })
  }
})

// POST /api/auth/login
authRouter.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    // Validar entrada
    if (!email || !password) {
      return res.status(400).json({ error: 'Correo y contraseña requeridos' })
    }

    // Buscar el usuario
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return res.status(401).json({ error: 'Correo o contraseña incorrectos' })
    }

    // Verificar la contraseña con el hash almacenado
    const passwordValid = await verifyPassword(password, user.passwordHash)
    if (!passwordValid) {
      return res.status(401).json({ error: 'Correo o contraseña incorrectos' })
    }

    // Generar JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({
      message: 'Inicio de sesión exitoso',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        apellidoPaterno: user.apellidoPaterno,
        apellidoMaterno: user.apellidoMaterno,
        cip: user.cip
      }
    })
  } catch (error) {
    console.error('Error en login:', error)
    res.status(500).json({ error: 'Error al iniciar sesión' })
  }
})

// POST /api/auth/verify - Verificar token JWT
authRouter.post('/verify', async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
      return res.status(401).json({ error: 'Token no proporcionado' })
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string }
    const user = await prisma.user.findUnique({ where: { id: decoded.id } })

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        apellidoPaterno: user.apellidoPaterno,
        apellidoMaterno: user.apellidoMaterno,
        cip: user.cip
      }
    })
  } catch (error) {
    res.status(401).json({ error: 'Token inválido o expirado' })
  }
})

export default authRouter
