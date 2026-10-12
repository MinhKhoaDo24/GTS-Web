'use client'

import { useState, useTransition } from 'react'
import {
  Plus, Trash2, Edit2, Check, X, Loader2,
  Layers, ChevronDown, ChevronUp, ToggleLeft, ToggleRight
} from 'lucide-react'
import { useToast } from '@/components/admin/ui/Toast'
import { ConfirmDialog } from '@/components/admin/ui/ConfirmDialog'
import type { ProductVariant } from '@/lib/dal/product-extras'

interface VariantsManagerProps {
  productId: string
  initialVariants: ProductVariant[]
}

interface VariantFormData {
  sku: string
  pid: string
  part_number: string
  model_number: string
  variant_name: string
  region: string
  color: string
  bundle: string
  specifications_summary: string
  status: string
  notes: string
  is_active: boolean
}

const emptyForm = (): VariantFormData => ({
  sku: '',
  pid: '',
  part_number: '',
  model_number: '',
  variant_name: '',
  region: '',
  color: '',
  bundle: '',
  specifications_summary: '',
  status: 'active',
  notes: '',
  is_active: true,
})

function variantToForm(v: ProductVariant): VariantFormData {
  return {
    sku: v.sku ?? '',
    pid: v.pid ?? '',
    part_number: v.part_number ?? '',
    model_number: v.model_number ?? '',
    variant_name: v.variant_name ?? '',
    region: v.region ?? '',
    color: v.color ?? '',
    bundle: v.bundle ?? '',
    specifications_summary: v.specifications_summary ?? '',
    status: v.status ?? 'active',
    notes: v.notes ?? '',
    is_active: v.is_active,
  }
}

const inputCls = 'w-full text-xs bg-white border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all placeholder:text-slate-400'

export function VariantsManager({ productId, initialVariants }: VariantsManagerProps) {
  const { success, error } = useToast()
  const [isPending, startTransition] = useTransition()
  const [variants, setVariants] = useState<ProductVariant[]>(initialVariants)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showNewForm, setShowNewForm] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [newForm, setNewForm] = useState<VariantFormData>(emptyForm())
  const [editForm, setEditForm] = useState<VariantFormData>(emptyForm())
  const [deleteTarget, setDeleteTarget] = useState<ProductVariant | null>(null)

  const refreshVariants = async () => {
    const res = await fetch(`/api/v2/admin/products/${productId}/variants`)
    if (res.ok) {
      const json = await res.json()
      setVariants(json.data ?? [])
    }
  }

  const handleCreate = () => {
    startTransition(async () => {
      try {
        const res = await fetch(`/api/v2/admin/products/${productId}/variants`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...newForm,
            sku: newForm.sku || null,
            pid: newForm.pid || null,
            part_number: newForm.part_number || null,
            model_number: newForm.model_number || null,
            variant_name: newForm.variant_name || null,
            region: newForm.region || null,
            color: newForm.color || null,
            bundle: newForm.bundle || null,
            specifications_summary: newForm.specifications_summary || null,
            notes: newForm.notes || null,
          }),
        })
        if (!res.ok) throw new Error()
        setShowNewForm(false)
        setNewForm(emptyForm())
        await refreshVariants()
        success('Đã tạo variant mới')
      } catch {
        error('Lỗi', 'Không thể tạo variant')
      }
    })
  }

  const handleUpdate = (variantId: string) => {
    startTransition(async () => {
      try {
        const res = await fetch(
          `/api/v2/admin/products/${productId}/variants?variantId=${variantId}`,
          {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...editForm,
              sku: editForm.sku || null,
              pid: editForm.pid || null,
              part_number: editForm.part_number || null,
              model_number: editForm.model_number || null,
              variant_name: editForm.variant_name || null,
              region: editForm.region || null,
              color: editForm.color || null,
              bundle: editForm.bundle || null,
              specifications_summary: editForm.specifications_summary || null,
              notes: editForm.notes || null,
            }),
          }
        )
        if (!res.ok) throw new Error()
        setEditingId(null)
        await refreshVariants()
        success('Đã cập nhật variant')
      } catch {
        error('Lỗi', 'Không thể cập nhật variant')
      }
    })
  }

  const handleDelete = (variant: ProductVariant) => {
    startTransition(async () => {
      try {
        const res = await fetch(
          `/api/v2/admin/products/${productId}/variants?variantId=${variant.id}`,
          { method: 'DELETE' }
        )
        if (!res.ok) throw new Error()
        setVariants(prev => prev.filter(v => v.id !== variant.id))
        success('Đã xóa variant')
      } catch {
        error('Lỗi', 'Không thể xóa variant')
      }
      setDeleteTarget(null)
    })
  }

  const handleToggleActive = (variant: ProductVariant) => {
    startTransition(async () => {
      const res = await fetch(
        `/api/v2/admin/products/${productId}/variants?variantId=${variant.id}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ is_active: !variant.is_active }),
        }
      )
      if (res.ok) {
        setVariants(prev =>
          prev.map(v => v.id === variant.id ? { ...v, is_active: !v.is_active } : v)
        )
        success(variant.is_active ? 'Đã ẩn variant' : 'Đã kích hoạt variant')
      } else {
        error('Lỗi', 'Không thể thay đổi trạng thái')
      }
    })
  }

  const startEdit = (v: ProductVariant) => {
    setEditingId(v.id)
    setEditForm(variantToForm(v))
    setExpandedId(v.id)
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Layers className="w-4 h-4 text-purple-600" />
            Quản lý Variant / SKU
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {variants.length} variant · Mỗi variant đại diện cho một phiên bản sản phẩm
          </p>
        </div>
        <button
          type="button"
          onClick={() => { setShowNewForm(true); setEditingId(null) }}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 px-3 py-2 rounded-xl transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Thêm Variant
        </button>
      </div>

      {/* New Variant Form */}
      {showNewForm && (
        <div className="border border-purple-200 bg-purple-50/50 rounded-2xl p-4 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-purple-800 uppercase tracking-wider">Variant mới</p>
            <button
              type="button"
              onClick={() => { setShowNewForm(false); setNewForm(emptyForm()) }}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <VariantFormFields form={newForm} onChange={setNewForm} />
          <div className="flex justify-end gap-2 pt-2 border-t border-purple-100">
            <button
              type="button"
              onClick={() => { setShowNewForm(false); setNewForm(emptyForm()) }}
              className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={handleCreate}
              disabled={isPending}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-xl transition-colors disabled:opacity-60"
            >
              {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
              Tạo Variant
            </button>
          </div>
        </div>
      )}

      {/* Variants List */}
      {variants.length === 0 && !showNewForm ? (
        <div className="border-2 border-dashed border-slate-200 rounded-2xl p-10 text-center">
          <Layers className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-medium text-slate-500">Chưa có variant nào</p>
          <p className="text-xs text-slate-400 mt-1">Thêm các phiên bản SKU, part number cho sản phẩm</p>
        </div>
      ) : (
        <div className="space-y-2">
          {variants.map((variant) => {
            const isEditing = editingId === variant.id
            const isExpanded = expandedId === variant.id

            return (
              <div
                key={variant.id}
                className={`border rounded-2xl overflow-hidden transition-all ${
                  isEditing
                    ? 'border-purple-300 bg-purple-50/30'
                    : variant.is_active
                    ? 'border-slate-200 bg-white'
                    : 'border-slate-100 bg-slate-50/50'
                }`}
              >
                {/* Variant Row Header */}
                <div className="flex items-center justify-between px-4 py-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setExpandedId(isExpanded ? null : variant.id)}
                    className="flex items-center gap-3 flex-1 min-w-0 text-left"
                  >
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        {variant.sku && (
                          <span className="text-xs font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                            {variant.sku}
                          </span>
                        )}
                        {variant.part_number && (
                          <span className="text-xs font-mono text-slate-600 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded">
                            {variant.part_number}
                          </span>
                        )}
                        {variant.variant_name && (
                          <span className="text-xs text-slate-700">{variant.variant_name}</span>
                        )}
                        {!variant.sku && !variant.part_number && !variant.variant_name && (
                          <span className="text-xs text-slate-400 italic">Variant không tên</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        {variant.region && (
                          <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                            {variant.region}
                          </span>
                        )}
                        {variant.color && (
                          <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                            {variant.color}
                          </span>
                        )}
                        {!variant.is_active && (
                          <span className="text-[10px] font-bold text-orange-600 bg-orange-50 border border-orange-200 px-1.5 py-0.5 rounded">
                            Đã ẩn
                          </span>
                        )}
                      </div>
                    </div>
                    {isExpanded
                      ? <ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0" />
                      : <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    }
                  </button>

                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => handleToggleActive(variant)}
                      disabled={isPending}
                      className={`p-1.5 rounded-lg transition-colors ${
                        variant.is_active
                          ? 'text-emerald-600 hover:bg-emerald-50'
                          : 'text-slate-400 hover:bg-slate-100'
                      }`}
                      title={variant.is_active ? 'Ẩn variant' : 'Kích hoạt variant'}
                    >
                      {variant.is_active
                        ? <ToggleRight className="w-5 h-5" />
                        : <ToggleLeft className="w-5 h-5" />
                      }
                    </button>
                    <button
                      type="button"
                      onClick={() => startEdit(variant)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-purple-600 hover:bg-purple-50 transition-colors"
                      title="Chỉnh sửa"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(variant)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Xóa variant"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Expanded: View or Edit */}
                {isExpanded && (
                  <div className="border-t border-slate-100 p-4">
                    {isEditing ? (
                      <div className="space-y-4">
                        <VariantFormFields form={editForm} onChange={setEditForm} />
                        <div className="flex justify-end gap-2 pt-2">
                          <button
                            type="button"
                            onClick={() => setEditingId(null)}
                            className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
                          >
                            Hủy
                          </button>
                          <button
                            type="button"
                            onClick={() => handleUpdate(variant.id)}
                            disabled={isPending}
                            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-xl disabled:opacity-60"
                          >
                            {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                            Lưu
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {[
                          ['SKU', variant.sku],
                          ['PID', variant.pid],
                          ['Part Number', variant.part_number],
                          ['Model Number', variant.model_number],
                          ['Khu vực', variant.region],
                          ['Màu sắc', variant.color],
                          ['Bundle', variant.bundle],
                          ['Trạng thái', variant.status],
                        ].map(([label, val]) =>
                          val ? (
                            <div key={label}>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
                              <p className="text-xs font-medium text-slate-700 font-mono mt-0.5">{val}</p>
                            </div>
                          ) : null
                        )}
                        {variant.specifications_summary && (
                          <div className="col-span-full">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tóm tắt thông số</p>
                            <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{variant.specifications_summary}</p>
                          </div>
                        )}
                        {variant.notes && (
                          <div className="col-span-full">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Ghi chú</p>
                            <p className="text-xs text-slate-600 mt-0.5">{variant.notes}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={!!deleteTarget}
        title="Xóa Variant"
        message={`Bạn có chắc muốn xóa variant "${deleteTarget?.sku ?? deleteTarget?.variant_name ?? 'này'}"? Hành động này không thể hoàn tác.`}
        confirmLabel="Xóa variant"
        danger={true}
        onConfirm={() => deleteTarget && handleDelete(deleteTarget)}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}

// ─── Sub-component: Form Fields ─────────────────────────────────────────────

function VariantFormFields({
  form,
  onChange,
}: {
  form: VariantFormData
  onChange: (f: VariantFormData) => void
}) {
  const set = (key: keyof VariantFormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    onChange({ ...form, [key]: e.target.value })

  return (
    <div className="space-y-4">
      {/* Row 1 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">SKU</label>
          <input type="text" value={form.sku} onChange={set('sku')} placeholder="SKU-001" className={inputCls} />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Part Number</label>
          <input type="text" value={form.part_number} onChange={set('part_number')} placeholder="C9300-24T-A" className={inputCls} />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">PID</label>
          <input type="text" value={form.pid} onChange={set('pid')} placeholder="PID" className={inputCls} />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Model Number</label>
          <input type="text" value={form.model_number} onChange={set('model_number')} placeholder="Số model" className={inputCls} />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Tên Variant</label>
          <input type="text" value={form.variant_name} onChange={set('variant_name')} placeholder="VD: Standard (US)" className={inputCls} />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Khu vực</label>
          <input type="text" value={form.region} onChange={set('region')} placeholder="US / EU / APAC" className={inputCls} />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Màu sắc</label>
          <input type="text" value={form.color} onChange={set('color')} placeholder="Màu" className={inputCls} />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Bundle</label>
          <input type="text" value={form.bundle} onChange={set('bundle')} placeholder="Nội dung đi kèm" className={inputCls} />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Trạng thái</label>
          <select value={form.status} onChange={set('status')} className={inputCls}>
            <option value="active">Active</option>
            <option value="discontinued">Discontinued</option>
            <option value="eol">End of Life</option>
            <option value="preview">Preview</option>
          </select>
        </div>
      </div>

      {/* Specs Summary */}
      <div>
        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Tóm tắt thông số</label>
        <textarea
          value={form.specifications_summary}
          onChange={set('specifications_summary')}
          rows={2}
          placeholder="Mô tả ngắn thông số kỹ thuật của variant này..."
          className={inputCls + ' resize-none'}
        />
      </div>

      {/* Notes */}
      <div>
        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Ghi chú nội bộ</label>
        <textarea
          value={form.notes}
          onChange={set('notes')}
          rows={2}
          placeholder="Ghi chú riêng (không hiển thị ra ngoài)..."
          className={inputCls + ' resize-none'}
        />
      </div>

      {/* Active toggle */}
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={form.is_active}
          onChange={e => onChange({ ...form, is_active: e.target.checked })}
          className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
        />
        <span className="text-xs font-semibold text-slate-700">Kích hoạt variant này</span>
      </label>
    </div>
  )
}
