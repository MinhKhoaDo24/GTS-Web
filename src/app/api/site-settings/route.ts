import { NextResponse } from 'next/server'
import { query } from '@/lib/db'
import type { SiteSetting } from '@/types/database'

export async function GET() {
  try {
    const settings = await query<SiteSetting>('SELECT key, value FROM site_settings')
    const dict = Object.fromEntries(settings.map((s) => [s.key, s.value]))
    return NextResponse.json({ data: dict })
  } catch (error) {
    console.error('API site-settings error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
