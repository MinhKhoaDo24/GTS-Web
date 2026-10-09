import { getAllSpecifications, getSpecificationGroups } from '@/lib/dal/specifications'
import { getCategories } from '@/lib/dal/categories'
import { SpecificationsPageClient } from './_components/SpecificationsPageClient'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Quản lý Thông số kỹ thuật - GTS Admin' }

export default async function AdminSpecificationsPage() {
  const [groups, specs, categories] = await Promise.all([
    getSpecificationGroups(),
    getAllSpecifications(),
    getCategories(),
  ])

  return (
    <SpecificationsPageClient
      initialGroups={groups}
      initialSpecs={specs}
      categories={categories}
    />
  )
}
