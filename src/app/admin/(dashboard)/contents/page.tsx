import { getContents, type ContentType } from '@/lib/dal/contents'
import { ContentsTableClient } from './_components/ContentsTableClient'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Quản lý Bài viết & Tin tức - GTS Admin' }

interface Props {
  searchParams: Promise<{
    page?: string
    type?: string
    search?: string
  }>
}

export default async function AdminContentsPage({ searchParams }: Props) {
  const resolvedParams = await searchParams
  const page = Number(resolvedParams.page) || 1
  const type = (resolvedParams.type || '') as ContentType | ''
  const search = resolvedParams.search || ''

  const result = await getContents({
    page,
    limit: 15,
    type,
    search,
  })

  return (
    <div>
      <ContentsTableClient
        contents={result.items}
        total={result.total}
        page={result.page}
        limit={result.limit}
        totalPages={result.totalPages}
        currentType={type}
        currentSearch={search}
      />
    </div>
  )
}
