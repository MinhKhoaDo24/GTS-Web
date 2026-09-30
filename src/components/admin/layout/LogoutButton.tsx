'use client'

import { LogOut } from 'lucide-react'
import { signOut } from 'next-auth/react'

export function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/admin/login' })}
      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors flex items-center justify-center"
      title="Đăng xuất"
    >
      <LogOut className="w-4 h-4" />
    </button>
  )
}
