╔════════════════════════════════════════════════════════════════╗
║   👤 GUÍA COMPLETA: GESTIÓN DE USUARIOS COMO ADMINISTRADOR    ║
╚════════════════════════════════════════════════════════════════╝

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔑 PASO 1: CREAR TU USUARIO COMO ADMINISTRADOR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

IMPORTANTE: El PRIMER usuario registrado en el sistema debe ser 
tú (el administrador).

Pasos:
1. Abre: http://localhost:5173
2. Haz clic en "Crear Cuenta"
3. Completa los datos:
   • Email: tu-email@example.com
   • Contraseña: Tu segura (mín 8 caracteres)
   • Nombres: Tu nombre
   • Apellido Paterno: Tu apellido
   • Apellido Materno: Tu segundo apellido
   • CIP: Tu número de CIP

4. Haz clic en "Crear Cuenta"
5. ✅ Tu cuenta fue creada

IMPORTANTE: Este primer usuario será el ADMIN de todo el sistema.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 PASO 2: OTROS USUARIOS SE REGISTRAN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Cuando otra persona quiere acceder:

1. Ve a: http://localhost:5173
2. Haz clic en "Crear Cuenta"
3. Completa sus datos
4. Haz clic en "Crear Cuenta"
5. ✅ Su cuenta fue creada PERO con status: PENDING (Pendiente)

Lo que ve el usuario:
   "Tu cuenta está pendiente de aprobación por un administrador"

⚠️ NO PUEDE HACER LOGIN HASTA QUE TÚ (COMO ADMIN) LO APRUEBES

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔐 PASO 3: ACCEDER COMO ADMINISTRADOR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Para gestionar otros usuarios:

1. Haz login con TU usuario (el primer admin)
   • Email: tu-email@example.com
   • Contraseña: tu contraseña

2. Después de hacer login, verás el dashboard
3. En el menú lateral, busca: "Admin" o "Gestión de Usuarios"
4. Haz clic para abrir la página de administración

Verás una interfaz con:
   • Lista de usuarios pendientes de aprobación
   • Opción para aprobar o rechazar

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ PASO 4: APROBAR A UN USUARIO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

En la página de administración:

1. Busca el usuario que quieres aprobar
   • Verás su email, nombre, apellidos, CIP
   • Su status dice: "PENDING"

2. Haz clic en el botón: ✅ APROBAR
   (o el equivalente en la interfaz)

3. ✅ El usuario fue aprobado
   • Su status cambia a: "APPROVED"
   • Puede ahora hacer login normalmente

4. El usuario recibirá un email notificándole:
   "Tu cuenta fue aprobada correctamente"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
❌ PASO 5: RECHAZAR A UN USUARIO (Opcional)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Si no quieres aprobar a alguien:

1. En la página de administración
2. Busca el usuario
3. Haz clic en: ❌ RECHAZAR
4. ✅ La cuenta fue eliminada del sistema
   • No podrá hacer login
   • Debe registrarse de nuevo si lo desea

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔄 RESUMEN DEL FLUJO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. TÚ (Admin) creas tu cuenta
   Status: APPROVED (automáticamente, eres el primer usuario)

2. OTRO USUARIO intenta crear su cuenta
   Status: PENDING (espera aprobación)
   
3. TÚ (Admin) lo ves en tu panel de administración
   Estado: "Pendiente de aprobación"

4. TÚ haces clic en APROBAR
   Estado cambia a: "APPROVED"

5. OTRO USUARIO puede ahora hacer login
   Usa sus credenciales de registro

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👥 ESTADOS DE USUARIO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PENDING (Pendiente):
  • Usuario se registró
  • Espera aprobación del admin
  • NO PUEDE hacer login
  • Admin debe aprobarlo o rechazarlo

APPROVED (Aprobado):
  • Admin aprobó al usuario
  • PUEDE hacer login
  • PUEDE usar todas las funciones

SUSPENDED (Suspendido):
  • Admin suspendió la cuenta
  • NO PUEDE hacer login
  • Usuario no puede registrarse de nuevo

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📧 NOTIFICACIONES AUTOMÁTICAS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

El sistema envía emails automáticamente a:
ADMIN_EMAIL_AQUI

Cuando:
✅ Un usuario se registra (notificación al admin)
✅ Admin aprueba a un usuario (notificación al usuario)
✅ Admin rechaza a un usuario (notificación al usuario)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔐 SEGURIDAD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Solo el primer usuario es admin automáticamente
✅ Otros usuarios NO pueden ver el panel de admin
✅ Las contraseñas están hasheadas (no se pueden ver)
✅ Los logs registran todas las acciones del admin
✅ Las sesiones expiran cada 7 días

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🆘 PROBLEMAS COMUNES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❓ ¿No veo el botón de admin?
✓ Verifica que estés logueado con el PRIMER usuario
✓ El primer usuario es automáticamente admin
✓ Revisa el menú lateral/navegación

❓ ¿El usuario sigue en PENDING aunque lo aprobé?
✓ Recarga la página (F5)
✓ Verifica que haya un botón de APROBAR visible
✓ Haz clic en APROBAR (no otro botón)

❓ ¿El usuario dice que no puede hacer login?
✓ Verifica su status: APPROVED
✓ Verifica que su email esté correcto
✓ Revisa la consola del navegador (F12)

❓ ¿No reciben emails?
✓ Verifica que el correo va a: ADMIN_EMAIL_AQUI
✓ Revisa la bandeja de entrada y spam
✓ Verifica que el backend está corriendo

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 EJEMPLO COMPLETO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Día 1 - Tú creas tu cuenta de admin:
  • Email: admin@example.com
  • Password: Admin123456
  • Status: APPROVED (automático)
  • ✅ Puedes hacer login

Día 2 - Juan quiere acceder:
  • Email: juan@example.com
  • Password: Juan123456
  • Status: PENDING (espera aprobación)
  • ❌ No puede hacer login

Día 3 - Tú apruebas a Juan:
  • Login como: admin@example.com
  • Vas a Admin → Usuarios Pendientes
  • Ves a "juan@example.com" con status PENDING
  • Haces clic en APROBAR
  • Status cambia a APPROVED
  • Juan recibe email: "Tu cuenta fue aprobada"

Día 4 - Juan puede hacer login:
  • Email: juan@example.com
  • Password: Juan123456
  • ✅ Acceso concedido
  • Puede ver el dashboard

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

¿Tienes dudas? Revisa la documentación en:
- SETUP_COMPLETO.md
- SOLUCION_FINAL.md
- API_ENDPOINTS.md

¡Listo! Ya sabes cómo gestionar usuarios como admin 🎉
