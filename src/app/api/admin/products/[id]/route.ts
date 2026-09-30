import { NextRequest, NextResponse } from 'next/server'
import { queryOne, query } from '@/lib/db'
import { z } from 'zod'

const productUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  slug: z.string().min(2).optional(),
  sku: z.string().min(2).optional(),
  partNumber: z.string().nullable().optional(),
  series: z.string().nullable().optional(),
  categoryId: z.number().int().positive().optional(),
  brandId: z.number().int().positive().optional(),
  price: z.number().nullable().optional(),
  summary: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  images: z.array(z.string()).optional(),
  specs: z.record(z.string(), z.string()).optional(),
  portsDownlink: z.string().nullable().optional(),
  portsUplink: z.string().nullable().optional(),
  poeSupport: z.string().nullable().optional(),
  lifecycleStatus: z.string().optional(),
  eosDate: z.string().nullable().optional(),
  availabilityStatus: z.string().optional(),
  datasheetUrl: z.string().nullable().optional(),
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
})

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const raw = await queryOne<{
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
      part_number: string | null
      series: string | null
      ports_downlink: string | null
      ports_uplink: string | null
      poe_support: string | null
      lifecycle_status: string
      eos_date: string | null
      availability_status: string
      datasheet_url: string | null
      b_id: number
      brand_name: string
      brand_slug: string
      c_id: number
      category_name: string
      category_slug: string
    }>(
      `SELECT 
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
       WHERE p.id = $1 LIMIT 1`,
      [parseInt(id, 10)]
    )

    if (!raw) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const product = {
      id: raw.id,
      name: raw.name,
      slug: raw.slug,
      sku: raw.sku,
      partNumber: raw.part_number,
      series: raw.series,
      price: raw.price,
      summary: raw.summary,
      description: raw.description,
      images: Array.isArray(raw.images)
        ? raw.images
        : typeof raw.images === 'string'
        ? JSON.parse(raw.images)
        : [],
      specs:
        typeof raw.specs === 'object' && raw.specs !== null
          ? raw.specs
          : typeof raw.specs === 'string'
          ? JSON.parse(raw.specs)
          : {},
      portsDownlink: raw.ports_downlink,
      portsUplink: raw.ports_uplink,
      poeSupport: raw.poe_support,
      lifecycleStatus: raw.lifecycle_status,
      eosDate: raw.eos_date,
      availabilityStatus: raw.availability_status,
      datasheetUrl: raw.datasheet_url,
      isActive: raw.is_active,
      isFeatured: raw.is_featured,
      viewCount: raw.view_count,
      createdAt: raw.created_at,
      updatedAt: raw.updated_at,
      brand: { id: raw.b_id, name: raw.brand_name, slug: raw.brand_slug },
      category: { id: raw.c_id, name: raw.category_name, slug: raw.category_slug },
    }

    return NextResponse.json({ data: product })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const parsed = productUpdateSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.format() }, { status: 400 })
    }

    const data = parsed.data
    const updates: string[] = []
    const queryParams: any[] = []
    let paramIdx = 1

    if (data.name !== undefined) {
      updates.push(`name = $${paramIdx++}`)
      queryParams.push(data.name)
    }
    if (data.slug !== undefined) {
      updates.push(`slug = $${paramIdx++}`)
      queryParams.push(data.slug)
    }
    if (data.sku !== undefined) {
      updates.push(`sku = $${paramIdx++}`)
      queryParams.push(data.sku)
    }
    if (data.partNumber !== undefined) {
      updates.push(`part_number = $${paramIdx++}`)
      queryParams.push(data.partNumber)
    }
    if (data.series !== undefined) {
      updates.push(`series = $${paramIdx++}`)
      queryParams.push(data.series)
    }
    if (data.categoryId !== undefined) {
      updates.push(`category_id = $${paramIdx++}`)
      queryParams.push(data.categoryId)
    }
    if (data.brandId !== undefined) {
      updates.push(`brand_id = $${paramIdx++}`)
      queryParams.push(data.brandId)
    }
    if (data.price !== undefined) {
      updates.push(`price = $${paramIdx++}`)
      queryParams.push(data.price)
    }
    if (data.summary !== undefined) {
      updates.push(`summary = $${paramIdx++}`)
      queryParams.push(data.summary)
    }
    if (data.description !== undefined) {
      updates.push(`description = $${paramIdx++}`)
      queryParams.push(data.description)
    }
    if (data.images !== undefined) {
      updates.push(`images = $${paramIdx++}`)
      queryParams.push(JSON.stringify(data.images))
    }
    if (data.specs !== undefined) {
      updates.push(`specs = $${paramIdx++}`)
      queryParams.push(JSON.stringify(data.specs))
    }
    if (data.portsDownlink !== undefined) {
      updates.push(`ports_downlink = $${paramIdx++}`)
      queryParams.push(data.portsDownlink)
    }
    if (data.portsUplink !== undefined) {
      updates.push(`ports_uplink = $${paramIdx++}`)
      queryParams.push(data.portsUplink)
    }
    if (data.poeSupport !== undefined) {
      updates.push(`poe_support = $${paramIdx++}`)
      queryParams.push(data.poeSupport)
    }
    if (data.lifecycleStatus !== undefined) {
      updates.push(`lifecycle_status = $${paramIdx++}`)
      queryParams.push(data.lifecycleStatus)
    }
    if (data.eosDate !== undefined) {
      updates.push(`eos_date = $${paramIdx++}`)
      queryParams.push(data.eosDate)
    }
    if (data.availabilityStatus !== undefined) {
      updates.push(`availability_status = $${paramIdx++}`)
      queryParams.push(data.availabilityStatus)
    }
    if (data.datasheetUrl !== undefined) {
      updates.push(`datasheet_url = $${paramIdx++}`)
      queryParams.push(data.datasheetUrl)
    }
    if (data.isActive !== undefined) {
      updates.push(`is_active = $${paramIdx++}`)
      queryParams.push(data.isActive)
    }
    if (data.isFeatured !== undefined) {
      updates.push(`is_featured = $${paramIdx++}`)
      queryParams.push(data.isFeatured)
    }

    if (updates.length === 0) {
      return NextResponse.json({ message: 'No changes provided' })
    }

    updates.push(`updated_at = NOW()`)
    queryParams.push(parseInt(id, 10))

    const sql = `UPDATE products SET ${updates.join(', ')} WHERE id = $${paramIdx} RETURNING *`
    const product = await queryOne(sql, queryParams)

    return NextResponse.json({ data: product, success: true })
  } catch (error) {
    console.error('Update product error:', error)
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await query('DELETE FROM products WHERE id = $1', [parseInt(id, 10)])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete product error:', error)
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
  }
}
