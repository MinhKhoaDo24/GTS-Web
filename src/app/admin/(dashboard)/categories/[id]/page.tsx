import { notFound } from 'next/navigation'
import { getCategories, getCategoryById } from '@/lib/dal/categories'
import { getDomains } from '@/lib/dal/misc'
import { CategoryForm } from '../_components/CategoryForm'
import { updateCategoryAction } from '../actions'

interface Props {
  params: Promise<{ id: string }>
}

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Chỉnh sửa danh mục - GTS Admin' }

export default async function EditCategoryPage({ params }: Props) {
  const { id } = await params
  const [category, categories, domains] = await Promise.all([
    getCategoryById(id),
    getCategories(),
    getDomains(),
  ])

  if (!category) {
    notFound()
  }

  const boundAction = updateCategoryAction.bind(null, id)

  return (
    <div className="w-full space-y-6">
      <CategoryForm
        initialData={category as any}
        parentCategories={categories.map((c) => ({ id: c.id, name: c.name }))}
        domains={domains.map((d: any) => ({ id: d.id, name: d.name }))}
        action={boundAction}
      />
    </div>
  )
}
