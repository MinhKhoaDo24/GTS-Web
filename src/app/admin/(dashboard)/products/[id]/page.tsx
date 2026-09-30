import { notFound } from 'next/navigation'
import { getProductById, getBrands, getCategories } from '@/lib/dal'
import { ProductForm } from '../_components/ProductForm'
import { updateProductAction } from '../actions'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params
  const product = await getProductById(id)
  return { title: product ? `Sửa: ${product.name} - GTS Admin` : 'Sản phẩm không tồn tại' }
}

export default async function EditProductPage({ params }: Props) {
  const { id } = await params
  const [product, brands, categories] = await Promise.all([
    getProductById(id),
    getBrands(),
    getCategories(),
  ])

  if (!product) notFound()

  const boundAction = updateProductAction.bind(null, id)

  return (
    <div className="w-full space-y-6">
      <ProductForm
        action={boundAction}
        brands={brands as any[]}
        categories={categories}
        mode="edit"
        defaultValues={{
          id: product.id,
          name: product.name,
          slug: product.slug,
          model: product.model,
          brand_id: product.brand_id,
          category_id: product.category_id,
          product_type: product.product_type,
          short_description: product.short_description,
          description: product.description,
          thumbnail: product.thumbnail,
          is_active: product.is_active,
          is_featured: product.is_featured,
          seo_title: product.seo_title,
          seo_description: product.seo_description,
          variant_sku: product.variants?.[0]?.sku ?? '',
          variant_part_number: product.variants?.[0]?.part_number ?? '',
          variant_specs_summary: product.variants?.[0]?.specifications_summary ?? '',
        }}
      />
    </div>
  )
}
