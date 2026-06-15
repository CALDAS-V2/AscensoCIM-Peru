-- =====================================================
-- Supabase RLS Policies — AscensoCIM Perú
-- =====================================================
-- Las tablas del modelo Prisma (public.users, etc.) NO
-- necesitan RLS porque todo el acceso va por el backend
-- Express, no desde el cliente directamente.
--
-- Solo necesitas configurar:
--   1. Crea el proyecto en Supabase
--   2. Ve a Settings > Database > Connection string
--      Copia la URI postgres y pégala en DATABASE_URL
--   3. En SQL Editor, ejecuta los seed básicos:
-- =====================================================

-- Insertar roles por defecto
INSERT INTO public."Role" (id, name, description, "createdAt")
VALUES
  ('admin-role', 'admin', 'Administrador del sistema con acceso total', NOW()),
  ('user-role', 'usuario', 'Usuario estándar con acceso a módulos permitidos', NOW())
ON CONFLICT (name) DO NOTHING;

-- Insertar módulos por defecto
INSERT INTO public."Module" (id, name, slug, description, "createdAt")
VALUES
  ('mod-home', 'Home', 'home', 'Página principal', NOW()),
  ('mod-exam', 'Exam', 'exam', 'Sistema de exámenes', NOW()),
  ('mod-ia', 'IA', 'ia', 'Asistente de Inteligencia Artificial', NOW()),
  ('mod-infracciones', 'Infracciones', 'infracciones', 'Registro de infracciones', NOW()),
  ('mod-directorio', 'Directorio', 'directorio', 'Directorio de contactos', NOW()),
  ('mod-temarios', 'Temarios', 'temarios', 'Temarios y materiales', NOW()),
  ('mod-audio', 'Audio', 'audio', 'Biblioteca de audio', NOW()),
  ('mod-mapa', 'Mapa', 'mapa', 'Mapa interactivo', NOW()),
  ('mod-ayuda', 'Ayuda', 'ayuda', 'Centro de ayuda', NOW()),
  ('mod-practica', 'Práctica', 'practica', 'Ejercicios de práctica', NOW()),
  ('mod-admin-users', 'Admin Users', 'admin-users', 'Panel de administración de usuarios', NOW())
ON CONFLICT (slug) DO NOTHING;

-- Crear usuario admin por defecto
-- NOTA: Genera un hash real con: node -e "console.log(require('bcryptjs').hashSync('Admin123!', 10))"
INSERT INTO public."User" (id, email, "passwordHash", name, status, "roleId", "createdAt")
VALUES (
  'admin-user',
  'admin@ascensocim.com',
  'HASH_GENERADO_AQUI',  -- ← Reemplaza con el hash real
  'Administrador',
  'approved',
  'admin-role',
  NOW()
)
ON CONFLICT (email) DO NOTHING;
