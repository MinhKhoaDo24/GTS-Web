'use client'

import { useState, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  Inbox, Phone, Mail, Building, Package, Calendar,
  CheckCircle2, Clock, XCircle, AlertCircle, Trash2, Eye,
  ChevronLeft, ChevronRight, X
} from 'lucide-react'
import { useToast } from '@/components/admin/ui/Toast'
import { ConfirmDialog } from '@/components/admin/ui/ConfirmDialog'
import { formatDate } from '@/lib/utils'

interface ContactItem {
  id: string
  full_name: string
  company_name: string | null
  email: string
  phone: string
  request_type: string
  product_id: string | null
  product_name: string | null
  message: string
  status: string
  created_at: Date
}

interface ContactsTableClientProps {
  items: ContactItem[]
  total: number
  page: number
  limit: number
  totalPages: number
  currentStatus?: string
}

const statusConfig: Record<string, { label: string; badge: string; icon: any }> = {
  new: { label: 'Mới nhận', badge: 'bg-red-50 text-red-700 border-red-200', icon: AlertCircle },
  contacted: { label: 'Đã liên hệ', badge: 'bg-amber-50 text-amber-700 border-amber-200', icon: Clock },
  resolved: { label: 'Đã hoàn thành', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircle2 },
  cancelled: { label: 'Đã hủy', badge: 'bg-gray-100 text-gray-500 border-gray-200', icon: XCircle },
}

export function ContactsTableClient({
  items,
  total,
  page,
  limit,
  totalPages,
  currentStatus = '',
}: ContactsTableClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { success, error } = useToast()
  const [isPending, startTransition] = useTransition()

  const [activeItems, setActiveItems] = useState<ContactItem[]>(items)
  const [selectedContact, setSelectedContact] = useState<ContactItem | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<ContactItem | null>(null)

  if (items !== activeItems && !isPending) {
    setActiveItems(items)
  }

  const handleStatusChange = (id: string, newStatus: string) => {
    setActiveItems((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
    )
    if (selectedContact && selectedContact.id === id) {
      setSelectedContact((prev) => prev ? { ...prev, status: newStatus } : null)
    }

    startTransition(async () => {
      const res = await fetch(`/api/v2/admin/contacts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (res.ok) {
        success('Cập nhật thành công', `Đã chuyển trạng thái sang "${statusConfig[newStatus]?.label}"`)
        router.refresh()
      } else {
        error('Lỗi', 'Không thể đổi trạng thái')
        router.refresh()
      }
    })
  }

  const handleDelete = () => {
    if (!deleteTarget) return
    startTransition(async () => {
      const res = await fetch(`/api/v2/admin/contacts/${deleteTarget.id}`, { method: 'DELETE' })
      if (res.ok) {
        success('Đã xóa', 'Yêu cầu liên hệ đã được xóa')
        if (selectedContact?.id === deleteTarget.id) setSelectedContact(null)
        router.refresh()
      } else {
        error('Lỗi', 'Không thể xóa yêu cầu')
      }
      setDeleteTarget(null)
    })
  }

  const setFilterStatus = (st: string) => {
    const p = new URLSearchParams(searchParams.toString())
    if (st) p.set('status', st)
    else p.delete('status')
    p.set('page', '1')
    router.push(`/admin/contacts?${p.toString()}`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Yêu cầu liên hệ & Báo giá</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {total} yêu cầu từ khách hàng doanh nghiệp B2B
          </p>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-gray-200">
        {[
          { key: '', label: 'Tất cả' },
          { key: 'new', label: 'Mới nhận' },
          { key: 'contacted', label: 'Đã liên hệ' },
          { key: 'resolved', label: 'Đã hoàn thành' },
          { key: 'cancelled', label: 'Đã hủy' },
        ].map((tab) => {
          const isActive = currentStatus === tab.key
          return (
            <button
              key={tab.key}
              onClick={() => setFilterStatus(tab.key)}
              className={`px-3.5 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Table */}
      <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden ${isPending ? 'opacity-60' : ''}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Khách hàng / Doanh nghiệp</th>
                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Liên hệ</th>
                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Loại yêu cầu</th>
                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Sản phẩm quan tâm</th>
                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Trạng thái xử lý</th>
                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {activeItems.map((c) => (
                <tr
                  key={c.id}
                  className={`hover:bg-gray-50/70 transition-colors group cursor-pointer ${
                    c.status === 'new' ? 'bg-blue-50/20' : ''
                  }`}
                  onClick={() => setSelectedContact(c)}
                >
                  {/* Customer & Company */}
                  <td className="px-5 py-3.5">
                    <div className="font-semibold text-gray-900 flex items-center gap-2">
                      {c.status === 'new' && (
                        <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
                      )}
                      <span>{c.full_name}</span>
                    </div>
                    {c.company_name ? (
                      <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                        <Building className="w-3 h-3 text-gray-400" />
                        <span>{c.company_name}</span>
                      </div>
                    ) : (
                      <div className="text-xs text-gray-400 mt-0.5">Khách hàng cá nhân</div>
                    )}
                  </td>

                  {/* Phone & Email */}
                  <td className="px-5 py-3.5 text-xs" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-1.5 text-gray-700 font-medium">
                      <Phone className="w-3 h-3 text-gray-400" />
                      <a href={`tel:${c.phone}`} className="hover:text-blue-600 hover:underline">
                        {c.phone}
                      </a>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-500 mt-0.5">
                      <Mail className="w-3 h-3 text-gray-400" />
                      <a href={`mailto:${c.email}`} className="hover:text-blue-600 hover:underline">
                        {c.email}
                      </a>
                    </div>
                  </td>

                  {/* Request Type */}
                  <td className="px-5 py-3.5 text-xs">
                    <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium">
                      {c.request_type || 'Tư vấn chung'}
                    </span>
                    <div className="text-[11px] text-gray-400 mt-1 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(c.created_at)}</span>
                    </div>
                  </td>

                  {/* Product Referenced */}
                  <td className="px-5 py-3.5 text-xs">
                    {c.product_name ? (
                      <div className="flex items-center gap-1.5 text-blue-700 font-medium max-w-xs truncate">
                        <Package className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="truncate">{c.product_name}</span>
                      </div>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>

                  {/* Status Dropdown */}
                  <td className="px-5 py-3.5" onClick={(e) => e.stopPropagation()}>
                    <select
                      value={c.status}
                      onChange={(e) => handleStatusChange(c.id, e.target.value)}
                      className={`text-xs font-semibold px-2.5 py-1 rounded-lg border focus:outline-none transition-colors ${
                        statusConfig[c.status]?.badge || 'bg-gray-100 text-gray-700 border-gray-200'
                      }`}
                    >
                      <option value="new">Mới nhận</option>
                      <option value="contacted">Đã liên hệ</option>
                      <option value="resolved">Đã hoàn thành</option>
                      <option value="cancelled">Đã hủy</option>
                    </select>
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => setSelectedContact(c)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        title="Xem chi tiết"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(c)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Xóa yêu cầu"
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

        {activeItems.length === 0 && (
          <div className="py-20 text-center text-gray-400 text-sm">
            Không có yêu cầu liên hệ nào
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between">
            <span className="text-xs text-gray-500">
              Trang {page} / {totalPages} (Tổng cộng {total} yêu cầu)
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => {
                  const p = new URLSearchParams(searchParams.toString())
                  p.set('page', String(page - 1))
                  router.push(`/admin/contacts?${p.toString()}`)
                }}
                className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => {
                  const p = new URLSearchParams(searchParams.toString())
                  p.set('page', String(page + 1))
                  router.push(`/admin/contacts?${p.toString()}`)
                }}
                className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedContact && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <h2 className="font-bold text-gray-900 text-base">Chi tiết yêu cầu liên hệ</h2>
                <div className="text-xs text-gray-400 mt-0.5">
                  Ngày gửi: {formatDate(selectedContact.created_at)}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedContact(null)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-sm">
              {/* Customer info */}
              <div className="bg-gray-50 p-4 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-gray-900 text-base">{selectedContact.full_name}</div>
                  <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${statusConfig[selectedContact.status]?.badge}`}>
                    {statusConfig[selectedContact.status]?.label}
                  </span>
                </div>
                {selectedContact.company_name && (
                  <div className="text-gray-600 flex items-center gap-1.5">
                    <Building className="w-4 h-4 text-gray-400" />
                    <span>Công ty: {selectedContact.company_name}</span>
                  </div>
                )}
                <div className="flex flex-wrap gap-4 pt-1">
                  <a
                    href={`tel:${selectedContact.phone}`}
                    className="inline-flex items-center gap-1 text-blue-600 hover:underline font-semibold"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{selectedContact.phone}</span>
                  </a>
                  <a
                    href={`mailto:${selectedContact.email}`}
                    className="inline-flex items-center gap-1 text-blue-600 hover:underline"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>{selectedContact.email}</span>
                  </a>
                </div>
              </div>

              {/* Product */}
              {selectedContact.product_name && (
                <div className="border border-blue-100 bg-blue-50/50 p-3.5 rounded-xl">
                  <div className="text-xs text-blue-600 font-bold uppercase tracking-wider mb-1">
                    Sản phẩm quan tâm
                  </div>
                  <div className="font-semibold text-gray-900 flex items-center gap-2">
                    <Package className="w-4 h-4 text-blue-600" />
                    <span>{selectedContact.product_name}</span>
                  </div>
                </div>
              )}

              {/* Message */}
              <div>
                <div className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Nội dung lời nhắn
                </div>
                <div className="bg-gray-50 p-4 rounded-xl text-gray-800 whitespace-pre-wrap text-sm leading-relaxed border border-gray-100">
                  {selectedContact.message || '(Không có nội dung tin nhắn)'}
                </div>
              </div>

              {/* Status Update Quick Bar */}
              <div className="pt-2 border-t border-gray-100">
                <div className="text-xs font-bold text-gray-700 mb-2">Đổi trạng thái xử lý:</div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleStatusChange(selectedContact.id, 'contacted')}
                    className="px-3 py-2 text-xs font-semibold rounded-xl bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 transition-colors"
                  >
                    Đã liên hệ khách
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStatusChange(selectedContact.id, 'resolved')}
                    className="px-3 py-2 text-xs font-semibold rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors"
                  >
                    Đã hoàn thành tư vấn
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between px-6 py-3 border-t border-gray-100 bg-gray-50">
              <button
                type="button"
                onClick={() => setDeleteTarget(selectedContact)}
                className="text-xs text-red-600 hover:text-red-700 font-semibold inline-flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Xóa yêu cầu</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedContact(null)}
                className="px-4 py-2 text-xs font-semibold bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      <ConfirmDialog
        open={!!deleteTarget}
        title="Xóa yêu cầu liên hệ?"
        message={`Bạn có chắc muốn xóa yêu cầu từ "${deleteTarget?.full_name}"?`}
        confirmLabel="Xóa"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
