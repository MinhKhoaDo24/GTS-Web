'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Search, Plus, Eye, EyeOff, Star, Trash2, Edit2,
  ExternalLink, Layers, CheckCircle2, Clock, AlertTriangle, Loader2
} from 'lucide-react'
import type { Solution } from '@/types/database'
import { toggleSolutionAction, deleteSolutionAction } from '../actions'

interface SolutionsTableClientProps {
  initialSolutions: Solution[]
}

export function SolutionsTableClient({ initialSolutions }: SolutionsTableClientProps) {
  const [solutions, setSolutions] = useState(initialSolutions)
  const [search, setSearch] = useState('')
  const [filterActive, setFilterActive] = useState<string>('all')
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  // Filter solutions
  const filteredSolutions = solutions.filter((sol) => {
    const matchSearch =
      sol.name.toLowerCase().includes(search.toLowerCase()) ||
      sol.slug.toLowerCase().includes(search.toLowerCase()) ||
      (sol.short_description && sol.short_description.toLowerCase().includes(search.toLowerCase()))

    if (!matchSearch) return false

    if (filterActive === 'active') return sol.is_active
    if (filterActive === 'inactive') return !sol.is_active

    return true
  })

  // Handle toggle field
  const handleToggle = (id: string, field: 'is_active' | 'is_featured') => {
    // Optimistic update
    setSolutions((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, [field]: !item[field] } : item
      )
    )

    startTransition(async () => {
      const res = await toggleSolutionAction(id, field)
      if (!res.success) {
        // Rollback
        setSolutions((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, [field]: !item[field] } : item
          )
        )
      }
    })
  }

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa bài giải pháp này không? Hành động này không thể hoàn tác.')) {
      return
    }

    setDeletingId(id)
    const res = await deleteSolutionAction(id)
    setDeletingId(null)

    if (res.success) {
      setSolutions((prev) => prev.filter((item) => item.id !== id))
    } else {
      alert(res.error || 'Có lỗi xảy ra khi xóa giải pháp')
    }
  }

  return (
    <div className="space-y-4">
      {/* Action Bar: Search & Filter */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm theo tên giải pháp, slug..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          <select
            value={filterActive}
            onChange={(e) => setFilterActive(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-700 font-medium focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Đang xuất bản</option>
            <option value="inactive">Bản nháp / Đang ẩn</option>
          </select>

          <Link
            href="/admin/solutions/new"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 text-xs font-semibold rounded-xl transition-all shadow-xs flex-shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm giải pháp</span>
          </Link>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <th className="px-5 py-3.5">Giải pháp</th>
                <th className="px-4 py-3.5 text-center">Thứ tự</th>
                <th className="px-4 py-3.5 text-center">Nổi bật</th>
                <th className="px-4 py-3.5 text-center">Trạng thái</th>
                <th className="px-5 py-3.5 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSolutions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-slate-400">
                    <Layers className="w-10 h-10 text-slate-300 mx-auto mb-2.5" />
                    <p className="text-sm font-semibold text-slate-600">Không tìm thấy giải pháp nào</p>
                    <p className="text-xs text-slate-400 mt-1">
                      {search ? 'Thử tìm với từ khóa khác' : 'Bấm nút "Thêm giải pháp" để đăng bài viết đầu tiên'}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredSolutions.map((sol) => (
                  <tr key={sol.id} className="hover:bg-slate-50/50 transition-colors">
                    {/* Giải pháp: Thumbnail + Title + Summary */}
                    <td className="px-5 py-4">
                      <div className="flex items-start gap-3.5">
                        <div className="w-16 h-12 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0 relative flex items-center justify-center">
                          {sol.thumbnail ? (
                            <Image
                              src={sol.thumbnail}
                              alt={sol.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <Layers className="w-5 h-5 text-slate-300" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <Link
                            href={`/admin/solutions/${sol.id}`}
                            className="font-bold text-slate-900 hover:text-blue-600 text-sm transition-colors line-clamp-1"
                          >
                            {sol.name}
                          </Link>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="font-mono text-[11px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                              /giai-phap/{sol.slug}
                            </span>
                            <Link
                              href={`/giai-phap/${sol.slug}`}
                              target="_blank"
                              className="text-slate-400 hover:text-blue-600 transition-colors"
                              title="Xem ngoài website"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </Link>
                          </div>
                          {sol.short_description && (
                            <p className="text-[11px] text-slate-500 line-clamp-1 mt-1">
                              {sol.short_description}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Thứ tự */}
                    <td className="px-4 py-4 text-center">
                      <span className="font-mono text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-1 rounded-md">
                        {sol.sort_order}
                      </span>
                    </td>

                    {/* Nổi bật */}
                    <td className="px-4 py-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggle(sol.id, 'is_featured')}
                        className={`p-1.5 rounded-lg transition-colors inline-flex items-center justify-center ${
                          sol.is_featured
                            ? 'text-amber-500 bg-amber-50 hover:bg-amber-100'
                            : 'text-slate-300 hover:text-slate-500 hover:bg-slate-100'
                        }`}
                        title={sol.is_featured ? 'Bỏ nổi bật' : 'Ghim nổi bật'}
                      >
                        <Star className={`w-4 h-4 ${sol.is_featured ? 'fill-amber-400' : ''}`} />
                      </button>
                    </td>

                    {/* Trạng thái */}
                    <td className="px-4 py-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggle(sol.id, 'is_active')}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all ${
                          sol.is_active
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                            : 'bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200'
                        }`}
                      >
                        {sol.is_active ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Đang xuất bản</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3 text-slate-400" />
                            <span>Bản nháp</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Thao tác */}
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/admin/solutions/${sol.id}`}
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Chỉnh sửa"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button
                          type="button"
                          disabled={deletingId === sol.id}
                          onClick={() => handleDelete(sol.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors disabled:opacity-50"
                          title="Xóa giải pháp"
                        >
                          {deletingId === sol.id ? (
                            <Loader2 className="w-4 h-4 animate-spin text-rose-500" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs text-slate-500">
          <span>Tổng số: <strong className="text-slate-800">{filteredSolutions.length}</strong> giải pháp</span>
          <span className="text-[11px] text-slate-400">Hiển thị theo thứ tự sắp xếp (sort_order)</span>
        </div>
      </div>
    </div>
  )
}
