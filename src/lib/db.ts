try {
  process.loadEnvFile?.()
} catch {}

import { Pool, QueryResultRow } from 'pg'

declare global {
  var _pgPool: Pool | undefined
}

function getConnectionString(): string {
  return (
    process.env.DATABASE_URL ||
    'postgresql://postgres:123456@localhost:5432/gts_db?schema=public'
  )
}

function createPool(): Pool {
  const connectionString = getConnectionString()
  const isLocal =
    connectionString.includes('localhost') || connectionString.includes('127.0.0.1')

  return new Pool({
    connectionString,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 15000,
    ssl: isLocal ? false : { rejectUnauthorized: false },
  })
}

export const pool = globalThis._pgPool ?? createPool()

if (process.env.NODE_ENV !== 'production') {
  globalThis._pgPool = pool
}

/**
 * Execute a raw parameterized SQL query and return an array of typed rows.
 */
export async function query<T extends QueryResultRow = any>(
  text: string,
  params?: any[]
): Promise<T[]> {
  try {
    const res = await pool.query<T>(text, params)
    return res.rows
  } catch (error) {
    console.error('Database query error:', { text, error })
    throw error
  }
}

/**
 * Execute a raw parameterized SQL query and return a single row or null.
 */
export async function queryOne<T extends QueryResultRow = any>(
  text: string,
  params?: any[]
): Promise<T | null> {
  const rows = await query<T>(text, params)
  return rows.length > 0 ? rows[0] : null
}
