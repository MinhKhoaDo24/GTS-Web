import { NextRequest, NextResponse } from 'next/server'
import { queryOne } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const rawProduct = await queryOne<{
      id: number
      category_id: number
      brand_id: number
      name: string
      slug: string
      sku: string
      price: number | null
      summary: string | null
      description: string | null
      images: any
      specs: any
      is_active: boolean
      is_featured: boolean
      view_count: number
      created_at: Date
      updated_at: Date
      b_id: number
      brand_name: string
      brand_slug: string
      brand_logo: string | null
      c_id: number
      category_name: string
      category_slug: string
    }>(
      `SELECT 
         p.id, p.category_id, p.brand_id, p.name, p.slug, p.sku, p.price,
         p.summary, p.description, p.images, p.specs, p.is_active, p.is_featured,
         p.view_count, p.created_at, p.updated_at,
         b.id as b_id, b.name as brand_name, b.slug as brand_slug, b.logo as brand_logo,
         c.id as c_id, c.name as category_name, c.slug as category_slug
       FROM products p
       JOIN brands b ON p.brand_id = b.id
       JOIN categories c ON p.category_id = c.id
       WHERE p.slug = $1 AND p.is_active = true
       LIMIT 1`,
      [slug]
    )

    if (!rawProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    const product = {
      id: rawProduct.id,
      name: rawProduct.name,
      slug: rawProduct.slug,
      sku: rawProduct.sku,
      price: rawProduct.price,
      summary: rawProduct.summary,
      description: rawProduct.description,
      images: Array.isArray(rawProduct.images)
        ? rawProduct.images
        : typeof rawProduct.images === 'string'
        ? JSON.parse(rawProduct.images)
        : [],
      specs:
        typeof rawProduct.specs === 'object' && rawProduct.specs !== null
          ? rawProduct.specs
          : typeof rawProduct.specs === 'string'
          ? JSON.parse(rawProduct.specs)
          : {},
      isActive: rawProduct.is_active,
      isFeatured: rawProduct.is_featured,
      viewCount: rawProduct.view_count,
      createdAt: rawProduct.created_at,
      updatedAt: rawProduct.updated_at,
      brand: {
        id: rawProduct.b_id,
        name: rawProduct.brand_name,
        slug: rawProduct.brand_slug,
        logo: rawProduct.brand_logo,
      },
      category: {
        id: rawProduct.c_id,
        name: rawProduct.category_name,
        slug: rawProduct.category_slug,
      },
    }

    return NextResponse.json({ data: product })
  } catch (error) {
    console.error('API product detail error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
