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
import { useAuth } from '../lib/hooks/useAuth'

interface PendingUser {
  id: string
  email: string
  nombres?: string
  apellidoPaterno?: string
  apellidoMaterno?: string
  cip?: string
  status: string
  createdAt: string
}

interface ActivityLogEntry {
  id: string
  userId: string
  action: string
  details?: string
  createdAt: string
  user?: {
    email: string
    nombres?: string
  }
}

export function AdminPanelPage() {
  const { user } = useAuth()
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([])
  const [activityLogs, setActivityLogs] = useState<ActivityLogEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [approveLoading, setApproveLoading] = useState<Record<string, boolean>>({})
  const [tabActive, setTabActive] = useState('pending')

  useEffect(() => {
    fetchPendingUsers()
    fetchActivityLogs()
  }, [])

  const fetchPendingUsers = async () => {
    try {
      const token = localStorage.getItem('token')
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001'
      const response = await fetch(`${apiUrl}/api/auth/pending-users`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        setPendingUsers(data.users || [])
      }
    } catch (error) {
      console.error('Error fetching pending users:', error)
      toast.error('Error al cargar usuarios pendientes')
    } finally {
      setLoading(false)
    }
  }

  const fetchActivityLogs = async () => {
    try {
      const token = localStorage.getItem('token')
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001'
      const response = await fetch(`${apiUrl}/api/auth/activity-logs`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        setActivityLogs(data.logs || [])
      }
    } catch (error) {
      console.error('Error fetching activity logs:', error)
    }
  }

  const approveUser = async (userId: string) => {
    try {
      setApproveLoading(prev => ({ ...prev, [userId]: true }))
      const token = localStorage.getItem('token')
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001'
      const response = await fetch(`${apiUrl}/api/auth/approve-user/${userId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        toast.success('Usuario aprobado correctamente')
        fetchPendingUsers()
      } else {
        toast.error('Error al aprobar usuario')
      }
    } catch (error) {
      console.error('Error approving user:', error)
      toast.error('Error al aprobar usuario')
    } finally {
      setApproveLoading(prev => ({ ...prev, [userId]: false }))
    }
  }

  const rejectUser = async (userId: string) => {
    try {
      setApproveLoading(prev => ({ ...prev, [userId]: true }))
      const token = localStorage.getItem('token')
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001'
      const response = await fetch(`${apiUrl}/api/auth/reject-user/${userId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        toast.success('Usuario rechazado')
        fetchPendingUsers()
      } else {
        toast.error('Error al rechazar usuario')
      }
    } catch (error) {
      console.error('Error rejecting user:', error)
      toast.error('Error al rechazar usuario')
    } finally {
      setApproveLoading(prev => ({ ...prev, [userId]: false }))
    }
  }

  if (!user) {
    return null
  }

  return (
    <Page>
      <PageHeader>
        <PageTitle>Panel de Administración</PageTitle>
        <PageDescription>Gestión de usuarios y auditoría del sistema</PageDescription>
      </PageHeader>
      <PageBody className="space-y-6">
        <div className="flex gap-2 border-b border-border">
          <button
            onClick={() => setTabActive('pending')}
            className={`px-4 py-2 text-sm font-medium transition ${
              tabActive === 'pending'
                ? 'text-primary border-b-2 border-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Usuarios Pendientes ({pendingUsers.length})
          </button>
          <button
            onClick={() => setTabActive('logs')}
            className={`px-4 py-2 text-sm font-medium transition ${
              tabActive === 'logs'
                ? 'text-primary border-b-2 border-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Registros de Actividad
          </button>
        </div>

        {tabActive === 'pending' && (
          <div className="space-y-4">
            {loading ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">Cargando usuarios pendientes...</p>
              </Card>
            ) : pendingUsers.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">No hay usuarios pendientes de aprobación</p>
              </Card>
            ) : (
              pendingUsers.map(pendingUser => (
                <Card key={pendingUser.id} className="p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{pendingUser.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Nombres</p>
                      <p className="font-medium">{pendingUser.nombres || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Apellido Paterno</p>
                      <p className="font-medium">{pendingUser.apellidoPaterno || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Apellido Materno</p>
                      <p className="font-medium">{pendingUser.apellidoMaterno || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">CIP</p>
                      <p className="font-medium">{pendingUser.cip || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Solicitado</p>
                      <p className="font-medium">{new Date(pendingUser.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex gap-3 justify-end pt-4 border-t border-border">
                    <Button
                      variant="outline"
                      onClick={() => rejectUser(pendingUser.id)}
                      disabled={approveLoading[pendingUser.id]}
                    >
                      Rechazar
                    </Button>
                    <Button
                      onClick={() => approveUser(pendingUser.id)}
                      disabled={approveLoading[pendingUser.id]}
                    >
                      {approveLoading[pendingUser.id] ? 'Procesando...' : 'Aprobar'}
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}

        {tabActive === 'logs' && (
          <div className="space-y-4">
            {activityLogs.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">No hay registros de actividad</p>
              </Card>
            ) : (
              <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-secondary/5">
                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">Usuario</th>
                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">Acción</th>
                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">Detalles</th>
                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">Fecha</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activityLogs.map(log => (
                        <tr key={log.id} className="border-b border-border hover:bg-secondary/5 transition">
                          <td className="px-4 py-3 text-foreground">
                            {log.user?.nombres ? `${log.user.nombres}` : log.user?.email || 'Usuario'}
                          </td>
                          <td className="px-4 py-3 text-foreground">
                            <span className="inline-block px-2 py-1 rounded bg-primary/10 text-primary text-xs font-medium">
                              {log.action}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-muted-foreground text-xs">{log.details || '-'}</td>
                          <td className="px-4 py-3 text-muted-foreground text-xs">
                            {new Date(log.createdAt).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}
          </div>
        )}
      </PageBody>
    </Page>
  )
}
