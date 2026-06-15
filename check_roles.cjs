const { PrismaClient } = require('@prisma/client')
;(async () => {
  const prisma = new PrismaClient()
  try {
    const roles = await prisma.role.findMany()
    console.log('ROLES:', JSON.stringify(roles, null, 2))
  } catch (e) {
    console.error('ERROR', e)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
})()
