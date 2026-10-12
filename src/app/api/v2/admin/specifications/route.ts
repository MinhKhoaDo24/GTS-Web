/**
 * API Route: /api/v2/admin/specifications
 *
 * GET  → Lấy tất cả specs có nhóm (dùng cho trang quản lý)
 * POST → Tạo specification mới
 */

import { NextRequest, NextResponse } from 'next/server'
import {
  getAllSpecifications,
  getSpecificationGroups,
  createSpecification,
  createSpecificationGroup,
} from '@/lib/dal/specifications'

export const dynamic = 'force-dynamic'

// GET: Lấy tất cả specs + groups
export async function GET() {
  try {
    const [groups, specs] = await Promise.all([
      getSpecificationGroups(),
      getAllSpecifications(),
    ])
    return NextResponse.json({ groups, specs })
  } catch (e) {
    console.error('[GET /api/v2/admin/specifications]', e)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

// POST: Tạo mới
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { type, ...data } = body

    if (type === 'group') {
      // Tạo specification group
      if (!data.name || !data.slug) {
        return NextResponse.json({ error: 'name và slug là bắt buộc' }, { status: 400 })
      }
      const result = await createSpecificationGroup({
        name: data.name,
        slug: data.slug,
        description: data.description ?? null,
        sort_order: data.sort_order ?? 0,
      })
      return NextResponse.json({ success: true, id: result.id })
    }

    if (type === 'spec') {
      // Tạo specification
      if (!data.group_id || !data.name || !data.slug || !data.data_type) {
        return NextResponse.json(
          { error: 'group_id, name, slug, data_type là bắt buộc' },
          { status: 400 }
        )
      }
      const result = await createSpecification({
        group_id: data.group_id,
        name: data.name,
        slug: data.slug,
        data_type: data.data_type,
        unit: data.unit ?? null,
        description: data.description ?? null,
        is_filterable: data.is_filterable ?? false,
        is_searchable: data.is_searchable ?? false,
        sort_order: data.sort_order ?? 0,
      })
      return NextResponse.json({ success: true, id: result.id })
    }

    return NextResponse.json({ error: 'type phải là "group" hoặc "spec"' }, { status: 400 })
  } catch (e) {
    console.error('[POST /api/v2/admin/specifications]', e)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
