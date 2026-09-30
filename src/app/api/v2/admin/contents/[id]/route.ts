import { NextRequest, NextResponse } from 'next/server'
import { deleteContent, updateContent } from '@/lib/dal/contents'

interface Params {
  params: Promise<{ id: string }>
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const { id } = await params
  try {
    await deleteContent(id)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Không thể xóa bài viết / nội dung' },
      { status: 400 }
    )
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const { id } = await params
  try {
    const body = await req.json()
    await updateContent(id, body)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Không thể cập nhật nội dung' },
      { status: 400 }
    )
  }
}
