'use client'

/**
 * DynamicProductSpecs.tsx
 * 
 * Component sinh Form động (Dynamic Form) cho Thông số kỹ thuật sản phẩm theo Danh mục (Category).
 * 
 * Nguyên lý hoạt động:
 * 1. Lắng nghe `categoryId` được chọn từ Form chính.
 * 2. Gọi API ngầm: GET /api/v2/admin/specifications/by-category?categoryId=xxx
 * 3. Nếu có productId (chế độ edit), tự động nạp các giá trị spec đã lưu từ trước.
 * 4. Tự động "vẽ" ra các trường nhập liệu tương ứng theo Nhóm (Specification Groups) và Kiểu dữ liệu (data_type):
 *    - number: Ô nhập số kèm đơn vị đo (Gbps, Cổng, Watt, fps, mm,...)
 *    - text: Ô nhập chuỗi kỹ thuật
 *    - boolean: Nút gạt Toggle/Switch (Có / Không)
 *    - select: Dropdown chọn danh sách cấu hình sẵn
 *    - range: Cặp ô Min - Max
 * 5. Tự động đóng gói toàn bộ giá trị vào hidden input name="specs_payload" dưới dạng JSON
 *    để Server Action lưu trực tiếp vào bảng trung gian product_specifications.
 */

import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Layers, Loader2, Sparkles, AlertCircle, CheckCircle2,
  ChevronDown, Info, Plus, X, Search, RefreshCw, Zap, SlidersHorizontal
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

export type SpecDataType = 'number' | 'text' | 'boolean' | 'select' | 'range' | 'json'

export interface SpecOption {
  id: string
  value: string
  label: string
  sort_order: number
}

export interface SpecField {
  id: string
  group_id: string
  group_name: string
  group_slug: string
  name: string
  slug: string
  data_type: SpecDataType
  unit: string | null
  description: string | null
  options?: SpecOption[]
}

export interface SpecGroup {
  group_id: string
  group_name: string
  group_slug: string
  specs: SpecField[]
}

export interface SpecValueState {
  specification_id: string
  value_number?: number | null
  value_text?: string | null
  value_boolean?: boolean | null
  min_value?: number | null
  max_value?: number | null
  unit_override?: string | null
  notes?: string | null
}

interface DynamicProductSpecsProps {
  categoryId: string
  categoryName?: string
  productId?: string
  inputName?: string
  onCountChange?: (filledCount: number, totalCount: number) => void
}

// ─── Styling ──────────────────────────────────────────────────────────────────

const inputCls =
  'w-full text-xs bg-white hover:bg-slate-50/50 focus:bg-white border border-slate-200 ' +
  'rounded-xl px-3 py-2 text-slate-800 placeholder:text-slate-400 focus:outline-none ' +
  'focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium'

const selectCls =
  'w-full text-xs bg-white hover:bg-slate-50/50 focus:bg-white border border-slate-200 ' +
  'rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-blue-500 ' +
  'focus:ring-4 focus:ring-blue-500/10 transition-all appearance-none cursor-pointer font-medium'

// ─── Single Field Renderer ────────────────────────────────────────────────────

function SpecFieldItem({
  spec,
  value,
  onChange,
  onRemove,
  isExtra,
}: {
  spec: SpecField
  value: SpecValueState
  onChange: (patch: Partial<SpecValueState>) => void
  onRemove?: () => void
  isExtra?: boolean
}) {
  const isFilled =
    (value.value_number !== null && value.value_number !== undefined) ||
    (value.value_text !== null && value.value_text !== undefined && value.value_text !== '') ||
    (value.value_boolean !== null && value.value_boolean !== undefined) ||
    (value.min_value !== null && value.min_value !== undefined) ||
    (value.max_value !== null && value.max_value !== undefined)

  return (
    <div
      className={`p-3.5 rounded-xl border transition-all ${
        isFilled
          ? 'bg-blue-50/30 border-blue-200 shadow-xs'
          : 'bg-white border-slate-200/80 hover:border-slate-300'
      }`}
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <label className="text-xs font-semibold text-slate-700 truncate" title={spec.name}>
            {spec.name}
          </label>
          {spec.unit && (
            <span className="text-[10px] text-blue-600 bg-blue-50 border border-blue-100 px-1.5 py-0.2 rounded font-mono font-medium shrink-0">
              {spec.unit}
            </span>
          )}
          {isExtra && (
            <span className="text-[9px] text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.2 rounded font-medium shrink-0">
              Bổ sung
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          {spec.description && (
            <span title={spec.description} className="cursor-help text-slate-400 hover:text-slate-600">
              <Info className="w-3.5 h-3.5" />
            </span>
          )}
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
      </div>

      {/* ── Kiểu Number ── */}
      {spec.data_type === 'number' && (
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
            placeholder={`Nhập ${spec.name.toLowerCase()}...`}
            className={`${inputCls} ${spec.unit ? 'pr-14' : ''}`}
          />
          {spec.unit && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-mono text-slate-400 pointer-events-none">
              {spec.unit}
            </span>
          )}
        </div>
      )}

      {/* ── Kiểu Text ── */}
      {spec.data_type === 'text' && (
        <input
          type="text"
          value={value.value_text ?? ''}
          onChange={(e) => onChange({ value_text: e.target.value || null })}
          placeholder={`Nhập ${spec.name.toLowerCase()}...`}
          className={inputCls}
        />
      )}

      {/* ── Kiểu Boolean (Switch) ── */}
      {spec.data_type === 'boolean' && (
        <div className="flex items-center justify-between gap-3 pt-1">
          <span className="text-xs text-slate-600 font-medium">
            {value.value_boolean === true ? (
              <span className="text-emerald-600 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Có hỗ trợ
              </span>
            ) : value.value_boolean === false ? (
              <span className="text-slate-400">Không hỗ trợ</span>
            ) : (
              <span className="text-slate-400 italic">Chưa xác định</span>
            )}
          </span>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onChange({ value_boolean: value.value_boolean === true ? null : true })}
              className={`px-2.5 py-1 text-xs rounded-lg font-semibold transition-all ${
                value.value_boolean === true
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Có
            </button>
            <button
              type="button"
              onClick={() => onChange({ value_boolean: value.value_boolean === false ? null : false })}
              className={`px-2.5 py-1 text-xs rounded-lg font-semibold transition-all ${
                value.value_boolean === false
                  ? 'bg-slate-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Không
            </button>
            {value.value_boolean !== null && value.value_boolean !== undefined && (
              <button
                type="button"
                onClick={() => onChange({ value_boolean: null })}
                className="text-[10px] text-slate-400 hover:text-slate-600 px-1 py-1"
                title="Bỏ chọn"
              >
                Đặt lại
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── Kiểu Select ── */}
      {spec.data_type === 'select' && (
        <div className="relative">
          <select
            value={value.value_text ?? ''}
            onChange={(e) => onChange({ value_text: e.target.value || null })}
            className={selectCls}
          >
            <option value="">— Chọn {spec.name.toLowerCase()} —</option>
            {spec.options?.map((opt) => (
              <option key={opt.id} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
        </div>
      )}

      {/* ── Kiểu Range (Min - Max) ── */}
      {spec.data_type === 'range' && (
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
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] text-slate-400 font-mono">
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
              placeholder={`Max ${spec.unit ? `(${spec.unit})` : ''}`}
              className={inputCls}
            />
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] text-slate-400 font-mono">
              MAX
            </span>
          </div>
        </div>
      )}

      {/* ── Kiểu JSON / Ghi chú ── */}
      {spec.data_type === 'json' && (
        <textarea
          rows={2}
          value={value.value_text ?? ''}
          onChange={(e) => onChange({ value_text: e.target.value || null })}
          placeholder="Nhập cấu hình hoặc chi tiết dạng JSON / văn bản..."
          className={`${inputCls} resize-none font-mono text-[11px]`}
        />
      )}
    </div>
  )
}

// ─── Main Dynamic Product Specs Component ─────────────────────────────────────

export function DynamicProductSpecs({
  categoryId,
  categoryName,
  productId,
  inputName = 'specs_payload',
  onCountChange,
}: DynamicProductSpecsProps) {
  const [groups, setGroups] = useState<SpecGroup[]>([])
  const [allSpecs, setAllSpecs] = useState<SpecField[]>([])
  const [extraSpecs, setExtraSpecs] = useState<SpecField[]>([])
  const [values, setValues] = useState<Record<string, SpecValueState>>({})
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  // 1. Fetch dữ liệu khi categoryId thay đổi
  const fetchSpecs = useCallback(async (catId: string, prodId?: string) => {
    if (!catId) {
      setGroups([])
      setValues({})
      setExtraSpecs([])
      return
    }

    setLoading(true)
    setErrorMsg('')

    try {
      // Gọi song song: specs theo category, all specs (để hỗ trợ thêm spec lẻ), và specs hiện có của product (nếu có prodId)
      const requests: Promise<Response>[] = [
        fetch(`/api/v2/admin/specifications/by-category?categoryId=${catId}`),
        fetch(`/api/v2/admin/specifications`),
      ]

      if (prodId) {
        requests.push(fetch(`/api/v2/admin/products/${prodId}/specifications`))
      }

      const responses = await Promise.all(requests)
      const [categoryRes, allRes, prodRes] = responses

      if (!categoryRes.ok) throw new Error('Không thể tải thông số kỹ thuật cho danh mục')
      const categoryData = await categoryRes.json()

      let allSpecsList: SpecField[] = []
      if (allRes.ok) {
        const allData = await allRes.json()
        allSpecsList = allData.specs || []
        setAllSpecs(allSpecsList)
      }

      const loadedGroups: SpecGroup[] = categoryData.groups || []
      setGroups(loadedGroups)

      // Xây dựng mảng ID các spec thuộc category
      const categorySpecIds = new Set<string>()
      loadedGroups.forEach((g) => g.specs.forEach((s) => categorySpecIds.add(s.id)))

      // Nạp giá trị hiện có nếu đang edit
      const initialValues: Record<string, SpecValueState> = {}
      const loadedExtraSpecs: SpecField[] = []

      if (prodRes && prodRes.ok) {
        const prodData = await prodRes.json()
        if (Array.isArray(prodData.specs)) {
          prodData.specs.forEach((sv: any) => {
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
                  group_id: 'extra',
                  group_name: sv.group_name || 'Thông số bổ sung',
                  group_slug: 'extra',
                  name: sv.spec_name || sv.specification_id,
                  slug: sv.spec_slug || sv.specification_id,
                  data_type: sv.data_type || 'text',
                  unit: sv.unit || null,
                  description: null,
                })
              }
            }
          })
        }
      }

      setValues(initialValues)
      setExtraSpecs(loadedExtraSpecs)
    } catch (err: any) {
      console.error('[DynamicProductSpecs] error:', err)
      setErrorMsg(err.message || 'Lỗi khi tải thông số kỹ thuật')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSpecs(categoryId, productId)
  }, [categoryId, productId, fetchSpecs])

  // Cập nhật giá trị 1 spec
  const handleValueChange = (specId: string, patch: Partial<SpecValueState>) => {
    setValues((prev) => ({
      ...prev,
      [specId]: {
        ...(prev[specId] || { specification_id: specId }),
        ...patch,
      },
    }))
  }

  // Thêm spec ngoài danh mục
  const handleAddExtraSpec = (spec: SpecField) => {
    if (!extraSpecs.some((s) => s.id === spec.id)) {
      setExtraSpecs((prev) => [...prev, spec])
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

  // Tính toán số lượng thông số đã điền
  const { filledCount, totalCount, payloadJson } = useMemo(() => {
    // Tập hợp tất cả specs đang hiển thị (trong groups + extra)
    const displayedSpecs: SpecField[] = []
    groups.forEach((g) => displayedSpecs.push(...g.specs))
    displayedSpecs.push(...extraSpecs)

    // Lọc ra các spec có giá trị thực sự
    const validPayloadList: SpecValueState[] = []
    let filled = 0

    displayedSpecs.forEach((spec) => {
      const v = values[spec.id]
      if (!v) return

      const hasVal =
        (v.value_number !== null && v.value_number !== undefined) ||
        (v.value_text !== null && v.value_text !== undefined && v.value_text.trim() !== '') ||
        (v.value_boolean !== null && v.value_boolean !== undefined) ||
        (v.min_value !== null && v.min_value !== undefined) ||
        (v.max_value !== null && v.max_value !== undefined)

      if (hasVal) {
        filled++
        validPayloadList.push({
          specification_id: spec.id,
          value_number: v.value_number ?? null,
          value_text: v.value_text ? v.value_text.trim() : null,
          value_boolean: v.value_boolean ?? null,
          min_value: v.min_value ?? null,
          max_value: v.max_value ?? null,
          unit_override: v.unit_override ?? null,
          notes: v.notes ?? null,
        })
      } else {
        validPayloadList.push({
          specification_id: spec.id,
          value_number: null,
          value_text: null,
          value_boolean: null,
          min_value: null,
          max_value: null,
          unit_override: null,
          notes: null,
        })
      }
    })

    return {
      filledCount: filled,
      totalCount: displayedSpecs.length,
      payloadJson: JSON.stringify(validPayloadList),
    }
  }, [groups, extraSpecs, values])

  useEffect(() => {
    onCountChange?.(filledCount, totalCount)
  }, [filledCount, totalCount, onCountChange])

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

  // Danh sách specs có thể add thêm (chưa có trong category và chưa có trong extraSpecs)
  const availableToAdd = useMemo(() => {
    const existingIds = new Set<string>()
    groups.forEach((g) => g.specs.forEach((s) => existingIds.add(s.id)))
    extraSpecs.forEach((s) => existingIds.add(s.id))

    return allSpecs.filter((s) => !existingIds.has(s.id))
  }, [allSpecs, groups, extraSpecs])

  // Nếu chưa chọn danh mục
  if (!categoryId) {
    return (
      <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-6 sm:p-8 text-center">
        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 mx-auto flex items-center justify-center mb-3">
          <SlidersHorizontal className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-bold text-slate-800">
          Chưa chọn Danh mục sản phẩm
        </h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 leading-relaxed">
          Vui lòng chọn <strong>Danh mục sản phẩm</strong> ở bảng phía trên (Ví dụ: Switch, Camera, Router, Room System,...).
          Hệ thống sẽ tự động vẽ bảng thông số kỹ thuật đặc thù tương ứng.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      {/* Hidden input gửi payload JSON lên Server Action */}
      <input type="hidden" name={inputName} value={payloadJson} />

      {/* Header Bar của Form Thông số Động */}
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Thông số kỹ thuật đặc thù (Dynamic Specifications)
              </h2>
              {categoryName && (
                <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-full">
                  {categoryName}
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Hệ thống tự động sinh các ô nhập liệu chuẩn theo danh mục thiết bị đã chọn
            </p>
          </div>
        </div>

        {/* Trạng thái & Action */}
        <div className="flex items-center gap-2.5">
          <div className="text-right">
            <span className="text-xs font-bold text-blue-600 font-mono">
              {filledCount} / {totalCount}
            </span>
            <span className="text-[11px] text-slate-400 ml-1">thông số</span>
          </div>

          <button
            type="button"
            onClick={() => fetchSpecs(categoryId, productId)}
            disabled={loading}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors"
            title="Tải lại danh sách thông số"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 px-2.5 py-1.5 rounded-lg border border-blue-200/80 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Thêm thông số khác</span>
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="p-8 text-center space-y-3">
          <Loader2 className="w-7 h-7 text-blue-600 animate-spin mx-auto" />
          <p className="text-xs font-medium text-slate-600">
            Đang nhận diện danh mục và tạo form thông số kỹ thuật...
          </p>
        </div>
      )}

      {/* Error Banner */}
      {!loading && errorMsg && (
        <div className="m-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Content Form */}
      {!loading && !errorMsg && (
        <div className="p-6 space-y-6">
          {/* Search bar nếu có nhiều thông số */}
          {totalCount > 6 && (
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm nhanh thông số (cổng mạng, băng thông, PoE, độ phân giải,...)..."
                className="w-full text-xs pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:border-blue-500 transition-all"
              />
            </div>
          )}

          {/* Trường hợp danh mục chưa có thông số nào */}
          {groups.length === 0 && extraSpecs.length === 0 && (
            <div className="py-8 text-center space-y-2">
              <Info className="w-7 h-7 text-slate-400 mx-auto" />
              <p className="text-xs text-slate-600 font-semibold">
                Danh mục này hiện chưa được cấu hình tập thông số kỹ thuật đặc thù
              </p>
              <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                Bạn có thể bấm nút <strong>&quot;Thêm thông số khác&quot;</strong> ở trên để bổ sung thông số, hoặc vào mục <strong>Quản lý Thông số</strong> để gán thông số cho danh mục.
              </p>
            </div>
          )}

          {/* Render Groups */}
          {filteredGroups.map((group) => (
            <div key={group.group_id} className="space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                <span className="w-1.5 h-3.5 bg-blue-600 rounded-full" />
                <h4 className="text-xs font-bold text-slate-800 tracking-wide uppercase">
                  {group.group_name}
                </h4>
                <span className="text-[10px] text-slate-400 font-mono">
                  ({group.specs.length})
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {group.specs.map((spec) => (
                  <SpecFieldItem
                    key={spec.id}
                    spec={spec}
                    value={values[spec.id] || { specification_id: spec.id }}
                    onChange={(patch) => handleValueChange(spec.id, patch)}
                  />
                ))}
              </div>
            </div>
          ))}

          {/* Render Extra Specs (nếu có thêm lẻ ngoài danh mục) */}
          {extraSpecs.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                <span className="w-1.5 h-3.5 bg-amber-500 rounded-full" />
                <h4 className="text-xs font-bold text-slate-800 tracking-wide uppercase">
                  Thông số bổ sung ngoài danh mục
                </h4>
                <span className="text-[10px] text-amber-600 bg-amber-50 px-1.5 py-0.2 rounded font-mono">
                  {extraSpecs.length}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {extraSpecs.map((spec) => (
                  <SpecFieldItem
                    key={spec.id}
                    spec={spec}
                    value={values[spec.id] || { specification_id: spec.id }}
                    onChange={(patch) => handleValueChange(spec.id, patch)}
                    onRemove={() => handleRemoveExtraSpec(spec.id)}
                    isExtra={true}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal: Chọn thêm thông số khác */}
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
                  Tất cả các thông số trong thư viện đã được hiển thị trên form.
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
