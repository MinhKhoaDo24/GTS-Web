import type { Metadata } from 'next'
import Link from 'next/link'
import { query, queryOne } from '@/lib/db'
import type { Category, Brand, Domain, ProductType, LifecycleStatus } from '@/types/database'
import { ProductCard } from '@/components/ProductCard'
import { ProductFilters } from '@/components/ProductFilters'
import {
  ChevronRight,
  PackageSearch,
  Home,
  ShieldCheck,
  Award,
  ArrowUpDown,
  FileCheck2,
  Cpu,
  Layers,
  Sparkles,
  Boxes
} from 'lucide-react'
import {
  getCategoryBySlug,
  getBrandBySlug,
  getSeriesBySlug,
} from '@/lib/catalogTaxonomy'
import { buildCatalogFromDb } from '@/lib/catalogFromDb'

export const metadata: Metadata = {
  title: 'Sản phẩm',
  description:
    'Danh mục thiết bị mạng doanh nghiệp & máy chủ chính hãng tại GTS: Cisco, Fortinet, HPE Aruba, Dell Technologies, Ubiquiti. Đầy đủ chứng chỉ CO/CQ và bảo hành chính hãng.',
}

interface PageProps {
  searchParams: Promise<{
    domain?: string
    category?: string
    brand?: string
    series?: string
    type?: string
    lifecycle?: string
    sort?: string
    q?: string
    page?: string
  }>
}

interface CatalogProductItem {
  id: string
  name: string
  slug: string
  model: string | null
  part_number: string | null
  sku: string | null
  product_type: string
  thumbnail: string | null
  brand: { name: string; slug: string; logo?: string | null } | null
  category: { name: string; slug: string } | null
  domain?: { name: string; slug: string } | null
  series_slug?: string
  specs_summary: string | null
  lifecycle_status: string
  is_featured: boolean
}

export default async function ProductCatalogPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams
  const domainSlug = resolvedParams.domain || ''
  const categorySlug = resolvedParams.category || ''
  const brandSlug = resolvedParams.brand || ''
  const seriesSlug = resolvedParams.series || ''
  const typeFilter = resolvedParams.type || ''
  const lifecycleFilter = resolvedParams.lifecycle || ''
  const sort = resolvedParams.sort || 'latest'
  const searchQuery = resolvedParams.q || ''
  const currentPage = Math.max(1, parseInt(resolvedParams.page || '1', 10))
  const pageSize = 12

  // Truy vấn taxonomy động từ database
  const catalogTaxonomy = await buildCatalogFromDb()

  // Điều kiện truy vấn sản phẩm DB
  const conditions: string[] = ['p.is_active = true']
  const params: any[] = []
  let paramIdx = 1

  if (categorySlug) {
    conditions.push(`c.slug = $${paramIdx++}`)
    params.push(categorySlug)
  }

  if (brandSlug) {
    conditions.push(`b.slug = $${paramIdx++}`)
    params.push(brandSlug)
  }

  if (seriesSlug) {
    conditions.push(`f.slug = $${paramIdx++}`)
    params.push(seriesSlug)
  }

  if (searchQuery) {
    conditions.push(
      `(p.name ILIKE $${paramIdx} OR p.model ILIKE $${paramIdx} OR p.short_description ILIKE $${paramIdx})`
    )
    params.push(`%${searchQuery}%`)
    paramIdx++
  }

  let dbProducts: CatalogProductItem[] = []

  try {
    const listSql = `
      SELECT 
        p.id, p.name, p.slug, p.model, p.thumbnail, p.product_type, p.is_featured, p.short_description,
        b.name as brand_name, b.slug as brand_slug, b.logo as brand_logo,
        c.name as category_name, c.slug as category_slug,
        f.slug as series_slug, f.name as series_name,
        (SELECT pv.part_number FROM product_variants pv WHERE pv.product_id = p.id AND pv.is_active = true ORDER BY pv.id ASC LIMIT 1) as part_number,
        (SELECT pv.sku FROM product_variants pv WHERE pv.product_id = p.id AND pv.is_active = true ORDER BY pv.id ASC LIMIT 1) as sku,
        COALESCE(
             (SELECT string_agg(s.name || ': ' || COALESCE(ps.value_text, ps.value_number::text || COALESCE(' ' || ps.unit_override, ' ' || s.unit, ''), CASE WHEN ps.value_boolean = true THEN 'Có' WHEN ps.value_boolean = false THEN 'Không' ELSE NULL END, ps.min_value::text || ' - ' || ps.max_value::text || COALESCE(' ' || ps.unit_override, ' ' || s.unit, ''), ''), ' • ')
              FROM product_specifications ps
              JOIN specifications s ON ps.specification_id = s.id
              WHERE ps.product_id = p.id
              AND (ps.value_text IS NOT NULL OR ps.value_number IS NOT NULL OR ps.value_boolean IS NOT NULL OR ps.min_value IS NOT NULL)),
             (SELECT pv.specifications_summary FROM product_variants pv WHERE pv.product_id = p.id AND pv.is_active = true ORDER BY pv.id ASC LIMIT 1)
           ) as specs_summary,
        (SELECT pl.status FROM product_lifecycle pl WHERE pl.product_id = p.id LIMIT 1) as lifecycle_status
      FROM products p
      JOIN brands b ON p.brand_id = b.id
      JOIN categories c ON p.category_id = c.id
      LEFT JOIN product_families f ON p.family_id = f.id
      WHERE ${conditions.join(' AND ')}
      LIMIT 100
    `
    const rows = await query(listSql, params)
    dbProducts = rows.map((p) => ({
      id: String(p.id),
      name: p.name,
      slug: p.slug,
      model: p.model,
      part_number: p.part_number,
      sku: p.sku,
      product_type: p.product_type,
      thumbnail: p.thumbnail,
      brand: p.brand_name
        ? { name: p.brand_name, slug: p.brand_slug, logo: p.brand_logo }
        : null,
      category: p.category_name
        ? { name: p.category_name, slug: p.category_slug }
        : null,
      series_slug: p.series_slug || undefined,
      specs_summary: p.specs_summary || p.short_description || null,
      lifecycle_status: p.lifecycle_status || 'active',
      is_featured: Boolean(p.is_featured),
    }))
  } catch {
    dbProducts = []
  }

  // CHỈ HIỂN THỊ SẢN PHẨM TRUY VẤN TỪ DATABASE
  const filteredProducts = [...dbProducts]

  // Sắp xếp
  if (sort === 'featured') {
    filteredProducts.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0))
  } else if (sort === 'name_asc') {
    filteredProducts.sort((a, b) => a.name.localeCompare(b.name))
  } else if (sort === 'name_desc') {
    filteredProducts.sort((a, b) => b.name.localeCompare(a.name))
  }

  const totalCount = filteredProducts.length
  const totalPages = Math.ceil(totalCount / pageSize)
  const offset = (currentPage - 1) * pageSize
  const displayedProducts = filteredProducts.slice(offset, offset + pageSize)

  // Thông tin tiêu đề trang động theo 3 cấp độ từ taxonomy thực tế
  const activeCategoryObj = getCategoryBySlug(categorySlug, catalogTaxonomy)
  const activeBrandObj = getBrandBySlug(brandSlug, categorySlug, catalogTaxonomy)
  const activeSeriesInfo = getSeriesBySlug(seriesSlug, catalogTaxonomy)

  let pageHeading = 'Thiết Bị Phần Cứng & Hạ Tầng Mạng Enterprise'
  let pageSubheading =
    'Phân phối thiết bị chính hãng Cisco, HPE Aruba, Fortinet, Dell Technologies, Ubiquiti. Đầy đủ chứng chỉ CO/CQ, hồ sơ xuất xứ và hỗ trợ kỹ thuật chuyên sâu.'

  if (activeSeriesInfo) {
    pageHeading = `${activeSeriesInfo.series.name}`
    pageSubheading = `${activeSeriesInfo.series.description || 'Dòng thiết bị cao cấp chính hãng do GTS phân phối và hỗ trợ kỹ thuật chuyên sâu.'}`
  } else if (activeCategoryObj && activeBrandObj) {
    pageHeading = `${activeCategoryObj.shortName} — ${activeBrandObj.name}`
    pageSubheading = `Danh mục thiết bị ${activeCategoryObj.name.toLowerCase()} chính hãng thương hiệu ${activeBrandObj.name} do GTS phân phối trực tiếp.`
  } else if (activeCategoryObj) {
    pageHeading = activeCategoryObj.name
    pageSubheading = activeCategoryObj.description || `Các dòng sản phẩm ${activeCategoryObj.name.toLowerCase()} chính hãng cho doanh nghiệp.`
  } else if (activeBrandObj) {
    pageHeading = `Thiết Bị Chính Hãng ${activeBrandObj.name}`
    pageSubheading = `Giải pháp phần cứng và hạ tầng công nghệ thương hiệu ${activeBrandObj.name} kèm bảo hành và hỗ trợ kỹ thuật 24/7.`
  }

  // Helper build URL bộ lọc
  const buildFilterUrl = (newParams: Record<string, string | null>) => {
    const p = new URLSearchParams()
    if (categorySlug) p.set('category', categorySlug)
    if (brandSlug) p.set('brand', brandSlug)
    if (seriesSlug) p.set('series', seriesSlug)
    if (searchQuery) p.set('q', searchQuery)
    if (sort) p.set('sort', sort)

    Object.entries(newParams).forEach(([k, v]) => {
      if (v) p.set(k, v)
      else p.delete(k)
    })
    return `/san-pham?${p.toString()}`
  }

  return (
    <div className="bg-[#F8FAFC] py-6 sm:py-8">
      <div className="layout-container">
        {/* ── Breadcrumb Phân Cấp 3 Tầng ─────────────────────────────────── */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6 flex-wrap font-medium">
          <Link href="/" className="hover:text-[#0077CC] flex items-center gap-1 transition-colors">
            <Home className="w-3.5 h-3.5 text-slate-400" />
            <span>Trang chủ</span>
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-300" />
          <Link href="/san-pham" className="hover:text-[#0077CC] transition-colors">
            Sản phẩm & Thiết bị
          </Link>

          {/* Cấp 1 trong breadcrumb */}
          {activeCategoryObj && (
            <>
              <ChevronRight className="w-3 h-3 text-slate-300" />
              <Link
                href={`/san-pham?category=${activeCategoryObj.slug}`}
                className="hover:text-[#0077CC] transition-colors"
              >
                {activeCategoryObj.shortName}
              </Link>
            </>
          )}

          {/* Cấp 2 trong breadcrumb */}
          {activeBrandObj && (
            <>
              <ChevronRight className="w-3 h-3 text-slate-300" />
              <Link
                href={`/san-pham?${categorySlug ? `category=${categorySlug}&` : ''}brand=${activeBrandObj.slug}`}
                className="hover:text-[#0077CC] transition-colors"
              >
                {activeBrandObj.name}
              </Link>
            </>
          )}

          {/* Cấp 3 trong breadcrumb */}
          {activeSeriesInfo && (
            <>
              <ChevronRight className="w-3 h-3 text-slate-300" />
              <span className="text-slate-900 font-bold">
                {activeSeriesInfo.series.name}
              </span>
            </>
          )}
        </nav>

        {/* ── Page Layout: Sidebar Filter & Products Grid ─────────────────── */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Sidebar Bộ Lọc 3 Cấp Độ */}
          <ProductFilters
            catalogTaxonomy={catalogTaxonomy}
            currentCategory={categorySlug}
            currentBrand={brandSlug}
            currentSeries={seriesSlug}
            searchQuery={searchQuery}
            totalCount={totalCount}
          />

          {/* Main Products Content */}
          <main className="flex-1 w-full space-y-6">
            {/* Page Header Banner */}
            <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 bg-blue-50 text-[#0077CC] text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>
                    {activeSeriesInfo
                      ? 'Dòng thiết bị chuyên biệt'
                      : activeBrandObj
                      ? 'Thương hiệu Enterprise'
                      : activeCategoryObj
                      ? 'Danh mục phần cứng'
                      : 'Hạ tầng phần cứng doanh nghiệp'}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {pageHeading}
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
                  {pageSubheading}
                </p>
              </div>
            </div>

            {/* Sắp xếp & Thống kê Bar */}
            <div className="bg-white border border-slate-200 p-3 sm:p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 mr-2 flex items-center gap-1">
                  <ArrowUpDown className="w-3.5 h-3.5 text-[#0077CC]" /> Sắp xếp:
                </span>

                <Link
                  href={buildFilterUrl({ sort: 'latest' })}
                  className={`px-3 py-1.5 text-xs font-bold transition-all rounded-xl border ${
                    sort === 'latest'
                      ? 'bg-[#0077CC] text-white border-[#0077CC] shadow-xs'
                      : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
                  }`}
                >
                  Mới nhất
                </Link>

                <Link
                  href={buildFilterUrl({ sort: 'featured' })}
                  className={`px-3 py-1.5 text-xs font-bold transition-all rounded-xl border ${
                    sort === 'featured'
                      ? 'bg-[#0077CC] text-white border-[#0077CC] shadow-xs'
                      : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
                  }`}
                >
                  Thiết bị nổi bật
                </Link>

                <Link
                  href={buildFilterUrl({ sort: 'name_asc' })}
                  className={`px-3 py-1.5 text-xs font-bold transition-all rounded-xl border ${
                    sort === 'name_asc'
                      ? 'bg-[#0077CC] text-white border-[#0077CC] shadow-xs'
                      : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
                  }`}
                >
                  Tên A → Z
                </Link>

                <Link
                  href={buildFilterUrl({ sort: 'name_desc' })}
                  className={`px-3 py-1.5 text-xs font-bold transition-all rounded-xl border ${
                    sort === 'name_desc'
                      ? 'bg-[#0077CC] text-white border-[#0077CC] shadow-xs'
                      : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
                  }`}
                >
                  Tên Z → A
                </Link>
              </div>
            </div>

            {/* Product Grid */}
            {displayedProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5">
                {displayedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="bg-white border border-slate-200 p-12 text-center my-6 rounded-3xl shadow-xs">
                <div className="w-16 h-16 bg-slate-100 text-slate-500 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-200">
                  <PackageSearch className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-1.5 uppercase tracking-wide">
                  Không tìm thấy thiết bị phù hợp
                </h3>
                <p className="text-slate-500 text-xs max-w-md mx-auto mb-5 leading-relaxed">
                  Không có sản phẩm nào khớp với tiêu chí lọc hoặc từ khóa bạn nhập. Hãy thử chọn lại cấp độ hoặc liên hệ hotline để kiểm tra kho hàng thực tế.
                </p>
                <Link
                  href="/san-pham"
                  className="inline-flex items-center justify-center px-5 py-2.5 bg-[#0077CC] hover:bg-[#004A80] text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
                >
                  Xem toàn bộ thiết bị
                </Link>
              </div>
            )}

            {/* Phân trang */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-1.5 pt-6">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                  const url = buildFilterUrl({ page: String(p) })

                  return (
                    <Link
                      key={p}
                      href={url}
                      className={`w-9 h-9 flex items-center justify-center text-xs font-mono font-bold transition-colors rounded-xl border ${
                        currentPage === p
                          ? 'bg-[#0077CC] text-white border-[#0077CC] shadow-xs'
                          : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-200'
                      }`}
                    >
                      {p}
                    </Link>
                  )
                })}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
