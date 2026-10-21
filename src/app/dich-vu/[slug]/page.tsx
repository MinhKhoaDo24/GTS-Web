import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { queryOne, query } from '@/lib/db'
import type { Service, SiteSetting, PageContent } from '@/types/database'
import { RichTextRenderer } from '@/components/RichTextRenderer'
import {
  Wrench,
  ChevronRight,
  Home,
  PhoneCall,
  Send,
} from 'lucide-react'

// Import các trang dịch vụ chuyên biệt
import DichVuTuVan, { metadata as tuVanMeta } from '../dich-vu-tu-van'
import DichVuTrienKhai, { metadata as trienKhaiMeta } from '../dich-vu-trien-khai'
import DichVuBaoTri, { metadata as baoTriMeta } from '../dich-vu-bao-tri'
import DichVuSparePart, { metadata as sparePartMeta } from '../dich-vu-spare-part'

export const revalidate = 3600

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params
  const slug = resolvedParams.slug

  // Kiểm tra metadata tĩnh từ file trang chuyên biệt
  if (slug === 'dich-vu-tu-van') return tuVanMeta
  if (slug === 'dich-vu-trien-khai') return trienKhaiMeta
  if (slug === 'dich-vu-bao-tri') return baoTriMeta
  if (slug === 'dich-vu-spare-part') return sparePartMeta

  // Nếu không thuộc 4 trang cơ bản, truy vấn CSDL
  const service = await queryOne<Service>(
    'SELECT name, short_description, seo_title, seo_description FROM services WHERE slug = $1 LIMIT 1',
    [slug]
  ).catch(() => null)

  if (service) {
    return {
      title: service.seo_title || service.name || 'Dịch Vụ Kỹ Thuật | GTS Enterprise',
      description: service.seo_description || service.short_description || 'Dịch vụ kỹ thuật chuyên nghiệp tại GTS.',
    }
  }

  return {
    title: 'Dịch Vụ Kỹ Thuật | GTS Enterprise',
    description: 'Dịch vụ kỹ thuật triển khai hạ tầng mạng doanh nghiệp chính hãng tại GTS.',
  }
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const resolvedParams = await params
  const slug = resolvedParams.slug

  // 1. Query từ bảng services
  const [service, page, settingsArr] = await Promise.all([
    queryOne<Service>(
      'SELECT id, name, slug, short_description, description, thumbnail, banner FROM services WHERE slug = $1 LIMIT 1',
      [slug]
    ).catch(() => null),
    // 2. Query fallback từ bảng pages (nếu admin tạo trang dịch vụ trong CMS pages)
    queryOne<PageContent>(
      'SELECT id, title, slug, content FROM pages WHERE slug = $1 LIMIT 1',
      [slug]
    ).catch(() => null),
    query<SiteSetting>('SELECT key, value FROM site_settings').catch(() => []),
  ])

  const settings: Record<string, string> = Object.fromEntries(
    settingsArr.map((s) => [s.key, s.value ?? ''])
  )

  const hotline = settings.hotline || '0901 234 567'
  const customContent = service?.description || page?.content || null

  // Điều hướng tới trang chuyên biệt nếu khớp slug
  if (slug === 'dich-vu-tu-van') {
    return <DichVuTuVan customContent={customContent} hotline={hotline} />
  }

  if (slug === 'dich-vu-trien-khai') {
    return <DichVuTrienKhai customContent={customContent} hotline={hotline} />
  }

  if (slug === 'dich-vu-bao-tri') {
    return <DichVuBaoTri customContent={customContent} hotline={hotline} />
  }

  if (slug === 'dich-vu-spare-part') {
    return <DichVuSparePart customContent={customContent} hotline={hotline} />
  }

  // Nếu không thuộc 4 trang mặc định và không có trong CSDL -> 404
  if (!service && !page) {
    notFound()
  }

  const title = service?.name || page?.title || 'Dịch vụ kỹ thuật'
  const shortDesc = service?.short_description || ''

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
          <Link href="/dich-vu" className="hover:text-[#0077CC] transition-colors">
            Dịch vụ kỹ thuật
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <span className="text-slate-900 font-bold truncate max-w-md">{title}</span>
        </nav>

        {/* ── Header Banner ───────────────────────────────────────────────── */}
        <div className="bg-gradient-to-r from-[#0F172A] via-[#0077CC] to-[#004A80] text-white rounded-3xl p-8 sm:p-12 mb-12 shadow-xl relative overflow-hidden">
          <div className="max-w-3xl relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/15 text-blue-100 text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full mb-3 border border-white/20 backdrop-blur-sm">
              <Wrench className="w-4 h-4 text-amber-400" />
              <span>Dịch vụ kỹ thuật chuyên nghiệp</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight mb-3">
              {title}
            </h1>
            {shortDesc && (
              <p className="text-sm sm:text-base text-blue-100 leading-relaxed max-w-2xl">
                {shortDesc}
              </p>
            )}
          </div>
        </div>

        {/* ── Main Layout: Content + Sidebar CTA ──────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-14">
          <div className="lg:col-span-8">
            <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-xs">
              {customContent ? (
                <RichTextRenderer content={customContent} />
              ) : (
                <p className="text-slate-500 text-sm">Nội dung chi tiết đang được cập nhật...</p>
              )}
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl p-7 border border-slate-200/80 shadow-xs space-y-5">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#0077CC] pb-2 border-b border-slate-100">
                <Send className="w-4 h-4" />
                <span>Yêu cầu tư vấn dịch vụ</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Liên hệ trực tiếp với chuyên gia GTS để được tư vấn và nhận báo giá phù hợp nhất với nhu cầu doanh nghiệp.
              </p>

              <Link
                href={`/lien-he?service=${encodeURIComponent(slug)}&type=consultation`}
                className="w-full bg-[#0077CC] hover:bg-[#004A80] text-white py-3.5 px-4 rounded-2xl font-bold text-xs uppercase tracking-wider text-center block transition-colors shadow-md"
              >
                Gửi yêu cầu dịch vụ
              </Link>

              <a
                href={`tel:${hotline.replace(/\s/g, '')}`}
                className="w-full bg-[#0F172A] hover:bg-slate-800 text-white py-3.5 px-4 rounded-2xl font-bold text-xs text-center block transition-colors flex items-center justify-center gap-2"
              >
                <PhoneCall className="w-4 h-4 text-amber-400" />
                <span>Hotline kỹ thuật: {hotline}</span>
              </a>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 pb-2.5 border-b border-slate-100 mb-3">
                Các dịch vụ kỹ thuật khác
              </h3>
              <div className="space-y-1">
                {[
                  { label: 'Tư vấn & Thiết kế giải pháp mạng', slug: 'dich-vu-tu-van' },
                  { label: 'Triển khai & Cài đặt phần cứng', slug: 'dich-vu-trien-khai' },
                  { label: 'Bảo trì định kỳ 24/7 SLA', slug: 'dich-vu-bao-tri' },
                  { label: 'Linh kiện thay thế Spare Part', slug: 'dich-vu-spare-part' },
                ].map((item) => (
                  <Link
                    key={item.slug}
                    href={`/dich-vu/${item.slug}`}
                    className={`flex items-center justify-between p-2.5 rounded-xl text-xs font-bold transition-colors ${
                      item.slug === slug
                        ? 'bg-blue-50 text-[#0077CC]'
                        : 'text-slate-700 hover:bg-slate-50 hover:text-[#0077CC]'
                    }`}
                  >
                    <span>{item.label}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
