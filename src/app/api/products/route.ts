import { NextRequest, NextResponse } from 'next/server'
import { query, queryOne } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const brand = searchParams.get('brand')
    const q = searchParams.get('q')
    const price = searchParams.get('price')
    const featured = searchParams.get('featured')
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '12', 10)))

    const conditions: string[] = ['p.is_active = true']
    const params: any[] = []
    let paramIdx = 1

    if (category) {
      conditions.push(`c.slug = $${paramIdx++}`)
      params.push(category)
    }

    if (brand) {
      conditions.push(`b.slug = $${paramIdx++}`)
      params.push(brand)
    }

    if (price === 'priced') {
      conditions.push('p.price > 0')
    } else if (price === 'contact') {
      conditions.push('p.price IS NULL')
    }

    if (featured === 'true') {
      conditions.push('p.is_featured = true')
    }

    if (q) {
      conditions.push(
        `(p.name ILIKE $${paramIdx} OR p.sku ILIKE $${paramIdx} OR p.summary ILIKE $${paramIdx})`
      )
      params.push(`%${q}%`)
      paramIdx++
    }

    const whereClause = `WHERE ${conditions.join(' AND ')}`
    const offset = (page - 1) * limit

    const countSql = `
      SELECT COUNT(*)::int as total
      FROM products p
      JOIN brands b ON p.brand_id = b.id
      JOIN categories c ON p.category_id = c.id
      ${whereClause}
    `

    const listSql = `
      SELECT 
        p.id, p.category_id, p.brand_id, p.name, p.slug, p.sku, p.price,
        p.summary, p.description, p.images, p.specs, p.is_active, p.is_featured,
        p.view_count, p.created_at, p.updated_at,
        b.id as b_id, b.name as brand_name, b.slug as brand_slug, b.logo as brand_logo,
        c.id as c_id, c.name as category_name, c.slug as category_slug
      FROM products p
      JOIN brands b ON p.brand_id = b.id
      JOIN categories c ON p.category_id = c.id
      ${whereClause}
      ORDER BY p.created_at DESC
      LIMIT $${paramIdx++} OFFSET $${paramIdx++}
    `

    const [rows, countRes] = await Promise.all([
      query(listSql, [...params, limit, offset]),
      queryOne<{ total: number }>(countSql, params),
    ])

    const total = countRes?.total ?? 0
    const products = rows.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      sku: p.sku,
      price: p.price,
      summary: p.summary,
      description: p.description,
      images: Array.isArray(p.images)
        ? p.images
        : typeof p.images === 'string'
        ? JSON.parse(p.images)
        : [],
      specs:
        typeof p.specs === 'object' && p.specs !== null
          ? p.specs
          : typeof p.specs === 'string'
          ? JSON.parse(p.specs)
          : {},
      isActive: p.is_active,
      isFeatured: p.is_featured,
      viewCount: p.view_count,
      createdAt: p.created_at,
      updatedAt: p.updated_at,
      brand: {
        id: p.b_id,
        name: p.brand_name,
        slug: p.brand_slug,
        logo: p.brand_logo,
      },
      category: {
        id: p.c_id,
        name: p.category_name,
        slug: p.category_slug,
      },
    }))

    return NextResponse.json({
      data: products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('API products error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
