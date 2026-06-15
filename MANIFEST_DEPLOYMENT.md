📋 MANIFEST DE DEPLOYMENT - AscensoCIM Perú

═══════════════════════════════════════════════════════════════════════════════

INFORMACIÓN DEL PROYECTO

Nombre:                 AscensoCIM Perú
Tipo:                   React + Vite SPA (Single Page Application)
Autenticación:          Supabase Auth
Hosting:                Vercel (Planned)
Base de Datos:          Supabase (PostgreSQL)

═══════════════════════════════════════════════════════════════════════════════

CREDENCIALES Y CLAVES (SEGURAS)

Supabase Project ID:    Ascenso-CIM-peru
Supabase URL:           https://tu-proyecto.supabase.co
Supabase Anon Key:      TU_SUPABASE_ANON_KEY

Blink Project ID:       TU_BLINK_PROJECT_ID
Blink Public Key:       TU_BLINK_PUBLIC_KEY

Google AI API Key:      TU_GOOGLE_AI_API_KEY
reCAPTCHA Site Key:     TU_RECAPTCHA_SITE_KEY

Gmail:                  TU_EMAIL_USER@gmail.com
Gmail App Pass:         TU_EMAIL_APP_PASSWORD

═══════════════════════════════════════════════════════════════════════════════

ARCHIVOS CRÍTICOS

CÓDIGO:
  ✓ src/lib/supabase.ts           Cliente de Supabase
  ✓ src/lib/useAuth.ts            Hook de autenticación
  ✓ src/pages/RegisterPage.tsx    Registro
  ✓ src/pages/LoginPage.tsx       Login + Recovery
  ✓ src/App.tsx                   Protección de rutas

CONFIGURACIÓN:
  ✓ .env.local                    Variables de desarrollo
  ✓ vercel.json                   Config para Vercel
  ✓ package.json                  Scripts y dependencias
  ✓ vite.config.ts                Config de Vite

═══════════════════════════════════════════════════════════════════════════════

DEPENDENCIAS INSTALADAS

@supabase/supabase-js             v2.x (Cliente Supabase)
@blinkdotnew/sdk                  v2.5.0 (Blink SDK)
@blinkdotnew/ui                   v0.4.0 (UI Components)
react                             v18
react-hook-form                   v7.72.1
@tanstack/react-router            v1.168.21
vite                              v8.0.4
typescript                        ~6.0.2

═══════════════════════════════════════════════════════════════════════════════

FLUJO DE AUTENTICACIÓN

REGISTRO:
  1. Usuario completa RegisterPage
  2. Envía: email, password, nombres, apellidos, cip
  3. supabase.auth.signUp() crea cuenta
  4. Supabase envía email de confirmación
  5. Usuario confirma email
  6. ✅ Cuenta activada

LOGIN:
  1. Usuario ingresa email y password en LoginPage
  2. supabase.auth.signInWithPassword() verifica
  3. ✅ Sesión iniciada
  4. Token guardado automáticamente
  5. App redirige al dashboard

PROTECCIÓN:
  1. useAuth() hook verifica sesión al montar
  2. Si no hay usuario → Muestra LoginPageSimple
  3. Si hay usuario → Muestra DashboardLayout
  4. Todo reactivo en tiempo real

═══════════════════════════════════════════════════════════════════════════════

SCRIPTS DISPONIBLES

npm run dev              → Iniciar servidor de desarrollo (Vite)
npm run dev:server      → Iniciar servidor Express backend
npm run dev:all         → Ambos servidores simultáneamente
npm run build           → Compilar para producción
npm run preview         → Previsualizar build
npm run lint:types      → Verificar tipos TypeScript
npm run lint:js         → Verificar código JS/TS
npm run lint:css        → Verificar CSS

═══════════════════════════════════════════════════════════════════════════════

ESTRUCTURA DE CARPETAS

src/
├── lib/                 Librerías y utilidades
│   ├── supabase.ts     Cliente Supabase
│   ├── useAuth.ts      Hook de autenticación
│   └── ...otros
├── pages/              Páginas principales
│   ├── RegisterPage.tsx
│   ├── LoginPage.tsx
│   ├── HomePage.tsx
│   └── ...
├── components/         Componentes reutilizables
├── layouts/            Layouts
├── App.tsx            Componente principal
└── main.tsx           Punto de entrada

dist/                   Build compilado (generado)
public/                 Archivos estáticos

═══════════════════════════════════════════════════════════════════════════════

CHECKLIST DE DEPLOYMENT A VERCEL

ANTES:
  [ ] Código compilado: npm run build exitoso
  [ ] Git sincronizado: git push origin main
  [ ] Variables locales verificadas: .env.local correcto
  [ ] Build sin errores de TypeScript

DURANTE:
  [ ] Crear proyecto en Vercel Dashboard
  [ ] Conectar GitHub repository
  [ ] Agregar Environment Variables en Vercel
  [ ] Iniciar Deploy
  [ ] Esperar "✅ Live"

DESPUÉS:
  [ ] Copiar URL de Vercel (ej: ascensocim-peru.vercel.app)
  [ ] Ir a Supabase Dashboard
  [ ] Agregar URL en Authentication > URL Configuration
  [ ] Test de registro en producción
  [ ] Test de email de confirmación
  [ ] Verificar que sesión persiste

═══════════════════════════════════════════════════════════════════════════════

VARIABLES DE ENTORNO PARA VERCEL

PÚBLICAS (VITE_* - seguro compartir):
  VITE_SUPABASE_URL
  VITE_SUPABASE_ANON_KEY
  VITE_BLINK_PROJECT_ID
  VITE_BLINK_PUBLISHABLE_KEY
  VITE_GOOGLE_AI_API_KEY
  VITE_RECAPTCHA_SITE_KEY
  VITE_API_URL

PRIVADAS (No compartir):
  JWT_SECRET (Backend only)
  EMAIL_USER (Backend only)
  EMAIL_PASS (Backend only)

═══════════════════════════════════════════════════════════════════════════════

MONITOREO Y LOGS

En Vercel Dashboard:
  → Tu Proyecto
    → Deployments
      → [Último Deploy]
        → Logs (ver errores en tiempo real)

Logs útiles para buscar:
  - "Failed to fetch" → Variables de entorno incorrectas
  - "CORS" → Configuración de Supabase
  - "Email" → Problema con Supabase Auth
  - TypeScript errors → Errores de compilación

═══════════════════════════════════════════════════════════════════════════════

ESTADO ACTUAL (11 de junio de 2026)

✅ Migración a Supabase:         COMPLETADA
✅ Integración en código:         COMPLETADA
✅ Compilación:                  EXITOSA
✅ Variables de entorno:         CONFIGURADAS
✅ Vercel.json:                  CONFIGURADO
✅ Documentación:                COMPLETA (10 archivos)

ESTADO: 🟢 LISTO PARA PRODUCTION

═══════════════════════════════════════════════════════════════════════════════

DOCUMENTOS DE REFERENCIA

1. LISTO_PARA_USAR.txt
   └─ Guía rápida de Supabase (3 pasos)

2. VERCEL_QUICK_DEPLOY.md
   └─ Guía rápida de Vercel (5 minutos)

3. REFERENCIA_RAPIDA.md
   └─ Cheatsheet completo

4. CHECKLIST_VERCEL_DEPLOY.txt
   └─ Checklist pre-deployment

5. VERCEL_DEPLOY_GUIA.md
   └─ Guía completa de Vercel con troubleshooting

═══════════════════════════════════════════════════════════════════════════════

SOPORTE Y RECURSOS

Documentación Oficial:
  - Supabase: https://supabase.com/docs
  - Vercel: https://vercel.com/docs
  - Vite: https://vitejs.dev
  - React: https://react.dev

Dashboards:
  - Vercel: https://vercel.com/dashboard
  - Supabase: https://app.supabase.com

Comunidades:
  - Supabase Discord: discord.supabase.com
  - Vercel Discussions: github.com/vercel/vercel/discussions

═══════════════════════════════════════════════════════════════════════════════

NOTAS IMPORTANTES

⚠️ SEGURIDAD:
  - VITE_* variables son públicas (están en el navegador)
  - Nunca compartas JWT_SECRET o EMAIL_PASS
  - .env.local NO debe estar en Git
  - Verifica que .gitignore incluya .env.local

⚠️ SUPABASE REDIRECT URLs:
  - Sin esto, el email de confirmación no funciona
  - Actualiza después de cada deploy
  - Incluir: http://localhost:5173 (desarrollo) + Vercel URL

⚠️ RATE LIMITING:
  - Supabase tiene límites de requests
  - Vercel tiene límites de Serverless Functions
  - Verifica tus planes si tienes mucho tráfico

═══════════════════════════════════════════════════════════════════════════════

CRONOLOGÍA DEL PROYECTO

11-06-2026:
  - Identificado: "Failed to fetch" en registro
  - Implementado: Migración completa a Supabase Auth
  - Resultado: Sistema de autenticación profesional
  - Preparado: Documentación y guías de deployment

Estado: COMPLETADO Y LISTO PARA PRODUCCIÓN

═══════════════════════════════════════════════════════════════════════════════

Próximo Paso: Desplegar en Vercel siguiendo VERCEL_QUICK_DEPLOY.md

═══════════════════════════════════════════════════════════════════════════════
