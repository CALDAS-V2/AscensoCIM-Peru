# API ENDPOINTS DE AUTENTICACIÓN

## Base URL
```
http://localhost:3001/api/auth
```

---

## 🔐 ENDPOINTS DE RECUPERACIÓN DE CONTRASEÑA

### 1. POST `/forgot-password`
Envía un enlace de recuperación al correo del usuario.

**Request:**
```json
{
  "email": "usuario@example.com"
}
```

**Response (200):**
```json
{
  "message": "Si el correo existe en nuestro sistema, recibirás un enlace de recuperación."
}
```

**Notes:**
- Por seguridad, siempre devuelve el mismo mensaje (aunque el correo no exista)
- El correo contiene un enlace a: `http://localhost:5173/reset-password?token=...`
- El token expira en 1 hora

---

### 2. POST `/verify-reset-token`
Verifica si un token de reset es válido.

**Request:**
```json
{
  "token": "abc123def456..."
}
```

**Response (200):**
```json
{
  "valid": true,
  "message": "Token válido"
}
```

**Response (400 - Token inválido/expirado):**
```json
{
  "error": "Token inválido o expirado"
}
```

---

### 3. POST `/reset-password`
Restablecer contraseña usando el token.

**Request:**
```json
{
  "token": "abc123def456...",
  "newPassword": "nuevaContraseña123",
  "confirmPassword": "nuevaContraseña123"
}
```

**Response (200):**
```json
{
  "message": "Contraseña actualizada correctamente"
}
```

**Response (400 - Errores):**
```json
{
  "error": "Las contraseñas no coinciden"
}
```

**Validaciones:**
- Contraseña mínimo 8 caracteres
- Las contraseñas deben coincidir
- Token debe ser válido y no expirado

---

## 🔑 OTROS ENDPOINTS DE AUTENTICACIÓN

### POST `/login`
Iniciar sesión con correo y contraseña.

**Request:**
```json
{
  "email": "usuario@example.com",
  "password": "miContraseña123"
}
```

**Response (200):**
```json
{
  "message": "Inicio de sesión exitoso",
  "token": "JWT_TOKEN_EJEMPLO",
  "user": {
    "id": "cuid123",
    "email": "usuario@example.com",
    "name": "Juan",
    "role": "usuario",
    "status": "approved"
  }
}
```

---

### POST `/register`
Registrar nuevo usuario.

**Request:**
```json
{
  "email": "usuario@example.com",
  "password": "miContraseña123",
  "nombres": "Juan",
  "apellidoPaterno": "Pérez",
  "apellidoMaterno": "García",
  "cip": "12345678"
}
```

**Response (201):**
```json
{
  "message": "Registro exitoso. Tu cuenta está pendiente de aprobación por un administrador.",
  "user": {
    "id": "cuid123",
    "email": "usuario@example.com",
    "status": "pending"
  }
}
```

**Notes:**
- El usuario queda con status "pending" hasta que un admin lo apruebe
- No puede hacer login hasta ser aprobado

---

### POST `/logout`
Cerrar sesión (requiere token).

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "message": "Sesión cerrada"
}
```

---

### POST `/verify`
Verificar token y obtener datos del usuario.

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "user": {
    "id": "cuid123",
    "email": "usuario@example.com",
    "name": "Juan",
    "role": "usuario",
    "status": "approved"
  }
}
```

---

## 👤 ENDPOINTS ADMINISTRATIVOS

### GET `/admin/users`
Listar todos los usuarios (Solo Admin).

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "users": [
    {
      "id": "cuid123",
      "email": "usuario@example.com",
      "name": "Juan",
      "status": "approved",
      "roleName": "usuario",
      "lastLogin": "2024-01-01T12:00:00Z",
      "createdAt": "2024-01-01T10:00:00Z"
    }
  ]
}
```

---

### POST `/admin/approve/:userId`
Aprobar usuario pendiente (Solo Admin).

**Response (200):**
```json
{
  "message": "Usuario aprobado",
  "user": {
    "id": "cuid123",
    "email": "usuario@example.com",
    "status": "approved"
  }
}
```

---

### POST `/admin/suspend/:userId`
Suspender usuario (Solo Admin).

**Request:**
```json
{
  "reason": "Violación de términos"
}
```

**Response (200):**
```json
{
  "message": "Usuario suspendido"
}
```

---

### POST `/admin/block-module/:userId`
Bloquear módulo específico para un usuario (Solo Admin).

**Request:**
```json
{
  "moduleId": "module123",
  "reason": "Contenido inapropiado"
}
```

**Response (200):**
```json
{
  "message": "Módulo bloqueado"
}
```

---

## 🛠️ ENDPOINTS DE CONFIGURACIÓN

### GET `/modules`
Obtener lista de módulos disponibles (requiere token).

**Response (200):**
```json
{
  "modules": [
    {
      "id": "module123",
      "name": "Exámenes",
      "slug": "exams",
      "blocked": false,
      "canAccess": true
    }
  ]
}
```

---

### POST `/modules`
Crear nuevo módulo (Solo Admin).

**Request:**
```json
{
  "name": "Nuevo Módulo",
  "slug": "nuevo-modulo",
  "description": "Descripción del módulo"
}
```

**Response (201):**
```json
{
  "message": "Módulo creado",
  "module": {
    "id": "module456",
    "name": "Nuevo Módulo",
    "slug": "nuevo-modulo"
  }
}
```

---

## 🔍 CÓDIGOS DE ERROR

| Status | Error | Causa |
|--------|-------|-------|
| 400 | Bad Request | Validación fallida |
| 401 | Unauthorized | Token inválido o no proporcionado |
| 403 | Forbidden | Usuario no aprobado o suspendido |
| 404 | Not Found | Recurso no encontrado |
| 409 | Conflict | Correo ya registrado |
| 429 | Too Many Requests | Demasiados intentos (cuenta bloqueada) |
| 500 | Server Error | Error interno del servidor |

---

## 📝 EJEMPLOS DE USO

### Flujo Completo de Recuperación

```bash
# 1. Solicitar enlace de recuperación
curl -X POST http://localhost:3001/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"usuario@example.com"}'

# 2. Verificar token
curl -X POST http://localhost:3001/api/auth/verify-reset-token \
  -H "Content-Type: application/json" \
  -d '{"token":"abc123..."}'

# 3. Restablecer contraseña
curl -X POST http://localhost:3001/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "token":"abc123...",
    "newPassword":"nuevaPass123",
    "confirmPassword":"nuevaPass123"
  }'
```

---

## 🔒 Headers Requeridos

### Para endpoints protegidos:
```
Authorization: Bearer {token}
Content-Type: application/json
```

### Token JWT:
- Generado en login
- Expira en 7 días
- Se guarda en `localStorage`

---

**Última actualización:** 2024
**Versión API:** 1.0
