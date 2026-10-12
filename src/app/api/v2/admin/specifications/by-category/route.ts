/**
 * API Route: GET /api/v2/admin/specifications/by-category?categoryId=xxx
 *
 * Trả về danh sách thông số kỹ thuật (grouped) cho một Category.
 * Frontend gọi API này khi admin chọn Category để render Dynamic Form.
 *
 * Response shape:
 * {
 *   groups: [
 *     {
 *       group_id, group_name, group_slug,
 *       specs: [{ id, name, data_type, unit, options?, ... }]
 *     }
 *   ]
 * }
 */

import { NextRequest, NextResponse } from 'next/server'
import { getSpecsByCategoryId } from '@/lib/dal/specifications'
import type { Specification } from '@/lib/dal/specifications'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const categoryId = searchParams.get('categoryId') ?? ''

    if (!categoryId) {
      return NextResponse.json(
        { error: 'categoryId is required' },
        { status: 400 }
      )
    }

    const specs = await getSpecsByCategoryId(categoryId)

    // Group specs by group_id cho UI dễ render
    const groupMap = new Map<string, {
      group_id: string
      group_name: string
      group_slug: string
      specs: Specification[]
    }>()

    for (const spec of specs) {
      const gid = spec.group_id ?? 'ungrouped'
      if (!groupMap.has(gid)) {
        groupMap.set(gid, {
          group_id: gid,
          group_name: spec.group_name ?? 'Thông số khác',
          group_slug: spec.group_slug ?? 'other',
          specs: [],
        })
      }
      groupMap.get(gid)!.specs.push(spec)
    }

    const groups = Array.from(groupMap.values())

    return NextResponse.json({ groups, total: specs.length })
  } catch (e) {
    console.error('[GET /api/v2/admin/specifications/by-category]', e)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
