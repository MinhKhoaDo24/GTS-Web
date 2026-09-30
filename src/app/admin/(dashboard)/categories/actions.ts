'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { createCategory, updateCategory } from '@/lib/dal'

const schema = z.object({
  name: z.string().min(2, 'Tên tối thiểu 2 ký tự'),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/, 'Chỉ chữ thường, số, gạch ngang'),
  description: z.string().optional(),
  domain_id: z.string().optional(),
  parent_id: z.string().optional(),
  sort_order: z.coerce.number().default(0),
  is_active: z.boolean().default(true),
})

type ActionResult = { success: false; errors: Record<string, string[]> } | { success: true }

export async function createCategoryAction(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const raw = {
    name: formData.get('name') as string,
    slug: formData.get('slug') as string,
    description: formData.get('description') as string || undefined,
    domain_id: formData.get('domain_id') as string || undefined,
    parent_id: formData.get('parent_id') as string || undefined,
    sort_order: formData.get('sort_order') as string,
    is_active: formData.get('is_active') === 'true',
  }
  const parsed = schema.safeParse(raw)
  if (!parsed.success) return { success: false, errors: parsed.error.flatten().fieldErrors as any }

  try {
    await createCategory({
      name: parsed.data.name,
      slug: parsed.data.slug,
      description: parsed.data.description ?? null,
      domain_id: parsed.data.domain_id ?? null,
      parent_id: parsed.data.parent_id ?? null,
      sort_order: parsed.data.sort_order,
      is_active: parsed.data.is_active,
    })
    revalidatePath('/admin/categories')
  } catch (e: any) {
    return { success: false, errors: { _root: [e?.message ?? 'Lỗi tạo danh mục'] } }
  }
  redirect('/admin/categories')
}

export async function updateCategoryAction(id: string, _prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const raw = {
    name: formData.get('name') as string,
    slug: formData.get('slug') as string,
    description: formData.get('description') as string || undefined,
    domain_id: formData.get('domain_id') as string || undefined,
    parent_id: formData.get('parent_id') as string || undefined,
    sort_order: formData.get('sort_order') as string,
    is_active: formData.get('is_active') === 'true',
  }
  const parsed = schema.safeParse(raw)
  if (!parsed.success) return { success: false, errors: parsed.error.flatten().fieldErrors as any }

  try {
    await updateCategory(id, {
      name: parsed.data.name,
      slug: parsed.data.slug,
      description: parsed.data.description ?? null,
      domain_id: parsed.data.domain_id ?? null,
      parent_id: parsed.data.parent_id ?? null,
      sort_order: parsed.data.sort_order,
      is_active: parsed.data.is_active,
    })
    revalidatePath('/admin/categories')
  } catch (e: any) {
    return { success: false, errors: { _root: [e?.message ?? 'Lỗi cập nhật'] } }
  }
  redirect('/admin/categories')
}
