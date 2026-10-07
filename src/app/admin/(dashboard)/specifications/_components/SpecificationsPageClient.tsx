'use client'

/**
 * SpecificationsPageClient — Trang Quản lý Thông số kỹ thuật
 *
 * Chức năng:
 *  1. Xem danh sách Nhóm thông số (SpecificationGroups) + Thông số (Specifications)
 *  2. Tạo Nhóm mới inline (không cần trang riêng)
 *  3. Tạo Thông số mới thuộc một nhóm (inline form)
 *  4. Toggle kích hoạt/ẩn từng thông số
 *  5. Xóa thông số hoặc nhóm (với xác nhận)
 *
 * Đây là nơi Admin định nghĩa "thư viện" thông số — cơ sở để
 * Dynamic Form tự sinh ra fields khi thêm/sửa sản phẩm.
 */

import { useCallback, useState } from 'react'
import {
  Plus, Trash2, ToggleLeft, ToggleRight, ChevronDown, ChevronRight,
  Settings2, Layers, AlertCircle, CheckCircle2, Loader2, Edit2,
  X, Save, Tag, Database, Info, Filter, Search,
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

type SpecDataType = 'number' | 'text' | 'boolean' | 'select' | 'range' | 'json'

interface SpecGroup {
  id: string
  name: string
  slug: string
  description: string | null
  sort_order: number
  is_active: boolean
}

interface Spec {
  id: string
  group_id: string
  group_name: string
  name: string
  slug: string
  data_type: SpecDataType
  unit: string | null
  description: string | null
  is_filterable: boolean
  is_searchable: boolean
  sort_order: number
  is_active: boolean
}

interface Props {
  initialGroups: SpecGroup[]
  initialSpecs: Spec[]
}

// ─── Constants ────────────────────────────────────────────────────────────────

const DATA_TYPE_LABELS: Record<SpecDataType, { label: string; color: string; desc: string }> = {
  text: {
    label: 'Văn bản',
    color: 'bg-blue-50 text-blue-700 border-blue-200',
    desc: 'Chuỗi ký tự tự do (VD: chuẩn giao tiếp, chứng nhận)',
  },
  number: {
    label: 'Số',
    color: 'bg-violet-50 text-violet-700 border-violet-200',
    desc: 'Giá trị số thập phân (VD: 24 cổng, 56 Gbps)',
  },
  boolean: {
    label: 'Có / Không',
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    desc: 'Giá trị đúng/sai (VD: Hỗ trợ PoE, Quạt tản nhiệt)',
  },
  select: {
    label: 'Lựa chọn',
    color: 'bg-amber-50 text-amber-700 border-amber-200',
    desc: 'Chọn từ danh sách định sẵn (VD: 720p / 1080p / 4K)',
  },
  range: {
    label: 'Khoảng',
    color: 'bg-orange-50 text-orange-700 border-orange-200',
    desc: 'Giá trị min–max (VD: nhiệt độ 0°C–45°C)',
  },
  json: {
    label: 'JSON',
    color: 'bg-slate-100 text-slate-600 border-slate-200',
    desc: 'Dữ liệu phức tạp dạng JSON / văn bản dài',
  },
}

const inputCls =
  'w-full text-sm bg-slate-50/50 hover:bg-slate-50/80 focus:bg-white border border-slate-200 ' +
  'rounded-xl px-3.5 py-2.5 text-slate-800 placeholder:text-slate-400 focus:outline-none ' +
  'focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all'

const selectCls =
  'w-full text-sm bg-slate-50/50 border border-slate-200 rounded-xl px-3.5 py-2.5 ' +
  'text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 ' +
  'transition-all appearance-none cursor-pointer'

// ─── Sub-component: Create Group Form ────────────────────────────────────────

function CreateGroupForm({ onCreated }: { onCreated: (group: SpecGroup) => void }) {
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [sortOrder, setSortOrder] = useState('0')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !slug.trim()) {
      setError('Tên và Slug là bắt buộc')
      return
    }
    setSaving(true)
    setError('')

    try {
      const res = await fetch('/api/v2/admin/specifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'group', name, slug, description: description || null, sort_order: Number(sortOrder) }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      onCreated({ id: data.id, name, slug, description: description || null, sort_order: Number(sortOrder), is_active: true })
      setName(''); setSlug(''); setDescription(''); setSortOrder('0')
      setOpen(false)
    } catch (e: any) {
      setError(e.message ?? 'Có lỗi xảy ra')
    } finally {
      setSaving(false)
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-3.5 py-2 rounded-xl transition-all"
      >
        <Plus className="w-3.5 h-3.5" />
        Thêm nhóm mới
      </button>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-blue-50/50 border border-blue-200 rounded-2xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-blue-800">Tạo Nhóm thông số mới</span>
        <button type="button" onClick={() => setOpen(false)}>
          <X className="w-4 h-4 text-slate-400 hover:text-slate-600" />
        </button>
      </div>

      {error && (
        <p className="text-xs text-rose-600 font-medium flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" /> {error}
        </p>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-[11px] font-semibold text-slate-600 block mb-1">Tên nhóm *</label>
          <input
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''))
            }}
            placeholder="VD: Kết nối mạng"
            className={inputCls}
            required
          />
        </div>
        <div>
          <label className="text-[11px] font-semibold text-slate-600 block mb-1">Slug *</label>
          <input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="ket-noi-mang"
            className={`${inputCls} font-mono text-xs`}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="col-span-2">
          <label className="text-[11px] font-semibold text-slate-600 block mb-1">Mô tả</label>
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Nhóm chứa các thông số về cổng kết nối..."
            className={inputCls}
          />
        </div>
        <div>
          <label className="text-[11px] font-semibold text-slate-600 block mb-1">Thứ tự</label>
          <input
            type="number"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className={inputCls}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <button type="button" onClick={() => setOpen(false)} className="px-4 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
          Hủy
        </button>
        <button type="submit" disabled={saving} className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors disabled:opacity-60">
          {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
          Tạo nhóm
        </button>
      </div>
    </form>
  )
}

// ─── Sub-component: Create Spec Form ─────────────────────────────────────────

function CreateSpecForm({
  groupId,
  groups,
  onCreated,
}: {
  groupId?: string
  groups: SpecGroup[]
  onCreated: (spec: Spec) => void
}) {
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [selectedGroupId, setSelectedGroupId] = useState(groupId ?? '')
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [dataType, setDataType] = useState<SpecDataType>('text')
  const [unit, setUnit] = useState('')
  const [description, setDescription] = useState('')
  const [isFilterable, setIsFilterable] = useState(false)
  const [sortOrder, setSortOrder] = useState('0')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !slug.trim() || !selectedGroupId) {
      setError('Nhóm, Tên, và Slug là bắt buộc')
      return
    }
    setSaving(true)
    setError('')

    try {
      const res = await fetch('/api/v2/admin/specifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'spec',
          group_id: selectedGroupId,
          name, slug,
          data_type: dataType,
          unit: unit || null,
          description: description || null,
          is_filterable: isFilterable,
          is_searchable: isFilterable,
          sort_order: Number(sortOrder),
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      const group = groups.find((g) => g.id === selectedGroupId)
      onCreated({
        id: data.id,
        group_id: selectedGroupId,
        group_name: group?.name ?? '',
        name, slug,
        data_type: dataType,
        unit: unit || null,
        description: description || null,
        is_filterable: isFilterable,
        is_searchable: isFilterable,
        sort_order: Number(sortOrder),
        is_active: true,
      })
      setName(''); setSlug(''); setUnit(''); setDescription('')
      setOpen(false)
    } catch (e: any) {
      setError(e.message ?? 'Có lỗi xảy ra')
    } finally {
      setSaving(false)
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 hover:text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-all border border-dashed border-slate-200 hover:border-blue-200"
      >
        <Plus className="w-3.5 h-3.5" /> Thêm thông số
      </button>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="mt-3 bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-bold text-slate-700">Tạo thông số mới</span>
        <button type="button" onClick={() => setOpen(false)}>
          <X className="w-4 h-4 text-slate-400 hover:text-slate-600" />
        </button>
      </div>

      {error && (
        <p className="text-xs text-rose-600 font-medium flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5" /> {error}
        </p>
      )}

      {/* Nếu không có groupId cố định, cho chọn group */}
      {!groupId && (
        <div>
          <label className="text-[11px] font-semibold text-slate-600 block mb-1">Nhóm thông số *</label>
          <select value={selectedGroupId} onChange={(e) => setSelectedGroupId(e.target.value)} className={selectCls} required>
            <option value="">— Chọn nhóm —</option>
            {groups.map((g) => (
              <option key={g.id} value={g.id}>{g.name}</option>
            ))}
          </select>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-[11px] font-semibold text-slate-600 block mb-1">Tên thông số *</label>
          <input
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''))
            }}
            placeholder="VD: Số cổng 1G"
            className={inputCls}
            required
          />
        </div>
        <div>
          <label className="text-[11px] font-semibold text-slate-600 block mb-1">Slug *</label>
          <input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="so-cong-1g"
            className={`${inputCls} font-mono text-xs`}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="text-[11px] font-semibold text-slate-600 block mb-1">Kiểu dữ liệu *</label>
          <select value={dataType} onChange={(e) => setDataType(e.target.value as SpecDataType)} className={selectCls}>
            {(Object.entries(DATA_TYPE_LABELS) as [SpecDataType, { label: string }][]).map(([val, { label }]) => (
              <option key={val} value={val}>{label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-[11px] font-semibold text-slate-600 block mb-1">Đơn vị</label>
          <input
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            placeholder="VD: Gbps, cổng, W"
            className={`${inputCls} font-mono text-xs`}
          />
        </div>
        <div>
          <label className="text-[11px] font-semibold text-slate-600 block mb-1">Thứ tự</label>
          <input type="number" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className={inputCls} />
        </div>
      </div>

      <div>
        <label className="text-[11px] font-semibold text-slate-600 block mb-1">Mô tả ngắn</label>
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Ghi chú cho nhân viên nhập liệu..."
          className={inputCls}
        />
      </div>

      {/* Kiểu dữ liệu info */}
      {dataType in DATA_TYPE_LABELS && (
        <div className="flex items-start gap-2 p-2.5 bg-blue-50/70 rounded-xl border border-blue-100">
          <Info className="w-3.5 h-3.5 text-blue-500 flex-shrink-0 mt-0.5" />
          <p className="text-[11px] text-blue-700">{DATA_TYPE_LABELS[dataType].desc}</p>
        </div>
      )}

      <label className="flex items-center gap-2 cursor-pointer group">
        <input
          type="checkbox"
          checked={isFilterable}
          onChange={(e) => setIsFilterable(e.target.checked)}
          className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
        />
        <span className="text-xs font-medium text-slate-600 group-hover:text-slate-800">
          Cho phép lọc & tìm kiếm theo thông số này
        </span>
        <Filter className="w-3.5 h-3.5 text-slate-400" />
      </label>

      <div className="flex justify-end gap-2 pt-1">
        <button type="button" onClick={() => setOpen(false)} className="px-4 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
          Hủy
        </button>
        <button type="submit" disabled={saving} className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors disabled:opacity-60">
          {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
          Tạo thông số
        </button>
      </div>
    </form>
  )
}

// ─── Main Page Component ──────────────────────────────────────────────────────

export function SpecificationsPageClient({ initialGroups, initialSpecs }: Props) {
  const [groups, setGroups] = useState<SpecGroup[]>(initialGroups)
  const [specs, setSpecs] = useState<Spec[]>(initialSpecs)
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
    new Set(initialGroups.map((g) => g.id))
  )
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [toastMsg, setToastMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null)
  const [searchQ, setSearchQ] = useState('')

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMsg({ text, type })
    setTimeout(() => setToastMsg(null), 3000)
  }

  const toggleGroup = (id: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const handleGroupCreated = useCallback((group: SpecGroup) => {
    setGroups((prev) => [...prev, group])
    setExpandedGroups((prev) => new Set([...prev, group.id]))
    showToast(`Đã tạo nhóm "${group.name}"`)
  }, [])

  const handleSpecCreated = useCallback((spec: Spec) => {
    setSpecs((prev) => [...prev, spec])
    showToast(`Đã tạo thông số "${spec.name}"`)
  }, [])

  const handleToggleSpec = async (spec: Spec) => {
    const newVal = !spec.is_active
    setSpecs((prev) => prev.map((s) => s.id === spec.id ? { ...s, is_active: newVal } : s))
    try {
      await fetch(`/api/v2/admin/specifications/${spec.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'toggle', is_active: newVal }),
      })
    } catch {
      // revert
      setSpecs((prev) => prev.map((s) => s.id === spec.id ? { ...s, is_active: spec.is_active } : s))
      showToast('Không thể cập nhật', 'error')
    }
  }

  const handleDeleteSpec = async (spec: Spec) => {
    if (!confirm(`Xóa thông số "${spec.name}"?\n\nTất cả giá trị trên sản phẩm liên quan cũng sẽ bị xóa.`)) return
    setDeletingId(spec.id)
    try {
      await fetch(`/api/v2/admin/specifications/${spec.id}?type=spec`, { method: 'DELETE' })
      setSpecs((prev) => prev.filter((s) => s.id !== spec.id))
      showToast(`Đã xóa "${spec.name}"`)
    } catch {
      showToast('Xóa thất bại', 'error')
    } finally {
      setDeletingId(null)
    }
  }

  const handleDeleteGroup = async (group: SpecGroup) => {
    const groupSpecs = specs.filter((s) => s.group_id === group.id)
    if (!confirm(`Xóa nhóm "${group.name}"?\n\nNhóm này chứa ${groupSpecs.length} thông số — tất cả cũng sẽ bị xóa.`)) return
    setDeletingId(group.id)
    try {
      await fetch(`/api/v2/admin/specifications/${group.id}?type=group`, { method: 'DELETE' })
      setGroups((prev) => prev.filter((g) => g.id !== group.id))
      setSpecs((prev) => prev.filter((s) => s.group_id !== group.id))
      showToast(`Đã xóa nhóm "${group.name}"`)
    } catch {
      showToast('Xóa thất bại', 'error')
    } finally {
      setDeletingId(null)
    }
  }

  // Filter by search
  const filteredSpecs = searchQ
    ? specs.filter((s) =>
        s.name.toLowerCase().includes(searchQ.toLowerCase()) ||
        s.slug.toLowerCase().includes(searchQ.toLowerCase()) ||
        s.group_name.toLowerCase().includes(searchQ.toLowerCase())
      )
    : specs

  const totalActive = specs.filter((s) => s.is_active).length

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMsg && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl text-sm font-semibold animate-in slide-in-from-bottom-4 ${
          toastMsg.type === 'success'
            ? 'bg-emerald-600 text-white'
            : 'bg-rose-600 text-white'
        }`}>
          {toastMsg.type === 'success'
            ? <CheckCircle2 className="w-4 h-4" />
            : <AlertCircle className="w-4 h-4" />}
          {toastMsg.text}
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Database className="w-4 h-4 text-white" />
            </div>
            Quản lý Thông số kỹ thuật
          </h1>
          <p className="text-sm text-slate-500 mt-1.5">
            Định nghĩa thư viện thông số — cơ sở sinh Dynamic Form khi thêm sản phẩm.
            Hiện có{' '}
            <span className="font-bold text-slate-700">{groups.length} nhóm</span>
            {' '}·{' '}
            <span className="font-bold text-slate-700">{specs.length} thông số</span>
            {' '}·{' '}
            <span className="font-bold text-emerald-600">{totalActive} đang kích hoạt</span>
          </p>
        </div>
        <CreateGroupForm onCreated={handleGroupCreated} />
      </div>

      {/* Info Card: category_specifications */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50/50 border border-blue-200/70 rounded-2xl p-4 flex gap-3">
        <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-800 space-y-1">
          <p className="font-semibold">Về tính năng lọc theo Danh mục (category_specifications)</p>
          <p className="text-xs text-blue-700 leading-relaxed">
            Hiện tại: Dynamic Form hiển thị <strong>tất cả thông số active</strong> cho mọi danh mục.
            Khi cần chuyên biệt hóa (Switch chỉ thấy specs mạng, Camera chỉ thấy specs AV),
            Admin tạo bảng <code className="bg-blue-100 px-1 rounded font-mono">category_specifications</code> trong PostgreSQL —
            hệ thống sẽ <strong>tự động nhận diện và filter chính xác</strong> mà không cần sửa code.
          </p>
          <p className="text-xs font-mono bg-blue-100/70 px-3 py-2 rounded-lg border border-blue-200/60 mt-2 text-blue-800">
            {'CREATE TABLE category_specifications ('}
            {'\n  id VARCHAR(255) PRIMARY KEY,'}
            {'\n  category_id VARCHAR(255) REFERENCES categories(id),'}
            {'\n  specification_id VARCHAR(255) REFERENCES specifications(id),'}
            {'\n  sort_order INT DEFAULT 0,'}
            {'\n  is_active BOOLEAN DEFAULT TRUE'}
            {'\n);'}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchQ}
          onChange={(e) => setSearchQ(e.target.value)}
          placeholder="Tìm kiếm thông số theo tên, slug, hoặc nhóm..."
          className={`${inputCls} pl-10`}
        />
        {searchQ && (
          <button
            type="button"
            onClick={() => setSearchQ('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2"
          >
            <X className="w-4 h-4 text-slate-400 hover:text-slate-600" />
          </button>
        )}
      </div>

      {/* Khi search: hiện flat list */}
      {searchQ ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/50">
            <span className="text-xs font-bold text-slate-700">
              Kết quả tìm kiếm: {filteredSpecs.length} thông số
            </span>
          </div>
          <div className="divide-y divide-slate-100">
            {filteredSpecs.length === 0 ? (
              <div className="py-10 text-center text-sm text-slate-400">Không tìm thấy kết quả</div>
            ) : (
              filteredSpecs.map((spec) => (
                <SpecRow
                  key={spec.id}
                  spec={spec}
                  onToggle={handleToggleSpec}
                  onDelete={handleDeleteSpec}
                  deleting={deletingId === spec.id}
                />
              ))
            )}
          </div>
        </div>
      ) : (
        /* Normal view: grouped */
        <div className="space-y-4">
          {groups.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
              <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
                <Layers className="w-8 h-8 text-slate-300" />
              </div>
              <p className="text-sm font-semibold text-slate-600">Chưa có nhóm thông số nào</p>
              <p className="text-xs text-slate-400 mt-1">Bắt đầu bằng cách tạo nhóm đầu tiên</p>
            </div>
          ) : (
            groups.map((group) => {
              const groupSpecs = specs.filter((s) => s.group_id === group.id)
              const isExpanded = expandedGroups.has(group.id)

              return (
                <div
                  key={group.id}
                  className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden"
                >
                  {/* Group Header */}
                  <div className="px-5 py-4 flex items-center gap-3 cursor-pointer hover:bg-slate-50/50 transition-colors" onClick={() => toggleGroup(group.id)}>
                    <button type="button" className="text-slate-400 flex-shrink-0">
                      {isExpanded
                        ? <ChevronDown className="w-4 h-4" />
                        : <ChevronRight className="w-4 h-4" />}
                    </button>

                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Layers className="w-4 h-4 text-indigo-600" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-slate-900">{group.name}</span>
                        <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                          {group.slug}
                        </span>
                      </div>
                      {group.description && (
                        <p className="text-xs text-slate-400 mt-0.5 truncate">{group.description}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="text-xs font-semibold text-slate-500">
                        {groupSpecs.length} thông số
                        {groupSpecs.filter((s) => s.is_active).length !== groupSpecs.length && (
                          <span className="text-slate-400 font-normal">
                            {' '}({groupSpecs.filter((s) => s.is_active).length} active)
                          </span>
                        )}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); handleDeleteGroup(group) }}
                        disabled={deletingId === group.id}
                        className="p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Xóa nhóm"
                      >
                        {deletingId === group.id
                          ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          : <Trash2 className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Spec List */}
                  {isExpanded && (
                    <div className="border-t border-slate-100">
                      {groupSpecs.length === 0 ? (
                        <div className="py-6 text-center text-xs text-slate-400">
                          Nhóm này chưa có thông số nào
                        </div>
                      ) : (
                        <div className="divide-y divide-slate-50">
                          {groupSpecs.map((spec) => (
                            <SpecRow
                              key={spec.id}
                              spec={spec}
                              onToggle={handleToggleSpec}
                              onDelete={handleDeleteSpec}
                              deleting={deletingId === spec.id}
                            />
                          ))}
                        </div>
                      )}

                      {/* Add spec button inside group */}
                      <div className="p-4 border-t border-dashed border-slate-100 bg-slate-50/30">
                        <CreateSpecForm groupId={group.id} groups={groups} onCreated={handleSpecCreated} />
                      </div>
                    </div>
                  )}
                </div>
              )
            })
          )}

          {/* Add spec without specific group */}
          {groups.length > 0 && (
            <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-5">
              <p className="text-xs font-semibold text-slate-500 mb-3">Thêm thông số vào bất kỳ nhóm nào:</p>
              <CreateSpecForm groups={groups} onCreated={handleSpecCreated} />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Sub-component: Spec Row ──────────────────────────────────────────────────

function SpecRow({
  spec,
  onToggle,
  onDelete,
  deleting,
}: {
  spec: Spec
  onToggle: (spec: Spec) => void
  onDelete: (spec: Spec) => void
  deleting: boolean
}) {
  const dt = DATA_TYPE_LABELS[spec.data_type]

  return (
    <div className={`flex items-center gap-3 px-5 py-3 hover:bg-slate-50/50 transition-colors ${!spec.is_active ? 'opacity-50' : ''}`}>
      {/* Data type badge */}
      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border flex-shrink-0 ${dt.color}`}>
        {dt.label}
      </span>

      {/* Name + meta */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-slate-800">{spec.name}</span>
          <span className="text-[10px] font-mono text-slate-400">{spec.slug}</span>
          {spec.unit && (
            <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded font-mono">
              {spec.unit}
            </span>
          )}
          {spec.is_filterable && (
            <span className="text-[10px] text-violet-600 bg-violet-50 border border-violet-100 px-1.5 py-0.5 rounded flex items-center gap-0.5">
              <Filter className="w-2.5 h-2.5" /> Filterable
            </span>
          )}
        </div>
        {spec.description && (
          <p className="text-[11px] text-slate-400 mt-0.5 truncate">{spec.description}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <button
          type="button"
          onClick={() => onToggle(spec)}
          className={`p-1.5 rounded-lg transition-colors ${
            spec.is_active
              ? 'text-emerald-500 hover:bg-emerald-50'
              : 'text-slate-300 hover:bg-slate-100'
          }`}
          title={spec.is_active ? 'Đang kích hoạt — click để ẩn' : 'Đang ẩn — click để kích hoạt'}
        >
          {spec.is_active
            ? <ToggleRight className="w-5 h-5" />
            : <ToggleLeft className="w-5 h-5" />}
        </button>

        <button
          type="button"
          onClick={() => onDelete(spec)}
          disabled={deleting}
          className="p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
          title="Xóa thông số"
        >
          {deleting
            ? <Loader2 className="w-4 h-4 animate-spin" />
            : <Trash2 className="w-4 h-4" />}
        </button>
      </div>
    </div>
  )
}
