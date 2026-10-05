'use client'

import { useState, useRef } from 'react'
import { Send, RotateCcw, Paperclip } from 'lucide-react'

interface FormData {
  fullName: string
  phone: string
  address: string
  email: string
  subject: string
  content: string
  attachment: File | null
}

const emptyForm: FormData = {
  fullName: '',
  phone: '',
  address: '',
  email: '',
  subject: '',
  content: '',
  attachment: null,
}

export default function ContactForm() {
  const [form, setForm] = useState<FormData>(emptyForm)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const fileRef = useRef<HTMLInputElement>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    setForm((prev) => ({ ...prev, attachment: file }))
  }

  const handleReset = () => {
    setForm(emptyForm)
    if (fileRef.current) fileRef.current.value = ''
    setStatus('idle')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    try {
      const body = new FormData()
      body.append('fullName', form.fullName)
      body.append('phone', form.phone)
      body.append('address', form.address)
      body.append('email', form.email)
      body.append('subject', form.subject)
      body.append('content', form.content)
      if (form.attachment) body.append('attachment', form.attachment)

      const res = await fetch('/api/contact', { method: 'POST', body })
      if (res.ok) {
        setStatus('success')
        handleReset()
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  const inputCls =
    'w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/40 focus:border-[#1D4ED8] transition-all bg-white'

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Row 1: Họ tên + Số điện thoại */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input
          id="contact-fullName"
          name="fullName"
          type="text"
          placeholder="Họ tên"
          value={form.fullName}
          onChange={handleChange}
          required
          className={inputCls}
        />
        <input
          id="contact-phone"
          name="phone"
          type="tel"
          placeholder="Số điện thoại"
          value={form.phone}
          onChange={handleChange}
          required
          className={inputCls}
        />
      </div>

      {/* Row 2: Địa chỉ + Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input
          id="contact-address"
          name="address"
          type="text"
          placeholder="Địa chỉ"
          value={form.address}
          onChange={handleChange}
          className={inputCls}
        />
        <input
          id="contact-email"
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className={inputCls}
        />
      </div>

      {/* Chủ đề */}
      <input
        id="contact-subject"
        name="subject"
        type="text"
        placeholder="Chủ đề"
        value={form.subject}
        onChange={handleChange}
        required
        className={inputCls}
      />

      {/* Nội dung */}
      <textarea
        id="contact-content"
        name="content"
        placeholder="Nội dung"
        value={form.content}
        onChange={handleChange}
        rows={5}
        required
        className={`${inputCls} resize-none`}
      />

      {/* Đính kèm file */}
      <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white">
        <span className="flex-1 px-4 py-2.5 text-sm text-gray-400 truncate">
          {form.attachment ? form.attachment.name : 'Đính kèm file'}
        </span>
        <label
          htmlFor="contact-attachment"
          className="cursor-pointer bg-gray-100 hover:bg-gray-200 border-l border-gray-300 px-4 py-2.5 text-sm text-gray-700 font-medium transition-colors flex items-center gap-1.5"
        >
          <Paperclip className="w-4 h-4" />
          Chọn
        </label>
        <input
          id="contact-attachment"
          ref={fileRef}
          type="file"
          onChange={handleFile}
          className="hidden"
        />
      </div>

      {/* Status messages */}
      {status === 'success' && (
        <p className="text-sm text-green-600 font-medium">
          ✓ Yêu cầu đã được gửi thành công. Chúng tôi sẽ liên hệ sớm nhất!
        </p>
      )}
      {status === 'error' && (
        <p className="text-sm text-red-600 font-medium">
          ✗ Gửi thất bại. Vui lòng thử lại hoặc liên hệ trực tiếp qua hotline.
        </p>
      )}

      {/* Buttons */}
      <div className="flex items-center gap-4 pt-1">
        <button
          id="contact-submit"
          type="submit"
          disabled={status === 'loading'}
          className="inline-flex items-center gap-2 bg-[#1D4ED8] hover:bg-[#1e40af] disabled:opacity-60 text-white font-bold px-7 py-2.5 rounded-lg text-sm transition-all"
        >
          <Send className="w-4 h-4" />
          {status === 'loading' ? 'ĐANG GỬI...' : 'GỬI'}
        </button>
        <button
          id="contact-reset"
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-2 border border-gray-300 hover:border-gray-400 text-gray-700 font-bold px-7 py-2.5 rounded-lg text-sm transition-all bg-white"
        >
          <RotateCcw className="w-4 h-4" />
          NHẬP LẠI
        </button>
      </div>
    </form>
  )
}
