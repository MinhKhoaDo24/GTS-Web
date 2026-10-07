import type { Metadata } from 'next'
import Link from 'next/link'
import { query } from '@/lib/db'
import type { SiteSetting } from '@/types/database'
import { Phone, Mail, MapPin, Clock, Shield, ChevronRight } from 'lucide-react'
import { SiZalo } from 'react-icons/si'
import ContactForm from './ContactForm'

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
          <Link href="/" className="hover:text-[#1D4ED8] transition-colors font-medium">
            Trang chủ
          </Link>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900 font-bold">Liên hệ</span>
        </nav>

        {/* Page title */}
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-black text-[#1D4ED8] uppercase tracking-wide mb-2">
            LIÊN HỆ
          </h1>
          <div className="w-16 h-1 bg-[#F59E0B] mx-auto rounded-full" />
        </div>

        {/* 3 Contact Info Cards */}
        <div className="border-2 border-[#4B2EA2] rounded-2xl p-6 sm:p-8 mb-10 bg-white shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200 gap-0">
            {/* Tư vấn dự án */}
            <div className="pb-6 md:pb-0 md:pr-8 flex flex-col gap-3">
              <h3 className="text-base font-extrabold text-gray-900 uppercase border-b-2 border-[#F59E0B] pb-2 mb-1 w-fit">
                TƯ VẤN DỰ ÁN
              </h3>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Phone className="w-4 h-4 text-gray-500 flex-shrink-0" />
                <span>Hotline: {hotline}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Mail className="w-4 h-4 text-gray-500 flex-shrink-0" />
                <span>Email: {email}</span>
              </div>
            </div>

            {/* Hỗ trợ kỹ thuật */}
            <div className="py-6 md:py-0 md:px-8 flex flex-col gap-3">
              <h3 className="text-base font-extrabold text-gray-900 uppercase border-b-2 border-[#F59E0B] pb-2 mb-1 w-fit">
                HỖ TRỢ KỸ THUẬT
              </h3>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Phone className="w-4 h-4 text-gray-500 flex-shrink-0" />
                <span>Điện thoại: {hotline}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Mail className="w-4 h-4 text-gray-500 flex-shrink-0" />
                <span>Email: {email}</span>
              </div>
            </div>

            {/* Chăm sóc khách hàng */}
            <div className="pt-6 md:pt-0 md:pl-8 flex flex-col gap-3">
              <h3 className="text-base font-extrabold text-gray-900 uppercase border-b-2 border-[#F59E0B] pb-2 mb-1 w-fit">
                CHĂM SÓC KHÁCH HÀNG
              </h3>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <SiZalo className="w-4 h-4 text-[#0068FF] flex-shrink-0" />
                <a
                  href={`https://zalo.me/${zaloPhone.replace(/\s/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#0068FF] transition-colors"
                >
                  Zalo: {zaloPhone}
                </a>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Mail className="w-4 h-4 text-gray-500 flex-shrink-0" />
                <a href={`mailto:${email}`} className="hover:text-[#1D4ED8] transition-colors">
                  Email: {email}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form + Company Info */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Company info */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h3 className="text-base font-bold text-gray-900 mb-4 pb-3 border-b border-gray-100">
                Thông tin công ty
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex gap-3">
                  <Shield className="w-4 h-4 text-[#1D4ED8] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 font-medium">{companyName}</span>
                </div>
                {address && (
                  <div className="flex gap-3">
                    <MapPin className="w-4 h-4 text-[#1D4ED8] flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600 leading-relaxed">{address}</span>
                  </div>
                )}
                {workingHours && (
                  <div className="flex gap-3">
                    <Clock className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">{workingHours}</span>
                  </div>
                )}
                {settings.tax_code && (
                  <div className="flex gap-3">
                    <Shield className="w-4 h-4 text-[#22C55E] flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600 font-mono">MST: {settings.tax_code}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-8">
            <div className="border-2 border-[#4B2EA2] rounded-2xl bg-white shadow-sm p-6 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#1D4ED8] uppercase mb-1">
                GỬI YÊU CẦU LIÊN HỆ
              </h2>
              <div className="w-12 h-1 bg-[#F59E0B] rounded-full mb-4" />
              <p className="text-sm text-gray-500 mb-6">
                {companyName} sẽ tiếp nhận thông tin và phản hồi trong thời gian sớm nhất.
              </p>
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
