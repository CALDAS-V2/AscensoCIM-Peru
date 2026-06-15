#!/usr/bin/env node

/**
 * Test rápido para verificar que Supabase está configurado correctamente
 * Uso: node verify-supabase.js
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando configuración de Supabase...\n');

// 1. Verificar archivo .env.local
console.log('1️⃣ Verificando .env.local...');
const envPath = path.join(__dirname, '.env.local');
if (!fs.existsSync(envPath)) {
  console.error('   ❌ .env.local no encontrado');
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
const hasSupabaseUrl = envContent.includes('VITE_SUPABASE_URL');
const hasSupabaseKey = envContent.includes('VITE_SUPABASE_ANON_KEY');

if (hasSupabaseUrl && hasSupabaseKey) {
  console.log('   ✅ Variables de Supabase configuradas\n');
} else {
  console.error('   ❌ Faltan variables de Supabase en .env.local');
  console.error('   Agrega:');
  console.error('   VITE_SUPABASE_URL=https://tu-url.supabase.co');
  console.error('   VITE_SUPABASE_ANON_KEY=tu-anon-key');
  process.exit(1);
}

// 2. Verificar que los archivos de Supabase existan
console.log('2️⃣ Verificando archivos de integración...');
const files = [
  'src/lib/supabase.ts',
  'src/lib/useAuth.ts',
  'src/pages/RegisterPage.tsx',
  'src/pages/LoginPage.tsx'
];

let allFilesExist = true;
for (const file of files) {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`   ✅ ${file}`);
  } else {
    console.log(`   ❌ ${file} - FALTA`);
    allFilesExist = false;
  }
}

if (!allFilesExist) {
  console.error('\n⚠️  Algunos archivos faltan');
  process.exit(1);
}

console.log('\n3️⃣ Verificando imports...');
const supabaseLibContent = fs.readFileSync(path.join(__dirname, 'src/lib/supabase.ts'), 'utf8');
if (supabaseLibContent.includes('@supabase/supabase-js')) {
  console.log('   ✅ @supabase/supabase-js importado\n');
} else {
  console.error('   ❌ Import de supabase no encontrado\n');
  process.exit(1);
}

console.log('✅ ¡Configuración de Supabase verificada correctamente!\n');

console.log('📋 Próximos pasos:');
console.log('1. npm run dev');
console.log('2. Ve a http://localhost:5173');
console.log('3. Intenta registrarte con un email de prueba');
console.log('4. Confirma tu email desde el link enviado por Supabase');
console.log('5. Inicia sesión con tus credenciales\n');

console.log('💡 Tip: Si ves "Failed to fetch", verifica que:');
console.log('   - VITE_SUPABASE_URL no tenga /rest/v1/ al final');
console.log('   - Los valores en .env.local sean correctos');
console.log('   - npm run dev esté en ejecución\n');
