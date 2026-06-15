import React, { useState, useEffect } from 'react'
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

type PendingUser = {
  id: string
  email: string
  name?: string
  apellidoPaterno?: string | null
  apellidoMaterno?: string | null
  cip?: string | null
  createdAt?: string
}

export function AdminUsersPage() {
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001'

  async function fetchPending() {
    setLoading(true)
    setError(null)
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${apiUrl}/api/auth/pending-users`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      })
      if (!res.ok) throw new Error(`Error fetching pending users (${res.status})`)
      const data = await res.json()
      setPendingUsers(data.users || [])
    } catch (err: any) {
      console.error('fetchPending error', err)
      setError(err.message || 'Error cargando usuarios pendientes')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPending()
  }, [])

  async function approveUser(id: string) {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${apiUrl}/api/auth/approve-user/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Error approving user')
      toast.success('Usuario aprobado')
      setPendingUsers(prev => prev.filter(u => u.id !== id))
    } catch (err: any) {
      console.error('approveUser error', err)
      toast.error(err.message || 'No se pudo aprobar el usuario')
    }
  }

  async function rejectUser(id: string) {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${apiUrl}/api/auth/reject-user/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Error rejecting user')
      toast.success('Usuario rechazado')
      setPendingUsers(prev => prev.filter(u => u.id !== id))
    } catch (err: any) {
      console.error('rejectUser error', err)
      toast.error(err.message || 'No se pudo rechazar el usuario')
    }
  }

  return (
    <Page>
      <PageHeader>
        <PageTitle>Usuarios pendientes</PageTitle>
        <PageDescription>Revisa y aprueba o rechaza solicitudes de acceso</PageDescription>
      </PageHeader>

      <PageBody className="py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="p-6">
            {loading ? (
              <p>Cargando usuarios pendientes...</p>
            ) : error ? (
              <div className="text-destructive">{error}</div>
            ) : pendingUsers.length === 0 ? (
              <div>No hay usuarios pendientes.</div>
            ) : (
              <div className="space-y-4">
                {pendingUsers.map(u => (
                  <div key={u.id} className="flex items-center justify-between border rounded p-3">
                    <div>
                      <div className="font-semibold">{u.name || '-'} ({u.email})</div>
                      <div className="text-sm text-muted-foreground">CIP: {u.cip || '-'}</div>
                      <div className="text-xs text-muted-foreground">Solicitado: {u.createdAt ? new Date(u.createdAt).toLocaleString() : '-'}</div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => approveUser(u.id)}>Aprobar</Button>
                      <Button size="sm" variant="ghost" onClick={() => rejectUser(u.id)}>Rechazar</Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </PageBody>
    </Page>
  )
}
