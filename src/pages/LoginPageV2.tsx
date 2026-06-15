import React, { useState, useEffect } from 'react'
import {
  Page,
  PageHeader,
  PageTitle,
  PageDescription,
  PageBody,
  Card,
  CardContent,
  Button,
  Input,
  toast
} from '@blinkdotnew/ui'
import { RegisterPage } from './RegisterPage'

export function LoginPageV2() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showRegister, setShowRegister] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    console.log('handleSubmit called', { email, password })

    if (!email || !password) {
      alert('Por favor completa todos los campos')
      return
    }

    try {
      setIsSubmitting(true)
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001'
      const resp = await fetch(`${apiUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password })
      })

      const result = await resp.json()

      if (!resp.ok) {
        const msg = result.error || result.message || 'Error al iniciar sesión'
        alert(msg)
        return
      }

      if (result.token) {
        try { localStorage.setItem('token', result.token) } catch (e) { console.warn('localStorage error', e) }
      }
      if (result.user) {
        try { localStorage.setItem('user', JSON.stringify(result.user)) } catch (e) { console.warn('localStorage error', e) }
      }

      window.location.href = '/'
    } catch (err) {
      console.error('Login error:', err)
      alert('Error al conectar al servidor')
    } finally {
      setIsSubmitting(false)
    }
  }

    useEffect(() => {
      // Fallback: attach a click listener directly in case the UI library swallows events
      const btn = document.getElementById('native-login-button')
      if (!btn) return
      const handler = (e: Event) => {
        e.preventDefault()
        console.log('fallback click listener fired', { email, password })
        handleSubmit()
      }
      btn.addEventListener('click', handler)
      return () => btn.removeEventListener('click', handler)
    }, [email, password])

    if (showRegister) {
      return <RegisterPage onBackToLogin={() => setShowRegister(false)} />
    }

    return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex justify-between items-center px-8 py-6 bg-white border-b">
        <h1 className="text-2xl font-bold text-gray-900">BIENVENIDO</h1>
        <p className="text-sm text-gray-500">Accede con tu correo electrónico para continuar</p>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-100px)] px-4">
        <Card className="w-full max-w-lg shadow-lg">
          <CardContent className="pt-12 pb-12 px-12">
            {/* Logo */}
            <div className="text-center mb-8">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-700 to-green-900 flex items-center justify-center shadow-lg">
                <img 
                  src="/logo-ascensocim.png.jpeg" 
                  alt="Logo" 
                  className="w-20 h-20 rounded-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
              </div>
              <h2 className="text-xl font-semibold text-gray-400">AscensoCIM Perú</h2>
            </div>

            {/* Form */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-3">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  placeholder="usuario@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-3">
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Ingresa tu contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent bg-gray-50 pr-12"
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    onClick={() => setShowPassword(prev => !prev)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0 1 12 19c-5.523 0-10-4.477-10-10 0-1.03.15-2.02.43-2.96M6.1 6.1A9.955 9.955 0 0 1 12 5c5.523 0 10 4.477 10 10 0 1.53-.34 2.98-.94 4.27M3 3l18 18" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.05 12.13A10.94 10.94 0 0 1 12 4c5.523 0 10 4.477 10 8 0 .87-.12 1.71-.34 2.49"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <button
                id="native-login-button"
                type="button"
                onClick={() => { console.log('login clicked', { email, password }); handleSubmit(); }}
                style={{ backgroundColor: 'green', color: 'white', padding: '10px', width: '100%', borderRadius: '0.375rem', border: 'none' }}
              >
                Iniciar sesión
              </button>

              {/* Links */}
              <div className="flex justify-between items-center pt-4 border-t text-sm">
                <a href="#" className="text-green-700 hover:text-green-800 font-medium" onClick={(e)=>{ e.preventDefault(); window.location.href = '/forgot-password' }}>
                  ¿Olvidaste tu contraseña?
                </a>
                <button 
                  type="button"
                  onClick={() => setShowRegister(true)}
                  className="text-green-700 hover:text-green-800 font-medium"
                >
                  Regístrate aquí
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
