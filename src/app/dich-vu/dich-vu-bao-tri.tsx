import type { Metadata } from 'next'
import Link from 'next/link'
import { RichTextRenderer } from '@/components/RichTextRenderer'
import {
  Wrench,
  CheckCircle2,
  ChevronRight,
  Home,
  PhoneCall,
  Send,
  ShieldCheck,
  Award,
  Layers,
  Check,
  Clock,
  AlertTriangle,
  Zap,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Bảo Trì Định Kỳ & Hỗ Trợ Kỹ Thuật 24/7 (SLA) | GTS Enterprise',
  description:
    'Dịch vụ bảo trì hệ thống mạng doanh nghiệp định kỳ, cam kết SLA phản hồi dưới 30 phút, ứng cứu sự cố tại chỗ 2h - 4h, vệ sinh thiết bị, cập nhật bản vá an ninh và sao lưu dữ liệu cấu hình.',
}

export interface ServiceDetailProps {
  customContent?: string | null
  hotline?: string
}

export default function DichVuBaoTri({ customContent, hotline = '0901 234 567' }: ServiceDetailProps) {
  const steps = [
    {
      num: '01',
      title: 'Khảo sát hiện trạng & Lập hồ sơ tài sản (CMDB)',
      desc: 'Rà soát danh mục toàn bộ thiết bị đang hoạt động, ghi nhận số Serial, phiên bản Firmware, tình trạng bảo hành của hãng và mức độ tải hiện tại.',
    },
    {
      num: '02',
      title: 'Bảo dưỡng vật lý & Vệ sinh công nghiệp định kỳ',
      desc: 'Định kỳ hàng tháng/hàng quý tiến hành hút bụi, vệ sinh quạt tản nhiệt, kiểm tra độ suy hao nguồn điện, dây nhảy mạng và nhiệt độ buồng tủ Rack.',
    },
    {
      num: '03',
      title: 'Kiểm tra phần mềm, sao lưu cấu hình & Vá lỗi bảo mật',
      desc: 'Phân tích file Syslog ghi nhận cảnh báo sớm, kiểm tra dung lượng RAM/CPU, sao lưu cấu hình dự phòng lên Cloud và cập nhật các bản vá lỗi Zero-day.',
    },
    {
      num: '04',
      title: 'Trực kỹ thuật 24/7/365 & Ứng cứu sự cố theo SLA',
      desc: 'Hotline ưu tiên tiếp nhận sự cố, xử lý từ xa qua Remote trong vòng 30 phút và cử kỹ sư có mặt tại hiện trường trong 2h-4h để khắc phục sự cố triệt để.',
    },
  ]

  const commitments = [
    'Cam kết thời gian phản hồi sự cố dưới 30 phút qua hotline chuyên biệt',
    'Cam kết có mặt xử lý tại chân công trình trong 2-4 giờ (Hà Nội & TP.HCM)',
    'Cho mượn thiết bị tương đương thay thế tạm thời trong lúc chờ bảo hành',
    'Báo cáo tình trạng hệ thống và khuyến nghị nâng cấp định kỳ theo quý',
    'Đội ngũ kỹ sư trực ca 24/7/365 kể cả ngày nghỉ lễ Tết',
    'Cam kết bảo mật tuyệt đối dữ liệu và cấu hình mạng của khách hàng',
  ]

  const slaTiers = [
    {
      level: 'Gói Tiêu Chuẩn (8x5xNBD)',
      time: 'Hỗ trợ giờ hành chính',
      response: 'Phản hồi trong 2 giờ',
      onsite: 'Có mặt ngày làm việc tiếp theo (Next Business Day)',
      suitable: 'Phù hợp cho các doanh nghiệp vừa và nhỏ, văn phòng hành chính thông thường.',
    },
    {
      level: 'Gói Nâng Cao (24x7x4H)',
      time: 'Hỗ trợ liên tục 24/7/365',
      response: 'Phản hồi dưới 30 phút',
      onsite: 'Có mặt tại chỗ trong vòng 4 giờ',
      suitable: 'Phù hợp cho các chuỗi bán lẻ, khách sạn, nhà máy sản xuất vận hành liên tục.',
      isPopular: true,
    },
    {
      level: 'Gói Cao Cấp Mission Critical (24x7x2H)',
      time: 'Hỗ trợ khẩn cấp 24/7/365',
      response: 'Phản hồi tức thì dưới 15 phút',
      onsite: 'Có mặt tại chỗ trong vòng 2 giờ kèm thiết bị thay thế sẵn',
      suitable: 'Phù hợp cho Ngân hàng, Tài chính, Bệnh viện và Trung tâm dữ liệu trọng yếu.',
    },
  ]

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
          <span className="text-slate-900 font-bold truncate max-w-md">Bảo Trì Định Kỳ & Hỗ Trợ Kỹ Thuật 24/7</span>
        </nav>

        {/* ── Header Banner ───────────────────────────────────────────────── */}
        <div className="bg-gradient-to-r from-[#0F172A] via-[#0077CC] to-[#004A80] text-white rounded-3xl p-8 sm:p-12 mb-12 shadow-xl relative overflow-hidden">
          <div className="max-w-3xl relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/15 text-blue-100 text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full mb-3 border border-white/20 backdrop-blur-sm">
              <Wrench className="w-4 h-4 text-amber-400" />
              <span>Dịch vụ kỹ thuật chuyên sâu</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight mb-3">
              Bảo Trì Định Kỳ & Hỗ Trợ Kỹ Thuật 24/7 (SLA)
            </h1>
            <p className="text-sm sm:text-base text-blue-100 leading-relaxed max-w-2xl">
              Cam kết SLA phản hồi nhanh dưới 30 phút, vệ sinh thiết bị định kỳ, sao lưu cấu hình tự động và nâng cấp các bản vá an ninh khẩn cấp Zero-day.
            </p>
          </div>
        </div>

        {/* ── Main Layout: Content + Sidebar CTA ──────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-14">
          {/* CỘT NỘI DUNG CHÍNH (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            {customContent ? (
              <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-xs">
                <RichTextRenderer content={customContent} />
              </div>
            ) : (
              <div className="space-y-8">
                {/* Tổng quan */}
                <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-xs space-y-4">
                  <div className="flex items-center gap-2.5 text-[#0077CC]">
                    <Layers className="w-5 h-5" />
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                      Tổng Quan Về Dịch Vụ
                    </h2>
                  </div>
                  <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
                    Hạ tầng mạng ổn định là mạch máu của mọi doanh nghiệp số. Gói dịch vụ bảo trì định kỳ của GTS mang đến sự an tâm tuyệt đối với đội ngũ kỹ sư túc trực 24/7/365. Chúng tôi tiến hành kiểm tra sức khỏe hệ thống định kỳ hàng tháng/hàng quý: kiểm tra nhiệt độ, quạt tản nhiệt, tình trạng nguồn phụ, kiểm tra log lỗi, rà soát lỗ hổng bảo mật và cập nhật bản vá khẩn cấp. Khi có sự cố, GTS cam kết có mặt tại hiện trường trong vòng 2h - 4h để xử lý triệt để.
                  </p>
                </div>

                {/* Các cấp độ dịch vụ SLA */}
                <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-xs space-y-6">
                  <div className="flex items-center gap-2.5 text-[#0077CC]">
                    <Clock className="w-5 h-5" />
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                      Các Cấp Độ Cam Kết Dịch Vụ (SLA Packages)
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    {slaTiers.map((tier, idx) => (
                      <div
                        key={idx}
                        className={`p-6 rounded-2xl border transition-all ${
                          tier.isPopular
                            ? 'bg-blue-50/40 border-blue-200 shadow-xs'
                            : 'bg-slate-50 border-slate-100'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-black text-slate-900 text-base sm:text-lg">
                            {tier.level}
                          </h3>
                          {tier.isPopular && (
                            <span className="bg-[#0077CC] text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                              Phổ biến nhất
                            </span>
                          )}
                        </div>
                        <p className="text-xs sm:text-sm text-slate-600 mb-4">{tier.suitable}</p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-3 border-t border-slate-200/60 text-xs">
                          <div>
                            <span className="text-slate-400 block font-medium">Khung thời gian:</span>
                            <span className="text-slate-800 font-bold">{tier.time}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block font-medium">Phản hồi từ xa:</span>
                            <span className="text-slate-800 font-bold">{tier.response}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block font-medium">Có mặt tại chỗ:</span>
                            <span className="text-[#0077CC] font-bold">{tier.onsite}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Các bước quy trình */}
                <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-xs space-y-5">
                  <div className="flex items-center gap-2.5 text-[#0077CC]">
                    <Zap className="w-5 h-5" />
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                      Quy Trình Bảo Trì & Ứng Cứu Định Kỳ
                    </h2>
                  </div>
                  <div className="space-y-4">
                    {steps.map((st) => (
                      <div key={st.num} className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                        <div className="w-10 h-10 rounded-xl bg-[#0077CC] text-white flex items-center justify-center font-black text-sm flex-shrink-0">
                          {st.num}
                        </div>
                        <div>
                          <h3 className="text-sm sm:text-base text-slate-900 font-bold mb-1">
                            {st.title}
                          </h3>
                          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                            {st.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cam kết chất lượng */}
                <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-xs space-y-4">
                  <div className="flex items-center gap-2.5 text-emerald-600">
                    <ShieldCheck className="w-5 h-5" />
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                      Cam Kết Của GTS Đối Với Khách Hàng
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {commitments.map((cmt, cIdx) => (
                      <div key={cIdx} className="flex items-start gap-2.5 p-3 rounded-2xl bg-emerald-50/50 border border-emerald-100 text-xs sm:text-sm text-slate-800 font-medium">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span>{cmt}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CỘT SIDEBAR LIÊN HỆ & BÁO GIÁ (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Box Đặt Lịch Tư Vấn */}
            <div className="bg-white rounded-3xl p-7 border border-slate-200/80 shadow-xs space-y-5">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#0077CC] pb-2 border-b border-slate-100">
                <Send className="w-4 h-4" />
                <span>Yêu cầu gói bảo trì</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Để lại danh mục thiết bị cần bảo trì, kỹ sư của GTS sẽ gửi bản chào giá dịch vụ SLA tối ưu chi phí trong vòng 24 giờ.
              </p>

              <Link
                href="/lien-he?service=dich-vu-bao-tri&type=maintenance"
                className="w-full bg-[#0077CC] hover:bg-[#004A80] text-white py-3.5 px-4 rounded-2xl font-bold text-xs uppercase tracking-wider text-center block transition-colors shadow-md"
              >
                Nhận báo giá gói bảo trì
              </Link>

              <a
                href={`tel:${hotline.replace(/\s/g, '')}`}
                className="w-full bg-[#0F172A] hover:bg-slate-800 text-white py-3.5 px-4 rounded-2xl font-bold text-xs text-center block transition-colors flex items-center justify-center gap-2"
              >
                <PhoneCall className="w-4 h-4 text-amber-400" />
                <span>Hotline trực 24/7: {hotline}</span>
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
                      item.slug === 'dich-vu-bao-tri'
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

            {/* Box Thiết bị thay thế */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-900">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span>Thiết bị dự phòng mượn miễn phí</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Khách hàng ký hợp đồng bảo trì với GTS được quyền mượn thiết bị tương đương (Cisco, Fortinet) hoàn toàn miễn phí khi xảy ra hỏng hóc chờ gửi bảo hành hãng.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
