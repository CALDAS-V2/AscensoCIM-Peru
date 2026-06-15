import React, { useState } from 'react'
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

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isRecovering, setIsRecovering] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const [isSendingReset, setIsSendingReset] = useState(false)
  const [resetMessage, setResetMessage] = useState<string | null>(null)
  const [isRegistering, setIsRegistering] = useState(false)
  const [nombres, setNombres] = useState('')
  const [apellidoPaterno, setApellidoPaterno] = useState('')
  const [apellidoMaterno, setApellidoMaterno] = useState('')
  const [cip, setCip] = useState('')
  const [registerEmail, setRegisterEmail] = useState('')
  const [registerPassword, setRegisterPassword] = useState('')
  const [registerPasswordConfirm, setRegisterPasswordConfirm] = useState('')
  const [registerError, setRegisterError] = useState<string | null>(null)
  const [registerMessage, setRegisterMessage] = useState<string | null>(null)
  const [isRegisteringSubmitting, setIsRegisteringSubmitting] = useState(false)
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001'
      const resp = await fetch(`${apiUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password })
      })

      const result = await resp.json()

      if (!resp.ok) {
        throw new Error(result.error || result.message || 'Error al iniciar sesión')
      }

      // Guardar token y redirigir
      if (result.token) {
        try {
          localStorage.setItem('token', result.token)
        } catch (e) {
          console.warn('No se pudo guardar token en localStorage', e)
        }
      }

      toast.success('Inicio de sesión correcto')
      window.location.href = '/'
    } catch (err: any) {
      setError(err?.message || 'Error al iniciar sesión. Verifica tus datos.')
    } finally {
      setIsSubmitting(false)
    }
  }

const handleSendResetLink = async () => {
  setResetMessage(null)
  setIsSendingReset(true)

  if (!resetEmail.trim()) {
    setResetMessage('Por favor ingresa tu correo electrónico.')
    setIsSendingReset(false)
    return
  }

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail.trim(), {
      redirectTo: `${window.location.origin}/reset-password`
    })

    if (error) {
      setResetMessage(error.message || 'No fue posible enviar el enlace.')
      return
    }

    setResetMessage('Si el correo existe en nuestro sistema, recibirás un enlace de recuperación en tu bandeja de entrada.')
    setResetEmail('')
    toast.success('Revisa tu correo electrónico')
  } catch (err: any) {
    setResetMessage('No fue posible enviar el enlace. Intenta de nuevo.')
  } finally {
    setIsSendingReset(false)
  }
}

  const handleSignUp = async () => {
    setRegisterError(null)
    setRegisterMessage(null)

    if (!registerEmail.trim() || !registerPassword || !registerPasswordConfirm) {
      setRegisterError('Completa el correo y la contraseña para registrarte.')
      return
    }

    if (registerPassword !== registerPasswordConfirm) {
      setRegisterError('Las contraseñas no coinciden.')
      return
    }

    setIsRegisteringSubmitting(true)

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001'
      const response = await fetch(`${apiUrl}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: registerEmail.trim(),
          password: registerPassword,
          nombres,
          apellidoPaterno,
          apellidoMaterno,
          cip
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'No fue posible enviar la solicitud de registro')
      }

      setRegisterMessage('Solicitud enviada. Tu cuenta quedará pendiente de aprobación por un administrador.')
      toast.success('Solicitud enviada')

      setRegisterEmail('')
      setRegisterPassword('')
      setRegisterPasswordConfirm('')
      setNombres('')
      setApellidoPaterno('')
      setApellidoMaterno('')
      setCip('')

    } catch (err: any) {
      setRegisterError(err?.message || 'No se pudo enviar la solicitud.')
    } finally {
      setIsRegisteringSubmitting(false)
    }
  }

  const whatsappNumber = '51900648150'
  const whatsappMessage = `Hola, quiero registrarme en AscensoCIM Perú.\n\nNombres: ${nombres}\nApellido Paterno: ${apellidoPaterno}\nApellido Materno: ${apellidoMaterno}\nCIP: ${cip}`
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`
  const canSendWhatsApp = nombres.trim() !== '' && apellidoPaterno.trim() !== '' && apellidoMaterno.trim() !== '' && cip.trim() !== ''

  return (
    <Page>
      <PageHeader>
        <PageTitle>BIENVENIDO</PageTitle>
        <PageDescription>Accede con tu correo electrónico para continuar.</PageDescription>
      </PageHeader>
      <PageBody className="flex items-center justify-center py-12">
        <Card className="max-w-md w-full p-8">
          <div className="flex flex-col items-center gap-4 mb-6">
            <div className="h-20 w-20 rounded-full overflow-hidden bg-secondary/10 flex items-center justify-center">
              <img src="/logo-portada.png" alt="AscensoCIM Perú" className="h-full w-full object-cover" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-muted-foreground">AscensoCIM Perú</p>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground">Correo electrónico</label>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="mt-2 block w-full rounded-lg border border-border bg-background px-4 py-3 text-base text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  placeholder="usuario@ejemplo.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground">Contraseña</label>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="mt-2 block w-full rounded-lg border border-border bg-background px-4 py-3 text-base text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  placeholder="Ingresa tu contraseña"
                  required
                />
              </div>
            </div>

            {error ? (
              <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            ) : null}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </Button>

            <div className="text-center pt-4 space-y-2">
              <button
                type="button"
                className="block w-full text-sm font-medium text-primary underline"
                onClick={() => {
                  setIsRecovering(true)
                  setIsRegistering(false)
                  setResetMessage(null)
                }}
              >
                ¿Olvidaste tu contraseña?
              </button>
              <button
                type="button"
                className="block w-full text-sm font-medium text-primary underline"
                onClick={() => {
                  setIsRegistering(true)
                  setIsRecovering(false)
                }}
              >
                Regístrate aquí
              </button>
            </div>

            {isRecovering && (
              <div className="rounded-2xl border border-border bg-secondary/5 p-5 space-y-4">
                <p className="text-sm text-muted-foreground">
                  Ingresa tu correo para recibir el enlace de recuperación.
                </p>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground">Correo electrónico</label>
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(event) => setResetEmail(event.target.value)}
                    className="mt-2 block w-full rounded-lg border border-border bg-background px-4 py-3 text-base text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                    placeholder="usuario@ejemplo.com"
                    required
                  />
                </div>
                <Button type="button" className="w-full" disabled={isSendingReset || !resetEmail.trim()} onClick={handleSendResetLink}>
                  {isSendingReset ? 'Enviando enlace...' : 'ENVIAR ENLACE DE RECUPERACIÓN'}
                </Button>
                {resetMessage ? (
                  <div className="rounded-lg border border-secondary/40 bg-secondary/10 px-4 py-3 text-sm text-secondary">
                    {resetMessage}
                  </div>
                ) : null}
              </div>
            )}

            {isRegistering && (
              <div className="rounded-2xl border border-border bg-secondary/5 p-5 space-y-4">
                <p className="text-sm text-muted-foreground">
                  Regístrate con tu correo y contraseña. Luego completa tus datos personales.
                </p>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground">Correo electrónico</label>
                  <input
                    type="email"
                    value={registerEmail}
                    onChange={(event) => setRegisterEmail(event.target.value)}
                    className="mt-2 block w-full rounded-lg border border-border bg-background px-4 py-3 text-base text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                    placeholder="usuario@ejemplo.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground">Contraseña</label>
                  <input
                    type="password"
                    value={registerPassword}
                    onChange={(event) => setRegisterPassword(event.target.value)}
                    className="mt-2 block w-full rounded-lg border border-border bg-background px-4 py-3 text-base text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                    placeholder="Crea una contraseña"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground">Repetir contraseña</label>
                  <input
                    type="password"
                    value={registerPasswordConfirm}
                    onChange={(event) => setRegisterPasswordConfirm(event.target.value)}
                    className="mt-2 block w-full rounded-lg border border-border bg-background px-4 py-3 text-base text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                    placeholder="Repite la contraseña"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground">Nombres</label>
                  <input
                    type="text"
                    value={nombres}
                    onChange={(event) => setNombres(event.target.value)}
                    className="mt-2 block w-full rounded-lg border border-border bg-background px-4 py-3 text-base text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                    placeholder="Ingresa tus nombres"
                  />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground">Apellido Paterno</label>
                    <input
                      type="text"
                      value={apellidoPaterno}
                      onChange={(event) => setApellidoPaterno(event.target.value)}
                      className="mt-2 block w-full rounded-lg border border-border bg-background px-4 py-3 text-base text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                      placeholder="Paterno"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground">Apellido Materno</label>
                    <input
                      type="text"
                      value={apellidoMaterno}
                      onChange={(event) => setApellidoMaterno(event.target.value)}
                      className="mt-2 block w-full rounded-lg border border-border bg-background px-4 py-3 text-base text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                      placeholder="Materno"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground">CIP (Carnet de Identidad Policial)</label>
                  <input
                    type="text"
                    value={cip}
                    onChange={(event) => setCip(event.target.value)}
                    className="mt-2 block w-full rounded-lg border border-border bg-background px-4 py-3 text-base text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                    placeholder="Ingresa tu CIP"
                  />
                </div>
                {registerError ? (
                  <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                    {registerError}
                  </div>
                ) : null}
                {registerMessage ? (
                  <div className="rounded-lg border border-secondary/40 bg-secondary/10 px-4 py-3 text-sm text-secondary">
                    {registerMessage}
                  </div>
                ) : null}
                <Button
                  type="button"
                  className="w-full bg-emerald-500 hover:bg-emerald-600"
                  disabled={isRegisteringSubmitting || !registerEmail.trim() || !registerPassword || !registerPasswordConfirm}
                  onClick={handleSignUp}
                >
                  {isRegisteringSubmitting ? 'Registrando...' : 'Crear cuenta'}
                </Button>
                <a
                  href={canSendWhatsApp ? whatsappUrl : undefined}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(event) => {
                    if (!canSendWhatsApp) {
                      event.preventDefault()
                    }
                  }}
                  className={`inline-flex h-12 w-full items-center justify-center rounded-lg px-4 text-sm font-semibold text-white transition ${canSendWhatsApp ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-emerald-500/40 cursor-not-allowed'}`}
                >
                  Enviar por WhatsApp
                </a>
                <Button type="button" variant="outline" className="w-full" onClick={() => setIsRegistering(false)}>
                  Cancelar
                </Button>
                <div className="text-center pt-2">
                  <button
                    type="button"
                    className="text-sm font-medium text-primary underline"
                    onClick={() => setIsRegistering(false)}
                  >
                    Iniciar Sesión
                  </button>
                </div>
              </div>
            )}
          </form>
        </Card>
      </PageBody>
    </Page>
  )
}
