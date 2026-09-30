import { getBrands } from '@/lib/dal/misc'
import { BrandsClient } from './_components/BrandsClient'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Quản lý Hãng sản xuất - GTS Admin' }

export default async function AdminBrandsPage() {
  const brands = await getBrands()

  return (
    <div>
      <BrandsClient initialBrands={brands as any[]} />
    </div>
  )
}
