'use client'

import { useState, useTransition } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  Plus, Edit2, Trash2, Globe, Sparkles, X, Loader2,
  Tag, ExternalLink, Package, Search
} from 'lucide-react'
import { useToast } from '@/components/admin/ui/Toast'
import { ConfirmDialog } from '@/components/admin/ui/ConfirmDialog'
import { slugify } from '@/lib/utils'
import { createBrandAction, updateBrandAction } from '../actions'

interface BrandItem {
  id: string
  name: string
  slug: string
  logo: string | null
  country: string | null
  website: string | null
  description: string | null
  sort_order: number
  is_active: boolean
  product_count: number
}

interface BrandsClientProps {
  initialBrands: BrandItem[]
}

export function BrandsClient({ initialBrands }: BrandsClientProps) {
  const router = useRouter()
  const { success, error } = useToast()
  const [isPending, startTransition] = useTransition()

  const [search, setSearch] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<BrandItem | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingBrand, setEditingBrand] = useState<BrandItem | null>(null)

  // Form State
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [logo, setLogo] = useState('')
  const [country, setCountry] = useState('')
  const [website, setWebsite] = useState('')
  const [description, setDescription] = useState('')
  const [sortOrder, setSortOrder] = useState('0')
  const [isActive, setIsActive] = useState(true)
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const [formErrors, setFormErrors] = useState<Record<string, string[]>>({})

  const openCreateModal = () => {
    setEditingBrand(null)
    setName('')
    setSlug('')
    setLogo('')
    setCountry('')
    setWebsite('')
    setDescription('')
    setSortOrder('0')
    setIsActive(true)
    setFormErrors({})
    setModalOpen(true)
  }

  const openEditModal = (b: BrandItem) => {
    setEditingBrand(b)
    setName(b.name)
    setSlug(b.slug)
    setLogo(b.logo || '')
    setCountry(b.country || '')
    setWebsite(b.website || '')
    setDescription(b.description || '')
    setSortOrder(String(b.sort_order))
    setIsActive(b.is_active)
    setFormErrors({})
    setModalOpen(true)
  }

  const handleNameChange = (val: string) => {
    setName(val)
    if (!editingBrand) {
      setSlug(slugify(val))
    }
  }

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingLogo(true)
    const formData = new FormData()
    formData.append('file', file)
    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      if (data.url) {
        setLogo(data.url)
        success('Thành công', 'Đã tải ảnh logo lên')
      } else {
        error('Lỗi', 'Không thể tải ảnh logo')
      }
    } catch {
      error('Lỗi', 'Lỗi khi tải ảnh lên')
    } finally {
      setUploadingLogo(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('name', name)
    formData.append('slug', slug)
    formData.append('logo', logo)
    formData.append('country', country)
    formData.append('website', website)
    formData.append('description', description)
    formData.append('sort_order', sortOrder)
    formData.append('is_active', String(isActive))

    startTransition(async () => {
      let res
      if (editingBrand) {
        res = await updateBrandAction(editingBrand.id, null, formData)
      } else {
        res = await createBrandAction(null, formData)
      }

      if (res.success) {
        success('Thành công', res.message || 'Đã lưu hãng sản xuất')
        setModalOpen(false)
        router.refresh()
      } else if (res.errors) {
        setFormErrors(res.errors)
        if (res.errors._root) {
          error('Lỗi', res.errors._root[0])
        }
      }
    })
  }

  const handleDelete = () => {
    if (!deleteTarget) return
    startTransition(async () => {
      const res = await fetch(`/api/v2/admin/brands/${deleteTarget.id}`, { method: 'DELETE' })
      if (res.ok) {
        success('Đã xóa', `Đã xóa hãng "${deleteTarget.name}"`)
        router.refresh()
      } else {
        error('Lỗi', 'Không thể xóa hãng (có sản phẩm đang sử dụng)')
      }
      setDeleteTarget(null)
    })
  }

  const filteredBrands = initialBrands.filter((b) => {
    const q = search.toLowerCase()
    return (
      b.name.toLowerCase().includes(q) ||
      b.slug.toLowerCase().includes(q) ||
      (b.country && b.country.toLowerCase().includes(q))
    )
  })

  return (
    <div className="flex flex-col gap-12">
      {/* Header and Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Hãng sản xuất</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {initialBrands.length} thương hiệu đối tác công nghiệp
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-md shadow-blue-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm hãng mới</span>
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
        <Search className="w-4 h-4 text-gray-400 ml-2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm kiếm theo tên hãng, quốc gia, slug..."
          className="w-full text-sm outline-none bg-transparent placeholder-gray-400"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="text-xs text-gray-400 hover:text-gray-600 px-2 py-1"
          >
            Xóa
          </button>
        )}
      </div>

      {/* Brands Table */}
      <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden ${isPending ? 'opacity-60' : ''}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Logo & Tên hãng</th>
                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Slug</th>
                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Quốc gia / Website</th>
                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Thứ tự</th>
                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Số sản phẩm</th>
                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Trạng thái</th>
                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredBrands.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50/60 transition-colors group">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl border border-gray-100 bg-white flex items-center justify-center p-1 overflow-hidden relative flex-shrink-0 shadow-xs">
                        {b.logo ? (
                          <Image src={b.logo} alt={b.name} fill className="object-contain p-1" sizes="40px" />
                        ) : (
                          <Tag className="w-4 h-4 text-gray-300" />
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{b.name}</div>
                        {b.description && (
                          <div className="text-xs text-gray-400 line-clamp-1 max-w-xs">{b.description}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="font-mono text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                      {b.slug}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-xs">
                    {b.country && (
                      <span className="inline-block px-2 py-0.5 bg-blue-50 text-blue-700 font-medium rounded-md mb-1">
                        {b.country}
                      </span>
                    )}
                    {b.website && (
                      <div>
                        <a
                          href={b.website}
                          target="_blank"
                          rel="noreferrer"
                          className="text-gray-400 hover:text-blue-600 inline-flex items-center gap-1 font-mono text-[11px]"
                        >
                          <Globe className="w-3 h-3" />
                          <span className="truncate max-w-[150px]">{b.website.replace(/^https?:\/\//, '')}</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </div>
                    )}
                    {!b.country && !b.website && <span className="text-gray-300">—</span>}
                  </td>
                  <td className="px-5 py-3.5 text-center font-mono text-xs text-gray-500">
                    {b.sort_order}
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    <div className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-gray-50 text-xs font-semibold text-gray-700">
                      <Package className="w-3 h-3 text-gray-400" />
                      <span>{b.product_count}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    <span
                      className={`inline-block px-2 py-0.5 text-[10px] font-bold rounded-full ${
                        b.is_active
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {b.is_active ? 'Hiện' : 'Ẩn'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openEditModal(b)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        title="Chỉnh sửa"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(b)}
                        disabled={b.product_count > 0}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        title={b.product_count > 0 ? 'Có sản phẩm đang liên kết' : 'Xóa hãng'}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredBrands.length === 0 && (
          <div className="py-20 text-center text-gray-400 text-sm">Không tìm thấy hãng nào</div>
        )}
      </div>

      {/* Modal Create / Edit */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-900 text-base">
                {editingBrand ? `Chỉnh sửa: ${editingBrand.name}` : 'Thêm hãng sản xuất mới'}
              </h2>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              {/* Name */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Tên hãng <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="VD: ARI Armaturen, KSB, Samson..."
                  required
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-blue-500"
                />
                {formErrors.name && (
                  <p className="text-xs text-red-500 mt-1">{formErrors.name[0]}</p>
                )}
              </div>

              {/* Slug */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-gray-700">
                    Slug <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setSlug(slugify(name))}
                    className="text-[11px] text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" /> Tự tạo
                  </button>
                </div>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  required
                  className="w-full px-3.5 py-2 text-sm font-mono rounded-xl border border-gray-200 focus:outline-none focus:border-blue-500"
                />
                {formErrors.slug && (
                  <p className="text-xs text-red-500 mt-1">{formErrors.slug[0]}</p>
                )}
              </div>

              {/* Logo Upload */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Logo hãng</label>
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-center relative overflow-hidden flex-shrink-0">
                    {logo ? (
                      <Image src={logo} alt="Preview" fill className="object-contain p-1" sizes="56px" />
                    ) : (
                      <Tag className="w-5 h-5 text-gray-300" />
                    )}
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <input
                      type="file"
                      accept="image/*"
                      id="brand-logo-file"
                      onChange={handleLogoUpload}
                      disabled={uploadingLogo}
                      className="hidden"
                    />
                    <label
                      htmlFor="brand-logo-file"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 cursor-pointer"
                    >
                      {uploadingLogo && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                      <span>{uploadingLogo ? 'Đang tải...' : 'Tải file logo lên'}</span>
                    </label>
                    <input
                      type="text"
                      value={logo}
                      onChange={(e) => setLogo(e.target.value)}
                      placeholder="Hoặc dán URL logo trực tiếp..."
                      className="w-full px-2.5 py-1 text-xs rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Country & Website in 2 cols */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Xuất xứ / Quốc gia</label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="VD: Đức, Nhật Bản, Ý..."
                    className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Website chính thức</label>
                  <input
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Mô tả ngắn</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  placeholder="Giới thiệu nhanh về thương hiệu..."
                  className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>

              {/* Sort order & Is active */}
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-100">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Thứ tự ưu tiên</label>
                  <input
                    type="number"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="w-full px-3 py-2 text-sm font-mono rounded-xl border border-gray-200 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="flex flex-col justify-center">
                  <label className="block text-xs font-bold text-gray-700 mb-1">Trạng thái</label>
                  <label className="flex items-center gap-2 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <span className="text-xs font-medium text-gray-700">Hiển thị hãng</span>
                  </label>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 text-xs font-semibold rounded-xl transition-all shadow-md shadow-blue-500/20 disabled:opacity-60"
                >
                  {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingBrand ? 'Lưu thay đổi' : 'Thêm hãng'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      <ConfirmDialog
        open={!!deleteTarget}
        title="Xóa hãng sản xuất?"
        message={`Bạn có chắc chắn muốn xóa hãng "${deleteTarget?.name}"? Thao tác này không thể hoàn tác.`}
        confirmLabel="Xóa hãng"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
