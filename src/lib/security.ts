import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const MAX_LOGIN_ATTEMPTS = 5
const LOCK_TIME_MINUTES = 15

// Registrar intento fallido de login
export async function recordFailedLoginAttempt(email: string, ipAddress?: string) {
  try {
    await prisma.bruteForceAttempt.create({
      data: {
        email,
        ipAddress: ipAddress || 'unknown'
      }
    })

    // Contar intentos en los últimos 15 minutos
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000)
    const attempts = await prisma.bruteForceAttempt.count({
      where: {
        email,
        attemptedAt: {
          gte: fifteenMinutesAgo
        }
      }
    })

    // Si hay 5+ intentos, bloquear la cuenta
    if (attempts >= MAX_LOGIN_ATTEMPTS) {
      const lockedUntil = new Date(Date.now() + LOCK_TIME_MINUTES * 60 * 1000)
      await prisma.user.updateMany({
        where: { email },
        data: {
          lockedUntil,
          loginAttempts: attempts
        }
      })
      return { blocked: true, lockedUntil }
    }

    return { blocked: false }
  } catch (error) {
    console.error('Error recording failed attempt:', error)
    return { blocked: false }
  }
}

// Resetear intentos fallidos tras login exitoso
export async function resetLoginAttempts(email: string) {
  try {
    await prisma.user.updateMany({
      where: { email },
      data: {
        loginAttempts: 0,
        lockedUntil: null,
        lastLogin: new Date()
      }
    })
  } catch (error) {
    console.error('Error resetting login attempts:', error)
  }
}

// Verificar si la cuenta está bloqueada
export async function isAccountLocked(email: string): Promise<boolean> {
  try {
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user || !user.lockedUntil) {
      return false
    }

    if (new Date(user.lockedUntil) > new Date()) {
      return true
    }

    // El bloqueo expiró, resetear
    await resetLoginAttempts(email)
    return false
  } catch (error) {
    console.error('Error checking account lock:', error)
    return false
  }
}

// Crear sesión para usuario
export async function createSession(userId: string, token: string): Promise<boolean> {
  try {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 días

    await prisma.session.create({
      data: {
        userId,
        token,
        expiresAt
      }
    })

    return true
  } catch (error) {
    console.error('Error creating session:', error)
    return false
  }
}

// Limpiar sesiones expiradas
export async function cleanExpiredSessions() {
  try {
    const result = await prisma.session.deleteMany({
      where: {
        expiresAt: {
          lt: new Date()
        }
      }
    })

    console.log(`Cleaned up ${result.count} expired sessions`)
    return result.count
  } catch (error) {
    console.error('Error cleaning sessions:', error)
    return 0
  }
}

// Invalidar todas las sesiones de un usuario
export async function invalidateUserSessions(userId: string) {
  try {
    await prisma.session.updateMany({
      where: { userId },
      data: { isActive: false }
    })
  } catch (error) {
    console.error('Error invalidating sessions:', error)
  }
}
