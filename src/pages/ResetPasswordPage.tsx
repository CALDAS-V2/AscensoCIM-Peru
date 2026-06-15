import React, { useState, useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import {
  Page,
  PageHeader,
  PageTitle,
  PageDescription,
  PageBody,
  Card,
  Button,
  toast
} from '@blinkdotnew/ui'
import { supabase } from '../lib/supabase'

export function ResetPasswordPage() {
  const navigate = useNavigate()
  
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isVerifying, setIsVerifying] = useState(true)
  const [sessionExists, setSessionExists] = useState(false)

  const [localToken, setLocalToken] = useState<string | null>(null)

  useEffect(() => {
    const init = async () => {
      try {
        // Verificar si la URL contiene un token interno (backend)
        const params = new URLSearchParams(window.location.search)
        const tokenParam = params.get('token')
        if (tokenParam) {
          setLocalToken(tokenParam)
          setSessionExists(true)
          setError(null)
          setIsVerifying(false)
          return
        }

        // Intentar obtener sesión desde URL (Supabase incluye token en la redirección)
        try {
          // @ts-ignore: algunas versiones de supabase-js exponen getSessionFromUrl
          const maybe = (supabase.auth as any).getSessionFromUrl && await (supabase.auth as any).getSessionFromUrl()
          if (maybe && maybe.data && maybe.data.session) {
            setSessionExists(true)
            setError(null)
            setIsVerifying(false)
            return
          }
        } catch (e) {
          // no-op
        }

        // Si no se obtuvo sesión desde la URL, verificar sesión actual
        const { data } = await supabase.auth.getSession()
        if (data?.session) {
          setSessionExists(true)
        } else {
          setSessionExists(false)
          setError('Token inválido o expirado. Usa el enlace enviado por email.')
        }
      } catch (err) {
        setError('Error verificando sesión de recuperación')
      } finally {
        setIsVerifying(false)
      }
    }

    init()
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    if (!newPassword || !confirmPassword) {
      setError('Completa ambos campos de contraseña')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    if (newPassword.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres')
      return
    }

    setIsSubmitting(true)

    try {
      if (localToken) {
        // Usar endpoint del backend para restablecer contraseña con token interno
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001'
        const resp = await fetch(`${apiUrl}/api/auth/reset-password`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: localToken, newPassword, confirmPassword })
        })

        const result = await resp.json()
        if (!resp.ok) {
          setError(result.error || 'Error al actualizar la contraseña')
          return
        }

        toast.success('Contraseña actualizada correctamente')
        setTimeout(() => { window.location.href = '/' }, 1500)
        return
      }

      // Si no hay token local, intentar actualizar vía Supabase (enlace de Supabase)
      const { data, error } = await supabase.auth.updateUser({ password: newPassword })

      if (error) {
        setError(error.message || 'Error al actualizar la contraseña')
        return
      }

      toast.success('Contraseña actualizada correctamente')
      setTimeout(() => {
        window.location.href = '/' // redirigir al login
      }, 1500)
    } catch (err: any) {
      setError(err?.message || 'Error al restablecer contraseña')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isVerifying) {
    return (
      <Page>
        <PageHeader>
          <PageTitle>Verificando...</PageTitle>
        </PageHeader>
        <PageBody>
          <Card className="max-w-md mx-auto">
            <p className="text-center">Verificando token de recuperación...</p>
          </Card>
        </PageBody>
      </Page>
    )
  }

  if (!sessionExists) {
    return (
      <Page>
        <PageHeader>
          <PageTitle>Token Inválido</PageTitle>
        </PageHeader>
        <PageBody>
          <Card className="max-w-md mx-auto">
            <div className="text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={() => navigate({ to: '/' })}>
                Volver al login
              </Button>
            </div>
          </Card>
        </PageBody>
      </Page>
    )
  }

  return (
    <Page>
      <PageHeader>
        <PageTitle>Restablecer Contraseña</PageTitle>
        <PageDescription>Ingresa tu nueva contraseña</PageDescription>
      </PageHeader>
      <PageBody>
        <Card className="max-w-md mx-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">Nueva Contraseña</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Mínimo 8 caracteres"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Confirmar Contraseña</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Confirma tu contraseña"
                disabled={isSubmitting}
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? 'Restableciendo...' : 'Restablecer Contraseña'}
            </Button>
          </form>
        </Card>
      </PageBody>
    </Page>
  )
}
