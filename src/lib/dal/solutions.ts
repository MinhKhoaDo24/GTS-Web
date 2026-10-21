/**
 * DAL — Solutions (Giải pháp Doanh nghiệp)
 */
import { query, queryOne } from '@/lib/db'
import type { Solution } from '@/types/database'

export interface SolutionListParams {
  page?: number
  limit?: number
  search?: string
  isActive?: boolean
}

export async function getSolutions(params: SolutionListParams = {}) {
  const { page = 1, limit = 50, search, isActive } = params
  const conditions: string[] = []
  const values: any[] = []
  let idx = 1

  if (search) {
    conditions.push(`(name ILIKE $${idx} OR short_description ILIKE $${idx} OR slug ILIKE $${idx})`)
    values.push(`%${search}%`)
    idx++
  }

  if (isActive !== undefined) {
    conditions.push(`is_active = $${idx++}`)
    values.push(isActive)
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''
  const offset = (page - 1) * limit

  const [countResult, items] = await Promise.all([
    queryOne<{ total: number }>(`SELECT COUNT(*)::int AS total FROM solutions ${where}`, values),
    query<Solution>(
      `SELECT * FROM solutions ${where}
       ORDER BY sort_order ASC, created_at DESC
       LIMIT $${idx} OFFSET $${idx + 1}`,
      [...values, limit, offset]
    ),
  ])

  const total = countResult?.total ?? 0
  return { items, total, page, limit, totalPages: Math.ceil(total / limit) }
}

export async function getSolutionById(id: string): Promise<Solution | null> {
  return queryOne<Solution>('SELECT * FROM solutions WHERE id = $1', [id])
}

export async function getSolutionBySlug(slug: string): Promise<Solution | null> {
  return queryOne<Solution>(
    'SELECT * FROM solutions WHERE slug = $1 AND is_active = true LIMIT 1',
    [slug]
  )
}

export async function getAllActiveSolutions(): Promise<Solution[]> {
  return query<Solution>(
    'SELECT * FROM solutions WHERE is_active = true ORDER BY sort_order ASC, created_at ASC'
  )
}

export interface SolutionProductItem {
  id: string
  solution_id: string
  product_id: string
  role: string | null
  notes: string | null
  sort_order: number
  product_name: string
  product_slug: string
  product_model: string | null
  product_thumbnail: string | null
  product_short_desc: string | null
  brand_name: string | null
}

export async function getSolutionProducts(solutionId: string): Promise<SolutionProductItem[]> {
  return query<SolutionProductItem>(
    `SELECT 
       sp.id, sp.solution_id, sp.product_id, sp.role, sp.notes, sp.sort_order,
       p.name AS product_name, p.slug AS product_slug, p.model AS product_model,
       p.thumbnail AS product_thumbnail, p.short_description AS product_short_desc,
       b.name AS brand_name
     FROM solution_products sp
     JOIN products p ON p.id = sp.product_id
     LEFT JOIN brands b ON b.id = p.brand_id
     WHERE sp.solution_id = $1 AND p.is_active = true
     ORDER BY sp.sort_order ASC, sp.id ASC`,
    [solutionId]
  )
}

export async function getOtherSolutions(currentSlug: string, limit = 6): Promise<Solution[]> {
  return query<Solution>(
    `SELECT id, domain_id, name, slug, short_description, thumbnail, banner, sort_order, is_featured, is_active
     FROM solutions 
     WHERE is_active = true AND slug != $1 
     ORDER BY sort_order ASC 
     LIMIT $2`,
    [currentSlug, limit]
  )
}

export async function getRelatedProductsForSolution(solutionSlug: string, limit = 4): Promise<SolutionProductItem[]> {
  const categoryKeywords: Record<string, string[]> = {
    'giai-phap-wifi': ['access-points', 'switch'],
    'giai-phap-mang': ['switch', 'router'],
    'giai-phap-bao-mat': ['firewall', 'router'],
    'giai-phap-voip': ['collaboration-endpoints', 'switch', 'router'],
    'giai-phap-hoi-nghi': ['collaboration-endpoints'],
    'giai-phap-server': ['server', 'storage'],
  }

  const slugs = categoryKeywords[solutionSlug] || ['switch', 'router', 'server']
  const placeholders = slugs.map((_, i) => `$${i + 1}`).join(', ')

  return query<SolutionProductItem>(
    `SELECT 
       p.id AS id,
       '' AS solution_id,
       p.id AS product_id,
       c.name AS role,
       NULL AS notes,
       0 AS sort_order,
       p.name AS product_name,
       p.slug AS product_slug,
       p.model AS product_model,
       p.thumbnail AS product_thumbnail,
       p.short_description AS product_short_desc,
       b.name AS brand_name
     FROM products p
     JOIN categories c ON c.id = p.category_id
     LEFT JOIN brands b ON b.id = p.brand_id
     WHERE p.is_active = true AND c.slug IN (${placeholders})
     ORDER BY p.is_featured DESC, p.created_at DESC
     LIMIT $${slugs.length + 1}`,
    [...slugs, limit]
  )
}

export interface CreateSolutionInput {
  name: string
  slug: string
  domain_id?: string | null
  short_description?: string | null
  description?: string | null
  thumbnail?: string | null
  banner?: string | null
  sort_order?: number
  is_featured?: boolean
  is_active?: boolean
  seo_title?: string | null
  seo_description?: string | null
}

export async function createSolution(data: CreateSolutionInput): Promise<{ id: string }> {
  const id = `sol-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`

  await query(
    `INSERT INTO solutions (
      id, domain_id, name, slug, short_description, description,
      thumbnail, banner, sort_order, is_featured, is_active,
      seo_title, seo_description
    ) VALUES (
      $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13
    )`,
    [
      id,
      data.domain_id ?? null,
      data.name,
      data.slug,
      data.short_description ?? null,
      data.description ?? null,
      data.thumbnail ?? null,
      data.banner ?? null,
      data.sort_order ?? 0,
      data.is_featured ?? false,
      data.is_active ?? true,
      data.seo_title ?? null,
      data.seo_description ?? null,
    ]
  )

  return { id }
}

export type UpdateSolutionInput = Partial<CreateSolutionInput>

export async function updateSolution(id: string, data: UpdateSolutionInput): Promise<void> {
  const fields: string[] = []
  const values: any[] = []
  let idx = 1

  const allowed: (keyof UpdateSolutionInput)[] = [
    'name', 'slug', 'domain_id', 'short_description', 'description',
    'thumbnail', 'banner', 'sort_order', 'is_featured', 'is_active',
    'seo_title', 'seo_description'
  ]

  for (const key of allowed) {
    if (key in data) {
      fields.push(`${key} = $${idx++}`)
      values.push((data as any)[key])
    }
  }

  if (!fields.length) return

  fields.push(`updated_at = NOW()`)
  values.push(id)

  await query(
    `UPDATE solutions SET ${fields.join(', ')} WHERE id = $${idx}`,
    values
  )
}

export async function deleteSolution(id: string): Promise<void> {
  // Delete references in solution_products first if table exists
  try {
    await query('DELETE FROM solution_products WHERE solution_id = $1', [id])
  } catch {
    // Ignore if table does not exist or empty
  }
  await query('DELETE FROM solutions WHERE id = $1', [id])
}

export async function toggleSolutionField(
  id: string,
  field: 'is_active' | 'is_featured'
): Promise<boolean> {
  const current = await queryOne<{ val: boolean }>(
    `SELECT ${field} AS val FROM solutions WHERE id = $1`,
    [id]
  )
  const next = !current?.val
  await query(`UPDATE solutions SET ${field} = $1, updated_at = NOW() WHERE id = $2`, [next, id])
  return next
}
