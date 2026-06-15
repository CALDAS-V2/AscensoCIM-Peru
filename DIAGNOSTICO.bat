@echo off
setlocal enabledelayedexpansion

cd /d "d:\Nueva carpeta"

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║  🔍 DIAGNÓSTICO DE PROBLEMAS                               ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

echo [1/5] Verificando Node.js...
where node >nul 2>nul
if errorlevel 1 (
    echo ❌ Node.js NO ESTÁ INSTALADO
    echo    Descargalo en: https://nodejs.org
    goto :error
) else (
    for /f "tokens=*" %%A in ('node --version') do echo ✅ %%A
)
echo.

echo [2/5] Verificando npm...
where npm >nul 2>nul
if errorlevel 1 (
    echo ❌ npm NO ESTÁ INSTALADO
    goto :error
) else (
    for /f "tokens=*" %%A in ('npm --version') do echo ✅ npm %%A
)
echo.

echo [3/5] Verificando archivos del proyecto...
if not exist "package.json" (
    echo ❌ package.json no encontrado
    goto :error
) else (
    echo ✅ package.json existe
)

if not exist "src" (
    echo ❌ Carpeta src no encontrada
    goto :error
) else (
    echo ✅ Carpeta src existe
)

if not exist "prisma" (
    echo ❌ Carpeta prisma no encontrada
    goto :error
) else (
    echo ✅ Carpeta prisma existe
)
echo.

echo [4/5] Verificando variables de entorno...
if not exist ".env.local" (
    echo ⚠️  .env.local no encontrado (pero puede estar en .env)
) else (
    echo ✅ .env.local existe
    for /f "usebackq tokens=1,2 delims==" %%A in (".env.local") do (
        if "%%A"=="EMAIL_USER" echo    ✅ EMAIL_USER configurado
        if "%%A"=="EMAIL_PASS" echo    ✅ EMAIL_PASS configurado
        if "%%A"=="PORT" echo    ✅ PORT configurado
    )
)
echo.

echo [5/5] Verificando dependencias...
if not exist "node_modules" (
    echo ⚠️  node_modules no existe
    echo    Instalando dependencias...
    call npm install
    if errorlevel 1 (
        echo ❌ Error al instalar dependencias
        goto :error
    )
    echo ✅ Dependencias instaladas
) else (
    echo ✅ node_modules existe
)
echo.

echo ╔════════════════════════════════════════════════════════════╗
echo ║  ✅ DIAGNÓSTICO COMPLETADO                                 ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo Próximo paso: ejecuta start-all.bat
echo.
pause
goto :end

:error
echo.
echo ❌ Se encontraron problemas. Por favor:
echo    1. Verifica que Node.js esté instalado
echo    2. Verifica que npm esté en el PATH
echo    3. Asegúrate de estar en la carpeta correcta
echo.
pause
exit /b 1

:end
