'use client'

import { useRouter, usePathname } from 'next/navigation'
import { Search, X, SlidersHorizontal } from 'lucide-react'
import { useCallback, useTransition } from 'react'

interface Brand { id: string; name: string }
interface Category { id: string; name: string }

interface Props {
  brands: Brand[]
  categories: Category[]
  currentBrandId?: string
  currentCategoryId?: string
  currentSearch?: string
  currentStatus?: string
}

export function ProductsFilters({
  brands, categories,
  currentBrandId, currentCategoryId,
  currentSearch, currentStatus,
}: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  const pushParams = useCallback((updates: Record<string, string | null>) => {
    const params = new URLSearchParams()
    if (currentSearch) params.set('search', currentSearch)
    if (currentBrandId) params.set('brandId', currentBrandId)
    if (currentCategoryId) params.set('categoryId', currentCategoryId)
    if (currentStatus) params.set('status', currentStatus)
    params.delete('page') // reset page on filter change

    for (const [k, v] of Object.entries(updates)) {
      if (v) params.set(k, v)
      else params.delete(k)
    }

    startTransition(() => router.push(`${pathname}?${params.toString()}`))
  }, [router, pathname, currentSearch, currentBrandId, currentCategoryId, currentStatus])

  const hasFilters = !!(currentSearch || currentBrandId || currentCategoryId || currentStatus)

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
      <div className="flex flex-wrap gap-3 items-center">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            defaultValue={currentSearch}
            onChange={(e) => {
              const val = e.target.value
              const debounceTimer = setTimeout(() => pushParams({ search: val || null }), 400)
              return () => clearTimeout(debounceTimer)
            }}
            placeholder="Tìm tên sản phẩm, model, slug..."
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 bg-gray-50"
          />
        </div>

        {/* Brand filter */}
        <select
          value={currentBrandId ?? ''}
          onChange={(e) => pushParams({ brandId: e.target.value || null })}
          className="text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500 bg-gray-50 min-w-[140px]"
        >
          <option value="">Tất cả hãng</option>
          {brands.map((b) => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </select>

        {/* Category filter */}
        <select
          value={currentCategoryId ?? ''}
          onChange={(e) => pushParams({ categoryId: e.target.value || null })}
          className="text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500 bg-gray-50 min-w-[150px]"
        >
          <option value="">Tất cả danh mục</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        {/* Status filter */}
        <select
          value={currentStatus ?? ''}
          onChange={(e) => pushParams({ status: e.target.value || null })}
          className="text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500 bg-gray-50"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="active">Đang hiển thị</option>
          <option value="inactive">Đã ẩn</option>
        </select>

        {/* Clear filters */}
        {hasFilters && (
          <button
            onClick={() => router.push(pathname)}
            className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-700 px-3 py-2 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            Xóa bộ lọc
          </button>
        )}

        {isPending && (
          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        )}
      </div>
    </div>
  )
}
