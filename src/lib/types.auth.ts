export interface User {
  id: string
  email: string
  name?: string
  nombres?: string
  apellidoPaterno?: string
  apellidoMaterno?: string
  cip?: string
  status: 'pending' | 'approved' | 'suspended' | 'locked'
  roleId: string
  lastLogin?: string
  loginAttempts: number
  lockedUntil?: string
  createdAt: string
  updatedAt: string
}

export interface Role {
  id: string
  name: string
  description?: string
  createdAt: string
}

export interface Module {
  id: string
  name: string
  slug: string
  description?: string
  createdAt: string
}

export interface Permission {
  id: string
  userId: string
  moduleId: string
  canAccess: boolean
  createdAt: string
}

export interface BlockedModule {
  id: string
  userId: string
  moduleId: string
  reason?: string
  blockedAt: string
}

export interface ActivityLog {
  id: string
  userId: string
  action: string
  details?: string
  ipAddress?: string
  createdAt: string
}

export interface AuthResponse {
  token: string
  user: User
}

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  email: string
  password: string
  nombres?: string
  apellidoPaterno?: string
  apellidoMaterno?: string
  cip?: string
}
