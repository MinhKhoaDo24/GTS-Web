import { NextRequest, NextResponse } from 'next/server'
import {
  getProductRelationships,
  addProductRelationship,
  deleteProductRelationship,
  searchProductsForRelation,
} from '@/lib/dal/product-extras'

interface Params { params: Promise<{ id: string }> }

// GET /api/v2/admin/products/[id]/relations
// GET /api/v2/admin/products/[id]/relations?search=xxx — search mode
export async function GET(req: NextRequest, { params }: Params) {
  const { id } = await params
  try {
    const url = new URL(req.url)
    const search = url.searchParams.get('search')

    if (search !== null) {
      // Search mode for autocomplete
      const results = await searchProductsForRelation(search, id, 10)
      return NextResponse.json({ data: results })
    }

    const relations = await getProductRelationships(id)
    return NextResponse.json({ data: relations })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

// POST /api/v2/admin/products/[id]/relations
export async function POST(req: NextRequest, { params }: Params) {
  const { id } = await params
  try {
    const body = await req.json()
    if (!body.related_product_id) {
      return NextResponse.json({ error: 'related_product_id required' }, { status: 400 })
    }
    const result = await addProductRelationship({
      product_id: id,
      related_product_id: body.related_product_id,
      relationship_type: body.relationship_type ?? 'related',
      notes: body.notes ?? null,
    })
    return NextResponse.json({ success: true, data: result })
  } catch (e: any) {
    console.error(e)
    return NextResponse.json({ error: e?.message ?? 'Internal Server Error' }, { status: 500 })
  }
}

// DELETE /api/v2/admin/products/[id]/relations?relationId=xxx
export async function DELETE(req: NextRequest, { params }: Params) {
  await params
  try {
    const url = new URL(req.url)
    const relationId = url.searchParams.get('relationId')
    if (!relationId) {
      return NextResponse.json({ error: 'relationId required' }, { status: 400 })
    }
    await deleteProductRelationship(relationId)
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
