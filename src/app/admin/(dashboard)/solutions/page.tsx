import type { Metadata } from 'next'
import Link from 'next/link'
import { Plus, Layers } from 'lucide-react'
import { getSolutions } from '@/lib/dal/solutions'
import { SolutionsTableClient } from './_components/SolutionsTableClient'

export const metadata: Metadata = {
  title: 'Quản lý Giải pháp Doanh nghiệp | Admin GTS',
}

export default async function AdminSolutionsPage() {
  const { items: solutions } = await getSolutions({ limit: 100 })

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Quản lý Giải pháp Doanh nghiệp
            </h1>
            <span className="text-xs font-semibold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-100">
              {solutions.length} giải pháp
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Soạn thảo, quản lý các bài kiến trúc & giải pháp hạ tầng CNTT hiển thị trên trang /giai-phap
          </p>
        </div>

        <Link
          href="/admin/solutions/new"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 text-xs font-semibold rounded-xl transition-all shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm giải pháp mới</span>
        </Link>
      </div>

      {/* Solutions Table */}
      <SolutionsTableClient initialSolutions={solutions} />
    </div>
  )
}
