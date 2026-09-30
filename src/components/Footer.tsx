import Link from 'next/link'
import { Phone, Mail, MapPin, Clock, Shield } from 'lucide-react'

interface FooterProps {
  settings: Record<string, string>
}

export function Footer({ settings }: FooterProps) {
  const currentYear = new Date().getFullYear()

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
                <div className="text-white font-extrabold text-xl leading-tight tracking-tight">Global Solution & Technology</div>
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
                    className="text-sm sm:text-base text-gray-300 hover:text-[#22C55E] transition-colors flex items-center gap-1.5 group">
                    <span className="text-gray-600 group-hover:text-[#22C55E] transition-colors font-bold">›</span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Quick Links */}
          <div>
            <h3 className="text-white font-bold mb-4 text-base uppercase tracking-wider border-b border-gray-800 pb-2">
              Liên kết nhanh
            </h3>
            <ul className="space-y-2.5">
              {[
                { href: '/gioi-thieu', label: 'Về công ty GTS' },
                { href: '/giai-phap-wifi', label: 'Giải pháp WiFi diện rộng' },
                { href: '/giai-phap-mang', label: 'Hạ tầng mạng văn phòng / nhà máy' },
                { href: '/giai-phap-bao-mat', label: 'Bảo mật & Tường lửa Firewall' },
                { href: '/tin-tuc', label: 'Tin tức công nghệ mạng' },
                { href: '/faq', label: 'Câu hỏi thường gặp (FAQ)' },
                { href: '/lien-he', label: 'Liên hệ & Báo giá nhanh' },
                { href: '/chinh-sach-bao-hanh', label: 'Chính sách bảo hành & CO/CQ' },
              ].map(item => (
                <li key={item.href}>
                  <Link href={item.href}
                    className="text-sm sm:text-base text-gray-300 hover:text-[#22C55E] transition-colors flex items-center gap-1.5 group">
                    <span className="text-gray-600 group-hover:text-[#22C55E] transition-colors font-bold">›</span>
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
                  {settings.address || '480 Nguyễn Oanh, Phường 6, Gò Vấp, TP. Hồ Chí Minh'}
                </span>
              </li>
              <li>
                <a href={`tel:${(settings.hotline || '0901234567').replace(/\s/g, '')}`}
                  className="flex items-center gap-3 text-sm sm:text-base text-amber-400 font-bold hover:text-amber-300 transition-colors">
                  <Phone className="w-5 h-5 flex-shrink-0" />
                  Hotline: {settings.hotline || '0901 234 567'}
                </a>
              </li>
              <li>
                <a href={`mailto:${settings.contact_email}`}
                  className="flex items-center gap-3 text-sm sm:text-base text-gray-300 hover:text-[#22C55E] transition-colors">
                  <Mail className="w-5 h-5 text-[#22C55E] flex-shrink-0" />
                  {settings.contact_email || 'contact@gts.vn'}
                </a>
              </li>
              <li className="flex gap-3 items-center">
                <Clock className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <span className="text-sm sm:text-base text-gray-300 leading-relaxed">
                  {settings.working_hours || 'T2 – T7: 8:00 – 17:30'}
                </span>
              </li>
            </ul>

            {/* Google Map */}
            {settings.google_map_embed_url && (
              <div className="mt-4 rounded-xl overflow-hidden border border-gray-700 shadow-md">
                <iframe
                  src={settings.google_map_embed_url}
                  width="100%"
                  height="130"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="GTS Location"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 bg-[#0B1120]">
        <div className="layout-container py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs sm:text-sm text-gray-400 text-center sm:text-left">
            © {currentYear} GTS - Global Technology & Service. B2B Enterprise Network Partner.
            {settings.tax_code && ` | MST: ${settings.tax_code}`}
          </p>
          <div className="flex items-center gap-2 text-xs sm:text-sm text-green-400 font-medium">
            <Shield className="w-4 h-4 text-[#22C55E]" />
            <span>Cam kết CO/CQ 100% Chính hãng</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
