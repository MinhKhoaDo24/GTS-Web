import { NextRequest, NextResponse } from 'next/server'
import { getProductById, updateProduct, toggleProductField, deleteProduct } from '@/lib/dal'
import { z } from 'zod'

interface Params {
  params: Promise<{ id: string }>
}

const productUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  slug: z.string().min(2).optional(),
  model: z.string().nullable().optional(),
  brand_id: z.string().optional(),
  family_id: z.string().nullable().optional(),
  domain_id: z.string().nullable().optional(),
  category_id: z.string().optional(),
  product_type: z.enum(['hardware', 'software', 'license', 'service', 'bundle']).optional(),
  short_description: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  thumbnail: z.string().nullable().optional(),
  status: z.string().optional(),
  is_active: z.boolean().optional(),
  is_featured: z.boolean().optional(),
  seo_title: z.string().nullable().optional(),
  seo_description: z.string().nullable().optional(),
})

// GET /api/v2/admin/products/[id] — Lấy chi tiết 1 sản phẩm
export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const product = await getProductById(id)

    if (!product) {
      return NextResponse.json({ error: 'Sản phẩm không tồn tại' }, { status: 404 })
    }

    return NextResponse.json({ data: product })
  } catch (error) {
    console.error('Fetch product error:', error)
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 })
  }
}

// PUT /api/v2/admin/products/[id] — Cập nhật thông tin sản phẩm
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const body = await request.json()
    const parsed = productUpdateSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.format() }, { status: 400 })
    }

    await updateProduct(id, parsed.data)
    const updated = await getProductById(id)

    return NextResponse.json({ data: updated, success: true })
  } catch (error) {
    console.error('Update product error:', error)
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
  }
}

// PATCH /api/v2/admin/products/[id] — Toggle nhanh trạng thái
export async function PATCH(req: NextRequest, { params }: Params) {
  const { id } = await params
  try {
    const body = await req.json()
    if ('is_active' in body) {
      await toggleProductField(id, 'is_active', body.is_active)
    } else if ('is_featured' in body) {
      await toggleProductField(id, 'is_featured', body.is_featured)
    }
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

// DELETE /api/v2/admin/products/[id] — Xóa sản phẩm
export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params
  try {
    await deleteProduct(id)
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
