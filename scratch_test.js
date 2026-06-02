import dotenv from 'dotenv'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const envPath = join(__dirname, '.env')
console.log('__dirname:', __dirname)
console.log('envPath:', envPath)

const result = dotenv.config({ path: envPath })
console.log('Result error:', result.error)
console.log('Result parsed:', result.parsed)
console.log('SUPABASE_URL:', process.env.SUPABASE_URL)
