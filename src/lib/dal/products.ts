/**
 * DAL (Data Access Layer) — Products
 *
 * Tất cả SQL liên quan đến sản phẩm đặt ở đây.
 * UI components & Server Actions chỉ import từ file này.
 *
 * KHI MIGRATE: Chỉ cần đổi DATABASE_URL trong .env
 * Không cần đổi bất kỳ dòng code nào ở đây hay trong UI.
 */

import { query, queryOne } from '@/lib/db'
import type { Product, Brand, Category } from '@/types/database'

// ─── Types ─────────────────────────────────────────────────────────────────

export interface ProductListItem {
  id: string
  name: string
  slug: string
  model: string | null
  thumbnail: string | null
  product_type: string
  status: string
  is_active: boolean
  is_featured: boolean
  brand_id: string
  brand_name: string
  brand_slug: string
  category_id: string
  category_name: string
  variant_count: number
  created_at: Date
  updated_at: Date
}

export interface ProductDetail extends Product {
  brand_name: string
  brand_slug: string
  category_name: string
  category_slug: string
  variants: Array<{
    id: string
    sku: string | null
    part_number: string | null
    variant_name: string | null
    specifications_summary: string | null
    is_active: boolean
  }>
}

export interface ProductListParams {
  page?: number
  limit?: number
  search?: string
  brandId?: string
  categoryId?: string
  isActive?: boolean
  isFeatured?: boolean
}

export interface ProductListResult {
  items: ProductListItem[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// ─── READ Operations ────────────────────────────────────────────────────────

/**
 * Lấy danh sách sản phẩm có phân trang, tìm kiếm, lọc
 */
export async function getProducts(params: ProductListParams = {}): Promise<ProductListResult> {
  const {
    page = 1,
    limit = 20,
    search = '',
    brandId,
    categoryId,
    isActive,
    isFeatured,
  } = params

  const conditions: string[] = []
  const values: any[] = []
  let idx = 1

  if (search) {
    conditions.push(
      `(p.name ILIKE $${idx} OR p.model ILIKE $${idx} OR p.slug ILIKE $${idx})`
    )
    values.push(`%${search}%`)
    idx++
  }
  if (brandId) {
    conditions.push(`p.brand_id = $${idx++}`)
    values.push(brandId)
  }
  if (categoryId) {
    conditions.push(`p.category_id = $${idx++}`)
    values.push(categoryId)
  }
  if (isActive !== undefined) {
    conditions.push(`p.is_active = $${idx++}`)
    values.push(isActive)
  }
  if (isFeatured !== undefined) {
    conditions.push(`p.is_featured = $${idx++}`)
    values.push(isFeatured)
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''
  const offset = (page - 1) * limit

  const [countResult, rows] = await Promise.all([
    queryOne<{ total: number }>(
      `SELECT COUNT(*)::int AS total FROM products p ${where}`,
      values
    ),
    query<ProductListItem>(
      `SELECT
        p.id, p.name, p.slug, p.model, p.thumbnail,
        p.product_type, p.status, p.is_active, p.is_featured,
        p.brand_id, p.category_id,
        p.created_at, p.updated_at,
        b.name AS brand_name, b.slug AS brand_slug,
        c.name AS category_name,
        COUNT(pv.id)::int AS variant_count
       FROM products p
       LEFT JOIN brands b ON p.brand_id = b.id
       LEFT JOIN categories c ON p.category_id = c.id
       LEFT JOIN product_variants pv ON pv.product_id = p.id AND pv.is_active = true
       ${where}
       GROUP BY p.id, b.id, c.id
       ORDER BY p.created_at DESC
       LIMIT $${idx} OFFSET $${idx + 1}`,
      [...values, limit, offset]
    ),
  ])

  const total = countResult?.total ?? 0

  return {
    items: rows,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  }
}

/**
 * Lấy một sản phẩm theo ID (cho trang Edit)
 */
export async function getProductById(id: string): Promise<ProductDetail | null> {
  const product = await queryOne<ProductDetail>(
    `SELECT
      p.*,
      b.name AS brand_name, b.slug AS brand_slug,
      c.name AS category_name, c.slug AS category_slug
     FROM products p
     LEFT JOIN brands b ON p.brand_id = b.id
     LEFT JOIN categories c ON p.category_id = c.id
     WHERE p.id = $1`,
    [id]
  )

  if (!product) return null

  const variants = await query(
    `SELECT id, sku, part_number, variant_name, specifications_summary, is_active
     FROM product_variants
     WHERE product_id = $1
     ORDER BY created_at ASC`,
    [id]
  )

  return { ...product, variants }
}

/**
 * Đếm tổng số sản phẩm (dùng cho Dashboard stats)
 */
export async function countProducts(): Promise<number> {
  const result = await queryOne<{ count: number }>(
    'SELECT COUNT(*)::int AS count FROM products'
  )
  return result?.count ?? 0
}

// ─── WRITE Operations ───────────────────────────────────────────────────────

export interface CreateProductInput {
  name: string
  slug: string
  model?: string | null
  short_description?: string | null
  description?: string | null
  product_type: 'hardware' | 'software' | 'license' | 'service' | 'bundle'
  status?: string
  brand_id: string
  domain_id?: string | null
  family_id?: string | null
  category_id: string
  thumbnail?: string | null
  is_featured?: boolean
  is_active?: boolean
  seo_title?: string | null
  seo_description?: string | null
}

/**
 * Tạo sản phẩm mới
 */
export async function createProduct(
  data: CreateProductInput
): Promise<{ id: string }> {
  const id = `prod-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`

  await query(
    `INSERT INTO products (
      id, name, slug, model, short_description, description,
      product_type, status, brand_id, domain_id, family_id, category_id,
      thumbnail, is_featured, is_active, seo_title, seo_description
    ) VALUES (
      $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17
    )`,
    [
      id,
      data.name,
      data.slug,
      data.model ?? null,
      data.short_description ?? null,
      data.description ?? null,
      data.product_type,
      data.status ?? 'active',
      data.brand_id,
      data.domain_id ?? null,
      data.family_id ?? null,
      data.category_id,
      data.thumbnail ?? null,
      data.is_featured ?? false,
      data.is_active ?? true,
      data.seo_title ?? null,
      data.seo_description ?? null,
    ]
  )

  return { id }
}

export type UpdateProductInput = Partial<CreateProductInput>

/**
 * Cập nhật sản phẩm
 */
export async function updateProduct(
  id: string,
  data: UpdateProductInput
): Promise<void> {
  const fields: string[] = []
  const values: any[] = []
  let idx = 1

  const allowed: (keyof UpdateProductInput)[] = [
    'name', 'slug', 'model', 'short_description', 'description',
    'product_type', 'status', 'brand_id', 'domain_id', 'family_id',
    'category_id', 'thumbnail', 'is_featured', 'is_active',
    'seo_title', 'seo_description',
  ]

  for (const key of allowed) {
    if (key in data) {
      fields.push(`${key} = $${idx++}`)
      values.push((data as any)[key])
    }
  }

  if (fields.length === 0) return

  fields.push(`updated_at = NOW()`)
  values.push(id)

  await query(
    `UPDATE products SET ${fields.join(', ')} WHERE id = $${idx}`,
    values
  )
}

/**
 * Toggle is_active / is_featured nhanh (optimistic UI)
 */
export async function toggleProductField(
  id: string,
  field: 'is_active' | 'is_featured',
  value: boolean
): Promise<void> {
  await query(
    `UPDATE products SET ${field} = $1, updated_at = NOW() WHERE id = $2`,
    [value, id]
  )
}

/**
 * Xóa sản phẩm (và CASCADE variants, images, specs...)
 */
export async function deleteProduct(id: string): Promise<void> {
  await query('DELETE FROM products WHERE id = $1', [id])
}


