#!/bin/bash
# VERIFICATION_CHECKLIST.sh - Verificación de correcciones aplicadas

echo "==============================================="
echo "🔍 VERIFICACIÓN DE CORRECCIONES APLICADAS"
echo "==============================================="
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

check_file() {
    local file=$1
    local pattern=$2
    local name=$3
    
    if grep -q "$pattern" "$file" 2>/dev/null; then
        echo -e "${GREEN}✅${NC} $name - Encontrado en $file"
    else
        echo -e "${RED}❌${NC} $name - NO encontrado en $file"
    fi
}

echo "1️⃣  Verificando URLs dinámicas..."
echo "=================================="
check_file "src/pages/LoginPage.tsx" "VITE_API_URL" "LoginPage - Variable VITE_API_URL"
check_file "src/pages/ResetPasswordPage.tsx" "VITE_API_URL" "ResetPasswordPage - Variable VITE_API_URL"
check_file "src/pages/AdminPanelPage.tsx" "VITE_API_URL" "AdminPanelPage - Variable VITE_API_URL"
check_file "src/pages/AdminUsersPage.tsx" "VITE_API_URL" "AdminUsersPage - Variable VITE_API_URL"
check_file "src/lib/hooks/useAuth.ts" "VITE_API_URL" "useAuth - Variable VITE_API_URL"

echo ""
echo "2️⃣  Verificando localStorage tokens..."
echo "======================================"
echo -n "LoginPage: "
if grep -q "localStorage.setItem('token'" "src/pages/LoginPage.tsx"; then
    echo -e "${GREEN}✅ Usa 'token'${NC}"
else
    echo -e "${RED}❌ NO usa 'token'${NC}"
fi

echo -n "useAuth: "
if grep -q "localStorage.setItem('token'" "src/lib/hooks/useAuth.ts" && ! grep -q "localStorage.setItem('authToken'" "src/lib/hooks/useAuth.ts"; then
    echo -e "${GREEN}✅ Usa 'token'${NC}"
else
    echo -e "${RED}❌ NO usa 'token' correctamente${NC}"
fi

echo -n "AdminPanelPage: "
if grep -q "localStorage.getItem('token')" "src/pages/AdminPanelPage.tsx" && ! grep -q "localStorage.getItem('authToken')" "src/pages/AdminPanelPage.tsx"; then
    echo -e "${GREEN}✅ Usa 'token'${NC}"
else
    echo -e "${RED}❌ NO usa 'token' correctamente${NC}"
fi

echo ""
echo "3️⃣  Verificando window.location en ResetPasswordPage..."
echo "=========================================================="
check_file "src/pages/ResetPasswordPage.tsx" "window.location.search" "ResetPasswordPage - window.location.search"

echo ""
echo "4️⃣  Verificando archivo de configuración..."
echo "==========================================="
check_file ".env.local" "VITE_API_URL" ".env.local - VITE_API_URL"
check_file ".env.local" "EMAIL_USER" ".env.local - EMAIL_USER"
check_file ".env.local" "EMAIL_PASS" ".env.local - EMAIL_PASS"
check_file ".env.local" "PORT=3001" ".env.local - PORT=3001"

echo ""
echo "5️⃣  Verificando puerto en server.ts..."
echo "======================================"
check_file "src/server.ts" "PORT || 3001" "server.ts - Puerto 3001"

echo ""
echo "6️⃣  Verificando nuevos scripts..."
echo "================================="
if [ -f "SETUP_Y_EJECUTAR.bat" ]; then
    echo -e "${GREEN}✅ Script SETUP_Y_EJECUTAR.bat existe${NC}"
else
    echo -e "${RED}❌ Script SETUP_Y_EJECUTAR.bat NO existe${NC}"
fi

echo ""
echo "7️⃣  Verificando imports en authRoutesV2..."
echo "=========================================="
check_file "src/lib/authRoutesV2.ts" "import { createResetToken" "authRoutesV2 - createResetToken importado"
check_file "src/lib/authRoutesV2.ts" "import { verifyResetToken" "authRoutesV2 - verifyResetToken importado"
check_file "src/lib/authRoutesV2.ts" "import { consumeResetToken" "authRoutesV2 - consumeResetToken importado"

echo ""
echo "==============================================="
echo "✅ VERIFICACIÓN COMPLETADA"
echo "==============================================="
echo ""
echo "Próximos pasos:"
echo "1. Ejecutar: npm run dev:all"
echo "2. Acceder a: http://localhost:5173"
echo "3. Probar flujos de login y recuperación de contraseña"
echo ""
