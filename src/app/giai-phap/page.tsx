import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllActiveSolutions } from '@/lib/dal/solutions'
import { query } from '@/lib/db'
import type { SiteSetting } from '@/types/database'
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
  Award,
  Zap,
  Headphones,
  Check,
  FileCheck,
  HelpCircle,
  Building2,
  HardDrive
} from 'lucide-react'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Giải Pháp Hạ Tầng & An Ninh Mạng Doanh Nghiệp | GTS',
  description:
    'Các giải pháp công nghệ toàn diện từ GTS: WiFi Doanh nghiệp mật độ cao, Mạng Core Spine-Leaf 100G, Tường lửa NGFW & Zero Trust, Tổng đài VoIP, Hội nghị truyền hình 4K và Máy chủ Data Center.',
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

function getSolutionBadge(slug: string) {
  switch (slug) {
    case 'giai-phap-wifi':
      return { text: 'Wireless & Mobility', color: 'bg-blue-50 text-blue-700 border-blue-200' }
    case 'giai-phap-mang':
      return { text: 'Enterprise Networking', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' }
    case 'giai-phap-bao-mat':
      return { text: 'Next-Gen Cyber Security', color: 'bg-rose-50 text-rose-700 border-rose-200' }
    case 'giai-phap-voip':
      return { text: 'Unified Communications', color: 'bg-amber-50 text-amber-700 border-amber-200' }
    case 'giai-phap-hoi-nghi':
      return { text: 'Smart Meeting & AI Rooms', color: 'bg-purple-50 text-purple-700 border-purple-200' }
    case 'giai-phap-server':
      return { text: 'Cloud & Data Center', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' }
    default:
      return { text: 'Enterprise IT Solution', color: 'bg-slate-50 text-slate-700 border-slate-200' }
  }
}

function getRecommendedBrands(slug: string): string[] {
  switch (slug) {
    case 'giai-phap-wifi':
      return ['Cisco Catalyst', 'HPE Aruba', 'Ubiquiti UniFi']
    case 'giai-phap-mang':
      return ['Cisco Catalyst 9000', 'HPE Aruba CX', 'Ruijie Reyee']
    case 'giai-phap-bao-mat':
      return ['Fortinet FortiGate', 'Sophos XGS', 'Cisco Firepower']
    case 'giai-phap-voip':
      return ['Grandstream', 'Yeastar', 'Cisco IP Phone']
    case 'giai-phap-hoi-nghi':
      return ['Cisco Room Bar', 'Poly', 'Logitech Teams/Zoom']
    case 'giai-phap-server':
      return ['Dell PowerEdge', 'HPE ProLiant', 'VMware']
    default:
      return ['Cisco', 'HPE', 'Fortinet']
  }
}

function extractHighlights(description: string | null): string[] {
  if (!description) return []
  const matches = [...description.matchAll(/<li>(.*?)<\/li>/gi)]
  const extracted = matches
    .map((m) => m[1].replace(/<[^>]*>/g, '').trim())
    .filter(Boolean)
  if (extracted.length > 0) {
    return extracted.slice(0, 4)
  }
  return []
}

export default async function SolutionsPage() {
  // Query 100% từ Database
  const [solutions, settingsArr] = await Promise.all([
    getAllActiveSolutions().catch(() => []),
    query<SiteSetting>('SELECT key, value FROM site_settings').catch(() => []),
  ])

  const settings: Record<string, string> = Object.fromEntries(
    settingsArr.map((s) => [s.key, s.value ?? ''])
  )

  const hotline = settings.hotline || '0901 234 567'
  const contactEmail = settings.contact_email || 'contact@gts.vn'

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
          <span className="text-slate-900 font-bold">Giải pháp doanh nghiệp</span>
        </nav>

        {/* ── Enterprise Hero Banner ───────────────────────────────────────── */}
        <div className="relative bg-gradient-to-br from-[#0B1528] via-[#0F284E] to-[#004A80] text-white rounded-3xl p-8 sm:p-14 mb-14 shadow-2xl overflow-hidden border border-white/10">
          {/* Background decorative glow */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 -mb-20 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-4xl">
            <div className="inline-flex items-center gap-2.5 bg-white/10 text-cyan-300 text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full mb-6 border border-white/15 backdrop-blur-md">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Kiến Trúc Hạ Tầng CNTT & Viễn Thông Chuẩn Enterprise</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.2] mb-5 text-white">
              Giải Pháp Hạ Tầng & An Ninh Mạng Toàn Diện
            </h1>

            <p className="text-sm sm:text-base lg:text-lg text-slate-200 leading-relaxed max-w-3xl mb-8 font-normal">
              GTS thiết kế, tích hợp và triển khai hệ thống công nghệ thông tin chuyên nghiệp cho các khối ngân hàng, tòa nhà văn phòng, khu công nghiệp và doanh nghiệp đa chi nhánh. Thiết bị chính hãng 100% từ các hãng dẫn đầu: Cisco, HPE Aruba, Fortinet, Dell.
            </p>

            {/* Quick Service Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-white/15 text-xs font-semibold text-slate-200">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span>100% Thiết Bị CO/CQ</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span>Kỹ Sư CCIE / CCNP / NSE4</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span>Khảo Sát & PoC Miễn Phí</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span>Cam Kết SLA 24/7/365</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Section Title ────────────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#0077CC] mb-2">
              Danh mục kiến trúc công nghệ
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Các Giải Pháp Trọng Điểm Doanh Nghiệp
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md">
            Mỗi giải pháp được tối ưu hóa theo bài toán thực tế của khách hàng, đảm bảo tính ổn định, an toàn thông tin và sẵn sàng mở rộng trong tương lai.
          </p>
        </div>

        {/* ── Lưới Giải Pháp (Render 100% từ Database) ───────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {solutions.map((sol) => {
            const Icon = getSolutionIcon(sol.slug)
            const badge = getSolutionBadge(sol.slug)
            const brands = getRecommendedBrands(sol.slug)
            const highlights = extractHighlights(sol.description)
            const defaultHighlights = [
              'Thiết kế chuẩn kỹ thuật hãng sản xuất',
              'Độ tin cậy và khả năng dự phòng High Availability',
              'Bảo mật dữ liệu nhiều lớp chuẩn quốc tế',
              'Tối ưu hóa tổng chi phí sở hữu TCO',
            ]
            const pointsToRender = highlights.length >= 2 ? highlights : defaultHighlights

            return (
              <div
                key={sol.id}
                className="group bg-white rounded-3xl p-7 sm:p-8 border border-slate-200/90 hover:border-[#0077CC]/40 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden"
              >
                {/* Decorative Top Accent */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#0077CC] to-[#0EA5E9] opacity-0 group-hover:opacity-100 transition-opacity" />

                <div>
                  {/* Header: Icon & Category Badge */}
                  <div className="flex items-center justify-between gap-3 mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#0077CC] group-hover:bg-[#0077CC] group-hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm">
                      <Icon className="w-7 h-7" />
                    </div>
                    <span
                      className={`text-[11px] font-bold px-3 py-1 rounded-full border ${badge.color}`}
                    >
                      {badge.text}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl font-black text-slate-900 group-hover:text-[#0077CC] transition-colors mb-3 leading-snug">
                    <Link href={`/giai-phap/${sol.slug}`}>
                      {sol.name}
                    </Link>
                  </h3>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6 line-clamp-3">
                    {sol.short_description}
                  </p>

                  {/* Key Highlights */}
                  <div className="space-y-2.5 pt-5 border-t border-slate-100 mb-6">
                    <div className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                      Tính năng nổi bật
                    </div>
                    {pointsToRender.slice(0, 3).map((item, hIdx) => (
                      <div key={hIdx} className="flex items-start gap-2.5 text-xs text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span className="line-clamp-1 leading-snug font-medium">{item}</span>
                      </div>
                    ))}
                  </div>

                  {/* Recommended Brands Pill */}
                  <div className="mb-6">
                    <div className="text-[11px] font-black uppercase tracking-wider text-slate-400 mb-2">
                      Hãng thiết bị tiêu biểu
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {brands.map((b, bIdx) => (
                        <span
                          key={bIdx}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold px-2.5 py-1 rounded-lg transition-colors"
                        >
                          {b}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Action Buttons */}
                <div className="pt-5 border-t border-slate-100 flex items-center justify-between gap-3">
                  <Link
                    href={`/giai-phap/${sol.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0077CC] hover:text-[#004A80] transition-colors"
                  >
                    <span>Khám phá kiến trúc</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <Link
                    href={`/lien-he?solution=${encodeURIComponent(sol.slug)}&type=quote`}
                    className="bg-[#0077CC] hover:bg-[#004A80] text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs hover:shadow-md"
                  >
                    Tư vấn & Báo giá
                  </Link>
                </div>
              </div>
            )
          })}
        </div>

        {/* ── Quy Trình 5 Bước Triển Khai Chuẩn Enterprise ───────────────── */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/90 shadow-sm mb-16">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0077CC] bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-100">
              Tiêu chuẩn kỹ thuật GTS
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-3 mb-3">
              Quy Trình Triển Khai Giải Pháp 5 Bước
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Đảm bảo tính chính xác từ giai đoạn thiết kế topo đến nghiệm thu thực tế và chuyển giao công nghệ cho đội ngũ IT của khách hàng.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative">
            {[
              {
                step: '01',
                title: 'Khảo Sát Hiện Trạng',
                desc: 'Đo kiểm sóng RF, kiểm tra tuyến cáp, đánh giá hạ tầng mạng và lưu lượng thực tế on-site.',
              },
              {
                step: '02',
                title: 'Thiết Kế Topo & BOM',
                desc: 'Lập sơ đồ kiến trúc PoC, tối ưu danh mục thiết bị (BOM) và tính toán dự toán ngân sách.',
              },
              {
                step: '03',
                title: 'Cung Ứng Chính Hãng',
                desc: 'Nhập khẩu và cung cấp 100% thiết bị chính hãng đầy đủ chứng từ CO/CQ và license bản quyền.',
              },
              {
                step: '04',
                title: 'Lắp Đặt & Cấu Hình',
                desc: 'Đội ngũ kỹ sư triển khai đấu nối chuẩn TIA-942, phân chia VLAN, thiết lập chính sách an ninh.',
              },
              {
                step: '05',
                title: 'Nghiệm Thu & SLA 24/7',
                desc: 'Bàn giao hồ sơ hoàn công, hướng dẫn vận hành và kích hoạt dịch vụ hỗ trợ kỹ thuật định kỳ.',
              },
            ].map((p, idx) => (
              <div
                key={idx}
                className="bg-slate-50/80 rounded-2xl p-5 border border-slate-200/60 relative flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#0077CC] text-white font-black text-sm flex items-center justify-center mb-4 shadow-sm">
                    {p.step}
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 mb-2">
                    {p.title}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {p.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Đối Tác Công Nghệ Hàng Đầu (Technology Ecosystem) ─────────── */}
        <div className="bg-gradient-to-r from-slate-900 via-[#0B1528] to-slate-900 text-white rounded-3xl p-8 sm:p-12 mb-16 shadow-xl">
          <div className="max-w-3xl mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              Đối tác công nghệ
            </span>
            <h3 className="text-xl sm:text-2xl font-bold mt-2 mb-2">
              Hệ Sinh Thái Thiết Bị & Bản Quyền Quốc Tế
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm">
              GTS là đối tác phân phối và tích hợp giải pháp của các tập đoàn công nghệ dẫn đầu thế giới.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-center">
            {[
              { name: 'Cisco Systems', label: 'Enterprise Networking' },
              { name: 'HPE Aruba', label: 'WiFi 6/7 & Switching' },
              { name: 'Fortinet', label: 'Firewall & Security' },
              { name: 'Dell Technologies', label: 'Server & Storage' },
              { name: 'Grandstream', label: 'VoIP & IP Telephony' },
              { name: 'Sophos', label: 'Cybersecurity XGS' },
            ].map((brand, bIdx) => (
              <div
                key={bIdx}
                className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center hover:bg-white/10 transition-colors"
              >
                <span className="font-black text-sm text-white mb-1">{brand.name}</span>
                <span className="text-[10px] text-cyan-300 font-medium">{brand.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── High-Converting CTA Box ─────────────────────────────────────── */}
        <div className="bg-gradient-to-r from-[#0077CC] via-[#005599] to-[#0F172A] text-white rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-2xl">
              <span className="inline-block bg-white/20 text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3 backdrop-blur-sm">
                Tư vấn chuyên sâu 1-on-1
              </span>
              <h3 className="text-2xl sm:text-3xl font-black mb-3 leading-tight">
                Cần Khảo Sát & Thiết Kế Giải Pháp Mạng Cho Dự Án Của Bạn?
              </h3>
              <p className="text-blue-100 text-xs sm:text-sm leading-relaxed">
                Đội ngũ kỹ sư trưởng của GTS sẵn sàng hỗ trợ khảo sát trực tiếp tại công trình, vẽ sơ đồ topo PoC và lập dự toán ngân sách tối ưu nhất cho quý doanh nghiệp.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 flex-shrink-0">
              <Link
                href="/lien-he?type=consultation"
                className="bg-white hover:bg-slate-100 text-[#0077CC] px-6 py-4 rounded-2xl font-bold text-xs uppercase tracking-wider text-center transition-all shadow-lg hover:shadow-xl"
              >
                Yêu cầu khảo sát PoC
              </Link>
              <a
                href={`tel:${hotline.replace(/\s/g, '')}`}
                className="bg-[#0F172A]/80 hover:bg-[#0F172A] border border-white/20 text-white px-6 py-4 rounded-2xl font-bold text-xs text-center transition-all flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4 text-amber-400" />
                <span>Hotline: {hotline}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
