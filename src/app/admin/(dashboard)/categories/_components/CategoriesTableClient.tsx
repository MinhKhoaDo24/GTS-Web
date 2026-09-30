'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Edit2, Trash2, FolderOpen, Folder, Package } from 'lucide-react'
import { ConfirmDialog } from '@/components/admin/ui/ConfirmDialog'
import { useToast } from '@/components/admin/ui/Toast'

interface Category {
  id: string
  name: string
  slug: string
  domain_name: string | null
  parent_name: string | null
  sort_order: number
  is_active: boolean
  product_count: number
}

export function CategoriesTableClient({ categories }: { categories: Category[] }) {
  const router = useRouter()
  const { success, error } = useToast()
  const [isPending, startTransition] = useTransition()
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null)

  const handleDelete = () => {
    if (!deleteTarget) return
    startTransition(async () => {
      const res = await fetch(`/api/v2/admin/categories/${deleteTarget.id}`, { method: 'DELETE' })
      if (res.ok) {
        success('Đã xóa', `Danh mục "${deleteTarget.name}" đã được xóa`)
        router.refresh()
      } else {
        error('Lỗi', 'Không thể xóa danh mục (có sản phẩm đang dùng?)')
      }
      setDeleteTarget(null)
    })
  }

  return (
    <>
      <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden ${isPending ? 'opacity-60' : ''}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tên danh mục</th>
                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Slug</th>
                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Cha / Domain</th>
                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Thứ tự</th>
                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Số SP</th>
                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Trạng thái</th>
                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {categories.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50/60 transition-colors group">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      {c.parent_name ? (
                        <Folder className="w-4 h-4 text-blue-400 flex-shrink-0" />
                      ) : (
                        <FolderOpen className="w-4 h-4 text-amber-500 flex-shrink-0" />
                      )}
                      <span className="font-semibold text-gray-900">{c.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="font-mono text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{c.slug}</span>
                  </td>
                  <td className="px-5 py-3.5 text-xs">
                    {c.parent_name && <div className="text-gray-700 font-medium">{c.parent_name}</div>}
                    {c.domain_name && <div className="text-gray-400">{c.domain_name}</div>}
                    {!c.parent_name && !c.domain_name && <span className="text-gray-300">—</span>}
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    <span className="text-xs font-mono text-gray-500">{c.sort_order}</span>
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Package className="w-3.5 h-3.5 text-gray-400" />
                      <span className="text-xs font-semibold text-gray-700">{c.product_count}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    <span className={`inline-block px-2 py-0.5 text-[10px] font-bold rounded-full ${
                      c.is_active
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      {c.is_active ? 'Hiện' : 'Ẩn'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link
                        href={`/admin/categories/${c.id}`}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        title="Chỉnh sửa"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        onClick={() => setDeleteTarget({ id: c.id, name: c.name })}
                        disabled={c.product_count > 0}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        title={c.product_count > 0 ? 'Có sản phẩm đang dùng' : 'Xóa'}
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
        {categories.length === 0 && (
          <div className="py-20 text-center text-gray-400 text-sm">Chưa có danh mục nào</div>
        )}
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Xóa danh mục?"
        message={`Xóa danh mục "${deleteTarget?.name}"? Thao tác này không thể hoàn tác.`}
        confirmLabel="Xóa"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  )
}
