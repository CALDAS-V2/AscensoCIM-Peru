const { execSync } = require('child_process')
const path = require('path')

console.log('[start] Running Prisma migrations...')
try {
  execSync('npx prisma migrate deploy', { stdio: 'inherit', cwd: __dirname })
  console.log('[start] Migrations applied')
} catch (e) {
  console.error('[start] Migration failed:', e.message)
}

console.log('[start] Seeding...')
try {
  execSync('node prisma/seed.cjs', { stdio: 'inherit', cwd: __dirname })
  console.log('[start] Seed completed')
} catch (e) {
  console.error('[start] Seed failed:', e.message)
}

console.log('[start] Starting server with tsx...')
try {
  execSync('npx tsx src/server.ts', { stdio: 'inherit', cwd: __dirname })
} catch (e) {
  console.error('[start] Server exited:', e.message)
  process.exit(1)
}
