'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  Plus, Edit2, Trash2, Search, FileText, Star, Eye, EyeOff,
  ChevronLeft, ChevronRight, Image as ImageIcon, Calendar, User
} from 'lucide-react'
import { useToast } from '@/components/admin/ui/Toast'
import { ConfirmDialog } from '@/components/admin/ui/ConfirmDialog'
import { formatDate } from '@/lib/utils'
import type { ContentListItem, ContentType } from '@/lib/dal/contents'

interface ContentsTableClientProps {
  contents: ContentListItem[]
  total: number
  page: number
  limit: number
  totalPages: number
  currentType?: string
  currentSearch?: string
}

const typeLabels: Record<string, { label: string; color: string }> = {
  news: { label: 'Tin tức', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  blog: { label: 'Kiến thức kỹ thuật', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  banner: { label: 'Banner / Quảng cáo', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  promotion: { label: 'Khuyến mãi', color: 'bg-rose-50 text-rose-700 border-rose-200' },
  case_study: { label: 'Dự án tiêu biểu', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
}

export function ContentsTableClient({
  contents,
  total,
  page,
  limit,
  totalPages,
  currentType = '',
  currentSearch = '',
}: ContentsTableClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { success, error } = useToast()
  const [isPending, startTransition] = useTransition()

  const [search, setSearch] = useState(currentSearch)
  const [deleteTarget, setDeleteTarget] = useState<ContentListItem | null>(null)
  const [items, setItems] = useState<ContentListItem[]>(contents)

  // Sync state if props change
  if (contents !== items && !isPending) {
    setItems(contents)
  }

  const updateFilters = (newParams: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString())
    Object.entries(newParams).forEach(([k, v]) => {
      if (v) params.set(k, v)
      else params.delete(k)
    })
    params.set('page', '1')
    router.push(`/admin/contents?${params.toString()}`)
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateFilters({ search })
  }

  const handleToggle = (id: string, field: 'is_active' | 'is_featured', currentVal: boolean) => {
    const newVal = !currentVal
    // Optimistic update
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: newVal } : item))
    )

    startTransition(async () => {
      const res = await fetch(`/api/v2/admin/contents/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: newVal }),
      })

      if (res.ok) {
        success('Cập nhật thành công', field === 'is_active' ? 'Đã đổi trạng thái hiển thị' : 'Đã đổi nổi bật')
        router.refresh()
      } else {
        // Rollback
        setItems((prev) =>
          prev.map((item) => (item.id === id ? { ...item, [field]: currentVal } : item))
        )
        error('Lỗi', 'Không thể cập nhật bài viết')
      }
    })
  }

  const handleDelete = () => {
    if (!deleteTarget) return
    startTransition(async () => {
      const res = await fetch(`/api/v2/admin/contents/${deleteTarget.id}`, { method: 'DELETE' })
      if (res.ok) {
        success('Đã xóa', `Đã xóa "${deleteTarget.title}"`)
        router.refresh()
      } else {
        error('Lỗi', 'Không thể xóa bài viết')
      }
      setDeleteTarget(null)
    })
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bài viết & Tin tức</h1>
          <p className="text-sm text-gray-500 mt-0.5">{total} bài viết và nội dung trên website</p>
        </div>
        <Link
          href="/admin/contents/new"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-md shadow-blue-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm bài viết mới</span>
        </Link>
      </div>

      {/* Type Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-gray-200">
        {[
          { key: '', label: 'Tất cả nội dung' },
          { key: 'news', label: 'Tin tức' },
          { key: 'blog', label: 'Kiến thức kỹ thuật' },
          { key: 'case_study', label: 'Dự án tiêu biểu' },
          { key: 'banner', label: 'Banner trang chủ' },
          { key: 'promotion', label: 'Khuyến mãi' },
        ].map((tab) => {
          const isActive = currentType === tab.key
          return (
            <button
              key={tab.key}
              onClick={() => updateFilters({ type: tab.key })}
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

      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
        <Search className="w-4 h-4 text-gray-400 ml-2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm bài viết theo tiêu đề, tóm tắt..."
          className="w-full text-sm outline-none bg-transparent placeholder-gray-400"
        />
        {search && (
          <button
            type="button"
            onClick={() => {
              setSearch('')
              updateFilters({ search: '' })
            }}
            className="text-xs text-gray-400 hover:text-gray-600 px-2 py-1"
          >
            Xóa
          </button>
        )}
        <button
          type="submit"
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
        >
          Tìm
        </button>
      </form>

      {/* Data Table */}
      <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden ${isPending ? 'opacity-60' : ''}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Bài viết</th>
                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Phân loại</th>
                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tác giả / Ngày đăng</th>
                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Nổi bật</th>
                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Trạng thái</th>
                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/60 transition-colors group">
                  {/* Article Title & Thumbnail */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-11 rounded-lg border border-gray-100 bg-gray-100 flex items-center justify-center overflow-hidden relative flex-shrink-0">
                        {item.thumbnail ? (
                          <Image src={item.thumbnail} alt={item.title} fill className="object-cover" sizes="56px" />
                        ) : (
                          <ImageIcon className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <Link
                          href={`/admin/contents/${item.id}`}
                          className="font-semibold text-gray-900 hover:text-blue-600 line-clamp-1 block transition-colors"
                        >
                          {item.title}
                        </Link>
                        <div className="text-xs font-mono text-gray-400 mt-0.5 line-clamp-1">
                          /{item.slug}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Type & Category */}
                  <td className="px-5 py-3.5 text-xs">
                    <span className={`inline-block px-2 py-0.5 font-semibold rounded-md border ${
                      typeLabels[item.type]?.color || 'bg-gray-100 text-gray-700 border-gray-200'
                    }`}>
                      {typeLabels[item.type]?.label || item.type}
                    </span>
                    {item.category && (
                      <div className="text-gray-400 text-[11px] mt-1">{item.category}</div>
                    )}
                  </td>

                  {/* Author & Date */}
                  <td className="px-5 py-3.5 text-xs">
                    <div className="flex items-center gap-1.5 text-gray-700 font-medium">
                      <User className="w-3 h-3 text-gray-400" />
                      <span>{item.author || 'Ban biên tập GTS'}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-400 mt-0.5 text-[11px]">
                      <Calendar className="w-3 h-3 text-gray-400" />
                      <span>{formatDate(item.published_at || item.created_at)}</span>
                    </div>
                  </td>

                  {/* Featured Toggle */}
                  <td className="px-5 py-3.5 text-center">
                    <button
                      type="button"
                      onClick={() => handleToggle(item.id, 'is_featured', item.is_featured)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        item.is_featured
                          ? 'text-amber-500 bg-amber-50 hover:bg-amber-100'
                          : 'text-gray-300 hover:text-gray-500 hover:bg-gray-100'
                      }`}
                      title={item.is_featured ? 'Bỏ nổi bật' : 'Đánh dấu nổi bật'}
                    >
                      <Star className="w-4 h-4 fill-current" />
                    </button>
                  </td>

                  {/* Active Toggle */}
                  <td className="px-5 py-3.5 text-center">
                    <button
                      type="button"
                      onClick={() => handleToggle(item.id, 'is_active', item.is_active)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                        item.is_active
                          ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                    >
                      {item.is_active ? (
                        <>
                          <Eye className="w-3 h-3" /> Hiện
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3 h-3" /> Ẩn
                        </>
                      )}
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link
                        href={`/admin/contents/${item.id}`}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        title="Chỉnh sửa"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        onClick={() => setDeleteTarget(item)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Xóa bài viết"
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

        {items.length === 0 && (
          <div className="py-20 text-center text-gray-400 text-sm">
            Không tìm thấy bài viết nào
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between">
            <span className="text-xs text-gray-500">
              Trang {page} / {totalPages} (Tổng cộng {total} bài)
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => {
                  const p = new URLSearchParams(searchParams.toString())
                  p.set('page', String(page - 1))
                  router.push(`/admin/contents?${p.toString()}`)
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
                  router.push(`/admin/contents?${p.toString()}`)
                }}
                className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirm */}
      <ConfirmDialog
        open={!!deleteTarget}
        title="Xóa bài viết?"
        message={`Bạn có chắc chắn muốn xóa bài viết "${deleteTarget?.title}"?`}
        confirmLabel="Xóa bài viết"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
