# 🔐 Guía de Instalación - Login Seguro

## Resumen de Implementación

Se ha implementado un sistema de autenticación seguro con:

✅ **Hashing seguro**: Argon2id (resistente a GPU/timing attacks)
✅ **Validación fuerte**: Contraseñas con mayúsculas, minúsculas y números
✅ **JWT Tokens**: Autenticación sin estado con expiración
✅ **Protección CORS**: Validación de origen
✅ **ORM (Prisma)**: Prevención automática de SQL injection
✅ **Base de datos SQLite**: Con campos de seguridad

## 📦 Archivos Modificados/Creados

### Backend
```
src/
  ├── server.ts              (Servidor Express principal)
  ├── lib/
  │   ├── authRoutes.ts      (Rutas de autenticación)
  │   ├── password.ts        (Funciones de hash con Argon2)
  │   └── validation.ts      (Validación de entrada)
  └── pages/
      └── LoginPage.tsx      (Actualizado para usar nuevo backend)
```

### Configuración
```
prisma/
  └── schema.prisma          (Modelo de usuario actualizado)

.env.local                    (Variables de entorno agregadas)
package.json                  (Dependencias nuevas)
SECURITY.md                   (Documentación de seguridad)
setup.bat                     (Script de instalación)
```

## 🚀 Instalación Rápida

### Opción 1: Script Automático (Windows)
```bash
.\setup.bat
```

### Opción 2: Manual

1. **Instalar dependencias**
```bash
npm install
```

2. **Generar cliente Prisma**
```bash
npx prisma generate
```

3. **Crear base de datos y migraciones**
```bash
npx prisma migrate dev --name init
```

## 🏃 Ejecutar en Desarrollo

### Opción A: Frontend y Backend por Separado

**Terminal 1 - Frontend:**
```bash
npm run dev
```
Accede a: http://localhost:5173

**Terminal 2 - Backend:**
```bash
npm run dev:server
```
Backend en: http://localhost:3000

### Opción B: Ambos Simultáneamente
```bash
npm run dev:all
```

## 🔑 Credenciales de Prueba

### Para Crear Cuenta:
- **Email**: ADMIN_EMAIL_AQUI
- **Contraseña**: Ri76180843$##NetBlack (Tiene mayúscula, minúscula y número)
- **Nombres**: Mizraim
- **Apellido Paterno**: Caldas
- **Apellido Materno**: Rojas
- **CIP**: 32263623

### Requisitos de Contraseña:
- ✅ Mínimo 8 caracteres
- ✅ Al menos una mayúscula (A-Z)
- ✅ Al menos una minúscula (a-z)
- ✅ Al menos un número (0-9)

## 🔍 Flujo de Autenticación

```
Usuario escribe credenciales
        ↓
Frontend valida formato básico
        ↓
Envía POST /api/auth/login con email y password
        ↓
Backend busca usuario en BD
        ↓
Backend verifica contraseña con Argon2
        ↓
Si válida: genera JWT y lo envía
        ↓
Frontend guarda token en localStorage
        ↓
Token se envía en cada request en header Authorization
```

## 📡 Endpoints API

### 1. Registro
```
POST /api/auth/register
Content-Type: application/json

{
  "email": "usuario@ejemplo.com",
  "password": "Password123",
  "nombres": "Juan",
  "apellidoPaterno": "Pérez",
  "apellidoMaterno": "García",
  "cip": "12345678"
}

Response 201:
{
  "message": "Usuario registrado exitosamente",
  "token": "JWT_TOKEN_EJEMPLO",
  "user": { ... }
}
```

### 2. Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "usuario@ejemplo.com",
  "password": "Password123"
}

Response 200:
{
  "message": "Inicio de sesión exitoso",
  "token": "JWT_TOKEN_EJEMPLO",
  "user": { ... }
}
```

### 3. Verificar Token
```
POST /api/auth/verify
Authorization: Bearer JWT_TOKEN_EJEMPLO

Response 200:
{
  "user": { ... }
}
```

## 🛡️ Características de Seguridad

### Hashing de Contraseña
- **Algoritmo**: Argon2id
- **Memoria**: 64MB
- **Iteraciones**: 3
- **Sin salt manual**: Argon2 lo hace automáticamente

### Validación
- Email válido (RFC 5322)
- Contraseña fuerte obligatoria
- Trim de espacios en blanco

### Prevención de Ataques
- ❌ SQL Injection: ORM Prisma (prepared statements)
- ❌ Password Spraying: Mensajes de error genéricos
- ❌ Timing Attacks: Argon2 es resistente
- ❌ XSS: React escapa contenido
- ❌ CSRF: CORS configurado

## 🔧 Variables de Entorno

Revisa `.env.local`:
```
JWT_SECRET=tu-secret-key-cambiar-en-produccion
DATABASE_URL=file:./prisma/dev.db
PORT=3000
CLIENT_URL=http://localhost:5173
```

**⚠️ En Producción:**
- Cambiar JWT_SECRET a algo aleatorio y fuerte
- Usar HTTPS obligatorio
- Configurar CORS solo para tu dominio
- Usar base de datos PostgreSQL en lugar de SQLite

## 📊 Base de Datos

La tabla `users` contiene:
```
id                TEXT (CUID único)
email             TEXT (único)
passwordHash      TEXT (Argon2 hash, nunca plain text)
name              TEXT (opcional)
apellidoPaterno   TEXT (opcional)
apellidoMaterno   TEXT (opcional)
cip               TEXT (opcional)
createdAt         DateTime
updatedAt         DateTime
```

## ✅ Checklist de Seguridad

- [x] Contraseñas hasheadas con Argon2
- [x] Validación de entrada fuerte
- [x] JWT para autenticación
- [x] CORS configurado
- [x] ORM previene SQL injection
- [x] Mensajes de error seguros
- [x] Tokens con expiración
- [x] Almacenamiento de token en localStorage
- [x] Endpoint de verificación

## 🚨 Problemas Comunes

### Error: "Cannot find module 'argon2'"
```bash
npm install argon2
```

### Error de Prisma
```bash
npx prisma generate
npx prisma migrate dev --name init
```

### Backend no responde
- Verifica que el puerto 3000 esté disponible
- Revisa que `npm run dev:server` esté ejecutándose
- Verifica `DATABASE_URL` en `.env.local`

## 📖 Documentación Adicional

Ver `SECURITY.md` para más detalles técnicos sobre seguridad.

## 🎯 Próximos Pasos (Opcional)

1. Refresh tokens para mayor seguridad
2. Two-factor authentication (2FA)
3. Email verification al registrarse
4. Rate limiting en endpoints
5. Recuperación de contraseña
6. Auditoría de intentos fallidos
