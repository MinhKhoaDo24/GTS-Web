import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { queryOne, query } from '@/lib/db'
import type { Solution, SiteSetting, PageContent } from '@/types/database'
import { RichTextRenderer } from '@/components/RichTextRenderer'
import {
  Wifi,
  Network,
  Lock,
  PhoneCall,
  Video,
  Server,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ChevronRight,
  Home,
  Phone,
  Send,
  Cpu,
  Layers,
  FileCheck2
} from 'lucide-react'

export const revalidate = 3600

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

/** Fallback metadata & data cho các giải pháp cơ bản */
const fallbackSolutionsData: Record<
  string,
  {
    name: string
    slug?: string
    short_description: string
    detail: string
    architecture: string[]
    benefits: string[]
  }
> = {
  'giai-phap-wifi': {
    name: 'Giải Pháp WiFi Doanh Nghiệp Mật Độ Cao',
    short_description: 'Phủ sóng WiFi 6/6E/7 roaming không gián đoạn cho văn phòng, khách sạn, nhà máy với mật độ hàng ngàn kết nối đồng thời.',
    detail:
      'Giải pháp mạng không dây (Wireless LAN) chuyên dụng của GTS được xây dựng trên các nền tảng Access Point chuẩn WiFi 6/6E/7 tiên tiến từ Cisco Catalyst, HPE Aruba và Ubiquiti UniFi. Hệ thống sử dụng công nghệ roaming thông minh 802.11r/k/v giúp thiết bị chuyển vùng giữa các Access Point mượt mà không bị ngắt kết nối cuộc gọi VoIP hay video call. Đồng thời hỗ trợ phân quyền truy cập thông minh qua cổng chào Captive Portal, cách ly mạng nội bộ và mạng khách an toàn tuyệt đối.',
    architecture: [
      'Access Point chuẩn WiFi 6/7 chịu tải cao từ 200 - 500+ client/AP',
      'Hệ thống điều khiển tập trung Cloud Controller hoặc Hardware Controller dự phòng HA',
      'Hạ tầng chuyển mạch Switch PoE+ / PoE++ chuẩn Multi-Gigabit 2.5G/5Gbps',
      'Cổng xác thực Captive Portal phân quyền truy cập người dùng và khách hàng',
    ],
    benefits: [
      'Phủ sóng không góc chết, tự động điều chỉnh kênh và công suất phát RF thông minh',
      'Bảo mật chuẩn WPA3-Enterprise, chống giả mạo điểm phát Rogue AP',
      'Báo cáo trực quan lưu lượng sử dụng và trải nghiệm người dùng theo thời gian thực',
      'Tiết kiệm chi phí triển khai và dễ dàng mở rộng thêm Access Point khi cần',
    ],
  },
  'giai-phap-mang': {
    name: 'Giải Pháp Mạng Core / LAN / WAN Doanh Nghiệp Spine-Leaf',
    short_description: 'Hạ tầng chuyển mạch tốc độ cao 10G/40G/100G với độ trễ cực thấp và dự phòng đường truyền High Availability.',
    detail:
      'Hạ tầng chuyển mạch (Switching) là xương sống của mọi hệ thống thông tin. GTS thiết kế mạng Core/Distribution theo kiến trúc 2 tầng hoặc Spine-Leaf hiện đại, sử dụng các dòng Switch Enterprise (Cisco Catalyst 9000, Ruijie Reyee, HPE Aruba CX). Toàn bộ hệ thống được trang bị tính năng ghép cụm Stacking / VSL / MLAG, dự phòng nguồn kép và đường truyền quang đa hướng, đảm bảo khi một tuyến cáp hay thiết bị gặp sự cố thì mạng vẫn hoạt động liền mạch với thời gian chuyển mạch dưới 50ms.',
    architecture: [
      'Lớp Core Switch tốc độ cổng quang 10G/40G/100G băng thông chuyển mạch terabit',
      'Lớp Access Switch hỗ trợ cổng Gigabit, PoE+ cấp nguồn camera và Access Point',
      'Kết nối dự phòng Stacking / LACP phân tải thông minh trên từng tuyến cáp',
      'Hệ thống quản lý giám sát trạng thái mạng tự động cảnh báo sự cố',
    ],
    benefits: [
      'Băng thông cực lớn, không nghẽn cổ chai khi lưu lượng dữ liệu truyền tải tăng vọt',
      'Khả năng sẵn sàng 99.999% (Five Nines), không xảy ra Single Point of Failure',
      'Phân chia VLAN bảo mật nghiêm ngặt giữa các phòng ban và máy chủ',
      'Bảo hành chính hãng 3 năm kèm dịch vụ hỗ trợ kỹ thuật tại chỗ',
    ],
  },
  'giai-phap-bao-mat': {
    name: 'Giải Pháp Bảo Mật Mạng Firewall NGFW & Zero Trust',
    short_description: 'Tường lửa thế hệ mới ngăn chặn mã độc Ransomware, lọc nội dung web, phòng chống xâm nhập IPS và kết nối VPN an toàn.',
    detail:
      'Trước các nguy cơ tấn công mạng ngày càng tinh vi, giải pháp an ninh của GTS kết hợp tường lửa thế hệ mới (Fortinet FortiGate, Sophos XGS) với kiến trúc bảo mật Zero Trust ("Không tin tưởng ai, luôn xác minh"). Tường lửa thực hiện kiểm tra sâu gói tin SSL/TLS mà không làm suy giảm hiệu năng, phát hiện và tiêu diệt mã độc tống tiền (Ransomware), ngăn chặn rò rỉ dữ liệu (DLP) và thiết lập kênh truyền VPN mã hóa chuẩn quân đội cho nhân sự làm việc từ xa.',
    architecture: [
      'Thiết bị Firewall Next-Gen (NGFW) cụm dự phòng High Availability (Active-Passive)',
      'Công nghệ AI Sandboxing phân tích tệp lạ ngăn chặn tấn công Zero-day',
      'Hệ thống phát hiện và ngăn chặn xâm nhập trái phép (IPS / IDS)',
      'Hạ tầng VPN SSL / IPsec bảo mật đa yếu tố (MFA / 2FA) cho nhân sự làm việc từ xa',
    ],
    benefits: [
      'Kiểm soát toàn diện các ứng dụng truy cập mạng (Facebook, YouTube, Torrent...)',
      'Bảo vệ dữ liệu nhạy cảm của doanh nghiệp trước các cuộc tấn công đánh cắp dữ liệu',
      'Đáp ứng đầy đủ các tiêu chuẩn kiểm toán an ninh thông tin ISO 27001 và ngân hàng',
      'Báo cáo chi tiết các nguy cơ và lưu lượng tấn công theo chu kỳ hàng tuần/tháng',
    ],
  },
  'giai-phap-voip': {
    name: 'Giải Pháp Tổng Đài VoIP & Truyền Thông Hợp Nhất',
    short_description: 'Tiết kiệm 60% cước viễn thông, gọi nội bộ miễn phí trên toàn quốc, tích hợp Softphone trên smartphone và ghi âm cuộc gọi.',
    detail:
      'GTS cung cấp hệ thống tổng đài IP PBX hiện đại từ Grandstream và Yeastar, thay thế hoàn toàn tổng đài analog cũ kỹ. Hệ thống cho phép doanh nghiệp kết nối không giới hạn các chi nhánh trên toàn quốc thông qua mạng Internet, mọi cuộc gọi nội bộ giữa các phòng ban đều hoàn toàn miễn phí. Hỗ trợ đầy đủ các tính năng thông minh: lời chào tự động IVR phân luồng cuộc gọi, ghi âm cuộc gọi chất lượng cao, hộp thư thoại gửi qua email và ứng dụng Softphone giúp nhân viên nghe gọi số cố định công ty ngay trên smartphone cá nhân.',
    architecture: [
      'Tổng đài IP PBX phần cứng chuyên dụng hoặc Cloud IP PBX linh hoạt',
      'Điện thoại IP để bàn âm thanh HD Voice có cổng mạng Gigabit kèm PoE',
      'Đầu số cố định Siptrunk từ các nhà mạng VNPT, Viettel, FPT Telecom',
      'Ứng dụng Softphone cài đặt trên điện thoại di động iOS / Android và máy tính',
    ],
    benefits: [
      'Giảm thiểu tối đa cước viễn thông hàng tháng của doanh nghiệp',
      'Không bỏ lỡ cuộc gọi của khách hàng nhờ tính năng chuyển cuộc gọi thông minh',
      'Nâng cao hình ảnh chuyên nghiệp của công ty với lời chào thương hiệu bài bản',
      'Dễ dàng mở rộng thêm máy nhánh mới trong vài phút mà không cần kéo thêm dây điện thoại',
    ],
  },
  'giai-phap-server': {
    name: 'Giải Pháp Máy Chủ & Lưu Trữ Data Center HA',
    slug: 'giai-phap-server',
    short_description: 'Cụm máy chủ ảo hóa VMware / Proxmox kết hợp hệ thống lưu trữ SAN / NAS an toàn tuyệt đối và sao lưu tự động.',
    detail:
      'Giải pháp máy chủ và lưu trữ của GTS được thiết kế trên các nền tảng phần cứng máy chủ hàng đầu Dell PowerEdge và HPE ProLiant. Chúng tôi tối ưu hóa việc phân bổ tài nguyên phần cứng thông qua công nghệ ảo hóa, gom cụm máy chủ thành một khối tài nguyên thống nhất với khả năng tự động di chuyển máy ảo (vMotion) khi có sự cố phần cứng. Hệ thống lưu trữ mạng SAN/NAS sử dụng ổ cứng Enterprise với cơ chế RAID đa lớp và tự động sao lưu dự phòng (Backup & Disaster Recovery) đảm bảo an toàn tuyệt đối cho cơ sở dữ liệu doanh nghiệp.',
    architecture: [
      'Cụm máy chủ Rack 1U/2U cấu hình Dual CPU Intel Xeon / AMD EPYC, RAM ECC',
      'Hệ thống lưu trữ SAN / NAS iSCSI / Fibre Channel tốc độ 16G/32G',
      'Nền tảng ảo hóa VMware vSphere / Microsoft Hyper-V / Proxmox VE',
      'Giải pháp sao lưu dữ liệu chuyên dụng (Veeam Backup & Replication)',
    ],
    benefits: [
      'Tận dụng tối đa công suất phần cứng, tiết kiệm điện năng và diện tích tủ rack',
      'Khôi phục hoạt động của hệ thống trong vòng vài phút khi có sự cố hỏng hóc',
      'Dữ liệu được mã hóa và bảo vệ trước mã độc tống tiền Ransomware',
      'Hỗ trợ quản trị từ xa chuyên sâu qua card quản lý độc lập iDRAC Enterprise / iLO',
    ],
  },
  'giai-phap-hoi-nghi': {
    name: 'Giải Pháp Phòng Họp Hội Nghị Truyền Hình Thông Minh',
    slug: 'giai-phap-hoi-nghi',
    short_description: 'Phòng họp trực tuyến 4K chuyên dụng cho Microsoft Teams, Zoom Rooms với camera tự động bắt người nói và micro lọc ồn.',
    detail:
      'GTS thiết kế và lắp đặt trọn gói hệ thống hội nghị truyền hình (Video Conference) cho các phòng họp từ nhỏ (Huddle room) đến hội trường lớn 50-100 người. Hệ thống tích hợp camera 4K Ultra HD góc rộng với công nghệ AI tự động nhận diện và phóng to người đang phát biểu (Auto-framing & Speaker Tracking), kết hợp hệ thống micro mảng đa hướng triệt tiêu tiếng vọng và tiếng ồn xung quanh. Tương thích hoàn hảo với các nền tảng họp trực tuyến hàng đầu: Microsoft Teams Rooms, Zoom Rooms, Cisco Webex, Google Meet.',
    architecture: [
      'Camera hội nghị truyền hình 4K công nghệ AI bắt khung hình tự động',
      'Soundbar tích hợp micro mảng đa hướng và loa tái tạo giọng nói trung thực',
      'Màn hình hiển thị chuyên dụng độ sáng cao hoạt động bền bỉ 16/7 hoặc 24/7',
      'Bộ điều khiển cảm ứng đặt bàn (Touch Controller) thao tác 1 chạm bắt đầu cuộc họp',
    ],
    benefits: [
      'Chất lượng hình ảnh và âm thanh sắc nét, xóa nhòa khoảng cách địa lý',
      'Thao tác cực kỳ đơn giản, không mất thời gian đấu nối cáp phức tạp trước cuộc họp',
      'Chia sẻ màn hình và tài liệu thuyết trình không dây mượt mà',
      'Tối ưu chi phí đi lại và tăng tốc độ ra quyết định trong nội bộ doanh nghiệp',
    ],
  },
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params
  const slug = resolvedParams.slug

  const solution = await queryOne<Solution>(
    'SELECT name, short_description, seo_title, seo_description FROM solutions WHERE slug = $1 LIMIT 1',
    [slug]
  ).catch(() => null)

  const fallback = fallbackSolutionsData[slug]

  return {
    title: solution?.seo_title || solution?.name || fallback?.name || 'Giải Pháp Doanh Nghiệp | GTS',
    description:
      solution?.seo_description ||
      solution?.short_description ||
      fallback?.short_description ||
      'Giải pháp hạ tầng mạng và an ninh doanh nghiệp chính hãng tại GTS.',
  }
}

export default async function SolutionDetailPage({ params }: PageProps) {
  const resolvedParams = await params
  const slug = resolvedParams.slug

  // 1. Query từ bảng solutions
  const [solution, page, settingsArr] = await Promise.all([
    queryOne<Solution>(
      'SELECT id, domain_id, name, slug, short_description, description, thumbnail, banner FROM solutions WHERE slug = $1 LIMIT 1',
      [slug]
    ).catch(() => null),
    // 2. Query fallback từ bảng pages (nếu admin tạo trong CMS pages)
    queryOne<PageContent>(
      'SELECT id, title, slug, content FROM pages WHERE slug = $1 LIMIT 1',
      [slug]
    ).catch(() => null),
    query<SiteSetting>('SELECT key, value FROM site_settings').catch(() => []),
  ])

  const fallback = fallbackSolutionsData[slug]

  if (!solution && !page && !fallback) {
    notFound()
  }

  const settings: Record<string, string> = Object.fromEntries(
    settingsArr.map((s) => [s.key, s.value ?? ''])
  )

  const hotline = settings.hotline || '0901 234 567'

  const title = solution?.name || page?.title || fallback?.name || 'Giải pháp doanh nghiệp'
  const shortDesc = solution?.short_description || fallback?.short_description || ''
  const customContent = solution?.description || page?.content || null

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
          <Link href="/giai-phap" className="hover:text-[#1D4ED8] transition-colors">
            Giải pháp doanh nghiệp
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <span className="text-slate-900 font-bold truncate max-w-md">{title}</span>
        </nav>

        {/* ── Header Banner ───────────────────────────────────────────────── */}
        <div className="bg-gradient-to-r from-[#0F172A] via-[#1D4ED8] to-[#1e40af] text-white rounded-3xl p-8 sm:p-12 mb-12 shadow-xl relative overflow-hidden">
          <div className="max-w-3xl relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/15 text-blue-100 text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full mb-3 border border-white/20 backdrop-blur-sm">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>Kiến trúc giải pháp tích hợp</span>
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
                {/* Giới thiệu chi tiết giải pháp */}
                <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-xs space-y-4">
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                    Tổng Quan Kiến Trúc Giải Pháp
                  </h2>
                  <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
                    {fallback?.detail}
                  </p>
                </div>

                {/* Các thành phần kiến trúc */}
                {fallback?.architecture && (
                  <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-xs space-y-5">
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                      Các Thành Phần Cấu Thành Hệ Thống
                    </h2>
                    <div className="space-y-3">
                      {fallback.architecture.map((item, aIdx) => (
                        <div key={aIdx} className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                          <div className="w-7 h-7 rounded-xl bg-[#1D4ED8] text-white flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                            {aIdx + 1}
                          </div>
                          <span className="text-xs sm:text-sm text-slate-800 font-semibold leading-relaxed">
                            {item}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Lợi ích mang lại */}
                {fallback?.benefits && (
                  <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-xs space-y-4">
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                      Lợi Ích Cốt Lõi Mang Lại Cho Doanh Nghiệp
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {fallback.benefits.map((b, bIdx) => (
                        <div key={bIdx} className="flex items-start gap-2.5 p-3 rounded-2xl bg-emerald-50/50 border border-emerald-100 text-xs sm:text-sm text-slate-800 font-medium">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span>{b}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* CỘT SIDEBAR LIÊN HỆ & TƯ VẤN (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Box Đặt Lịch Tư Vấn PoC */}
            <div className="bg-white rounded-3xl p-7 border border-slate-200/80 shadow-xs space-y-5">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#1D4ED8] pb-2 border-b border-slate-100">
                <Send className="w-4 h-4" />
                <span>Nhận hồ sơ thiết kế & Báo giá</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Đội ngũ kỹ sư GTS sẵn sàng demo tính năng (PoC) và thiết kế sơ đồ topo mạng theo hiện trạng thực tế của quý doanh nghiệp.
              </p>

              <Link
                href={`/lien-he?solution=${encodeURIComponent(slug)}&type=quote`}
                className="w-full bg-[#1D4ED8] hover:bg-[#1E40AF] text-white py-3.5 px-4 rounded-2xl font-bold text-xs uppercase tracking-wider text-center block transition-colors shadow-md"
              >
                Yêu cầu thiết kế giải pháp
              </Link>

              <a
                href={`tel:${hotline.replace(/\s/g, '')}`}
                className="w-full bg-[#0F172A] hover:bg-slate-800 text-white py-3.5 px-4 rounded-2xl font-bold text-xs text-center block transition-colors flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4 text-amber-400" />
                <span>Hotline: {hotline}</span>
              </a>
            </div>

            {/* Box Các Giải Pháp Khác */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 pb-2.5 border-b border-slate-100 mb-3">
                Các giải pháp doanh nghiệp khác
              </h3>
              <div className="space-y-1">
                {[
                  { label: 'WiFi Doanh nghiệp mật độ cao', slug: 'giai-phap-wifi' },
                  { label: 'Mạng Core / LAN / WAN 100G', slug: 'giai-phap-mang' },
                  { label: 'Bảo mật Firewall NGFW & Zero Trust', slug: 'giai-phap-bao-mat' },
                  { label: 'Tổng đài VoIP & Call Center', slug: 'giai-phap-voip' },
                  { label: 'Máy chủ & Lưu trữ Data Center', slug: 'giai-phap-server' },
                  { label: 'Hội nghị truyền hình thông minh', slug: 'giai-phap-hoi-nghi' },
                ].map((item) => (
                  <Link
                    key={item.slug}
                    href={`/giai-phap/${item.slug}`}
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
