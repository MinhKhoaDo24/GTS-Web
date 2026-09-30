import type { Metadata } from 'next'
import Link from 'next/link'
import { query } from '@/lib/db'
import type { Service, SiteSetting } from '@/types/database'
import {
  Wrench,
  Settings,
  Lightbulb,
  Package,
  ShieldCheck,
  Headphones,
  CheckCircle2,
  ArrowRight,
  ChevronRight,
  Home,
  PhoneCall,
  Clock,
  Layers,
  FileCheck2
} from 'lucide-react'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Dịch Vụ Kỹ Thuật & Triển Khai Hạ Tầng Mạng Enterprise | GTS',
  description:
    'Dịch vụ kỹ thuật chuyên nghiệp tại GTS: Tư vấn thiết kế giải pháp mạng, triển khai cài đặt chuẩn hãng, bảo trì 24/7 SLA 4h và cung cấp linh kiện spare part chính hãng.',
}

/** Fallback danh sách 4 dịch vụ kỹ thuật khi CSDL chưa có dữ liệu */
const defaultServices = [
  {
    id: 'srv-1',
    name: 'Tư Vấn & Thiết Kế Giải Pháp Mạng',
    slug: 'dich-vu-tu-van',
    short_description: 'Khảo sát hiện trạng, đo kiểm sóng WiFi và thiết kế mô hình mạng Core/Distribution tối ưu chi phí đầu tư TCO.',
    icon: Lightbulb,
    features: ['Khảo sát thực tế tại chân công trình', 'Thiết kế sơ đồ kết nối mạng L2/L3', 'Lập dự toán BOM và hồ sơ kỹ thuật', 'Tư vấn lựa chọn thiết bị tương thích 100%'],
  },
  {
    id: 'srv-2',
    name: 'Triển Khai & Cấu Hình Phần Cứng',
    slug: 'dich-vu-trien-khai',
    short_description: 'Lắp đặt vật lý lên tủ rack, đấu nối cáp, cấu hình tính năng nâng cao (VLAN, OSPF, BGP, High Availability, NGFW Policies).',
    icon: Settings,
    features: ['Lắp đặt chuẩn kỹ thuật Data Center / Rack', 'Cấu hình dự phòng đường truyền Active-Standby / Active-Active', 'Kiểm thử tải & đo thông lượng cáp quang/đồng', 'Bàn giao tài liệu cấu hình & nghiệm thu'],
  },
  {
    id: 'srv-3',
    name: 'Bảo Trì Định Kỳ & Hỗ Trợ Kỹ Thuật 24/7',
    slug: 'dich-vu-bao-tri',
    short_description: 'Cam kết SLA phản hồi nhanh trong vòng 2h - 4h, vệ sinh thiết bị định kỳ, backup cấu hình và nâng cấp firmware bản vá an ninh.',
    icon: Wrench,
    features: ['Hotline kỹ thuật khẩn cấp 24/7/365', 'Cam kết SLA có mặt xử lý tại chỗ trong 4 giờ', 'Định kỳ sao lưu cấu hình & bảo dưỡng thiết bị', 'Cập nhật bản vá firmware phòng chống Zero-day'],
  },
  {
    id: 'srv-4',
    name: 'Cung Cấp Linh Kiện & Spare Part Cứu Hộ',
    slug: 'dich-vu-spare-part',
    short_description: 'Kho linh kiện thay thế chính hãng luôn sẵn sàng tại Hà Nội và TP.HCM, hỗ trợ mượn thiết bị tạm thời khi xảy ra hỏng hóc.',
    icon: Package,
    features: ['Nguồn phụ, quạt tản nhiệt, module quang SFP/SFP+', 'Card mở rộng, bộ nhớ RAM máy chủ', 'Hỗ trợ cho mượn thiết bị tương đương thay thế', 'Giao hàng hỏa tốc trong 2h tại nội thành'],
  },
]

export default async function ServicesPage() {
  const [dbServices, settingsArr] = await Promise.all([
    query<Service>(
      'SELECT id, name, slug, short_description, description, thumbnail, banner, icon FROM services WHERE is_active = true ORDER BY sort_order ASC'
    ).catch(() => []),
    query<SiteSetting>('SELECT key, value FROM site_settings').catch(() => []),
  ])

  const settings: Record<string, string> = Object.fromEntries(
    settingsArr.map((s) => [s.key, s.value ?? ''])
  )

  const hotline = settings.hotline || '0901 234 567'

  // Sử dụng dữ liệu CSDL nếu có, nếu chưa thì dùng defaultServices
  const servicesToRender = dbServices.length > 0 ? dbServices : defaultServices

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
          <span className="text-slate-900 font-bold">Dịch vụ kỹ thuật Enterprise</span>
        </nav>

        {/* ── Header Banner ───────────────────────────────────────────────── */}
        <div className="bg-gradient-to-r from-[#0F172A] via-[#1D4ED8] to-[#1e40af] text-white rounded-3xl p-8 sm:p-14 mb-12 shadow-xl relative overflow-hidden">
          <div className="max-w-3xl relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/15 text-blue-100 text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full mb-4 border border-white/20 backdrop-blur-sm">
              <Wrench className="w-4 h-4 text-amber-400" />
              <span>Dịch vụ hỗ trợ kỹ thuật trọn vòng đời</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight mb-4">
              Dịch Vụ Kỹ Thuật Chuyên Nghiệp Cho Hạ Tầng Mạng
            </h1>
            <p className="text-sm sm:text-base text-blue-100 leading-relaxed max-w-2xl">
              GTS đồng hành cùng quý doanh nghiệp từ khâu khảo sát, lập thiết kế giải pháp mạng đến cấu hình triển khai, bảo trì SLA 24/7 và ứng cứu sự cố phần cứng.
            </p>
          </div>
        </div>

        {/* ── Lưới Dịch Vụ Kỹ Thuật (Render động từ CSDL kèm fallback) ───────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-14">
          {servicesToRender.map((srv, idx) => {
            const Icon = (defaultServices[idx]?.icon) || Settings
            const features = (defaultServices[idx]?.features) || [
              'Tư vấn kỹ thuật chuyên sâu bởi kỹ sư CCNP / NSE4',
              'Cam kết đúng tiến độ và tiêu chuẩn nhà sản xuất',
              'Bàn giao hồ sơ tài liệu cấu hình đầy đủ',
              'Hỗ trợ kỹ thuật 24/7 sau khi bàn giao',
            ]

            return (
              <div
                key={srv.id}
                className="bg-white rounded-3xl p-8 border border-slate-200/80 hover:border-blue-300 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#1D4ED8] flex items-center justify-center mb-6">
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-3">
                    {srv.name}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-6">
                    {srv.short_description}
                  </p>

                  <div className="space-y-2.5 pt-4 border-t border-slate-100 mb-8">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Nội dung hạng mục bao gồm:
                    </div>
                    {features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    href={`/dich-vu/${srv.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1D4ED8] hover:underline"
                  >
                    <span>Xem chi tiết dịch vụ</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <Link
                    href={`/lien-he?service=${encodeURIComponent(srv.slug)}&type=consultation`}
                    className="bg-[#1D4ED8] hover:bg-[#1E40AF] text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors shadow-xs"
                  >
                    Yêu cầu tư vấn
                  </Link>
                </div>
              </div>
            )
          })}
        </div>

        {/* ── Cam Kết SLA & Quy Trình Làm Việc ──────────────────────────────── */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-xs mb-14">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-[#1D4ED8] block mb-2">
              Cam kết dịch vụ SLA
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Tiêu Chuẩn Dịch Vụ Cấp Độ Doanh Nghiệp (SLA)
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/60 text-center">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-3">
                <Clock className="w-6 h-6" />
              </div>
              <div className="text-2xl font-black text-slate-900 mb-1">Dưới 30 phút</div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Thời gian phản hồi
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Đội ngũ kỹ sư trực hotline 24/7 tiếp nhận và phân tích sự cố ngay lập tức qua Remote hoặc điện thoại.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/60 text-center">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#1D4ED8] flex items-center justify-center mx-auto mb-3">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="text-2xl font-black text-slate-900 mb-1">4 Giờ On-site</div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Xử lý tại hiện trường
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Kỹ sư có mặt tại chân công trình (Hà Nội & TP.HCM) kèm thiết bị dự phòng thay thế khẩn cấp.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/60 text-center">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                <Headphones className="w-6 h-6" />
              </div>
              <div className="text-2xl font-black text-slate-900 mb-1">99.9% Uptime</div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Độ tin cậy hạ tầng
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Thiết kế kiến trúc dự phòng N+1 / HA, đảm bảo hệ thống không gián đoạn trong mọi tình huống.
              </p>
            </div>
          </div>
        </div>

        {/* ── Contact CTA ──────────────────────────────────────────────────── */}
        <div className="bg-gradient-to-r from-[#0F172A] to-[#1E293B] text-white rounded-3xl p-8 sm:p-10 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold mb-2">
                Hệ thống mạng của bạn cần bảo dưỡng hoặc nâng cấp?
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm">
                Liên hệ ngay hotline hỗ trợ kỹ thuật để được khảo sát và tư vấn trực tiếp.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href={`tel:${hotline.replace(/\s/g, '')}`}
                className="bg-[#F59E0B] hover:bg-[#d97706] text-white px-6 py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-2"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Hotline: {hotline}</span>
              </a>
              <Link
                href="/lien-he?type=consultation"
                className="bg-[#1D4ED8] hover:bg-[#1E40AF] text-white px-6 py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider transition-colors"
              >
                Đặt lịch khảo sát
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
