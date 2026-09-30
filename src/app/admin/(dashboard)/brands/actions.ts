'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { createBrand, updateBrand } from '@/lib/dal'

const brandSchema = z.object({
  name: z.string().min(2, 'Tên hãng tối thiểu 2 ký tự'),
  slug: z.string().min(2, 'Slug tối thiểu 2 ký tự').regex(/^[a-z0-9-]+$/, 'Slug chỉ bao gồm chữ thường, số, dấu gạch ngang'),
  logo: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
  website: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  sort_order: z.coerce.number().default(0),
  is_active: z.boolean().default(true),
})

export type BrandActionResult = {
  success: boolean
  errors?: Record<string, string[]>
  message?: string
}

export async function createBrandAction(
  _prev: BrandActionResult | null,
  formData: FormData
): Promise<BrandActionResult> {
  const raw = {
    name: formData.get('name') as string,
    slug: formData.get('slug') as string,
    logo: (formData.get('logo') as string) || null,
    country: (formData.get('country') as string) || null,
    website: (formData.get('website') as string) || null,
    description: (formData.get('description') as string) || null,
    sort_order: formData.get('sort_order') as string,
    is_active: formData.get('is_active') === 'true',
  }

  const parsed = brandSchema.safeParse(raw)
  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors as any }
  }

  try {
    await createBrand(parsed.data)
    revalidatePath('/admin/brands')
    return { success: true, message: 'Đã tạo hãng sản xuất thành công' }
  } catch (err: any) {
    return {
      success: false,
      errors: { _root: [err?.message || 'Có lỗi xảy ra khi tạo hãng'] },
    }
  }
}

export async function updateBrandAction(
  id: string,
  _prev: BrandActionResult | null,
  formData: FormData
): Promise<BrandActionResult> {
  const raw = {
    name: formData.get('name') as string,
    slug: formData.get('slug') as string,
    logo: (formData.get('logo') as string) || null,
    country: (formData.get('country') as string) || null,
    website: (formData.get('website') as string) || null,
    description: (formData.get('description') as string) || null,
    sort_order: formData.get('sort_order') as string,
    is_active: formData.get('is_active') === 'true',
  }

  const parsed = brandSchema.safeParse(raw)
  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors as any }
  }

  try {
    await updateBrand(id, parsed.data)
    revalidatePath('/admin/brands')
    return { success: true, message: 'Đã cập nhật hãng sản xuất' }
  } catch (err: any) {
    return {
      success: false,
      errors: { _root: [err?.message || 'Có lỗi xảy ra khi cập nhật'] },
    }
  }
}
