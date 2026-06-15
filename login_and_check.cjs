const fetch = globalThis.fetch;
const { PrismaClient } = require('@prisma/client');

(async () => {
  try {
    const resp = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@ascensocim.pe', password: 'tsRKrG6ih843zhdV' })
    })

    const status = resp.status
    const text = await resp.text()
    console.log('LOGIN_STATUS', status)
    try {
      const json = JSON.parse(text)
      console.log('LOGIN_JSON', json)
      if (json.token) {
        const p = new PrismaClient()
        try {
          const session = await p.session.findUnique({ where: { token: json.token } })
          console.log('SESSION_IN_DB', session)
        } catch (e) {
          console.error('PRISMA_QUERY_ERR', e)
        } finally {
          await p.$disconnect()
        }
      } else {
        console.log('No token in response; body:', json)
      }
    } catch (e) {
      console.log('LOGIN_BODY', text)
    }
  } catch (err) {
    console.error('ERR', err)
    process.exit(1)
  }
})()