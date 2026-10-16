'use client'

import { useActionState, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowLeft, Save, Loader2, Sparkles, Image as ImageIcon,
  Globe, Star, Eye, EyeOff, Layers, Upload, X, AlertCircle
} from 'lucide-react'
import { TiptapEditor } from '@/components/admin/TiptapEditor'
import { slugify } from '@/lib/utils'
import type { Solution } from '@/types/database'

interface SolutionFormProps {
  initialData?: Partial<Solution>
  action: (prev: any, formData: FormData) => Promise<any>
}

const inputCls = 'w-full text-sm bg-slate-50/50 hover:bg-slate-50/80 focus:bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium'

export function SolutionForm({ initialData, action }: SolutionFormProps) {
  const [state, formAction, isPending] = useActionState(action, null)

  const [name, setName] = useState(initialData?.name || '')
  const [slug, setSlug] = useState(initialData?.slug || '')
  const [shortDesc, setShortDesc] = useState(initialData?.short_description || '')
  const [description, setDescription] = useState(initialData?.description || '')
  const [thumbnail, setThumbnail] = useState(initialData?.thumbnail || '')
  const [banner, setBanner] = useState(initialData?.banner || '')
  const [sortOrder, setSortOrder] = useState(initialData?.sort_order ?? 0)
  const [isActive, setIsActive] = useState(initialData?.is_active ?? true)
  const [isFeatured, setIsFeatured] = useState(initialData?.is_featured ?? false)
  const [autoSlug, setAutoSlug] = useState(!initialData?.slug)
  const [uploadingThumb, setUploadingThumb] = useState(false)
  const [uploadingBanner, setUploadingBanner] = useState(false)

  const handleNameChange = (val: string) => {
    setName(val)
    if (autoSlug) {
      setSlug(slugify(val))
    }
  }

  const handleImageUpload = async (file: File, target: 'thumb' | 'banner') => {
    const isThumb = target === 'thumb'
    if (isThumb) setUploadingThumb(true)
    else setUploadingBanner(true)

    const formData = new FormData()
    formData.append('file', file)
    try {
      const res = await fetch('/api/v2/admin/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (data.url) {
        if (isThumb) setThumbnail(data.url)
        else setBanner(data.url)
      }
    } catch (e) {
      console.error(e)
    } finally {
      if (isThumb) setUploadingThumb(false)
      else setUploadingBanner(false)
    }
  }

  const errors = state?.errors || {}

  return (
    <form action={formAction} className="w-full space-y-6 pb-12">
      {/* Top Header Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/solutions"
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            title="Quay lại danh sách"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              {initialData?.id ? 'Chỉnh sửa giải pháp' : 'Thêm giải pháp mới'}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              {initialData ? initialData.name : 'Thiết kế & đăng tải giải pháp công nghệ Enterprise'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          <Link
            href="/admin/solutions"
            className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            Hủy bỏ
          </Link>
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 text-xs font-semibold rounded-xl transition-all shadow-xs disabled:opacity-60"
          >
            {isPending ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Đang lưu...</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>{initialData?.id ? 'Lưu thay đổi' : 'Đăng giải pháp'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Global Error Banner */}
      {errors._root && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold">Không thể lưu giải pháp</p>
            <p className="text-xs text-rose-600 mt-0.5">{errors._root[0]}</p>
          </div>
        </div>
      )}

      {/* 2-Column Responsive Form Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Column (Left - 2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card: Thông tin cơ bản */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" />
              <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Nội dung giải pháp
              </h2>
            </div>
            <div className="p-6 space-y-5">
              {/* Tên giải pháp */}
              <div className="space-y-1.5">
                <label htmlFor="name" className="block text-xs font-semibold text-slate-700">
                  Tên giải pháp <span className="text-rose-500">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="VD: Giải Pháp WiFi Doanh Nghiệp Mật Độ Cao"
                  className={inputCls}
                />
                {errors.name && (
                  <p className="text-[11px] text-rose-500 font-medium">{errors.name[0]}</p>
                )}
              </div>

              {/* Slug */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="slug" className="block text-xs font-semibold text-slate-700">
                    Đường dẫn URL (Slug) <span className="text-rose-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setAutoSlug(true)
                      setSlug(slugify(name))
                    }}
                    className="text-[11px] text-blue-600 hover:underline flex items-center gap-1 font-medium"
                  >
                    <Sparkles className="w-3 h-3" />
                    Tạo lại từ tên
                  </button>
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-400">
                    /giai-phap/
                  </span>
                  <input
                    id="slug"
                    name="slug"
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => {
                      setSlug(e.target.value)
                      setAutoSlug(false)
                    }}
                    placeholder="giai-phap-wifi-doanh-nghiep"
                    className={`${inputCls} pl-24 font-mono text-xs`}
                  />
                </div>
                {errors.slug && (
                  <p className="text-[11px] text-rose-500 font-medium">{errors.slug[0]}</p>
                )}
              </div>

              {/* Tóm tắt */}
              <div className="space-y-1.5">
                <label htmlFor="short_description" className="block text-xs font-semibold text-slate-700">
                  Tóm tắt ngắn giải pháp
                </label>
                <textarea
                  id="short_description"
                  name="short_description"
                  rows={3}
                  value={shortDesc}
                  onChange={(e) => setShortDesc(e.target.value)}
                  placeholder="Tóm tắt ngắn gọn 2-3 câu giới thiệu giải pháp để hiển thị ở trang danh sách..."
                  className={`${inputCls} resize-none`}
                />
              </div>

              {/* Nội dung chi tiết */}
              <div className="space-y-1.5 pt-2">
                <label className="block text-xs font-semibold text-slate-700">
                  Nội dung chi tiết bài viết giải pháp
                </label>
                <input type="hidden" name="description" value={description} />
                <TiptapEditor
                  content={description}
                  onChange={(html) => setDescription(html)}
                />
              </div>
            </div>
          </div>

          {/* Card: Tối ưu SEO */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-600" />
              <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Tối ưu hóa tìm kiếm (SEO)
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="seo_title" className="block text-xs font-semibold text-slate-700">
                  SEO Title
                </label>
                <input
                  id="seo_title"
                  name="seo_title"
                  type="text"
                  defaultValue={initialData?.seo_title ?? ''}
                  placeholder="Tiêu đề hiển thị trên kết quả tìm kiếm Google (để trống sẽ lấy tên giải pháp)"
                  className={inputCls}
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="seo_description" className="block text-xs font-semibold text-slate-700">
                  SEO Meta Description
                </label>
                <textarea
                  id="seo_description"
                  name="seo_description"
                  rows={2}
                  defaultValue={initialData?.seo_description ?? ''}
                  placeholder="Mô tả meta 140-160 ký tự cho công cụ tìm kiếm..."
                  className={`${inputCls} resize-none`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Column (Right - 1 Col) */}
        <div className="space-y-6">
          {/* Card: Trạng thái & Hiển thị */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Trạng thái & Thứ tự
              </h2>
            </div>
            <div className="p-5 space-y-4">
              <input type="hidden" name="is_active" value={isActive ? 'true' : 'false'} />
              <input type="hidden" name="is_featured" value={isFeatured ? 'true' : 'false'} />

              {/* Active Toggle */}
              <div
                onClick={() => setIsActive(!isActive)}
                className={`flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer ${
                  isActive
                    ? 'border-emerald-200 bg-emerald-50/50'
                    : 'border-slate-200 bg-slate-50/50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {isActive ? (
                    <Eye className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <EyeOff className="w-4 h-4 text-slate-400" />
                  )}
                  <div>
                    <p className="text-xs font-bold text-slate-800">
                      {isActive ? 'Đang xuất bản' : 'Bản nháp / Đang ẩn'}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {isActive ? 'Hiển thị công khai trên website' : 'Chỉ xem được trong quản trị'}
                    </p>
                  </div>
                </div>
                <div
                  className={`w-9 h-5 rounded-full transition-colors relative flex-shrink-0 ${
                    isActive ? 'bg-emerald-500' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white shadow-xs transform transition-transform mt-0.5 ${
                      isActive ? 'translate-x-4.5' : 'translate-x-0.5'
                    }`}
                  />
                </div>
              </div>

              {/* Featured Toggle */}
              <div
                onClick={() => setIsFeatured(!isFeatured)}
                className={`flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer ${
                  isFeatured
                    ? 'border-amber-200 bg-amber-50/50'
                    : 'border-slate-200 bg-slate-50/50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Star
                    className={`w-4 h-4 ${
                      isFeatured ? 'fill-amber-400 text-amber-500' : 'text-slate-400'
                    }`}
                  />
                  <div>
                    <p className="text-xs font-bold text-slate-800">
                      {isFeatured ? 'Giải pháp nổi bật' : 'Bình thường'}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {isFeatured ? 'Ưu tiên hiển thị trên trang chủ' : 'Hiển thị theo thứ tự chung'}
                    </p>
                  </div>
                </div>
                <div
                  className={`w-9 h-5 rounded-full transition-colors relative flex-shrink-0 ${
                    isFeatured ? 'bg-amber-400' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white shadow-xs transform transition-transform mt-0.5 ${
                      isFeatured ? 'translate-x-4.5' : 'translate-x-0.5'
                    }`}
                  />
                </div>
              </div>

              {/* Sort Order */}
              <div className="space-y-1.5 pt-1">
                <label htmlFor="sort_order" className="block text-xs font-semibold text-slate-700">
                  Thứ tự sắp xếp (Sort Order)
                </label>
                <input
                  id="sort_order"
                  name="sort_order"
                  type="number"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(Number(e.target.value))}
                  placeholder="0"
                  className={inputCls}
                />
                <p className="text-[11px] text-slate-400">Số nhỏ hơn sẽ hiển thị trước (VD: 0, 1, 2...)</p>
              </div>
            </div>
          </div>

          {/* Card: Ảnh đại diện (Thumbnail) */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-blue-600" />
              <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Ảnh đại diện (Thumbnail)
              </h2>
            </div>
            <div className="p-5 space-y-3">
              <input type="hidden" name="thumbnail" value={thumbnail} />

              {thumbnail ? (
                <div className="relative aspect-video rounded-xl border border-slate-200 overflow-hidden bg-slate-50 group">
                  <Image
                    src={thumbnail}
                    alt="Thumbnail preview"
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setThumbnail('')}
                    className="absolute top-2 right-2 p-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg shadow-sm transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <label className="border-2 border-dashed border-slate-200 hover:border-blue-500 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-50/50 hover:bg-white text-center">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={uploadingThumb}
                    onChange={(e) => {
                      const f = e.target.files?.[0]
                      if (f) handleImageUpload(f, 'thumb')
                    }}
                  />
                  {uploadingThumb ? (
                    <Loader2 className="w-6 h-6 text-blue-600 animate-spin mb-2" />
                  ) : (
                    <Upload className="w-6 h-6 text-slate-400 mb-2" />
                  )}
                  <span className="text-xs font-semibold text-slate-700">Tải ảnh đại diện</span>
                  <span className="text-[11px] text-slate-400 mt-0.5">Khuyến nghị 16:9 (1200x675px)</span>
                </label>
              )}

              {/* URL tay nếu có */}
              <div className="pt-1">
                <input
                  type="text"
                  placeholder="Hoặc dán URL ảnh trực tiếp..."
                  value={thumbnail}
                  onChange={(e) => setThumbnail(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 placeholder:text-slate-400"
                />
              </div>
            </div>
          </div>

          {/* Card: Ảnh Banner (Tùy chọn) */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-blue-600" />
              <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Ảnh Banner đầu trang
              </h2>
            </div>
            <div className="p-5 space-y-3">
              <input type="hidden" name="banner" value={banner} />

              {banner ? (
                <div className="relative aspect-[21/9] rounded-xl border border-slate-200 overflow-hidden bg-slate-50 group">
                  <Image
                    src={banner}
                    alt="Banner preview"
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setBanner('')}
                    className="absolute top-2 right-2 p-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg shadow-sm transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <label className="border-2 border-dashed border-slate-200 hover:border-blue-500 rounded-xl p-5 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-50/50 hover:bg-white text-center">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={uploadingBanner}
                    onChange={(e) => {
                      const f = e.target.files?.[0]
                      if (f) handleImageUpload(f, 'banner')
                    }}
                  />
                  {uploadingBanner ? (
                    <Loader2 className="w-5 h-5 text-blue-600 animate-spin mb-1.5" />
                  ) : (
                    <Upload className="w-5 h-5 text-slate-400 mb-1.5" />
                  )}
                  <span className="text-xs font-semibold text-slate-700">Tải ảnh banner</span>
                  <span className="text-[11px] text-slate-400 mt-0.5">Khuyến nghị 1920x600px</span>
                </label>
              )}

              {/* URL tay nếu có */}
              <div className="pt-1">
                <input
                  type="text"
                  placeholder="Hoặc dán URL banner..."
                  value={banner}
                  onChange={(e) => setBanner(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 placeholder:text-slate-400"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}
