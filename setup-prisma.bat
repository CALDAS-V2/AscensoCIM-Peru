@echo off
cd /d "d:\Nueva carpeta"
echo [*] Generando cliente de Prisma...
call npx prisma generate
echo [*] Creando migración de base de datos...
call npx prisma migrate dev --name add-password-reset-token
echo [+] ¡Listo!
pause
