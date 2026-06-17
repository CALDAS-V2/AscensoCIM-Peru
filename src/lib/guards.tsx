import React from 'react'
import { useAuth } from './useAuth'
import { supabase } from './supabase'
import { LoadingOverlay } from '@blinkdotnew/ui'
import { LoginPageV2 } from '../pages/LoginPageV2'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredStatus?: 'approved' | 'pending' | 'suspended' | 'locked'
}

/**
 * ProtectedRoute: Verifica que el usuario esté autenticado y tenga el status requerido
 */
export function ProtectedRoute({ children, requiredStatus = 'approved' }: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const [profile, setProfile] = React.useState<any>(null)
  const [profileLoading, setProfileLoading] = React.useState(true)

  React.useEffect(() => {
    if (!user) {
      setProfileLoading(false)
      return
    }
    supabase.from('User').select('status, lockedUntil').eq('id', user.id).maybeSingle().then(({ data }) => {
      setProfile(data)
      setProfileLoading(false)
    })
  }, [user])

  if (loading || profileLoading) {
    return <LoadingOverlay loading />
  }

  if (!user) {
    return <LoginPageV2 />
  }

  const userStatus = profile?.status

  // Si la ruta requiere status 'approved' pero el usuario está pending
  if (requiredStatus === 'approved' && userStatus === 'pending') {
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
  if (userStatus === 'suspended') {
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
  if (userStatus === 'locked') {
    const lockedUntil = profile?.lockedUntil ? new Date(profile.lockedUntil).toLocaleString() : 'indefinidamente'
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
  const { user, loading } = useAuth()
  const [isAdmin, setIsAdmin] = React.useState<boolean | null>(null)

  React.useEffect(() => {
    const checkAdmin = async () => {
      if (!user) {
        setIsAdmin(false)
        return
      }
      const { data: profile } = await supabase.from('User').select('roleId').eq('id', user.id).maybeSingle()
      if (!profile) {
        setIsAdmin(false)
        return
      }
      const { data: role } = await supabase.from('Role').select('name').eq('id', profile.roleId).maybeSingle()
      setIsAdmin(role?.name === 'admin')
    }
    checkAdmin()
  }, [user])

  if (loading || isAdmin === null) {
    return <LoadingOverlay loading />
  }

  if (!user) {
    return <LoginPageV2 />
  }

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
  const { user, loading } = useAuth()
  const [hasAccess, setHasAccess] = React.useState<boolean | null>(null)

  React.useEffect(() => {
    const checkModuleAccess = async () => {
      if (!user) {
        setHasAccess(false)
        return
      }

      try {
        let modId = moduleId
        // Look up module by slug if needed
        const { data: mod } = await supabase.from('Module').select('id').eq('slug', moduleId).maybeSingle()
        if (mod) modId = mod.id

        const { data: permission } = await supabase
          .from('Permission')
          .select('canAccess')
          .eq('userId', user.id)
          .eq('moduleId', modId)
          .maybeSingle()

        setHasAccess(permission?.canAccess !== false)
      } catch (error) {
        console.error('Error checking module access:', error)
        setHasAccess(false)
      }
    }

    checkModuleAccess()
  }, [user, moduleId])

  if (loading || hasAccess === null) {
    return <LoadingOverlay loading />
  }

  if (!user) {
    return <LoginPageV2 />
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
