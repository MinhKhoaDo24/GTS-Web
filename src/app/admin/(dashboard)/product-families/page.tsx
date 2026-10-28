import { getProductFamilies, getBrands, getDomains } from '@/lib/dal'
import { FamiliesClient } from './_components/FamiliesClient'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Quản lý Dòng sản phẩm - GTS Admin' }

export default async function AdminProductFamiliesPage() {
  const [families, brands, domains] = await Promise.all([
    getProductFamilies(),
    getBrands(),
    getDomains(),
  ])

  return (
    <div>
      <FamiliesClient
        initialFamilies={families}
        brands={brands as any[]}
        domains={domains as any[]}
      />
    </div>
  )
}
