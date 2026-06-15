# Migración a Supabase Auth ✅

## Cambios Realizados

1. **Instalado** `@supabase/supabase-js` - Cliente oficial de Supabase
2. **Creado** `src/lib/supabase.ts` - Cliente de Supabase inicializado
3. **Creado** `src/lib/useAuth.ts` - Hook para manejar autenticación
4. **Actualizado** `src/pages/RegisterPage.tsx` - Ahora usa `supabase.auth.signUp()`
5. **Actualizado** `src/pages/LoginPage.tsx` - Ahora usa `supabase.auth.signInWithPassword()`
6. **Actualizado** `src/App.tsx` - Verifica sesión con Supabase en lugar de localStorage

## Variables de Entorno Agregadas

```
VITE_SUPABASE_URL='https://tu-proyecto.supabase.co'
VITE_SUPABASE_ANON_KEY='TU_SUPABASE_ANON_KEY'
```

## Configuración Necesaria en Supabase Dashboard

### 1. Habilitar Email Authentication
- Ve a: **Authentication** > **Providers** > **Email**
- Asegúrate de que esté habilitado
- Configura el email sender (puede ser el default)

### 2. Configurar URL de Redirección
- Ve a: **Authentication** > **URL Configuration**
- En "Redirect URLs", agrega:
  - `http://localhost:5173` (desarrollo)
  - Tu URL de producción cuando lo deploys

### 3. Tabla de Usuarios Personalizada (Opcional)
Si quieres guardar campos adicionales (nombres, apellidos, CIP), crea una tabla:

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  apellido_paterno TEXT,
  apellido_materno TEXT,
  cip TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS (Row Level Security)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Permite que los usuarios vean su propia fila
CREATE POLICY "Users can view their own data" ON users
  FOR SELECT USING (auth.uid() = id);

-- Permite que los usuarios actualicen su propia fila
CREATE POLICY "Users can update their own data" ON users
  FOR UPDATE USING (auth.uid() = id);
```

## Cómo Funciona Ahora

### Registro
```
1. Usuario completa formulario en RegisterPage
2. Se llama a supabase.auth.signUp()
3. Supabase envía email de confirmación
4. Usuario confirma email
5. Cuenta está lista para usar
```

### Login
```
1. Usuario ingresa email y contraseña
2. Se llama a supabase.auth.signInWithPassword()
3. Si es correcto, Supabase retorna sesión
4. App redirige al dashboard
```

### Recuperación de Contraseña
```
1. Usuario ingresa email
2. Se llama a supabase.auth.resetPasswordForEmail()
3. Supabase envía email con link de reset
4. Usuario hace click y es redirigido a ResetPasswordPage
```

## Verificación de Sesión

El hook `useAuth()` hace lo siguiente:
- Obtiene la sesión actual cuando el componente monta
- Escucha cambios de autenticación en tiempo real
- Proporciona el usuario actual y funciones de logout

## Variables Globales

Ahora puedes acceder al usuario en cualquier componente usando:

```tsx
import { useAuth } from './lib/useAuth'

function MyComponent() {
  const { user, loading, logout } = useAuth()
  
  return (
    <div>
      {user && <p>Bienvenido {user.email}</p>}
      <button onClick={logout}>Salir</button>
    </div>
  )
}
```

## Próximos Pasos

1. ✅ Prueba el registro en http://localhost:5173/register
2. ✅ Revisa tu email para confirmar la cuenta
3. ✅ Prueba el login con tus credenciales
4. ⚠️ Actualiza cualquier componente que dependa de `localStorage.getItem('token')`
5. ⚠️ Actualiza el backend Express si aún lo necesitas para otras funciones

## Nota Importante

Ya no necesitas:
- El endpoint `/api/auth/register` en el servidor Express
- El endpoint `/api/auth/login` en el servidor Express
- El endpoint `/api/auth/forgot-password` en el servidor Express

Puedes mantener el servidor Express para otras funciones (IA, etc.), pero la autenticación ahora está completamente manejada por Supabase.

## Troubleshooting

Si ves "Failed to fetch":
1. Verifica que `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` estén correctos en `.env.local`
2. Reinicia el servidor Vite: `npm run dev`
3. Abre la consola (F12) para ver errores específicos
