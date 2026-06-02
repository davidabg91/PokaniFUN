import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: join(__dirname, '..', '.env') })

export const supabaseUrl = process.env.SUPABASE_URL || 'https://placeholder-url.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY || 'placeholder-key'

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
  console.warn('⚠️ Предупреждение: Липсват SUPABASE_URL или SUPABASE_KEY в променливите на средата!')
}

const db = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
  },
})

export default db
