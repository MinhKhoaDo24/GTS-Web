'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import {
  RotateCcw,
  Search,
  ChevronRight,
  ChevronDown,
  Check,
  Tag,
  Layers,
  Cpu,
  Activity,
  Globe2,
  FolderTree,
  X,
  Filter,
  ShieldCheck,
  Network,
  Server,
  Wifi,
  Boxes
} from 'lucide-react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { Category, Brand, Domain } from '@/types/database'
import {
  CATALOG_TAXONOMY,
  CategoryCatalogItem,
  BrandCatalogItem,
  ProductSeriesItem,
  getCategoryBySlug,
  getBrandBySlug,
  getSeriesBySlug,
  getAllUniqueBrands,
} from '@/lib/catalogTaxonomy'

interface ProductFiltersProps {
  categories?: Category[]
  brands?: Brand[]
  domains?: Domain[]
  currentCategory?: string
  currentBrand?: string
  currentSeries?: string
  currentDomain?: string
  currentType?: string
  currentLifecycle?: string
  searchQuery?: string
  totalCount?: number
}

// Icon helper
function getCategoryIcon(iconName: string) {
  switch (iconName) {
    case 'Layers':
      return <Layers className="w-4 h-4 text-blue-600" />
    case 'Network':
      return <Network className="w-4 h-4 text-indigo-600" />
    case 'ShieldCheck':
      return <ShieldCheck className="w-4 h-4 text-emerald-600" />
    case 'Server':
      return <Server className="w-4 h-4 text-amber-600" />
    case 'Wifi':
      return <Wifi className="w-4 h-4 text-cyan-600" />
    case 'Cpu':
      return <Cpu className="w-4 h-4 text-purple-600" />
    default:
      return <Boxes className="w-4 h-4 text-blue-600" />
  }
}

export function ProductFilters({
  currentCategory = '',
  currentBrand = '',
  currentSeries = '',
  searchQuery = '',
  totalCount,
}: ProductFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [keyword, setKeyword] = useState(searchQuery)
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)

  useEffect(() => {
    setKeyword(searchQuery)
  }, [searchQuery])

  // Cập nhật URLSearchParams
  const updateFilters = (params: Record<string, string | null>) => {
    const nextParams = new URLSearchParams(searchParams.toString())
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        nextParams.set(key, value)
      } else {
        nextParams.delete(key)
      }
    })
    nextParams.delete('page')
    router.push(`/san-pham?${nextParams.toString()}`)
    setMobileFilterOpen(false)
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateFilters({ q: keyword.trim() || null })
  }

  const resetAll = () => {
    setKeyword('')
    router.push('/san-pham')
    setMobileFilterOpen(false)
  }

  // Đối tượng Cấp 1 đang chọn
  const activeCategoryObj = getCategoryBySlug(currentCategory)

  // Danh sách các hãng hiển thị ở Cấp 2:
  // Nếu đã chọn Cấp 1 -> Lấy các hãng thuộc Cấp 1 đó.
  // Nếu chưa chọn Cấp 1 -> Hiển thị tất cả các hãng có trên hệ thống.
  const availableBrands: { id: string; name: string; slug: string; tagline?: string }[] =
    activeCategoryObj
      ? activeCategoryObj.brands
      : getAllUniqueBrands()

  // Đối tượng Cấp 2 đang chọn
  const activeBrandObj = getBrandBySlug(currentBrand, currentCategory)

  // Danh sách dòng sản phẩm hiển thị ở Cấp 3:
  // Nếu đã chọn Hãng + Loại -> Lấy series chính xác của cặp đó.
  // Nếu chỉ chọn Hãng -> Lấy tổng hợp series của Hãng đó trên các loại.
  let availableSeries: ProductSeriesItem[] = []
  if (activeCategoryObj && activeBrandObj) {
    const brandInCat = activeCategoryObj.brands.find((b) => b.slug === currentBrand)
    availableSeries = brandInCat?.seriesList || []
  } else if (activeBrandObj) {
    // Tập hợp series của brand này
    for (const cat of CATALOG_TAXONOMY) {
      const b = cat.brands.find((item) => item.slug === currentBrand)
      if (b) availableSeries.push(...b.seriesList)
    }
  } else if (activeCategoryObj) {
    // Tập hợp series của category này
    for (const b of activeCategoryObj.brands) {
      availableSeries.push(...b.seriesList)
    }
  }

  // Đối tượng Cấp 3 đang chọn
  const activeSeriesInfo = getSeriesBySlug(currentSeries)

  const hasActiveFilters = Boolean(
    currentCategory || currentBrand || currentSeries || searchQuery
  )

  const filterContent = (
    <div className="space-y-6">
      {/* ── TÌM KIẾM NHANH MODEL / P/N ──────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
        <form onSubmit={handleSearchSubmit} className="space-y-2">
          <label className="text-[11px] font-black uppercase tracking-wider text-slate-700 block">
            Tìm theo Model / P/N / Tên:
          </label>
          <div className="relative">
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="VD: C9200L, FG-60F, R750..."
              className="w-full text-xs font-mono bg-slate-50 border border-slate-300 px-3 py-2.5 pr-8 focus:outline-none focus:border-[#1D4ED8] focus:bg-white rounded-xl transition-colors"
            />
            <button
              type="submit"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#1D4ED8] cursor-pointer"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>

      {/* ── BỘ LỌC ĐANG CHỌN (ACTIVE CHIPS) ─────────────────────────────── */}
      {hasActiveFilters && (
        <div className="bg-white rounded-2xl border border-blue-200 bg-blue-50/30 p-4 space-y-2.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#1D4ED8] flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              <span>Đang áp dụng bộ lọc</span>
            </span>
            <button
              type="button"
              onClick={resetAll}
              className="text-[11px] font-bold text-rose-600 hover:text-rose-800 inline-flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Xóa tất cả</span>
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {/* Chip Cấp 1 */}
            {activeCategoryObj && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-[#1D4ED8] text-white px-2.5 py-1 rounded-lg shadow-2xs">
                <span> {activeCategoryObj.shortName}</span>
                <button
                  type="button"
                  onClick={() => updateFilters({ category: null })}
                  className="hover:text-rose-200 ml-1 cursor-pointer"
                  title="Xóa lọc loại sản phẩm"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {/* Chip Cấp 2 */}
            {activeBrandObj && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-slate-900 text-white px-2.5 py-1 rounded-lg shadow-2xs">
                <span> {activeBrandObj.name}</span>
                <button
                  type="button"
                  onClick={() => updateFilters({ brand: null })}
                  className="hover:text-rose-200 ml-1 cursor-pointer"
                  title="Xóa lọc hãng"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {/* Chip Cấp 3 */}
            {currentSeries && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-emerald-700 text-white px-2.5 py-1 rounded-lg shadow-2xs">
                <span>
                   {activeSeriesInfo?.series.name || currentSeries}
                </span>
                <button
                  type="button"
                  onClick={() => updateFilters({ series: null })}
                  className="hover:text-rose-200 ml-1 cursor-pointer"
                  title="Xóa lọc dòng sản phẩm"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {/* Chip Search */}
            {searchQuery && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-slate-200 text-slate-800 px-2.5 py-1 rounded-lg">
                <span>"{searchQuery}"</span>
                <button
                  type="button"
                  onClick={() => updateFilters({ q: null })}
                  className="hover:text-rose-600 ml-1 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        </div>
      )}

      {/* ── CẤP 1: LOẠI SẢN PHẨM (CATEGORY) ─────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
        <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
              Loại thiết bị
            </h3>
          </div>
          {currentCategory && (
            <button
              type="button"
              onClick={() => updateFilters({ category: null })}
              className="text-[11px] font-semibold text-slate-400 hover:text-rose-600 cursor-pointer"
            >
              Bỏ chọn
            </button>
          )}
        </div>

        <div className="space-y-1">
          <button
            type="button"
            onClick={() => updateFilters({ category: null })}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
              !currentCategory
                ? 'bg-blue-50 text-[#1D4ED8] font-black'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <span>Tất cả loại sản phẩm</span>
            {!currentCategory && <Check className="w-3.5 h-3.5 text-[#1D4ED8]" />}
          </button>

          {CATALOG_TAXONOMY.map((cat) => {
            const isSelected = cat.slug === currentCategory
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => updateFilters({ category: cat.slug })}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                  isSelected
                    ? 'bg-[#1D4ED8] text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-[#1D4ED8]'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <span className={isSelected ? 'text-white' : ''}>
                    {getCategoryIcon(cat.icon)}
                  </span>
                  <span className="truncate">{cat.shortName}</span>
                </div>
                {isSelected && (
                  <Check className="w-3.5 h-3.5 text-white flex-shrink-0" />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── CẤP 2: HÃNG SẢN XUẤT (BRAND) ─────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
        <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
              Hãng sản xuất
            </h3>
          </div>
          {currentBrand && (
            <button
              type="button"
              onClick={() => updateFilters({ brand: null })}
              className="text-[11px] font-semibold text-slate-400 hover:text-rose-600 cursor-pointer"
            >
              Bỏ chọn
            </button>
          )}
        </div>

        {activeCategoryObj && (
          <div className="text-[10px] text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg mb-2">
            Hãng có sản phẩm: <strong>{activeCategoryObj.shortName}</strong>
          </div>
        )}

        <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
          <button
            type="button"
            onClick={() => updateFilters({ brand: null })}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
              !currentBrand
                ? 'bg-blue-50 text-[#1D4ED8] font-black'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <span>Tất cả các hãng</span>
            {!currentBrand && <Check className="w-3.5 h-3.5 text-[#1D4ED8]" />}
          </button>

          {availableBrands.map((b) => {
            const isSelected = b.slug === currentBrand
            return (
              <button
                key={b.id}
                type="button"
                onClick={() => updateFilters({ brand: b.slug })}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-[#1D4ED8]'
                }`}
              >
                <span className="truncate">{b.name}</span>
                {isSelected ? (
                  <Check className="w-3.5 h-3.5 text-white flex-shrink-0" />
                ) : (
                  <ChevronRight className="w-3 h-3 text-slate-300" />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── CẤP 3: DÒNG SẢN PHẨM / SERIES ─────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
        <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
              Dòng máy (Series)
            </h3>
          </div>
          {currentSeries && (
            <button
              type="button"
              onClick={() => updateFilters({ series: null })}
              className="text-[11px] font-semibold text-slate-400 hover:text-rose-600 cursor-pointer"
            >
              Bỏ chọn
            </button>
          )}
        </div>

        {availableSeries.length > 0 ? (
          <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
            <button
              type="button"
              onClick={() => updateFilters({ series: null })}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                !currentSeries
                  ? 'bg-blue-50 text-[#1D4ED8] font-black'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <span>Tất cả dòng sản phẩm</span>
              {!currentSeries && <Check className="w-3.5 h-3.5 text-[#1D4ED8]" />}
            </button>

            {availableSeries.map((ser) => {
              const isSelected = ser.slug === currentSeries
              return (
                <button
                  key={ser.id}
                  type="button"
                  onClick={() => updateFilters({ series: ser.slug })}
                  className={`w-full flex flex-col p-2.5 rounded-xl text-xs transition-all text-left border cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-50 text-emerald-950 border-emerald-300 font-black shadow-xs'
                      : 'border-slate-100 bg-slate-50/50 hover:bg-white hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-bold text-[11px] truncate">{ser.name}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-emerald-700 flex-shrink-0" />}
                  </div>
                  {ser.description && (
                    <span className="text-[10px] text-slate-500 font-normal line-clamp-1 mt-0.5">
                      {ser.description}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        ) : (
          <div className="p-3 text-center bg-slate-50 rounded-xl text-slate-400 text-xs">
            Chọn <strong>Loại</strong> hoặc <strong>Hãng</strong> ở trên để xem các dòng máy tương ứng.
          </div>
        )}
      </div>
    </div>
  )

  return (
    <>
      {/* ── NÚT MỞ BỘ LỌC TRÊN MOBILE ────────────────────────────────────── */}
      <div className="lg:hidden mb-4">
        <button
          type="button"
          onClick={() => setMobileFilterOpen(true)}
          className="w-full flex items-center justify-center gap-2 bg-[#1D4ED8] text-white py-3 px-4 rounded-2xl font-bold text-xs shadow-md shadow-blue-500/20 cursor-pointer"
        >
          <Filter className="w-4 h-4" />
          <span>Lọc sản phẩm 3 cấp độ {hasActiveFilters ? '(Đang lọc)' : ''}</span>
          {hasActiveFilters && (
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          )}
        </button>
      </div>

      {/* ── SIDEBAR TRÊN DESKTOP ─────────────────────────────────────────── */}
      <aside className="hidden lg:block w-72 xl:w-80 flex-shrink-0">
        {filterContent}
      </aside>

      {/* ── DRAWER BỘ LỌC TRÊN MOBILE ────────────────────────────────────── */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="relative w-full max-w-xs sm:max-w-sm bg-white h-full shadow-2xl z-10 flex flex-col p-4 overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <span className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Filter className="w-4 h-4 text-[#1D4ED8]" />
                <span>Bộ lọc 3 cấp độ</span>
              </span>
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {filterContent}
          </div>
        </div>
      )}
    </>
  )
}
