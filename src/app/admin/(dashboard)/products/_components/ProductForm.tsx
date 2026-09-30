'use client'

import { useActionState, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Save, ArrowLeft, Loader2, AlertCircle, Image as ImageIcon,
  Globe, Star, Eye, EyeOff, Package, ChevronDown, Sparkles, Layers
} from 'lucide-react'
import { TiptapEditor } from '@/components/admin/TiptapEditor'
import { ImageUploader } from '@/components/admin/ImageUploader'
import { useToast } from '@/components/admin/ui/Toast'
import { slugify } from '@/lib/utils'

// ─── Types ───────────────────────────────────────────────────────────────────

interface Brand { id: string; name: string }
interface Category { id: string; name: string; parent_id?: string | null }

interface ProductFormProps {
  action: (prev: any, formData: FormData) => Promise<any>
  brands: Brand[]
  categories: Category[]
  defaultValues?: {
    id?: string
    name?: string
    slug?: string
    model?: string | null
    brand_id?: string
    category_id?: string
    product_type?: string
    short_description?: string | null
    description?: string | null
    thumbnail?: string | null
    is_active?: boolean
    is_featured?: boolean
    seo_title?: string | null
    seo_description?: string | null
    variant_sku?: string
    variant_part_number?: string
    variant_specs_summary?: string
  }
  mode: 'create' | 'edit'
}

// ─── Form Field Helper ────────────────────────────────────────────────────────

function Field({
  label, name, required, error, children, hint,
}: {
  label: string; name?: string; required?: boolean; error?: string
  children: React.ReactNode; hint?: string
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={name} className="block text-xs font-semibold text-slate-700">
        {label}
        {required && <span className="text-rose-500 ml-1">*</span>}
      </label>
      {children}
      {hint && <p className="text-[11px] text-slate-400">{hint}</p>}
      {error && (
        <p className="text-[11px] text-rose-500 flex items-center gap-1 font-medium">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{error}</span>
        </p>
      )}
    </div>
  )
}

const inputCls = 'w-full text-sm bg-slate-50/50 hover:bg-slate-50/80 focus:bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium'
const selectCls = 'w-full text-sm bg-slate-50/50 hover:bg-slate-50/80 focus:bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all appearance-none cursor-pointer font-medium'

export function ProductForm({ action, brands, categories, defaultValues = {}, mode }: ProductFormProps) {
  const router = useRouter()
  const { error: toastError } = useToast()

  const [state, formAction, isPending] = useActionState(action, null)

  const [name, setName] = useState(defaultValues.name ?? '')
  const [slug, setSlug] = useState(defaultValues.slug ?? '')
  const [slugManual, setSlugManual] = useState(Boolean(defaultValues.slug))
  const [description, setDescription] = useState(defaultValues.description ?? '')
  const [isActive, setIsActive] = useState(defaultValues.is_active ?? true)
  const [isFeatured, setIsFeatured] = useState(defaultValues.is_featured ?? false)
  const [thumbnail, setThumbnail] = useState<string[]>(
    defaultValues.thumbnail ? [defaultValues.thumbnail] : []
  )

  useEffect(() => {
    if (state?.success === false && state.errors?._root) {
      toastError('Có lỗi xảy ra', state.errors._root[0])
    }
  }, [state, toastError])

  const handleNameChange = (val: string) => {
    setName(val)
    if (!slugManual) {
      setSlug(slugify(val))
    }
  }

  const errors = state?.errors ?? {}

  return (
    <form action={formAction} className="space-y-6">
      {/* Top Header & Actions Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            title="Quay lại danh sách"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              {mode === 'create' ? 'Thêm sản phẩm mới' : 'Chỉnh sửa sản phẩm'}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              {mode === 'create'
                ? 'Nhập thông tin sản phẩm và phân loại thiết bị phần cứng'
                : defaultValues.name || 'Cập nhật thông tin chi tiết của sản phẩm'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          <Link
            href="/admin/products"
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
                <span>{mode === 'create' ? 'Tạo sản phẩm' : 'Lưu thay đổi'}</span>
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
            <p className="text-sm font-semibold">Không thể lưu sản phẩm</p>
            <p className="text-xs text-rose-600 mt-0.5">{errors._root[0]}</p>
          </div>
        </div>
      )}

      {/* 2-Column Responsive Form Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card: Thông tin cơ bản */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
              <Package className="w-4 h-4 text-blue-600" />
              <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Thông tin cơ bản
              </h2>
            </div>
            <div className="p-6 space-y-5">
              {/* Product Name */}
              <Field label="Tên sản phẩm" name="name" required error={errors.name?.[0]}>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="VD: Switch Cisco Catalyst C9300-24T-A"
                  className={inputCls}
                  required
                />
              </Field>

              {/* Slug */}
              <Field
                label="Đường dẫn tĩnh (Slug)"
                name="slug"
                required
                error={errors.slug?.[0]}
                hint="Được tự động tạo từ tên sản phẩm để tối ưu URL & SEO"
              >
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-400">
                    /san-pham/
                  </span>
                  <input
                    id="slug"
                    name="slug"
                    type="text"
                    value={slug}
                    onChange={(e) => {
                      setSlug(e.target.value)
                      setSlugManual(true)
                    }}
                    placeholder="switch-cisco-catalyst-c9300-24t-a"
                    className={`${inputCls} pl-24 font-mono text-xs`}
                    required
                  />
                  {!slugManual && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] bg-blue-50 text-blue-600 font-semibold px-2 py-0.5 rounded-md border border-blue-100">
                      Tự động
                    </span>
                  )}
                </div>
              </Field>

              {/* Model */}
              <Field label="Mã Model thiết bị" name="model" error={errors.model?.[0]}>
                <input
                  id="model"
                  name="model"
                  type="text"
                  defaultValue={defaultValues.model ?? ''}
                  placeholder="VD: C9300-24T-A"
                  className={`${inputCls} font-mono`}
                />
              </Field>

              {/* Brand & Category in 2 cols */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Hãng sản xuất" name="brand_id" required error={errors.brand_id?.[0]}>
                  <div className="relative">
                    <select
                      id="brand_id"
                      name="brand_id"
                      defaultValue={defaultValues.brand_id ?? ''}
                      className={selectCls}
                      required
                    >
                      <option value="">— Chọn thương hiệu —</option>
                      {brands.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </Field>

                <Field label="Danh mục sản phẩm" name="category_id" required error={errors.category_id?.[0]}>
                  <div className="relative">
                    <select
                      id="category_id"
                      name="category_id"
                      defaultValue={defaultValues.category_id ?? ''}
                      className={selectCls}
                      required
                    >
                      <option value="">— Chọn nhóm danh mục —</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.parent_id ? `↳ ${c.name}` : c.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </Field>
              </div>

              {/* Product Type */}
              <Field label="Loại sản phẩm" name="product_type">
                <div className="relative">
                  <select
                    id="product_type"
                    name="product_type"
                    defaultValue={defaultValues.product_type ?? 'hardware'}
                    className={selectCls}
                  >
                    <option value="hardware">Phần cứng (Hardware)</option>
                    <option value="license">Giấy phép phần mềm (License)</option>
                    <option value="service">Dịch vụ kỹ thuật (Service)</option>
                    <option value="spare_part">Linh kiện thay thế (Spare Part)</option>
                    <option value="accessory">Phụ kiện kết nối (Accessory)</option>
                  </select>
                  <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </Field>
            </div>
          </div>

          {/* Card: Mô tả chi tiết */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Mô tả & Giới thiệu thiết bị
              </h2>
              <span className="text-[11px] text-slate-400 font-medium">Hỗ trợ định dạng Rich-text</span>
            </div>
            <div className="p-6 space-y-5">
              <Field label="Tóm tắt ngắn (Trích dẫn hiển thị ở thẻ danh mục)" name="short_description">
                <textarea
                  id="short_description"
                  name="short_description"
                  rows={3}
                  defaultValue={defaultValues.short_description ?? ''}
                  placeholder="Mô tả tóm tắt 2-3 câu làm nổi bật đặc tính quan trọng của thiết bị..."
                  className={`${inputCls} resize-none`}
                />
              </Field>

              <Field label="Nội dung chi tiết & Bài viết giới thiệu sản phẩm">
                <input type="hidden" name="description" value={description} />
                <TiptapEditor
                  content={description}
                  onChange={(html) => setDescription(html)}
                />
              </Field>
            </div>
          </div>

          {/* Card: Thông số kỹ thuật & Phiên bản */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" />
              <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Phiên bản & Mã hàng kỹ thuật (Part Number)
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Mã SKU quản lý kho" name="variant_sku">
                  <input
                    id="variant_sku"
                    name="variant_sku"
                    type="text"
                    defaultValue={defaultValues.variant_sku ?? ''}
                    placeholder="VD: SKU-C9300-24T"
                    className={`${inputCls} font-mono text-xs`}
                  />
                </Field>

                <Field label="Mã Part Number nhà sản xuất" name="variant_part_number">
                  <input
                    id="variant_part_number"
                    name="variant_part_number"
                    type="text"
                    defaultValue={defaultValues.variant_part_number ?? ''}
                    placeholder="VD: C9300-24T-A"
                    className={`${inputCls} font-mono text-xs`}
                  />
                </Field>
              </div>

              <Field
                label="Tóm tắt thông số kỹ thuật chính"
                name="variant_specs_summary"
                hint="Hiển thị nhanh ở bảng thông số (VD: 24x 10/100/1000 Ethernet Ports, Network Essentials)"
              >
                <textarea
                  id="variant_specs_summary"
                  name="variant_specs_summary"
                  rows={2}
                  defaultValue={defaultValues.variant_specs_summary ?? ''}
                  placeholder="Thông số tóm lược kỹ thuật..."
                  className={`${inputCls} resize-none`}
                />
              </Field>
            </div>
          </div>

          {/* Card: SEO */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-600" />
              <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Tối ưu hóa tìm kiếm (SEO)
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <Field label="SEO Title" name="seo_title" hint="Mặc định sẽ sử dụng tên sản phẩm">
                <input
                  id="seo_title"
                  name="seo_title"
                  type="text"
                  defaultValue={defaultValues.seo_title ?? ''}
                  placeholder="Tiêu đề hiển thị trên kết quả tìm kiếm..."
                  className={inputCls}
                />
              </Field>

              <Field label="SEO Description" name="seo_description">
                <textarea
                  id="seo_description"
                  name="seo_description"
                  rows={2}
                  defaultValue={defaultValues.seo_description ?? ''}
                  placeholder="Mô tả meta ngắn gọn 140-160 ký tự cho Google..."
                  className={`${inputCls} resize-none`}
                />
              </Field>
            </div>
          </div>
        </div>

        {/* Right Column (1 Col) */}
        <div className="space-y-6">
          {/* Card: Trạng thái & Xuất bản */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Trạng thái hiển thị
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
                      {isActive ? 'Đang kích hoạt' : 'Đang ẩn'}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {isActive ? 'Khách hàng có thể tra cứu' : 'Ẩn khỏi danh mục ngoài'}
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
                      {isFeatured ? 'Sản phẩm nổi bật' : 'Bình thường'}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {isFeatured ? 'Ghim ưu tiên ở trang chủ' : 'Hiển thị theo thứ tự chung'}
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
            </div>
          </div>

          {/* Card: Ảnh đại diện */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-blue-600" />
              <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Ảnh đại diện sản phẩm
              </h2>
            </div>
            <div className="p-5">
              <input type="hidden" name="thumbnail" value={thumbnail[0] ?? ''} />
              <ImageUploader
                images={thumbnail}
                onChange={(imgs) => setThumbnail(imgs.slice(0, 1))}
              />
              <p className="text-[11px] text-slate-400 mt-2">
                Hỗ trợ PNG, JPG, WebP. Khuyến nghị tỷ lệ vuông 1:1.
              </p>
            </div>
          </div>

          {/* Card: Thao tác lưu */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-3">
            <button
              type="submit"
              disabled={isPending}
              className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl font-semibold text-sm transition-all shadow-xs disabled:opacity-60"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Đang lưu...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{mode === 'create' ? 'Tạo sản phẩm' : 'Lưu thay đổi'}</span>
                </>
              )}
            </button>
            <Link
              href="/admin/products"
              className="w-full inline-flex items-center justify-center gap-2 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-4 py-3 rounded-xl font-semibold text-xs transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Quay lại danh sách</span>
            </Link>
          </div>
        </div>
      </div>
    </form>
  )
}
