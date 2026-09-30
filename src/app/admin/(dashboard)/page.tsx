import Link from 'next/link'
import Image from 'next/image'
import {
  Package, FolderOpen, Tag, Inbox, Plus, Settings, ArrowRight,
  TrendingUp, Clock, AlertCircle, CheckCircle2, ChevronRight,
  FileText, ExternalLink
} from 'lucide-react'
import {
  countProducts, getProducts,
  countCategories,
  countBrands,
  countNewContacts, getContactRequests,
} from '@/lib/dal'
import { formatDate } from '@/lib/utils'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Bảng điều khiển Quản trị - GTS Admin' }

export default async function AdminDashboardPage() {
  const [
    productCount,
    categoryCount,
    brandCount,
    newContactCount,
    recentProductsRes,
    recentContactsRes,
  ] = await Promise.all([
    countProducts().catch(() => 0),
    countCategories().catch(() => 0),
    countBrands().catch(() => 0),
    countNewContacts().catch(() => 0),
    getProducts({ limit: 5 }).catch(() => ({ items: [], total: 0 })),
    getContactRequests({ limit: 5 }).catch(() => ({ items: [], total: 0 })),
  ])

  const stats = [
    {
      label: 'Tổng sản phẩm',
      value: productCount,
      subtext: 'Danh mục thiết bị kỹ thuật',
      icon: Package,
      color: 'bg-blue-50 text-blue-600 border-blue-100',
      href: '/admin/products',
    },
    {
      label: 'Danh mục thiết bị',
      value: categoryCount,
      subtext: 'Cây phân loại sản phẩm',
      icon: FolderOpen,
      color: 'bg-indigo-50 text-indigo-600 border-indigo-100',
      href: '/admin/categories',
    },
    {
      label: 'Hãng sản xuất',
      value: brandCount,
      subtext: 'Thương hiệu đối tác',
      icon: Tag,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      href: '/admin/brands',
    },
    {
      label: 'Yêu cầu liên hệ mới',
      value: newContactCount,
      subtext: newContactCount > 0 ? 'Cần phản hồi sớm' : 'Đã xử lý hết',
      icon: Inbox,
      color: newContactCount > 0
        ? 'bg-red-50 text-red-600 border-red-200'
        : 'bg-gray-50 text-gray-600 border-gray-100',
      href: '/admin/contacts',
      highlight: newContactCount > 0,
    },
  ]

  return (
    <div className="space-y-8">
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Tổng quan hệ thống
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Trung tâm quản lý sản phẩm, danh mục, bài viết & khách hàng GTS
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all shadow-md shadow-blue-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm sản phẩm</span>
          </Link>
          <Link
            href="/admin/contents/new"
            className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all"
          >
            <FileText className="w-4 h-4 text-purple-600" />
            <span>Viết tin tức</span>
          </Link>
          <Link
            href="/admin/settings"
            className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all"
          >
            <Settings className="w-4 h-4 text-gray-500" />
            <span>Cài đặt</span>
          </Link>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                {stat.label}
              </span>
              <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${stat.color} group-hover:scale-105 transition-transform`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-black text-gray-900 tracking-tight">
                {stat.value}
              </div>
              <div className="text-xs text-gray-400 mt-1 flex items-center justify-between">
                <span>{stat.subtext}</span>
                <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Main 2-column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Recent Products (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-gray-900">Sản phẩm mới thêm</h2>
              <p className="text-xs text-gray-400 mt-0.5">Các thiết bị cập nhật gần đây nhất</p>
            </div>
            <Link
              href="/admin/products"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
            >
              Xem tất cả <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-gray-50">
            {recentProductsRes.items.map((p) => (
              <div
                key={p.id}
                className="p-4 hover:bg-gray-50/70 transition-colors flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-xl border border-gray-100 bg-gray-50 flex items-center justify-center relative overflow-hidden flex-shrink-0">
                    {p.thumbnail ? (
                      <Image src={p.thumbnail} alt={p.name} fill className="object-contain p-1" sizes="48px" />
                    ) : (
                      <Package className="w-5 h-5 text-gray-300" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <Link
                      href={`/admin/products/${p.id}`}
                      className="text-sm font-semibold text-gray-900 hover:text-blue-600 truncate block transition-colors"
                    >
                      {p.name}
                    </Link>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                      <span className="font-medium text-gray-700">{p.brand_name}</span>
                      <span>•</span>
                      <span className="text-gray-400">{p.category_name}</span>
                      {p.model && (
                        <>
                          <span>•</span>
                          <span className="font-mono text-gray-500">{p.model}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                      p.is_active
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {p.is_active ? 'Hiện' : 'Ẩn'}
                  </span>
                  <Link
                    href={`/admin/products/${p.id}`}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                    title="Chỉnh sửa"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}

            {recentProductsRes.items.length === 0 && (
              <div className="py-12 text-center text-gray-400 text-xs">
                Chưa có sản phẩm nào
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Recent Contacts (1 col) */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-gray-900">Yêu cầu liên hệ</h2>
              <p className="text-xs text-gray-400 mt-0.5">Khách hàng cần tư vấn / báo giá</p>
            </div>
            <Link
              href="/admin/contacts"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
            >
              Xem tất cả <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-gray-50 flex-1">
            {recentContactsRes.items.map((c: any) => (
              <Link
                key={c.id}
                href="/admin/contacts"
                className="p-4 hover:bg-gray-50/70 transition-colors block group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors flex items-center gap-1.5">
                    {c.status === 'new' && (
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                    )}
                    {c.full_name}
                  </span>
                  <span className="text-[11px] text-gray-400">{formatDate(c.created_at)}</span>
                </div>
                {c.company_name && (
                  <div className="text-xs text-gray-500 mb-1">{c.company_name}</div>
                )}
                <p className="text-xs text-gray-600 line-clamp-1 italic">
                  &ldquo;{c.message || c.request_type || 'Cần hỗ trợ thông tin'}&rdquo;
                </p>
              </Link>
            ))}

            {recentContactsRes.items.length === 0 && (
              <div className="py-12 text-center text-gray-400 text-xs">
                Chưa có yêu cầu liên hệ nào
              </div>
            )}
          </div>

          <div className="p-4 bg-gray-50/60 border-t border-gray-100">
            <Link
              href="/admin/contacts"
              className="w-full py-2 bg-white hover:bg-gray-100 text-gray-700 border border-gray-200 text-xs font-semibold rounded-xl inline-flex items-center justify-center gap-1 transition-colors"
            >
              <Inbox className="w-3.5 h-3.5" />
              <span>Đi đến hộp thư yêu cầu</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
