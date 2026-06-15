Pruebas: WhatsApp (Twilio) y Email (SMTP)

1) Envío WhatsApp via Twilio (endpoint protegido)

Endpoint (requiere token admin):
POST /api/auth/debug/send-test-whatsapp
Headers: Authorization: Bearer <TOKEN_ADMIN>
Body JSON opcional: { "message": "Texto personalizado" }

curl example:

curl -X POST http://localhost:3001/api/auth/debug/send-test-whatsapp \
  -H "Authorization: Bearer <TOKEN_ADMIN>" \
  -H "Content-Type: application/json" \
  -d '{"message":"Prueba WhatsApp desde AscensoCIM"}'

Respuesta esperada (200):
{ "ok": true, "message": "Mensaje enviado (si Twilio está configurado)." }

Twilio API - ejemplo de respuesta de éxito (simplificado):
{
  "sid": "SMxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "date_created": "2026-06-13T12:00:00Z",
  "status": "queued",
  "to": "whatsapp:+51XXXXXXXX",
  "from": "whatsapp:+1415YYYYYYY",
  "body": "Prueba WhatsApp desde AscensoCIM"
}

Ejemplo de error de Twilio (credenciales inválidas):
HTTP 401 Unauthorized
{
  "code": 20003,
  "message": "Authentication Error - invalid username/password",
  "more_info": "https://www.twilio.com/docs/errors/20003",
  "status": 401
}

2) Envío de correo SMTP de prueba

Endpoint (requiere token admin):
POST /api/auth/debug/send-test-email
Headers: Authorization: Bearer <TOKEN_ADMIN>
Body: ninguno

curl example:

curl -X POST http://localhost:3001/api/auth/debug/send-test-email \
  -H "Authorization: Bearer <TOKEN_ADMIN>" \
  -H "Content-Type: application/json"

Respuesta esperada (200):
{ "ok": true, "message": "Correo enviado (si SMTP está configurado)." }

Si hay error SMTP, el endpoint responderá 500 con detalles del error.

Variables .env a revisar antes de probar
- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY
- CLIENT_URL
- EMAIL_USER
- EMAIL_PASS
- ADMIN_WHATSAPP_WEBHOOK (opcional)
- TWILIO_ACCOUNT_SID
- TWILIO_AUTH_TOKEN
- TWILIO_WHATSAPP_FROM (ej: whatsapp:+1415...)
- ADMIN_WHATSAPP_TO (ej: whatsapp:+51...)

Verificación en Twilio Console:
- En Messaging > Logs verás la petición y el estado del mensaje.
- Si el mensaje aparece con status 'failed' revisa el campo "error_message".

Notas:
- SUPABASE_SERVICE_ROLE_KEY no debe exponerse en frontend ni en repositorios públicos.
- Asegúrate de que el número Twilio esté activado para WhatsApp y que ADMIN_WHATSAPP_TO haya enviado primero un mensaje a tu número Twilio si se requiere sandbox.
