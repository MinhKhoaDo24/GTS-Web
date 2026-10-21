import type { Metadata } from 'next'
import Link from 'next/link'
import { RichTextRenderer } from '@/components/RichTextRenderer'
import {
  Lightbulb,
  CheckCircle2,
  ChevronRight,
  Home,
  PhoneCall,
  Send,
  ShieldCheck,
  Award,
  Layers,
  ArrowRight,
  Check,
  FileText,
  Clock,
  HelpCircle,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Tư Vấn & Thiết Kế Giải Pháp Mạng Doanh Nghiệp | GTS Enterprise',
  description:
    'Dịch vụ tư vấn, khảo sát thực địa hiện trạng, đo kiểm sóng WiFi và lập hồ sơ thiết kế mô hình mạng Core/Distribution tối ưu chi phí đầu tư TCO cho doanh nghiệp.',
}

export interface ServiceDetailProps {
  customContent?: string | null
  hotline?: string
}

export default function DichVuTuVan({ customContent, hotline = '0901 234 567' }: ServiceDetailProps) {
  const steps = [
    {
      num: '01',
      title: 'Tiếp nhận yêu cầu & Khảo sát bài toán',
      desc: 'Lắng nghe nhu cầu mở rộng, phân tích các điểm nghẽn (bottleneck) hiện tại, số lượng thiết bị đầu cuối và ngân sách dự kiến của doanh nghiệp.',
    },
    {
      num: '02',
      title: 'Đo kiểm thực địa & Phân tích hiện trạng',
      desc: 'Kỹ sư trực tiếp đến công trình đo kiểm suy hao cáp quang/cáp đồng, đo vẽ bản đồ nhiệt vùng phủ sóng WiFi (Heatmap RF) và rà soát các lỗ hổng bảo mật mạng.',
    },
    {
      num: '03',
      title: 'Xây dựng kiến trúc & Lập bảng thiết bị BOM',
      desc: 'Thiết kế sơ đồ kết nối L2/L3 chuẩn hãng (Cisco, Fortinet, Aruba), tính toán thông lượng Switching/Routing, dự phòng High Availability và lập bảng cấu hình chi tiết (Bill of Materials).',
    },
    {
      num: '04',
      title: 'Thẩm định hồ sơ kỹ thuật & Tối ưu TCO',
      desc: 'Bảo vệ phương án kỹ thuật, tư vấn bài toán chi phí vòng đời thiết bị (TCO), hỗ trợ làm hồ sơ thầu và demo kiểm thử tính năng (PoC) trước khi đầu tư.',
    },
  ]

  const commitments = [
    'Thiết kế chuẩn hãng 100% (Cisco Validated Design, Fortinet Architecture)',
    'Tương thích hoàn toàn với hạ tầng sẵn có của khách hàng',
    'Cam kết không phát sinh chi phí thiết bị ngoài dự toán đã duyệt',
    'Miễn phí tư vấn và demo kiểm thử tính năng (PoC)',
    'Đội ngũ kỹ sư sở hữu chứng chỉ quốc tế CCNP, CCIE, NSE 4+, Aruba ACMP',
    'Bảo mật tuyệt đối thông tin topo hạ tầng mạng của khách hàng',
  ]

  const technicalScopes = [
    {
      title: 'Hạ tầng mạng LAN / Campus Network',
      items: ['Thiết kế mô hình 2 lớp (Collapsed Core) hoặc 3 lớp (Core - Aggregation - Access)', 'Phân chia VLAN, quản lý dải IP động DHCP Snooping & ARP Inspection', 'Giao thức định tuyến OSPF, BGP, cân bằng tải đường truyền'],
    },
    {
      title: 'Hệ thống WiFi Doanh nghiệp mật độ cao',
      items: ['Quy hoạch vùng phủ sóng WiFi 6/6E chống nhiễu xuyên kênh', 'Roaming liền mạch không rớt kết nối cho môi trường văn phòng, nhà xưởng', 'Tách biệt mạng nội bộ và mạng Guest Captive Portal bảo mật'],
    },
    {
      title: 'An toàn thông tin & Tường lửa thế hệ mới (NGFW)',
      items: ['Quy hoạch phân vùng mạng DMZ, Server Farm và Internal LAN', 'Thiết lập chính sách kiểm soát ứng dụng App-Control & phòng chống xâm nhập IPS', 'Thiết kế kênh truyền bảo mật VPN Site-to-Site và Remote Access cho nhân viên'],
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
          <span className="text-slate-900 font-bold truncate max-w-md">Tư Vấn & Thiết Kế Giải Pháp Mạng</span>
        </nav>

        {/* ── Header Banner ───────────────────────────────────────────────── */}
        <div className="bg-gradient-to-r from-[#0F172A] via-[#0077CC] to-[#004A80] text-white rounded-3xl p-8 sm:p-12 mb-12 shadow-xl relative overflow-hidden">
          <div className="max-w-3xl relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/15 text-blue-100 text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full mb-3 border border-white/20 backdrop-blur-sm">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              <span>Dịch vụ kỹ thuật chuyên sâu</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight mb-3">
              Tư Vấn & Thiết Kế Giải Pháp Mạng Doanh Nghiệp
            </h1>
            <p className="text-sm sm:text-base text-blue-100 leading-relaxed max-w-2xl">
              Khảo sát hiện trạng hạ tầng, đo kiểm mô phỏng sóng RF và lập hồ sơ thiết kế mạng Core/Distribution tối ưu chi phí đầu tư TCO, đáp ứng khả năng mở rộng trong 3-5 năm tới.
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
                    GTS cung cấp dịch vụ tư vấn kỹ thuật toàn diện cho các hệ thống mạng từ văn phòng vừa và nhỏ (SMB) đến trung tâm dữ liệu và mạng đa chi nhánh của các tập đoàn lớn. Đội ngũ chuyên gia sở hữu chứng chỉ quốc tế (CCNP, CCIE, NSE 4+, Aruba ACMP) sẽ trực tiếp khảo sát thực địa, phân tích lưu lượng, dự báo nhu cầu mở rộng trong 3-5 năm tới và xây dựng hồ sơ thiết kế chi tiết bao gồm BOM thiết bị, sơ đồ topo mạng L2/L3 và chính sách bảo mật tối ưu nhất.
                  </p>
                </div>

                {/* Hạng mục kỹ thuật chuyên sâu */}
                <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-xs space-y-6">
                  <div className="flex items-center gap-2.5 text-[#0077CC]">
                    <FileText className="w-5 h-5" />
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                      Các Hạng Mục Tư Vấn & Thiết Kế Trọng Điểm
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
                      Quy Trình Khảo Sát & Thiết Kế Chuẩn Chuyên Nghiệp
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
                <span>Yêu cầu tư vấn dịch vụ</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Để lại thông tin hoặc liên hệ trực tiếp với kỹ sư phụ trách để nhận tư vấn phương án kỹ thuật và báo giá chi tiết trong vòng 24 giờ.
              </p>

              <Link
                href="/lien-he?service=dich-vu-tu-van&type=consultation"
                className="w-full bg-[#0077CC] hover:bg-[#004A80] text-white py-3.5 px-4 rounded-2xl font-bold text-xs uppercase tracking-wider text-center block transition-colors shadow-md"
              >
                Gửi yêu cầu khảo sát & tư vấn
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
                      item.slug === 'dich-vu-tu-van'
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

            {/* Box Chứng chỉ năng lực */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-900">
                <Award className="w-4 h-4 text-amber-500" />
                <span>Năng lực chuyên gia</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Đội ngũ kỹ sư GTS đạt chứng chỉ chuẩn quốc tế từ các hãng công nghệ hàng đầu thế giới: Cisco CCNP/CCIE, Fortinet NSE, HPE Aruba Certified.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
