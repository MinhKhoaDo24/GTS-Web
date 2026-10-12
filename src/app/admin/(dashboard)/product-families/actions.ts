'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { createProductFamily, updateProductFamily, deleteProductFamily } from '@/lib/dal'

const familySchema = z.object({
  name: z.string().min(2, 'Tên dòng sản phẩm tối thiểu 2 ký tự'),
  slug: z.string().min(2, 'Slug tối thiểu 2 ký tự').regex(/^[a-z0-9-]+$/, 'Slug chỉ bao gồm chữ thường, số, dấu gạch ngang'),
  brand_id: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  sort_order: z.coerce.number().default(0),
  is_active: z.boolean().default(true),
})

export type FamilyActionResult = {
  success: boolean
  errors?: Record<string, string[]>
  message?: string
}

export async function createFamilyAction(
  _prev: FamilyActionResult | null,
  formData: FormData
): Promise<FamilyActionResult> {
  const raw = {
    name: formData.get('name') as string,
    slug: formData.get('slug') as string,
    brand_id: (formData.get('brand_id') as string) || null,
    description: (formData.get('description') as string) || null,
    image: (formData.get('image') as string) || null,
    sort_order: formData.get('sort_order') as string,
    is_active: formData.get('is_active') === 'true',
  }

  const parsed = familySchema.safeParse(raw)
  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors as any }
  }

  try {
    await createProductFamily(parsed.data)
    revalidatePath('/admin/product-families')
    revalidatePath('/admin/products')
    return { success: true, message: 'Đã tạo dòng sản phẩm thành công' }
  } catch (err: any) {
    return {
      success: false,
      errors: { _root: [err?.message || 'Có lỗi xảy ra khi tạo dòng sản phẩm'] },
    }
  }
}

export async function updateFamilyAction(
  id: string,
  _prev: FamilyActionResult | null,
  formData: FormData
): Promise<FamilyActionResult> {
  const raw = {
    name: formData.get('name') as string,
    slug: formData.get('slug') as string,
    brand_id: (formData.get('brand_id') as string) || null,
    description: (formData.get('description') as string) || null,
    image: (formData.get('image') as string) || null,
    sort_order: formData.get('sort_order') as string,
    is_active: formData.get('is_active') === 'true',
  }

  const parsed = familySchema.safeParse(raw)
  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors as any }
  }

  try {
    await updateProductFamily(id, parsed.data)
    revalidatePath('/admin/product-families')
    revalidatePath('/admin/products')
    return { success: true, message: 'Đã cập nhật dòng sản phẩm' }
  } catch (err: any) {
    return {
      success: false,
      errors: { _root: [err?.message || 'Có lỗi xảy ra khi cập nhật dòng sản phẩm'] },
    }
  }
}

export async function deleteFamilyAction(id: string): Promise<FamilyActionResult> {
  try {
    await deleteProductFamily(id)
    revalidatePath('/admin/product-families')
    revalidatePath('/admin/products')
    return { success: true, message: 'Đã xóa dòng sản phẩm thành công' }
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || 'Không thể xóa dòng sản phẩm',
    }
  }
}
