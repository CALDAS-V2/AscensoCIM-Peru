#!/bin/bash
# Script de prueba de API con cURL
# Uso: bash test-api.sh

BASE_URL="http://localhost:3000"
API_URL="$BASE_URL/api/auth"

echo "🔐 Pruebas de API de Autenticación"
echo "===================================="

# Test 1: Health Check
echo ""
echo "1️⃣  Health Check..."
curl -s "$BASE_URL/health" | jq .
echo ""

# Test 2: Registro
echo "2️⃣  Registrar usuario..."
REGISTER_RESPONSE=$(curl -s -X POST "$API_URL/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@ejemplo.com",
    "password": "Password123",
    "nombres": "Juan",
    "apellidoPaterno": "Pérez",
    "apellidoMaterno": "García",
    "cip": "12345678"
  }')
echo "$REGISTER_RESPONSE" | jq .
TOKEN=$(echo "$REGISTER_RESPONSE" | jq -r '.token')
echo "Token: $TOKEN"
echo ""

# Test 3: Login (usuario ya existe)
echo "3️⃣  Login con credenciales correctas..."
LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@ejemplo.com",
    "password": "Password123"
  }')
echo "$LOGIN_RESPONSE" | jq .
TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.token')
echo ""

# Test 4: Login con credenciales incorrectas
echo "4️⃣  Login con contraseña incorrecta..."
curl -s -X POST "$API_URL/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@ejemplo.com",
    "password": "WrongPassword"
  }' | jq .
echo ""

# Test 5: Verificar token
echo "5️⃣  Verificar token JWT..."
curl -s -X POST "$API_URL/verify" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" | jq .
echo ""

# Test 6: Verificar con token inválido
echo "6️⃣  Verificar con token inválido..."
curl -s -X POST "$API_URL/verify" \
  -H "Authorization: Bearer invalid_token" \
  -H "Content-Type: application/json" | jq .
echo ""

# Test 7: Intentar registrar con contraseña débil
echo "7️⃣  Intentar registrar con contraseña débil..."
curl -s -X POST "$API_URL/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "weak@ejemplo.com",
    "password": "weak"
  }' | jq .
echo ""

# Test 8: Intentar registrar con email inválido
echo "8️⃣  Intentar registrar con email inválido..."
curl -s -X POST "$API_URL/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "invalid-email",
    "password": "Password123"
  }' | jq .
echo ""

echo "✅ Pruebas completadas"
