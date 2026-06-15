# 🚀 GUÍA COMPLETA: DESPLEGAR A VERCEL

## ✅ Requisitos Previos

- [x] Código subido a GitHub
- [x] Variables de entorno configuradas (.env.local)
- [x] Build exitoso (`npm run build`)
- [x] Cuenta en Vercel (vercel.com)
- [x] Supabase Auth configurado

---

## 📋 PASO 1: Preparar el Repositorio (GitHub)

### Opción A: Si aún NO has subido a GitHub

```bash
# Inicializar git
git init

# Agregar archivos
git add .

# Commit inicial
git commit -m "Migración a Supabase Auth - Listo para Vercel"

# Crear repositorio en GitHub (manualmente en github.com)
# Luego:
git remote add origin https://github.com/TU_USUARIO/AscensoCIM-Peru.git
git branch -M main
git push -u origin main
```

### Opción B: Si ya tienes GitHub

```bash
# Actualizar cambios
git add .
git commit -m "Migración a Supabase Auth"
git push origin main
```

---

## 🔑 PASO 2: Configurar Variables de Entorno en Vercel

### Método 1: Desde la Dashboard de Vercel (Recomendado)

**2.1** Accede a: https://vercel.com/dashboard

**2.2** Haz click en "Add New" → "Project"

**2.3** Conecta tu repositorio GitHub
   - Selecciona tu GitHub account
   - Busca "AscensoCIM-Peru"
   - Haz click en "Import"

**2.4** Configura el proyecto
   - Framework: Vite ✅ (Vercel lo detecta automáticamente)
   - Build Command: `npm run build` ✅ (Vercel lo detecta automáticamente)
   - Output Directory: `dist` ✅ (Vercel lo detecta automáticamente)

**2.5** Agregar variables de entorno
   - Haz click en "Environment Variables"
   - Agrega estas variables:

```
VITE_SUPABASE_URL = https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY = TU_SUPABASE_ANON_KEY
VITE_BLINK_PROJECT_ID = Ascenso-CIM-peru-j5fiy70j
VITE_BLINK_PUBLISHABLE_KEY = TU_BLINK_PUBLISHABLE_KEY
VITE_GOOGLE_AI_API_KEY = TU_GOOGLE_AI_API_KEY
VITE_RECAPTCHA_SITE_KEY = TU_RECAPTCHA_SITE_KEY
VITE_API_URL = https://tu-dominio-produccion.com
```

⚠️ **IMPORTANTE**: Las variables que empiezan con `VITE_` son públicas (seguras de compartir)

**2.6** Haz click en "Deploy"

---

## 🌐 PASO 3: Configurar URL de Redirección en Supabase

**Muy importante para que funcione el email de confirmación**

**3.1** Ve a: https://app.supabase.com

**3.2** Selecciona tu proyecto: "Ascenso-CIM-peru"

**3.3** Ir a: **Authentication** > **URL Configuration**

**3.4** En "Redirect URLs", agrega tu URL de Vercel:
```
https://tu-proyecto.vercel.app
```

Vercel te mostrará el dominio después del deploy. Por ahora puedes:
- Usar el dominio temporal que Vercel genera
- O esperar a obtener tu dominio personalizado

**3.5** Haz click en "Save"

---

## 📊 PASO 4: Esperando el Deploy

Vercel mostrará el progreso:

1. **Building** → Compilando tu código
2. **Analyzing** → Optimizando
3. **Uploading** → Subiendo a servidores
4. **Live** → ✅ ¡Listo!

Toma aproximadamente **2-5 minutos**

---

## ✅ PASO 5: Verificar que Funciona

### Accede a tu dominio

Una vez que Vercel dice "Live", tu app está en:
```
https://tu-proyecto.vercel.app
```

Vercel te enviará un email con el link exacto.

### Prueba el registro

1. Abre tu dominio de Vercel
2. Intenta registrarte con un email de prueba
3. Revisa tu email (busca en spam)
4. Haz click en el link de confirmación de Supabase
5. Inicia sesión

✅ Si funciona → **¡LISTO!**

---

## 🔄 PASO 6: Actualizar URL en Supabase (Opcional)

Si quieres usar un dominio personalizado:

**6.1** En Vercel:
- Haz click en tu proyecto
- Settings → Domains
- Agrega tu dominio personalizado (ej: ascensocim.com)

**6.2** En Supabase:
- Authentication > URL Configuration
- Agrega tu nuevo dominio:
```
https://ascensocim.com
https://www.ascensocim.com
```

---

## 🚨 Problemas Comunes y Soluciones

### ❌ "Failed to fetch" en Vercel

**Causa 1**: Variables de entorno no configuradas
```
Solución: Verifica que VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY 
estén en Vercel Settings > Environment Variables
```

**Causa 2**: URL de redirección no configurada en Supabase
```
Solución: Ve a Supabase > Authentication > URL Configuration
Agrega tu URL de Vercel (ej: https://tu-proyecto.vercel.app)
```

**Causa 3**: CORS bloqueado
```
Solución: No debería pasar con Supabase, pero verifica que:
- VITE_SUPABASE_URL sea correcto (sin /rest/v1/)
- VITE_SUPABASE_ANON_KEY sea la key pública
```

### ❌ "Email not found" en Supabase

**Causa**: La URL de redirección en Supabase no está actualizada

```
Solución:
1. Copia el dominio de Vercel (ej: https://ascensocim-peru.vercel.app)
2. Ve a Supabase > Authentication > URL Configuration
3. Agrega el dominio en "Redirect URLs"
4. Guarda
5. Intenta registrarte de nuevo
```

### ❌ "Build failed"

**Causa**: Error de compilación TypeScript

```
Solución:
1. En tu máquina, ejecuta: npm run build
2. Copia el error exacto
3. Búscalo en los archivos de tu proyecto
4. Arréglalo localmente
5. Haz git push de nuevo
6. Vercel rebuild automáticamente
```

### ❌ El build toma mucho tiempo

**Causa**: Node_modules grande o muchas dependencias

```
Solución:
1. No hay mucho que hacer aquí
2. Vercel cachea las dependencias en deploys posteriores
3. Los siguientes deploys serán más rápidos
```

---

## 📱 Testing en Producción

### Checklist

- [ ] Página carga sin errores
- [ ] Puedo ver pantalla de login
- [ ] Registro funciona
- [ ] Recibo email de confirmación
- [ ] Email confirmation link funciona
- [ ] Puedo iniciar sesión
- [ ] Estoy dentro del dashboard
- [ ] Puedo cerrar sesión
- [ ] Password recovery funciona
- [ ] La sesión persiste al recargar

---

## 🔐 SEGURIDAD

### Checklist

- [x] VITE_SUPABASE_ANON_KEY es pública (está en el cliente)
- [x] No exponer JWT_SECRET en variables públicas
- [x] CORS configurado en Supabase
- [x] Email de confirmación habilitado
- [x] HTTPS automático en Vercel ✅

---

## 📈 Monitoreo Después del Deploy

### Acceso a logs

**En Vercel:**
```
Tu Proyecto → Deployments → [Último deploy] → Logs
```

Ver logs en tiempo real de errores de la app.

### Alerts

Vercel te enviará notificaciones si:
- Build falla
- Deploy se completa
- Errores en la app

---

## 🔄 Actualizaciones Futuras

### Para actualizar tu app en Vercel

```bash
# 1. Haz cambios localmente
# 2. Commit
git add .
git commit -m "Descripción del cambio"

# 3. Push
git push origin main

# 4. Vercel rebuild automáticamente
# 5. Accede a tu dominio para ver cambios
```

¡Vercel redeploy automáticamente cada vez que haces push!

---

## 💡 Tips Pro

### Usar un dominio personalizado gratis

Opciones:
- Registrar en Namecheap (~$1.50/año)
- Registrar en Name.com
- Usar subdomain gratuito (tu-app.vercel.app)

### CI/CD automático

Vercel redeploy automáticamente cuando haces push a main:
```
GitHub push → Vercel detecta → Build → Deploy → Live
```

### Preview Deployments

Cuando haces pull request:
- Vercel automáticamente crea un deploy de preview
- Puedes testear antes de mergear
- Muy útil para colaboración

---

## 📞 Soporte

- **Vercel Docs**: https://vercel.com/docs
- **Supabase Docs**: https://supabase.com/docs
- **Chat Vercel**: support.vercel.com
- **Status Page**: status.vercel.com

---

## ✅ Resumen

```
1. GitHub repository ✅ (Requerido)
2. Vercel account ✅ (Requerido)
3. Conectar GitHub a Vercel ✅
4. Agregar variables de entorno ✅
5. Deploy ✅
6. Actualizar URLs en Supabase ✅
7. Test en producción ✅
8. ¡LISTO! 🎉
```

---

## 🎉 ¡LISTO PARA PRODUCCIÓN!

Tu app está ahora desplegada en Vercel y usando Supabase Auth profesional.

**Próximos pasos:**
1. Comparte el link con usuarios
2. Monitorea logs en Vercel
3. Configura dominio personalizado (opcional)
4. Configura analytics (opcional)

---

*Guía de Vercel - AscensoCIM Perú*
*Actualizado: 11 de junio de 2026*
