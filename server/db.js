import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: join(__dirname, '..', '.env') })

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.warn('⚠️ Предупреждение: Липсват SUPABASE_URL или SUPABASE_KEY в променливите на средата!')
}

const db = createClient(supabaseUrl || 'https://placeholder-url.supabase.co', supabaseKey || 'placeholder-key', {
  auth: {
    persistSession: false,
  },
})

export default db
