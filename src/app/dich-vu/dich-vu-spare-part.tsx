import type { Metadata } from 'next'
import Link from 'next/link'
import { RichTextRenderer } from '@/components/RichTextRenderer'
import {
  Package,
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
  Truck,
  Cpu,
  RefreshCw,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Cung Cấp Linh Kiện Thay Thế & Spare Part Cứu Hộ | GTS Enterprise',
  description:
    'Kho linh kiện thay thế chính hãng Cisco, Fortinet, HPE, Dell sẵn sàng tại Hà Nội và TP.HCM: Nguồn phụ, Fan module, SFP/SFP+, RAM máy chủ, Card mở rộng. Giao hàng hỏa tốc 2 giờ.',
}

export interface ServiceDetailProps {
  customContent?: string | null
  hotline?: string
}

export default function DichVuSparePart({ customContent, hotline = '0901 234 567' }: ServiceDetailProps) {
  const steps = [
    {
      num: '01',
      title: 'Tiếp nhận Part Number & Mã sự cố thiết bị',
      desc: 'Quý khách gửi mã linh kiện (Part Number) hoặc hình ảnh/file log lỗi của thiết bị bị hỏng (cháy nguồn, hỏng quạt tản nhiệt, lỗi RAM/ổ cứng).',
    },
    {
      num: '02',
      title: 'Kiểm tra tồn kho & Tương thích 100%',
      desc: 'Hệ thống kho GTS tại Hà Nội & TP.HCM kiểm tra tức thì linh kiện chính hãng sẵn có, đảm bảo đúng chuẩn mã tương thích với dòng máy chủ/switch của quý khách.',
    },
    {
      num: '03',
      title: 'Giao hàng hỏa tốc trong 2 giờ hoặc kỹ sư thay thế tận nơi',
      desc: 'Linh kiện được đóng gói chuyên dụng chống tĩnh điện và vận chuyển hỏa tốc. Nếu có yêu cầu, kỹ sư GTS sẽ đến trực tiếp thay thế và kiểm thử tại tủ Rack.',
    },
    {
      num: '04',
      title: 'Kiểm tra vận hành & Kích hoạt bảo hành 1 đổi 1',
      desc: 'Đo kiểm độ ổn định sau khi thay mới, kích hoạt gói bảo hành từ 12 đến 36 tháng cho linh kiện, hỗ trợ thu hồi linh kiện cũ nếu quý khách có nhu cầu.',
    },
  ]

  const commitments = [
    '100% linh kiện chính hãng mới hoặc pull-server đã qua kiểm thử tải nghiêm ngặt',
    'Bảo hành 1 đổi 1 trong thời gian từ 12 đến 36 tháng',
    'Có sẵn nguồn dự phòng, quạt, module quang SFP+ 10G/25G/40G/100G',
    'Giao hàng hỏa tốc 2 giờ nội thành Hà Nội & TP. Hồ Chí Minh',
    'Hỗ trợ cho mượn thiết bị tương đương thay thế tạm thời trong lúc bảo hành',
    'Hỗ trợ kỹ thuật lắp đặt và kiểm tra tương thích từ xa hoặc tận nơi',
  ]

  const categories = [
    {
      name: 'Bộ nguồn dự phòng (Power Supply)',
      desc: 'Nguồn nóng (Hot-swap Redundant PSU) cho Switch Cisco Catalyst 2960X, 3850, 9200, 9300, Firewall FortiGate và Server Dell PowerEdge, HPE ProLiant.',
      specs: ['Công suất: 250W, 350W, 715W, 1100W AC/DC', 'Chuẩn hiệu suất Platinum / Titanium 80 Plus'],
    },
    {
      name: 'Module quạt tản nhiệt (Fan Module)',
      desc: 'Quạt thay thế chính hãng cho thiết bị mạng và máy chủ, kiểm soát luồng gió Front-to-Back hoặc Back-to-Front hạn chế quá nhiệt hệ thống.',
      specs: ['Tương thích Cisco 9300 Series, FortiGate 100F/200F', 'Cảm biến tốc độ quạt tự động theo nhiệt độ'],
    },
    {
      name: 'Module quang thu phát (Transceiver SFP/SFP+)',
      desc: 'Module quang 1G, 10G, 25G, 40G, 100G tương thích hoàn hảo chuẩn MSA, không bị cảnh báo Third-party trên thiết bị Cisco, HPE, Aruba, Fortinet.',
      specs: ['Bước sóng: 850nm (SX/SR), 1310nm (LX/LR), 1550nm (ER/ZR)', 'Cự ly: 300m, 10km, 40km, 80km Singlemode / Multimode'],
    },
    {
      name: 'Bộ nhớ RAM & Ổ cứng máy chủ Enterprise',
      desc: 'RAM ECC Registered DDR4/DDR5 và ổ cứng SAS/SATA Enterprise, NVMe SSD dung lượng lớn chuyên dụng cho lưu trữ và máy chủ ảo hóa VMware/Proxmox.',
      specs: ['RAM: 16GB, 32GB, 64GB, 128GB ECC Reg', 'SSD/HDD: 480GB, 960GB, 1.92TB, 3.84TB SAS 12Gbps'],
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
          <span className="text-slate-900 font-bold truncate max-w-md">Linh Kiện Thay Thế & Spare Part Cứu Hộ</span>
        </nav>

        {/* ── Header Banner ───────────────────────────────────────────────── */}
        <div className="bg-gradient-to-r from-[#0F172A] via-[#0077CC] to-[#004A80] text-white rounded-3xl p-8 sm:p-12 mb-12 shadow-xl relative overflow-hidden">
          <div className="max-w-3xl relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/15 text-blue-100 text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full mb-3 border border-white/20 backdrop-blur-sm">
              <Package className="w-4 h-4 text-amber-400" />
              <span>Dịch vụ kỹ thuật chuyên sâu</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight mb-3">
              Cung Cấp Linh Kiện Thay Thế & Spare Part Cứu Hộ
            </h1>
            <p className="text-sm sm:text-base text-blue-100 leading-relaxed max-w-2xl">
              Kho linh kiện chính hãng sẵn sàng tại Hà Nội và TP.HCM: Nguồn phụ, Fan module, SFP/SFP+, RAM máy chủ, Card mạng. Giao hàng hỏa tốc 2 giờ giảm thiểu tối đa Downtime.
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
                    Nhằm giảm thiểu tối đa thời gian gián đoạn hoạt động kinh doanh (Downtime) khi phần cứng gặp sự cố bất ngờ, GTS duy trì kho linh kiện thay thế (Spare Part) chính hãng quy mô lớn cho các dòng thiết bị Cisco Catalyst, FortiGate, HPE ProLiant, Dell PowerEdge. Chúng tôi cung cấp dịch vụ giao hàng hỏa tốc trong vòng 2 giờ đối với các linh kiện khẩn cấp như bộ nguồn dự phòng, quạt tản nhiệt, module quang hoặc ổ cứng máy chủ Enterprise.
                  </p>
                </div>

                {/* Danh mục linh kiện sẵn kho */}
                <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-xs space-y-6">
                  <div className="flex items-center gap-2.5 text-[#0077CC]">
                    <Cpu className="w-5 h-5" />
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                      Danh Mục Linh Kiện Thay Thế Sẵn Kho
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    {categories.map((cat, idx) => (
                      <div key={idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
                        <h3 className="font-bold text-slate-900 text-sm sm:text-base mb-1.5 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#0077CC]"></span>
                          {cat.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-600 mb-3 leading-relaxed">{cat.desc}</p>
                        <div className="space-y-1.5">
                          {cat.specs.map((spec, sIdx) => (
                            <div key={sIdx} className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                              <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                              <span>{spec}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Các bước quy trình */}
                <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-xs space-y-5">
                  <div className="flex items-center gap-2.5 text-[#0077CC]">
                    <Truck className="w-5 h-5" />
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                      Quy Trình Xử Lý Spare Part Hỏa Tốc
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
                <span>Kiểm tra kho linh kiện</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Nhập mã Part Number cần tra cứu hoặc gọi ngay hotline cứu hộ để được kiểm tra tồn kho và điều phối hàng hỏa tốc trong 2 giờ.
              </p>

              <Link
                href="/lien-he?service=dich-vu-spare-part&type=sparepart"
                className="w-full bg-[#0077CC] hover:bg-[#004A80] text-white py-3.5 px-4 rounded-2xl font-bold text-xs uppercase tracking-wider text-center block transition-colors shadow-md"
              >
                Yêu cầu báo giá linh kiện
              </Link>

              <a
                href={`tel:${hotline.replace(/\s/g, '')}`}
                className="w-full bg-[#0F172A] hover:bg-slate-800 text-white py-3.5 px-4 rounded-2xl font-bold text-xs text-center block transition-colors flex items-center justify-center gap-2"
              >
                <PhoneCall className="w-4 h-4 text-amber-400" />
                <span>Hotline cứu hộ: {hotline}</span>
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
                      item.slug === 'dich-vu-spare-part'
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

            {/* Box Đổi mới 1:1 */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-900">
                <RefreshCw className="w-4 h-4 text-emerald-500" />
                <span>Bảo hành 1 đổi 1 tận nơi</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Tất cả linh kiện spare part cung cấp bởi GTS đều được áp dụng chính sách 1 đổi 1 ngay lập tức trong suốt thời hạn bảo hành.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
