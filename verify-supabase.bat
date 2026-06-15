echo Verificando configuración de Supabase...
echo.
echo 1. Checando .env.local...
findstr "VITE_SUPABASE" ".env.local" >nul
if %errorlevel% equ 0 (
    echo ✓ Variables de Supabase encontradas
) else (
    echo X Variables de Supabase NO encontradas
    exit /b 1
)

echo.
echo 2. Checando archivos...
if exist "src\lib\supabase.ts" echo ✓ src\lib\supabase.ts
if exist "src\lib\useAuth.ts" echo ✓ src\lib\useAuth.ts
if exist "src\pages\RegisterPage.tsx" echo ✓ src\pages\RegisterPage.tsx
if exist "src\pages\LoginPage.tsx" echo ✓ src\pages\LoginPage.tsx

echo.
echo ✓ Configuración de Supabase verificada
echo.
echo Próximos pasos:
echo 1. npm run dev
echo 2. Abre http://localhost:5173
echo 3. Intenta registrarte
echo 4. Confirma tu email desde Supabase
echo 5. Inicia sesión
