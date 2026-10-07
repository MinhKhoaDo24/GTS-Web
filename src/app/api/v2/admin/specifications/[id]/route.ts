/**
 * API Route: /api/v2/admin/specifications/[id]
 *
 * PATCH → Cập nhật specification hoặc specification_group
 * DELETE → Xóa specification hoặc specification_group
 */

import { NextRequest, NextResponse } from 'next/server'
import {
  updateSpecification,
  updateSpecificationGroup,
  deleteSpecification,
  deleteSpecificationGroup,
  toggleSpecificationActive,
} from '@/lib/dal/specifications'

interface Params { params: Promise<{ id: string }> }

// PATCH: Cập nhật
export async function PATCH(req: NextRequest, { params }: Params) {
  const { id } = await params
  try {
    const body = await req.json()
    const { type, ...data } = body

    if (type === 'group') {
      await updateSpecificationGroup(id, data)
    } else if (type === 'spec') {
      await updateSpecification(id, data)
    } else if (type === 'toggle') {
      await toggleSpecificationActive(id, data.is_active)
    } else {
      return NextResponse.json({ error: 'type không hợp lệ' }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('[PATCH /api/v2/admin/specifications/[id]]', e)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

// DELETE: Xóa
export async function DELETE(req: NextRequest, { params }: Params) {
  const { id } = await params
  try {
    const { searchParams } = new URL(req.url)
    const type = searchParams.get('type') ?? 'spec'

    if (type === 'group') {
      await deleteSpecificationGroup(id)
    } else {
      await deleteSpecification(id)
    }

    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('[DELETE /api/v2/admin/specifications/[id]]', e)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
