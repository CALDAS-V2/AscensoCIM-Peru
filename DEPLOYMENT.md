Deployment notes — Vercel frontend & Supabase DB

Overview
- Frontend: deploy the Vite React app to Vercel.
- Database & Auth: use Supabase (Postgres + Auth) for production.

Frontend (Vercel)
1. Push the repo to GitHub and connect the Vercel project.
2. In Vercel project settings > Environment Variables, add:
   - VITE_SUPABASE_URL
   - VITE_SUPABASE_ANON_KEY
   - VITE_API_URL (URL of your backend)
3. Set the Production Branch and deploy. Vite requires build-time env vars (VITE_ prefix).

Backend
1. Host the backend on a provider of your choice (Heroku, Render, Fly, Vercel Serverless, etc.).
2. In backend environment, set:
   - DATABASE_URL (use Supabase Postgres connection string)
   - SUPABASE_SERVICE_ROLE_KEY (server only)
   - CLIENT_URL (https://your-app.vercel.app)
   - EMAIL_USER / EMAIL_PASS
   - TWILIO_* vars
3. Run database migrations (Prisma): npx prisma migrate deploy

Supabase
1. Create a Supabase project and enable Auth/Policies.
2. Configure RLS policies and roles: ensure application enforces role checks and RLS restricts row access.
3. In Supabase Auth settings, add redirect URL: https://your-app.vercel.app/reset-password

Security reminders
- Do NOT place service role keys or other secrets in frontend env.
- Use Vercel secret environment variables and restrict access.

Testing flow after deploy
- Register -> becomes pending in DB
- Admin approves -> backend uses SUPABASE_SERVICE_ROLE_KEY to create Supabase user
- Supabase sends reset/confirm links to CLIENT_URL (ensure redirect configured)

If quieres, automatizo cambios en la configuración del backend para usar CLIENT_URL y DATABASE_URL en producción.