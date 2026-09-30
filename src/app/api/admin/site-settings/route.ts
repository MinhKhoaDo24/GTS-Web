import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import type { SiteSetting } from '@/types/database'

export async function GET() {
  try {
    const settings = await query<SiteSetting>('SELECT key, value FROM site_settings')
    const dict = Object.fromEntries(settings.map((s) => [s.key, s.value]))
    return NextResponse.json({ data: dict })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body: Record<string, string> = await request.json()

    for (const [key, value] of Object.entries(body)) {
      const id = crypto.randomUUID()
      await query(
        `INSERT INTO site_settings (id, key, value, updated_at)
         VALUES ($1, $2, $3, NOW())
         ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()`,
        [id, key, String(value)]
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Update settings error:', error)
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
  }
}
