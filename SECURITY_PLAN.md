# 🔒 Plan de Mejora de Seguridad Avanzada

## Visión General
Implementar un sistema de seguridad profesional **sin cambiar el diseño visual** de la aplicación.

## 📋 Requisitos a Implementar

### 1. Sistema de Aprobación de Usuarios
- ❌ Nuevos usuarios NO se registran automáticamente
- ✅ Quedan en estado **PENDIENTE**
- ✅ Admin debe aprobarlos explícitamente
- ✅ Estados: pendiente → aprobado / suspendido

### 2. Roles y Permisos
```
Estructura de Roles:
├── ADMIN
│   └── Acceso total a todo
├── SUPERVISOR
│   └── Ver reportes, gestionar usuarios
└── USUARIO
    └── Acceso limitado según módulos asignados
```

### 3. Control de Módulos
Permitir activar/desactivar módulos individuales:
- Inicio (Home)
- Simulador (Exam)
- IA
- Infracciones
- Directorio
- Temarios
- Audio
- Mapa
- Ayuda
- Práctica
- Administración

### 4. Protección de Rutas
- ✅ Verificar autenticación en backend
- ✅ Verificar permisos para cada módulo
- ✅ Bloquear acceso por URL directa
- ✅ Redirigir a login/error según corresponda

### 5. Seguridad Adicional
- ✅ Protección contra fuerza bruta (limitar intentos)
- ✅ Logs de actividad
- ✅ Sesiones seguras
- ✅ Validación backend completa
- ✅ Middleware de autenticación

---

## 🗄️ Cambios en Base de Datos

### Tabla: `User` (modificada)
```prisma
model User {
  id                String   @id @default(cuid())
  email             String   @unique
  passwordHash      String
  name              String?
  status            String   @default("pending")  // pending, approved, suspended
  roleId            String
  role              Role     @relation(fields: [roleId], references: [id])
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  lastLogin         DateTime?
  loginAttempts     Int      @default(0)
  lockedUntil       DateTime?
  
  // Relaciones
  permissions       Permission[]
  blockedModules    BlockedModule[]
  activityLogs      ActivityLog[]
  sessions          Session[]
}
```

### Nuevas Tablas

**Role**
- id, name (admin, supervisor, usuario), description

**Permission**
- id, userId, moduleId, canAccess (boolean)

**Module**
- id, name, slug, description

**BlockedModule**
- id, userId, moduleId, reason

**ActivityLog**
- id, userId, action, details, timestamp

**Session**
- id, userId, token, expiresAt, isActive

**BruteForceAttempt**
- id, email, attemptedAt, ip

---

## 🏗️ Arquitectura de Seguridad

### Backend
```
Middleware:
├── Autenticación (JWT)
│   └── Verificar token válido
├── Autorización (Permisos)
│   └── Verificar rol y módulos
└── Rate Limiting
    └── Bloquear fuerza bruta
```

### Frontend
```
Route Guards:
├── ProtectedRoute
│   └── Verificar autenticación + permisos
├── AdminRoute
│   └── Solo admin
└── ModuleRoute
    └── Verificar acceso a módulo específico
```

---

## 📝 Flujos de Negocio

### Flujo 1: Registro y Aprobación
```
Usuario intenta registrarse
        ↓
Validar datos (backend)
        ↓
Usuario creado en estado PENDIENTE
        ↓
Admin recibe notificación
        ↓
Admin entra a panel de administración
        ↓
Admin aprueba o rechaza
        ↓
Usuario recibe confirmación
        ↓
Si aprobado: Usuario puede login
Si rechazado: Usuario recibe email de rechazo
```

### Flujo 2: Login con Protección
```
Usuario intenta login
        ↓
Verificar email existe
        ↓
Verificar estado != SUSPENDED
        ↓
Verificar intentos fallidos < 5
        ↓
Validar contraseña (Argon2)
        ↓
Si falla: Incrementar intentos, bloquear tras 5 intentos
        ↓
Si válida: Resetear intentos, generar JWT, crear sesión
        ↓
Registrar en activity log
        ↓
Devolver token y datos usuario
```

### Flujo 3: Acceso a Módulo
```
Usuario intenta acceder a módulo
        ↓
Verificar autenticación (JWT)
        ↓
Verificar estado (aprobado)
        ↓
Verificar rol (permisos)
        ↓
Verificar módulo no bloqueado
        ↓
Si todo válido: Permitir acceso
Si falla: Devolver 403 Forbidden
```

---

## 🔄 Implementación por Fases

### Fase 1: Schema y Tablas Base ⏱️ ~2-3h
- [ ] Actualizar schema Prisma
- [ ] Crear migraciones
- [ ] Generar cliente Prisma

### Fase 2: Middleware de Autenticación ⏱️ ~1-2h
- [ ] Crear middleware JWT
- [ ] Crear middleware de permisos
- [ ] Crear middleware de rate limiting

### Fase 3: Endpoints de Seguridad ⏱️ ~2-3h
- [ ] Endpoints de roles/permisos
- [ ] Endpoint de aprobación admin
- [ ] Endpoints de activity logs
- [ ] Endpoints de módulos bloqueables

### Fase 4: Frontend Guards ⏱️ ~1-2h
- [ ] Crear componentes ProtectedRoute
- [ ] Actualizar router
- [ ] Mostrar/ocultar menú según permisos

### Fase 5: Testing y Refinamiento ⏱️ ~1-2h
- [ ] Probar flujos completos
- [ ] Verificar permisos funcionan
- [ ] Verificar logs se registran

---

## 💾 Opciones de Base de Datos

**Recomendado para Producción:**

### SQLite (Actual)
- ✅ Fácil para desarrollo
- ❌ No ideal para múltiples conexiones simultáneas
- ❌ Limitaciones en concurrencia

### PostgreSQL (Recomendado)
- ✅ Excelente concurrencia
- ✅ Tipos de datos avanzados
- ✅ Escalable
- ✅ ACID compliance

### MySQL
- ✅ Muy común
- ✅ Buen rendimiento
- ✅ Fácil de desplegar

**Para esta implementación mantendré SQLite en desarrollo, con capacidad de migrar a PostgreSQL**

---

## 🎯 Decisiones Arquitectónicas

### 1. Aprobación Manual (NO automática)
Por defecto, nuevos usuarios = PENDIENTE
```typescript
// Registro
const user = await prisma.user.create({
  status: 'pending'  // No 'approved'
})
```

### 2. Estados Simples
```
pending  → Esperando aprobación
approved → Puede hacer login
suspended → Bloqueado temporalmente
```

### 3. Bloqueo de Módulos
- No bloquear la cuenta, bloquear módulos específicos
- Permitir múltiples módulos bloqueados simultáneamente

### 4. Logs Detallados
Registrar:
- Login/logout
- Cambios de permisos
- Intentos fallidos
- Acceso denegado
- Admin actions

---

## 🚀 Stack Tecnológico

```
Backend:
├── Express.js (ya existe)
├── Prisma ORM (ya existe)
├── Argon2 (ya existe)
├── JWT (ya existe)
└── CORS (ya existe)

Frontend:
├── React Router v6 (ya existe)
├── TypeScript (ya existe)
├── localStorage para tokens
└── useAuth hook (mejorado)

Base de Datos:
├── SQLite (desarrollo)
└── PostgreSQL (producción ready)

Seguridad:
├── Argon2 para contraseñas
├── JWT con expiración
├── Rate limiting en backend
├── CORS restrictivo
├── Middleware de autenticación
└── Validación dual (front + back)
```

---

## 📊 Tablas Necesarias (SQL)

```sql
-- Existing: User, Exam, Question, Infraction

-- New:
CREATE TABLE Role (
  id CUID PRIMARY KEY,
  name VARCHAR(50) UNIQUE,
  description TEXT
);

CREATE TABLE Module (
  id CUID PRIMARY KEY,
  name VARCHAR(100) UNIQUE,
  slug VARCHAR(100) UNIQUE,
  description TEXT
);

CREATE TABLE Permission (
  id CUID PRIMARY KEY,
  userId CUID FK User,
  moduleId CUID FK Module,
  canAccess BOOLEAN
);

CREATE TABLE BlockedModule (
  id CUID PRIMARY KEY,
  userId CUID FK User,
  moduleId CUID FK Module,
  reason TEXT,
  blockedAt TIMESTAMP
);

CREATE TABLE ActivityLog (
  id CUID PRIMARY KEY,
  userId CUID FK User,
  action VARCHAR(100),
  details JSON,
  ipAddress VARCHAR(50),
  createdAt TIMESTAMP
);

CREATE TABLE Session (
  id CUID PRIMARY KEY,
  userId CUID FK User,
  token VARCHAR(500),
  expiresAt TIMESTAMP,
  isActive BOOLEAN
);

CREATE TABLE BruteForceAttempt (
  id CUID PRIMARY KEY,
  email VARCHAR(255),
  ipAddress VARCHAR(50),
  attemptedAt TIMESTAMP
);
```

---

## ✨ Diseño Visual

**⚠️ NO CAMBIAR:**
- Colores
- CSS
- Componentes UI
- Layout
- Tipografía
- Iconos
- Apariencia de botones/inputs

**LO QUE SI CAMBIA (Lógica):**
- Ruteo (pueden ver/no ver módulos)
- Permisos (puede/no puede acceder)
- Mensajes (basados en estado del usuario)
- Funcionalidad backend

---

## 📌 Prioridades

1. **CRÍTICO**: Schema + Tabla de usuarios mejorada
2. **CRÍTICO**: Middleware de autenticación
3. **ALTO**: Sistema de aprobación admin
4. **ALTO**: Protección de rutas
5. **MEDIO**: Rate limiting
6. **MEDIO**: Activity logs
7. **BAJO**: Refinamientos visuales

---

## 🛡️ Checklist de Seguridad

- [ ] Usuarios registran en estado PENDIENTE
- [ ] Admin tiene panel de aprobación
- [ ] Roles funcionan (admin, supervisor, usuario)
- [ ] Permisos por módulo implementados
- [ ] Módulos individuales pueden bloquearse
- [ ] Rutas protegidas en backend
- [ ] Rutas protegidas en frontend
- [ ] Rate limiting contra fuerza bruta
- [ ] Activity logs funcionan
- [ ] Sesiones se crean/limpian
- [ ] Mensajes de error seguros
- [ ] Tokens JWT con expiración
- [ ] Contraseñas hasheadas (Argon2)

---

## ⏰ Tiempo Estimado

Total: **8-12 horas de implementación**

Distribuido:
- Schema: 1-2h
- Middleware: 2-3h
- Endpoints: 3-4h
- Frontend: 1-2h
- Testing: 1-2h

