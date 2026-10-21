import type { Metadata } from 'next'
import Link from 'next/link'
import { query } from '@/lib/db'
import type { SiteSetting } from '@/types/database'
import { Mail, MapPin, Clock, ChevronRight } from 'lucide-react'
import ContactForm from './ContactForm'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Liên hệ',
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

  const companyName = settings.company_name || 'GTS - Global Technology & Service'
  const hotline = settings.hotline || '0901 234 567'
  const zaloPhone = settings.zalo_phone || '0901234567'
  const email = settings.contact_email || 'contact@gts.vn'
  const address = settings.address || '480 Nguyễn Oanh, Phường 6, Gò Vấp, TP. Hồ Chí Minh'
  const workingHours = settings.working_hours || 'T2 – T7: 8:00 – 17:30'

  return (
    <div className="bg-[#F8FAFC] py-10 sm:py-16 fade-in">
      <div className="layout-container">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-[#0077CC] transition-colors font-medium">
            Trang chủ
          </Link>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900 font-bold">Liên hệ</span>
        </nav>

        {/* Page title */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mb-1">Liên hệ</h1>
          <p className="text-sm text-gray-500">
            Gửi yêu cầu qua biểu mẫu hoặc email, chúng tôi sẽ phản hồi sớm nhất.
          </p>
        </div>

        {/* Info + Form */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left: Info + mini map */}
          <div className="lg:col-span-2 space-y-5">
            <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
              <a href={`mailto:${email}`} className="flex items-start gap-3 group">
                <Mail className="w-5 h-5 text-[#0077CC] flex-shrink-0 mt-0.5" />
                <span className="min-w-0">
                  <span className="block text-xs text-gray-400 uppercase tracking-wide">Email</span>
                  <span className="text-sm font-semibold text-[#0077CC] group-hover:text-[#004A80] transition-colors break-all">
                    {email}
                  </span>
                </span>
              </a>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#0077CC] flex-shrink-0 mt-0.5" />
                <span className="min-w-0">
                  <span className="block text-xs text-gray-400 uppercase tracking-wide">Địa chỉ</span>
                  <span className="text-sm text-gray-700 leading-relaxed">{address}</span>
                </span>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <span className="min-w-0">
                  <span className="block text-xs text-gray-400 uppercase tracking-wide">Giờ làm việc</span>
                  <span className="text-sm text-gray-700">{workingHours}</span>
                </span>
              </div>
            </div>

            <div className="rounded-xl overflow-hidden border border-gray-200">
              <iframe
                title="GTS Office Location"
                src={`https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`}
                width="100%"
                height="295"
                style={{ border: 0, display: 'block' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Right: Form */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6">
              <h2 className="text-base font-bold text-gray-900 mb-4">Gửi yêu cầu liên hệ</h2>
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
