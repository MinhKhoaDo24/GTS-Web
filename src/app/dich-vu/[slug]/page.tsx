import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { queryOne, query } from '@/lib/db'
import type { Service, SiteSetting, PageContent } from '@/types/database'
import { RichTextRenderer } from '@/components/RichTextRenderer'
import {
  Wrench,
  Settings,
  Lightbulb,
  Package,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ChevronRight,
  Home,
  PhoneCall,
  Send,
  Clock,
  Layers,
  FileText
} from 'lucide-react'

export const revalidate = 3600

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

/** Fallback metadata & data cho 4 dịch vụ cơ bản */
const fallbackServicesData: Record<
  string,
  {
    name: string
    short_description: string
    detail: string
    steps: string[]
    commitments: string[]
  }
> = {
  'dich-vu-tu-van': {
    name: 'Tư Vấn & Thiết Kế Giải Pháp Mạng Doanh Nghiệp',
    short_description: 'Khảo sát hiện trạng hạ tầng, đo kiểm mô phỏng và lập hồ sơ thiết kế mạng Core/Distribution tối ưu chi phí đầu tư TCO.',
    detail:
      'GTS cung cấp dịch vụ tư vấn kỹ thuật toàn diện cho các hệ thống mạng từ văn phòng vừa và nhỏ (SMB) đến trung tâm dữ liệu và mạng đa chi nhánh của các tập đoàn lớn. Đội ngũ chuyên gia sở hữu chứng chỉ quốc tế (CCNP, CCIE, NSE 4+, Aruba ACMP) sẽ trực tiếp khảo sát thực địa, phân tích lưu lượng, dự báo nhu cầu mở rộng trong 3-5 năm tới và xây dựng hồ sơ thiết kế chi tiết bao gồm BOM thiết bị, sơ đồ topo mạng L2/L3 và chính sách bảo mật phù hợp nhất.',
    steps: [
      'Tiếp nhận yêu cầu bài toán & ngân sách dự kiến của doanh nghiệp',
      'Kỹ sư khảo sát hiện trường, đo kiểm cáp quang/cáp đồng và môi trường sóng WiFi',
      'Lập phương án kỹ thuật chi tiết: sơ đồ kiến trúc, danh mục thiết bị (BOM), tính toán công suất nguồn & làm mát',
      'Hỗ trợ bảo vệ hồ sơ thiết kế và lập dự toán tối ưu chi phí đầu tư TCO',
    ],
    commitments: [
      'Thiết kế chuẩn hãng 100% (Cisco Validated Design, Fortinet Architecture)',
      'Tương thích hoàn toàn với hạ tầng sẵn có của khách hàng',
      'Cam kết không phát sinh chi phí thiết bị ngoài dự toán đã duyệt',
      'Miễn phí tư vấn và demo kiểm thử tính năng (PoC)',
    ],
  },
  'dich-vu-trien-khai': {
    name: 'Triển Khai & Cài Đặt Hạ Tầng Mạng Chuẩn Hãng',
    short_description: 'Lắp đặt vật lý tủ rack, đấu nối cáp quang/đồng, cấu hình tính năng nâng cao (VLAN, Routing, HA, Firewall Policies).',
    detail:
      'Dịch vụ triển khai của GTS đảm bảo hệ thống phần cứng mạng và máy chủ của quý doanh nghiệp được lắp đặt và cấu hình theo đúng quy chuẩn nghiêm ngặt nhất của nhà sản xuất. Chúng tôi thực hiện toàn bộ các công đoạn: gắn tủ rack, đánh nhãn cáp mạng chuyên nghiệp, đấu nối nguồn điện dự phòng UPS, cập nhật firmware mới nhất, cấu hình phân chia mạng ảo VLAN, định tuyến động OSPF/BGP, thiết lập cụm dự phòng High Availability (Active-Standby) và kiểm thử thông lượng chịu tải trước khi bàn giao.',
    steps: [
      'Kiểm tra tiếp nhận thiết bị, đối soát chứng chỉ CO/CQ và tình trạng nguyên niêm phong',
      'Thi công lắp đặt vật lý tủ rack, đấu nối cáp mạng, dán nhãn nhận diện theo tiêu chuẩn',
      'Cấu hình hệ điều hành và các thông số kỹ thuật (VLAN, Routing, QoS, Firewall, VPN)',
      'Chạy thử nghiệm nghiệm thu (UAT), đo kiểm suy hao và bàn giao tài liệu kỹ thuật',
    ],
    commitments: [
      'Triển khai ngoài giờ hành chính hoặc cuối tuần để không gián đoạn hoạt động kinh doanh',
      'Kỹ sư có chứng chỉ chuyên môn trực tiếp thi công và giám sát',
      'Bàn giao đầy đủ file backup cấu hình và sơ đồ thực tế (As-built Drawing)',
      'Bảo hành kỹ thuật triển khai 12 tháng kể từ ngày ký biên bản nghiệm thu',
    ],
  },
  'dich-vu-bao-tri': {
    name: 'Bảo Trì Định Kỳ & Hỗ Trợ Kỹ Thuật 24/7 (SLA)',
    short_description: 'Cam kết SLA phản hồi nhanh dưới 30 phút, vệ sinh thiết bị định kỳ, sao lưu cấu hình và nâng cấp bản vá an ninh Zero-day.',
    detail:
      'Hạ tầng mạng ổn định là mạch máu của mọi doanh nghiệp. Gói dịch vụ bảo trì định kỳ của GTS mang đến sự an tâm tuyệt đối với đội ngũ kỹ sư túc trực 24/7/365. Chúng tôi tiến hành kiểm tra sức khỏe hệ thống định kỳ hàng tháng/hàng quý: kiểm tra nhiệt độ, quạt tản nhiệt, tình trạng nguồn phụ, kiểm tra log lỗi, rà soát lỗ hổng bảo mật và cập nhật bản vá khẩn cấp. Khi có sự cố, GTS cam kết có mặt tại hiện trường trong vòng 2h - 4h để xử lý triệt để.',
    steps: [
      'Khảo sát và lập hồ sơ hiện trạng hệ thống thiết bị cần đưa vào diện bảo trì',
      'Thực hiện định kỳ bảo dưỡng vật lý, vệ sinh công nghiệp và kiểm tra nguồn cấp',
      'Phân tích file log cảnh báo, kiểm tra tài nguyên CPU/RAM và sao lưu cấu hình định kỳ',
      'Trực kỹ thuật 24/7, ứng cứu sự cố tại chỗ theo đúng cam kết SLA',
    ],
    commitments: [
      'Cam kết thời gian phản hồi sự cố dưới 30 phút qua hotline chuyên biệt',
      'Cam kết có mặt xử lý tại chân công trình trong 2-4 giờ (Hà Nội & TP.HCM)',
      'Cho mượn thiết bị tương đương thay thế tạm thời trong lúc chờ bảo hành',
      'Báo cáo tình trạng hệ thống và khuyến nghị nâng cấp định kỳ',
    ],
  },
  'dich-vu-spare-part': {
    name: 'Cung Cấp Linh Kiện Thay Thế & Spare Part Cứu Hộ',
    short_description: 'Kho linh kiện chính hãng sẵn sàng tại Hà Nội và TP.HCM: Nguồn phụ, Fan module, SFP/SFP+, RAM máy chủ, Card mạng.',
    detail:
      'Nhằm giảm thiểu tối đa thời gian gián đoạn (Downtime) khi phần cứng gặp sự cố bất ngờ, GTS duy trì kho linh kiện thay thế (Spare Part) chính hãng quy mô lớn cho các dòng thiết bị Cisco Catalyst, FortiGate, HPE ProLiant, Dell PowerEdge. Chúng tôi cung cấp dịch vụ giao hàng hỏa tốc trong vòng 2 giờ đối với các linh kiện khẩn cấp như bộ nguồn dự phòng, quạt tản nhiệt, module quang hoặc ổ cứng máy chủ Enterprise.',
    steps: [
      'Tiếp nhận yêu cầu mã linh kiện (Part Number) hoặc phân tích sự cố thiết bị',
      'Kiểm tra tồn kho linh kiện chính hãng tương thích 100% tại kho HN/HCM',
      'Giao hàng hỏa tốc hoặc kỹ sư mang linh kiện tới trực tiếp thay thế tận nơi',
      'Kiểm tra hoạt động bình thường của thiết bị sau khi thay linh kiện',
    ],
    commitments: [
      '100% linh kiện chính hãng mới hoặc pull-server đã qua kiểm thử tải nghiêm ngặt',
      'Bảo hành 1 đổi 1 trong thời gian từ 12 đến 36 tháng',
      'Có sẵn nguồn dự phòng, quạt, module quang SFP+ 10G/25G/40G/100G',
      'Giao hàng hỏa tốc 2 giờ nội thành Hà Nội & TP. Hồ Chí Minh',
    ],
  },
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params
  const slug = resolvedParams.slug

  const service = await queryOne<Service>(
    'SELECT name, short_description, seo_title, seo_description FROM services WHERE slug = $1 LIMIT 1',
    [slug]
  ).catch(() => null)

  const fallback = fallbackServicesData[slug]

  return {
    title: service?.seo_title || service?.name || fallback?.name || 'Dịch Vụ Kỹ Thuật | GTS Enterprise',
    description:
      service?.seo_description ||
      service?.short_description ||
      fallback?.short_description ||
      'Dịch vụ kỹ thuật triển khai hạ tầng mạng doanh nghiệp chính hãng tại GTS.',
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

  const fallback = fallbackServicesData[slug]

  // Nếu không có cả trong CSDL lẫn fallback mặc định -> 404
  if (!service && !page && !fallback) {
    notFound()
  }

  const settings: Record<string, string> = Object.fromEntries(
    settingsArr.map((s) => [s.key, s.value ?? ''])
  )

  const hotline = settings.hotline || '0901 234 567'

  const title = service?.name || page?.title || fallback?.name || 'Dịch vụ kỹ thuật'
  const shortDesc = service?.short_description || fallback?.short_description || ''
  const customContent = service?.description || page?.content || null

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
          <Link href="/dich-vu" className="hover:text-[#1D4ED8] transition-colors">
            Dịch vụ kỹ thuật
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <span className="text-slate-900 font-bold truncate max-w-md">{title}</span>
        </nav>

        {/* ── Header Banner ───────────────────────────────────────────────── */}
        <div className="bg-gradient-to-r from-[#0F172A] via-[#1D4ED8] to-[#1e40af] text-white rounded-3xl p-8 sm:p-12 mb-12 shadow-xl relative overflow-hidden">
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
          {/* CỘT NỘI DUNG CHÍNH (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            {/* NẾU ADMIN ĐÃ NHẬP NỘI DUNG QUA BACKEND CMS: RENDER QUA RICHTEXT */}
            {customContent ? (
              <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-xs">
                <RichTextRenderer content={customContent} />
              </div>
            ) : (
              /* NẾU CHƯA CÓ NỘI DUNG TỪ DB: RENDER TEMPLATE DOANH NGHIỆP */
              <div className="space-y-8">
                {/* Giới thiệu chi tiết */}
                <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-xs space-y-4">
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                    Tổng Quan Dịch Vụ
                  </h2>
                  <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
                    {fallback?.detail}
                  </p>
                </div>

                {/* Các bước quy trình */}
                {fallback?.steps && (
                  <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-xs space-y-5">
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                      Quy Trình Thực Hiện Chuẩn Kỹ Thuật
                    </h2>
                    <div className="space-y-3">
                      {fallback.steps.map((step, sIdx) => (
                        <div key={sIdx} className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                          <div className="w-7 h-7 rounded-xl bg-[#1D4ED8] text-white flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                            {sIdx + 1}
                          </div>
                          <span className="text-xs sm:text-sm text-slate-800 font-semibold leading-relaxed">
                            {step}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Cam kết chất lượng */}
                {fallback?.commitments && (
                  <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-xs space-y-4">
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                      Cam Kết Của GTS Đối Với Khách Hàng
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {fallback.commitments.map((cmt, cIdx) => (
                        <div key={cIdx} className="flex items-start gap-2.5 p-3 rounded-2xl bg-emerald-50/50 border border-emerald-100 text-xs sm:text-sm text-slate-800 font-medium">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span>{cmt}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* CỘT SIDEBAR LIÊN HỆ & BÁO GIÁ (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Box Đặt Lịch Tư Vấn */}
            <div className="bg-white rounded-3xl p-7 border border-slate-200/80 shadow-xs space-y-5">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#1D4ED8] pb-2 border-b border-slate-100">
                <Send className="w-4 h-4" />
                <span>Yêu cầu tư vấn dịch vụ</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Để lại thông tin hoặc liên hệ trực tiếp với kỹ sư phụ trách để nhận tư vấn phương án kỹ thuật và báo giá chi tiết trong vòng 24 giờ.
              </p>

              <Link
                href={`/lien-he?service=${encodeURIComponent(slug)}&type=consultation`}
                className="w-full bg-[#1D4ED8] hover:bg-[#1E40AF] text-white py-3.5 px-4 rounded-2xl font-bold text-xs uppercase tracking-wider text-center block transition-colors shadow-md"
              >
                Gửi yêu cầu dịch vụ này
              </Link>

              <a
                href={`tel:${hotline.replace(/\s/g, '')}`}
                className="w-full bg-[#0F172A] hover:bg-slate-800 text-white py-3.5 px-4 rounded-2xl font-bold text-xs text-center block transition-colors flex items-center justify-center gap-2"
              >
                <PhoneCall className="w-4 h-4 text-amber-400" />
                <span>Hotline kỹ thuật: {hotline}</span>
              </a>
            </div>

            {/* Box Các Dịch Vụ Khác */}
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
                        ? 'bg-blue-50 text-[#1D4ED8]'
                        : 'text-slate-700 hover:bg-slate-50 hover:text-[#1D4ED8]'
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
