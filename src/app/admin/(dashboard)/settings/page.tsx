'use client'

import { useState, useEffect } from 'react'
import { Settings, Save, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    fetch('/api/admin/site-settings')
      .then((r) => r.json())
      .then((json) => {
        if (json.data) setSettings(json.data)
      })
      .catch((err) => setErrorMsg('Không thể tải cấu hình'))
      .finally(() => setLoading(false))
  }, [])

  const handleChange = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setSuccessMsg('')
    setErrorMsg('')

    try {
      const res = await fetch('/api/admin/site-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })

      if (res.ok) {
        setSuccessMsg('Đã lưu cấu hình thành công! Thay đổi sẽ hiển thị ngay trên website.')
      } else {
        setErrorMsg('Không thể cập nhật cấu hình.')
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Lỗi kết nối')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="p-12 text-center text-gray-400 text-sm flex items-center justify-center gap-2">
        <Loader2 className="w-5 h-5 animate-spin text-[#1D4ED8]" />
        <span>Đang tải thông số cấu hình...</span>
      </div>
    )
  }

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Cấu hình Website</h1>
        <p className="text-gray-500 text-xs sm:text-sm mt-0.5">
          Quản lý hotline, Zalo, thông tin liên hệ, bản đồ và metadata của công ty
        </p>
      </div>

      {successMsg && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-800 text-xs sm:text-sm rounded-xl flex items-center gap-2.5">
          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm rounded-xl flex items-center gap-2.5">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm space-y-8">
        {/* Section 1: Kênh liên hệ trực tiếp */}
        <div>
          <h2 className="text-base font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">
            1. Kênh liên hệ trực tiếp (Header, Footer & FloatingContact)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Số Hotline hiển thị & gọi điện
              </label>
              <input
                type="text"
                value={settings.hotline || ''}
                onChange={(e) => handleChange('hotline', e.target.value)}
                placeholder="VD: 0901 234 567"
                className="w-full text-xs sm:text-sm border border-gray-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#1D4ED8]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Số điện thoại Zalo (để mở link zalo.me)
              </label>
              <input
                type="text"
                value={settings.zalo_phone || ''}
                onChange={(e) => handleChange('zalo_phone', e.target.value)}
                placeholder="VD: 0901234567"
                className="w-full text-xs sm:text-sm border border-gray-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#1D4ED8]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Email nhận liên hệ báo giá & hỗ trợ
              </label>
              <input
                type="email"
                value={settings.contact_email || ''}
                onChange={(e) => handleChange('contact_email', e.target.value)}
                placeholder="contact@gts.vn"
                className="w-full text-xs sm:text-sm border border-gray-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#1D4ED8]"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Thông tin công ty & địa chỉ */}
        <div>
          <h2 className="text-base font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">
            2. Thông tin pháp nhân & Địa chỉ
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Tên đầy đủ công ty
                </label>
                <input
                  type="text"
                  value={settings.company_name || ''}
                  onChange={(e) => handleChange('company_name', e.target.value)}
                  placeholder="GTS - Global Technology & Service"
                  className="w-full text-xs sm:text-sm border border-gray-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#1D4ED8]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Mã số thuế (MST)
                </label>
                <input
                  type="text"
                  value={settings.tax_code || ''}
                  onChange={(e) => handleChange('tax_code', e.target.value)}
                  placeholder="0123456789"
                  className="w-full text-xs sm:text-sm border border-gray-200 rounded-xl px-3.5 py-2.5 font-mono focus:outline-none focus:border-[#1D4ED8]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Địa chỉ trụ sở / văn phòng
              </label>
              <input
                type="text"
                value={settings.address || ''}
                onChange={(e) => handleChange('address', e.target.value)}
                placeholder="123 Nguyễn Văn Linh, Phường Tân Phong, Quận 7, TP.HCM"
                className="w-full text-xs sm:text-sm border border-gray-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#1D4ED8]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Giờ làm việc
              </label>
              <input
                type="text"
                value={settings.working_hours || ''}
                onChange={(e) => handleChange('working_hours', e.target.value)}
                placeholder="Thứ 2 – Thứ 6: 8:00 – 17:30 | Thứ 7: 8:00 – 12:00"
                className="w-full text-xs sm:text-sm border border-gray-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#1D4ED8]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Link Embed Google Maps iframe URL
              </label>
              <textarea
                rows={2}
                value={settings.google_map_embed_url || ''}
                onChange={(e) => handleChange('google_map_embed_url', e.target.value)}
                placeholder="https://www.google.com/maps/embed?pb=..."
                className="w-full text-xs sm:text-sm border border-gray-200 rounded-xl p-3 font-mono focus:outline-none focus:border-[#1D4ED8]"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Mạng xã hội & Khác */}
        <div>
          <h2 className="text-base font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">
            3. Mạng xã hội & Liên kết
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Facebook Fanpage URL
              </label>
              <input
                type="url"
                value={settings.facebook_url || ''}
                onChange={(e) => handleChange('facebook_url', e.target.value)}
                placeholder="https://facebook.com/gts.vn"
                className="w-full text-xs sm:text-sm border border-gray-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#1D4ED8]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Link trang Tra cứu bảo hành
              </label>
              <input
                type="text"
                value={settings.warranty_lookup_url || ''}
                onChange={(e) => handleChange('warranty_lookup_url', e.target.value)}
                placeholder="/chinh-sach-bao-hanh"
                className="w-full text-xs sm:text-sm border border-gray-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#1D4ED8]"
              />
            </div>
          </div>
        </div>

        {/* Submit button */}
        <div className="pt-4 border-t border-gray-100 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 bg-[#1D4ED8] hover:bg-[#1e40af] text-white px-6 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-md disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Lưu tất cả thay đổi</span>
          </button>
        </div>
      </form>
    </div>
  )
}
