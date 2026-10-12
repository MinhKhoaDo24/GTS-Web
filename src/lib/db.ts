/**
 * db.ts — Database connection layer
 *
 * Hỗ trợ 2 môi trường:
 *  - Local / Docker      : pg Pool truyền thống (direct connection)
 *  - Vercel Serverless   : pg Pool với Supabase Transaction Pooler (port 6543)
 *
 * ⚠️  Trên Vercel: DATABASE_URL PHẢI là Transaction Pooler URL (port 6543)
 *     Lấy từ: Supabase Dashboard → Project Settings → Database → Connection Pooling
 *     Chọn "Transaction" mode, copy URI
 *
 * Supabase Transaction Pooler URL format:
 *   postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres
 */

import { Pool, PoolClient, QueryResultRow } from 'pg'

declare global {
  // eslint-disable-next-line no-var
  var _pgPool: Pool | undefined
}

function getConnectionString(): string {
  const url = process.env.DATABASE_URL
  if (!url) {
    // Fallback local dev
    return 'postgresql://postgres:123456@localhost:5432/gts_db'
  }
  return url
}

function isServerless(): boolean {
  // Vercel, AWS Lambda, Netlify Functions đều set VERCEL hoặc AWS_LAMBDA_FUNCTION_NAME
  return Boolean(
    process.env.VERCEL ||
    process.env.AWS_LAMBDA_FUNCTION_NAME ||
    process.env.NETLIFY
  )
}

function createPool(): Pool {
  const connectionString = getConnectionString()
  const isDirect =
    connectionString.includes('localhost') ||
    connectionString.includes('127.0.0.1')

  return new Pool({
    connectionString,

    // Serverless: giữ pool size tối thiểu để tránh connection exhaustion
    // Local: dùng pool lớn hơn
    max: isServerless() ? 1 : 10,
    min: 0,

    // Đóng idle connection nhanh hơn trên serverless
    idleTimeoutMillis: isServerless() ? 10000 : 30000,

    // Timeout kết nối — Supabase cần đủ thời gian cho SSL handshake
    connectionTimeoutMillis: 10000,

    // SSL: bắt buộc với Supabase, tắt với local
    ssl: isDirect ? false : { rejectUnauthorized: false },

    // Quan trọng với Supabase Transaction Pooler:
    // Không dùng prepared statements vì pooler không cache chúng
    ...(isServerless() && !isDirect ? { statement_timeout: 30000 } : {}),
  })
}

// Singleton pool — tái sử dụng giữa các warm invocations
export const pool: Pool = globalThis._pgPool ?? createPool()

// Cache trong development để tránh tạo pool mới mỗi hot-reload
if (process.env.NODE_ENV !== 'production') {
  globalThis._pgPool = pool
}

// ─── Query helpers ────────────────────────────────────────────────────────────

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
  } catch (error: any) {
    // Log chi tiết hơn để debug trên Vercel
    console.error('[DB] Query error:', {
      text: text.substring(0, 200),
      params: params?.slice(0, 5),
      message: error?.message,
      code: error?.code,
    })
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

/**
 * Run multiple queries in a single transaction.
 * Tự động ROLLBACK nếu có lỗi.
 */
export async function withTransaction<T>(
  fn: (client: PoolClient) => Promise<T>
): Promise<T> {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const result = await fn(client)
    await client.query('COMMIT')
    return result
  } catch (e) {
    await client.query('ROLLBACK')
    throw e
  } finally {
    client.release()
  }
}
