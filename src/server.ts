import dotenv from 'dotenv'
dotenv.config()

// Ensure CLIENT_URL is set in production when deploying to platforms like Vercel
// Vercel provides VERCEL_URL (e.g. my-app.vercel.app) — build-time envs should still set CLIENT_URL
if (process.env.NODE_ENV === 'production' && !process.env.CLIENT_URL && process.env.VERCEL_URL) {
  process.env.CLIENT_URL = `https://${process.env.VERCEL_URL}`
}

import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import authRouter from './lib/authRoutesV2'
import { generalLimiter } from './lib/rateLimiter'

const app = express()
const PORT = process.env.PORT || 3001

// Middleware - security, parsing and rate limiting
app.use(helmet())
app.use(express.json())
app.use(generalLimiter)
app.use(cors({
  origin: (origin, callback) => {
    // In production only allow CLIENT_URL or common deploy domains (Vercel)
    if (process.env.NODE_ENV === 'production') {
      const allowed = [process.env.CLIENT_URL]
      // If running on Vercel, VERCEL_URL may be available at runtime
      if (process.env.VERCEL_URL) allowed.push(`https://${process.env.VERCEL_URL}`)

      const requestOrigin = origin || ''
      if (allowed.includes(requestOrigin)) {
        return callback(null, true)
      }

      // Allow common vercel domains as a convenience if explicit CLIENT_URL not set
      if (requestOrigin && requestOrigin.includes('.vercel.app')) {
        return callback(null, true)
      }

      console.warn('CORS blocked origin:', requestOrigin, 'allowed:', allowed)
      return callback(new Error('CORS policy: Origin not allowed'))
    }

    // In development allow localhost and any origin (or use CLIENT_URL)
    callback(null, true)
  },
  credentials: true
}))

// Rutas
app.use('/api/auth', authRouter)

// Endpoint de IA con Google Gemini
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { apiKey, systemPrompt, messages } = req.body

    if (!apiKey) {
      return res.status(400).json({ error: { message: 'API key no proporcionada' } })
    }

    // Convertir formato de mensajes al formato de Gemini
    const contents = messages.map((msg: any) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }))

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          system: {
            instructions: systemPrompt
          },
          contents,
          generationConfig: {
            maxOutputTokens: 1024,
            temperature: 0.7,
            topP: 0.9
          }
        })
      }
    )

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Google Gemini API Error:', errorData)
      return res.status(response.status).json({ error: errorData.error })
    }

    const data = await response.json()
    const content = data.candidates[0].content.parts[0].text

    res.json({ content })
  } catch (error) {
    console.error('Chat endpoint error:', error)
    res.status(500).json({ 
      error: { 
        message: error instanceof Error ? error.message : 'Error interno del servidor' 
      } 
    })
  }
})

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' })
})

const server = app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`)
  console.log(`📝 Auth endpoints disponibles en http://localhost:${PORT}/api/auth`)
  console.log(`🤖 AI endpoints disponibles en http://localhost:${PORT}/api/ai`)
})

process.on('SIGINT', () => {
  console.log('\n⛔ Servidor cerrado')
  server.close()
  process.exit(0)
})
