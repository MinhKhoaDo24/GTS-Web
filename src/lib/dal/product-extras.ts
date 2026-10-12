/**
 * DAL — Product Extras
 *
 * Bổ sung cho sản phẩm:
 *  - product_images   (gallery ảnh)
 *  - product_variants (SKU / phiên bản chi tiết)
 *  - product_relationships (sản phẩm liên quan)
 */

import { query, queryOne } from '@/lib/db'

// ─── Types ──────────────────────────────────────────────────────────────────

export interface ProductImage {
  id: string
  product_id: string
  image_url: string
  image_path: string | null
  image_type: string | null
  alt_text: string | null
  sort_order: number
  is_primary: boolean
}

export interface ProductVariant {
  id: string
  product_id: string
  sku: string | null
  pid: string | null
  model_number: string | null
  part_number: string | null
  variant_name: string | null
  region: string | null
  color: string | null
  bundle: string | null
  specifications_summary: string | null
  status: string | null
  notes: string | null
  is_active: boolean
}

export interface RelatedProduct {
  id: string
  relationship_id: string
  product_id: string
  related_product_id: string
  relationship_type: string | null
  notes: string | null
  related_name: string
  related_slug: string
  related_thumbnail: string | null
  related_brand: string | null
}

// ─── Product Images ──────────────────────────────────────────────────────────

export async function getProductImages(productId: string): Promise<ProductImage[]> {
  return query<ProductImage>(
    `SELECT * FROM product_images
     WHERE product_id = $1
     ORDER BY sort_order ASC, is_primary DESC`,
    [productId]
  )
}

export async function addProductImage(data: {
  product_id: string
  image_url: string
  image_type?: string | null
  alt_text?: string | null
  sort_order?: number
  is_primary?: boolean
}): Promise<{ id: string }> {
  const id = `img-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`

  // Nếu set là primary, bỏ primary các ảnh khác trước
  if (data.is_primary) {
    await query(
      `UPDATE product_images SET is_primary = false WHERE product_id = $1`,
      [data.product_id]
    )
  }

  await query(
    `INSERT INTO product_images (id, product_id, image_url, image_type, alt_text, sort_order, is_primary)
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [
      id, data.product_id, data.image_url,
      data.image_type ?? 'gallery',
      data.alt_text ?? null,
      data.sort_order ?? 0,
      data.is_primary ?? false,
    ]
  )

  return { id }
}

export async function updateProductImage(
  id: string,
  data: Partial<Pick<ProductImage, 'alt_text' | 'sort_order' | 'is_primary' | 'image_type'>> & { product_id?: string }
): Promise<void> {
  // Nếu set primary, bỏ primary cũ
  if (data.is_primary && data.product_id) {
    await query(
      `UPDATE product_images SET is_primary = false WHERE product_id = $1 AND id != $2`,
      [data.product_id, id]
    )
  }

  const fields: string[] = []
  const values: any[] = []
  let idx = 1

  const allowed: (keyof typeof data)[] = ['alt_text', 'sort_order', 'is_primary', 'image_type']
  for (const key of allowed) {
    if (key in data) {
      fields.push(`${key} = $${idx++}`)
      values.push((data as any)[key])
    }
  }

  if (!fields.length) return
  values.push(id)
  await query(`UPDATE product_images SET ${fields.join(', ')} WHERE id = $${idx}`, values)
}

export async function deleteProductImage(id: string): Promise<void> {
  await query('DELETE FROM product_images WHERE id = $1', [id])
}

export async function reorderProductImages(
  images: { id: string; sort_order: number }[]
): Promise<void> {
  for (const img of images) {
    await query(
      `UPDATE product_images SET sort_order = $1 WHERE id = $2`,
      [img.sort_order, img.id]
    )
  }
}

// ─── Product Variants ────────────────────────────────────────────────────────

export async function getProductVariants(productId: string): Promise<ProductVariant[]> {
  return query<ProductVariant>(
    `SELECT * FROM product_variants
     WHERE product_id = $1
     ORDER BY is_active DESC, id ASC`,
    [productId]
  )
}

export async function createProductVariant(data: {
  product_id: string
  sku?: string | null
  pid?: string | null
  model_number?: string | null
  part_number?: string | null
  variant_name?: string | null
  region?: string | null
  color?: string | null
  bundle?: string | null
  specifications_summary?: string | null
  status?: string | null
  notes?: string | null
  is_active?: boolean
}): Promise<{ id: string }> {
  const id = `var-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
  await query(
    `INSERT INTO product_variants (
      id, product_id, sku, pid, model_number, part_number,
      variant_name, region, color, bundle,
      specifications_summary, status, notes, is_active
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)`,
    [
      id, data.product_id,
      data.sku ?? null, data.pid ?? null,
      data.model_number ?? null, data.part_number ?? null,
      data.variant_name ?? null, data.region ?? null,
      data.color ?? null, data.bundle ?? null,
      data.specifications_summary ?? null,
      data.status ?? 'active',
      data.notes ?? null,
      data.is_active ?? true,
    ]
  )
  return { id }
}

export async function updateProductVariant(
  id: string,
  data: Partial<Omit<ProductVariant, 'id' | 'product_id'>>
): Promise<void> {
  const allowed: (keyof typeof data)[] = [
    'sku', 'pid', 'model_number', 'part_number', 'variant_name',
    'region', 'color', 'bundle', 'specifications_summary',
    'status', 'notes', 'is_active',
  ]
  const fields: string[] = []
  const values: any[] = []
  let idx = 1

  for (const key of allowed) {
    if (key in data) {
      fields.push(`${key} = $${idx++}`)
      values.push((data as any)[key])
    }
  }
  if (!fields.length) return
  values.push(id)
  await query(`UPDATE product_variants SET ${fields.join(', ')} WHERE id = $${idx}`, values)
}

export async function deleteProductVariant(id: string): Promise<void> {
  await query('DELETE FROM product_variants WHERE id = $1', [id])
}

// ─── Product Relationships ───────────────────────────────────────────────────

export async function getProductRelationships(productId: string): Promise<RelatedProduct[]> {
  return query<RelatedProduct>(
    `SELECT
       pr.id AS relationship_id,
       pr.product_id, pr.related_product_id,
       pr.relationship_type, pr.notes,
       p.id, p.name AS related_name, p.slug AS related_slug,
       p.thumbnail AS related_thumbnail,
       b.name AS related_brand
     FROM product_relationships pr
     JOIN products p ON p.id = pr.related_product_id
     LEFT JOIN brands b ON p.brand_id = b.id
     WHERE pr.product_id = $1
     ORDER BY pr.relationship_type ASC, p.name ASC`,
    [productId]
  )
}

export async function addProductRelationship(data: {
  product_id: string
  related_product_id: string
  relationship_type?: string | null
  notes?: string | null
}): Promise<{ id: string }> {
  // Tránh trùng lặp
  const existing = await queryOne<{ id: string }>(
    `SELECT id FROM product_relationships
     WHERE product_id = $1 AND related_product_id = $2`,
    [data.product_id, data.related_product_id]
  )
  if (existing) return { id: existing.id }

  const id = `rel-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
  await query(
    `INSERT INTO product_relationships (id, product_id, related_product_id, relationship_type, notes)
     VALUES ($1,$2,$3,$4,$5)`,
    [id, data.product_id, data.related_product_id, data.relationship_type ?? 'related', data.notes ?? null]
  )
  return { id }
}

export async function deleteProductRelationship(id: string): Promise<void> {
  await query('DELETE FROM product_relationships WHERE id = $1', [id])
}

/**
 * Tìm kiếm sản phẩm để thêm vào related (dùng cho autocomplete)
 */
export async function searchProductsForRelation(
  searchQuery: string,
  excludeId: string,
  limit = 10
): Promise<{ id: string; name: string; slug: string; thumbnail: string | null; brand_name: string | null }[]> {
  return query(
    `SELECT p.id, p.name, p.slug, p.thumbnail, b.name AS brand_name
     FROM products p
     LEFT JOIN brands b ON p.brand_id = b.id
     WHERE p.id != $1
       AND p.is_active = true
       AND (p.name ILIKE $2 OR p.model ILIKE $2 OR p.slug ILIKE $2)
     ORDER BY p.name ASC
     LIMIT $3`,
    [excludeId, `%${searchQuery}%`, limit]
  )
}
