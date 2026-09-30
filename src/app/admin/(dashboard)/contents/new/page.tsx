import { ContentForm } from '../_components/ContentForm'
import { createContentAction } from '../actions'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Thêm bài viết mới - GTS Admin' }

export default async function NewContentPage() {
  return (
    <div className="w-full space-y-6">
      <ContentForm action={createContentAction} />
    </div>
  )
}
