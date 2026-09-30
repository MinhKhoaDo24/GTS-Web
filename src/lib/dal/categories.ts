/**
 * DAL — Categories
 */
import { query, queryOne } from '@/lib/db'

export interface CategoryWithMeta {
  id: string
  name: string
  slug: string
  description: string | null
  domain_id: string | null
  domain_name: string | null
  parent_id: string | null
  parent_name: string | null
  sort_order: number
  is_active: boolean
  product_count: number
}

export async function getCategories(): Promise<CategoryWithMeta[]> {
  return query<CategoryWithMeta>(
    `SELECT
      c.id, c.name, c.slug, c.description,
      c.domain_id, d.name AS domain_name,
      c.parent_id, p.name AS parent_name,
      c.sort_order, c.is_active,
      COUNT(pr.id)::int AS product_count
     FROM categories c
     LEFT JOIN domains d ON c.domain_id = d.id
     LEFT JOIN categories p ON c.parent_id = p.id
     LEFT JOIN products pr ON pr.category_id = c.id
     GROUP BY c.id, d.name, p.name
     ORDER BY c.sort_order ASC, c.name ASC`
  )
}

export async function getCategoryById(id: string) {
  return queryOne(
    `SELECT c.*, d.name AS domain_name
     FROM categories c
     LEFT JOIN domains d ON c.domain_id = d.id
     WHERE c.id = $1`,
    [id]
  )
}

export async function createCategory(data: {
  name: string
  slug: string
  description?: string | null
  domain_id?: string | null
  parent_id?: string | null
  sort_order?: number
  is_active?: boolean
}) {
  const id = `cat-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
  await query(
    `INSERT INTO categories (id, name, slug, description, domain_id, parent_id, sort_order, is_active)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
    [
      id, data.name, data.slug, data.description ?? null,
      data.domain_id ?? null, data.parent_id ?? null,
      data.sort_order ?? 0, data.is_active ?? true,
    ]
  )
  return { id }
}

export async function updateCategory(
  id: string,
  data: Partial<{
    name: string; slug: string; description: string | null
    domain_id: string | null; parent_id: string | null
    sort_order: number; is_active: boolean
  }>
) {
  const fields: string[] = []
  const values: any[] = []
  let idx = 1
  for (const [k, v] of Object.entries(data)) {
    fields.push(`${k} = $${idx++}`)
    values.push(v)
  }
  if (!fields.length) return
  values.push(id)
  await query(`UPDATE categories SET ${fields.join(', ')} WHERE id = $${idx}`, values)
}

export async function deleteCategory(id: string) {
  await query('DELETE FROM categories WHERE id = $1', [id])
}

export async function countCategories(): Promise<number> {
  const r = await queryOne<{ count: number }>('SELECT COUNT(*)::int AS count FROM categories')
  return r?.count ?? 0
}
