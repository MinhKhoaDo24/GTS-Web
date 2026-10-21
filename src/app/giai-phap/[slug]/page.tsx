import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import {
  getSolutionBySlug,
  getSolutionProducts,
  getRelatedProductsForSolution,
  getOtherSolutions,
  type SolutionProductItem,
} from '@/lib/dal/solutions'
import { queryOne, query } from '@/lib/db'
import type { PageContent, SiteSetting } from '@/types/database'
import { RichTextRenderer } from '@/components/RichTextRenderer'
import {
  Wifi,
  Network,
  ShieldCheck,
  PhoneCall,
  Video,
  Server,
  Cpu,
  CheckCircle2,
  ArrowRight,
  ChevronRight,
  Home,
  Phone,
  Layers,
  FileCheck2,
  Download,
  Mail,
  Clock,
  Sparkles,
  Package,
  Wrench,
  Shield,
  HelpCircle
} from 'lucide-react'

export const revalidate = 3600

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

function getSolutionIcon(slug: string) {
  switch (slug) {
    case 'giai-phap-wifi':
      return Wifi
    case 'giai-phap-mang':
      return Network
    case 'giai-phap-bao-mat':
      return ShieldCheck
    case 'giai-phap-voip':
      return PhoneCall
    case 'giai-phap-hoi-nghi':
      return Video
    case 'giai-phap-server':
      return Server
    default:
      return Cpu
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params
  const slug = resolvedParams.slug

  const solution = await getSolutionBySlug(slug).catch(() => null)
  if (solution) {
    return {
      title: solution.seo_title || `${solution.name} | Giải Pháp GTS`,
      description:
        solution.seo_description ||
        solution.short_description ||
        'Giải pháp hạ tầng mạng và an ninh doanh nghiệp chính hãng tại GTS.',
    }
  }

  const page = await queryOne<PageContent>(
    'SELECT title, seo_title, seo_description FROM pages WHERE slug = $1 LIMIT 1',
    [slug]
  ).catch(() => null)

  return {
    title: page?.seo_title || page?.title || 'Giải Pháp Doanh Nghiệp | GTS',
    description: page?.seo_description || 'Giải pháp hạ tầng công nghệ thông tin chuyên nghiệp từ GTS.',
  }
}

export default async function SolutionDetailPage({ params }: PageProps) {
  const resolvedParams = await params
  const slug = resolvedParams.slug

  // 1. Query thông tin giải pháp từ database
  const solution = await getSolutionBySlug(slug).catch(() => null)

  // 2. Query fallback từ bảng pages (nếu admin lưu trong CMS pages)
  let cmsPage: PageContent | null = null
  if (!solution) {
    cmsPage = await queryOne<PageContent>(
      'SELECT id, title, slug, content FROM pages WHERE slug = $1 LIMIT 1',
      [slug]
    ).catch(() => null)
  }

  // Nếu không tìm thấy trong cả 2 bảng -> 404
  if (!solution && !cmsPage) {
    notFound()
  }

  // 3. Query các dữ liệu liên quan từ database:
  // - Thiết bị trong solution_products
  // - Thiết bị liên quan trong catalog sản phẩm
  // - Các giải pháp khác
  // - Cấu hình site_settings
  const solutionId = solution?.id || ''
  const [dbProducts, otherSolutions, settingsArr] = await Promise.all([
    solutionId ? getSolutionProducts(solutionId).catch(() => []) : Promise.resolve([]),
    getOtherSolutions(slug, 6).catch(() => []),
    query<SiteSetting>('SELECT key, value FROM site_settings').catch(() => []),
  ])

  // Nếu solution_products chưa có sản phẩm được gán, lấy sản phẩm liên quan từ catalog
  let productsToDisplay: SolutionProductItem[] = dbProducts
  if (productsToDisplay.length === 0) {
    productsToDisplay = await getRelatedProductsForSolution(slug, 4).catch(() => [])
  }

  const settings: Record<string, string> = Object.fromEntries(
    settingsArr.map((s) => [s.key, s.value ?? ''])
  )

  const hotline = settings.hotline || '0901 234 567'
  const contactEmail = settings.contact_email || 'contact@gts.vn'

  const title = solution?.name || cmsPage?.title || 'Giải pháp doanh nghiệp'
  const shortDesc = solution?.short_description || ''
  const content = solution?.description || cmsPage?.content || ''
  const Icon = getSolutionIcon(slug)

  return (
    <div className="bg-[#F8FAFC] py-8 sm:py-12 fade-in">
      <div className="layout-container">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-8 font-medium">
          <Link href="/" className="hover:text-[#0077CC] flex items-center gap-1 transition-colors">
            <Home className="w-3.5 h-3.5 text-slate-400" />
            <span>Trang chủ</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <Link href="/giai-phap" className="hover:text-[#0077CC] transition-colors">
            Giải pháp doanh nghiệp
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <span className="text-slate-900 font-bold truncate max-w-md">{title}</span>
        </nav>

        {/* ── Solution Hero Banner ─────────────────────────────────────────── */}
        <div className="relative bg-gradient-to-br from-[#0B1528] via-[#0F284E] to-[#004A80] text-white rounded-3xl p-8 sm:p-12 mb-12 shadow-2xl overflow-hidden border border-white/10">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-4xl">
            <div className="inline-flex items-center gap-2 bg-white/10 text-cyan-300 text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full mb-4 border border-white/15 backdrop-blur-sm">
              <Icon className="w-4 h-4 text-cyan-400" />
              <span>Kiến trúc giải pháp tích hợp</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight mb-4 text-white">
              {title}
            </h1>

            {shortDesc && (
              <p className="text-sm sm:text-base text-slate-200 leading-relaxed max-w-3xl mb-8">
                {shortDesc}
              </p>
            )}

            {/* Quick Action Buttons in Hero */}
            <div className="flex flex-wrap items-center gap-3.5 pt-4 border-t border-white/15">
              <Link
                href={`/lien-he?solution=${encodeURIComponent(slug)}&type=quote`}
                className="bg-[#0077CC] hover:bg-[#004A80] text-white px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md hover:shadow-lg inline-flex items-center gap-2"
              >
                <span>Yêu cầu báo giá giải pháp</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <a
                href={`tel:${hotline.replace(/\s/g, '')}`}
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-5 py-3 rounded-xl font-bold text-xs transition-colors inline-flex items-center gap-2"
              >
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span>Hotline kỹ thuật: {hotline}</span>
              </a>
            </div>
          </div>
        </div>

        {/* ── Key Value Props Bar ─────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { title: 'Chính Hãng 100%', desc: 'Đầy đủ CO/CQ từ nhà sản xuất', icon: Shield },
            { title: 'Sẵn Sàng 99.999%', desc: 'Dự phòng High Availability', icon: Layers },
            { title: 'Bảo Hành Tận Nơi', desc: 'Hỗ trợ kỹ thuật 24/7/365', icon: Clock },
            { title: 'Tối Ưu Chi Phí TCO', desc: 'Dễ dàng nâng cấp và mở rộng', icon: Sparkles },
          ].map((item, idx) => {
            const ItemIcon = item.icon
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex items-center gap-3.5"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0077CC] flex items-center justify-center flex-shrink-0">
                  <ItemIcon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {item.desc}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* ── Main Layout: Content + Sticky Sidebar ───────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          {/* CỘT NỘI DUNG CHÍNH (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            {/* 1. NỘI DUNG CHI TIẾT GIẢI PHÁP TỪ DATABASE */}
            <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-xs">
              <div className="flex items-center gap-2.5 text-xs font-black uppercase tracking-wider text-[#0077CC] pb-3 border-b border-slate-100 mb-6">
                <FileCheck2 className="w-4 h-4" />
                <span>Nội Dung Kiến Trúc & Chi Tiết Kỹ Thuật</span>
              </div>

              {content ? (
                <div className="prose prose-slate max-w-none prose-headings:font-black prose-headings:text-slate-900 prose-h2:text-2xl prose-h3:text-lg prose-p:text-slate-700 prose-p:leading-relaxed prose-li:text-slate-700">
                  <RichTextRenderer content={content} />
                </div>
              ) : (
                <div className="text-slate-500 text-sm italic py-8 text-center">
                  Nội dung chi tiết giải pháp đang được ban kỹ thuật cập nhật. Quý khách vui lòng liên hệ hotline để nhận tài liệu giải pháp hoàn chỉnh.
                </div>
              )}
            </div>

            {/* 2. HỆ SINH THÁI THIẾT BỊ CẤU THÀNH (Lấy trực tiếp từ database) */}
            {productsToDisplay.length > 0 && (
              <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 mb-6">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#0077CC] mb-1">
                      <Package className="w-4 h-4" />
                      <span>Hệ Sinh Thái Thiết Bị & Bản Quyền Cấu Thành</span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-black text-slate-900">
                      Thiết Bị Tiêu Biểu Trong Giải Pháp
                    </h3>
                  </div>
                  <Link
                    href="/san-pham"
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#0077CC] hover:underline"
                  >
                    <span>Xem kho sản phẩm</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {productsToDisplay.map((prod) => (
                    <div
                      key={prod.id || prod.product_slug}
                      className="group border border-slate-200/90 hover:border-[#0077CC] rounded-2xl p-4 transition-all duration-200 flex flex-col justify-between bg-slate-50/50 hover:bg-white hover:shadow-md"
                    >
                      <div>
                        {/* Thumbnail image */}
                        <div className="relative w-full h-36 bg-white rounded-xl mb-3 flex items-center justify-center p-2 overflow-hidden border border-slate-100">
                          {prod.product_thumbnail ? (
                            <img
                              src={prod.product_thumbnail}
                              alt={prod.product_name}
                              className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <Package className="w-10 h-10 text-slate-300" />
                          )}
                        </div>

                        {/* Brand & Role Tag */}
                        <div className="flex items-center justify-between gap-2 mb-2">
                          {prod.brand_name && (
                            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                              {prod.brand_name}
                            </span>
                          )}
                          {prod.role && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-[#0077CC] line-clamp-1">
                              {prod.role}
                            </span>
                          )}
                        </div>

                        {/* Product Title */}
                        <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#0077CC] transition-colors line-clamp-2 leading-snug mb-1">
                          <Link href={`/san-pham/${prod.product_slug}`}>
                            {prod.product_name}
                          </Link>
                        </h4>

                        {prod.product_model && (
                          <div className="text-xs text-slate-500 font-mono mb-2">
                            Model: {prod.product_model}
                          </div>
                        )}
                      </div>

                      {/* Card Action */}
                      <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between gap-2">
                        <Link
                          href={`/san-pham/${prod.product_slug}`}
                          className="text-xs font-bold text-slate-600 group-hover:text-[#0077CC] inline-flex items-center gap-1"
                        >
                          <span>Thông số kỹ thuật</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>

                        <Link
                          href={`/lien-he?product=${encodeURIComponent(prod.product_slug)}&type=quote`}
                          className="bg-[#0077CC] hover:bg-[#004A80] text-white px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors"
                        >
                          Báo giá
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. QUY TRÌNH TRIỂN KHAI & CAM KẾT CHẤT LƯỢNG DỊCH VỤ SLA */}
            <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-xs space-y-6">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#0077CC] pb-3 border-b border-slate-100">
                <Wrench className="w-4 h-4" />
                <span>Cam Kết Chất Lượng Kỹ Thuật & Hỗ Trợ Sau Triển Khai</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 mb-1">Chứng nhận xuất xứ & chất lượng</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Cung cấp hồ sơ nghiệm thu đầy đủ CO/CQ, Packing List và giấy tờ ủy quyền chính hãng.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 mb-1">Kho thiết bị dự phòng Spare Part</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Cam kết đổi mới thiết bị tương đương trong 2 - 4h khi phát sinh sự cố phần cứng khẩn cấp.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 mb-1">Bàn giao hồ sơ hoàn công chi tiết</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Cung cấp sơ đồ Topo cáp, bảng phân bổ VLAN/IP, file backup cấu hình và tài liệu vận hành.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 mb-1">Đào tạo chuyển giao công nghệ</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Hướng dẫn chuyên sâu cho đội ngũ quản trị IT nội bộ của quý doanh nghiệp làm chủ hệ thống.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CỘT SIDEBAR TƯ VẤN & CROSS-LINKS (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Box 1: Yêu Cầu Báo Giá & Tư Vấn Kỹ Thuật */}
            <div className="bg-white rounded-3xl p-7 border border-slate-200/80 shadow-md space-y-5">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#0077CC] pb-3 border-b border-slate-100">
                <PhoneCall className="w-4 h-4" />
                <span>Tư Vấn & Báo Giá Giải Pháp</span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Quý khách hàng cần tư vấn thiết kế, lập dự toán BOM hoặc nhận báo giá dự án giải pháp <strong className="text-slate-900">{title}</strong>? Đội ngũ chuyên gia GTS sẵn sàng phản hồi trong vòng 30 phút.
              </p>

              <div className="space-y-2.5">
                <Link
                  href={`/lien-he?solution=${encodeURIComponent(slug)}&type=quote`}
                  className="w-full bg-[#0077CC] hover:bg-[#004A80] text-white py-3.5 px-4 rounded-2xl font-bold text-xs uppercase tracking-wider text-center block transition-all shadow-md hover:shadow-lg"
                >
                  Nhận báo giá dự án
                </Link>

                <a
                  href={`tel:${hotline.replace(/\s/g, '')}`}
                  className="w-full bg-[#0F172A] hover:bg-slate-800 text-white py-3.5 px-4 rounded-2xl font-bold text-xs text-center block transition-colors flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4 text-amber-400" />
                  <span>Hotline: {hotline}</span>
                </a>
              </div>

              <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-500 flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>Email kỹ thuật: {contactEmail}</span>
              </div>
            </div>

            {/* Box 2: Danh Mục Các Giải Pháp Khác (Query 100% từ Database) */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 pb-3 border-b border-slate-100 mb-3">
                Các Giải Pháp Doanh Nghiệp Khác
              </h3>
              <div className="space-y-1">
                {otherSolutions.map((item) => {
                  const OtherIcon = getSolutionIcon(item.slug)
                  return (
                    <Link
                      key={item.id}
                      href={`/giai-phap/${item.slug}`}
                      className="group flex items-center justify-between p-3 rounded-xl text-xs font-bold transition-all text-slate-700 hover:bg-blue-50 hover:text-[#0077CC]"
                    >
                      <div className="flex items-center gap-2.5 line-clamp-1">
                        <OtherIcon className="w-4 h-4 text-slate-400 group-hover:text-[#0077CC] flex-shrink-0 transition-colors" />
                        <span className="truncate">{item.name}</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#0077CC] group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* Box 3: Dịch Vụ Đi Kèm */}
            <div className="bg-gradient-to-br from-slate-900 to-[#0F284E] text-white rounded-3xl p-6 shadow-md space-y-4">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-cyan-300 pb-2 border-b border-white/10">
                <Layers className="w-4 h-4" />
                <span>Dịch Vụ Đi Kèm Giải Pháp</span>
              </div>

              <div className="space-y-2.5 text-xs">
                <Link
                  href="/dich-vu/dich-vu-tu-van"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <span>Tư vấn thiết kế & Khảo sát PoC</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </Link>
                <Link
                  href="/dich-vu/dich-vu-trien-khai"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <span>Triển khai lắp đặt & Cấu hình</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </Link>
                <Link
                  href="/dich-vu/dich-vu-bao-tri"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <span>Bảo trì & Hỗ trợ kỹ thuật 24/7</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </Link>
                <Link
                  href="/dich-vu/dich-vu-spare-part"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <span>Dịch vụ ứng cứu Spare Part</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
