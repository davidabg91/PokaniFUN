import express from 'express'
import cors from 'cors'
import multer from 'multer'
import { customAlphabet } from 'nanoid'
import { extname, join } from 'node:path'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import fs from 'node:fs'
import db, { supabaseUrl, dotenvError } from './db.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const __dirname = dirname(fileURLToPath(import.meta.url))
const isProd = process.env.NODE_ENV === 'production'
const PORT = isProd ? process.env.PORT || 5174 : 5174

// Short, URL-friendly, non-confusing ids (no look-alike chars)
const newId = customAlphabet('23456789abcdefghjkmnpqrstuvwxyz', 8)

// Multer configured in-memory to support serverless deployment without local disk writing
const storage = multer.memoryStorage()
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
    photoUrl: inv.photo || null,
    audioUrl: inv.audio || null,
    createdAt: Number(inv.created_at),
    response: res
      ? {
          accepted: !!res.accepted,
          date: res.date,
          time: res.time,
          activity: res.activity,
          food: res.food,
          dodges: res.dodges || 0,
          createdAt: Number(res.created_at),
        }
      : null,
  }
}

// Create an invitation (uploaded straight to Supabase Storage bucket 'media')
const mediaFields = upload.fields([
  { name: 'photo', maxCount: 1 },
  { name: 'audio', maxCount: 1 },
])

app.post('/api/invitations', authenticateToken, (req, res) => {
  mediaFields(req, res, async (err) => {
    if (err) return res.status(400).json({ error: err.message || 'Грешка при качване' })

    const senderName = clean(req.body?.senderName, 60)
    if (!senderName) return res.status(400).json({ error: 'Липсва име на подателя' })

    try {
      const recipientName = clean(req.body?.recipientName, 60)
      const recipientGender = VALID_GENDERS.has(req.body?.recipientGender)
        ? req.body.recipientGender
        : 'female'
      const kind = VALID_KINDS.has(req.body?.kind) ? req.body.kind : 'romantic'
      const message = clean(req.body?.message, 400)
      const userId = req.user?.id || null

      let photoUrl = null
      let audioUrl = null

      if (req.files?.photo?.[0]) {
        const photoFile = req.files.photo[0]
        const ext = (extname(photoFile.originalname) || '').slice(0, 8).replace(/[^.\w]/g, '')
        const filename = `${newId()}${ext}`
        const { error: storageErr } = await db.storage
          .from('media')
          .upload(filename, photoFile.buffer, {
            contentType: photoFile.mimetype,
          })
        if (storageErr) throw new Error(`Грешка при качване на снимка: ${storageErr.message}`)
        const { data: { publicUrl } } = db.storage.from('media').getPublicUrl(filename)
        photoUrl = publicUrl
      }

      if (req.files?.audio?.[0]) {
        const audioFile = req.files.audio[0]
        const ext = (extname(audioFile.originalname) || '').slice(0, 8).replace(/[^.\w]/g, '')
        const filename = `${newId()}${ext}`
        const { error: storageErr } = await db.storage
          .from('media')
          .upload(filename, audioFile.buffer, {
            contentType: audioFile.mimetype,
          })
        if (storageErr) throw new Error(`Грешка при качване на аудио: ${storageErr.message}`)
        const { data: { publicUrl } } = db.storage.from('media').getPublicUrl(filename)
        audioUrl = publicUrl
      }

      const id = newId()
      const { error } = await db
        .from('invitations')
        .insert({
          id,
          sender_name: senderName,
          recipient_name: recipientName,
          recipient_gender: recipientGender,
          kind,
          message,
          photo: photoUrl,
          audio: audioUrl,
          user_id: userId,
          created_at: Date.now()
        })

      if (error) throw error
      res.json({ id })
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: error.message || 'Сървърна грешка при създаване на поканата' })
    }
  })
})

// Read an invitation (+ response if exists)
app.get('/api/invitations/:id', async (req, res) => {
  try {
    const { data: inv, error: invErr } = await db
      .from('invitations')
      .select('*')
      .eq('id', req.params.id)
      .single()

    if (invErr) {
      if (invErr.code === 'PGRST116') {
        return res.status(404).json({ error: 'Поканата не е намерена' })
      }
      throw invErr
    }

    const { data: resp, error: respErr } = await db
      .from('responses')
      .select('*')
      .eq('invitation_id', req.params.id)
      .maybeSingle()

    if (respErr) throw respErr

    res.json(shape(inv, resp))
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: `Сървърна грешка при четене на покана: ${error.message}` })
  }
})

// Save the recipient's answer
app.post('/api/invitations/:id/response', async (req, res) => {
  try {
    const { data: inv, error: invErr } = await db
      .from('invitations')
      .select('id')
      .eq('id', req.params.id)
      .single()

    if (invErr) {
      if (invErr.code === 'PGRST116') {
        return res.status(404).json({ error: 'Поканата не е намерена' })
      }
      throw invErr
    }

    const accepted = req.body?.accepted === false ? 0 : 1
    const date = clean(req.body?.date, 20)
    const time = clean(req.body?.time, 10)
    const activity = VALID_ACTIVITIES.has(req.body?.activity) ? req.body.activity : null
    const food = clean(req.body?.food, 30) || null
    const dodges = Math.max(0, Math.min(999, parseInt(req.body?.dodges, 10) || 0))

    const { error } = await db
      .from('responses')
      .upsert({
        invitation_id: req.params.id,
        accepted,
        date,
        time,
        activity,
        food,
        dodges,
        created_at: Date.now(),
      })

    if (error) throw error
    res.json({ ok: true })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: `Грешка при записване на отговора: ${error.message}` })
  }
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
    const { data: existing, error: selectError } = await db
      .from('users')
      .select('id')
      .eq('username', username)
      .maybeSingle()

    if (selectError) throw selectError

    if (existing) {
      return res.status(400).json({ error: 'Потребителското име вече е заето' })
    }

    const userId = newId()
    const passwordHash = await bcrypt.hash(password, 10)

    const { error } = await db
      .from('users')
      .insert({
        id: userId,
        username,
        password_hash: passwordHash,
        created_at: Date.now()
      })

    if (error) throw error

    const token = jwt.sign({ id: userId, username }, JWT_SECRET, { expiresIn: '30d' })
    res.json({ token, user: { id: userId, username } })
  } catch (error) {
    console.error(error)
    const detail = error.cause ? ` (${error.cause.message || error.cause})` : ''
    res.status(500).json({ error: `Сървърна грешка при регистрация: ${error.message}${detail} [URL: ${supabaseUrl}] [Dotenv: ${dotenvError}]` })
  }
})

app.post('/api/auth/login', async (req, res) => {
  const username = clean(req.body?.username, 30).toLowerCase()
  const password = req.body?.password

  if (!username || !password) {
    return res.status(400).json({ error: 'Потребителското име и паролата са задължителни' })
  }

  try {
    const { data: user, error } = await db
      .from('users')
      .select('*')
      .eq('username', username)
      .maybeSingle()

    if (error) throw error

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
    res.status(500).json({ error: `Сървърна грешка при вход: ${error.message}` })
  }
})

app.get('/api/auth/me', requireAuth, (req, res) => {
  res.json({ user: req.user })
})

app.get('/api/debug-env', (req, res) => {
  res.json({
    keys: Object.keys(process.env).filter(k => k.startsWith('SUPABASE') || k.startsWith('JWT') || k === 'NODE_ENV'),
    hasUrl: !!process.env.SUPABASE_URL,
    hasKey: !!process.env.SUPABASE_KEY,
    hasJwt: !!process.env.JWT_SECRET,
    urlValueStart: process.env.SUPABASE_URL ? process.env.SUPABASE_URL.substring(0, 15) : null
  })
})

// --- User Routes ---
app.get('/api/user/invitations', requireAuth, async (req, res) => {
  try {
    const { data: invitations, error } = await db
      .from('invitations')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false })

    if (error) throw error

    const data = await Promise.all(
      invitations.map(async (inv) => {
        const { data: resp, error: respErr } = await db
          .from('responses')
          .select('*')
          .eq('invitation_id', inv.id)
          .maybeSingle()
        if (respErr) throw respErr
        return shape(inv, resp)
      })
    )

    res.json(data)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: `Грешка при извличане на поканите: ${error.message}` })
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
export default app
