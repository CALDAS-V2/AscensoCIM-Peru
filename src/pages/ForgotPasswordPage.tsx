import React, { useState } from 'react'
import {
  Page,
  PageHeader,
  PageTitle,
  PageDescription,
  PageBody,
  Card,
  CardContent,
  Input,
  Button,
  toast
} from '@blinkdotnew/ui'
import { supabase } from '../lib/supabase'

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    try {
      const redirectTo = `${window.location.origin}/reset-password`
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo
      })
      if (error) throw error
      toast.success('Revisa tu correo. Recibirás un enlace para restablecer tu contraseña.')
    } catch (err: any) {
      console.error('Error:', err)
      toast.error(err?.message || 'Error al enviar el correo. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Page>
      <PageHeader>
        <PageTitle>Recuperar Contraseña</PageTitle>
        <PageDescription>Ingresa tu correo para recibir un enlace de restablecimiento</PageDescription>
      </PageHeader>
      <PageBody>
        <Card className="max-w-md mx-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Correo electrónico</label>
              <Input
                type="email"
                placeholder="usuario@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full"
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Enviando...' : 'Enviar enlace de recuperación'}
            </Button>
          </form>
        </Card>
      </PageBody>
    </Page>
  )
}
