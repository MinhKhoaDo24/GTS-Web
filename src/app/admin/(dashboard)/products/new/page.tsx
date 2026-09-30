import { getBrands, getCategories } from '@/lib/dal'
import { ProductForm } from '../_components/ProductForm'
import { createProductAction } from '../actions'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Thêm sản phẩm mới - GTS Admin' }

export default async function NewProductPage() {
  const [brands, categories] = await Promise.all([
    getBrands(),
    getCategories(),
  ])

  return (
    <div className="w-full space-y-6">
      <ProductForm
        action={createProductAction}
        brands={brands as any[]}
        categories={categories}
        mode="create"
      />
    </div>
  )
}
