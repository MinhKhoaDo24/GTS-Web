'use client'

/**
 * SpecificationsManager — Dynamic Form cho Thông số kỹ thuật sản phẩm
 *
 * Luồng hoạt động (3 bước):
 *  Bước 1: Component nhận category_id hiện tại của sản phẩm
 *  Bước 2: Fetch API → lấy danh sách specs của category → render Dynamic Fields
 *  Bước 3: Admin điền → nhấn Lưu → POST lên /api/v2/admin/products/[id]/specifications
 *
 * Hỗ trợ data_type: text, number, boolean, select, range
 */

import { useCallback, useEffect, useState } from 'react'
import {
  Save, Loader2, RefreshCw, AlertCircle, CheckCircle2,
  Settings2, ChevronDown, Info, Zap,
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
}: {
  spec: SpecField
  value: SpecValue
  onChange: (val: Partial<SpecValue>) => void
}) {
  const labelEl = (
    <div className="flex items-center gap-1.5 mb-1.5">
      <label className="block text-xs font-semibold text-slate-700">{spec.name}</label>
      {spec.unit && (
        <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded font-mono">
          {spec.unit}
        </span>
      )}
      {spec.description && (
        <span title={spec.description} className="cursor-help">
          <Info className="w-3 h-3 text-slate-400" />
        </span>
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
              value={value.min_value ?? ''}
              onChange={(e) =>
                onChange({ min_value: e.target.value !== '' ? Number(e.target.value) : null })
              }
              placeholder="Min"
              className={inputCls}
            />
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">
              MIN
            </span>
          </div>
          <div className="relative">
            <input
              type="number"
              value={value.max_value ?? ''}
              onChange={(e) =>
                onChange({ max_value: e.target.value !== '' ? Number(e.target.value) : null })
              }
              placeholder="Max"
              className={inputCls}
            />
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">
              MAX {spec.unit ?? ''}
            </span>
          </div>
        </div>
      </div>
    )
  }

  // ── boolean ───────────────────────────────────────────────────────────────
  if (spec.data_type === 'boolean') {
    const isOn = value.value_boolean === true
    return (
      <div>
        {labelEl}
        <button
          type="button"
          onClick={() => onChange({ value_boolean: isOn ? null : true })}
          className={`
            flex items-center justify-between w-full p-3 rounded-xl border transition-all
            ${isOn
              ? 'border-blue-200 bg-blue-50/50 text-blue-800'
              : 'border-slate-200 bg-slate-50/50 text-slate-500'
            }
          `}
        >
          <span className="text-sm font-medium">
            {isOn ? '✓ Có' : 'Không / Chưa xác định'}
          </span>
          <div
            className={`w-9 h-5 rounded-full transition-colors relative flex-shrink-0 ${
              isOn ? 'bg-blue-500' : 'bg-slate-300'
            }`}
          >
            <span
              className={`block w-4 h-4 rounded-full bg-white shadow-xs transform transition-transform mt-0.5 ${
                isOn ? 'translate-x-4.5' : 'translate-x-0.5'
              }`}
            />
          </div>
        </button>
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
  const [groups, setGroups] = useState<SpecGroup[]>([])
  const [values, setValues] = useState<Record<string, SpecValue>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [savedCount, setSavedCount] = useState(0)

  // ── Fetch spec definitions + existing values ──────────────────────────────

  const loadData = useCallback(async () => {
    if (!categoryId) return
    setLoading(true)
    setStatus('idle')

    try {
      // Bước 1: Lấy spec schema theo category
      const [schemaRes, valuesRes] = await Promise.all([
        fetch(`/api/v2/admin/specifications/by-category?categoryId=${categoryId}`),
        fetch(`/api/v2/admin/products/${productId}/specifications`),
      ])

      const schemaData = await schemaRes.json()
      const valuesData = await valuesRes.json()

      // Build initial values map từ existing product specs
      const initialValues: Record<string, SpecValue> = {}
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
        }
      }

      // Điền giá trị mặc định cho các spec chưa có value
      const allGroups: SpecGroup[] = schemaData.groups ?? []
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
    } catch (e: any) {
      setStatus('error')
      setErrorMsg(e.message ?? 'Có lỗi xảy ra khi lưu thông số')
    } finally {
      setSaving(false)
    }
  }

  // ── Đếm số trường đã điền ─────────────────────────────────────────────────

  const filledCount = Object.values(values).filter((v) =>
    v.value_number !== null ||
    (v.value_text !== null && v.value_text !== '') ||
    v.value_boolean === true ||
    v.min_value !== null ||
    v.max_value !== null
  ).length

  const totalFields = Object.keys(values).length

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

  if (groups.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center mb-4">
          <AlertCircle className="w-7 h-7 text-amber-400" />
        </div>
        <p className="text-sm font-semibold text-slate-700">Chưa có thông số nào được định nghĩa</p>
        <p className="text-xs text-slate-400 mt-1 max-w-xs">
          Cần tạo Specification Groups và Specifications trong phần quản lý cơ sở dữ liệu
        </p>
        <button
          type="button"
          onClick={loadData}
          className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Tải lại
        </button>
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
            <h3 className="text-sm font-bold text-slate-900">Thông số kỹ thuật động</h3>
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
            Đã lưu thành công {savedCount} thông số kỹ thuật vào cơ sở dữ liệu
          </p>
        </div>
      )}

      {status === 'error' && (
        <div className="flex items-center gap-3 p-3.5 bg-rose-50 border border-rose-200 rounded-xl">
          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          <p className="text-sm text-rose-800 font-medium">{errorMsg}</p>
        </div>
      )}

      {/* Dynamic Spec Groups */}
      {groups.map((group) => (
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

              // range chiếm 2 cột
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
    </div>
  )
}
