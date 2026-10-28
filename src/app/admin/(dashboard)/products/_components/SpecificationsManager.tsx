'use client'

/**
 * SpecificationsManager — Dynamic Form cho Thông số kỹ thuật sản phẩm
 *
 * Luồng hoạt động (3 bước):
 *  Bước 1: Component nhận category_id hiện tại của sản phẩm
 *  Bước 2: Fetch API → lấy danh sách specs của category + specs của sản phẩm → render Dynamic Fields
 *  Bước 3: Admin điền → nhấn Lưu → POST lên /api/v2/admin/products/[id]/specifications
 *
 * Hỗ trợ data_type: text, number, boolean, select, range, json
 */

import { useCallback, useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import {
  Save, Loader2, RefreshCw, AlertCircle, CheckCircle2,
  Settings2, ChevronDown, Info, Zap, Plus, X, Search
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

interface SpecOption {
  id: string
  value: string
  label: string
  sort_order: number
}

interface SpecField {
  id: string
  group_id?: string
  group_name?: string
  group_slug?: string
  name: string
  slug: string
  data_type: 'number' | 'text' | 'boolean' | 'select' | 'range' | 'json'
  unit: string | null
  description: string | null
  options?: SpecOption[]
}

interface SpecGroup {
  group_id: string
  group_name: string
  group_slug: string
  specs: SpecField[]
}

interface SpecValue {
  specification_id: string
  value_number: number | null
  value_text: string | null
  value_boolean: boolean | null
  min_value: number | null
  max_value: number | null
  unit_override: string | null
  notes: string | null
}

interface Props {
  productId: string
  categoryId: string
}

// ─── CSS helpers ──────────────────────────────────────────────────────────────

const inputCls =
  'w-full text-sm bg-slate-50/50 hover:bg-slate-50/80 focus:bg-white border border-slate-200 ' +
  'rounded-xl px-3.5 py-2.5 text-slate-800 placeholder:text-slate-400 focus:outline-none ' +
  'focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium'

const selectCls =
  'w-full text-sm bg-slate-50/50 hover:bg-slate-50/80 focus:bg-white border border-slate-200 ' +
  'rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:border-blue-500 ' +
  'focus:ring-4 focus:ring-blue-500/10 transition-all appearance-none cursor-pointer font-medium'

// ─── SpecField Renderer ───────────────────────────────────────────────────────

function SpecFieldInput({
  spec,
  value,
  onChange,
  onRemove,
  isExtra,
}: {
  spec: SpecField
  value: SpecValue
  onChange: (val: Partial<SpecValue>) => void
  onRemove?: () => void
  isExtra?: boolean
}) {
  const labelEl = (
    <div className="flex items-center justify-between gap-1.5 mb-1.5">
      <div className="flex items-center gap-1.5 min-w-0">
        <label className="block text-xs font-semibold text-slate-700 truncate" title={spec.name}>
          {spec.name}
        </label>
        {spec.unit && (
          <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded font-mono shrink-0">
            {spec.unit}
          </span>
        )}
        {isExtra && (
          <span className="text-[9px] text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.2 rounded font-medium shrink-0">
            Bổ sung
          </span>
        )}
        {spec.description && (
          <span title={spec.description} className="cursor-help shrink-0">
            <Info className="w-3 h-3 text-slate-400" />
          </span>
        )}
      </div>

      {isExtra && onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="text-slate-400 hover:text-rose-500 p-0.5 rounded transition-colors"
          title="Xóa thông số này khỏi form"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  )

  // ── text ──────────────────────────────────────────────────────────────────
  if (spec.data_type === 'text') {
    return (
      <div>
        {labelEl}
        <input
          type="text"
          value={value.value_text ?? ''}
          onChange={(e) => onChange({ value_text: e.target.value || null })}
          placeholder={`Nhập ${spec.name.toLowerCase()}...`}
          className={inputCls}
        />
      </div>
    )
  }

  // ── number ────────────────────────────────────────────────────────────────
  if (spec.data_type === 'number') {
    return (
      <div>
        {labelEl}
        <div className="relative">
          <input
            type="number"
            step="any"
            value={value.value_number ?? ''}
            onChange={(e) =>
              onChange({
                value_number: e.target.value !== '' ? Number(e.target.value) : null,
              })
            }
            placeholder="0"
            className={`${inputCls} ${spec.unit ? 'pr-16' : ''}`}
          />
          {spec.unit && (
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-mono pointer-events-none">
              {spec.unit}
            </span>
          )}
        </div>
      </div>
    )
  }

  // ── range ─────────────────────────────────────────────────────────────────
  if (spec.data_type === 'range') {
    return (
      <div>
        {labelEl}
        <div className="grid grid-cols-2 gap-2">
          <div className="relative">
            <input
              type="number"
              step="any"
              value={value.min_value ?? ''}
              onChange={(e) =>
                onChange({ min_value: e.target.value !== '' ? Number(e.target.value) : null })
              }
              placeholder="Min"
              className={inputCls}
            />
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-mono">
              MIN
            </span>
          </div>
          <div className="relative">
            <input
              type="number"
              step="any"
              value={value.max_value ?? ''}
              onChange={(e) =>
                onChange({ max_value: e.target.value !== '' ? Number(e.target.value) : null })
              }
              placeholder="Max"
              className={inputCls}
            />
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-mono">
              MAX {spec.unit ?? ''}
            </span>
          </div>
        </div>
      </div>
    )
  }

  // ── boolean ───────────────────────────────────────────────────────────────
  if (spec.data_type === 'boolean') {
    const isYes = value.value_boolean === true
    const isNo = value.value_boolean === false
    return (
      <div>
        {labelEl}
        <div className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 bg-slate-50/50">
          <span className="text-xs font-medium text-slate-700">
            {isYes ? (
              <span className="text-emerald-600 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Có hỗ trợ
              </span>
            ) : isNo ? (
              <span className="text-slate-500">Không hỗ trợ</span>
            ) : (
              <span className="text-slate-400 italic">Chưa xác định</span>
            )}
          </span>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onChange({ value_boolean: isYes ? null : true })}
              className={`px-2.5 py-1 text-xs rounded-lg font-semibold transition-all ${
                isYes
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              Có
            </button>
            <button
              type="button"
              onClick={() => onChange({ value_boolean: isNo ? null : false })}
              className={`px-2.5 py-1 text-xs rounded-lg font-semibold transition-all ${
                isNo
                  ? 'bg-slate-700 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              Không
            </button>
            {(isYes || isNo) && (
              <button
                type="button"
                onClick={() => onChange({ value_boolean: null })}
                className="text-[10px] text-slate-400 hover:text-slate-600 px-1.5 py-1"
                title="Bỏ chọn"
              >
                Đặt lại
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  // ── select ────────────────────────────────────────────────────────────────
  if (spec.data_type === 'select' && spec.options) {
    return (
      <div>
        {labelEl}
        <div className="relative">
          <select
            value={value.value_text ?? ''}
            onChange={(e) => onChange({ value_text: e.target.value || null })}
            className={selectCls}
          >
            <option value="">— Chưa chọn —</option>
            {spec.options.map((opt) => (
              <option key={opt.id} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>
      </div>
    )
  }

  // ── json (textarea) ───────────────────────────────────────────────────────
  if (spec.data_type === 'json') {
    const jsonStr =
      value.value_text ?? (value.value_number !== null ? String(value.value_number) : '')
    return (
      <div>
        {labelEl}
        <textarea
          rows={3}
          value={jsonStr}
          onChange={(e) => onChange({ value_text: e.target.value || null })}
          placeholder={`Nhập JSON hoặc văn bản cho ${spec.name}...`}
          className={`${inputCls} font-mono text-xs resize-none`}
        />
      </div>
    )
  }

  return null
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function SpecificationsManager({ productId, categoryId }: Props) {
  const router = useRouter()
  const [groups, setGroups] = useState<SpecGroup[]>([])
  const [allSpecs, setAllSpecs] = useState<SpecField[]>([])
  const [extraSpecs, setExtraSpecs] = useState<SpecField[]>([])
  const [values, setValues] = useState<Record<string, SpecValue>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [savedCount, setSavedCount] = useState(0)
  const [showAddModal, setShowAddModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // ── Fetch spec definitions + existing values ──────────────────────────────

  const loadData = useCallback(async () => {
    if (!categoryId) return
    setLoading(true)
    setStatus('idle')

    try {
      // Gọi song song: category specs, product existing specs, và all specs trong thư viện
      const [schemaRes, valuesRes, allRes] = await Promise.all([
        fetch(`/api/v2/admin/specifications/by-category?categoryId=${categoryId}`),
        fetch(`/api/v2/admin/products/${productId}/specifications`),
        fetch(`/api/v2/admin/specifications`),
      ])

      const schemaData = await schemaRes.json()
      const valuesData = await valuesRes.json()
      const allData = allRes.ok ? await allRes.json() : { specs: [] }
      const allSpecsList: SpecField[] = allData.specs || []
      setAllSpecs(allSpecsList)

      const allGroups: SpecGroup[] = schemaData.groups ?? []
      const categorySpecIds = new Set<string>()
      allGroups.forEach((g) => g.specs.forEach((s) => categorySpecIds.add(s.id)))

      // Build initial values map từ existing product specs
      const initialValues: Record<string, SpecValue> = {}
      const loadedExtraSpecs: SpecField[] = []

      if (Array.isArray(valuesData.specs)) {
        for (const sv of valuesData.specs) {
          initialValues[sv.specification_id] = {
            specification_id: sv.specification_id,
            value_number: sv.value_number ?? null,
            value_text: sv.value_text ?? null,
            value_boolean: sv.value_boolean ?? null,
            min_value: sv.min_value ?? null,
            max_value: sv.max_value ?? null,
            unit_override: sv.unit_override ?? null,
            notes: sv.notes ?? null,
          }

          // Nếu spec này của sản phẩm không nằm trong category_specifications hiện tại, đưa vào extraSpecs
          if (!categorySpecIds.has(sv.specification_id)) {
            const matchedAll = allSpecsList.find((s) => s.id === sv.specification_id)
            if (matchedAll) {
              loadedExtraSpecs.push(matchedAll)
            } else {
              loadedExtraSpecs.push({
                id: sv.specification_id,
                name: sv.spec_name || sv.specification_id,
                slug: sv.spec_slug || sv.specification_id,
                data_type: sv.data_type || 'text',
                unit: sv.unit || null,
                description: null,
              })
            }
          }
        }
      }

      // Điền giá trị mặc định cho các spec chưa có value
      for (const group of allGroups) {
        for (const spec of group.specs) {
          if (!initialValues[spec.id]) {
            initialValues[spec.id] = {
              specification_id: spec.id,
              value_number: null,
              value_text: null,
              value_boolean: null,
              min_value: null,
              max_value: null,
              unit_override: null,
              notes: null,
            }
          }
        }
      }

      setGroups(allGroups)
      setExtraSpecs(loadedExtraSpecs)
      setValues(initialValues)
    } catch {
      setStatus('error')
      setErrorMsg('Không thể tải thông số kỹ thuật')
    } finally {
      setLoading(false)
    }
  }, [categoryId, productId])

  useEffect(() => {
    loadData()
  }, [loadData])

  // ── Update single spec value ──────────────────────────────────────────────

  const handleChange = useCallback((specId: string, partial: Partial<SpecValue>) => {
    setValues((prev) => ({
      ...prev,
      [specId]: { ...prev[specId], ...partial },
    }))
    setStatus('idle')
  }, [])

  // Thêm spec ngoài danh mục
  const handleAddExtraSpec = (spec: SpecField) => {
    if (!extraSpecs.some((s) => s.id === spec.id)) {
      setExtraSpecs((prev) => [...prev, spec])
      if (!values[spec.id]) {
        setValues((prev) => ({
          ...prev,
          [spec.id]: {
            specification_id: spec.id,
            value_number: null,
            value_text: null,
            value_boolean: null,
            min_value: null,
            max_value: null,
            unit_override: null,
            notes: null,
          },
        }))
      }
    }
    setShowAddModal(false)
  }

  // Xóa spec ngoài danh mục
  const handleRemoveExtraSpec = (specId: string) => {
    setExtraSpecs((prev) => prev.filter((s) => s.id !== specId))
    setValues((prev) => {
      const next = { ...prev }
      delete next[specId]
      return next
    })
  }

  // ── Save all specs ────────────────────────────────────────────────────────

  const handleSave = async () => {
    setSaving(true)
    setStatus('idle')

    try {
      const specs = Object.values(values).map((v) => ({
        specification_id: v.specification_id,
        value_number: v.value_number,
        value_text: v.value_text,
        value_boolean: v.value_boolean,
        min_value: v.min_value,
        max_value: v.max_value,
        unit_override: v.unit_override,
        notes: v.notes,
      }))

      const res = await fetch(`/api/v2/admin/products/${productId}/specifications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ specs }),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        throw new Error(data.error ?? 'Lưu thất bại')
      }

      setSavedCount(data.saved ?? specs.length)
      setStatus('success')
      router.refresh()
    } catch (e: any) {
      setStatus('error')
      setErrorMsg(e.message ?? 'Có lỗi xảy ra khi lưu thông số')
    } finally {
      setSaving(false)
    }
  }

  // ── Đếm số trường đã điền ─────────────────────────────────────────────────

  const filledCount = Object.values(values).filter((v) =>
    (v.value_number !== null && v.value_number !== undefined) ||
    (v.value_text !== null && v.value_text !== undefined && v.value_text.trim() !== '') ||
    (v.value_boolean !== null && v.value_boolean !== undefined) ||
    (v.min_value !== null && v.min_value !== undefined) ||
    (v.max_value !== null && v.max_value !== undefined)
  ).length

  // Danh sách specs có thể add thêm (chưa có trong category và chưa có trong extraSpecs)
  const availableToAdd = useMemo(() => {
    const existingIds = new Set<string>()
    groups.forEach((g) => g.specs.forEach((s) => existingIds.add(s.id)))
    extraSpecs.forEach((s) => existingIds.add(s.id))

    return allSpecs.filter((s) => !existingIds.has(s.id))
  }, [allSpecs, groups, extraSpecs])

  const totalFields = useMemo(() => {
    let count = 0
    groups.forEach((g) => { count += g.specs.length })
    count += extraSpecs.length
    return count
  }, [groups, extraSpecs])

  // Lọc theo search
  const filteredGroups = useMemo(() => {
    if (!searchQuery.trim()) return groups
    const q = searchQuery.toLowerCase().trim()

    return groups
      .map((g) => ({
        ...g,
        specs: g.specs.filter(
          (s) =>
            s.name.toLowerCase().includes(q) ||
            s.slug.toLowerCase().includes(q) ||
            (s.unit && s.unit.toLowerCase().includes(q))
        ),
      }))
      .filter((g) => g.specs.length > 0)
  }, [groups, searchQuery])

  // ─── Render ───────────────────────────────────────────────────────────────

  if (!categoryId) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
          <Settings2 className="w-7 h-7 text-slate-400" />
        </div>
        <p className="text-sm font-semibold text-slate-600">Chưa chọn danh mục</p>
        <p className="text-xs text-slate-400 mt-1">
          Vui lòng chọn danh mục sản phẩm ở tab Thông tin trước
        </p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          <p className="text-sm text-slate-500 font-medium">Đang tải thông số kỹ thuật...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Thông số kỹ thuật sản phẩm</h3>
            <p className="text-[11px] text-slate-500">
              Đã điền{' '}
              <span className="font-bold text-blue-600">{filledCount}</span>
              /{totalFields} thông số
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadData}
            disabled={loading}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            title="Tải lại"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl border border-blue-200 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Thêm thông số khác</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-xs font-semibold rounded-xl transition-all shadow-sm disabled:opacity-60"
          >
            {saving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Đang lưu...</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Lưu thông số</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Status alerts */}
      {status === 'success' && (
        <div className="flex items-center gap-3 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <p className="text-sm text-emerald-800 font-medium">
            Đã lưu thành công {savedCount} thông số kỹ thuật vào cơ sở dữ liệu và đồng bộ lên website
          </p>
        </div>
      )}

      {status === 'error' && (
        <div className="flex items-center gap-3 p-3.5 bg-rose-50 border border-rose-200 rounded-xl">
          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          <p className="text-sm text-rose-800 font-medium">{errorMsg}</p>
        </div>
      )}

      {/* Search Filter */}
      {totalFields > 6 && (
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm nhanh thông số (cổng, PoE, băng thông, RAM,...)..."
            className="w-full text-xs pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:border-blue-500 transition-all font-medium"
          />
        </div>
      )}

      {/* Trường hợp danh mục chưa có thông số và chưa có extra spec */}
      {groups.length === 0 && extraSpecs.length === 0 && (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center space-y-3">
          <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800">Danh mục này chưa có thông số kỹ thuật mặc định</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              Bạn có thể bấm <strong>&quot;Thêm thông số khác&quot;</strong> bên dưới để chọn các thông số từ thư viện và gán trực tiếp cho sản phẩm này.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm thông số kỹ thuật cho sản phẩm</span>
          </button>
        </div>
      )}

      {/* Dynamic Spec Groups */}
      {filteredGroups.map((group) => (
        <div
          key={group.group_id}
          className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden"
        >
          {/* Group Header */}
          <div className="px-5 py-3.5 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white flex items-center gap-2">
            <div className="w-1.5 h-5 bg-blue-500 rounded-full" />
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              {group.group_name}
            </h4>
            <span className="ml-auto text-[10px] text-slate-400 font-medium">
              {group.specs.length} thông số
            </span>
          </div>

          {/* Spec Fields Grid */}
          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {group.specs.map((spec) => {
              const val = values[spec.id] ?? {
                specification_id: spec.id,
                value_number: null,
                value_text: null,
                value_boolean: null,
                min_value: null,
                max_value: null,
                unit_override: null,
                notes: null,
              }

              const colSpan =
                spec.data_type === 'range' ? 'sm:col-span-2' : ''

              return (
                <div key={spec.id} className={colSpan}>
                  <SpecFieldInput
                    spec={spec}
                    value={val}
                    onChange={(partial) => handleChange(spec.id, partial)}
                  />
                </div>
              )
            })}
          </div>
        </div>
      ))}

      {/* Extra Specs Section */}
      {extraSpecs.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="px-5 py-3.5 border-b border-slate-100 bg-gradient-to-r from-amber-50/50 to-white flex items-center gap-2">
            <div className="w-1.5 h-5 bg-amber-500 rounded-full" />
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Thông số bổ sung ngoài danh mục
            </h4>
            <span className="ml-auto text-[10px] text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full font-mono font-bold">
              {extraSpecs.length} thông số
            </span>
          </div>

          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {extraSpecs.map((spec) => {
              const val = values[spec.id] ?? {
                specification_id: spec.id,
                value_number: null,
                value_text: null,
                value_boolean: null,
                min_value: null,
                max_value: null,
                unit_override: null,
                notes: null,
              }

              const colSpan =
                spec.data_type === 'range' ? 'sm:col-span-2' : ''

              return (
                <div key={spec.id} className={colSpan}>
                  <SpecFieldInput
                    spec={spec}
                    value={val}
                    onChange={(partial) => handleChange(spec.id, partial)}
                    onRemove={() => handleRemoveExtraSpec(spec.id)}
                    isExtra={true}
                  />
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Save button ở cuối (dễ với form dài) */}
      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 text-sm font-semibold rounded-xl transition-all shadow-sm disabled:opacity-60"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Đang lưu...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Lưu tất cả thông số kỹ thuật</span>
            </>
          )}
        </button>
      </div>

      {/* Modal: Thêm thông số khác */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-800">
                  Thêm thông số kỹ thuật khác
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 max-h-80 overflow-y-auto space-y-1.5">
              {availableToAdd.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-6">
                  Tất cả các thông số trong thư viện đã được thêm vào form.
                </p>
              ) : (
                availableToAdd.map((spec) => (
                  <button
                    key={spec.id}
                    type="button"
                    onClick={() => handleAddExtraSpec(spec)}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all flex items-center justify-between gap-2"
                  >
                    <div>
                      <p className="text-xs font-semibold text-slate-800">{spec.name}</p>
                      <p className="text-[10px] text-slate-400">
                        Nhóm: {spec.group_name || 'Khác'} {spec.unit ? `• Đơn vị: ${spec.unit}` : ''}
                      </p>
                    </div>
                    <span className="text-[10px] font-mono bg-blue-50 text-blue-600 px-2 py-0.5 rounded font-semibold shrink-0">
                      + Thêm
                    </span>
                  </button>
                ))
              )}
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-xs font-semibold px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-200 transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
