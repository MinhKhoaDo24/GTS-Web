'use client'

import { useState, useTransition } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  Plus, Edit2, Trash2, Layers, Search, X, Loader2,
  Package, Tag, Image as ImageIcon, CheckCircle2,
  AlertCircle, Upload, ArrowUpDown
} from 'lucide-react'
import { useToast } from '@/components/admin/ui/Toast'
import { ConfirmDialog } from '@/components/admin/ui/ConfirmDialog'
import { slugify } from '@/lib/utils'
import { createFamilyAction, updateFamilyAction, deleteFamilyAction } from '../actions'
import type { ProductFamilyItem } from '@/lib/dal/product-families'

interface BrandOption {
  id: string
  name: string
  logo?: string | null
}

interface FamiliesClientProps {
  initialFamilies: ProductFamilyItem[]
  brands: BrandOption[]
}

export function FamiliesClient({ initialFamilies, brands }: FamiliesClientProps) {
  const router = useRouter()
  const { success, error } = useToast()
  const [isPending, startTransition] = useTransition()

  const [search, setSearch] = useState('')
  const [selectedBrand, setSelectedBrand] = useState<string>('all')
  const [deleteTarget, setDeleteTarget] = useState<ProductFamilyItem | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingFamily, setEditingFamily] = useState<ProductFamilyItem | null>(null)

  // Form State
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [brandId, setBrandId] = useState('')
  const [image, setImage] = useState('')
  const [description, setDescription] = useState('')
  const [sortOrder, setSortOrder] = useState('0')
  const [isActive, setIsActive] = useState(true)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [formErrors, setFormErrors] = useState<Record<string, string[]>>({})

  const openCreateModal = () => {
    setEditingFamily(null)
    setName('')
    setSlug('')
    setBrandId(brands[0]?.id || '')
    setImage('')
    setDescription('')
    setSortOrder('0')
    setIsActive(true)
    setFormErrors({})
    setModalOpen(true)
  }

  const openEditModal = (f: ProductFamilyItem) => {
    setEditingFamily(f)
    setName(f.name)
    setSlug(f.slug)
    setBrandId(f.brand_id || '')
    setImage(f.image || '')
    setDescription(f.description || '')
    setSortOrder(String(f.sort_order ?? 0))
    setIsActive(f.is_active)
    setFormErrors({})
    setModalOpen(true)
  }

  const handleNameChange = (val: string) => {
    setName(val)
    if (!editingFamily) {
      setSlug(slugify(val))
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingImage(true)
    const formData = new FormData()
    formData.append('file', file)
    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      if (res.ok && data.url) {
        setImage(data.url)
        success('Đã tải ảnh lên', 'Ảnh đã được lưu thành công')
      } else {
        error('Lỗi tải ảnh', data.error || 'Không thể upload ảnh')
      }
    } catch {
      error('Lỗi kết nối', 'Không thể gửi ảnh lên server')
    } finally {
      setUploadingImage(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormErrors({})

    const formData = new FormData()
    formData.append('name', name.trim())
    formData.append('slug', slug.trim())
    formData.append('brand_id', brandId)
    formData.append('image', image.trim())
    formData.append('description', description.trim())
    formData.append('sort_order', sortOrder)
    formData.append('is_active', isActive ? 'true' : 'false')

    startTransition(async () => {
      let res
      if (editingFamily) {
        res = await updateFamilyAction(editingFamily.id, null, formData)
      } else {
        res = await createFamilyAction(null, formData)
      }

      if (res.success) {
        success('Thành công', res.message || 'Đã lưu dòng sản phẩm')
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
      const res = await deleteFamilyAction(deleteTarget.id)
      if (res.success) {
        success('Đã xóa', `Đã xóa dòng sản phẩm "${deleteTarget.name}"`)
        router.refresh()
      } else {
        error('Lỗi', res.message || 'Không thể xóa dòng sản phẩm')
      }
      setDeleteTarget(null)
    })
  }

  const filteredFamilies = initialFamilies.filter((f) => {
    const q = search.toLowerCase()
    const matchesSearch =
      f.name.toLowerCase().includes(q) ||
      f.slug.toLowerCase().includes(q) ||
      (f.brand_name && f.brand_name.toLowerCase().includes(q)) ||
      (f.description && f.description.toLowerCase().includes(q))

    const matchesBrand = selectedBrand === 'all' || f.brand_id === selectedBrand

    return matchesSearch && matchesBrand
  })

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Dòng sản phẩm (Series)
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Phân loại các dòng/chuỗi thiết bị theo hãng sản xuất (VD: Cisco Catalyst 9300, FortiGate 60F...)
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-all hover:shadow-blue-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm dòng sản phẩm</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo tên dòng, hãng..."
              className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Brand Filter */}
          <div className="relative w-full sm:w-56">
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all cursor-pointer"
            >
              <option value="all">Tất cả thương hiệu ({brands.length})</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="text-xs text-slate-500 font-medium self-end sm:self-auto">
          Hiển thị <span className="font-bold text-slate-800">{filteredFamilies.length}</span> / {initialFamilies.length} dòng
        </div>
      </div>

      {/* Families Table */}
      {filteredFamilies.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-12 text-center">
          <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 mx-auto mb-3">
            <Layers className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">Không tìm thấy dòng sản phẩm nào</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {search || selectedBrand !== 'all'
              ? 'Thử thay đổi bộ lọc tìm kiếm hoặc hãng sản xuất.'
              : 'Chưa có dòng sản phẩm nào được tạo. Hãy nhấn "Thêm dòng sản phẩm" để bắt đầu.'}
          </p>
          {!search && selectedBrand === 'all' && (
            <button
              onClick={openCreateModal}
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-xl hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Thêm dòng sản phẩm đầu tiên
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/75 border-b border-slate-100 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-5 py-3.5">Dòng sản phẩm</th>
                  <th className="px-5 py-3.5">Hãng sản xuất</th>
                  <th className="px-5 py-3.5">Mô tả</th>
                  <th className="px-5 py-3.5 text-center">Sản phẩm</th>
                  <th className="px-5 py-3.5 text-center">Thứ tự</th>
                  <th className="px-5 py-3.5 text-center">Trạng thái</th>
                  <th className="px-5 py-3.5 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredFamilies.map((fam) => (
                  <tr key={fam.id} className="hover:bg-slate-50/70 transition-colors group">
                    {/* Name & Image */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200/80 flex items-center justify-center flex-shrink-0 overflow-hidden">
                          {fam.image ? (
                            <Image
                              src={fam.image}
                              alt={fam.name}
                              width={40}
                              height={40}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Layers className="w-5 h-5 text-slate-400" />
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                            {fam.name}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                            {fam.slug}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Brand */}
                    <td className="px-5 py-4">
                      {fam.brand_name ? (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium">
                          {fam.brand_logo && (
                            <Image
                              src={fam.brand_logo}
                              alt={fam.brand_name}
                              width={14}
                              height={14}
                              className="w-3.5 h-3.5 object-contain"
                            />
                          )}
                          <span>{fam.brand_name}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Chưa gắn hãng</span>
                      )}
                    </td>

                    {/* Description */}
                    <td className="px-5 py-4 max-w-xs">
                      <p className="text-slate-600 truncate" title={fam.description || ''}>
                        {fam.description || <span className="text-slate-300">—</span>}
                      </p>
                    </td>

                    {/* Products Count */}
                    <td className="px-5 py-4 text-center">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-100">
                        <Package className="w-3 h-3" />
                        {fam.product_count}
                      </span>
                    </td>

                    {/* Sort Order */}
                    <td className="px-5 py-4 text-center">
                      <span className="font-mono text-slate-500 font-medium">
                        {fam.sort_order ?? 0}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4 text-center">
                      {fam.is_active ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3" />
                          Hoạt động
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full">
                          <AlertCircle className="w-3 h-3" />
                          Đang ẩn
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 text-right">
                      <div className="inline-flex items-center gap-1 opacity-90 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openEditModal(fam)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                          title="Chỉnh sửa"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(fam)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Xóa"
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
        </div>
      )}

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => setModalOpen(false)}
          />

          <div className="relative bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Layers className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {editingFamily ? 'Chỉnh sửa Dòng sản phẩm' : 'Thêm Dòng sản phẩm mới'}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {editingFamily ? `Mã: ${editingFamily.id}` : 'Nhập thông tin chuỗi/dòng thiết bị'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              {/* Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tên dòng sản phẩm <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="VD: Catalyst 9300 Series, FortiGate..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all"
                />
                {formErrors.name && (
                  <p className="text-[11px] text-rose-500 mt-1">{formErrors.name[0]}</p>
                )}
              </div>

              {/* Slug */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Đường dẫn tĩnh (Slug) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="catalyst-9300-series"
                  className="w-full px-3.5 py-2 text-xs font-mono rounded-xl border border-slate-200 focus:outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all"
                />
                {formErrors.slug && (
                  <p className="text-[11px] text-rose-500 mt-1">{formErrors.slug[0]}</p>
                )}
              </div>

              {/* Brand Select */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Hãng sản xuất (Thương hiệu)
                </label>
                <select
                  value={brandId}
                  onChange={(e) => setBrandId(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all"
                >
                  <option value="">— Không chọn (Chung) —</option>
                  {brands.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Image */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Ảnh đại diện / Banner dòng sản phẩm
                </label>
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="URL ảnh hoặc upload..."
                    className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all"
                  />
                  <label className="cursor-pointer inline-flex items-center gap-1 px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors">
                    {uploadingImage ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Upload className="w-3.5 h-3.5" />
                    )}
                    <span>Tải ảnh</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                  </label>
                </div>
                {image && (
                  <div className="mt-2 w-14 h-14 rounded-xl border border-slate-200 overflow-hidden bg-slate-50 flex items-center justify-center relative group">
                    <Image
                      src={image}
                      alt="Preview"
                      width={56}
                      height={56}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setImage('')}
                      className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mô tả giới thiệu
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Giới thiệu về dòng sản phẩm này..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all resize-none"
                />
              </div>

              {/* Sort Order & Active */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Thứ tự sắp xếp
                  </label>
                  <input
                    type="number"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs font-mono rounded-xl border border-slate-200 focus:outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Trạng thái hiển thị
                  </label>
                  <div
                    onClick={() => setIsActive(!isActive)}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl border cursor-pointer transition-all ${
                      isActive
                        ? 'border-emerald-200 bg-emerald-50/50 text-emerald-800'
                        : 'border-slate-200 bg-slate-50 text-slate-600'
                    }`}
                  >
                    <span className="text-xs font-semibold">
                      {isActive ? 'Kích hoạt' : 'Ẩn'}
                    </span>
                    <div
                      className={`w-7 h-4 rounded-full transition-colors relative ${
                        isActive ? 'bg-emerald-500' : 'bg-slate-300'
                      }`}
                    >
                      <span
                        className={`block w-3 h-3 rounded-full bg-white transition-transform mt-0.5 ${
                          isActive ? 'translate-x-3.5' : 'translate-x-0.5'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-semibold rounded-xl text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold rounded-xl text-white bg-blue-600 hover:bg-blue-700 shadow-xs transition-all disabled:opacity-60"
                >
                  {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingFamily ? 'Lưu thay đổi' : 'Tạo dòng sản phẩm'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteTarget}
        title="Xóa dòng sản phẩm?"
        message={`Bạn có chắc muốn xóa dòng sản phẩm "${deleteTarget?.name}"? Các sản phẩm thuộc dòng này sẽ được chuyển về không thuộc dòng nào.`}
        confirmLabel="Xóa dòng sản phẩm"
        danger={true}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
