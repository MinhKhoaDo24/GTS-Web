'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import {
  LayoutDashboard, Package, FolderOpen, Tag,
  FileText, Settings, ExternalLink,
  ChevronRight, ShieldCheck, Inbox, LogOut
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface NavItem {
  href: string
  label: string
  icon: any
  exact?: boolean
  badge?: string | number | null
}

interface NavGroup {
  label: string
  items: NavItem[]
}

const navGroups: NavGroup[] = [
  {
    label: 'Tổng quan',
    items: [
      { href: '/admin', label: 'Bảng điều khiển', icon: LayoutDashboard, exact: true },
    ],
  },
  {
    label: 'Quản lý Sản phẩm',
    items: [
      { href: '/admin/products', label: 'Sản phẩm', icon: Package },
      { href: '/admin/categories', label: 'Danh mục thiết bị', icon: FolderOpen },
      { href: '/admin/brands', label: 'Hãng sản xuất', icon: Tag },
    ],
  },
  {
    label: 'Nội dung Website',
    items: [
      { href: '/admin/contents', label: 'Bài viết & Tin tức', icon: FileText },
      { href: '/admin/contacts', label: 'Yêu cầu liên hệ', icon: Inbox },
    ],
  },
  {
    label: 'Hệ thống',
    items: [
      { href: '/admin/settings', label: 'Cấu hình Website', icon: Settings },
    ],
  },
]

interface AdminSidebarProps {
  userEmail?: string
  newContactCount?: number
}

export function AdminSidebar({ userEmail = 'admin@gts.vn', newContactCount = 0 }: AdminSidebarProps) {
  const pathname = usePathname()

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href
    return pathname === href || pathname.startsWith(href + '/')
  }

  return (
    <aside className="w-64 bg-white border-r border-slate-200/80 flex flex-col h-screen overflow-y-auto shadow-[1px_0_3px_rgba(0,0,0,0.02)]">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-white shadow-xs text-base group-hover:scale-105 transition-transform">
            <img src="/pic/logo công ty.jpg" alt="GTS Logo"/>
          </div>
          <div>
            <div className="font-extrabold text-sm text-slate-900 tracking-tight flex items-center gap-1.5">
              <span>GTS Admin</span>
            </div>
            <div className="text-[11px] text-slate-400 font-medium">Hệ thống quản lý Website GTS</div>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-5 overflow-y-auto">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-10 px-3 mb-1.5">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active = isActive(item.href, item.exact)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-150',
                      active
                        ? 'bg-blue-50 text-blue-700 border border-blue-100/80 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    )}
                  >
                    <span className="flex items-center gap-2.5">
                      <item.icon
                        className={cn(
                          'w-4 h-4 flex-shrink-0 transition-colors',
                          active ? 'text-blue-600' : 'text-slate-400'
                        )}
                      />
                      <span>{item.label}</span>
                    </span>

                    {item.href === '/admin/contacts' && newContactCount > 0 && (
                      <span className="bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                        {newContactCount > 99 ? '99+' : newContactCount}
                      </span>
                    )}

                    {active && <ChevronRight className="w-3 h-3 text-blue-500 flex-shrink-0" />}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* External Link to Public Site */}
      <div className="px-3 pb-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-500 hover:text-blue-600 hover:bg-blue-50/50 border border-slate-100 transition-all"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Xem trang ngoài</span>
          </span>
          <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">GTS</span>
        </Link>
      </div>

      {/* User Footer Profile */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-2.5 px-2 py-1.5">
          <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
            {userEmail[0]?.toUpperCase() ?? 'A'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-slate-800 truncate">{userEmail}</div>
            <div className="text-[10px] text-emerald-600 font-medium flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              <span>Quản trị viên</span>
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/admin/login' })}
            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
            title="Đăng xuất"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  )
}
