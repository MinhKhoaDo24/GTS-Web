import { NextRequest, NextResponse } from 'next/server'
import { deleteCategory, updateCategory } from '@/lib/dal'

interface Params {
  params: Promise<{ id: string }>
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const { id } = await params
  try {
    await deleteCategory(id)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Không thể xóa danh mục (có thể do ràng buộc dữ liệu)' },
      { status: 400 }
    )
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const { id } = await params
  try {
    const body = await req.json()
    await updateCategory(id, body)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Không thể cập nhật danh mục' },
      { status: 400 }
    )
  }
}
