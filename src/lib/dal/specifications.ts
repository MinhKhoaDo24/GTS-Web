/**
 * DAL — Specifications (Dynamic Product Specs)
 *
 * Xử lý toàn bộ logic liên quan đến:
 *  - specification_groups  (nhóm thông số: Kết nối, Hiệu năng, ...)
 *  - specifications        (định nghĩa từng thông số: Số cổng, Dung lượng, ...)
 *  - specification_options (các lựa chọn cho data_type = 'select')
 *  - product_specifications (giá trị thực tế của từng sản phẩm)
 *
 * Đây là lõi của bài toán Dynamic Form:
 *  - Admin chọn Category → gọi getSpecsByCategoryId() → sinh form động
 *  - Admin nhấn Lưu → gọi upsertProductSpecifications() → lưu vào DB
 */

import { query, queryOne } from '@/lib/db'

// ─── Types ───────────────────────────────────────────────────────────────────

export type SpecDataType = 'number' | 'text' | 'boolean' | 'select' | 'json' | 'range'

export interface SpecificationGroup {
  id: string
  name: string
  slug: string
  description: string | null
  sort_order: number
  is_active: boolean
}

export interface Specification {
  id: string
  group_id: string
  group_name: string
  group_slug: string
  name: string
  slug: string
  data_type: SpecDataType
  unit: string | null
  description: string | null
  is_filterable: boolean
  is_searchable: boolean
  sort_order: number
  is_active: boolean
  /** Các lựa chọn nếu data_type = 'select' */
  options?: SpecificationOption[]
}

export interface SpecificationOption {
  id: string
  specification_id: string
  value: string
  label: string
  sort_order: number
  is_active: boolean
}

/** Giá trị thực tế của một specification trên một sản phẩm */
export interface ProductSpecValue {
  id: string
  product_id: string
  specification_id: string
  spec_name: string
  spec_slug: string
  data_type: SpecDataType
  unit: string | null
  unit_override: string | null
  group_name: string
  group_slug: string
  value_number: number | null
  value_text: string | null
  value_boolean: boolean | null
  value_json: Record<string, unknown> | null
  min_value: number | null
  max_value: number | null
  notes: string | null
}

/** Dùng khi upsert từ form */
export interface SpecInputValue {
  specification_id: string
  value_number?: number | null
  value_text?: string | null
  value_boolean?: boolean | null
  value_json?: Record<string, unknown> | null
  min_value?: number | null
  max_value?: number | null
  unit_override?: string | null
  notes?: string | null
}

// ─── Specification Groups ─────────────────────────────────────────────────────

export async function getSpecificationGroups(): Promise<SpecificationGroup[]> {
  return query<SpecificationGroup>(
    `SELECT * FROM specification_groups
     WHERE is_active = true
     ORDER BY sort_order ASC, name ASC`
  )
}

// ─── Specifications ───────────────────────────────────────────────────────────

/**
 * Lấy TẤT CẢ thông số kỹ thuật (có join group), kèm options nếu data_type = 'select'
 * Dùng cho trang quản lý Specifications của Admin.
 */
export async function getAllSpecifications(): Promise<Specification[]> {
  const specs = await query<Omit<Specification, 'options'>>(
    `SELECT
       s.id, s.group_id, s.name, s.slug,
       s.data_type, s.unit, s.description,
       s.is_filterable, s.is_searchable,
       s.sort_order, s.is_active,
       sg.name AS group_name, sg.slug AS group_slug
     FROM specifications s
     LEFT JOIN specification_groups sg ON s.group_id = sg.id
     WHERE s.is_active = true
     ORDER BY sg.sort_order ASC, s.sort_order ASC`
  )

  // Lấy options cho tất cả select-type specs
  const selectIds = specs.filter((s) => s.data_type === 'select').map((s) => s.id)
  const optionsMap: Record<string, SpecificationOption[]> = {}

  if (selectIds.length > 0) {
    const placeholders = selectIds.map((_, i) => `$${i + 1}`).join(', ')
    const opts = await query<SpecificationOption>(
      `SELECT * FROM specification_options
       WHERE specification_id IN (${placeholders}) AND is_active = true
       ORDER BY sort_order ASC`,
      selectIds
    )
    for (const o of opts) {
      if (!optionsMap[o.specification_id]) optionsMap[o.specification_id] = []
      optionsMap[o.specification_id].push(o)
    }
  }

  return specs.map((s) => ({ ...s, options: optionsMap[s.id] ?? [] }))
}

/**
 * ★ CORE API cho Dynamic Form ★
 *
 * Lấy danh sách thông số kỹ thuật liên quan đến một Category.
 * Admin chọn category_id → gọi API này → frontend render dynamic fields.
 *
 * Strategy (2 tầng):
 *  Tầng 1 (nâng cao): Nếu bảng category_specifications tồn tại → lọc chính xác theo category
 *  Tầng 2 (fallback): Nếu chưa có bảng → trả về tất cả specs active
 *
 * Khi Admin tạo bảng category_specifications trong DB, hệ thống tự động chuyển
 * sang tầng 1 mà không cần sửa code ở bất kỳ nơi nào khác.
 */
export async function getSpecsByCategoryId(categoryId: string): Promise<Specification[]> {
  // Kiểm tra xem bảng category_specifications đã tồn tại chưa
  const tableExists = await queryOne<{ exists: boolean }>(
    `SELECT EXISTS (
       SELECT FROM information_schema.tables
       WHERE table_schema = 'public'
         AND table_name = 'category_specifications'
     ) AS exists`
  )

  let specIds: string[] | null = null

  if (tableExists?.exists && categoryId) {
    // Tầng 1: lọc theo category mapping
    const rows = await query<{ specification_id: string }>(
      `SELECT specification_id FROM category_specifications
       WHERE category_id = $1 AND is_active = true`,
      [categoryId]
    )
    if (rows.length > 0) {
      specIds = rows.map((r) => r.specification_id)
    }
  }

  // Build WHERE clause
  let whereClause = 's.is_active = true'
  const queryParams: any[] = []

  if (specIds && specIds.length > 0) {
    const placeholders = specIds.map((_, i) => `$${i + 1}`).join(', ')
    whereClause = `s.is_active = true AND s.id IN (${placeholders})`
    queryParams.push(...specIds)
  }

  const specs = await query<Omit<Specification, 'options'>>(
    `SELECT
       s.id, s.group_id, s.name, s.slug,
       s.data_type, s.unit, s.description,
       s.is_filterable, s.is_searchable,
       s.sort_order, s.is_active,
       sg.name AS group_name, sg.slug AS group_slug
     FROM specifications s
     LEFT JOIN specification_groups sg ON s.group_id = sg.id
     WHERE ${whereClause}
     ORDER BY sg.sort_order ASC, s.sort_order ASC`,
    queryParams
  )

  if (specs.length === 0) return []

  // Lấy options cho select-type
  const selectIds = specs.filter((s) => s.data_type === 'select').map((s) => s.id)
  const optionsMap: Record<string, SpecificationOption[]> = {}

  if (selectIds.length > 0) {
    const placeholders = selectIds.map((_, i) => `$${i + 1}`).join(', ')
    const opts = await query<SpecificationOption>(
      `SELECT * FROM specification_options
       WHERE specification_id IN (${placeholders}) AND is_active = true
       ORDER BY sort_order ASC`,
      selectIds
    )
    for (const o of opts) {
      if (!optionsMap[o.specification_id]) optionsMap[o.specification_id] = []
      optionsMap[o.specification_id].push(o)
    }
  }

  return specs.map((s) => ({ ...s, options: optionsMap[s.id] ?? [] }))
}

// ─── Product Specifications ───────────────────────────────────────────────────

/**
 * Lấy tất cả giá trị thông số của một sản phẩm (join đầy đủ metadata)
 */
export async function getProductSpecifications(productId: string): Promise<ProductSpecValue[]> {
  return query<ProductSpecValue>(
    `SELECT
       ps.id, ps.product_id, ps.specification_id,
       ps.value_number, ps.value_text, ps.value_boolean, ps.value_json,
       ps.min_value, ps.max_value, ps.unit_override, ps.notes,
       s.name AS spec_name, s.slug AS spec_slug,
       s.data_type, s.unit,
       sg.name AS group_name, sg.slug AS group_slug
     FROM product_specifications ps
     JOIN specifications s ON ps.specification_id = s.id
     LEFT JOIN specification_groups sg ON s.group_id = sg.id
     WHERE ps.product_id = $1
     ORDER BY sg.sort_order ASC, s.sort_order ASC`,
    [productId]
  )
}

/**
 * ★ CORE WRITE cho Dynamic Form ★
 *
 * Upsert (tạo mới hoặc cập nhật) danh sách thông số của một sản phẩm.
 * - Nếu value hoàn toàn rỗng (null/undefined/''): xóa bản ghi (không lưu rác)
 * - Nếu đã có: UPDATE
 * - Nếu chưa có: INSERT
 */
export async function upsertProductSpecifications(
  productId: string,
  specs: SpecInputValue[]
): Promise<void> {
  for (const spec of specs) {
    const { specification_id, ...values } = spec

    // Xác định xem có value thực sự không
    const hasValue =
      (values.value_number !== null && values.value_number !== undefined) ||
      (values.value_text !== null && values.value_text !== undefined && values.value_text !== '') ||
      (values.value_boolean !== null && values.value_boolean !== undefined) ||
      (values.value_json !== null && values.value_json !== undefined)

    // Kiểm tra bản ghi đã tồn tại
    const existing = await queryOne<{ id: string }>(
      `SELECT id FROM product_specifications
       WHERE product_id = $1 AND specification_id = $2`,
      [productId, specification_id]
    )

    if (!hasValue) {
      // Xóa nếu rỗng (cleanup)
      if (existing) {
        await query(
          `DELETE FROM product_specifications WHERE id = $1`,
          [existing.id]
        )
      }
      continue
    }

    if (existing) {
      // UPDATE
      await query(
        `UPDATE product_specifications SET
           value_number = $1, value_text = $2, value_boolean = $3,
           value_json = $4, min_value = $5, max_value = $6,
           unit_override = $7, notes = $8
         WHERE id = $9`,
        [
          values.value_number ?? null,
          values.value_text ?? null,
          values.value_boolean ?? null,
          values.value_json ? JSON.stringify(values.value_json) : null,
          values.min_value ?? null,
          values.max_value ?? null,
          values.unit_override ?? null,
          values.notes ?? null,
          existing.id,
        ]
      )
    } else {
      // INSERT
      const id = `pspec-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
      await query(
        `INSERT INTO product_specifications (
           id, product_id, specification_id,
           value_number, value_text, value_boolean, value_json,
           min_value, max_value, unit_override, notes
         ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
        [
          id, productId, specification_id,
          values.value_number ?? null,
          values.value_text ?? null,
          values.value_boolean ?? null,
          values.value_json ? JSON.stringify(values.value_json) : null,
          values.min_value ?? null,
          values.max_value ?? null,
          values.unit_override ?? null,
          values.notes ?? null,
        ]
      )
    }
  }
}

/**
 * Xóa toàn bộ thông số của một sản phẩm (dùng khi reset)
 */
export async function deleteAllProductSpecifications(productId: string): Promise<void> {
  await query('DELETE FROM product_specifications WHERE product_id = $1', [productId])
}

// ─── Specification CRUD (Admin quản lý danh mục specs) ───────────────────────

export async function createSpecification(data: {
  group_id: string
  name: string
  slug: string
  data_type: SpecDataType
  unit?: string | null
  description?: string | null
  is_filterable?: boolean
  is_searchable?: boolean
  sort_order?: number
}): Promise<{ id: string }> {
  const id = `spec-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
  await query(
    `INSERT INTO specifications (id, group_id, name, slug, data_type, unit, description, is_filterable, is_searchable, sort_order, is_active)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,true)`,
    [
      id, data.group_id, data.name, data.slug, data.data_type,
      data.unit ?? null, data.description ?? null,
      data.is_filterable ?? false, data.is_searchable ?? false,
      data.sort_order ?? 0,
    ]
  )
  return { id }
}

export async function createSpecificationGroup(data: {
  name: string
  slug: string
  description?: string | null
  sort_order?: number
}): Promise<{ id: string }> {
  const id = `sg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
  await query(
    `INSERT INTO specification_groups (id, name, slug, description, sort_order, is_active)
     VALUES ($1,$2,$3,$4,$5,true)`,
    [id, data.name, data.slug, data.description ?? null, data.sort_order ?? 0]
  )
  return { id }
}

export async function createSpecificationOption(data: {
  specification_id: string
  value: string
  label: string
  sort_order?: number
}): Promise<{ id: string }> {
  const id = `sopt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
  await query(
    `INSERT INTO specification_options (id, specification_id, value, label, sort_order, is_active)
     VALUES ($1,$2,$3,$4,$5,true)`,
    [id, data.specification_id, data.value, data.label, data.sort_order ?? 0]
  )
  return { id }
}

// ─── Update & Delete ─────────────────────────────────────────────────────────

export async function updateSpecificationGroup(
  id: string,
  data: { name?: string; slug?: string; description?: string | null; sort_order?: number }
): Promise<void> {
  const fields: string[] = []
  const values: any[] = []
  let idx = 1
  for (const [k, v] of Object.entries(data)) {
    fields.push(`${k} = $${idx++}`)
    values.push(v)
  }
  if (!fields.length) return
  values.push(id)
  await query(`UPDATE specification_groups SET ${fields.join(', ')} WHERE id = $${idx}`, values)
}

export async function deleteSpecificationGroup(id: string): Promise<void> {
  await query('DELETE FROM specification_groups WHERE id = $1', [id])
}

export async function updateSpecification(
  id: string,
  data: {
    group_id?: string
    name?: string
    slug?: string
    data_type?: SpecDataType
    unit?: string | null
    description?: string | null
    is_filterable?: boolean
    is_searchable?: boolean
    sort_order?: number
    is_active?: boolean
  }
): Promise<void> {
  const allowed = [
    'group_id', 'name', 'slug', 'data_type', 'unit',
    'description', 'is_filterable', 'is_searchable', 'sort_order', 'is_active',
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
  await query(`UPDATE specifications SET ${fields.join(', ')} WHERE id = $${idx}`, values)
}

export async function deleteSpecification(id: string): Promise<void> {
  await query('DELETE FROM specifications WHERE id = $1', [id])
}

export async function deleteSpecificationOption(id: string): Promise<void> {
  await query('DELETE FROM specification_options WHERE id = $1', [id])
}

export async function toggleSpecificationActive(id: string, is_active: boolean): Promise<void> {
  await query('UPDATE specifications SET is_active = $1 WHERE id = $2', [is_active, id])
}

// ─── category_specifications (mapping bảng tùy chọn) ─────────────────────────
// Các hàm này chỉ hoạt động SAU KHI Admin tạo bảng category_specifications.
// Bảng này không bắt buộc — hệ thống tự fallback nếu chưa có.

export async function getCategorySpecMappings(categoryId: string): Promise<string[]> {
  const exists = await queryOne<{ exists: boolean }>(
    `SELECT EXISTS (
       SELECT FROM information_schema.tables
       WHERE table_schema = 'public' AND table_name = 'category_specifications'
     ) AS exists`
  )
  if (!exists?.exists) return []

  const rows = await query<{ specification_id: string }>(
    `SELECT specification_id FROM category_specifications
     WHERE category_id = $1 AND is_active = true`,
    [categoryId]
  )
  return rows.map((r) => r.specification_id)
}

export async function setCategorySpecMappings(
  categoryId: string,
  specificationIds: string[]
): Promise<void> {
  // Xóa mappings cũ
  await query('DELETE FROM category_specifications WHERE category_id = $1', [categoryId])

  // Insert mappings mới
  for (let i = 0; i < specificationIds.length; i++) {
    const id = `cs-${Date.now()}-${i}-${Math.random().toString(36).slice(2, 5)}`
    await query(
      `INSERT INTO category_specifications (id, category_id, specification_id, is_active, sort_order)
       VALUES ($1, $2, $3, true, $4)`,
      [id, categoryId, specificationIds[i], i]
    )
  }
}

