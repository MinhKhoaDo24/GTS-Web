import type { Metadata } from 'next'
import Link from 'next/link'
import { query } from '@/lib/db'
import type { SiteSetting } from '@/types/database'
import {
  ShieldCheck,
  Search,
  CheckCircle2,
  Clock,
  Phone,
  Mail,
  Home,
  ChevronRight,
  HelpCircle,
  FileCheck2,
  AlertCircle
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Tra Cứu Bảo Hành & Dịch Vụ RMA Chính Hãng | GTS',
  description:
    'Cổng tra cứu thời hạn bảo hành phần cứng và tiến độ xử lý RMA thiết bị mạng Cisco, Fortinet, HPE, Dell, Ubiquiti tại GTS.',
}

export default async function WarrantyLookupPage() {
  const settingsArr = await query<SiteSetting>('SELECT key, value FROM site_settings').catch(() => [])
  const settings: Record<string, string> = Object.fromEntries(
    settingsArr.map((s) => [s.key, s.value ?? ''])
  )

  const hotline = settings.hotline || '0901 234 567'
  const email = settings.contact_email || 'warranty@gts.com.vn'

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
          <span className="text-slate-900 font-bold">Tra cứu bảo hành & RMA</span>
        </nav>

        {/* ── Header Banner ───────────────────────────────────────────────── */}
        <div className="bg-gradient-to-r from-[#0F172A] via-[#1D4ED8] to-[#1e40af] text-white rounded-3xl p-8 sm:p-14 mb-12 shadow-xl text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/15 text-blue-100 text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full mb-4 border border-white/20 backdrop-blur-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Cổng tra cứu bảo hành điện tử GTS</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-4">
            Tra Cứu Bảo Hành Thiết Bị & Tiến Độ RMA
          </h1>
          <p className="text-sm sm:text-base text-blue-100 leading-relaxed max-w-xl mx-auto mb-8">
            Nhập số Serial Number (S/N) hoặc Mã đơn hàng của quý khách để kiểm tra thời hạn bảo hành chính hãng và tình trạng xử lý bảo dưỡng.
          </p>

          {/* Form Tra cứu Serial Number */}
          <div className="max-w-xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-2 bg-white p-2 rounded-2xl sm:rounded-full shadow-lg">
              <div className="flex-1 flex items-center pl-4 pr-2">
                <Search className="w-5 h-5 text-slate-400 mr-2 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Nhập số Serial Number (VD: FOC2341..., S/N: CNU91...)"
                  className="w-full text-xs sm:text-sm font-mono text-slate-800 focus:outline-none bg-transparent"
                />
              </div>
              <button
                type="button"
                className="bg-[#1D4ED8] hover:bg-[#1E40AF] text-white px-6 py-3 rounded-xl sm:rounded-full font-bold text-xs uppercase tracking-wider transition-colors shadow-md cursor-pointer whitespace-nowrap"
              >
                Tra cứu ngay
              </button>
            </div>
            <p className="text-[11px] text-blue-200 mt-3 font-mono">
              * Vị trí tem S/N: mặt dưới hoặc phía sau vỏ sắt của thiết bị phần cứng.
            </p>
          </div>
        </div>

        {/* ── Quy Trình Bảo Hành & Cam Kết Chính Hãng ─────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
          <div className="bg-white rounded-3xl p-7 border border-slate-200/80 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#1D4ED8] flex items-center justify-center mb-4">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-2">Bảo Hành 1 Đổi 1</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Áp dụng chính sách đổi mới tương đương cho các lỗi phần cứng từ nhà sản xuất trong thời gian bảo hành tiêu chuẩn từ 12 đến 36 tháng.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-7 border border-slate-200/80 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-2">Hỗ Trợ Mượn Thiết Bị</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Đối với các thiết bị mạng cốt lõi (Core Switch, Firewall), GTS hỗ trợ cho mượn thiết bị thay thế tạm thời trong lúc chờ hãng xử lý RMA.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-7 border border-slate-200/80 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-2">Hồ Sơ Xuất Xứ CO/CQ</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Mọi sản phẩm bảo hành đều được đối chiếu hồ sơ nhập khẩu và giấy chứng nhận CO/CQ lưu trữ trên hệ thống điện tử của GTS.
            </p>
          </div>
        </div>

        {/* ── Hotline Tiếp Nhận RMA ───────────────────────────────────────── */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-xs max-w-4xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1D4ED8] mb-1">
              <HelpCircle className="w-4 h-4" />
              <span>Cần gửi thiết bị bảo hành?</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Bộ Phận Tiếp Nhận & Trả Hàng Bảo Hành (RMA Center)
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Thời gian làm việc: Thứ 2 – Thứ 6 (8:00 – 17:30) | Thứ 7 (8:00 – 12:00)
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={`tel:${hotline.replace(/\s/g, '')}`}
              className="bg-[#0F172A] hover:bg-slate-800 text-white px-5 py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <Phone className="w-4 h-4 text-amber-400" />
              <span>{hotline}</span>
            </a>
            <a
              href={`mailto:${email}?subject=Yêu cầu RMA bảo hành`}
              className="bg-[#1D4ED8] hover:bg-[#1E40AF] text-white px-5 py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <Mail className="w-4 h-4" />
              <span>Gửi Email RMA</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
