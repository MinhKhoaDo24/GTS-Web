import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { query, queryOne } from '@/lib/db'
import { formatDate } from '@/lib/utils'
import { RichTextRenderer } from '@/components/RichTextRenderer'
import { ChevronRight, Calendar, ArrowLeft, User, Clock, Share2, ShieldCheck, ArrowRight } from 'lucide-react'
import { FALLBACK_POSTS } from '../page'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params
  try {
    const post = await queryOne<{ title: string; excerpt: string | null }>(
      'SELECT title, excerpt FROM posts WHERE slug = $1 LIMIT 1',
      [resolvedParams.slug]
    )

    if (post) {
      return {
        title: `${post.title} | GTS Tin tức`,
        description: post.excerpt || undefined,
      }
    }
  } catch {}

  const fallback = FALLBACK_POSTS.find((p) => p.slug === resolvedParams.slug)
  if (fallback) {
    return {
      title: `${fallback.title} | GTS Tin tức`,
      description: fallback.excerpt || undefined,
    }
  }

  return { title: 'Tin tức & Giải pháp GTS' }
}

export default async function NewsDetailPage({ params }: PageProps) {
  const resolvedParams = await params

  let post: {
    id: number | string
    title: string
    slug: string
    thumbnail: string | null
    excerpt: string | null
    content: string | null
    publishedAt: Date | string | null
    createdAt: Date | string
    author?: string
    readTime?: string
    postCategory: { name: string; slug?: string } | null
  } | null = null

  let relatedPosts: Array<{
    id: number | string
    slug: string
    title: string
    publishedAt: Date | string | null
    createdAt: Date | string
  }> = []

  try {
    const rawPost = await queryOne<{
      id: number
      title: string
      slug: string
      thumbnail: string | null
      excerpt: string | null
      content: string | null
      published_at: Date | null
      created_at: Date
      category_id: number | null
      category_name: string | null
    }>(
      `SELECT p.id, p.title, p.slug, p.thumbnail, p.excerpt, p.content,
              p.published_at, p.created_at,
              pc.id as category_id, pc.name as category_name
       FROM posts p
       LEFT JOIN post_categories pc ON p.post_category_id = pc.id
       WHERE p.slug = $1 AND p.status = 'published'
       LIMIT 1`,
      [resolvedParams.slug]
    )

    if (rawPost) {
      post = {
        ...rawPost,
        publishedAt: rawPost.published_at,
        createdAt: rawPost.created_at,
        readTime: '6 phút đọc',
        postCategory: rawPost.category_name ? { name: rawPost.category_name } : null,
      }

      const relatedRows = await query<{
        id: number
        slug: string
        title: string
        published_at: Date | null
        created_at: Date
      }>(
        `SELECT id, slug, title, published_at, created_at
         FROM posts
         WHERE status = 'published' AND id != $1
         ORDER BY published_at DESC NULLS LAST, created_at DESC
         LIMIT 3`,
        [rawPost.id]
      ).catch(() => [])

      relatedPosts = relatedRows.map((r) => ({
        id: r.id,
        slug: r.slug,
        title: r.title,
        publishedAt: r.published_at,
        createdAt: r.created_at,
      }))
    }
  } catch {}

  // Nếu không tìm thấy trong database, kiểm tra trong FALLBACK_POSTS
  if (!post) {
    const fb = FALLBACK_POSTS.find((p) => p.slug === resolvedParams.slug)
    if (fb) {
      post = fb
      relatedPosts = FALLBACK_POSTS.filter((p) => p.slug !== fb.slug).slice(0, 3)
    }
  }

  if (!post) {
    notFound()
  }

  return (
    <div className="bg-[#F8FAFC] py-8 sm:py-12">
      <div className="max-w-[880px] mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-6 flex-wrap">
          <Link href="/" className="hover:text-[#1D4ED8] transition-colors">
            Trang chủ
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-300" />
          <Link href="/tin-tuc" className="hover:text-[#1D4ED8] transition-colors">
            Tin tức & Kiến thức
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-300" />
          <span className="text-slate-800 font-bold truncate max-w-xs">{post.title}</span>
        </nav>

        {/* Back link */}
        <Link
          href="/tin-tuc"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#1D4ED8] transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại danh sách tin tức
        </Link>

        {/* Article Box */}
        <article className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 lg:p-12 shadow-sm mb-12">
          {/* Metadata header */}
          <div className="flex flex-wrap items-center gap-3 mb-5">
            {post.postCategory && (
              <span className="bg-blue-100 text-[#1D4ED8] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                {post.postCategory.name}
              </span>
            )}
            <span className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {formatDate(post.publishedAt || post.createdAt)}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {post.readTime || '5 phút đọc'}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold ml-auto">
              <User className="w-3.5 h-3.5 text-[#1D4ED8]" />
              {post.author || 'Đội ngũ Kỹ sư GTS'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 leading-tight mb-6">
            {post.title}
          </h1>

          {post.excerpt && (
            <div className="text-sm sm:text-base text-slate-700 font-medium leading-relaxed bg-blue-50/70 p-5 rounded-2xl mb-8 border-l-4 border-[#1D4ED8]">
              {post.excerpt}
            </div>
          )}

          {/* Article content */}
          <div className="prose prose-slate max-w-none prose-headings:font-black prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-4 prose-h3:text-lg prose-p:text-slate-700 prose-p:leading-relaxed prose-li:text-slate-700">
            <RichTextRenderer content={post.content} />
          </div>

          {/* Article Footer & Author Signature */}
          <div className="mt-12 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 text-[#1D4ED8] flex items-center justify-center font-bold">
                GTS
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Bài viết được kiểm duyệt kỹ thuật</div>
                <div className="text-[11px] text-slate-500">Phòng Giải pháp & Tích hợp Hệ thống GTS</div>
              </div>
            </div>

            <Link
              href="/lien-he?type=quote"
              className="text-xs font-bold text-white bg-[#1D4ED8] hover:bg-[#1E40AF] px-4 py-2.5 rounded-xl shadow-xs transition-colors"
            >
              Yêu cầu tư vấn cấu hình tương đương
            </Link>
          </div>
        </article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div>
            <h2 className="text-xl font-black text-slate-900 mb-6">Bài viết cùng chuyên mục</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {relatedPosts.map((p) => (
                <Link
                  key={p.id}
                  href={`/tin-tuc/${p.slug}`}
                  className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md hover:border-blue-200 transition-all group block"
                >
                  <span className="text-[11px] text-slate-400 block mb-2 font-medium">
                    {formatDate(p.publishedAt || p.createdAt)}
                  </span>
                  <h3 className="text-sm font-bold text-slate-800 group-hover:text-[#1D4ED8] line-clamp-2 transition-colors leading-snug">
                    {p.title}
                  </h3>
                  <div className="mt-4 flex items-center gap-1 text-xs font-bold text-[#1D4ED8]">
                    <span>Đọc tiếp</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
