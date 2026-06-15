#!/bin/bash

# Verificar que está en la carpeta correcta
cd "d:\Nueva carpeta" || exit 1

echo "🔍 Verificando instalación..."
echo ""

# Verificar que existen los archivos key
if [ ! -f "package.json" ]; then
  echo "❌ Error: package.json no encontrado"
  exit 1
fi

if [ ! -d "node_modules" ]; then
  echo "⚠️ Instalando dependencias..."
  npm install
fi

echo "✅ Verificación completada"
echo ""
echo "📝 Ejecutando migraciones de base de datos..."
npx prisma migrate deploy

echo ""
echo "🚀 Iniciando servidores..."
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:3001"
echo ""

npm run dev:all
