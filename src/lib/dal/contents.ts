/**
 * DAL — Contents (Tin tức / Bài viết / Banner)
 */
import { query, queryOne } from '@/lib/db'

export type ContentType = 'news' | 'blog' | 'banner' | 'promotion' | 'case_study'

export interface ContentListItem {
  id: string
  type: ContentType
  category: string | null
  title: string
  slug: string
  summary: string | null
  thumbnail: string | null
  author: string | null
  published_at: Date | null
  sort_order: number
  is_featured: boolean
  is_active: boolean
  created_at: Date
  updated_at: Date
}

export interface ContentDetail extends ContentListItem {
  content: string | null
  banner: string | null
  link_url: string | null
  button_text: string | null
  seo_title: string | null
  seo_description: string | null
  start_at: Date | null
  end_at: Date | null
}

export interface ContentListParams {
  page?: number
  limit?: number
  type?: ContentType | ''
  search?: string
  isActive?: boolean
}

export async function getContents(params: ContentListParams = {}) {
  const { page = 1, limit = 20, type, search, isActive } = params
  const conditions: string[] = []
  const values: any[] = []
  let idx = 1

  if (type) {
    conditions.push(`type = $${idx++}`)
    values.push(type)
  }
  if (search) {
    conditions.push(`(title ILIKE $${idx} OR summary ILIKE $${idx})`)
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
    queryOne<{ total: number }>(`SELECT COUNT(*)::int AS total FROM contents ${where}`, values),
    query<ContentListItem>(
      `SELECT id, type, category, title, slug, summary, thumbnail,
              author, published_at, sort_order, is_featured, is_active,
              created_at, updated_at
       FROM contents ${where}
       ORDER BY created_at DESC
       LIMIT $${idx} OFFSET $${idx + 1}`,
      [...values, limit, offset]
    ),
  ])

  const total = countResult?.total ?? 0
  return { items, total, page, limit, totalPages: Math.ceil(total / limit) }
}

export async function getContentById(id: string): Promise<ContentDetail | null> {
  return queryOne<ContentDetail>('SELECT * FROM contents WHERE id = $1', [id])
}

export async function createContent(data: Partial<ContentDetail> & {
  type: ContentType
  title: string
  slug: string
}) {
  const id = `cnt-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
  await query(
    `INSERT INTO contents (
      id, type, category, title, slug, summary, content, thumbnail, banner,
      mobile_image, link_url, button_text, author, published_at,
      start_at, end_at, sort_order, is_featured, is_active,
      seo_title, seo_description
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21)`,
    [
      id, data.type, data.category ?? null, data.title, data.slug,
      data.summary ?? null, data.content ?? null, data.thumbnail ?? null,
      data.banner ?? null, null,
      data.link_url ?? null, data.button_text ?? null,
      data.author ?? null, data.published_at ?? null,
      data.start_at ?? null, data.end_at ?? null,
      data.sort_order ?? 0, data.is_featured ?? false,
      data.is_active ?? true,
      data.seo_title ?? null, data.seo_description ?? null,
    ]
  )
  return { id }
}

export async function updateContent(id: string, data: Partial<ContentDetail>) {
  const allowed = [
    'type','category','title','slug','summary','content','thumbnail','banner',
    'link_url','button_text','author','published_at','start_at','end_at',
    'sort_order','is_featured','is_active','seo_title','seo_description',
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
  fields.push(`updated_at = NOW()`)
  values.push(id)
  await query(`UPDATE contents SET ${fields.join(', ')} WHERE id = $${idx}`, values)
}

export async function deleteContent(id: string) {
  await query('DELETE FROM contents WHERE id = $1', [id])
}
