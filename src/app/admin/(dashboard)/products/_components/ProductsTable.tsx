'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  Edit2, Trash2, ExternalLink, Eye, EyeOff,
  Star, ChevronLeft, ChevronRight, Package
} from 'lucide-react'
import { ConfirmDialog } from '@/components/admin/ui/ConfirmDialog'
import { useToast } from '@/components/admin/ui/Toast'
import type { ProductListItem } from '@/lib/dal/products'

interface Props {
  items: ProductListItem[]
  total: number
  page: number
  totalPages: number
}

export function ProductsTable({ items, total, page, totalPages }: Props) {
  const router = useRouter()
  const { success, error } = useToast()
  const [isPending, startTransition] = useTransition()

  // Confirm delete dialog
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null)

  // Toggle active
  const handleToggleActive = async (id: string, current: boolean) => {
    startTransition(async () => {
      try {
        const res = await fetch(`/api/v2/admin/products/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ is_active: !current }),
        })
        if (!res.ok) throw new Error()
        success(current ? 'Đã ẩn sản phẩm' : 'Đã hiển thị sản phẩm')
        router.refresh()
      } catch {
        error('Lỗi', 'Không thể cập nhật trạng thái')
      }
    })
  }

  // Toggle featured
  const handleToggleFeatured = async (id: string, current: boolean) => {
    startTransition(async () => {
      try {
        const res = await fetch(`/api/v2/admin/products/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ is_featured: !current }),
        })
        if (!res.ok) throw new Error()
        success(current ? 'Bỏ nổi bật' : 'Đã đặt làm nổi bật')
        router.refresh()
      } catch {
        error('Lỗi', 'Không thể cập nhật')
      }
    })
  }

  // Delete
  const handleDelete = async () => {
    if (!deleteTarget) return
    startTransition(async () => {
      try {
        const res = await fetch(`/api/v2/admin/products/${deleteTarget.id}`, {
          method: 'DELETE',
        })
        if (!res.ok) throw new Error()
        success('Đã xóa', `Sản phẩm "${deleteTarget.name}" đã được xóa`)
        setDeleteTarget(null)
        router.refresh()
      } catch {
        error('Lỗi', 'Không thể xóa sản phẩm')
        setDeleteTarget(null)
      }
    })
  }

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="py-24 flex flex-col items-center text-center gap-3">
          <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center">
            <Package className="w-7 h-7 text-gray-400" />
          </div>
          <p className="font-semibold text-gray-600">Chưa có sản phẩm nào</p>
          <p className="text-sm text-gray-400">Thêm sản phẩm đầu tiên để bắt đầu</p>
          <Link
            href="/admin/products/new"
            className="mt-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors"
          >
            + Thêm sản phẩm
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition-opacity ${isPending ? 'opacity-60' : ''}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Sản phẩm</th>
                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Model</th>
                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Hãng / Danh mục</th>
                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Nổi bật</th>
                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Hiển thị</th>
                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {items.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50/60 transition-colors group">
                  {/* Product info */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      {/* Thumbnail */}
                      <div className="w-10 h-10 rounded-xl border border-gray-100 bg-gray-50 flex-shrink-0 overflow-hidden flex items-center justify-center">
                        {p.thumbnail ? (
                          <Image
                            src={p.thumbnail}
                            alt={p.name}
                            width={40}
                            height={40}
                            className="object-contain w-full h-full p-1"
                          />
                        ) : (
                          <Package className="w-5 h-5 text-gray-300" />
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 line-clamp-1 max-w-[220px]">{p.name}</div>
                        <div className="text-[11px] text-gray-400 font-mono mt-0.5">{p.slug}</div>
                      </div>
                    </div>
                  </td>

                  {/* Model */}
                  <td className="px-5 py-3.5">
                    {p.model ? (
                      <span className="inline-block font-mono text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-lg">
                        {p.model}
                      </span>
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </td>

                  {/* Brand / Category */}
                  <td className="px-5 py-3.5">
                    <div className="font-medium text-gray-800 text-xs">{p.brand_name}</div>
                    <div className="text-[11px] text-gray-400 mt-0.5">{p.category_name}</div>
                  </td>

                  {/* Featured toggle */}
                  <td className="px-5 py-3.5 text-center">
                    <button
                      onClick={() => handleToggleFeatured(p.id, p.is_featured)}
                      title={p.is_featured ? 'Bỏ nổi bật' : 'Đặt nổi bật'}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-4.5 h-4.5 ${p.is_featured ? 'fill-amber-400 text-amber-400' : 'text-gray-300 hover:text-amber-300'}`}
                      />
                    </button>
                  </td>

                  {/* Active toggle */}
                  <td className="px-5 py-3.5 text-center">
                    <button
                      onClick={() => handleToggleActive(p.id, p.is_active)}
                      title={p.is_active ? 'Ẩn sản phẩm' : 'Hiển thị'}
                      className="transition-transform hover:scale-110"
                    >
                      {p.is_active ? (
                        <Eye className="w-4.5 h-4.5 text-emerald-500" />
                      ) : (
                        <EyeOff className="w-4.5 h-4.5 text-gray-300" />
                      )}
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link
                        href={`/san-pham/${p.slug}`}
                        target="_blank"
                        className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        title="Xem trên web"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                      <Link
                        href={`/admin/products/${p.id}`}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        title="Chỉnh sửa"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        onClick={() => setDeleteTarget({ id: p.id, name: p.name })}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-xs text-gray-500">
              Hiển thị trang {page} / {totalPages} ({total} sản phẩm)
            </p>
            <div className="flex items-center gap-1">
              {page > 1 && (
                <Link
                  href={`?page=${page - 1}`}
                  className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Link>
              )}
              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                const p_num = i + 1
                return (
                  <Link
                    key={p_num}
                    href={`?page=${p_num}`}
                    className={`w-8 h-8 flex items-center justify-center rounded-xl text-xs font-semibold transition-colors ${
                      p_num === page
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {p_num}
                  </Link>
                )
              })}
              {page < totalPages && (
                <Link
                  href={`?page=${page + 1}`}
                  className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </Link>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Confirm Delete */}
      <ConfirmDialog
        open={!!deleteTarget}
        title="Xóa sản phẩm?"
        message={`Bạn có chắc muốn xóa "${deleteTarget?.name}"? Hành động này không thể hoàn tác và sẽ xóa tất cả variants, ảnh, specs liên quan.`}
        confirmLabel="Xóa sản phẩm"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  )
}
