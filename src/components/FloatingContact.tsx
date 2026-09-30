'use client'

import { useState, useSyncExternalStore } from 'react'
import { Phone, Mail, X, MessageCircle } from 'lucide-react'
import { SiZalo } from 'react-icons/si'

// Hydration-safe mount detection without setState-in-effect
function subscribe() {
  return () => {}
}
function getClientSnapshot() {
  return true
}
function getServerSnapshot() {
  return false
}

interface FloatingContactProps {
  hotline?: string
  zaloPhone?: string
  email?: string
}

export function FloatingContact({ hotline, zaloPhone, email }: FloatingContactProps) {
  const mounted = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot)
  const [isOpen, setIsOpen] = useState(false)

  if (!mounted) return null

  const contacts = [
    {
      key: 'email',
      label: 'Email',
      icon: <Mail className="w-5 h-5" />,
      href: `mailto:${email || 'contact@gts.vn'}`,
      bg: 'bg-blue-500 hover:bg-blue-600',
      tooltip: email || 'contact@gts.vn',
    },
    {
      key: 'phone',
      label: 'Gọi điện',
      icon: <Phone className="w-5 h-5" />,
      href: `tel:${(hotline || '0901234567').replace(/\s/g, '')}`,
      bg: 'bg-[#F59E0B] hover:bg-[#d97706]',
      tooltip: hotline || '0901 234 567',
    },
    {
      key: 'zalo',
      label: 'Zalo',
      icon: <SiZalo className="w-5 h-5" />,
      href: `https://zalo.me/${(zaloPhone || '0901234567').replace(/\s/g, '')}`,
      bg: 'bg-[#0068FF] hover:bg-[#0052cc]',
      tooltip: 'Chat Zalo',
      target: '_blank',
    },
  ]

  return (
    <div className="fixed bottom-6 right-4 sm:right-6 z-50 flex flex-col items-center gap-3">
      {/* Sub buttons */}
      {contacts.map((item, idx) => (
        <div
          key={item.key}
          className="relative group flex items-center"
          style={{
            opacity: isOpen ? 1 : 0,
            transform: isOpen ? 'translateY(0) scale(1)' : 'translateY(16px) scale(0.8)',
            transition: `opacity 0.2s ease ${idx * 0.05}s, transform 0.2s ease ${idx * 0.05}s`,
            pointerEvents: isOpen ? 'auto' : 'none',
          }}
        >
          {/* Tooltip */}
          <div className="absolute right-14 sm:right-16 whitespace-nowrap bg-gray-900 text-white text-xs px-2.5 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            {item.tooltip}
            <div className="absolute right-[-4px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-l-4 border-transparent border-l-gray-900" />
          </div>

          <a
            href={item.href}
            target={item.target}
            rel={item.target === '_blank' ? 'noopener noreferrer' : undefined}
            className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full ${item.bg} text-white flex items-center justify-center shadow-lg transition-all duration-150 active:scale-95`}
            aria-label={item.label}
          >
            {item.icon}
          </a>
        </div>
      ))}

      {/* Main FAB */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`rounded-full bg-[#22C55E] hover:bg-[#16a34a] text-white flex items-center justify-center shadow-xl transition-all duration-300 active:scale-95 ${
          !isOpen ? 'pulse-animation' : ''
        }`}
        style={{ width: '52px', height: '52px' }}
        aria-label={isOpen ? 'Đóng' : 'Liên hệ'}
      >
        <span
          className="transition-transform duration-300"
          style={{ transform: isOpen ? 'rotate(135deg)' : 'rotate(0deg)' }}
        >
          {isOpen ? (
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          ) : (
            <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
          )}
        </span>
      </button>
    </div>
  )
}
