import type { Metadata } from 'next'
import './globals.css'
import { PublicLayout } from '@/components/PublicLayout'
import { query } from '@/lib/db'
import type { Category, Brand, Domain, SiteSetting } from '@/types/database'

export const metadata: Metadata = {
  title: {
    default: 'GTS - Global Technology & Service | Thiết bị mạng chính hãng',
    template: '%s | GTS - Global Technology & Service',
  },
  description:
    'GTS cung cấp thiết bị mạng chính hãng: Switch, Router, Firewall, WiFi, VoIP từ Cisco, Ubiquiti, Ruijie, Fortinet. Tư vấn & triển khai hạ tầng mạng doanh nghiệp.',
  keywords: ['thiết bị mạng', 'switch', 'router', 'firewall', 'wifi', 'cisco', 'ubiquiti', 'GTS'],
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
    <html lang="vi">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen flex flex-col bg-[#F8FAFC]">
        <PublicLayout settings={settings} categories={categories} brands={brands} domains={domains}>
          {children}
        </PublicLayout>
      </body>
    </html>
  )
}
