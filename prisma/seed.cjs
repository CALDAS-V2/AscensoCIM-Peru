const { PrismaClient } = require('@prisma/client')

async function main() {
  const prisma = new PrismaClient()

  try {
    // === SEED ROLES ===
    const roles = [
      { name: 'admin', description: 'Administrador del sistema con acceso total' },
      { name: 'supervisor', description: 'Supervisor que puede ver reportes y usuarios' },
      { name: 'usuario', description: 'Usuario estándar con acceso a módulos permitidos' },
    ]
    for (const role of roles) {
      await prisma.role.upsert({
        where: { name: role.name },
        update: { description: role.description },
        create: role,
      })
      console.log(`✅ Role "${role.name}" ready`)
    }

    // === SEED MODULES ===
    const modules = [
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
      { name: 'Admin Users', slug: 'admin-users', description: 'Panel de administración de usuarios' },
    ]
    for (const mod of modules) {
      await prisma.module.upsert({
        where: { slug: mod.slug },
        update: { name: mod.name, description: mod.description },
        create: mod,
      })
      console.log(`✅ Module "${mod.name}" ready`)
    }

    console.log('\n🎉 Seed completed successfully!')
  } catch (e) {
    console.error('Seed error:', e)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
