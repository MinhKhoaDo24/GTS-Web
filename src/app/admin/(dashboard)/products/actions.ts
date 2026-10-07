'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { createProduct, updateProduct, deleteProduct, toggleProductField } from '@/lib/dal'

// ─── Validation Schema ───────────────────────────────────────────────────────

const productSchema = z.object({
  name: z.string().min(2, 'Tên sản phẩm tối thiểu 2 ký tự'),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/, 'Slug chỉ gồm chữ thường, số, gạch ngang'),
  model: z.string().optional(),
  brand_id: z.string().min(1, 'Chọn hãng sản xuất'),
  family_id: z.string().optional().nullable(),
  category_id: z.string().min(1, 'Chọn danh mục'),
  product_type: z.enum(['hardware', 'software', 'license', 'service', 'bundle']),
  short_description: z.string().optional(),
  description: z.string().optional(),
  thumbnail: z.string().optional(),
  is_active: z.boolean().default(true),
  is_featured: z.boolean().default(false),
  seo_title: z.string().optional(),
  seo_description: z.string().optional(),
  // variant fields (first variant)
  variant_sku: z.string().optional(),
  variant_part_number: z.string().optional(),
  variant_specs_summary: z.string().optional(),
})

type ActionResult = { success: false; errors: Record<string, string[]> } | { success: true }

// ─── Create Product ──────────────────────────────────────────────────────────

export async function createProductAction(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const raw = {
    name: formData.get('name') as string,
    slug: formData.get('slug') as string,
    model: formData.get('model') as string || undefined,
    brand_id: formData.get('brand_id') as string,
    family_id: (formData.get('family_id') as string) || undefined,
    category_id: formData.get('category_id') as string,
    product_type: formData.get('product_type') as string,
    short_description: formData.get('short_description') as string || undefined,
    description: formData.get('description') as string || undefined,
    thumbnail: formData.get('thumbnail') as string || undefined,
    is_active: formData.get('is_active') === 'true',
    is_featured: formData.get('is_featured') === 'true',
    seo_title: formData.get('seo_title') as string || undefined,
    seo_description: formData.get('seo_description') as string || undefined,
    variant_sku: formData.get('variant_sku') as string || undefined,
    variant_part_number: formData.get('variant_part_number') as string || undefined,
    variant_specs_summary: formData.get('variant_specs_summary') as string || undefined,
  }

  const parsed = productSchema.safeParse(raw)
  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors as Record<string, string[]> }
  }

  let newId: string | null = null

  try {
    const { id } = await createProduct({
      name: parsed.data.name,
      slug: parsed.data.slug,
      model: parsed.data.model ?? null,
      brand_id: parsed.data.brand_id,
      family_id: parsed.data.family_id ?? null,
      category_id: parsed.data.category_id,
      product_type: parsed.data.product_type as any,
      short_description: parsed.data.short_description ?? null,
      description: parsed.data.description ?? null,
      thumbnail: parsed.data.thumbnail ?? null,
      is_active: parsed.data.is_active,
      is_featured: parsed.data.is_featured,
      seo_title: parsed.data.seo_title ?? null,
      seo_description: parsed.data.seo_description ?? null,
    })
    newId = id

    // Create first variant if SKU provided
    if (parsed.data.variant_sku) {
      const { query } = await import('@/lib/db')
      const variantId = `var-${Date.now()}`
      await query(
        `INSERT INTO product_variants (id, product_id, sku, part_number, variant_name, specifications_summary, is_active)
         VALUES ($1, $2, $3, $4, $5, $6, true)`,
        [
          variantId, id,
          parsed.data.variant_sku,
          parsed.data.variant_part_number ?? null,
          parsed.data.name,
          parsed.data.variant_specs_summary ?? null,
        ]
      )
    }

    revalidatePath('/admin/products')
  } catch (e: any) {
    return {
      success: false,
      errors: { _root: [e?.message ?? 'Có lỗi xảy ra khi tạo sản phẩm'] },
    }
  }

  if (newId) {
    redirect(`/admin/products/${newId}?tab=specs`)
  } else {
    redirect('/admin/products')
  }
}

// ─── Update Product ──────────────────────────────────────────────────────────

export async function updateProductAction(
  id: string,
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const raw = {
    name: formData.get('name') as string,
    slug: formData.get('slug') as string,
    model: formData.get('model') as string || undefined,
    brand_id: formData.get('brand_id') as string,
    family_id: (formData.get('family_id') as string) || undefined,
    category_id: formData.get('category_id') as string,
    product_type: formData.get('product_type') as string,
    short_description: formData.get('short_description') as string || undefined,
    description: formData.get('description') as string || undefined,
    thumbnail: formData.get('thumbnail') as string || undefined,
    is_active: formData.get('is_active') === 'true',
    is_featured: formData.get('is_featured') === 'true',
    seo_title: formData.get('seo_title') as string || undefined,
    seo_description: formData.get('seo_description') as string || undefined,
  }

  const parsed = productSchema.safeParse(raw)
  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors as Record<string, string[]> }
  }

  try {
    await updateProduct(id, {
      name: parsed.data.name,
      slug: parsed.data.slug,
      model: parsed.data.model ?? null,
      brand_id: parsed.data.brand_id,
      family_id: parsed.data.family_id ?? null,
      category_id: parsed.data.category_id,
      product_type: parsed.data.product_type as any,
      short_description: parsed.data.short_description ?? null,
      description: parsed.data.description ?? null,
      thumbnail: parsed.data.thumbnail ?? null,
      is_active: parsed.data.is_active,
      is_featured: parsed.data.is_featured,
      seo_title: parsed.data.seo_title ?? null,
      seo_description: parsed.data.seo_description ?? null,
    })
    revalidatePath('/admin/products')
    revalidatePath(`/admin/products/${id}`)
    revalidatePath(`/san-pham/${parsed.data.slug}`)
  } catch (e: any) {
    return {
      success: false,
      errors: { _root: [e?.message ?? 'Có lỗi xảy ra khi cập nhật'] },
    }
  }

  redirect('/admin/products')
}
