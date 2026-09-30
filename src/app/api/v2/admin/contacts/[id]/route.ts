import { NextRequest, NextResponse } from 'next/server'
import { updateContactStatus } from '@/lib/dal/misc'
import { query } from '@/lib/db'

interface Params {
  params: Promise<{ id: string }>
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const { id } = await params
  try {
    const { status } = await req.json()
    await updateContactStatus(id, status)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Không thể cập nhật trạng thái liên hệ' },
      { status: 400 }
    )
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const { id } = await params
  try {
    await query('DELETE FROM contact_requests WHERE id = $1', [id])
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Không thể xóa yêu cầu' },
      { status: 400 }
    )
  }
}
