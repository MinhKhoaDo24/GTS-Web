import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { query, queryOne } from '@/lib/db'
import type { PageContent, SiteSetting } from '@/types/database'
import { RichTextRenderer } from '@/components/RichTextRenderer'
import {
  ShieldCheck,
  Award,
  Users2,
  Building2,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  ChevronRight,
  Home,
  Target,
  Eye,
  HeartHandshake,
  Cpu,
  Layers,
  FileCheck2
} from 'lucide-react'

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const page = await queryOne<PageContent>(
    `SELECT seo_title, seo_description, title FROM pages WHERE slug = 'gioi-thieu' OR slug = 've-gts' LIMIT 1`
  ).catch(() => null)

  return {
    title: page?.seo_title || 'Về GTS - Global Technology & Service | Nhà Phân Phối Thiết Bị Mạng Chính Hãng',
    description:
      page?.seo_description ||
      'Giới thiệu công ty GTS: Nhà cung cấp thiết bị phần cứng mạng, máy chủ và giải pháp an ninh mạng hàng đầu Việt Nam. Đối tác chính thức của Cisco, Fortinet, HPE, Dell, Ubiquiti.',
  }
}

export default async function AboutPage() {
  const [dbPage, settingsArr] = await Promise.all([
    queryOne<PageContent>(
      `SELECT id, title, slug, content, thumbnail, banner, seo_title, seo_description FROM pages WHERE slug = 'gioi-thieu' OR slug = 've-gts' LIMIT 1`
    ).catch(() => null),
    query<SiteSetting>('SELECT key, value FROM site_settings').catch(() => []),
  ])

  const settings: Record<string, string> = Object.fromEntries(
    settingsArr.map((s) => [s.key, s.value ?? ''])
  )

  const hotline = settings.hotline || '0901 234 567'
  const email = settings.contact_email || 'contact@gts.com.vn'
  const address = settings.address || 'Hà Nội & TP. Hồ Chí Minh'

  // KIẾN TRÚC TƯƠNG LAI:
  // Nếu Admin đã nhập nội dung qua Backend CMS vào bảng `pages`, ưu tiên render nội dung động từ DB:
  const hasCustomContent = Boolean(dbPage && dbPage.content && dbPage.content.trim().length > 50)

  return (
    <div className="bg-[#F8FAFC] py-8 sm:py-12 fade-in">
      <div className="layout-container">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-8 font-medium">
          <Link href="/" className="hover:text-[#1D4ED8] flex items-center gap-1 transition-colors">
            <Home className="w-3.5 h-3.5 text-slate-400" />
            <span>Trang chủ</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <span className="text-slate-900 font-bold">Về GTS (Giới thiệu)</span>
        </nav>

        {/* ── Header Banner ───────────────────────────────────────────────── */}
        <div className="bg-gradient-to-r from-[#0F172A] via-[#1D4ED8] to-[#1e40af] text-white rounded-3xl p-8 sm:p-14 mb-12 shadow-xl relative overflow-hidden">
          <div className="max-w-3xl relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/15 text-blue-100 text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full mb-4 border border-white/20 backdrop-blur-sm">
              <Building2 className="w-4 h-4 text-[#4ade80]" />
              <span>Hồ sơ năng lực doanh nghiệp</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight mb-4">
              {dbPage?.title || 'Global Technology & Service (GTS)'}
            </h1>
            <p className="text-sm sm:text-base text-blue-100 leading-relaxed max-w-2xl">
              Đối tác phân phối và tích hợp hạ tầng công nghệ mạng, máy chủ và giải pháp an ninh mạng chuẩn quốc tế cho các doanh nghiệp, tổ chức tài chính và nhà máy tại Việt Nam.
            </p>
          </div>
        </div>

        {/* ── NẾU CSDL ĐÃ CÓ NỘI DUNG TỪ BACKEND CMS: RENDER DYNAMIC CONTENT ── */}
        {hasCustomContent ? (
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm mb-12">
            <RichTextRenderer content={dbPage!.content!} />
          </div>
        ) : (
          /* ── NẾU CSDL CHƯA CÓ DỮ LIỆU: RENDER TEMPLATE DOANH NGHIỆP HOÀN CHỈNH ── */
          <div className="space-y-12">
            {/* Khối 1: Giới thiệu chung & Tầm nhìn Sứ mệnh */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-xs space-y-5">
                <div className="inline-flex items-center gap-2 bg-blue-50 text-[#1D4ED8] text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full">
                  Câu chuyện phát triển
                </div>
                <h2 className="text-xl sm:text-3xl font-black text-slate-900 leading-snug">
                  Đồng Hành Kiến Tạo Hạ Tầng Số Vững Chắc Cho Doanh Nghiệp
                </h2>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  Công ty TNHH Giải Pháp Công Nghệ & Dịch Vụ Toàn Cầu (GTS) được thành lập với mục tiêu trở thành nhà cung cấp phần cứng mạng chuyên nghiệp và tin cậy hàng đầu. Chúng tôi đóng vai trò cầu nối vững chắc giữa các hãng sản xuất công nghệ lớn nhất thế giới và các tổ chức, doanh nghiệp tại Việt Nam.
                </p>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  Với triết lý <strong>"Find your true solution"</strong>, chúng tôi không chỉ bán thiết bị phần cứng mà mang đến giải pháp hạ tầng tối ưu nhất về hiệu năng, độ tin cậy và chi phí đầu tư TCO.
                </p>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60">
                    <div className="flex items-center gap-2 text-[#1D4ED8] font-bold text-sm mb-1">
                      <Target className="w-4 h-4" />
                      <span>Sứ mệnh</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Cung cấp thiết bị mạng chính hãng 100% kèm dịch vụ kỹ thuật chuyên sâu, giúp hạ tầng công nghệ của khách hàng luôn vận hành thông suốt 24/7.
                    </p>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60">
                    <div className="flex items-center gap-2 text-[#22C55E] font-bold text-sm mb-1">
                      <Eye className="w-4 h-4" />
                      <span>Tầm nhìn</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Trở thành nhà tích hợp hạ tầng CNTT & Trung tâm dữ liệu top đầu khu vực, đạt chuẩn chứng nhận đối tác cao cấp từ Cisco, Fortinet, HPE và Dell.
                    </p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 space-y-4">
                <div className="bg-[#0F172A] text-white rounded-3xl p-8 shadow-xl">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 block mb-2">
                    Năng Lực Phân Phối
                  </span>
                  <h3 className="text-xl font-bold mb-4">Các Hãng Công Nghệ Trực Tiếp</h3>
                  <div className="space-y-3 text-xs sm:text-sm text-slate-300">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <span>Cisco Systems</span>
                      <span className="text-emerald-400 font-bold">Premier Partner</span>
                    </div>
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <span>Fortinet</span>
                      <span className="text-emerald-400 font-bold">Advanced Partner</span>
                    </div>
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <span>HPE Aruba Networking</span>
                      <span className="text-emerald-400 font-bold">Silver Partner</span>
                    </div>
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <span>Dell Technologies</span>
                      <span className="text-emerald-400 font-bold">Authorized Partner</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Ubiquiti / Ruijie</span>
                      <span className="text-emerald-400 font-bold">Official Distributor</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-indigo-50/60 p-6 rounded-3xl border border-blue-200/80">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1D4ED8] mb-2">
                    <ShieldCheck className="w-4 h-4 text-[#1D4ED8]" />
                    <span>Cam kết pháp lý & Nguồn gốc</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Mọi thiết bị xuất kho từ GTS đều kèm theo Giấy chứng nhận xuất xứ (C/O), Giấy chứng nhận chất lượng (C/Q) từ hãng và hóa đơn giá trị gia tăng (VAT) hợp lệ.
                  </p>
                </div>
              </div>
            </div>

            {/* Khối 2: 4 Giá trị cốt lõi */}
            <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-xs">
              <div className="text-center max-w-2xl mx-auto mb-10">
                <span className="text-xs font-bold uppercase tracking-wider text-[#1D4ED8] block mb-2">
                  Giá trị cốt lõi
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  4 Trụ Cột Tạo Nên Uy Tín Của GTS
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    icon: ShieldCheck,
                    color: 'bg-blue-50 text-[#1D4ED8]',
                    title: 'Chính Hãng 100%',
                    desc: 'Cam kết bồi thường 200% nếu phát hiện hàng giả, hàng nhái hoặc không có CO/CQ hợp lệ.',
                  },
                  {
                    icon: Award,
                    color: 'bg-emerald-50 text-[#22C55E]',
                    title: 'Kỹ Thuật Chuyên Sâu',
                    desc: 'Đội ngũ kỹ sư sở hữu chứng chỉ quốc tế CCNA, CCNP, NSE4 sẵn sàng tư vấn thiết kế PoC miễn phí.',
                  },
                  {
                    icon: HeartHandshake,
                    color: 'bg-amber-50 text-[#F59E0B]',
                    title: 'Đồng Hành Lâu Dài',
                    desc: 'Chính sách bảo hành 1 đổi 1 trong thời gian bảo hành, hỗ trợ spare part mượn tạm khi xảy ra sự cố.',
                  },
                  {
                    icon: Cpu,
                    color: 'bg-purple-50 text-purple-600',
                    title: 'Tối Ưu Ngân Sách',
                    desc: 'Báo giá dự án cạnh tranh nhất thị trường, chiết khấu sâu cho các đơn vị tích hợp hệ thống (SI).',
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="p-6 rounded-2xl bg-slate-50/60 border border-slate-200/60 hover:bg-white hover:shadow-lg transition-all"
                  >
                    <div className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center mb-4`}>
                      <item.icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-slate-900 text-base mb-2">{item.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
