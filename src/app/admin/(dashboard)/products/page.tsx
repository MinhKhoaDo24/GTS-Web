import { Suspense } from 'react'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { getProducts } from '@/lib/dal'
import { getBrands } from '@/lib/dal'
import { getCategories } from '@/lib/dal'
import { ProductsTable } from './_components/ProductsTable'
import { ProductsFilters } from './_components/ProductsFilters'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Quản lý Sản phẩm' }

interface PageProps {
  searchParams: Promise<{
    page?: string
    search?: string
    brandId?: string
    categoryId?: string
    status?: string
  }>
}

export default async function AdminProductsPage({ searchParams }: PageProps) {
  const params = await searchParams
  const page = Math.max(1, Number(params.page ?? 1))
  const search = params.search ?? ''
  const brandId = params.brandId
  const categoryId = params.categoryId
  const isActive = params.status === 'inactive' ? false : params.status === 'active' ? true : undefined

  const [result, brands, categories] = await Promise.all([
    getProducts({ page, limit: 20, search, brandId, categoryId, isActive }),
    getBrands(),
    getCategories(),
  ])

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Quản lý Sản phẩm</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {result.total} sản phẩm trong hệ thống
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm sản phẩm</span>
        </Link>
      </div>

      {/* Filters */}
      <ProductsFilters
        brands={brands as any[]}
        categories={categories}
        currentBrandId={brandId}
        currentCategoryId={categoryId}
        currentSearch={search}
        currentStatus={params.status}
      />

      {/* Table */}
      <Suspense fallback={<TableSkeleton />}>
        <ProductsTable
          items={result.items}
          total={result.total}
          page={result.page}
          totalPages={result.totalPages}
        />
      </Suspense>
    </div>
  )
}

function TableSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div className="p-4 space-y-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />
        ))}
      </div>
    </div>
  )
}
