# 🔴 PANTALLA BLANCA - DIAGNÓSTICO Y SOLUCIÓN

## Problema
Después de `vercel --prod`, la app muestra pantalla blanca en:
```
https://ascensosim-peru.vercel.app
```

## Causa Probable: 99%
**Variables de entorno NO agregadas en Vercel Dashboard**

Sin estas variables, Supabase URL y Keys no están disponibles, causando errores JavaScript.

---

## ✅ SOLUCIÓN (5 minutos)

### PASO 1: Verificar Error en Navegador

1. Abre: https://ascensosim-peru.vercel.app
2. Presiona: **F12** (DevTools)
3. Click: **Console**
4. Busca errores en ROJO

**Errores típicos:**
```
VITE_SUPABASE_URL is undefined
Cannot read property 'createClient' of undefined
VITE_SUPABASE_ANON_KEY is not defined
```

### PASO 2: Agregar Variables en Vercel (CRÍTICO)

1. Abre: https://vercel.com
2. Click proyecto: **ascensosim-peru**
3. Menú superior: **Settings**
4. Menú izquierdo: **Environment Variables**
5. Agrega estas variables (COPIA EXACTO):

```
Nombre: VITE_SUPABASE_URL
Valor: https://tu-proyecto.supabase.co

Nombre: VITE_SUPABASE_ANON_KEY
Valor: TU_SUPABASE_ANON_KEY

Nombre: VITE_BLINK_PROJECT_ID
Valor: Ascenso-CIM-peru-j5fiy70j

Nombre: VITE_BLINK_PUBLISHABLE_KEY
Valor: TU_BLINK_PUBLISHABLE_KEY

Nombre: VITE_RECAPTCHA_SITE_KEY
Valor: TU_RECAPTCHA_SITE_KEY
```

6. Click: **Save**
7. **Vercel automáticamente re-deployará** (~2 minutos)

### PASO 3: Esperar y Refrescar

Después de que Vercel re-deploy:

1. Vuelve a: https://ascensosim-peru.vercel.app
2. Presiona: **Ctrl+Shift+R** (borrar cache)
3. Abre DevTools (F12) → Console
4. **No debería haber errores rojos**

---

## Si Sigue sin Funcionar

### Problema: Logs de Vercel muestran otros errores

1. Vercel Dashboard → Deployments
2. Selecciona: Production (https://ascensosim-peru.vercel.app)
3. Click: **View Function Logs**
4. Busca errores

### Soluciones Adicionales

| Error | Solución |
|-------|----------|
| `Cannot find module` | `npm run build` localmente para verificar compilación |
| `CORS error` | Verificar Supabase CORS settings |
| `ReferenceError: X is not defined` | Verificar que variable esté en Vercel Environment Variables |

---

## Verificación de Funcionamiento

Después de que se vea la página:

✅ **Página de login debe aparecer**
✅ **Botón "Registrarse" debe funcionar**
✅ **Email debe ser enviado por Supabase**
✅ **Login debe permitir entrar después de confirmar**

---

## Resumen Rápido

| Paso | Acción | Tiempo |
|------|--------|--------|
| 1 | Abrir DevTools en app | 1 min |
| 2 | Agregar variables en Vercel | 2 min |
| 3 | Esperar re-deploy de Vercel | 2 min |
| 4 | Refrescar y verificar | 1 min |

**Total: ~6 minutos**

---

## ¿Todavía hay pantalla blanca?

Contacta con detalles:
- ¿Qué errores ves en Console (F12)?
- ¿Vercel Dashboard muestra un error en Logs?
- ¿Todas las 5 variables están en Environment Variables?
