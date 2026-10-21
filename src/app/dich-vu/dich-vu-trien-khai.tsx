import type { Metadata } from 'next'
import Link from 'next/link'
import { RichTextRenderer } from '@/components/RichTextRenderer'
import {
  Settings,
  CheckCircle2,
  ChevronRight,
  Home,
  PhoneCall,
  Send,
  ShieldCheck,
  Award,
  Layers,
  Check,
  FileText,
  Clock,
  Server,
  Wrench,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Triển Khai & Cài Đặt Hạ Tầng Mạng Chuẩn Hãng | GTS Enterprise',
  description:
    'Dịch vụ lắp đặt vật lý tủ rack, đấu nối cáp mạng, cấu hình tính năng nâng cao (VLAN, Routing OSPF/BGP, High Availability, NGFW Firewall) đảm bảo đúng tiêu chuẩn nhà sản xuất.',
}

export interface ServiceDetailProps {
  customContent?: string | null
  hotline?: string
}

export default function DichVuTrienKhai({ customContent, hotline = '0901 234 567' }: ServiceDetailProps) {
  const steps = [
    {
      num: '01',
      title: 'Kiểm tra tiếp nhận & Đối soát CO/CQ',
      desc: 'Kiểm tra tính nguyên vẹn bao bì niêm phong của thiết bị từ hãng (Cisco, Fortinet, HPE), đối chiếu mã số Part Number, Serial Number và chứng chỉ xuất xứ chất lượng.',
    },
    {
      num: '02',
      title: 'Thi công lắp đặt vật lý & Gắn tủ Rack',
      desc: 'Lắp đặt khay đỡ ray trượt, gắn switch/router/firewall vào tủ rack đúng tiêu chuẩn làm mát luồng khí (Front-to-Back), bấm đầu mạng RJ45, đấu nối module quang và dán nhãn nhận diện chuyên nghiệp.',
    },
    {
      num: '03',
      title: 'Cập nhật Firmware & Cấu hình tính năng',
      desc: 'Nâng cấp hệ điều hành lên phiên bản Gold Star ổn định nhất, cấu hình phân chia VLAN, định tuyến OSPF/BGP, liên kết kênh truyền LACP, chính sách bảo mật Firewall và cụm dự phòng HA.',
    },
    {
      num: '04',
      title: 'Đo kiểm chịu tải (UAT) & Bàn giao hồ sơ',
      desc: 'Chạy stress test kiểm tra thông lượng chịu tải thực tế, đo suy hao quang bằng máy OTDR, sao lưu cấu hình (Backup config) và bàn giao sơ đồ thực tế (As-built Drawing).',
    },
  ]

  const commitments = [
    'Thi công ngoài giờ hành chính hoặc cuối tuần để không gián đoạn hoạt động kinh doanh',
    'Kỹ sư có chứng chỉ chuyên môn trực tiếp thi công và giám sát',
    'Bàn giao đầy đủ file backup cấu hình và sơ đồ thực tế (As-built Drawing)',
    'Bảo hành kỹ thuật triển khai 12 tháng kể từ ngày ký biên bản nghiệm thu',
    'Hỗ trợ kỹ thuật ứng cứu sự cố 24/7 trong 3 tháng đầu vận hành hệ thống mới',
    'Hướng dẫn chuyển giao công nghệ và đào tạo vận hành cho đội ngũ IT nội bộ',
  ]

  const technicalScopes = [
    {
      title: 'Thi công lắp đặt phần cứng & Tủ Data Center',
      items: [
        'Lắp đặt Switch Core, Aggregation, Access và Server vào tủ Rack 42U/48U',
        'Đấu nối hệ thống nguồn điện dự phòng kép UPS PDU chuẩn công nghiệp',
        'Đi dây máng cáp gọn gàng, đánh nhãn cáp mạng theo tiêu chuẩn ANSI/TIA-606-B',
      ],
    },
    {
      title: 'Cấu hình chuyển mạch & Định tuyến nâng cao',
      items: [
        'Cấu hình Link Aggregation / Port Channel (LACP) tăng băng thông kết nối',
        'Thiết lập Spanning Tree Protocol (MSTP / RPVST+) chống vòng lặp mạng',
        'Cấu hình Virtual Router Redundancy Protocol (HSRP / VRRP) dự phòng gateway',
      ],
    },
    {
      title: 'Triển khai Tường lửa & Kiểm soát an ninh mạng',
      items: [
        'Cấu hình cụm dự phòng chủ động Active-Standby / Active-Active không gián đoạn',
        'Thiết lập chính sách lọc địa chỉ IP, kiểm soát ứng dụng và chống mã độc',
        'Cấu hình kết nối VPN IPSec Site-to-Site giữa trụ sở và các chi nhánh',
      ],
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
          <span className="text-slate-900 font-bold truncate max-w-md">Triển Khai & Cài Đặt Hạ Tầng Mạng</span>
        </nav>

        {/* ── Header Banner ───────────────────────────────────────────────── */}
        <div className="bg-gradient-to-r from-[#0F172A] via-[#0077CC] to-[#004A80] text-white rounded-3xl p-8 sm:p-12 mb-12 shadow-xl relative overflow-hidden">
          <div className="max-w-3xl relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/15 text-blue-100 text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full mb-3 border border-white/20 backdrop-blur-sm">
              <Settings className="w-4 h-4 text-amber-400" />
              <span>Dịch vụ kỹ thuật chuyên sâu</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight mb-3">
              Triển Khai & Cài Đặt Hạ Tầng Mạng Chuẩn Hãng
            </h1>
            <p className="text-sm sm:text-base text-blue-100 leading-relaxed max-w-2xl">
              Lắp đặt vật lý tủ rack, đấu nối cáp quang/đồng, cấu hình tính năng nâng cao (VLAN, Routing, HA, Firewall Policies) theo quy chuẩn nghiêm ngặt của nhà sản xuất.
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
                    Dịch vụ triển khai của GTS đảm bảo hệ thống phần cứng mạng và máy chủ của quý doanh nghiệp được lắp đặt và cấu hình theo đúng quy chuẩn nghiêm ngặt nhất của nhà sản xuất. Chúng tôi thực hiện toàn bộ các công đoạn: gắn tủ rack, đánh nhãn cáp mạng chuyên nghiệp, đấu nối nguồn điện dự phòng UPS, cập nhật firmware mới nhất, cấu hình phân chia mạng ảo VLAN, định tuyến động OSPF/BGP, thiết lập cụm dự phòng High Availability (Active-Standby) và kiểm thử thông lượng chịu tải trước khi bàn giao.
                  </p>
                </div>

                {/* Hạng mục kỹ thuật chuyên sâu */}
                <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-xs space-y-6">
                  <div className="flex items-center gap-2.5 text-[#0077CC]">
                    <Server className="w-5 h-5" />
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                      Nội Dung Triển Khai Kỹ Thuật Chi Tiết
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    {technicalScopes.map((scope, idx) => (
                      <div key={idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
                        <h3 className="font-bold text-slate-900 text-sm sm:text-base mb-3 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#0077CC]"></span>
                          {scope.title}
                        </h3>
                        <ul className="space-y-2">
                          {scope.items.map((item, itemIdx) => (
                            <li key={itemIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-600">
                              <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Các bước quy trình */}
                <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-xs space-y-5">
                  <div className="flex items-center gap-2.5 text-[#0077CC]">
                    <Clock className="w-5 h-5" />
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                      Quy Trình Triển Khai Tiêu Chuẩn 4 Bước
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
                      Cam Kết Chất Lượng Của GTS
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
                <span>Yêu cầu triển khai hạ tầng</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Đội ngũ kỹ sư triển khai của GTS sẵn sàng hỗ trợ khảo sát và lên lịch thi công phù hợp nhất với kế hoạch của doanh nghiệp.
              </p>

              <Link
                href="/lien-he?service=dich-vu-trien-khai&type=deployment"
                className="w-full bg-[#0077CC] hover:bg-[#004A80] text-white py-3.5 px-4 rounded-2xl font-bold text-xs uppercase tracking-wider text-center block transition-colors shadow-md"
              >
                Gửi yêu cầu triển khai ngay
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
                      item.slug === 'dich-vu-trien-khai'
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

            {/* Box Cam kết an toàn */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-900">
                <Award className="w-4 h-4 text-emerald-500" />
                <span>Tiêu chuẩn thi công</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Toàn bộ quy trình thi công tuân thủ nghiêm ngặt tiêu chuẩn phòng cháy chữa cháy, an toàn điện và tiêu chuẩn quốc tế về trung tâm dữ liệu TIA-942.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
