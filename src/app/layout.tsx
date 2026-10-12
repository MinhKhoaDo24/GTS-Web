import type { Metadata } from 'next'
import { Manrope, Inter } from 'next/font/google'
import './globals.css'
import { PublicLayout } from '@/components/PublicLayout'

const manrope = Manrope({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-manrope-src',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter-src',
  display: 'swap',
})
import { query } from '@/lib/db'
import type { Category, Brand, Domain, SiteSetting } from '@/types/database'

export const metadata: Metadata = {
  title: {
    default: 'Trang chủ | GTS - Global Technology & Service',
    template: '%s | GTS - Global Technology & Service',
  },
  description:
    'GTS cung cấp thiết bị mạng chính hãng: Switch, Router, Firewall, WiFi, VoIP từ Cisco, Ubiquiti, Ruijie, Fortinet. Tư vấn & triển khai hạ tầng mạng doanh nghiệp.',
  keywords: ['thiết bị mạng', 'switch', 'router', 'firewall', 'wifi', 'cisco', 'ubiquiti', 'GTS'],
  icons: {
    icon: '/logo-cong-ty.jpg',
    shortcut: '/logo-cong-ty.jpg',
    apple: '/logo-cong-ty.jpg',
  },
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    siteName: 'GTS - Global Technology & Service',
  },
}

async function getLayoutData() {
  try {
    const [settingsArr, categories, brands, domains] = await Promise.all([
      query<SiteSetting>('SELECT key, value FROM site_settings'),
      query<Category>('SELECT id, name, slug, description FROM categories ORDER BY name ASC'),
      query<Brand>('SELECT id, name, slug, logo, website FROM brands ORDER BY name ASC'),
      query<Domain>('SELECT id, name, slug, description, image, icon, sort_order, is_active FROM domains WHERE is_active = true ORDER BY sort_order ASC, name ASC'),
    ])
    const settings: Record<string, string> = Object.fromEntries(
      settingsArr.map((s) => [s.key, s.value ?? ''])
    )
    return { settings, categories, brands, domains }
  } catch {
    return {
      settings: {} as Record<string, string>,
      categories: [] as Category[],
      brands: [] as Brand[],
      domains: [] as Domain[],
    }
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { settings, categories, brands, domains } = await getLayoutData()

  return (
    <html lang="vi" className={`${manrope.variable} ${inter.variable}`}>
      <body className="min-h-screen flex flex-col bg-[#F8FAFC] font-sans">
        <PublicLayout settings={settings} categories={categories} brands={brands} domains={domains}>
          {children}
        </PublicLayout>
      </body>
    </html>
  )
}
