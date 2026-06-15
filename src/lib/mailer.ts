import nodemailer from 'nodemailer'

// Configurar transporte SMTP de Gmail (smtp.gmail.com:587)
export const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  }
})