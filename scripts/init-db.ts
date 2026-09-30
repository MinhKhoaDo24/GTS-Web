import fs from 'fs'
import path from 'path'

try {
  process.loadEnvFile?.('.env')
} catch {}

import { pool } from '../src/lib/db'

async function initDb() {
  console.log('🚀 Initializing database schema...')
  const schemaPath = path.join(process.cwd(), 'db', 'schema.sql')
  const sql = fs.readFileSync(schemaPath, 'utf8')

  try {
    await pool.query(sql)
    console.log('✅ Database schema created successfully!')
  } catch (error) {
    console.error('❌ Failed to initialize database schema:', error)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

initDb()
