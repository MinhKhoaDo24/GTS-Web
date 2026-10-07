import { NextResponse } from 'next/server'
import { queryOne } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  const start = Date.now()
  try {
    const result = await queryOne<{ now: string; version: string }>(
      'SELECT NOW() as now, version() as version'
    )
    const latency = Date.now() - start

    // Mask connection string for security
    const rawUrl = process.env.DATABASE_URL || ''
    const maskedUrl = rawUrl.replace(/:([^:@]+)@/, ':****@')

    return NextResponse.json({
      status: 'ok',
      database: 'connected',
      latency_ms: latency,
      server_time: result?.now,
      postgres_version: result?.version?.split(' ')?.[0] ?? 'PostgreSQL',
      is_serverless: Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME),
      database_target: maskedUrl ? maskedUrl.split('@')[1] : 'not set',
    })
  } catch (error: any) {
    const latency = Date.now() - start
    const rawUrl = process.env.DATABASE_URL || ''
    const maskedUrl = rawUrl.replace(/:([^:@]+)@/, ':****@')

    return NextResponse.json(
      {
        status: 'error',
        database: 'failed',
        latency_ms: latency,
        error_code: error?.code,
        error_message: error?.message,
        is_serverless: Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME),
        database_target: maskedUrl ? maskedUrl.split('@')[1] : 'not set',
        hint:
          error?.code === 'ECONNREFUSED'
            ? 'Vercel Serverless cần dùng Supabase Transaction Pooler (port 6543), không dùng direct connection (port 5432).'
            : error?.code === '28P01'
            ? 'Sai mật khẩu database trong DATABASE_URL.'
            : 'Kiểm tra biến môi trường DATABASE_URL trên Vercel Dashboard.',
      },
      { status: 500 }
    )
  }
}
