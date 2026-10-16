import Link from 'next/link'
import { Mail, MapPin, Clock, Navigation } from 'lucide-react'

interface FooterProps {
  settings: Record<string, string>
}

const COMPANY_ADDRESS = '369 Ngọc Lâm, Long Biên, Hà Nội'

export function Footer({ settings }: FooterProps) {
  const currentYear = new Date().getFullYear()
  const address = settings.address || COMPANY_ADDRESS
  const mapEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`
  const mapDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`

  return (
    <footer className="bg-gradient-to-r from-[#0F172A] to-[#1E293B] text-gray-300">
      {/* Main Footer */}
      <div className="layout-container py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Col 1: Logo + About */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-md">
                <span className="text-white font-black text-2xl tracking-tighter">
                  <img src="/pic/logo_no_background.png" alt="GTS Logo" className="w-full h-full object-contain" />
                </span>
              </div>
              <div>
                <div className="text-white font-extrabold text-lg sm:text-xl leading-tight tracking-tight flex items-center gap-2">
                  <span className="text-slate-100 text-sm sm:text-base font-bold">Global Technology & Service</span>
                </div>
                <div className="text-blue-300 text-xs font-semibold leading-tight mt-0.5">Find your true solution</div>
              </div>
            </Link>
            <p className="text-sm sm:text-base text-gray-300 leading-relaxed mb-6">
              Đơn vị phân phối và cung cấp giải pháp hạ tầng mạng, thiết bị phần cứng B2B hàng đầu tại Việt Nam với hơn 5 năm kinh nghiệm và hơn 50+ đối tác tin cậy.
            </p>
          </div>

          {/* Col 2: Sitemap */}
          <div>
            <h3 className="text-white font-bold mb-4 text-base uppercase tracking-wider border-b border-gray-800 pb-2">
              Sản phẩm & Dịch vụ
            </h3>
            <ul className="space-y-2.5">
              {[
                { href: '/san-pham', label: 'Tất cả sản phẩm' },
                { href: '/san-pham?category=switch', label: 'Switch / Bộ chuyển mạch' },
                { href: '/san-pham?category=wifi-access-point', label: 'WiFi / Access Point doanh nghiệp' },
                { href: '/san-pham?category=router-firewall', label: 'Router & Firewall NGFW' },
                { href: '/dich-vu-tu-van', label: 'Tư vấn thiết kế mạng LAN/WAN' },
                { href: '/dich-vu-trien-khai', label: 'Triển khai & Cấu hình thiết bị' },
                { href: '/dich-vu-bao-tri', label: 'Bảo trì & Ứng cứu sự cố' },
              ].map(item => (
                <li key={item.href}>
                  <Link href={item.href}
                    className="text-sm sm:text-base text-gray-300 hover:text-[#0EA5E9] transition-colors flex items-center gap-1.5 group">
                    <span className="text-gray-600 group-hover:text-[#0EA5E9] transition-colors font-bold">›</span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Quick Links */}
          <div>
            <h3 className="text-white font-bold mb-4 text-base uppercase tracking-wider border-b border-gray-800 pb-2">
              Giải pháp & Chính sách
            </h3>
            <ul className="space-y-2.5">
              {[
                { href: '/gioi-thieu', label: 'Về Chúng tôi' },
                { href: '/giai-phap/giai-phap-wifi', label: 'Giải pháp WiFi diện rộng' },
                { href: '/giai-phap/giai-phap-mang', label: 'Hạ tầng mạng văn phòng / nhà máy' },
                { href: '/giai-phap/giai-phap-bao-mat', label: 'Bảo mật & Tường lửa Firewall' },
                { href: '/tin-tuc', label: 'Tin tức công nghệ mạng' },
                { href: '/faq', label: 'Câu hỏi thường gặp (FAQ)' },
                { href: '/lien-he', label: 'Liên hệ & Báo giá nhanh' },
                { href: '/chinh-sach-bao-hanh', label: 'Chính sách bảo hành & CO/CQ' },
                { href: '/quy-dinh-dieu-khoan', label: 'Quy định & Điều khoản' },
                { href: '/chinh-sach-bao-mat', label: 'Chính sách bảo mật' },
              ].map(item => (
                <li key={item.href}>
                  <Link href={item.href}
                    className="text-sm sm:text-base text-gray-300 hover:text-[#0EA5E9] transition-colors flex items-center gap-1.5 group">
                    <span className="text-gray-600 group-hover:text-[#0EA5E9] transition-colors font-bold">›</span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Contact */}
          <div>
            <h3 className="text-white font-bold mb-4 text-base uppercase tracking-wider border-b border-gray-800 pb-2">
              Thông tin liên hệ
            </h3>
            <ul className="space-y-3.5">
              <li className="flex gap-3 items-start">
                <MapPin className="w-5 h-5 text-[#3B82F6] flex-shrink-0 mt-0.5" />
                <span className="text-sm sm:text-base text-gray-300 leading-relaxed">
                  {address}
                </span>
              </li>
              <li>
                <a href={`mailto:${settings.contact_email}`}
                  className="flex items-center gap-3 text-sm sm:text-base text-gray-300 hover:text-[#0EA5E9] transition-colors">
                  <Mail className="w-5 h-5 text-[#0EA5E9] flex-shrink-0" />
                  {settings.contact_email || 'contact@gts.vn'}
                </a>
              </li>
              <li className="flex gap-3 items-center">
                <Clock className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <span className="text-sm sm:text-base text-gray-300 leading-relaxed">
                  {settings.working_hours || 'T2 – T6: 8:00 – 17:30'}
                </span>
              </li>
            </ul>

            {/* Google Mini Map + Chỉ đường */}
            <div className="mt-5">
              <div className="rounded-xl overflow-hidden border border-gray-700 shadow-md">
                <iframe
                  src={mapEmbedUrl}
                  width="100%"
                  height="150"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`Bản đồ vị trí GTS - ${address}`}
                  className="block w-full"
                />
              </div>
              <a
                href={mapDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center justify-center gap-2 w-full sm:w-auto rounded-lg bg-[#1E88E5] hover:bg-[#1565C0] text-white text-sm font-semibold px-4 py-2.5 transition-colors"
              >
                <Navigation className="w-4 h-4 flex-shrink-0" />
                Xem chỉ đường
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 bg-[#0B1120]">
        <div className="layout-container py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs sm:text-sm text-gray-400 text-center sm:text-left">
            © {currentYear} GTS - Global Technology & Service - 2026.
            {settings.tax_code && ` | MST: ${settings.tax_code}`}
          </p>
        </div>
      </div>
    </footer>
  )
}
