import type { Metadata } from 'next'
import Link from 'next/link'
import { query } from '@/lib/db'
import type { SiteSetting } from '@/types/database'
import { Phone, Mail, MapPin, Clock, Shield, ChevronRight, MessageSquare } from 'lucide-react'
import { SiZalo } from 'react-icons/si'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Liên hệ GTS - Global Technology & Service',
  description:
    'Thông tin liên hệ, địa chỉ văn phòng, hotline, email và chat Zalo trực tiếp với công ty GTS - Phân phối thiết bị mạng doanh nghiệp.',
}

export default async function ContactPage() {
  let settings: Record<string, string> = {}
  try {
    const settingsArr = await query<SiteSetting>('SELECT key, value FROM site_settings')
    settings = Object.fromEntries(settingsArr.map((s) => [s.key, s.value ?? '']))
  } catch (err) {
    // Database fallback
  }

  const hotline = settings.hotline || '0901 234 567'
  const zaloPhone = settings.zalo_phone || '0901234567'
  const email = settings.contact_email || 'contact@gts.vn'
  const address = settings.address || '123 Nguyễn Văn Linh, Phường Tân Phong, Quận 7, TP. Hồ Chí Minh'
  const workingHours = settings.working_hours || 'Thứ 2 – Thứ 6: 8:00 – 17:30 | Thứ 7: 8:00 – 12:00'
  const mapEmbed = settings.google_map_embed_url

  return (
    <div className="bg-[#F8FAFC] py-10 sm:py-16 fade-in">
      <div className="layout-container">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-[#1D4ED8] transition-colors font-medium">
            Trang chủ
          </Link>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900 font-bold">Liên hệ</span>
        </nav>

        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="inline-block text-xs sm:text-sm font-bold text-[#1D4ED8] bg-blue-100 px-4 py-1.5 rounded-full mb-3 uppercase tracking-wider">
            KẾT NỐI VỚI CHÚNG TÔI
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tight mb-4">
            Thông tin liên hệ & Hỗ trợ kỹ thuật
          </h1>
          <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
            GTS luôn sẵn sàng lắng nghe, khảo sát thực tế và tư vấn giải pháp mạng phần cứng tối ưu nhất cho quý doanh nghiệp.
          </p>
        </div>

        {/* 3 Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Hotline Card */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm flex flex-col items-center text-center group hover:border-[#F59E0B]/30 hover:shadow-md transition-all">
            <div className="w-14 h-14 bg-amber-50 text-[#F59E0B] rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Phone className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-1">Hotline tư vấn 24/7</h3>
            <p className="text-xs text-gray-500 mb-4">Tư vấn báo giá, cấu hình kỹ thuật</p>
            <a
              href={`tel:${hotline.replace(/\s/g, '')}`}
              className="mt-auto inline-flex items-center gap-2 bg-[#F59E0B] hover:bg-[#d97706] text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all"
            >
              <Phone className="w-4 h-4" />
              {hotline}
            </a>
          </div>

          {/* Zalo Card */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm flex flex-col items-center text-center group hover:border-[#0068FF]/30 hover:shadow-md transition-all">
            <div className="w-14 h-14 bg-blue-50 text-[#0068FF] rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <SiZalo className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-1">Chat Zalo OA / Kỹ thuật</h3>
            <p className="text-xs text-gray-500 mb-4">Trao đổi nhanh, gửi datasheet, bảng giá</p>
            <a
              href={`https://zalo.me/${zaloPhone.replace(/\s/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-auto inline-flex items-center gap-2 bg-[#0068FF] hover:bg-[#0052cc] text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all"
            >
              <MessageSquare className="w-4 h-4" />
              Nhắn tin Zalo
            </a>
          </div>

          {/* Email Card */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm flex flex-col items-center text-center group hover:border-[#1D4ED8]/30 hover:shadow-md transition-all">
            <div className="w-14 h-14 bg-blue-50 text-[#1D4ED8] rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Mail className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-1">Hộp thư điện tử</h3>
            <p className="text-xs text-gray-500 mb-4">Gửi yêu cầu dự án, hồ sơ thầu, hóa đơn</p>
            <a
              href={`mailto:${email}`}
              className="mt-auto inline-flex items-center gap-2 bg-[#1D4ED8] hover:bg-[#1e40af] text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all"
            >
              <Mail className="w-4 h-4" />
              {email}
            </a>
          </div>
        </div>

        {/* Office & Map Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Office details */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-4 pb-3 border-b border-gray-100">
                Trụ sở công ty
              </h2>
              <div className="space-y-4 text-sm">
                <div className="flex gap-3">
                  <MapPin className="w-5 h-5 text-[#1D4ED8] flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-gray-900">Địa chỉ văn phòng:</strong>
                    <span className="text-gray-600 leading-relaxed">{address}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Clock className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-gray-900">Giờ làm việc:</strong>
                    <span className="text-gray-600 leading-relaxed">{workingHours}</span>
                  </div>
                </div>

                {settings.tax_code && (
                  <div className="flex gap-3">
                    <Shield className="w-5 h-5 text-[#22C55E] flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-gray-900">Mã số thuế:</strong>
                      <span className="text-gray-600 font-mono">{settings.tax_code}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Commitment card */}
            <div className="bg-gradient-to-br from-[#0F172A] to-[#1D4ED8] text-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-base mb-2">Cam kết dịch vụ B2B của GTS</h3>
              <ul className="space-y-2 text-xs text-blue-100">
                <li>✓ Sản phẩm đầy đủ CO/CQ và hóa đơn VAT hợp lệ</li>
                <li>✓ Hỗ trợ mượn thiết bị demo cho dự án doanh nghiệp</li>
                <li>✓ Thời gian phản hồi yêu cầu kỹ thuật trong vòng 2 giờ làm việc</li>
                <li>✓ Hỗ trợ bảo hành 1 đổi 1 trong thời gian cam kết</li>
              </ul>
            </div>
          </div>

          {/* Map */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm h-full min-h-[360px] flex flex-col">
              <h2 className="text-sm font-semibold text-gray-700 mb-3 px-2">Bản đồ chỉ dẫn đường đi</h2>
              <div className="flex-1 rounded-xl overflow-hidden border border-gray-200">
                {mapEmbed ? (
                  <iframe
                    src={mapEmbed}
                    width="100%"
                    height="100%"
                    style={{ border: 0, minHeight: '340px' }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Vị trí văn phòng GTS"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-400">
                    Bản đồ đang cập nhật
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
