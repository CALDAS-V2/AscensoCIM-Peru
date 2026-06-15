#!/usr/bin/env node

/**
 * VERIFICATION SCRIPT: Sistema de Seguridad Avanzada
 * 
 * Este script verifica que todos los archivos necesarios estén en su lugar
 * y tienen el contenido esperado.
 */

const fs = require('fs');
const path = require('path');

const BASE_PATH = '.';

// Verificaciones
const checks = [
  {
    name: 'Route Guards',
    file: 'src/lib/guards.tsx',
    expectedContent: ['ProtectedRoute', 'AdminRoute', 'ModuleRoute']
  },
  {
    name: 'Admin Panel',
    file: 'src/pages/AdminPanelPage.tsx',
    expectedContent: ['AdminPanelPage', 'pendingUsers', 'activityLogs']
  },
  {
    name: 'App.tsx Guards',
    file: 'src/App.tsx',
    expectedContent: ['ProtectedRoute', 'AdminRoute', 'ModuleRoute', 'initializeApp']
  },
  {
    name: 'LoginPage Updates',
    file: 'src/pages/LoginPage.tsx',
    expectedContent: ['pending', 'suspended', 'locked']
  },
  {
    name: 'Initialize App',
    file: 'src/lib/initializeApp.ts',
    expectedContent: ['DEFAULT_ROLES', 'DEFAULT_MODULES', 'initializeApp']
  },
  {
    name: 'useAuth Hook',
    file: 'src/lib/hooks/useAuth.ts',
    expectedContent: ['export interface User', 'status', 'roleId']
  },
  {
    name: 'Auth Routes V2',
    file: 'src/lib/authRoutesV2.ts',
    expectedContent: ['pending-users', 'approve-user', 'activity-logs']
  },
  {
    name: 'Prisma Schema',
    file: 'prisma/schema.prisma',
    expectedContent: ['status', 'roleId', 'Role', 'Module', 'Permission']
  }
];

console.log('🔍 Verificando Sistema de Seguridad Avanzada...\n');

let passCount = 0;
let failCount = 0;

checks.forEach((check, index) => {
  const filePath = path.join(BASE_PATH, check.file);
  
  if (!fs.existsSync(filePath)) {
    console.log(`❌ [${index + 1}] ${check.name}`);
    console.log(`   Archivo no encontrado: ${check.file}\n`);
    failCount++;
    return;
  }
  
  const content = fs.readFileSync(filePath, 'utf-8');
  const missingContent = check.expectedContent.filter(str => !content.includes(str));
  
  if (missingContent.length > 0) {
    console.log(`❌ [${index + 1}] ${check.name}`);
    console.log(`   Contenido faltante en ${check.file}:`);
    missingContent.forEach(str => console.log(`     - ${str}`));
    console.log('');
    failCount++;
  } else {
    console.log(`✅ [${index + 1}] ${check.name}`);
    passCount++;
  }
});

console.log('\n' + '='.repeat(50));
console.log(`✅ Pasadas: ${passCount}`);
console.log(`❌ Fallidas: ${failCount}`);
console.log('='.repeat(50) + '\n');

if (failCount === 0) {
  console.log('🎉 ¡TODAS LAS VERIFICACIONES PASARON!');
  console.log('\n✅ Sistema de Seguridad Avanzada está listo para usar.\n');
  console.log('Próximos pasos:');
  console.log('  1. npm install');
  console.log('  2. npx prisma migrate dev');
  console.log('  3. npm run dev:all');
  console.log('');
  process.exit(0);
} else {
  console.log('❌ Hay archivos o contenido faltante.');
  console.log('Por favor, verifica la implementación.\n');
  process.exit(1);
}
