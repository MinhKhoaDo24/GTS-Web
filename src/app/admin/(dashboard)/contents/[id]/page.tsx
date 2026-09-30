import { notFound } from 'next/navigation'
import { getContentById } from '@/lib/dal/contents'
import { ContentForm } from '../_components/ContentForm'
import { updateContentAction } from '../actions'

interface Props {
  params: Promise<{ id: string }>
}

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Chỉnh sửa bài viết - GTS Admin' }

export default async function EditContentPage({ params }: Props) {
  const { id } = await params
  const item = await getContentById(id)

  if (!item) {
    notFound()
  }

  const boundAction = updateContentAction.bind(null, id)

  return (
    <div className="w-full space-y-6">
      <ContentForm initialData={item} action={boundAction} />
    </div>
  )
}
