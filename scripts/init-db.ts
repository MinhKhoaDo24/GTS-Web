import fs from 'fs'
import path from 'path'

try {
  process.loadEnvFile?.('.env')
} catch {}

import { pool } from '../src/lib/db'

async function initDb() {
  console.log('🚀 Initializing database schema...')
  const dbDir = path.join(process.cwd(), 'db')
  const defaultSchemaPath = path.join(dbDir, 'schema.sql')

  try {
    if (fs.existsSync(defaultSchemaPath)) {
      const sql = fs.readFileSync(defaultSchemaPath, 'utf8')
      await pool.query(sql)
      console.log('✅ Executed db/schema.sql')
    } else {
      const sqlFiles = ['01_schema_tables.sql', '02_indexes.sql', '03_triggers.sql']
      for (const file of sqlFiles) {
        const filePath = path.join(dbDir, file)
        if (fs.existsSync(filePath)) {
          console.log(`⏳ Executing ${file}...`)
          const sql = fs.readFileSync(filePath, 'utf8')
          await pool.query(sql)
          console.log(`✅ Executed ${file}`)
        }
      }
    }
    console.log('✅ Database schema created successfully!')
  } catch (error) {
    console.error('❌ Failed to initialize database schema:', error)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

initDb()
