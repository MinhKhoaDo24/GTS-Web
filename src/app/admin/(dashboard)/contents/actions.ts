'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { createContent, updateContent, type ContentType } from '@/lib/dal/contents'

const contentSchema = z.object({
  title: z.string().min(2, 'Tiêu đề tối thiểu 2 ký tự'),
  slug: z.string().min(2, 'Slug tối thiểu 2 ký tự').regex(/^[a-z0-9-]+$/, 'Slug chỉ gồm chữ thường, số và gạch ngang'),
  type: z.enum(['news', 'blog', 'banner', 'promotion', 'case_study']),
  category: z.string().optional().nullable(),
  summary: z.string().optional().nullable(),
  content: z.string().optional().nullable(),
  thumbnail: z.string().optional().nullable(),
  banner: z.string().optional().nullable(),
  link_url: z.string().optional().nullable(),
  button_text: z.string().optional().nullable(),
  author: z.string().optional().nullable(),
  published_at: z.string().optional().nullable(),
  sort_order: z.coerce.number().default(0),
  is_featured: z.boolean().default(false),
  is_active: z.boolean().default(true),
  seo_title: z.string().optional().nullable(),
  seo_description: z.string().optional().nullable(),
})

type ActionResult = { success: false; errors: Record<string, string[]> } | { success: true }

export async function createContentAction(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const raw = {
    title: formData.get('title') as string,
    slug: formData.get('slug') as string,
    type: formData.get('type') as ContentType,
    category: (formData.get('category') as string) || null,
    summary: (formData.get('summary') as string) || null,
    content: (formData.get('content') as string) || null,
    thumbnail: (formData.get('thumbnail') as string) || null,
    banner: (formData.get('banner') as string) || null,
    link_url: (formData.get('link_url') as string) || null,
    button_text: (formData.get('button_text') as string) || null,
    author: (formData.get('author') as string) || null,
    published_at: (formData.get('published_at') as string) || null,
    sort_order: formData.get('sort_order') as string,
    is_featured: formData.get('is_featured') === 'true',
    is_active: formData.get('is_active') === 'true',
    seo_title: (formData.get('seo_title') as string) || null,
    seo_description: (formData.get('seo_description') as string) || null,
  }

  const parsed = contentSchema.safeParse(raw)
  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors as any }
  }

  try {
    await createContent({
      ...parsed.data,
      published_at: parsed.data.published_at ? new Date(parsed.data.published_at) : new Date(),
    })
    revalidatePath('/admin/contents')
  } catch (err: any) {
    return {
      success: false,
      errors: { _root: [err?.message || 'Có lỗi xảy ra khi tạo bài viết'] },
    }
  }

  redirect('/admin/contents')
}

export async function updateContentAction(
  id: string,
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const raw = {
    title: formData.get('title') as string,
    slug: formData.get('slug') as string,
    type: formData.get('type') as ContentType,
    category: (formData.get('category') as string) || null,
    summary: (formData.get('summary') as string) || null,
    content: (formData.get('content') as string) || null,
    thumbnail: (formData.get('thumbnail') as string) || null,
    banner: (formData.get('banner') as string) || null,
    link_url: (formData.get('link_url') as string) || null,
    button_text: (formData.get('button_text') as string) || null,
    author: (formData.get('author') as string) || null,
    published_at: (formData.get('published_at') as string) || null,
    sort_order: formData.get('sort_order') as string,
    is_featured: formData.get('is_featured') === 'true',
    is_active: formData.get('is_active') === 'true',
    seo_title: (formData.get('seo_title') as string) || null,
    seo_description: (formData.get('seo_description') as string) || null,
  }

  const parsed = contentSchema.safeParse(raw)
  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors as any }
  }

  try {
    await updateContent(id, {
      ...parsed.data,
      published_at: parsed.data.published_at ? new Date(parsed.data.published_at) : null,
    })
    revalidatePath('/admin/contents')
  } catch (err: any) {
    return {
      success: false,
      errors: { _root: [err?.message || 'Có lỗi xảy ra khi cập nhật'] },
    }
  }

  redirect('/admin/contents')
}
