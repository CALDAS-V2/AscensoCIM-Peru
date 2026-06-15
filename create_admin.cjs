const crypto = require('crypto')
const argon2 = require('argon2')
const { PrismaClient } = require('@prisma/client')

;(async () => {
  const prisma = new PrismaClient()
  try {
    const email = 'admin@ascensocim.pe'
    // generar password seguro 16 chars
    const password = crypto.randomBytes(12).toString('base64').replace(/\+/g,'A').replace(/\//g,'B').slice(0,16)
    const passwordHash = await argon2.hash(password, { type: argon2.argon2id })

    // obtener rol admin
    let role = await prisma.role.findUnique({ where: { name: 'admin' } })
    if (!role) {
      role = await prisma.role.create({ data: { name: 'admin', description: 'Administrador del sistema' } })
    }

    const user = await prisma.user.upsert({
      where: { email },
      update: {
        passwordHash,
        name: 'Administrador',
        status: 'approved',
        roleId: role.id
      },
      create: {
        email,
        passwordHash,
        name: 'Administrador',
        status: 'approved',
        roleId: role.id
      }
    })

    console.log('ADMIN CREATED/UPDATED:', { id: user.id, email: user.email })
    console.log('PASSWORD (store it safely):', password)
  } catch (e) {
    console.error('ERROR', e)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
})()
