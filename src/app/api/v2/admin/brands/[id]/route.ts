import { NextRequest, NextResponse } from 'next/server'
import { deleteBrand, updateBrand } from '@/lib/dal'

interface Params {
  params: Promise<{ id: string }>
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const { id } = await params
  try {
    await deleteBrand(id)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Không thể xóa hãng (có sản phẩm đang liên kết)' },
      { status: 400 }
    )
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const { id } = await params
  try {
    const body = await req.json()
    await updateBrand(id, body)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Không thể cập nhật hãng sản xuất' },
      { status: 400 }
    )
  }
}
