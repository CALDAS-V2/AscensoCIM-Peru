@echo off
REM Script de prueba de API con cURL
REM Uso: test-api.bat

setlocal enabledelayedexpansion
set "BASE_URL=http://localhost:3000"
set "API_URL=%BASE_URL%/api/auth"

echo.
echo 🔐 Pruebas de API de Autenticacion
echo ====================================

REM Test 1: Health Check
echo.
echo 1️⃣  Health Check...
curl -s "%BASE_URL%/health"
echo.
echo.

REM Test 2: Registro
echo 2️⃣  Registrar usuario...
for /f %%i in ('curl -s -X POST "%API_URL%/register" ^
  -H "Content-Type: application/json" ^
  -d "{\"email\": \"test@ejemplo.com\", \"password\": \"Password123\", \"nombres\": \"Juan\", \"apellidoPaterno\": \"Perez\", \"apellidoMaterno\": \"Garcia\", \"cip\": \"12345678\"}"') do (
  set "RESPONSE=%%i"
)
echo !RESPONSE!
echo.

REM Test 3: Login
echo 3️⃣  Login con credenciales correctas...
curl -s -X POST "%API_URL%/login" ^
  -H "Content-Type: application/json" ^
  -d "{\"email\": \"test@ejemplo.com\", \"password\": \"Password123\"}"
echo.
echo.

REM Test 4: Login incorrecto
echo 4️⃣  Login con contraseña incorrecta...
curl -s -X POST "%API_URL%/login" ^
  -H "Content-Type: application/json" ^
  -d "{\"email\": \"test@ejemplo.com\", \"password\": \"WrongPassword\"}"
echo.
echo.

REM Test 5: Contraseña débil
echo 5️⃣  Intentar registrar con contraseña debil...
curl -s -X POST "%API_URL%/register" ^
  -H "Content-Type: application/json" ^
  -d "{\"email\": \"weak@ejemplo.com\", \"password\": \"weak\"}"
echo.
echo.

REM Test 6: Email inválido
echo 6️⃣  Intentar registrar con email invalido...
curl -s -X POST "%API_URL%/register" ^
  -H "Content-Type: application/json" ^
  -d "{\"email\": \"invalid-email\", \"password\": \"Password123\"}"
echo.
echo.

echo ✅ Pruebas completadas
pause
