import { NextRequest, NextResponse } from 'next/server'
import {
  getProductVariants,
  createProductVariant,
  updateProductVariant,
  deleteProductVariant,
} from '@/lib/dal/product-extras'

interface Params { params: Promise<{ id: string }> }

// GET /api/v2/admin/products/[id]/variants
export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params
  try {
    const variants = await getProductVariants(id)
    return NextResponse.json({ data: variants })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

// POST /api/v2/admin/products/[id]/variants
export async function POST(req: NextRequest, { params }: Params) {
  const { id } = await params
  try {
    const body = await req.json()
    const result = await createProductVariant({ ...body, product_id: id })
    return NextResponse.json({ success: true, data: result })
  } catch (e: any) {
    console.error(e)
    return NextResponse.json({ error: e?.message ?? 'Internal Server Error' }, { status: 500 })
  }
}

// PATCH /api/v2/admin/products/[id]/variants?variantId=xxx
export async function PATCH(req: NextRequest, { params }: Params) {
  await params
  try {
    const url = new URL(req.url)
    const variantId = url.searchParams.get('variantId')
    if (!variantId) {
      return NextResponse.json({ error: 'variantId required' }, { status: 400 })
    }
    const body = await req.json()
    await updateProductVariant(variantId, body)
    return NextResponse.json({ success: true })
  } catch (e: any) {
    console.error(e)
    return NextResponse.json({ error: e?.message ?? 'Internal Server Error' }, { status: 500 })
  }
}

// DELETE /api/v2/admin/products/[id]/variants?variantId=xxx
export async function DELETE(req: NextRequest, { params }: Params) {
  await params
  try {
    const url = new URL(req.url)
    const variantId = url.searchParams.get('variantId')
    if (!variantId) {
      return NextResponse.json({ error: 'variantId required' }, { status: 400 })
    }
    await deleteProductVariant(variantId)
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
