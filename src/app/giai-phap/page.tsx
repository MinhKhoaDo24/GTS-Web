import type { Metadata } from 'next'
import Link from 'next/link'
import { query } from '@/lib/db'
import type { Solution, SiteSetting } from '@/types/database'
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
  Layers,
  Award,
  Send
} from 'lucide-react'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Giải Pháp Hạ Tầng Mạng & An Ninh Cho Doanh Nghiệp | GTS',
  description:
    'Các giải pháp công nghệ toàn diện từ GTS: WiFi Doanh nghiệp mật độ cao, Mạng Core Spine-Leaf 100G, Tường lửa thế hệ mới NGFW, Tổng đài VoIP và Hạ tầng Máy chủ Data Center.',
}

/** Fallback danh sách giải pháp hạ tầng mạng doanh nghiệp */
const defaultSolutions = [
  {
    id: 'sol-wifi',
    name: 'Giải Pháp WiFi Doanh Nghiệp Mật Độ Cao',
    slug: 'giai-phap-wifi',
    short_description: 'Phủ sóng WiFi 6/6E/7 roaming không gián đoạn cho văn phòng, khách sạn resort, nhà máy và trường học với mật độ hàng ngàn thiết bị kết nối đồng thời.',
    icon: Wifi,
    highlights: ['Roaming nhanh chuẩn 802.11r/k/v không rớt cuộc gọi VoIP', 'Phân quyền mạng khách (Guest Portal / Captive Portal)', 'Quản lý tập trung qua Cloud Controller hoặc Hardware Appliance', 'Bảo mật chuẩn WPA3 Enterprise ngăn chặn xâm nhập trái phép'],
  },
  {
    id: 'sol-mang',
    name: 'Giải Pháp Mạng Core / LAN / WAN Spine-Leaf',
    slug: 'giai-phap-mang',
    short_description: 'Thiết kế kiến trúc chuyển mạch tốc độ cao 10G/40G/100G cho tòa nhà văn phòng và trung tâm dữ liệu với độ trễ siêu thấp và khả năng dự phòng High Availability.',
    icon: Network,
    highlights: ['Kiến trúc Spine-Leaf tối ưu lưu lượng East-West', 'Dự phòng đường truyền đa kết nối (LACP, MLAG, Stacking)', 'Định tuyến động OSPF, BGP và chuyển mạch nhãn MPLS', 'Hỗ trợ cấp nguồn PoE+ / PoE++ cho camera và Access Point'],
  },
  {
    id: 'sol-bao-mat',
    name: 'Giải Pháp Bảo Mật Mạng NGFW & Zero Trust',
    slug: 'giai-phap-bao-mat',
    short_description: 'Tường lửa thế hệ mới (Fortinet FortiGate, Sophos XGS) kiểm soát sâu ứng dụng, ngăn chặn mã độc tống tiền (Ransomware), ngăn ngừa xâm nhập IPS và kết nối VPN an toàn.',
    icon: Lock,
    highlights: ['Kiểm soát ứng dụng tầng Application L7 và lọc URL', 'Chống tấn công Zero-day với công nghệ AI Sandboxing', 'Kết nối mạng riêng ảo VPN SSL / IPsec bảo mật cao', 'Tuân thủ tiêu chuẩn an ninh thông tin ISO 27001 và PCI-DSS'],
  },
  {
    id: 'sol-voip',
    name: 'Giải Pháp Tổng Đài VoIP & Truyền Thông Hợp Nhất',
    slug: 'giai-phap-voip',
    short_description: 'Hệ thống tổng đài IP PBX (Grandstream, Yeastar) giúp doanh nghiệp tiết kiệm 60% cước viễn thông, gọi nội bộ miễn phí giữa các chi nhánh trên toàn quốc.',
    icon: PhoneCall,
    highlights: ['Gọi nội bộ hoàn toàn miễn phí giữa các văn phòng', 'Ghi âm cuộc gọi, lời chào tự động IVR đa cấp độ', 'Tích hợp Softphone trên điện thoại di động và máy tính', 'Tích hợp CRM quản lý lịch sử liên hệ khách hàng'],
  },
  {
    id: 'sol-server',
    name: 'Giải Pháp Máy Chủ & Lưu Trữ Trung Tâm Dữ Liệu',
    slug: 'giai-phap-server',
    short_description: 'Hạ tầng máy chủ ảo hóa VMware / Proxmox trên nền tảng Dell PowerEdge, HPE ProLiant kết hợp hệ thống lưu trữ SAN / NAS an toàn tuyệt đối.',
    icon: Server,
    highlights: ['Ảo hóa gom cụm tài nguyên High Availability (HA)', 'Sao lưu dữ liệu tự động (Backup & Disaster Recovery)', 'Ổ cứng Enterprise NVMe / SAS tốc độ truy xuất cực cao', 'Quản trị từ xa chuyên sâu qua iDRAC / iLO'],
  },
  {
    id: 'sol-hoi-nghi',
    name: 'Giải Pháp Phòng Họp Hội Nghị Truyền Hình Thông Minh',
    slug: 'giai-phap-hoi-nghi',
    short_description: 'Hệ thống thiết bị phòng họp trực tuyến độ phân giải 4K chuyên dụng cho Microsoft Teams, Zoom Rooms, Webex với micro đa hướng lọc ồn thông minh.',
    icon: Video,
    highlights: ['Camera 4K Ultra HD tự động bắt khung hình người nói (Auto Framing)', 'Micro đa hướng lọc tiếng ồn công nghệ AI thông minh', 'Tương thích tuyệt đối với Microsoft Teams, Zoom, Google Meet', 'Thao tác 1 chạm One-Touch Join bắt đầu cuộc họp ngay lập tức'],
  },
]

export default async function SolutionsPage() {
  const [dbSolutions, settingsArr] = await Promise.all([
    query<Solution>(
      'SELECT id, domain_id, name, slug, short_description, description, thumbnail, banner FROM solutions WHERE is_active = true ORDER BY sort_order ASC'
    ).catch(() => []),
    query<SiteSetting>('SELECT key, value FROM site_settings').catch(() => []),
  ])

  const settings: Record<string, string> = Object.fromEntries(
    settingsArr.map((s) => [s.key, s.value ?? ''])
  )

  const hotline = settings.hotline || '0901 234 567'
  const solutionsToRender = dbSolutions.length > 0 ? dbSolutions : defaultSolutions

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
          <span className="text-slate-900 font-bold">Giải pháp doanh nghiệp</span>
        </nav>

        {/* ── Header Banner ───────────────────────────────────────────────── */}
        <div className="bg-gradient-to-r from-[#0F172A] via-[#1D4ED8] to-[#1e40af] text-white rounded-3xl p-8 sm:p-14 mb-12 shadow-xl relative overflow-hidden">
          <div className="max-w-3xl relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/15 text-blue-100 text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full mb-4 border border-white/20 backdrop-blur-sm">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>Kiến trúc giải pháp tích hợp chuẩn Enterprise</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight mb-4">
              Giải Pháp Hạ Tầng Công Nghệ Toàn Diện
            </h1>
            <p className="text-sm sm:text-base text-blue-100 leading-relaxed max-w-2xl">
              Được thiết kế bài bản theo tiêu chuẩn quốc tế từ các hãng Cisco, Fortinet, HPE và Dell — đảm bảo khả năng chịu tải cao, an ninh bảo mật và dễ dàng mở rộng.
            </p>
          </div>
        </div>

        {/* ── Lưới Giải Pháp (Render động từ CSDL kèm fallback) ─────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-14">
          {solutionsToRender.map((sol, idx) => {
            const Icon = (defaultSolutions[idx]?.icon) || Network
            const highlights = (defaultSolutions[idx]?.highlights) || [
              'Thiết kế chuẩn kỹ thuật hãng sản xuất',
              'Độ tin cậy và khả năng dự phòng High Availability',
              'Bảo mật dữ liệu nhiều lớp chuẩn quốc tế',
              'Tối ưu hóa tổng chi phí sở hữu TCO',
            ]

            return (
              <div
                key={sol.id}
                className="bg-white rounded-3xl p-8 border border-slate-200/80 hover:border-blue-300 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#1D4ED8] flex items-center justify-center mb-6">
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mb-3 leading-snug">
                    {sol.name}
                  </h3>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6">
                    {sol.short_description}
                  </p>

                  <div className="space-y-2 pt-4 border-t border-slate-100 mb-6">
                    {highlights.map((item, hIdx) => (
                      <div key={hIdx} className="flex items-start gap-2 text-xs text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    href={`/giai-phap/${sol.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#1D4ED8] hover:underline"
                  >
                    <span>Xem chi tiết</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <Link
                    href={`/lien-he?solution=${encodeURIComponent(sol.slug)}&type=quote`}
                    className="bg-[#1D4ED8] hover:bg-[#1E40AF] text-white px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors shadow-xs"
                  >
                    Nhận tư vấn
                  </Link>
                </div>
              </div>
            )
          })}
        </div>

        {/* ── CTA Banner ──────────────────────────────────────────────────── */}
        <div className="bg-gradient-to-r from-[#0F172A] to-[#1E293B] text-white rounded-3xl p-8 sm:p-10 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold mb-2">
                Doanh nghiệp của bạn cần giải pháp mạng tùy chỉnh?
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm">
                Chúng tôi sẵn sàng khảo sát thực tế và thiết kế sơ đồ topo PoC chuyên biệt cho bài toán của bạn.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/lien-he?type=consultation"
                className="bg-[#1D4ED8] hover:bg-[#1E40AF] text-white px-6 py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider transition-colors shadow-md"
              >
                Đặt lịch tư vấn giải pháp
              </Link>
              <a
                href={`tel:${hotline.replace(/\s/g, '')}`}
                className="bg-white/10 hover:bg-white/20 text-white px-6 py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider transition-colors border border-white/20"
              >
                Hotline: {hotline}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
