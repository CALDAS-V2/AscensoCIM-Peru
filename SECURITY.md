# 🔐 Sistema de Autenticación Seguro

## Características de Seguridad Implementadas

### 1. **Hash de Contraseñas con Argon2**
- Algoritmo **Argon2id**: Resistente a ataques GPU y timing attacks
- Parámetros seguros:
  - **Memoria**: 64MB (2^16)
  - **Iteraciones**: 3 (time cost)
  - **Paralelismo**: 1 thread
- Almacenamiento: Solo se guardan los hashes, nunca las contraseñas en texto plano

### 2. **Validación Rigurosa de Contraseñas**
- Mínimo 8 caracteres
- Debe contener:
  - Letras mayúsculas
  - Letras minúsculas
  - Números
- Validación de email RFC 5322

### 3. **JWT (JSON Web Tokens)**
- Tokens con expiración de 7 días
- Secret configurado via `JWT_SECRET` (usar variable de entorno en producción)
- Verificación automática en cada request

### 4. **Protección Contra Ataques Comunes**

#### SQL Injection
- ✅ Usando ORM Prisma (prepared statements automáticos)

#### Password Spraying
- ✅ Mensajes de error genéricos ("Correo o contraseña incorrectos")
- ✅ No se revela si el email existe

#### Timing Attacks
- ✅ Argon2 es resistente
- ✅ Mensajes de error consistentes

#### XSS (Cross-Site Scripting)
- ✅ React escapa automáticamente el contenido
- ✅ Inputs con type específico (email, password)

#### CSRF (Cross-Site Request Forgery)
- ✅ CORS configurado correctamente
- ✅ Requiere headers específicos

## 🚀 Uso

### Instalación
```bash
npm install
```

### Ejecutar en Desarrollo
```bash
# Terminal 1: Frontend (Vite)
npm run dev

# Terminal 2: Backend (Node.js)
npm run dev:server

# O ambos simultáneamente
npm run dev:all
```

### Migraciones de Base de Datos
```bash
# Crear/ejecutar migraciones
npm run prisma:migrate

# Generar cliente de Prisma
npm run prisma:generate
```

## 📡 API Endpoints

### POST /api/auth/register
Registrar un nuevo usuario
```json
{
  "email": "usuario@ejemplo.com",
  "password": "Password123",
  "nombres": "Juan",
  "apellidoPaterno": "Pérez",
  "apellidoMaterno": "García",
  "cip": "12345678"
}
```

### POST /api/auth/login
Iniciar sesión
```json
{
  "email": "usuario@ejemplo.com",
  "password": "Password123"
}
```

**Respuesta exitosa:**
```json
{
  "message": "Inicio de sesión exitoso",
  "token": "JWT_TOKEN_EJEMPLO",
  "user": {
    "id": "cuid...",
    "email": "usuario@ejemplo.com",
    "name": "Juan",
    "apellidoPaterno": "Pérez",
    "apellidoMaterno": "García",
    "cip": "12345678"
  }
}
```

### POST /api/auth/verify
Verificar token JWT
```json
{
  "Authorization": "Bearer JWT_TOKEN_EJEMPLO"
}
```

## 🔧 Variables de Entorno

```env
# Backend
PORT=3000
JWT_SECRET=tu-secret-key-seguro-y-largo
DATABASE_URL="file:./dev.db"
CLIENT_URL="http://localhost:5173"

# Frontend
VITE_API_URL="http://localhost:3000"
```

## 📝 Mejoras Futuras

- [ ] Implementar refresh tokens
- [ ] Rate limiting en endpoints
- [ ] Two-factor authentication (2FA)
- [ ] Recuperación de contraseña segura
- [ ] Logout desde todas las sesiones
- [ ] Auditoría de intentos de login fallidos
- [ ] HTTPS obligatorio en producción
- [ ] Email verification

## ⚠️ Notas de Seguridad

1. **Cambiar JWT_SECRET en producción**: Usar un secret fuerte y aleatorio
2. **HTTPS obligatorio**: Nunca enviar tokens por HTTP en producción
3. **Database backups**: Implementar backups regulares
4. **Rate limiting**: Considerar agregarlo para endpoints de auth
5. **CORS restrictivo**: En producción, especificar origen exacto

## 🛡️ Tecnologías Seguras Utilizadas

- **Argon2**: Hashing moderno y seguro
- **JWT**: Estándar industria para tokens
- **Prisma**: ORM que previene SQL injection
- **Express**: Framework con soporte de seguridad
- **CORS**: Protección contra ataques cross-origin
