import { auth } from '@/lib/auth'
import { AdminSidebar } from '@/components/admin/layout/AdminSidebar'
import { LogoutButton } from '@/components/admin/layout/LogoutButton'
import { ToastProvider } from '@/components/admin/ui/Toast'
import { countNewContacts } from '@/lib/dal'

import { redirect } from 'next/navigation'

export const metadata = {
  title: { default: 'GTS Admin', template: '%s | GTS Admin' },
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  
  if (!session) {
    redirect('/admin/login')
  }

  const newContactCount = await countNewContacts().catch(() => 0)

  return (
    <ToastProvider>
      <div className="min-h-screen bg-[#F8FAFC] flex text-slate-800 antialiased">
        {/* Sidebar - Desktop */}
        <aside className="w-64 flex-shrink-0 hidden md:block sticky top-0 h-screen z-40">
          <AdminSidebar
            userEmail={session?.user?.email ?? 'admin@gts.vn'}
            newContactCount={newContactCount}
          />
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Header */}
          <header className="h-16 bg-white border-b border-slate-200/80 px-6 sm:px-8 flex items-center justify-between sticky top-0 z-30 flex-shrink-0">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
                GTS Web Managemen
              </span>
              <span className="text-xs text-slate-400 hidden sm:inline">•</span>
              <span className="text-xs text-slate-500 hidden sm:inline">
                Hệ thống Quản trị Nội dung & Sản phẩm
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-xs text-slate-500 hidden sm:block">
                {new Date().toLocaleDateString('vi-VN', {
                  weekday: 'long',
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                })}
              </div>
              <div className="h-8 w-px bg-slate-200 hidden sm:block" />
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white text-xs font-bold shadow-xs">
                  {session?.user?.email?.[0]?.toUpperCase() ?? 'A'}
                </div>
                <span className="text-xs font-medium text-slate-700 hidden lg:inline">
                  {session?.user?.email ?? 'admin@gts.vn'}
                </span>
              </div>
              <div className="h-8 w-px bg-slate-200 hidden sm:block" />
              <LogoutButton />
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 p-10 sm:p-8">
            <div className="w-full">
              {children}
            </div>
          </main>
        </div>
      </div>
    </ToastProvider>
  )
}
