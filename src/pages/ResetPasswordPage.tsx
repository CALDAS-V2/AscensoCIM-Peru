import React, { useState, useEffect, useRef } from 'react'
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
  const exchangedRef = useRef(false)

  useEffect(() => {
    const init = async () => {
      try {
        const params = new URLSearchParams(window.location.search)
        const code = params.get('code')
        let sessionEstablished = false

        // Exchange PKCE code exactly once (guards against StrictMode double-mount)
        if (code && !exchangedRef.current) {
          exchangedRef.current = true
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
          if (exchangeError) {
            setError('El enlace de recuperación no es válido o ha expirado. Solicita uno nuevo.')
            setIsVerifying(false)
            return
          }
        }

        const { data, error: sessionError } = await supabase.auth.getSession()
        if (data?.session) {
          sessionEstablished = true
        }

        // Handle implicit flow (hash fragments) as fallback
        if (!sessionEstablished) {
          const hash = window.location.hash
          if (hash && hash.includes('type=recovery')) {
            await new Promise(r => setTimeout(r, 1500))
            const { data: d } = await supabase.auth.getSession()
            if (d?.session) {
              sessionEstablished = true
            }
          }
        }

        if (sessionEstablished) {
          setSessionExists(true)
        } else {
          setError('Enlace inválido o expirado. Solicita un nuevo enlace de recuperación.')
        }

        if (sessionError) throw sessionError
      } catch (err) {
        setError('Error al verificar el enlace de recuperación')
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
      const { error: updateError } = await supabase.auth.updateUser({ password: newPassword })

      if (updateError) {
        setError(updateError.message || 'Error al actualizar la contraseña')
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
