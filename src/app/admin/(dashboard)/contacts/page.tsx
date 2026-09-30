import { getContactRequests } from '@/lib/dal/misc'
import { ContactsTableClient } from './_components/ContactsTableClient'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Yêu cầu liên hệ & Báo giá - GTS Admin' }

interface Props {
  searchParams: Promise<{
    page?: string
    status?: string
    type?: string
  }>
}

export default async function AdminContactsPage({ searchParams }: Props) {
  const resolvedParams = await searchParams
  const page = Number(resolvedParams.page) || 1
  const status = resolvedParams.status || ''
  const type = resolvedParams.type || ''

  const result = await getContactRequests({
    page,
    limit: 20,
    status: status || undefined,
    type: type || undefined,
  })

  return (
    <div>
      <ContactsTableClient
        items={result.items as any[]}
        total={result.total}
        page={result.page}
        limit={result.limit}
        totalPages={result.totalPages}
        currentStatus={status}
      />
    </div>
  )
}
