'use client'

import { usePathname } from 'next/navigation'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { FloatingContact } from '@/components/FloatingContact'
import type { Category, Brand, Domain } from '@/types/database'
import type { CategoryCatalogItem } from '@/lib/catalogTaxonomy'

interface PublicLayoutProps {
  children: React.ReactNode
  settings: Record<string, string>
  categories: Category[]
  brands: Brand[]
  domains?: Domain[]
  catalogTaxonomy?: CategoryCatalogItem[]
}

export function PublicLayout({ children, settings, categories, brands, domains, catalogTaxonomy }: PublicLayoutProps) {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith('/admin')

  if (isAdmin) {
    return <>{children}</>
  }

  return (
    <>
      <Header settings={settings} categories={categories} brands={brands} domains={domains} catalogTaxonomy={catalogTaxonomy} />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} />
      <FloatingContact
        hotline={settings.hotline}
        zaloPhone={settings.zalo_phone}
        email={settings.contact_email}
      />
    </>
  )
}

