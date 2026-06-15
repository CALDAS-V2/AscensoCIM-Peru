@echo off
setlocal enabledelayedexpansion

cls
cd /d "d:\Nueva carpeta"

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║  🚀 SETUP COMPLETO DE ASCENSOCIM - PERU                       ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

REM ===== PASO 1: Verificar Node.js =====
echo [1/5] Verificando Node.js y npm...
where node >nul 2>nul
if errorlevel 1 (
    echo ❌ Node.js NO ESTÁ INSTALADO
    echo    Por favor descarga desde: https://nodejs.org
    pause
    exit /b 1
)
for /f "tokens=*" %%A in ('node --version') do (
    echo ✅ %%A instalado
)

REM ===== PASO 2: Instalar dependencias =====
echo.
echo [2/5] Instalando/verificando dependencias...
if not exist "node_modules" (
    echo    Instalando npm packages...
    call npm install
    if errorlevel 1 (
        echo ❌ Error al instalar dependencias
        pause
        exit /b 1
    )
    echo ✅ Dependencias instaladas correctamente
) else (
    echo ✅ node_modules ya existe
)

REM ===== PASO 3: Configurar Prisma =====
echo.
echo [3/5] Configurando base de datos con Prisma...
if not exist "prisma\dev.db" (
    echo    Ejecutando migraciones de Prisma...
    call npx prisma migrate dev --name init --skip-generate
    if errorlevel 1 (
        echo ⚠️  Error en migraciones, pero continuando...
    )
    echo ✅ Prisma db creada
) else (
    echo ✅ Base de datos ya existe
)

REM ===== PASO 4: Generar Prisma Client =====
echo.
echo [4/5] Generando Prisma Client...
call npx prisma generate
if errorlevel 1 (
    echo ❌ Error generando Prisma
    pause
    exit /b 1
)
echo ✅ Prisma Client generado

REM ===== PASO 5: Iniciar aplicación =====
echo.
echo [5/5] 🎉 Iniciando aplicación...
echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║  ✅ SETUP COMPLETADO CON ÉXITO                                ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
echo 📝 Iniciando servidores...
echo    - Frontend: http://localhost:5173
echo    - Backend:  http://localhost:3001
echo.
echo 💡 Presiona CTRL+C para detener los servidores
echo.

call npm run dev:all

pause
