'use client'

import { useActionState, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Save, Loader2, Sparkles, FolderOpen, ChevronDown } from 'lucide-react'
import { slugify } from '@/lib/utils'

interface CategoryFormProps {
  initialData?: {
    id?: string
    name?: string
    slug?: string
    description?: string | null
    domain_id?: string | null
    parent_id?: string | null
    sort_order?: number
    is_active?: boolean
  }
  domains: Array<{ id: string; name: string }>
  parentCategories: Array<{ id: string; name: string }>
  action: (prev: any, formData: FormData) => Promise<any>
}

const inputCls = 'w-full text-sm bg-slate-50/50 hover:bg-slate-50/80 focus:bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium'
const selectCls = 'w-full text-sm bg-slate-50/50 hover:bg-slate-50/80 focus:bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all appearance-none cursor-pointer font-medium'

export function CategoryForm({
  initialData,
  domains,
  parentCategories,
  action,
}: CategoryFormProps) {
  const [state, formAction, isPending] = useActionState(action, null)

  const [name, setName] = useState(initialData?.name || '')
  const [slug, setSlug] = useState(initialData?.slug || '')
  const [isActive, setIsActive] = useState(initialData?.is_active ?? true)
  const [autoSlug, setAutoSlug] = useState(!initialData?.slug)

  const handleNameChange = (val: string) => {
    setName(val)
    if (autoSlug) {
      setSlug(slugify(val))
    }
  }

  const handleAutoSlug = () => {
    setSlug(slugify(name))
  }

  return (
    <form action={formAction} className="w-full space-y-6">
      {/* Top Header Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/categories"
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            title="Quay lại danh sách"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              {initialData ? `Chỉnh sửa: ${initialData.name}` : 'Thêm danh mục thiết bị mới'}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              {initialData ? 'Cập nhật phân cấp và cây phân loại sản phẩm' : 'Tạo mới nhóm sản phẩm trên catalog'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          <Link
            href="/admin/categories"
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
                <span>Lưu danh mục</span>
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

      {/* 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-5">
            <div className="pb-3 border-b border-slate-100 flex items-center gap-2">
              <FolderOpen className="w-4 h-4 text-blue-600" />
              <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Thông tin danh mục
              </h2>
            </div>

            {/* Category Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Tên danh mục <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="VD: Switch Chuyển Mạch, Router Doanh Nghiệp..."
                required
                className={inputCls}
              />
              {state?.errors?.name && (
                <p className="text-xs text-rose-500 mt-1 font-medium">{state.errors.name[0]}</p>
              )}
            </div>

            {/* Category Slug */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Đường dẫn tĩnh (Slug) <span className="text-rose-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={handleAutoSlug}
                  className="text-[11px] text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" /> Tự tạo từ tên
                </button>
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-400">
                  /san-pham/
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
                  className={`${inputCls} pl-24 font-mono text-xs`}
                />
              </div>
              {state?.errors?.slug && (
                <p className="text-xs text-rose-500 mt-1 font-medium">{state.errors.slug[0]}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Mô tả giới thiệu danh mục
              </label>
              <textarea
                name="description"
                rows={4}
                defaultValue={initialData?.description || ''}
                placeholder="Mô tả tóm tắt ứng dụng kỹ thuật và dải thiết bị thuộc nhóm danh mục này..."
                className={`${inputCls} resize-none`}
              />
            </div>
          </div>
        </div>

        {/* Sidebar Controls (1 Col) */}
        <div className="space-y-6">
          {/* Classification */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider pb-2 border-b border-slate-100">
              Phân cấp & Lĩnh vực
            </h2>

            {/* Domain */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Lĩnh vực / Domain
              </label>
              <div className="relative">
                <select
                  name="domain_id"
                  defaultValue={initialData?.domain_id || ''}
                  className={selectCls}
                >
                  <option value="">— Không chọn domain —</option>
                  {domains.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Parent Category */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Danh mục cấp trên (Cha)
              </label>
              <div className="relative">
                <select
                  name="parent_id"
                  defaultValue={initialData?.parent_id || ''}
                  className={selectCls}
                >
                  <option value="">— Là danh mục gốc (Level 1) —</option>
                  {parentCategories
                    .filter((p) => p.id !== initialData?.id)
                    .map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                </select>
                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Chọn danh mục cha nếu đây là nhóm thiết bị con.
              </p>
            </div>

            {/* Sort Order */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Thứ tự sắp xếp
              </label>
              <input
                type="number"
                name="sort_order"
                defaultValue={initialData?.sort_order ?? 0}
                className={`${inputCls} font-mono`}
              />
              <p className="text-[11px] text-slate-400 mt-1">Số nhỏ hơn sẽ hiển thị trước.</p>
            </div>
          </div>

          {/* Visibility Switch */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
              Trạng thái danh mục
            </h2>

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
                  {isActive ? 'Đang kích hoạt' : 'Đang tạm ẩn'}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  {isActive ? 'Hiển thị trên menu & catalog' : 'Ẩn khỏi điều hướng'}
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
          </div>
        </div>
      </div>
    </form>
  )
}
