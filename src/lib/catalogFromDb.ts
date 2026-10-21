// =============================================================================
// FILE: src/lib/catalogFromDb.ts
// Xây dựng cây phân loại sản phẩm 3 cấp (Category → Brand → Family/Series)
// hoàn toàn từ dữ liệu DATABASE thực tế, thay vì dữ liệu hardcoded.
// =============================================================================

import { query } from '@/lib/db'
import type {
  CategoryCatalogItem,
  BrandCatalogItem,
  ProductSeriesItem,
} from '@/lib/catalogTaxonomy'

// Icon mặc định theo tên category slug (có thể mở rộng)
function guessIconFromSlug(slug: string): string {
  if (slug.includes('switch') || slug.includes('chuyen-mach')) return 'Layers'
  if (slug.includes('router') || slug.includes('dinh-tuyen')) return 'Network'
  if (slug.includes('firewall') || slug.includes('bao-mat') || slug.includes('tuong-lua')) return 'ShieldCheck'
  if (slug.includes('server') || slug.includes('may-chu') || slug.includes('storage')) return 'Server'
  if (slug.includes('wifi') || slug.includes('khong-day') || slug.includes('access-point')) return 'Wifi'
  if (slug.includes('phu-kien') || slug.includes('module') || slug.includes('sfp')) return 'Cpu'
  return 'Boxes'
}

function shortNameFromName(name: string): string {
  // Lấy phần trước dấu "/" hoặc lấy tên gọn
  const parts = name.split('/')
  return (parts[0] || name).trim()
}

interface DbCatalogRow {
  category_id: string
  category_name: string
  category_slug: string
  category_description: string | null
  brand_id: string
  brand_name: string
  brand_slug: string
  brand_logo: string | null
  family_id: string | null
  family_name: string | null
  family_slug: string | null
  family_description: string | null
  product_count: number
}

/**
 * Truy vấn database và xây dựng cây CATALOG_TAXONOMY động 3 cấp từ dữ liệu thực.
 * Chỉ bao gồm các category/brand/family có ít nhất 1 sản phẩm is_active = true.
 */
export async function buildCatalogFromDb(): Promise<CategoryCatalogItem[]> {
  try {
    const rows = await query<DbCatalogRow>(
      `SELECT
        c.id        AS category_id,
        c.name      AS category_name,
        c.slug      AS category_slug,
        c.description AS category_description,
        b.id        AS brand_id,
        b.name      AS brand_name,
        b.slug      AS brand_slug,
        b.logo      AS brand_logo,
        f.id        AS family_id,
        f.name      AS family_name,
        f.slug      AS family_slug,
        f.description AS family_description,
        COUNT(p.id)::int AS product_count
      FROM products p
      JOIN categories c ON p.category_id = c.id
      JOIN brands b     ON p.brand_id = b.id
      LEFT JOIN product_families f ON p.family_id = f.id
      WHERE p.is_active = true
      GROUP BY c.id, c.name, c.slug, c.description,
               b.id, b.name, b.slug, b.logo,
               f.id, f.name, f.slug, f.description
      ORDER BY c.name ASC, b.name ASC, f.name ASC`
    )

    if (!rows || rows.length === 0) {
      return []
    }

    // Xây dựng cây
    const catMap = new Map<string, CategoryCatalogItem>()

    for (const row of rows) {
      // === Cấp 1: Category ===
      if (!catMap.has(row.category_slug)) {
        catMap.set(row.category_slug, {
          id: row.category_id,
          name: row.category_name,
          slug: row.category_slug,
          shortName: shortNameFromName(row.category_name),
          icon: guessIconFromSlug(row.category_slug),
          description: row.category_description || '',
          brands: [],
        })
      }
      const cat = catMap.get(row.category_slug)!

      // === Cấp 2: Brand ===
      let brand = cat.brands.find((b) => b.slug === row.brand_slug)
      if (!brand) {
        brand = {
          id: row.brand_id,
          name: row.brand_name,
          slug: row.brand_slug,
          logo: row.brand_logo || undefined,
          seriesList: [],
        }
        cat.brands.push(brand)
      }

      // === Cấp 3: Family (Series) ===
      if (row.family_id && row.family_name && row.family_slug) {
        const existing = brand.seriesList.find((s) => s.slug === row.family_slug)
        if (!existing) {
          brand.seriesList.push({
            id: row.family_id,
            name: row.family_name,
            slug: row.family_slug,
            description: row.family_description || undefined,
          })
        }
      }
    }

    return Array.from(catMap.values())
  } catch {
    // Nếu DB lỗi → trả về mảng rỗng
    return []
  }
}
