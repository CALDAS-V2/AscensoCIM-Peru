# 🎯 REFERENCIA RÁPIDA - SUPABASE + VERCEL

## 📌 Tu Situación Actual

```
✅ Problema original: "Failed to fetch" → SOLUCIONADO
✅ Solución: Migración a Supabase Auth → COMPLETADA
✅ Próximo paso: Desplegar en Vercel → LISTO
```

---

## 🚀 Vercel en 3 Pasos

### PASO 1: GitHub
```powershell
cd 'd:\AscensoCIM Peru'
git init
git add .
git commit -m 'Supabase Auth'
git remote add origin https://github.com/TU_USUARIO/AscensoCIM-Peru.git
git push -u origin main
```

### PASO 2: Vercel Dashboard
```
1. https://vercel.com
2. "Add New" → "Project"
3. Selecciona tu repo
4. Vercel detecta automáticamente
```

### PASO 3: Variables + Deploy
```
En Vercel Dashboard:
- Environment Variables
- Agregar: VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY
- Click "Deploy"
- Espera 2-5 minutos
```

---

## 🔑 Variables para Vercel

Copia estas variables en Vercel Dashboard:

```
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=TU_SUPABASE_ANON_KEY
VITE_BLINK_PROJECT_ID=TU_BLINK_PROJECT_ID
VITE_BLINK_PUBLISHABLE_KEY=TU_BLINK_PUBLISHABLE_KEY
VITE_GOOGLE_AI_API_KEY=TU_GOOGLE_AI_API_KEY
VITE_RECAPTCHA_SITE_KEY=TU_RECAPTCHA_SITE_KEY
VITE_API_URL=https://tu-dominio.com
```

---

## ⚠️ Paso Importante: Supabase Dashboard

Después de que Vercel diga "✅ Live":

```
1. https://app.supabase.com
2. "Ascenso-CIM-peru"
3. Authentication > URL Configuration
4. Agrega tu URL de Vercel en "Redirect URLs"
5. Save
```

**SIN ESTE PASO**: El email de confirmación NO funcionará

---

## 📚 Documentación

| Archivo | Propósito |
|---------|-----------|
| VERCEL_QUICK_DEPLOY.md | Guía rápida (5 min) |
| VERCEL_DEPLOY_GUIA.md | Guía completa |
| CHECKLIST_VERCEL_DEPLOY.txt | Checklist pre-deploy |
| LISTO_PARA_USAR.txt | Supabase rápido |
| SUPABASE_CONFIG.md | Config de Supabase |

---

## 🧪 Test Después del Deploy

```
✓ Abre tu URL de Vercel
✓ Registra usuario
✓ Confirma email
✓ Inicia sesión
✓ Accede al dashboard
✓ Cierra sesión
```

---

## 🚨 Si Algo Falla

| Problema | Solución |
|----------|----------|
| "Failed to fetch" | Verifica variables en Vercel |
| Email no llega | Actualiza URLs en Supabase |
| Build failed | Ejecuta `npm run build` localmente |
| 404 | Vercel recarga automáticamente |

---

## 📞 Links Útiles

- Vercel Dashboard: https://vercel.com/dashboard
- Supabase Dashboard: https://app.supabase.com
- Vercel Logs: Tu Proyecto > Deployments > [Última] > Logs

---

## ✅ Checklist Final

- [ ] Código en GitHub
- [ ] Vercel conectado
- [ ] Variables de entorno agregadas
- [ ] Deploy completado
- [ ] URLs actualizadas en Supabase
- [ ] Test de registro funciona
- [ ] Email de confirmación funciona

---

## 🎉 ¡LISTO!

Tu app está en producción con:
- ✅ Supabase Auth seguro
- ✅ Deploy automático desde GitHub
- ✅ HTTPS gratuito
- ✅ Sin "Failed to fetch"

---

*Última actualización: 11 de junio de 2026*
