/**
 * API Route: /api/v2/admin/categories/[id]/specifications
 * 
 * Quản lý mapping giữa Danh mục và Thông số kỹ thuật (category_specifications).
 * - GET: Lấy danh sách specification_id được phép cho category [id]
 * - PUT / POST: Cập nhật danh sách specification_id cho category [id]
 */

import { NextRequest, NextResponse } from 'next/server'
import { getCategorySpecMappings, setCategorySpecMappings } from '@/lib/dal/specifications'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ id: string }>
}

export async function GET(_req: NextRequest, { params }: Props) {
  try {
    const { id: categoryId } = await params
    if (!categoryId) {
      return NextResponse.json({ error: 'Category ID is required' }, { status: 400 })
    }

    const mappings = await getCategorySpecMappings(categoryId)
    return NextResponse.json({
      categoryId,
      specificationIds: mappings,
      requiredIds: [],
      mappings,
      total: mappings.length,
    })
  } catch (error) {
    console.error('[GET /api/v2/admin/categories/[id]/specifications]', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: Props) {
  try {
    const { id: categoryId } = await params
    if (!categoryId) {
      return NextResponse.json({ error: 'Category ID is required' }, { status: 400 })
    }

    const body = await req.json()
    const { specificationIds, requiredIds } = body

    if (!Array.isArray(specificationIds)) {
      return NextResponse.json({ error: 'specificationIds must be an array' }, { status: 400 })
    }

    await setCategorySpecMappings(categoryId, specificationIds)

    return NextResponse.json({
      success: true,
      message: 'Cập nhật danh sách thông số cho danh mục thành công',
      categoryId,
      totalMapped: specificationIds.length,
    })
  } catch (error) {
    console.error('[PUT /api/v2/admin/categories/[id]/specifications]', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest, props: Props) {
  return PUT(req, props)
}
