import Link from 'next/link'
import { Plus, FolderOpen, Edit2, Trash2, ToggleLeft, ToggleRight } from 'lucide-react'
import { getCategories } from '@/lib/dal'
import { CategoriesTableClient } from './_components/CategoriesTableClient'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Quản lý Danh mục' }

export default async function AdminCategoriesPage() {
  const categories = await getCategories()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Danh mục</h1>
          <p className="text-sm text-gray-500 mt-0.5">{categories.length} danh mục trong hệ thống</p>
        </div>
        <Link
          href="/admin/categories/new"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          Thêm danh mục
        </Link>
      </div>

      <CategoriesTableClient categories={categories as any[]} />
    </div>
  )
}
