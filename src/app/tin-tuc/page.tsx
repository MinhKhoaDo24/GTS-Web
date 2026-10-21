import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { query } from '@/lib/db'
import { formatDate } from '@/lib/utils'
import {
  ChevronRight,
  Calendar,
  ArrowRight,
  Newspaper,
  Clock,
  User,
  Search,
  Sparkles,
  ArrowDownNarrowWide,
  ArrowUpWideNarrow,
  RefreshCw,
  Home,
  Tag,
  Filter,
} from 'lucide-react'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Tin tức & Kiến thức Kỹ thuật | GTS Enterprise',
  description:
    'Cập nhật tin tức phần cứng mạng, hướng dẫn kỹ thuật Cisco, Fortinet, HPE Aruba, Dell Technologies và kinh nghiệm triển khai hạ tầng CNTT doanh nghiệp từ chuyên gia GTS.',
}

export interface ContentItem {
  id: string
  type: string | null
  category: string | null
  title: string
  slug: string
  summary: string | null
  content: string | null
  thumbnail: string | null
  banner: string | null
  author: string | null
  published_at: Date | string | null
  created_at: Date | string
  is_featured: boolean
  is_active: boolean
}

interface PageProps {
  searchParams: Promise<{
    category?: string
    q?: string
    sort?: string
  }>
}

export default async function NewsPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams
  const categoryFilter = resolvedParams.category || ''
  const searchFilter = resolvedParams.q || ''
  const sortOption = resolvedParams.sort === 'oldest' ? 'oldest' : 'newest'

  // Xây dựng câu lệnh truy vấn CSDL từ bảng contents
  const conditions: string[] = ['is_active = true']
  const values: any[] = []
  let paramIdx = 1

  // Lọc theo từ khóa tìm kiếm
  if (searchFilter.trim()) {
    conditions.push(`(title ILIKE $${paramIdx} OR summary ILIKE $${paramIdx})`)
    values.push(`%${searchFilter.trim()}%`)
    paramIdx++
  }

  // Lọc theo chuyên mục
  if (categoryFilter.trim()) {
    conditions.push(`category = $${paramIdx}`)
    values.push(categoryFilter.trim())
    paramIdx++
  }

  // Sắp xếp theo thời gian
  const sortClause =
    sortOption === 'oldest'
      ? 'ORDER BY COALESCE(published_at, created_at) ASC'
      : 'ORDER BY COALESCE(published_at, created_at) DESC'

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''

  let posts: ContentItem[] = []
  let availableCategories: string[] = []

  try {
    const [postsResult, categoriesResult] = await Promise.all([
      query<ContentItem>(
        `SELECT id, type, category, title, slug, summary, content, thumbnail, banner, author,
                published_at, created_at, is_featured, is_active
         FROM contents
         ${whereClause}
         ${sortClause}`,
        values
      ),
      query<{ category: string }>(
        `SELECT DISTINCT category
         FROM contents
         WHERE is_active = true AND category IS NOT NULL AND category != ''
         ORDER BY category ASC`
      ),
    ])

    posts = postsResult
    availableCategories = categoriesResult.map((c) => c.category)
  } catch (error) {
    posts = []
    availableCategories = []
  }

  // Helper tạo link giữ lại các filter hiện tại
  const buildUrl = (params: { category?: string; sort?: string; q?: string }) => {
    const nextCategory = params.category !== undefined ? params.category : categoryFilter
    const nextSort = params.sort !== undefined ? params.sort : sortOption
    const nextQ = params.q !== undefined ? params.q : searchFilter

    const queryParts: string[] = []
    if (nextCategory) queryParts.push(`category=${encodeURIComponent(nextCategory)}`)
    if (nextSort && nextSort !== 'newest') queryParts.push(`sort=${encodeURIComponent(nextSort)}`)
    if (nextQ) queryParts.push(`q=${encodeURIComponent(nextQ)}`)

    return queryParts.length > 0 ? `/tin-tuc?${queryParts.join('&')}` : '/tin-tuc'
  }

  return (
    <div className="bg-[#F8FAFC] py-8 sm:py-12 fade-in">
      <div className="layout-container">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-8 font-medium">
          <Link href="/" className="hover:text-[#0077CC] flex items-center gap-1 transition-colors">
            <Home className="w-3.5 h-3.5 text-slate-400" />
            <span>Trang chủ</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <span className="text-slate-900 font-bold">Tin tức & Kiến thức Kỹ thuật</span>
        </nav>

        {/* ── Header Banner ───────────────────────────────────────────────── */}
        <div className="bg-gradient-to-r from-[#0F172A] via-[#0077CC] to-[#004A80] text-white rounded-3xl p-8 sm:p-12 mb-10 shadow-xl relative overflow-hidden">
          <div className="max-w-3xl relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/15 text-blue-100 text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full mb-3 border border-white/20 backdrop-blur-sm">
              <Newspaper className="w-4 h-4 text-amber-400" />
              <span>Chuyên mục thông tin & giải pháp</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight mb-3">
              Tin Tức & Kiến Thức Kỹ Thuật Enterprise
            </h1>
            <p className="text-sm sm:text-base text-blue-100 leading-relaxed max-w-2xl">
              Cập nhật thông tin công nghệ hạ tầng mạng, hướng dẫn cấu hình thiết bị Cisco, Fortinet, HPE và kiến thức triển khai hệ thống chuyên sâu.
            </p>
          </div>
        </div>

        {/* ── Toolbar: Tìm kiếm, Bộ lọc & Sắp xếp thời gian ──────────────── */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 mb-8 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Form tìm kiếm */}
            <form action="/tin-tuc" method="GET" className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                name="q"
                defaultValue={searchFilter}
                placeholder="Tìm kiếm bài viết, tài liệu kỹ thuật..."
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs sm:text-sm pl-10 pr-24 py-2.5 rounded-2xl focus:outline-hidden focus:border-[#0077CC] focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-slate-400"
              />
              {categoryFilter && (
                <input type="hidden" name="category" value={categoryFilter} />
              )}
              {sortOption !== 'newest' && (
                <input type="hidden" name="sort" value={sortOption} />
              )}
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-[#0077CC] hover:bg-[#004A80] text-white text-xs font-bold px-3 py-1.5 rounded-xl transition-colors"
              >
                Tìm
              </button>
            </form>

            {/* Sắp xếp theo thời gian */}
            <div className="flex items-center gap-2 self-start md:self-auto">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider hidden sm:inline">
                Sắp xếp:
              </span>
              <div className="inline-flex rounded-2xl bg-slate-100 p-1 border border-slate-200/80 text-xs font-bold">
                <Link
                  href={buildUrl({ sort: 'newest' })}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
                    sortOption === 'newest'
                      ? 'bg-white text-[#0077CC] shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <ArrowDownNarrowWide className="w-3.5 h-3.5" />
                  <span>Mới nhất</span>
                </Link>
                <Link
                  href={buildUrl({ sort: 'oldest' })}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
                    sortOption === 'oldest'
                      ? 'bg-white text-[#0077CC] shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <ArrowUpWideNarrow className="w-3.5 h-3.5" />
                  <span>Cũ nhất</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Hàng bộ lọc chuyên mục (nếu có chuyên mục trong CSDL) */}
          {availableCategories.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto pt-3 border-t border-slate-100 text-xs scrollbar-none">
              <span className="text-slate-400 font-bold flex items-center gap-1 shrink-0">
                <Tag className="w-3 h-3" />
                <span>Chuyên mục:</span>
              </span>
              <Link
                href={buildUrl({ category: '' })}
                className={`px-3 py-1 rounded-xl font-bold whitespace-nowrap transition-colors ${
                  !categoryFilter
                    ? 'bg-[#0077CC] text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Tất cả
              </Link>
              {availableCategories.map((cat) => (
                <Link
                  key={cat}
                  href={buildUrl({ category: cat })}
                  className={`px-3 py-1 rounded-xl font-bold whitespace-nowrap transition-colors ${
                    categoryFilter === cat
                      ? 'bg-[#0077CC] text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* ── Thông tin tóm tắt số lượng ──────────────────────────────────── */}
        <div className="flex items-center justify-between text-xs text-slate-500 mb-6 font-medium">
          <div>
            Hiển thị <span className="font-bold text-slate-900">{posts.length}</span> bài viết
            {searchFilter && (
              <span> cho từ khóa &quot;<strong className="text-slate-900">{searchFilter}</strong>&quot;</span>
            )}
            {categoryFilter && (
              <span> trong danh mục &quot;<strong className="text-slate-900">{categoryFilter}</strong>&quot;</span>
            )}
          </div>
          {(searchFilter || categoryFilter || sortOption !== 'newest') && (
            <Link
              href="/tin-tuc"
              className="text-[#0077CC] hover:underline flex items-center gap-1 font-bold"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Đặt lại bộ lọc</span>
            </Link>
          )}
        </div>

        {/* ── NỘI DUNG: DANH SÁCH BÀI VIẾT HOẶC TRẠNG THÁI TRỐNG ───────────── */}
        {posts.length === 0 ? (
          /* TRẠNG THÁI TRỐNG (EMPTY STATE) KHI KHÔNG CÓ BÀI VIẾT NÀO */
          <div className="bg-white rounded-3xl border border-slate-200/80 p-12 sm:p-16 text-center max-w-2xl mx-auto shadow-xs my-8">
            <div className="w-20 h-20 rounded-3xl bg-blue-50 text-[#0077CC] flex items-center justify-center mx-auto mb-6 shadow-inner">
              <Newspaper className="w-10 h-10 stroke-[1.5]" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-3">
              Chưa có tin tức nào
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-md mx-auto mb-8">
              {searchFilter || categoryFilter
                ? 'Không tìm thấy bài viết nào phù hợp với bộ lọc tìm kiếm hiện tại. Quý khách vui lòng thử lại với từ khóa khác.'
                : 'Hiện tại chưa có bài viết nào được đăng tải. Các thông tin công nghệ, bài viết kỹ thuật và thông báo mới nhất sẽ sớm được cập nhật tại đây.'}
            </p>
            {searchFilter || categoryFilter ? (
              <Link
                href="/tin-tuc"
                className="inline-flex items-center gap-2 bg-[#0077CC] hover:bg-[#004A80] text-white px-6 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-colors shadow-md"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Xem tất cả bài viết</span>
              </Link>
            ) : (
              <Link
                href="/"
                className="inline-flex items-center gap-2 bg-[#0077CC] hover:bg-[#004A80] text-white px-6 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-colors shadow-md"
              >
                <Home className="w-4 h-4" />
                <span>Về trang chủ</span>
              </Link>
            )}
          </div>
        ) : (
          /* THIẾT KẾ DANH SÁCH BÀI VIẾT (LIST VIEW) */
          <div className="space-y-5 mb-14">
            {posts.map((item) => {
              const displayDate = item.published_at || item.created_at
              return (
                <article
                  key={item.id}
                  className="group bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 hover:border-blue-300 hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row gap-6 items-stretch"
                >
                  {/* Cột ảnh đại diện bên trái */}
                  <Link
                    href={`/tin-tuc/${item.slug}`}
                    className="w-full md:w-72 lg:w-80 shrink-0 aspect-video md:aspect-auto min-h-[190px] rounded-2xl overflow-hidden relative bg-slate-100 block"
                  >
                    {item.thumbnail ? (
                      <Image
                        src={item.thumbnail}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, 320px"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-slate-900 via-[#004A80] to-[#0077CC] flex flex-col items-center justify-center p-6 text-white text-center">
                        <Newspaper className="w-10 h-10 text-blue-200 mb-2 opacity-80" />
                        <span className="text-[11px] font-black uppercase tracking-wider text-blue-100">
                          GTS Enterprise News
                        </span>
                      </div>
                    )}

                    {/* Tag danh mục overlay trên góc ảnh */}
                    {item.category && (
                      <span className="absolute top-3 left-3 bg-[#0077CC]/90 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider shadow-sm">
                        {item.category}
                      </span>
                    )}

                    {/* Badge bài viết nổi bật */}
                    {item.is_featured && (
                      <span className="absolute top-3 right-3 bg-amber-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                        <Sparkles className="w-3 h-3" />
                        <span>Nổi bật</span>
                      </span>
                    )}
                  </Link>

                  {/* Cột nội dung bên phải */}
                  <div className="flex flex-col justify-between flex-1 py-1">
                    <div>
                      {/* Metadata: Ngày đăng & Tác giả */}
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mb-2.5">
                        <span className="flex items-center gap-1.5 font-medium">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{formatDate(displayDate)}</span>
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="flex items-center gap-1.5 font-medium text-slate-500">
                          <User className="w-3.5 h-3.5 text-[#0077CC]" />
                          <span>{item.author || 'Ban biên tập GTS'}</span>
                        </span>
                      </div>

                      {/* Tiêu đề bài viết */}
                      <Link href={`/tin-tuc/${item.slug}`} className="block">
                        <h2 className="text-base sm:text-lg lg:text-xl font-black text-slate-900 group-hover:text-[#0077CC] transition-colors leading-snug line-clamp-2 mb-2.5">
                          {item.title}
                        </h2>
                      </Link>

                      {/* Tóm tắt bài viết */}
                      {item.summary && (
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-2 sm:line-clamp-3 mb-4">
                          {item.summary}
                        </p>
                      )}
                    </div>

                    {/* Chân bài viết: Nút đọc tiếp */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-slate-400">
                        Thời gian đọc: ~5 phút
                      </span>
                      <Link
                        href={`/tin-tuc/${item.slug}`}
                        className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#0077CC] hover:text-[#004A80] transition-colors"
                      >
                        <span>Đọc chi tiết</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
