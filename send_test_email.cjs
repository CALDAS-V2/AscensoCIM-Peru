const fs = require('fs')
const path = require('path')
const nodemailer = require('nodemailer')

const envPath = path.resolve(__dirname, '.env')
let envText = ''
if (fs.existsSync(envPath)) envText = fs.readFileSync(envPath, 'utf8')

const env = {}
envText.split(/\r?\n/).forEach(line => {
  const m = line.match(/^\s*([A-Za-z_0-9]+)\s*=\s*(.*)\s*$/)
  if (m) {
    let v = m[2]
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1)
    }
    env[m[1]] = v
  }
})

const EMAIL_USER = env.EMAIL_USER
const EMAIL_PASS = env.EMAIL_PASS
const CLIENT_URL = env.CLIENT_URL || 'http://localhost:5173'

if (!EMAIL_USER || !EMAIL_PASS) {
  console.error('EMAIL_USER or EMAIL_PASS not configured in .env')
  process.exit(2)
}

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: { user: EMAIL_USER, pass: EMAIL_PASS }
})

transporter.verify(function (err, success) {
  if (err) {
    console.error('SMTP verify error:', err)
    process.exit(3)
  } else {
    console.log('SMTP verified OK')

    const to = EMAIL_USER || 'admin@example.com'
    const token = 'test-' + Date.now()
    const link = `${CLIENT_URL.replace(/\/$/, '')}/reset-password?token=${token}`
    const mail = {
      from: EMAIL_USER,
      to,
      subject: 'Prueba: Recuperar contraseña - AscensoCIM Perú',
      html: `<p>Este es un correo de prueba para verificar el envío SMTP desde Gmail.</p><p>Enlace de prueba: <a href="${link}">${link}</a></p>`
    }

    transporter.sendMail(mail, (error, info) => {
      if (error) {
        console.error('Error sending mail:', error)
        process.exit(4)
      } else {
        console.log('Email sent:', info.response || info)
        process.exit(0)
      }
    })
  }
})
