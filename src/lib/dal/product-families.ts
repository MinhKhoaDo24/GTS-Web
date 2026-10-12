/**
 * DAL — Product Families (Dòng sản phẩm / Series)
 */
import { query, queryOne } from '@/lib/db'

export interface ProductFamilyItem {
  id: string
  brand_id: string | null
  domain_id: string | null
  name: string
  slug: string
  description: string | null
  image: string | null
  sort_order: number
  is_active: boolean
  brand_name?: string | null
  brand_slug?: string | null
  brand_logo?: string | null
  product_count: number
}

export interface CreateProductFamilyInput {
  name: string
  slug: string
  brand_id?: string | null
  domain_id?: string | null
  description?: string | null
  image?: string | null
  sort_order?: number
  is_active?: boolean
}

export async function getProductFamilies(params: {
  brand_id?: string
  activeOnly?: boolean
  search?: string
} = {}): Promise<ProductFamilyItem[]> {
  const conditions: string[] = []
  const values: any[] = []
  let idx = 1

  if (params.activeOnly) {
    conditions.push(`pf.is_active = true`)
  }

  if (params.brand_id) {
    conditions.push(`pf.brand_id = $${idx++}`)
    values.push(params.brand_id)
  }

  if (params.search) {
    conditions.push(`(pf.name ILIKE $${idx} OR pf.slug ILIKE $${idx} OR pf.description ILIKE $${idx})`)
    values.push(`%${params.search}%`)
    idx++
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''

  return query<ProductFamilyItem>(
    `SELECT
       pf.id,
       pf.brand_id,
       pf.domain_id,
       pf.name,
       pf.slug,
       pf.description,
       pf.image,
       COALESCE(pf.sort_order, 0) AS sort_order,
       COALESCE(pf.is_active, true) AS is_active,
       b.name AS brand_name,
       b.slug AS brand_slug,
       b.logo AS brand_logo,
       (SELECT COUNT(*)::int FROM products p WHERE p.family_id = pf.id) AS product_count
     FROM product_families pf
     LEFT JOIN brands b ON pf.brand_id = b.id
     ${where}
     ORDER BY pf.sort_order ASC, pf.name ASC`,
    values
  )
}

export async function getProductFamilyById(id: string): Promise<ProductFamilyItem | null> {
  return queryOne<ProductFamilyItem>(
    `SELECT
       pf.id,
       pf.brand_id,
       pf.domain_id,
       pf.name,
       pf.slug,
       pf.description,
       pf.image,
       COALESCE(pf.sort_order, 0) AS sort_order,
       COALESCE(pf.is_active, true) AS is_active,
       b.name AS brand_name,
       b.slug AS brand_slug,
       b.logo AS brand_logo,
       (SELECT COUNT(*)::int FROM products p WHERE p.family_id = pf.id) AS product_count
     FROM product_families pf
     LEFT JOIN brands b ON pf.brand_id = b.id
     WHERE pf.id = $1`,
    [id]
  )
}

export async function createProductFamily(data: CreateProductFamilyInput): Promise<{ id: string }> {
  const id = `fam-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
  await query(
    `INSERT INTO product_families (id, brand_id, domain_id, name, slug, description, image, sort_order, is_active)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
    [
      id,
      data.brand_id || null,
      data.domain_id || null,
      data.name,
      data.slug,
      data.description || null,
      data.image || null,
      data.sort_order ?? 0,
      data.is_active ?? true,
    ]
  )
  return { id }
}

export async function updateProductFamily(
  id: string,
  data: Partial<CreateProductFamilyInput>
): Promise<void> {
  const fields: string[] = []
  const values: any[] = []
  let idx = 1

  const allowedCols = ['brand_id', 'domain_id', 'name', 'slug', 'description', 'image', 'sort_order', 'is_active']

  for (const [k, v] of Object.entries(data)) {
    if (allowedCols.includes(k)) {
      fields.push(`${k} = $${idx++}`)
      values.push(v ?? null)
    }
  }

  if (!fields.length) return

  values.push(id)
  await query(`UPDATE product_families SET ${fields.join(', ')} WHERE id = $${idx}`, values)
}

export async function deleteProductFamily(id: string): Promise<void> {
  // Set null on products referring to this family so deletion succeeds cleanly
  await query(`UPDATE products SET family_id = NULL WHERE family_id = $1`, [id])
  await query(`DELETE FROM product_families WHERE id = $1`, [id])
}

export async function countProductFamilies(): Promise<number> {
  const r = await queryOne<{ count: number }>(`SELECT COUNT(*)::int AS count FROM product_families`)
  return r?.count ?? 0
}
