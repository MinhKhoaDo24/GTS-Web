'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { Lock, Mail, AlertCircle, Loader2 } from 'lucide-react'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/admin'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (res?.error) {
        setError('Email hoặc mật khẩu không chính xác')
        setLoading(false)
      } else {
        router.push(callbackUrl)
        router.refresh()
      }
    } catch (err) {
      setError('Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại.')
      setLoading(false)
    }
  }

  return (
    <div className="bg-white py-8 px-6 shadow-2xl rounded-2xl sm:px-10 border border-gray-100">
      {error && (
        <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-700">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-500" />
          <span>{error}</span>
        </div>
      )}

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            Email quản trị
          </label>
          <div className="relative">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@gts.vn"
              className="w-full pl-10 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#1D4ED8] focus:ring-1 focus:ring-[#1D4ED8]"
            />
            <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            Mật khẩu
          </label>
          <div className="relative">
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#1D4ED8] focus:ring-1 focus:ring-[#1D4ED8]"
            />
            <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-[#1D4ED8] hover:bg-[#1e40af] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1D4ED8] transition-all disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Đang xác thực...</span>
            </>
          ) : (
            <span>Đăng nhập hệ thống</span>
          )}
        </button>
      </form>

      {/* Test credentials hint */}
      <div className="mt-6 pt-4 border-t border-gray-100 text-center">
        <p className="text-[11px] text-gray-400">
          Tài khoản mặc định: <code className="bg-gray-100 text-gray-700 px-1 py-0.5 rounded">admin@gts.vn</code> / <code className="bg-gray-100 text-gray-700 px-1 py-0.5 rounded">admin@gts2024</code>
        </p>
      </div>
    </div>
  )
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-[#0F172A] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#1D4ED8] text-white font-bold text-2xl mb-4 shadow-lg">
          GTS
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight">
          Hệ thống Quản trị GTS
        </h2>
        <p className="mt-2 text-xs text-gray-400">
          Đăng nhập để quản lý danh mục sản phẩm và nội dung website
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <Suspense
          fallback={
            <div className="bg-white p-8 rounded-2xl text-center text-gray-400 text-sm">
              <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#1D4ED8] mb-2" />
              <span>Đang tải trang đăng nhập...</span>
            </div>
          }
        >
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}
