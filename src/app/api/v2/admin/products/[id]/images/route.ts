import { NextRequest, NextResponse } from 'next/server'
import {
  getProductImages,
  addProductImage,
  updateProductImage,
  deleteProductImage,
  reorderProductImages,
} from '@/lib/dal/product-extras'

interface Params { params: Promise<{ id: string }> }

// GET /api/v2/admin/products/[id]/images
export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params
  try {
    const images = await getProductImages(id)
    return NextResponse.json({ data: images })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

// POST /api/v2/admin/products/[id]/images
export async function POST(req: NextRequest, { params }: Params) {
  const { id } = await params
  try {
    const body = await req.json()
    const result = await addProductImage({
      product_id: id,
      image_url: body.image_url,
      image_type: body.image_type ?? 'gallery',
      alt_text: body.alt_text ?? null,
      sort_order: body.sort_order ?? 0,
      is_primary: body.is_primary ?? false,
    })
    return NextResponse.json({ success: true, data: result })
  } catch (e: any) {
    console.error(e)
    return NextResponse.json({ error: e?.message ?? 'Internal Server Error' }, { status: 500 })
  }
}

// PATCH /api/v2/admin/products/[id]/images — reorder hoặc set primary
export async function PATCH(req: NextRequest, { params }: Params) {
  const { id } = await params
  try {
    const body = await req.json()

    if (body.reorder && Array.isArray(body.reorder)) {
      await reorderProductImages(body.reorder)
      return NextResponse.json({ success: true })
    }

    if (body.image_id) {
      await updateProductImage(body.image_id, {
        product_id: id,
        is_primary: body.is_primary,
        alt_text: body.alt_text,
        sort_order: body.sort_order,
      })
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  } catch (e: any) {
    console.error(e)
    return NextResponse.json({ error: e?.message ?? 'Internal Server Error' }, { status: 500 })
  }
}

// DELETE /api/v2/admin/products/[id]/images?imageId=xxx
export async function DELETE(req: NextRequest, { params }: Params) {
  await params
  try {
    const url = new URL(req.url)
    const imageId = url.searchParams.get('imageId')
    if (!imageId) {
      return NextResponse.json({ error: 'imageId required' }, { status: 400 })
    }
    await deleteProductImage(imageId)
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
