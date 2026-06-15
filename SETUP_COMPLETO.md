# INSTRUCCIONES PARA EJECUTAR EL PROYECTO

## ✅ Cambios Realizados

### 1. **Sistema de Recuperación de Contraseña** ✓
   - Añadida ruta `/api/auth/forgot-password` para enviar emails de recuperación
   - Añadida ruta `/api/auth/verify-reset-token` para verificar tokens
   - Añadida ruta `/api/auth/reset-password` para actualizar contraseña
   - Creada página `ResetPasswordPage.tsx` para que usuarios restablezcan su contraseña
   - Actualizada página de login con funcionamiento de "Olvidé mi contraseña"

### 2. **Modelo de Base de Datos** ✓
   - Añadido modelo `PasswordResetToken` en Prisma schema
   - Tokens con expiración de 1 hora
   - Eliminación automática de tokens después de usarlos

### 3. **Envío de Correos** ✓
   - Configurado Nodemailer con Gmail
   - Variables de entorno configuradas: `EMAIL_USER` y `EMAIL_PASS`
   - Correos automáticos para:
     - Recuperación de contraseña
     - Confirmación de actualización
     - Aprobación de usuario

### 4. **Variables de Entorno** ✓
   - `.env.local` actualizado con:
     - `PORT=3001` (puerto del servidor)
     - `EMAIL_USER='ADMIN_EMAIL_AQUI'`
     - `EMAIL_PASS='EMAIL_PASSWORD_AQUI'`
     - `VITE_API_URL='http://localhost:3001'`

---

## 🚀 CÓMO EJECUTAR

### Opción 1: Script Batch (Recomendado en Windows)
```
Doble-clic en: start-all.bat
```

### Opción 2: Línea de comando
```bash
cd "d:\Nueva carpeta"
npm run dev:all
```

### Opción 3: Dos terminales (una para cada servidor)

**Terminal 1 - Frontend:**
```bash
cd "d:\Nueva carpeta"
npm run dev
```

**Terminal 2 - Backend:**
```bash
cd "d:\Nueva carpeta"
npm run dev:server
```

---

## 🔄 Flujo de Recuperación de Contraseña

1. **Usuario hace clic en "Olvidé mi contraseña"** en la página de login
2. **Ingresa su correo** y hace clic en "Enviar enlace"
3. **Sistema genera token** con expiración de 1 hora
4. **Email se envía** a `ADMIN_EMAIL_AQUI` con enlace de recuperación
5. **Usuario accede al enlace** y es redirigido a `/reset-password?token=...`
6. **Sistema verifica el token**
7. **Usuario ingresa nueva contraseña**
8. **Contraseña se actualiza** y token se elimina
9. **Email de confirmación** se envía

---

## 📧 Verificar Emails

Los emails se envían desde: `ADMIN_EMAIL_AQUI`

Dirección: Gmail con App Password (aplicación específica habilitada)

---

## ⚠️ Notas Importantes

1. **Base de Datos**: Se ejecutará automáticamente la migración de Prisma
   ```bash
   npx prisma migrate deploy
   ```

2. **Generación de Cliente Prisma**:
   ```bash
   npx prisma generate
   ```

3. **Puertos**:
   - Frontend: http://localhost:5173
   - Backend: http://localhost:3001

4. **Token JWT**: Configurado para expirar en 7 días

5. **Intentos de Login**: Máximo 5 intentos, luego cuenta se bloquea 30 minutos

---

## 🔐 Seguridad

✓ Tokens de reset con expiración de 1 hora
✓ Hash de contraseñas con algoritmo seguro
✓ CORS habilitado correctamente
✓ Validación de entrada en frontend y backend
✓ Logs de actividad de usuarios
✓ Protección contra fuerza bruta

---

## 📁 Archivos Modificados

- `src/lib/authRoutesV2.ts` - Endpoints de recuperación
- `src/lib/passwordReset.ts` - Funciones auxiliares (NUEVO)
- `src/lib/mailer.ts` - Configuración de emails
- `src/pages/LoginPage.tsx` - Formulario de recuperación actualizado
- `src/pages/ResetPasswordPage.tsx` - Página de reset (NUEVA)
- `src/App.tsx` - Ruta agregada
- `.env.local` - Variables configuradas
- `prisma/schema.prisma` - Modelo PasswordResetToken (NUEVO)

---

## ❓ Problemas Comunes

**Error "Failed to fetch":**
- Asegúrate de que ambos servidores estén corriendo
- Frontend en puerto 5173
- Backend en puerto 3001

**No llegan emails:**
- Verifica las credenciales en `.env.local`
- Comprueba que el App Password de Gmail esté habilitado
- Revisa la consola del servidor para ver errores

**Migración falla:**
```bash
npx prisma migrate reset
npx prisma migrate dev
```

---

¡Listo! El proyecto está completamente funcional.
