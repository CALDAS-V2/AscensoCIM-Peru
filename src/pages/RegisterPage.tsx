import React, { useState } from 'react'
import {
  Card,
  CardContent,
  Button,
  Input,
  toast
} from '@blinkdotnew/ui'
import { supabase } from '../lib/supabase'

interface RegisterPageProps {
  onBackToLogin: () => void
}

export function RegisterPage({ onBackToLogin }: RegisterPageProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordRepeat, setPasswordRepeat] = useState('')
  const [nombres, setNombres] = useState('')
  const [apellidoPaterno, setApellidoPaterno] = useState('')
  const [apellidoMaterno, setApellidoMaterno] = useState('')
  const [cip, setCip] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    
    // Validaciones
    if (!email || !password || !passwordRepeat || !nombres || !apellidoPaterno || !cip) {
      toast.error('Por favor completa todos los campos obligatorios')
      return
    }

    if (password !== passwordRepeat) {
      toast.error('Las contraseñas no coinciden')
      return
    }

    if (password.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres')
      return
    }

    setIsLoading(true)

    try {
      // 1. Crear usuario en Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            nombres,
            apellidoPaterno,
            apellidoMaterno,
            cip
          }
        }
      })

      if (error) throw error

      // 2. Obtener el rol 'usuario'
      const { data: role } = await supabase
        .from('Role')
        .select('id')
        .eq('name', 'usuario')
        .single()

      // 3. Crear registro en public.User con estado pendiente
      const now = new Date().toISOString()
      await supabase.from('User').insert({
        id: data.user!.id,
        email: email.trim(),
        passwordHash: 'MIGRATED_TO_SUPABASE_AUTH',
        name: nombres,
        apellidoPaterno,
        apellidoMaterno,
        cip,
        status: 'pending',
        roleId: role?.id || '',
        updatedAt: now
      })

      toast.success('Solicitud enviada. Tu cuenta quedará pendiente de aprobación por un administrador.')

      // Limpiar formulario
      setEmail('')
      setPassword('')
      setPasswordRepeat('')
      setNombres('')
      setApellidoPaterno('')
      setApellidoMaterno('')
      setCip('')

      // Redirigir a login después de 2 segundos
      setTimeout(() => {
        onBackToLogin()
      }, 2000)
    } catch (error: any) {
      toast.error(error?.message || 'Error en la conexión')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex justify-between items-center px-8 py-6 bg-white border-b">
        <h1 className="text-2xl font-bold text-gray-900">CREAR CUENTA</h1>
        <p className="text-sm text-gray-500">Completa tu información personal</p>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-100px)] px-4 py-8">
        <Card className="w-full max-w-lg shadow-lg">
          <CardContent className="pt-8 pb-8 px-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Correo electrónico
                </label>
                <Input
                  type="email"
                  placeholder="usuario@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Contraseña
                </label>
                <Input
                  type="password"
                  placeholder="Crea una contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Repite contraseña
                </label>
                <Input
                  type="password"
                  placeholder="Repite la contraseña"
                  value={passwordRepeat}
                  onChange={(e) => setPasswordRepeat(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Nombres
                </label>
                <Input
                  type="text"
                  placeholder="Ingresa tus nombres"
                  value={nombres}
                  onChange={(e) => setNombres(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Apellido Paterno
                  </label>
                  <Input
                    type="text"
                    placeholder="Paterno"
                    value={apellidoPaterno}
                    onChange={(e) => setApellidoPaterno(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Apellido Materno
                  </label>
                  <Input
                    type="text"
                    placeholder="Materno"
                    value={apellidoMaterno}
                    onChange={(e) => setApellidoMaterno(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  CIP (Carnet de Identidad Policial)
                </label>
                <Input
                  type="text"
                  placeholder="Ingresa tu CIP"
                  value={cip}
                  onChange={(e) => setCip(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                />
              </div>

              <Button 
                type="submit"
                disabled={isLoading}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition"
              >
                {isLoading ? 'Creando cuenta...' : 'Crear cuenta'}
              </Button>

              <Button 
                type="button"
                className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 rounded-lg transition"
                onClick={() => {
                  // Construir mensaje y abrir WhatsApp en nueva pestaña
                  const message = `Solicitud de acceso AscensoCIM Peru:\nNombre: ${nombres} ${apellidoPaterno} ${apellidoMaterno}\nEmail: ${email}\nCIP: ${cip}`
                  const encoded = encodeURIComponent(message)
                  const waUrl = `https://wa.me/51900648150?text=${encoded}`
                  window.open(waUrl, '_blank', 'noopener')
                }}
              >
                Enviar por WhatsApp
              </Button>

              <Button 
                type="button"
                onClick={onBackToLogin}
                className="w-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold py-2 rounded-lg transition"
              >
                Cancelar
              </Button>

              <div className="text-center pt-4">
                <button 
                  type="button"
                  onClick={onBackToLogin}
                  className="text-green-700 hover:text-green-800 font-medium text-sm"
                >
                  Iniciar Sesión
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
