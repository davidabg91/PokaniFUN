import Database from 'better-sqlite3'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const db = new Database(join(__dirname, 'data.db'))

db.pragma('journal_mode = WAL')

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id            TEXT PRIMARY KEY,
    username      TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at    INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS invitations (
    id               TEXT PRIMARY KEY,
    sender_name      TEXT NOT NULL,
    recipient_name   TEXT,
    recipient_gender TEXT NOT NULL DEFAULT 'female',  -- female | male | other
    kind             TEXT NOT NULL DEFAULT 'romantic', -- romantic | friendly
    message          TEXT,
    photo            TEXT,   -- uploaded image filename (in /uploads)
    audio            TEXT,   -- uploaded/recorded voice filename (in /uploads)
    user_id          TEXT,   -- link to users(id) if logged in
    created_at       INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS responses (
    invitation_id TEXT PRIMARY KEY,
    accepted      INTEGER NOT NULL DEFAULT 1,
    date          TEXT,
    time          TEXT,
    activity      TEXT,   -- restaurant | cinema | walk | bowling
    food          TEXT,   -- sushi | pizza | burger | pasta | bbq | vegan
    dodges        INTEGER NOT NULL DEFAULT 0, -- how many times they fled the "Не" button
    created_at    INTEGER NOT NULL,
    FOREIGN KEY (invitation_id) REFERENCES invitations(id)
  );
`)

// Lightweight migration: add media and auth columns to pre-existing databases.
const cols = db.prepare('PRAGMA table_info(invitations)').all().map((c) => c.name)
if (!cols.includes('photo')) db.exec('ALTER TABLE invitations ADD COLUMN photo TEXT')
if (!cols.includes('audio')) db.exec('ALTER TABLE invitations ADD COLUMN audio TEXT')
if (!cols.includes('user_id')) db.exec('ALTER TABLE invitations ADD COLUMN user_id TEXT')

const respCols = db.prepare('PRAGMA table_info(responses)').all().map((c) => c.name)
if (!respCols.includes('dodges'))
  db.exec('ALTER TABLE responses ADD COLUMN dodges INTEGER NOT NULL DEFAULT 0')

export default db
