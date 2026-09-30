'use client'

import { useActionState, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowLeft, Save, Loader2, Sparkles, Image as ImageIcon,
  Globe, Star, Eye, EyeOff, Calendar, User, FileText, ChevronDown
} from 'lucide-react'
import { TiptapEditor } from '@/components/admin/TiptapEditor'
import { slugify } from '@/lib/utils'
import type { ContentDetail, ContentType } from '@/lib/dal/contents'

interface ContentFormProps {
  initialData?: Partial<ContentDetail>
  action: (prev: any, formData: FormData) => Promise<any>
}

const inputCls = 'w-full text-sm bg-slate-50/50 hover:bg-slate-50/80 focus:bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium'
const selectCls = 'w-full text-sm bg-slate-50/50 hover:bg-slate-50/80 focus:bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all appearance-none cursor-pointer font-medium'

export function ContentForm({ initialData, action }: ContentFormProps) {
  const [state, formAction, isPending] = useActionState(action, null)

  const [title, setTitle] = useState(initialData?.title || '')
  const [slug, setSlug] = useState(initialData?.slug || '')
  const [type, setType] = useState<ContentType>(initialData?.type || 'news')
  const [contentHtml, setContentHtml] = useState(initialData?.content || '')
  const [thumbnail, setThumbnail] = useState(initialData?.thumbnail || '')
  const [banner, setBanner] = useState(initialData?.banner || '')
  const [isActive, setIsActive] = useState(initialData?.is_active ?? true)
  const [isFeatured, setIsFeatured] = useState(initialData?.is_featured ?? false)
  const [uploadingThumb, setUploadingThumb] = useState(false)
  const [uploadingBanner, setUploadingBanner] = useState(false)
  const [autoSlug, setAutoSlug] = useState(!initialData?.slug)

  const handleTitleChange = (val: string) => {
    setTitle(val)
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
      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData })
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

  return (
    <form action={formAction} className="w-full space-y-6 pb-12">
      {/* Top Header Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/contents"
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            title="Quay lại danh sách"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              {initialData?.id ? 'Chỉnh sửa bài viết' : 'Soạn thảo bài viết mới'}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              {initialData ? initialData.title : 'Tin tức công nghệ, bài viết chuyên sâu & giải pháp'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          <Link
            href="/admin/contents"
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
                <span>Lưu bài viết</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Global Error Banner */}
      {state?.errors?._root && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm font-medium">
          {state.errors._root.join(', ')}
        </div>
      )}

      {/* 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card: Basic Info */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Tiêu đề bài viết <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="VD: Tổng quan kiến trúc mạng Core Switch và giải pháp dự phòng..."
                required
                className={`${inputCls} text-base font-bold`}
              />
              {state?.errors?.title && (
                <p className="text-xs text-rose-500 mt-1 font-medium">{state.errors.title[0]}</p>
              )}
            </div>

            {/* Slug */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Đường dẫn tĩnh (Slug) <span className="text-rose-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setSlug(slugify(title))}
                  className="text-[11px] text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" /> Tự tạo slug
                </button>
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-400">
                  /tin-tuc/
                </span>
                <input
                  type="text"
                  name="slug"
                  value={slug}
                  onChange={(e) => {
                    setSlug(e.target.value)
                    setAutoSlug(false)
                  }}
                  required
                  className={`${inputCls} pl-20 font-mono text-xs`}
                />
              </div>
              {state?.errors?.slug && (
                <p className="text-xs text-rose-500 mt-1 font-medium">{state.errors.slug[0]}</p>
              )}
            </div>

            {/* Summary */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Tóm tắt ngắn (Trích dẫn)
              </label>
              <textarea
                name="summary"
                rows={3}
                defaultValue={initialData?.summary || ''}
                placeholder="Đoạn trích tóm lược 2-3 câu hiển thị trên danh sách bài viết & thẻ xem trước..."
                className={`${inputCls} resize-none`}
              />
            </div>
          </div>

          {/* Card: Rich Text Content */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Nội dung chi tiết bài viết
                </h2>
              </div>
              <span className="text-[11px] text-slate-400 font-medium">Hỗ trợ WYSIWYG & HTML</span>
            </div>

            <input type="hidden" name="content" value={contentHtml} />
            <TiptapEditor
              content={contentHtml}
              onChange={(html) => setContentHtml(html)}
            />
          </div>

          {/* Card: SEO */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <div className="pb-3 border-b border-slate-100 flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-600" />
              <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Tối ưu hóa tìm kiếm (SEO)
              </h2>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">SEO Title</label>
              <input
                type="text"
                name="seo_title"
                defaultValue={initialData?.seo_title || ''}
                placeholder="Mặc định lấy tiêu đề bài viết..."
                className={inputCls}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">SEO Description</label>
              <textarea
                name="seo_description"
                rows={2}
                defaultValue={initialData?.seo_description || ''}
                placeholder="Mô tả meta ngắn 140-160 ký tự cho công cụ tìm kiếm..."
                className={`${inputCls} resize-none`}
              />
            </div>
          </div>
        </div>

        {/* Right Column (1 Col) */}
        <div className="space-y-6">
          {/* Classification */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider pb-2 border-b border-slate-100">
              Phân loại & Xuất bản
            </h2>

            {/* Type */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Loại nội dung</label>
              <div className="relative">
                <select
                  name="type"
                  value={type}
                  onChange={(e) => setType(e.target.value as ContentType)}
                  className={selectCls}
                >
                  <option value="news">Tin tức sự kiện</option>
                  <option value="blog">Kiến thức kỹ thuật</option>
                  <option value="case_study">Dự án tiêu biểu</option>
                  <option value="banner">Banner trang chủ</option>
                  <option value="promotion">Chương trình khuyến mãi</option>
                </select>
                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Chuyên mục</label>
              <input
                type="text"
                name="category"
                defaultValue={initialData?.category || ''}
                placeholder="VD: Hạ tầng mạng, Giải pháp..."
                className={inputCls}
              />
            </div>

            {/* Author */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Tác giả bài viết</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="author"
                  defaultValue={initialData?.author || 'Ban biên tập GTS'}
                  className={`${inputCls} pl-10`}
                />
              </div>
            </div>

            {/* Published At */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Ngày xuất bản</label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="date"
                  name="published_at"
                  defaultValue={
                    initialData?.published_at
                      ? new Date(initialData.published_at).toISOString().split('T')[0]
                      : new Date().toISOString().split('T')[0]
                  }
                  className={`${inputCls} pl-10`}
                />
              </div>
            </div>

            {/* Sort Order */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Thứ tự sắp xếp</label>
              <input
                type="number"
                name="sort_order"
                defaultValue={initialData?.sort_order ?? 0}
                className={`${inputCls} font-mono`}
              />
            </div>
          </div>

          {/* Thumbnail Image */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <ImageIcon className="w-4 h-4 text-blue-600" />
              <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Hình ảnh đại diện
              </h2>
            </div>

            <div>
              <input type="hidden" name="thumbnail" value={thumbnail} />
              <div className="flex items-center gap-3">
                <div className="w-20 h-16 rounded-xl border border-slate-200 bg-slate-50 relative overflow-hidden flex items-center justify-center flex-shrink-0">
                  {thumbnail ? (
                    <Image src={thumbnail} alt="Thumbnail" fill className="object-cover" sizes="80px" />
                  ) : (
                    <ImageIcon className="w-5 h-5 text-slate-300" />
                  )}
                </div>
                <div className="flex-1 space-y-1.5">
                  <input
                    type="file"
                    accept="image/*"
                    id="content-thumb-file"
                    onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'thumb')}
                    disabled={uploadingThumb}
                    className="hidden"
                  />
                  <label
                    htmlFor="content-thumb-file"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer transition-colors"
                  >
                    {uploadingThumb && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>{uploadingThumb ? 'Đang tải...' : 'Tải ảnh lên'}</span>
                  </label>
                  <input
                    type="text"
                    value={thumbnail}
                    onChange={(e) => setThumbnail(e.target.value)}
                    placeholder="URL ảnh..."
                    className="w-full px-2.5 py-1 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Status Switches */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider pb-2 border-b border-slate-100">
              Trạng thái & Ghim nổi bật
            </h2>

            {/* Is Active */}
            <input type="hidden" name="is_active" value={String(isActive)} />
            <div
              onClick={() => setIsActive(!isActive)}
              className={`flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer ${
                isActive
                  ? 'border-emerald-200 bg-emerald-50/50'
                  : 'border-slate-200 bg-slate-50/50'
              }`}
            >
              <div>
                <div className="text-xs font-bold text-slate-800">
                  {isActive ? 'Đang hiển thị' : 'Đang tạm ẩn'}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  {isActive ? 'Công khai trên website' : 'Chỉ lưu trong hệ thống'}
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

            {/* Is Featured */}
            <input type="hidden" name="is_featured" value={String(isFeatured)} />
            <div
              onClick={() => setIsFeatured(!isFeatured)}
              className={`flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer ${
                isFeatured
                  ? 'border-amber-200 bg-amber-50/50'
                  : 'border-slate-200 bg-slate-50/50'
              }`}
            >
              <div>
                <div className="text-xs font-bold text-slate-800">
                  {isFeatured ? 'Bài viết nổi bật' : 'Bình thường'}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  {isFeatured ? 'Ghim lên mục tiêu điểm trang chủ' : 'Hiển thị theo ngày đăng'}
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
          </div>
        </div>
      </div>
    </form>
  )
}
