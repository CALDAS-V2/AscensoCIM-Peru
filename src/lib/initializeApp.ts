import { supabase } from './supabase'

const DEFAULT_ROLES = [
  { name: 'admin', description: 'Administrador del sistema con acceso total' },
  { name: 'supervisor', description: 'Supervisor que puede ver reportes y usuarios' },
  { name: 'user', description: 'Usuario estándar con acceso a módulos permitidos' }
]

const DEFAULT_MODULES = [
  { name: 'Home', slug: 'home', description: 'Página principal' },
  { name: 'Exam', slug: 'exam', description: 'Sistema de exámenes' },
  { name: 'IA', slug: 'ia', description: 'Asistente de Inteligencia Artificial' },
  { name: 'Infracciones', slug: 'infracciones', description: 'Registro de infracciones' },
  { name: 'Directorio', slug: 'directorio', description: 'Directorio de contactos' },
  { name: 'Temarios', slug: 'temarios', description: 'Temarios y materiales' },
  { name: 'Audio', slug: 'audio', description: 'Biblioteca de audio' },
  { name: 'Mapa', slug: 'mapa', description: 'Mapa interactivo' },
  { name: 'Ayuda', slug: 'ayuda', description: 'Centro de ayuda' },
  { name: 'Práctica', slug: 'practica', description: 'Ejercicios de práctica' },
  { name: 'Admin Users', slug: 'admin-users', description: 'Panel de administración de usuarios' }
]

export async function initializeRoles() {
  for (const role of DEFAULT_ROLES) {
    const { data: existing } = await supabase.from('Role').select('id').eq('name', role.name).maybeSingle()
    if (existing) continue
    const { error } = await supabase.from('Role').insert(role)
    if (error) console.error(`Error creating role ${role.name}:`, error)
  }
}

export async function initializeModules() {
  for (const mod of DEFAULT_MODULES) {
    const { data: existing } = await supabase.from('Module').select('id').eq('slug', mod.slug).maybeSingle()
    if (existing) continue
    const { error } = await supabase.from('Module').insert(mod)
    if (error) console.error(`Error creating module ${mod.name}:`, error)
  }
}

export async function initializeApp() {
  await initializeRoles()
  await initializeModules()
  console.log('App initialization completed')
}
