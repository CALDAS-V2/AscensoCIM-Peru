# 🚀 DEPLOYMENT A VERCEL - GUÍA RÁPIDA

Tu aplicación está lista para desplegar. Sigue estos 4 pasos en orden.

---

## PASO 1: GITHUB (Sube tu código)

### Si NO tienes repositorio en GitHub:

1. Abre: https://github.com/new
2. Nombre del repo: `AscensoCIM-Peru`
3. Descripción: `Aplicación de exámenes y capacitación`
4. Selecciona: **Public** (para que Vercel pueda acceder)
5. Click: **Create repository**

6. GitHub te mostrará instrucciones. En tu terminal (o Git Bash), ejecuta:

```bash
cd 'd:\AscensoCIM Peru'
git init
git add .
git commit -m "Supabase Auth migration + Vercel ready"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/AscensoCIM-Peru.git
git push -u origin main
```

**⚠️ Reemplaza `TU_USUARIO` con tu usuario de GitHub**

### Si YA tienes repositorio en GitHub:

```bash
cd 'd:\AscensoCIM Peru'
git add .
git commit -m "Supabase Auth migration + Vercel ready"
git push
```

---

## PASO 2: VERCEL (Conecta tu repositorio)

1. Abre: https://vercel.com
2. Click: **Log in with GitHub** (si no tienes cuenta, crea una primero)
3. Click: **Add New** → **Project**
4. Busca y selecciona: `AscensoCIM-Peru`
5. Click: **Import**

**Configuración (aparecerá automáticamente):**
- Framework: Vite ✓ (automático)
- Build Command: `npm run build` ✓ (automático)
- Output Directory: `dist` ✓ (automático)

6. Click: **Deploy**

⏳ Espera a que diga "✓ Production" (toma ~2 minutos)

---

## PASO 3: AÑADIR VARIABLES DE ENTORNO EN VERCEL

Vercel necesita tus variables de Supabase. Aquí están tus credenciales:

```
VITE_SUPABASE_URL = https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY = TU_SUPABASE_ANON_KEY
VITE_BLINK_PROJECT_ID = Ascenso-CIM-peru-j5fiy70j
VITE_BLINK_PUBLISHABLE_KEY = TU_BLINK_PUBLISHABLE_KEY
VITE_RECAPTCHA_SITE_KEY = TU_RECAPTCHA_SITE_KEY
```

### Cómo agregarlas en Vercel:

1. En Vercel Dashboard, selecciona tu proyecto
2. Click: **Settings**
3. Click: **Environment Variables**
4. Para cada variable arriba:
   - Nombre: `VITE_SUPABASE_URL`
   - Valor: `https://tu-proyecto.supabase.co`
   - Click: **Add**
5. Repite para todas las variables
6. Click: **Save**

Vercel re-deployará automáticamente (~2 min)

---

## PASO 4: ACTUALIZAR REDIRECT URLs EN SUPABASE

⚠️ **IMPORTANTE**: Sin este paso, email confirmation NO funcionará

1. Abre: https://app.supabase.com
2. Selecciona proyecto: **Ascenso-CIM-peru**
3. Menú izquierdo: **Authentication**
4. Click: **URL Configuration**
5. En el campo "Redirect URLs", agrega estas líneas (una por línea):

```
https://ascensocim-peru.vercel.app
https://ascensocim-peru.vercel.app/auth/callback
https://ascensocim-peru.vercel.app/login
```

**⚠️ Reemplaza `ascensocim-peru` con el nombre que Vercel te asignó**

6. Click: **Save**

---

## ✅ ¡LISTO! Tu app está VIVA

Vercel te asigna una URL automáticamente. Visita:

```
https://ascensocim-peru.vercel.app
```

(El nombre depende de cómo nombraste el repo y del settings de Vercel)

---

## 🧪 Prueba tu app

1. **Registro**: Haz clic en "Registrarse"
   - Ingresa email y contraseña
   - Verifica el email (revisa spam si no llega)
   - Confirma y login
   
2. **Login**: Prueba las credenciales creadas

3. **Recovery**: Prueba "¿Olvidaste tu contraseña?"

---

## 🆘 Si algo falla

### "Build failed"
→ Ve a VERCEL_DEPLOY_GUIA.md sección "Solucionar Build Errors"

### "Email no llega"
→ Verifica Redirect URLs en Supabase (PASO 4)
→ Revisa carpeta de SPAM

### "Failed to fetch"
→ Verifica que VITE_SUPABASE_URL sea correcta
→ Verifica Environment Variables en Vercel

---

## 📚 Documentos de referencia

- `MANIFEST_DEPLOYMENT.md` - Todas tus credenciales centralizadas
- `VERCEL_DEPLOY_GUIA.md` - Troubleshooting completo
- `REFERENCIA_RAPIDA.md` - Cheatsheet de 3 pasos

---

## 🎉 Resultado final

✅ Aplicación en PRODUCCIÓN
✅ Autenticación segura con Supabase
✅ Dominio profesional (vercel.app)
✅ Deploy automático desde GitHub
✅ HTTPS automático

**Tu aplicación está lista para usuarios reales.**
