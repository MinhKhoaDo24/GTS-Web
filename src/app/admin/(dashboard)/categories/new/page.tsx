import { getCategories } from '@/lib/dal/categories'
import { getDomains } from '@/lib/dal/misc'
import { CategoryForm } from '../_components/CategoryForm'
import { createCategoryAction } from '../actions'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Thêm danh mục mới - GTS Admin' }

export default async function NewCategoryPage() {
  const [categories, domains] = await Promise.all([
    getCategories(),
    getDomains(),
  ])

  return (
    <div className="w-full space-y-6">
      <CategoryForm
        parentCategories={categories.map((c) => ({ id: c.id, name: c.name }))}
        domains={domains.map((d: any) => ({ id: d.id, name: d.name }))}
        action={createCategoryAction}
      />
    </div>
  )
}
