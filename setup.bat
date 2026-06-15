@echo off
cd /d "d:\Nueva carpeta"
echo [*] Instalando dependencias...
call npm install
echo [*] Generando cliente de Prisma...
call npx prisma generate
echo [*] Ejecutando migraciones de base de datos...
call npx prisma migrate dev --name init
echo [+] ¡Listo! Ahora puedes ejecutar:
echo   - npm run dev (para el frontend)
echo   - npm run dev:server (para el backend)
echo   - npm run dev:all (para ambos)
pause
