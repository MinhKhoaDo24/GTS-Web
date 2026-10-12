'use client'

/**
 * CategorySpecMappingTab.tsx
 * 
 * Cho phép Admin cấu hình danh mục nào được phép sử dụng những thông số kỹ thuật nào
 * (dựa trên bảng category_specifications).
 * 
 * Ví dụ:
 * - Danh mục "Switch": chỉ tick các thông số mạng (Cổng kết nối, Switching Capacity, PoE,...)
 * - Danh mục "Camera": chỉ tick các thông số video/hình ảnh (Resolution, Sensor, FOV, HDMI,...)
 */

import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Layers, Check, Loader2, Save, AlertCircle, CheckCircle2,
  FolderTree, RefreshCw, Filter, CheckSquare, Square, Info
} from 'lucide-react'

interface Category {
  id: string
  name: string
  parent_id?: string | null
}

interface SpecGroup {
  id: string
  name: string
  sort_order: number
}

interface Spec {
  id: string
  group_id: string
  group_name: string
  name: string
  slug: string
  data_type: string
  unit: string | null
  is_active: boolean
}

interface Props {
  categories: Category[]
  groups: SpecGroup[]
  specs: Spec[]
}

export function CategorySpecMappingTab({ categories, groups, specs }: Props) {
  const [selectedCatId, setSelectedCatId] = useState<string>(categories[0]?.id || '')
  const [mappedSpecIds, setMappedSpecIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [statusMsg, setStatusMsg] = useState('')

  // Tải danh sách mapping của category hiện tại
  const loadMappings = useCallback(async (catId: string) => {
    if (!catId) return
    setLoading(true)
    setStatus('idle')

    try {
      const res = await fetch(`/api/v2/admin/categories/${catId}/specifications`)
      if (!res.ok) throw new Error('Không thể tải liên kết thông số của danh mục')
      const data = await res.json()
      setMappedSpecIds(new Set(data.specificationIds || []))
    } catch (err: any) {
      console.error(err)
      setStatus('error')
      setStatusMsg(err.message || 'Lỗi khi tải dữ liệu liên kết')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (selectedCatId) {
      loadMappings(selectedCatId)
    }
  }, [selectedCatId, loadMappings])

  // Toggle 1 thông số
  const toggleSpec = (specId: string) => {
    setMappedSpecIds((prev) => {
      const next = new Set(prev)
      if (next.has(specId)) {
        next.delete(specId)
      } else {
        next.add(specId)
      }
      return next
    })
  }

  // Chọn toàn bộ trong 1 nhóm
  const selectAllInGroup = (groupId: string) => {
    const groupSpecs = specs.filter((s) => s.group_id === groupId)
    setMappedSpecIds((prev) => {
      const next = new Set(prev)
      groupSpecs.forEach((s) => next.add(s.id))
      return next
    })
  }

  // Bỏ chọn toàn bộ trong 1 nhóm
  const deselectAllInGroup = (groupId: string) => {
    const groupSpecs = specs.filter((s) => s.group_id === groupId)
    setMappedSpecIds((prev) => {
      const next = new Set(prev)
      groupSpecs.forEach((s) => next.delete(s.id))
      return next
    })
  }

  // Lưu cấu hình
  const handleSave = async () => {
    if (!selectedCatId) return
    setSaving(true)
    setStatus('idle')

    try {
      const res = await fetch(`/api/v2/admin/categories/${selectedCatId}/specifications`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          specificationIds: Array.from(mappedSpecIds),
        }),
      })

      if (!res.ok) throw new Error('Không thể lưu cấu hình danh mục')
      const data = await res.json()
      setStatus('success')
      setStatusMsg(`Đã gắn ${mappedSpecIds.size} thông số cho danh mục thành công!`)
      setTimeout(() => setStatus('idle'), 4000)
    } catch (err: any) {
      setStatus('error')
      setStatusMsg(err.message || 'Lỗi khi lưu cấu hình')
    } finally {
      setSaving(false)
    }
  }

  const selectedCategory = categories.find((c) => c.id === selectedCatId)

  return (
    <div className="space-y-6">
      {/* Top Banner giải thích */}
      <div className="bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 border border-blue-200/80 rounded-2xl p-5">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <FolderTree className="w-4 h-4" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-900">
              Cấu hình Thông số kỹ thuật theo Danh mục (Category Specifications)
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
              Quy định tập thông số đặc thù cho từng danh mục sản phẩm. Khi nhân viên thêm sản phẩm thuộc danh mục đó,
              hệ thống sẽ tự động chỉ sinh ra các ô nhập liệu thuộc danh sách này, loại bỏ các trường không liên quan
              (Ví dụ: Switch chỉ có thông số mạng & PoE, Camera chỉ có độ phân giải & góc nhìn).
            </p>
          </div>
        </div>
      </div>

      {/* Control Bar: Chọn Danh mục & Thao tác Lưu */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1 max-w-md space-y-1.5">
          <label className="block text-xs font-bold text-slate-700">
            Chọn Danh mục cần cấu hình:
          </label>
          <div className="relative">
            <select
              value={selectedCatId}
              onChange={(e) => setSelectedCatId(e.target.value)}
              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 font-semibold focus:outline-none focus:border-blue-500 focus:bg-white transition-all cursor-pointer"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.parent_id ? `↳ ${c.name}` : c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3 justify-end">
          <div className="text-right">
            <span className="text-xs font-bold text-blue-600 font-mono">
              {mappedSpecIds.size} / {specs.length}
            </span>
            <span className="text-[11px] text-slate-400 ml-1">thông số đã chọn</span>
          </div>

          <button
            type="button"
            onClick={() => loadMappings(selectedCatId)}
            disabled={loading}
            className="p-2.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200"
            title="Tải lại"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving || loading}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 text-xs font-semibold rounded-xl transition-all shadow-xs disabled:opacity-60"
          >
            {saving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Đang lưu...</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Lưu liên kết danh mục</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Notification Banner */}
      {status === 'success' && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{statusMsg}</span>
        </div>
      )}

      {status === 'error' && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{statusMsg}</span>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-8 text-center space-y-3">
          <Loader2 className="w-7 h-7 text-blue-600 animate-spin mx-auto" />
          <p className="text-xs text-slate-500 font-medium">
            Đang tải dữ liệu liên kết thông số cho danh mục {selectedCategory?.name}...
          </p>
        </div>
      )}

      {/* Danh sách thông số theo từng Nhóm */}
      {!loading && (
        <div className="space-y-5">
          {groups.map((group) => {
            const groupSpecs = specs.filter((s) => s.group_id === group.id)
            if (groupSpecs.length === 0) return null

            const selectedInGroup = groupSpecs.filter((s) => mappedSpecIds.has(s.id)).length
            const isAllSelected = selectedInGroup === groupSpecs.length
            const isNoneSelected = selectedInGroup === 0

            return (
              <div
                key={group.id}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden"
              >
                {/* Group Header */}
                <div className="px-5 py-3.5 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-3.5 bg-blue-600 rounded-full" />
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                      {group.name}
                    </h4>
                    <span className="text-[11px] text-slate-400 font-mono">
                      ({selectedInGroup} / {groupSpecs.length} đã chọn)
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => selectAllInGroup(group.id)}
                      className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 hover:underline px-2 py-1"
                    >
                      Chọn tất cả
                    </button>
                    <span className="text-slate-300">|</span>
                    <button
                      type="button"
                      onClick={() => deselectAllInGroup(group.id)}
                      className="text-[11px] font-semibold text-slate-500 hover:text-slate-700 hover:underline px-2 py-1"
                    >
                      Bỏ chọn
                    </button>
                  </div>
                </div>

                {/* Specs Checkbox Grid */}
                <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
                  {groupSpecs.map((spec) => {
                    const isChecked = mappedSpecIds.has(spec.id)
                    return (
                      <div
                        key={spec.id}
                        onClick={() => toggleSpec(spec.id)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-2.5 ${
                          isChecked
                            ? 'bg-blue-50/40 border-blue-300 shadow-xs'
                            : 'bg-white border-slate-200/80 hover:border-slate-300 hover:bg-slate-50/50'
                        }`}
                      >
                        <div className="mt-0.5 shrink-0">
                          {isChecked ? (
                            <div className="w-4 h-4 rounded-md bg-blue-600 text-white flex items-center justify-center">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </div>
                          ) : (
                            <div className="w-4 h-4 rounded-md border border-slate-300 bg-white" />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p
                            className={`text-xs font-semibold truncate ${
                              isChecked ? 'text-blue-900' : 'text-slate-700'
                            }`}
                          >
                            {spec.name}
                          </p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[10px] text-slate-400 font-mono">
                              {spec.data_type}
                            </span>
                            {spec.unit && (
                              <span className="text-[10px] bg-slate-100 text-slate-600 px-1 rounded font-mono">
                                {spec.unit}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
