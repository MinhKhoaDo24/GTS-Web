/**
 * API Route: /api/v2/admin/products/[id]/specifications
 *
 * GET  → Lấy tất cả thông số hiện tại của sản phẩm
 * POST → Lưu (upsert) toàn bộ thông số từ Dynamic Form
 *
 * POST Body (JSON):
 * {
 *   specs: [
 *     { specification_id, value_text?, value_number?, value_boolean?, ... }
 *   ]
 * }
 */

import { NextRequest, NextResponse } from 'next/server'
import {
  getProductSpecifications,
  upsertProductSpecifications,
} from '@/lib/dal/specifications'
import type { SpecInputValue } from '@/lib/dal/specifications'

interface Params { params: Promise<{ id: string }> }

// ─── GET: lấy specs hiện tại của sản phẩm ────────────────────────────────────

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params
  try {
    const specs = await getProductSpecifications(id)
    return NextResponse.json({ specs })
  } catch (e) {
    console.error('[GET product specs]', e)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

// ─── POST: upsert specs từ Dynamic Form ──────────────────────────────────────

export async function POST(req: NextRequest, { params }: Params) {
  const { id: productId } = await params
  try {
    const body = await req.json()
    const specs: SpecInputValue[] = body.specs ?? []

    if (!Array.isArray(specs)) {
      return NextResponse.json(
        { error: 'specs must be an array' },
        { status: 400 }
      )
    }

    await upsertProductSpecifications(productId, specs)

    return NextResponse.json({ success: true, saved: specs.length })
  } catch (e) {
    console.error('[POST product specs]', e)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
