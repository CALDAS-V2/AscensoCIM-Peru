#!/usr/bin/env node
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

console.log('[start] Starting server...')
require('./dist/server.js')
