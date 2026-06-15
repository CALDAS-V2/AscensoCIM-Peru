import React from 'react'
import { useAuth } from './hooks/useAuth'
import { LoadingOverlay } from '@blinkdotnew/ui'
import { LoginPage } from '../pages/LoginPage'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredStatus?: 'approved' | 'pending' | 'suspended' | 'locked'
}

/**
 * ProtectedRoute: Verifica que el usuario esté autenticado y tenga el status requerido
 */
export function ProtectedRoute({ children, requiredStatus = 'approved' }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return <LoadingOverlay loading />
  }

  if (!user) {
    return <LoginPage />
  }

  // Si la ruta requiere status 'approved' pero el usuario está pending
  if (requiredStatus === 'approved' && user.status === 'pending') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="max-w-md w-full p-8 rounded-lg border border-border bg-card">
          <h2 className="text-xl font-semibold text-foreground mb-4">Cuenta en Revisión</h2>
          <p className="text-muted-foreground mb-4">
            Tu cuenta está siendo revisada por un administrador. Recibirás un correo cuando sea aprobada.
          </p>
          <div className="text-sm text-muted-foreground">
            <p>Estado: <span className="font-medium">Pendiente de aprobación</span></p>
          </div>
        </div>
      </div>
    )
  }

  // Si el usuario está suspended
  if (user.status === 'suspended') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="max-w-md w-full p-8 rounded-lg border border-border bg-card">
          <h2 className="text-xl font-semibold text-destructive mb-4">Cuenta Suspendida</h2>
          <p className="text-muted-foreground mb-4">
            Tu cuenta ha sido suspendida. Por favor contacta al administrador para más información.
          </p>
          <div className="text-sm text-muted-foreground">
            <p>Estado: <span className="font-medium">Suspendida</span></p>
          </div>
        </div>
      </div>
    )
  }

  // Si el usuario está locked por intentos fallidos
  if (user.status === 'locked') {
    const lockedUntil = user.lockedUntil ? new Date(user.lockedUntil).toLocaleString() : 'indefinidamente'
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="max-w-md w-full p-8 rounded-lg border border-border bg-card">
          <h2 className="text-xl font-semibold text-destructive mb-4">Cuenta Bloqueada</h2>
          <p className="text-muted-foreground mb-4">
            Tu cuenta está bloqueada temporalmente debido a múltiples intentos de inicio de sesión fallidos.
          </p>
          <div className="text-sm text-muted-foreground">
            <p>Desbloqueada en: <span className="font-medium">{lockedUntil}</span></p>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

/**
 * AdminRoute: Solo permite acceso a administradores
 */
interface AdminRouteProps {
  children: React.ReactNode
}

export function AdminRoute({ children }: AdminRouteProps) {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return <LoadingOverlay loading />
  }

  if (!user) {
    return <LoginPage />
  }

  // Verificar si el usuario es admin
  const isAdmin = user.role === 'admin' || user.roleId?.includes('admin')

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="max-w-md w-full p-8 rounded-lg border border-border bg-card">
          <h2 className="text-xl font-semibold text-destructive mb-4">Acceso Denegado</h2>
          <p className="text-muted-foreground">
            No tienes permisos para acceder a esta sección. Solo administradores pueden ver esta página.
          </p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

/**
 * ModuleRoute: Verifica acceso a un módulo específico
 */
interface ModuleRouteProps {
  children: React.ReactNode
  moduleId: string
  moduleName?: string
}

export function ModuleRoute({ children, moduleId, moduleName }: ModuleRouteProps) {
  const { user, isLoading } = useAuth()
  const [hasAccess, setHasAccess] = React.useState<boolean | null>(null)

  React.useEffect(() => {
    const checkModuleAccess = async () => {
      if (!user) {
        setHasAccess(false)
        return
      }

      try {
        const token = localStorage.getItem('authToken')
        const response = await fetch(`http://localhost:3001/api/auth/module-access/${moduleId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (response.ok) {
          const data = await response.json()
          setHasAccess(data.hasAccess === true)
        } else {
          setHasAccess(false)
        }
      } catch (error) {
        console.error('Error checking module access:', error)
        setHasAccess(false)
      }
    }

    checkModuleAccess()
  }, [user, moduleId])

  if (isLoading || hasAccess === null) {
    return <LoadingOverlay loading />
  }

  if (!user) {
    return <LoginPage />
  }

  if (!hasAccess) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="max-w-md w-full p-8 rounded-lg border border-border bg-card">
          <h2 className="text-xl font-semibold text-destructive mb-4">Acceso Denegado</h2>
          <p className="text-muted-foreground mb-2">
            No tienes acceso al módulo: <span className="font-medium">{moduleName || moduleId}</span>
          </p>
          <p className="text-sm text-muted-foreground">
            Si crees que esto es un error, contacta al administrador.
          </p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
