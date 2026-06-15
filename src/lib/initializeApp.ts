/**
 * initializeApp.ts: Script para inicializar roles, módulos y datos por defecto
 */

const API_BASE = (typeof window !== 'undefined' && (window as any).import?.meta?.env?.VITE_API_URL) || 'http://localhost:3001/api'

interface InitRole {
  name: string
  description: string
}

interface InitModule {
  name: string
  slug: string
  description: string
}

const DEFAULT_ROLES: InitRole[] = [
  {
    name: 'admin',
    description: 'Administrador del sistema con acceso total'
  },
  {
    name: 'supervisor',
    description: 'Supervisor que puede ver reportes y usuarios'
  },
  {
    name: 'user',
    description: 'Usuario estándar con acceso a módulos permitidos'
  }
]

const DEFAULT_MODULES: InitModule[] = [
  {
    name: 'Home',
    slug: 'home',
    description: 'Página principal'
  },
  {
    name: 'Exam',
    slug: 'exam',
    description: 'Sistema de exámenes'
  },
  {
    name: 'IA',
    slug: 'ia',
    description: 'Asistente de Inteligencia Artificial'
  },
  {
    name: 'Infracciones',
    slug: 'infracciones',
    description: 'Registro de infracciones'
  },
  {
    name: 'Directorio',
    slug: 'directorio',
    description: 'Directorio de contactos'
  },
  {
    name: 'Temarios',
    slug: 'temarios',
    description: 'Temarios y materiales'
  },
  {
    name: 'Audio',
    slug: 'audio',
    description: 'Biblioteca de audio'
  },
  {
    name: 'Mapa',
    slug: 'mapa',
    description: 'Mapa interactivo'
  },
  {
    name: 'Ayuda',
    slug: 'ayuda',
    description: 'Centro de ayuda'
  },
  {
    name: 'Práctica',
    slug: 'practica',
    description: 'Ejercicios de práctica'
  },
  {
    name: 'Admin Users',
    slug: 'admin-users',
    description: 'Panel de administración de usuarios'
  }
]

export async function initializeRoles() {
  try {
    const token = localStorage.getItem('authToken')
    if (!token) {
      console.log('No auth token found, skipping role initialization')
      return
    }

    for (const role of DEFAULT_ROLES) {
      try {
        await fetch(`${API_BASE}/auth/roles`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(role)
        })
      } catch (error) {
        console.log(`Role ${role.name} already exists or error creating it:`, error)
      }
    }
  } catch (error) {
    console.error('Error initializing roles:', error)
  }
}

export async function initializeModules() {
  try {
    const token = localStorage.getItem('authToken')
    if (!token) {
      console.log('No auth token found, skipping module initialization')
      return
    }

    for (const module of DEFAULT_MODULES) {
      try {
        await fetch(`${API_BASE}/auth/modules`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(module)
        })
      } catch (error) {
        console.log(`Module ${module.name} already exists or error creating it:`, error)
      }
    }
  } catch (error) {
    console.error('Error initializing modules:', error)
  }
}

export async function initializeApp() {
  // Inicializar roles y módulos cuando la aplicación carga
  await initializeRoles()
  await initializeModules()
  console.log('✅ App initialization completed')
}
