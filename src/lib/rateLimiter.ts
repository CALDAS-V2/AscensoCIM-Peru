import rateLimit, { ipKeyGenerator } from 'express-rate-limit'
import { Request } from 'express'

// General limiter: 100 requests per 15 minutes per IP
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res) => {
    res.status(429).json({ error: 'Too many requests, please try again later.' })
  }
})

// Login-specific limiter: tighter (10 requests per 15 minutes)
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: Request) => ipKeyGenerator(req as any) as string,
  handler: (req: Request, res) => {
    res.status(429).json({ error: 'Too many login attempts from this IP, please try again later.' })
  }
})

// NOTE: For production behind multiple instances use a shared store (Redis) via "rate-limit-redis".
// Example (optional):
// import RedisStore from 'rate-limit-redis'
// store: new RedisStore({ sendCommand: (...args) => redisClient.sendCommand(args) })
