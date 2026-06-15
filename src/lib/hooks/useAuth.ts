import { useState, useEffect } from 'react'

export interface User {
  id: string
  email: string
  name?: string
  nombres?: string
  apellidoPaterno?: string
  apellidoMaterno?: string
  cip?: string
  status: 'pending' | 'approved' | 'suspended' | 'locked'
  roleId?: string
  role?: string
  lastLogin?: string
  loginAttempts: number
  lockedUntil?: string
  createdAt: string
  updatedAt: string
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          setIsLoading(false)
          return
        }

        const apiUrl = typeof window !== 'undefined' && (window as any).import?.meta?.env?.VITE_API_URL
          ? (window as any).import.meta.env.VITE_API_URL
          : 'http://localhost:3001'
        const response = await fetch(`${apiUrl}/api/auth/verify`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (response.ok) {
          const data = await response.json()
          setUser(data.user)
          setIsAuthenticated(true)
        } else {
          localStorage.removeItem('authToken')
        }
      } catch (error) {
        console.error('Error verificando token:', error)
      } finally {
        setIsLoading(false)
      }
    }

    verifyToken()
  }, [])

  const login = async (email: string, password: string) => {
    const apiUrl = typeof window !== 'undefined' && (window as any).import?.meta?.env?.VITE_API_URL
      ? (window as any).import.meta.env.VITE_API_URL
      : 'http://localhost:3001'
    const response = await fetch(`${apiUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Error al iniciar sesión')
    }

    const data = await response.json()
    localStorage.setItem('token', data.token)
    setUser(data.user)
    setIsAuthenticated(true)
    return data
  }

  const register = async (email: string, password: string, metadata: any) => {
    const apiUrl = typeof window !== 'undefined' && (window as any).import?.meta?.env?.VITE_API_URL
      ? (window as any).import.meta.env.VITE_API_URL
      : 'http://localhost:3001'
    const response = await fetch(`${apiUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        password,
        ...metadata
      })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Error al registrarse')
    }

    const data = await response.json()
    localStorage.setItem('token', data.token)
    setUser(data.user)
    setIsAuthenticated(true)
    return data
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
    setIsAuthenticated(false)
  }

  return {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout
  }
}