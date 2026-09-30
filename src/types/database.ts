// =============================================================================
// FILE: src/types/database.ts
// Cập nhật khớp hoàn toàn với 01_schema_tables.sql (VARCHAR(255) PK)
// =============================================================================

// ─── PRODUCT CATALOG ──────────────────────────────────────────────────────────

export interface Domain {
  id: string
  name: string
  slug: string
  description: string | null
  image: string | null
  icon: string | null
  sort_order: number
  is_active: boolean
}

export interface Brand {
  id: string
  name: string
  slug: string
  logo: string | null
  website: string | null
  description: string | null
  country: string | null
  is_active: boolean
  sort_order: number
  created_at: Date
  updated_at: Date
}

export interface ProductFamily {
  id: string
  brand_id: string
  domain_id: string
  name: string
  slug: string
  description: string | null
  image: string | null
  sort_order: number
  is_active: boolean
}

export interface Category {
  id: string
  domain_id: string
  parent_id: string | null
  name: string
  slug: string
  description: string | null
  sort_order: number
  is_active: boolean
  // Dùng khi join cây danh mục
  children?: Category[]
}

/** Phân loại sản phẩm - khớp với CHECK constraint trong schema */
export type ProductType = 'hardware' | 'software' | 'license' | 'service' | 'bundle'

/** Trạng thái kinh doanh */
export type ProductStatus = 'active' | 'discontinued' | 'coming_soon' | 'end_of_sale'

/** Trạng thái vòng đời (từ product_lifecycle) */
export type LifecycleStatus = 'active' | 'end_of_sale' | 'last_ship' | 'end_of_support' | 'discontinued'

export interface Product {
  id: string
  brand_id: string
  domain_id: string
  family_id: string | null
  category_id: string
  name: string
  slug: string
  model: string | null
  short_description: string | null
  description: string | null
  product_type: ProductType
  status: ProductStatus
  release_date: string | null   // DATE -> string (ISO)
  eol_date: string | null
  thumbnail: string | null
  is_featured: boolean
  is_active: boolean
  seo_title: string | null
  seo_description: string | null
  created_at: Date
  updated_at: Date
}

export interface ProductVariant {
  id: string
  product_id: string
  sku: string | null
  pid: string | null
  model_number: string | null
  part_number: string | null
  variant_name: string
  region: string | null
  color: string | null
  bundle: string | null
  specifications_summary: string | null
  status: 'active' | 'discontinued' | 'pre_order'
  notes: string | null
  is_active: boolean
  created_at: Date
  updated_at: Date
}

// ─── SPECIFICATIONS ───────────────────────────────────────────────────────────

export interface SpecificationGroup {
  id: string
  name: string
  slug: string
  description: string | null
  sort_order: number
  is_active: boolean
}

export type SpecDataType = 'number' | 'text' | 'boolean' | 'select' | 'json' | 'range'

export interface Specification {
  id: string
  group_id: string
  name: string
  slug: string
  data_type: SpecDataType
  unit: string | null
  description: string | null
  is_filterable: boolean
  is_searchable: boolean
  sort_order: number
  is_active: boolean
}

export interface SpecificationOption {
  id: string
  specification_id: string
  value: string
  label: string
  sort_order: number
  is_active: boolean
}

export interface ProductSpecification {
  id: string
  product_id: string
  specification_id: string
  value_number: number | null
  value_text: string | null
  value_boolean: boolean | null
  value_json: Record<string, unknown> | null
  min_value: number | null
  max_value: number | null
  unit_override: string | null
  notes: string | null
}

// ─── PRODUCT WITH RELATIONS (dùng trong UI) ───────────────────────────────────

/** Product đầy đủ quan hệ - dùng trong Product Card & Product Detail */
export interface ProductWithRelations extends Product {
  brand?: Brand
  category?: Category
  domain?: Domain
  family?: ProductFamily | null
  variants?: ProductVariant[]
  lifecycle_status?: LifecycleStatus
  /** Thông số kỹ thuật join sẵn (dùng cho card summary) */
  specs?: Array<{
    spec_name: string
    spec_slug: string
    value_text: string | null
    value_number: number | null
    unit: string | null
    unit_override: string | null
    group_name: string
  }>
  /** Ảnh chính (is_primary = true) */
  primary_image?: string | null
}

/** Dùng trong Mega Menu: sản phẩm nổi bật thumbnail */
export interface ProductSummary {
  id: string
  name: string
  slug: string
  model: string | null
  thumbnail: string | null
  brand_name: string
  brand_slug: string
  category_name: string
}

// ─── CMS / WEBSITE ────────────────────────────────────────────────────────────

export interface SiteSetting {
  id: string
  key: string
  value: string | null
  type: 'text' | 'textarea' | 'image' | 'boolean' | 'json' | 'number'
  description: string | null
  is_active: boolean
  updated_at: Date
}

/** Dùng trong Header/Footer - parsed từ site_settings rows */
export interface SiteConfig {
  hotline?: string
  contact_email?: string
  address?: string
  company_name?: string
  logo?: string
  facebook_url?: string
  youtube_url?: string
}

export interface AdminUser {
  id: string
  name: string
  email: string
  password_hash: string
  role: 'super_admin' | 'admin' | 'editor' | 'viewer'
  is_active: boolean
  last_login_at: Date | null
  created_at: Date
  updated_at: Date
}

export interface Solution {
  id: string
  domain_id: string | null
  name: string
  slug: string
  short_description: string | null
  description: string | null
  thumbnail: string | null
  banner: string | null
  sort_order: number
  is_featured: boolean
  is_active: boolean
  seo_title: string | null
  seo_description: string | null
  created_at: Date
  updated_at: Date
}

export interface Service {
  id: string
  name: string
  slug: string
  short_description: string | null
  description: string | null
  thumbnail: string | null
  banner: string | null
  icon: string | null
  sort_order: number
  is_featured: boolean
  is_active: boolean
  seo_title: string | null
  seo_description: string | null
  created_at: Date
  updated_at: Date
}

export interface Customer {
  id: string
  name: string
  slug: string
  logo: string | null
  website: string | null
  industry: string | null
  description: string | null
  address: string | null
  is_featured: boolean
  is_active: boolean
  created_at: Date
  updated_at: Date
}

export interface Partner {
  id: string
  brand_id: string | null
  name: string
  slug: string
  logo: string | null
  website: string | null
  description: string | null
  partner_type: string | null
  is_featured: boolean
  is_active: boolean
  created_at: Date
  updated_at: Date
}

export interface PageContent {
  id: string
  parent_id: string | null
  title: string
  slug: string
  page_type: string | null
  content: string | null
  thumbnail: string | null
  banner: string | null
  seo_title: string | null
  seo_description: string | null
  sort_order: number
  is_active: boolean
  created_at: Date
  updated_at: Date
}

export interface ContactRequest {
  id: string
  request_type: 'contact' | 'quote' | 'project_consultation'
  name: string
  company: string | null
  email: string
  phone: string | null
  product_id: string | null
  solution_id: string | null
  project_type: string | null
  budget_range: string | null
  location: string | null
  message: string | null
  status: 'new' | 'processing' | 'resolved' | 'rejected'
  assigned_to: string | null
  internal_notes: string | null
  first_response_at: Date | null
  resolved_at: Date | null
  created_at: Date
  updated_at: Date
}

// ─── FILTER / QUERY TYPES (dùng trong ProductFilters & API) ──────────────────

export interface ProductFilterParams {
  /** slug của brand */
  brand?: string
  /** slug của category */
  category?: string
  /** slug của domain */
  domain?: string
  /** product_type */
  type?: ProductType
  /** Tìm kiếm tự do */
  q?: string
  /** Trang hiện tại */
  page?: number
  /** Số item mỗi trang */
  limit?: number
  /** Sắp xếp: name_asc | name_desc | newest | featured */
  sort?: 'name_asc' | 'name_desc' | 'newest' | 'featured'
  /** Lọc spec dạng: spec_id:value (text) hoặc spec_id:min-max (number) */
  specs?: string[]
  /** Lọc lifecycle status */
  lifecycle?: LifecycleStatus
}

/** Kết quả phân trang cho danh sách sản phẩm */
export interface PaginatedProducts {
  items: ProductWithRelations[]
  total: number
  page: number
  limit: number
  totalPages: number
}

/** Group thông số dùng trong filter sidebar */
export interface SpecFilterGroup {
  group_id: string
  group_name: string
  specs: Array<{
    id: string
    name: string
    slug: string
    data_type: SpecDataType
    unit: string | null
    options?: SpecificationOption[]   // cho data_type = 'select'
    min?: number                       // cho data_type = 'number' | 'range'
    max?: number
  }>
}
