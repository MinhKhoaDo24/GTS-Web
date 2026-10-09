'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import {
  createSolution,
  updateSolution,
  deleteSolution,
  toggleSolutionField,
} from '@/lib/dal/solutions'

const solutionSchema = z.object({
  name: z.string().min(2, 'Tên giải pháp tối thiểu 2 ký tự'),
  slug: z.string().min(2, 'Slug tối thiểu 2 ký tự').regex(/^[a-z0-9-]+$/, 'Slug chỉ gồm chữ thường, số và gạch ngang'),
  domain_id: z.string().optional().nullable(),
  short_description: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  thumbnail: z.string().optional().nullable(),
  banner: z.string().optional().nullable(),
  sort_order: z.coerce.number().default(0),
  is_featured: z.boolean().default(false),
  is_active: z.boolean().default(true),
  seo_title: z.string().optional().nullable(),
  seo_description: z.string().optional().nullable(),
})

type ActionResult = { success: false; errors: Record<string, string[]> } | { success: true }

export async function createSolutionAction(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const raw = {
    name: formData.get('name') as string,
    slug: formData.get('slug') as string,
    domain_id: (formData.get('domain_id') as string) || null,
    short_description: (formData.get('short_description') as string) || null,
    description: (formData.get('description') as string) || null,
    thumbnail: (formData.get('thumbnail') as string) || null,
    banner: (formData.get('banner') as string) || null,
    sort_order: formData.get('sort_order') as string,
    is_featured: formData.get('is_featured') === 'true',
    is_active: formData.get('is_active') === 'true',
    seo_title: (formData.get('seo_title') as string) || null,
    seo_description: (formData.get('seo_description') as string) || null,
  }

  const parsed = solutionSchema.safeParse(raw)
  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors as any }
  }

  try {
    await createSolution(parsed.data)
    revalidatePath('/admin/solutions')
    revalidatePath('/giai-phap')
    revalidatePath(`/giai-phap/${parsed.data.slug}`)
  } catch (err: any) {
    return {
      success: false,
      errors: { _root: [err?.message || 'Có lỗi xảy ra khi tạo giải pháp'] },
    }
  }

  redirect('/admin/solutions')
}

export async function updateSolutionAction(
  id: string,
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const raw = {
    name: formData.get('name') as string,
    slug: formData.get('slug') as string,
    domain_id: (formData.get('domain_id') as string) || null,
    short_description: (formData.get('short_description') as string) || null,
    description: (formData.get('description') as string) || null,
    thumbnail: (formData.get('thumbnail') as string) || null,
    banner: (formData.get('banner') as string) || null,
    sort_order: formData.get('sort_order') as string,
    is_featured: formData.get('is_featured') === 'true',
    is_active: formData.get('is_active') === 'true',
    seo_title: (formData.get('seo_title') as string) || null,
    seo_description: (formData.get('seo_description') as string) || null,
  }

  const parsed = solutionSchema.safeParse(raw)
  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors as any }
  }

  try {
    await updateSolution(id, parsed.data)
    revalidatePath('/admin/solutions')
    revalidatePath('/giai-phap')
    revalidatePath(`/giai-phap/${parsed.data.slug}`)
  } catch (err: any) {
    return {
      success: false,
      errors: { _root: [err?.message || 'Có lỗi xảy ra khi cập nhật giải pháp'] },
    }
  }

  redirect('/admin/solutions')
}

export async function deleteSolutionAction(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    await deleteSolution(id)
    revalidatePath('/admin/solutions')
    revalidatePath('/giai-phap')
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err?.message || 'Không thể xóa giải pháp' }
  }
}

export async function toggleSolutionAction(
  id: string,
  field: 'is_active' | 'is_featured'
): Promise<{ success: boolean; next?: boolean; error?: string }> {
  try {
    const next = await toggleSolutionField(id, field)
    revalidatePath('/admin/solutions')
    revalidatePath('/giai-phap')
    return { success: true, next }
  } catch (err: any) {
    return { success: false, error: err?.message || 'Không thể cập nhật trạng thái' }
  }
}
