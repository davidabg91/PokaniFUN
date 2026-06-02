import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL || 'https://placeholder-url.supabase.co'
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
