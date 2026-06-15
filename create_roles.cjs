const { PrismaClient } = require('@prisma/client')
;(async () => {
  const prisma = new PrismaClient()
  try {
    await prisma.role.upsert({
      where: { name: 'admin' },
      update: {},
      create: { name: 'admin', description: 'Administrador del sistema' }
    })
    await prisma.role.upsert({
      where: { name: 'usuario' },
      update: {},
      create: { name: 'usuario', description: 'Usuario estándar' }
    })
    const roles = await prisma.role.findMany()
    console.log('ROLES AFTER UPSERT:', JSON.stringify(roles, null, 2))
  } catch (e) {
    console.error('ERROR', e)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
})()
