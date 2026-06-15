@echo off
setlocal enabledelayedexpansion

cd /d "d:\Nueva carpeta"

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║  AscensoCIM Perú - Iniciador de Servidores                 ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

REM Verificar que npm está instalado
where npm >nul 2>nul
if errorlevel 1 (
    echo ❌ ERROR: npm no está instalado o no está en PATH
    echo    Por favor instala Node.js desde: https://nodejs.org
    pause
    exit /b 1
)

echo ✅ npm encontrado
echo.

REM Verificar que node_modules existe
if not exist "node_modules" (
    echo ⚠️  Instalando dependencias...
    call npm install
    if errorlevel 1 (
        echo ❌ Error al instalar dependencias
        pause
        exit /b 1
    )
    echo ✅ Dependencias instaladas
    echo.
)

echo [*] Generando cliente de Prisma...
call npx prisma generate
if errorlevel 1 (
    echo ⚠️  Advertencia al generar Prisma (continuando...)
)
echo.

echo [*] Ejecutando migraciones de base de datos...
call npx prisma migrate deploy
if errorlevel 1 (
    echo ⚠️  Advertencia en migraciones (continuando...)
)
echo.

echo ╔════════════════════════════════════════════════════════════╗
echo ║         Iniciando Servidores                               ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo 🌐 Frontend:  http://localhost:5173
echo 🔧 Backend:   http://localhost:3001
echo.
echo Esperando a que los servidores inicien...
echo Presiona Ctrl+C para detener los servidores
echo.

timeout /t 3

call npm run dev:all

pause
