import { NextRequest, NextResponse } from 'next/server'
import { query, queryOne } from '@/lib/db'
import { z } from 'zod'

const productSchema = z.object({
  name: z.string().min(2, 'Tên sản phẩm tối thiểu 2 ký tự'),
  slug: z.string().min(2, 'Slug tối thiểu 2 ký tự'),
  sku: z.string().min(2, 'Mã SKU tối thiểu 2 ký tự'),
  partNumber: z.string().nullable().optional(),
  series: z.string().nullable().optional(),
  categoryId: z.number().int().positive(),
  brandId: z.number().int().positive(),
  price: z.number().nullable().optional(),
  summary: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  images: z.array(z.string()).default([]),
  specs: z.record(z.string(), z.string()).default({}),
  portsDownlink: z.string().nullable().optional(),
  portsUplink: z.string().nullable().optional(),
  poeSupport: z.string().nullable().optional(),
  lifecycleStatus: z.string().optional().default('Active'),
  eosDate: z.string().nullable().optional(),
  availabilityStatus: z.string().optional().default('Contact for Price'),
  datasheetUrl: z.string().nullable().optional(),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q')

    let sql = `
      SELECT 
        p.id, p.category_id, p.brand_id, p.name, p.slug, p.sku, p.part_number, p.series,
        p.price, p.summary, p.description, p.images, p.specs,
        p.ports_downlink, p.ports_uplink, p.poe_support,
        p.lifecycle_status, p.eos_date, p.availability_status, p.datasheet_url,
        p.is_active, p.is_featured, p.view_count, p.created_at, p.updated_at,
        b.id as b_id, b.name as brand_name, b.slug as brand_slug,
        c.id as c_id, c.name as category_name, c.slug as category_slug
      FROM products p
      JOIN brands b ON p.brand_id = b.id
      JOIN categories c ON p.category_id = c.id
    `
    const params: any[] = []

    if (q) {
      sql += ` WHERE p.name ILIKE $1 OR p.sku ILIKE $1`
      params.push(`%${q}%`)
    }

    sql += ` ORDER BY p.created_at DESC`

    const rows = await query(sql, params)

    const products = rows.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      sku: p.sku,
      partNumber: p.part_number,
      series: p.series,
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
      portsDownlink: p.ports_downlink,
      portsUplink: p.ports_uplink,
      poeSupport: p.poe_support,
      lifecycleStatus: p.lifecycle_status,
      eosDate: p.eos_date,
      availabilityStatus: p.availability_status,
      datasheetUrl: p.datasheet_url,
      isActive: p.is_active,
      isFeatured: p.is_featured,
      viewCount: p.view_count,
      createdAt: p.created_at,
      updatedAt: p.updated_at,
      brand: { id: p.b_id, name: p.brand_name, slug: p.brand_slug },
      category: { id: p.c_id, name: p.category_name, slug: p.category_slug },
    }))

    return NextResponse.json({ data: products })
  } catch (err) {
    console.error('Admin GET products error:', err)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = productSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.format() }, { status: 400 })
    }

    const data = parsed.data

    // Check slug or SKU collision
    const existing = await queryOne<{ id: number }>(
      'SELECT id FROM products WHERE slug = $1 OR sku = $2 LIMIT 1',
      [data.slug, data.sku]
    )

    if (existing) {
      return NextResponse.json(
        { error: 'Slug hoặc SKU đã tồn tại trong hệ thống' },
        { status: 409 }
      )
    }

    const product = await queryOne(
      `INSERT INTO products (
         name, slug, sku, part_number, series, category_id, brand_id, price, summary,
         description, images, specs, ports_downlink, ports_uplink, poe_support,
         lifecycle_status, eos_date, availability_status, datasheet_url,
         is_active, is_featured
       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)
       RETURNING *`,
      [
        data.name,
        data.slug,
        data.sku,
        data.partNumber ?? null,
        data.series ?? null,
        data.categoryId,
        data.brandId,
        data.price ?? null,
        data.summary ?? null,
        data.description ?? null,
        JSON.stringify(data.images),
        JSON.stringify(data.specs),
        data.portsDownlink ?? null,
        data.portsUplink ?? null,
        data.poeSupport ?? null,
        data.lifecycleStatus ?? 'Active',
        data.eosDate ?? null,
        data.availabilityStatus ?? 'Contact for Price',
        data.datasheetUrl ?? null,
        data.isActive,
        data.isFeatured,
      ]
    )

    return NextResponse.json({ data: product, success: true }, { status: 201 })
  } catch (error) {
    console.error('Admin POST product error:', error)
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}
