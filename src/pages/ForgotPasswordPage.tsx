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

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001'
      await fetch(`${apiUrl}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() })
      })
      toast.success('Si el correo existe, recibirás un enlace para restablecer tu contraseña')
    } catch (err) {
      console.error('Error requesting password reset:', err)
      toast.error('Error al solicitar recuperación. Intenta de nuevo más tarde.')
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
