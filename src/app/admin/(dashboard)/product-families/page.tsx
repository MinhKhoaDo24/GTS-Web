import { getProductFamilies, getBrands } from '@/lib/dal'
import { FamiliesClient } from './_components/FamiliesClient'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Quản lý Dòng sản phẩm - GTS Admin' }

export default async function AdminProductFamiliesPage() {
  const [families, brands] = await Promise.all([
    getProductFamilies(),
    getBrands(),
  ])

  return (
    <div>
      <FamiliesClient
        initialFamilies={families}
        brands={brands as any[]}
      />
    </div>
  )
}
