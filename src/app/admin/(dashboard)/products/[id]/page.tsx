import { notFound } from 'next/navigation'
import { getProductById, getBrands, getCategories, getProductFamilies } from '@/lib/dal'
import {
  getProductImages,
  getProductVariants,
  getProductRelationships,
} from '@/lib/dal/product-extras'
import { ProductEditTabs } from '../_components/ProductEditTabs'
import { updateProductAction } from '../actions'

interface Props {
  params: Promise<{ id: string }>
  searchParams?: Promise<{ tab?: string }>
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params
  const product = await getProductById(id)
  return {
    title: product ? `Sửa: ${product.name} - GTS Admin` : 'Sản phẩm không tồn tại',
  }
}

export default async function EditProductPage({ params, searchParams }: Props) {
  const { id } = await params
  const { tab } = (await searchParams) ?? {}

  const [product, brands, categories, families, images, variants, relations] = await Promise.all([
    getProductById(id),
    getBrands(),
    getCategories(),
    getProductFamilies({ activeOnly: true }),
    getProductImages(id).catch(() => []),
    getProductVariants(id).catch(() => []),
    getProductRelationships(id).catch(() => []),
  ])

  if (!product) notFound()

  const boundAction = updateProductAction.bind(null, id)

  return (
    <ProductEditTabs
      product={product}
      brands={brands as any[]}
      categories={categories}
      families={families}
      images={images}
      variants={variants}
      relations={relations}
      updateAction={boundAction}
      initialTab={tab}
    />
  )
}
