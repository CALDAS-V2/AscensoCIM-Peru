import crypto from 'crypto'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Generar token seguro de 32 caracteres
export const generateResetToken = (): string => {
  return crypto.randomBytes(32).toString('hex')
}

// Crear token de reset con expiración de 1 hora
export const createResetToken = async (userId: string): Promise<string> => {
  const token = generateResetToken()
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hora

  // Eliminar tokens anteriores del mismo usuario
  await prisma.passwordResetToken.deleteMany({
    where: { userId }
  })

  // Crear nuevo token
  await prisma.passwordResetToken.create({
    data: {
      userId,
      token,
      expiresAt
    }
  })

  return token
}

// Verificar y validar el token
export const verifyResetToken = async (token: string): Promise<{ valid: boolean; userId?: string; error?: string }> => {
  try {
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token }
    })

    if (!resetToken) {
      return { valid: false, error: 'Token inválido o expirado' }
    }

    // Verificar si el token ha expirado
    if (resetToken.expiresAt < new Date()) {
      // Eliminar token expirado
      await prisma.passwordResetToken.delete({
        where: { token }
      })
      return { valid: false, error: 'Token expirado' }
    }

    return { valid: true, userId: resetToken.userId }
  } catch (error) {
    return { valid: false, error: 'Error verificando token' }
  }
}

// Consumir el token (eliminar después de usar)
export const consumeResetToken = async (token: string): Promise<boolean> => {
  try {
    await prisma.passwordResetToken.delete({
      where: { token }
    })
    return true
  } catch (error) {
    return false
  }
}
