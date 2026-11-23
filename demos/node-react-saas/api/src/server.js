import cors from 'cors'
import express from 'express'
import morgan from 'morgan'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  alerts,
  buildDashboard,
  clubs,
  signupSeries,
  tenant,
} from './store.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = Number(process.env.PORT) || 5210
const HOST = process.env.HOST || '127.0.0.1'
const WEB_DIST = process.env.WEB_DIST // e.g. /app/web/dist in Docker

app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'))
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(',') ?? [
      'http://localhost:5180',
      'http://127.0.0.1:5180',
    ],
  }),
)
app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    runtime: 'node',
    service: 'plotline-api',
    env: process.env.NODE_ENV || 'development',
  })
})

app.get('/api/tenant', (_req, res) => {
  res.json(tenant)
})

app.get('/api/dashboard', (_req, res) => {
  res.json(buildDashboard())
})

app.get('/api/clubs', (_req, res) => {
  res.json(clubs)
})

app.get('/api/clubs/:id', (req, res) => {
  const club = clubs.find((c) => c.id === req.params.id)
  if (!club) return res.status(404).json({ error: 'Club not found' })
  res.json(club)
})

app.get('/api/signups', (req, res) => {
  const range = req.query.range === '7d' ? 24 * 7 : 24
  res.json(signupSeries(range))
})

app.get('/api/alerts', (_req, res) => {
  res.json(alerts)
})

app.post('/api/clubs/:id/pause', (req, res) => {
  const club = clubs.find((c) => c.id === req.params.id)
  if (!club) return res.status(404).json({ error: 'Club not found' })
  if (club.status === 'trial') {
    return res.status(409).json({ error: 'Cannot pause a trial club' })
  }
  club.status = 'paused'
  res.json(club)
})

// Production / Docker: serve Vite build from the same process (modular monolith)
if (WEB_DIST) {
  app.use(express.static(WEB_DIST))
  app.get(/^(?!\/api).*/, (_req, res) => {
    res.sendFile(path.join(WEB_DIST, 'index.html'))
  })
}

app.listen(PORT, HOST, () => {
  console.log(`Plotline API http://${HOST}:${PORT}${WEB_DIST ? ' (+ web dist)' : ''}`)
})
