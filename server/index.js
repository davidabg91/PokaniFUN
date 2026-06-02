import express from 'express'
import cors from 'cors'
import multer from 'multer'
import { customAlphabet } from 'nanoid'
import { fileURLToPath } from 'node:url'
import { dirname, join, extname } from 'node:path'
import fs from 'node:fs'
import db from './db.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const __dirname = dirname(fileURLToPath(import.meta.url))
const isProd = process.env.NODE_ENV === 'production'
// In dev the API always uses 5174 (Vite proxies to it). Only honour PORT in
// production, where Express also serves the built client on a single port.
const PORT = isProd ? process.env.PORT || 5174 : 5174

// Short, URL-friendly, non-confusing ids (no look-alike chars)
const newId = customAlphabet('23456789abcdefghjkmnpqrstuvwxyz', 8)

// Uploaded media (photos + voice notes) live on disk and are served statically.
const uploadsDir = join(__dirname, 'uploads')
fs.mkdirSync(uploadsDir, { recursive: true })

const storage = multer.diskStorage({
  destination: uploadsDir,
  filename: (_req, file, cb) => {
    const ext = (extname(file.originalname) || '').slice(0, 8).replace(/[^.\w]/g, '')
    cb(null, `${newId()}${ext}`)
  },
})
const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 }, // 8 MB per file
  fileFilter: (_req, file, cb) => {
    const ok = file.mimetype.startsWith('image/') || file.mimetype.startsWith('audio/')
    cb(ok ? null : new Error('Само снимки и аудио'), ok)
  },
})

const app = express()
app.use(cors())
app.use(express.json({ limit: '64kb' }))
app.use('/uploads', express.static(uploadsDir))

const JWT_SECRET = process.env.JWT_SECRET || 'pokani-fun-super-secret-key-98765'

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    req.user = null
    return next()
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      req.user = null
      return next()
    }
    req.user = user
    next()
  })
}

function requireAuth(req, res, next) {
  authenticateToken(req, res, () => {
    if (!req.user) {
      return res.status(401).json({ error: 'Неоторизиран достъп. Моля, влезте в профила си.' })
    }
    next()
  })
}

const VALID_GENDERS = new Set(['female', 'male', 'other'])
const VALID_KINDS = new Set(['romantic', 'friendly'])
const VALID_ACTIVITIES = new Set(['restaurant', 'cinema', 'walk', 'bowling'])

const clean = (v, max = 120) =>
  typeof v === 'string' ? v.trim().slice(0, max) : ''

function shape(inv, res) {
  return {
    id: inv.id,
    senderName: inv.sender_name,
    recipientName: inv.recipient_name || '',
    recipientGender: inv.recipient_gender,
    kind: inv.kind,
    message: inv.message || '',
    photoUrl: inv.photo ? `/uploads/${inv.photo}` : null,
    audioUrl: inv.audio ? `/uploads/${inv.audio}` : null,
    createdAt: inv.created_at,
    response: res
      ? {
          accepted: !!res.accepted,
          date: res.date,
          time: res.time,
          activity: res.activity,
          food: res.food,
          dodges: res.dodges || 0,
          createdAt: res.created_at,
        }
      : null,
  }
}

// Create an invitation (optionally with a photo + voice note)
const mediaFields = upload.fields([
  { name: 'photo', maxCount: 1 },
  { name: 'audio', maxCount: 1 },
])

app.post('/api/invitations', authenticateToken, (req, res) => {
  mediaFields(req, res, (err) => {
    if (err) return res.status(400).json({ error: err.message || 'Грешка при качване' })

    const senderName = clean(req.body?.senderName, 60)
    if (!senderName) return res.status(400).json({ error: 'Липсва име на подателя' })

    const recipientName = clean(req.body?.recipientName, 60)
    const recipientGender = VALID_GENDERS.has(req.body?.recipientGender)
      ? req.body.recipientGender
      : 'female'
    const kind = VALID_KINDS.has(req.body?.kind) ? req.body.kind : 'romantic'
    const message = clean(req.body?.message, 400)
    const photo = req.files?.photo?.[0]?.filename || null
    const audio = req.files?.audio?.[0]?.filename || null
    const userId = req.user?.id || null

    const id = newId()
    db.prepare(
      `INSERT INTO invitations (id, sender_name, recipient_name, recipient_gender, kind, message, photo, audio, user_id, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(id, senderName, recipientName, recipientGender, kind, message, photo, audio, userId, Date.now())

    res.json({ id })
  })
})

// Read an invitation (+ response if exists)
app.get('/api/invitations/:id', (req, res) => {
  const inv = db.prepare('SELECT * FROM invitations WHERE id = ?').get(req.params.id)
  if (!inv) return res.status(404).json({ error: 'Поканата не е намерена' })
  const resp = db.prepare('SELECT * FROM responses WHERE invitation_id = ?').get(req.params.id)
  res.json(shape(inv, resp))
})

// Save the recipient's answer
app.post('/api/invitations/:id/response', (req, res) => {
  const inv = db.prepare('SELECT * FROM invitations WHERE id = ?').get(req.params.id)
  if (!inv) return res.status(404).json({ error: 'Поканата не е намерена' })

  const accepted = req.body?.accepted === false ? 0 : 1
  const date = clean(req.body?.date, 20)
  const time = clean(req.body?.time, 10)
  const activity = VALID_ACTIVITIES.has(req.body?.activity) ? req.body.activity : null
  const food = clean(req.body?.food, 30) || null
  const dodges = Math.max(0, Math.min(999, parseInt(req.body?.dodges, 10) || 0))

  db.prepare(
    `INSERT INTO responses (invitation_id, accepted, date, time, activity, food, dodges, created_at)
     VALUES (@id, @accepted, @date, @time, @activity, @food, @dodges, @created_at)
     ON CONFLICT(invitation_id) DO UPDATE SET
       accepted=@accepted, date=@date, time=@time, activity=@activity,
       food=@food, dodges=@dodges, created_at=@created_at`
  ).run({
    id: req.params.id,
    accepted,
    date,
    time,
    activity,
    food,
    dodges,
    created_at: Date.now(),
  })

  res.json({ ok: true })
})

// --- Auth Routes ---
app.post('/api/auth/register', async (req, res) => {
  const username = clean(req.body?.username, 30).toLowerCase()
  const password = req.body?.password

  if (!username || !password) {
    return res.status(400).json({ error: 'Потребителското име и паролата са задължителни' })
  }

  if (username.length < 3) {
    return res.status(400).json({ error: 'Потребителското име трябва да е поне 3 символа' })
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Паролата трябва да е поне 6 символа' })
  }

  try {
    const existing = db.prepare('SELECT id FROM users WHERE username = ?').get(username)
    if (existing) {
      return res.status(400).json({ error: 'Потребителското име вече е заето' })
    }

    const userId = newId()
    const passwordHash = await bcrypt.hash(password, 10)

    db.prepare(
      `INSERT INTO users (id, username, password_hash, created_at)
       VALUES (?, ?, ?, ?)`
    ).run(userId, username, passwordHash, Date.now())

    const token = jwt.sign({ id: userId, username }, JWT_SECRET, { expiresIn: '30d' })

    res.json({ token, user: { id: userId, username } })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Сървърна грешка при регистрация' })
  }
})

app.post('/api/auth/login', async (req, res) => {
  const username = clean(req.body?.username, 30).toLowerCase()
  const password = req.body?.password

  if (!username || !password) {
    return res.status(400).json({ error: 'Потребителското име и паролата са задължителни' })
  }

  try {
    const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username)
    if (!user) {
      return res.status(400).json({ error: 'Невалидно потребителско име или парола' })
    }

    const match = await bcrypt.compare(password, user.password_hash)
    if (!match) {
      return res.status(400).json({ error: 'Невалидно потребителско име или парола' })
    }

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '30d' })

    res.json({ token, user: { id: user.id, username: user.username } })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Сървърна грешка при вход' })
  }
})

app.get('/api/auth/me', requireAuth, (req, res) => {
  res.json({ user: req.user })
})

// --- User Routes ---
app.get('/api/user/invitations', requireAuth, (req, res) => {
  try {
    const invitations = db.prepare('SELECT * FROM invitations WHERE user_id = ? ORDER BY created_at DESC').all(req.user.id)
    const data = invitations.map(inv => {
      const resp = db.prepare('SELECT * FROM responses WHERE invitation_id = ?').get(inv.id)
      return shape(inv, resp)
    })
    res.json(data)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Грешка при извличане на поканите' })
  }
})

// Serve the built client in production
if (isProd) {
  const dist = join(__dirname, '..', 'dist')
  if (fs.existsSync(dist)) {
    app.use(express.static(dist))
    app.get('*', (_req, res) => res.sendFile(join(dist, 'index.html')))
  }
}

app.listen(PORT, () => {
  console.log(`💌  API listening on http://localhost:${PORT}`)
})
