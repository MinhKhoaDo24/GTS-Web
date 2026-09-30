import { NextRequest, NextResponse } from 'next/server'
import { toggleProductField, deleteProduct } from '@/lib/dal'

interface Params { params: Promise<{ id: string }> }

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
