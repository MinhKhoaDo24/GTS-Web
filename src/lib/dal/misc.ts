/**
 * DAL — Site Settings & Brands & Misc
 */
import { query, queryOne } from '@/lib/db'
import type { SiteSetting } from '@/types/database'

// ─── Site Settings ──────────────────────────────────────────────────────────

export async function getAllSettings(): Promise<SiteSetting[]> {
  return query<SiteSetting>(
    'SELECT * FROM site_settings WHERE is_active = true ORDER BY key ASC'
  )
}

export async function getSettingByKey(key: string): Promise<string | null> {
  const row = await queryOne<{ value: string }>('SELECT value FROM site_settings WHERE key = $1', [key])
  return row?.value ?? null
}

export async function upsertSetting(key: string, value: string): Promise<void> {
  await query(
    `INSERT INTO site_settings (id, key, value, updated_at)
     VALUES ($1, $2, $3, NOW())
     ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()`,
    [`setting-${key}`, key, value]
  )
}

// ─── Brands ─────────────────────────────────────────────────────────────────

export async function getBrands() {
  return query(
    `SELECT id, name, slug, logo, country, is_active, sort_order,
            (SELECT COUNT(*)::int FROM products p WHERE p.brand_id = brands.id) AS product_count
     FROM brands
     ORDER BY sort_order ASC, name ASC`
  )
}

export async function getBrandById(id: string) {
  return queryOne('SELECT * FROM brands WHERE id = $1', [id])
}

export async function createBrand(data: {
  name: string; slug: string; logo?: string | null
  website?: string | null; description?: string | null
  country?: string | null; sort_order?: number; is_active?: boolean
}) {
  const id = `brand-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
  await query(
    `INSERT INTO brands (id, name, slug, logo, website, description, country, sort_order, is_active)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
    [
      id, data.name, data.slug, data.logo ?? null, data.website ?? null,
      data.description ?? null, data.country ?? null,
      data.sort_order ?? 0, data.is_active ?? true,
    ]
  )
  return { id }
}

export async function updateBrand(id: string, data: Parameters<typeof createBrand>[0]) {
  const fields: string[] = []
  const values: any[] = []
  let idx = 1
  for (const [k, v] of Object.entries(data)) {
    fields.push(`${k} = $${idx++}`)
    values.push(v)
  }
  if (!fields.length) return
  fields.push(`updated_at = NOW()`)
  values.push(id)
  await query(`UPDATE brands SET ${fields.join(', ')} WHERE id = $${idx}`, values)
}

export async function deleteBrand(id: string) {
  await query('DELETE FROM brands WHERE id = $1', [id])
}

export async function countBrands(): Promise<number> {
  const r = await queryOne<{ count: number }>('SELECT COUNT(*)::int AS count FROM brands')
  return r?.count ?? 0
}

// ─── Domains ─────────────────────────────────────────────────────────────────

export async function getDomains() {
  return query('SELECT * FROM domains WHERE is_active = true ORDER BY sort_order ASC')
}

// ─── Contact Requests ────────────────────────────────────────────────────────

export async function getContactRequests(params: {
  page?: number; limit?: number
  status?: string; type?: string
} = {}) {
  const { page = 1, limit = 20, status, type } = params
  const conditions: string[] = []
  const values: any[] = []
  let idx = 1

  if (status) { conditions.push(`status = $${idx++}`); values.push(status) }
  if (type) { conditions.push(`request_type = $${idx++}`); values.push(type) }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''
  const offset = (page - 1) * limit

  const [countResult, items] = await Promise.all([
    queryOne<{ total: number }>(`SELECT COUNT(*)::int AS total FROM contact_requests ${where}`, values),
    query(
      `SELECT cr.*, p.name AS product_name
       FROM contact_requests cr
       LEFT JOIN products p ON cr.product_id = p.id
       ${where}
       ORDER BY cr.created_at DESC
       LIMIT $${idx} OFFSET $${idx + 1}`,
      [...values, limit, offset]
    ),
  ])

  const total = countResult?.total ?? 0
  return { items, total, page, limit, totalPages: Math.ceil(total / limit) }
}

export async function updateContactStatus(id: string, status: string) {
  await query(
    'UPDATE contact_requests SET status = $1, updated_at = NOW() WHERE id = $2',
    [status, id]
  )
}

export async function countNewContacts(): Promise<number> {
  const r = await queryOne<{ count: number }>(
    "SELECT COUNT(*)::int AS count FROM contact_requests WHERE status = 'new'"
  )
  return r?.count ?? 0
}
