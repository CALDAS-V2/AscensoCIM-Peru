# 🚀 DESPLEGAR A VERCEL - GUÍA RÁPIDA Y FÁCIL

Tu proyecto está listo. Aquí está la forma **MÁS RÁPIDA** de desplegarlo en Vercel.

---

## ⚡ OPCIÓN 1: Desde la Web de Vercel (RECOMENDADO - 5 minutos)

### Paso 1: Prepara GitHub

En PowerShell:
```powershell
cd 'd:\AscensoCIM Peru'
git init
git config user.name "Tu Nombre"
git config user.email "tu@email.com"
git add .
git commit -m "Migración a Supabase Auth - Lista para Vercel"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/AscensoCIM-Peru.git
git push -u origin main
```

✅ Tu código está en GitHub

### Paso 2: Deploy en Vercel (Desde la Web)

1. Ve a: **https://vercel.com/**
2. Inicia sesión (o crea cuenta si no tienes)
3. Click en **"Add New"** → **"Project"**
4. Selecciona tu repositorio GitHub: **AscensoCIM-Peru**
5. Vercel detecta automáticamente:
   - ✅ Framework: Vite
   - ✅ Build Command: npm run build
   - ✅ Output Directory: dist

### Paso 3: Variables de Entorno (IMPORTANTE)

Antes de hacer Deploy, agrega las variables:

Haz click en **"Environment Variables"** y agrega:

```
VITE_SUPABASE_URL = https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY = TU_SUPABASE_ANON_KEY
VITE_BLINK_PROJECT_ID = Ascenso-CIM-peru-j5fiy70j
VITE_BLINK_PUBLISHABLE_KEY = TU_BLINK_PUBLISHABLE_KEY
VITE_GOOGLE_AI_API_KEY = TU_GOOGLE_AI_API_KEY
VITE_RECAPTCHA_SITE_KEY = TU_RECAPTCHA_SITE_KEY
VITE_API_URL = https://tu-dominio.com
```

### Paso 4: Deploy

1. Click en botón **"Deploy"**
2. Espera 2-5 minutos mientras Vercel compila
3. Verás: ✅ **Live**
4. Vercel te proporciona: `https://tu-proyecto.vercel.app`

✅ **¡TU APP ESTÁ EN VIVO!**

---

## ⚡ OPCIÓN 2: Desde CLI (Alternativa)

Si ya instalaste Vercel CLI:

```powershell
cd 'd:\AscensoCIM Peru'
vercel --prod --yes
```

---

## 🔑 PASO IMPORTANTE: Actualizar URLs en Supabase

Para que funcione el email de confirmación:

1. Ve a: **https://app.supabase.com**
2. Selecciona proyecto: **"Ascenso-CIM-peru"**
3. Ve a: **Authentication** > **URL Configuration**
4. Busca **"Redirect URLs"**
5. Agrega tu dominio de Vercel:
```
https://tu-proyecto.vercel.app
```
6. Click **"Save"**

⚠️ **IMPORTANTE**: Sin este paso, el email de confirmación no funcionará

---

## 🧪 TEST EN PRODUCCIÓN

Una vez desplegado:

1. Abre: `https://tu-proyecto.vercel.app`
2. Click en **"Registrar"**
3. Completa:
   - Email: test@ejemplo.com
   - Password: Test123!
   - Nombres: Test
   - Paterno: User
   - Materno: Test
   - CIP: 123456789
4. Click **"Crear cuenta"**
5. Revisa tu email (bandeja o spam)
6. Haz click en **"Confirm Email"**
7. Vuelve a la app
8. Inicia sesión: test@ejemplo.com / Test123!

✅ Si funciona → **¡LISTO!**

---

## 🔄 ACTUALIZAR EN EL FUTURO

Para actualizar tu app en Vercel:

```powershell
# 1. Haz cambios
# 2. Commit
git add .
git commit -m "Nueva feature"

# 3. Push
git push origin main

# 4. Vercel automáticamente:
#    - Detecta el push
#    - Compila
#    - Redeploy en 2-5 minutos
```

✅ **Vercel redeploy automáticamente cada push a main**

---

## 📊 Información Útil

### Dominio de Vercel
```
https://tu-proyecto.vercel.app
```

### Dashboard de Vercel
```
https://vercel.com/dashboard
```

### Ver Logs
En Vercel:
- Tu Proyecto → Deployments → [Último] → Logs

---

## 🚨 Problemas Frecuentes

### ❌ "Failed to fetch" en producción
→ Verifica que las variables de entorno estén correctas en Vercel

### ❌ Email de confirmación no llega
→ Actualiza las Redirect URLs en Supabase Dashboard

### ❌ Build falla
→ Ejecuta `npm run build` localmente
→ Arregla cualquier error
→ Haz git push de nuevo

---

## 🎉 ¡LISTO!

Tu app está en producción con:
- ✅ Supabase Auth profesional
- ✅ Deploy automático desde GitHub
- ✅ HTTPS seguro
- ✅ Escalable a millones de usuarios

**Próximos pasos:**
1. Comparte el link con usuarios
2. Configura un dominio personalizado (opcional)
3. Monitorea logs en Vercel (opcional)

---

*Guía de Vercel - AscensoCIM Perú*
*Actualizado: 11 de junio de 2026*
