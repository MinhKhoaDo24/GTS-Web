/**
 * API Route: /api/v2/admin/products
 *
 * GET  → Lấy danh sách sản phẩm (có phân trang, tìm kiếm, lọc)
 * POST → Tạo sản phẩm mới
 */

import { NextRequest, NextResponse } from 'next/server'
import { getProducts, createProduct } from '@/lib/dal'
import { z } from 'zod'

const productCreateSchema = z.object({
  name: z.string().min(2, 'Tên sản phẩm tối thiểu 2 ký tự'),
  slug: z.string().min(2, 'Slug tối thiểu 2 ký tự'),
  model: z.string().nullable().optional(),
  brand_id: z.string().min(1, 'Vui lòng chọn hãng sản xuất'),
  category_id: z.string().min(1, 'Vui lòng chọn danh mục'),
  family_id: z.string().nullable().optional(),
  domain_id: z.string().nullable().optional(),
  product_type: z.enum(['hardware', 'software', 'license', 'service', 'bundle']).default('hardware'),
  status: z.string().optional().default('active'),
  short_description: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  thumbnail: z.string().nullable().optional(),
  is_active: z.boolean().default(true),
  is_featured: z.boolean().default(false),
  seo_title: z.string().nullable().optional(),
  seo_description: z.string().nullable().optional(),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('q') || searchParams.get('search') || undefined
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '50', 10)
    const brandId = searchParams.get('brandId') || undefined
    const categoryId = searchParams.get('categoryId') || undefined

    const result = await getProducts({
      search,
      page,
      limit,
      brandId,
      categoryId,
    })

    return NextResponse.json({
      data: result.items,
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    })
  } catch (err) {
    console.error('Admin GET products error:', err)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = productCreateSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.format() }, { status: 400 })
    }

    const { id } = await createProduct(parsed.data)

    return NextResponse.json({ success: true, id }, { status: 201 })
  } catch (error: any) {
    console.error('Admin POST product error:', error)
    return NextResponse.json({ error: error?.message || 'Failed to create product' }, { status: 500 })
  }
}
