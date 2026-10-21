import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { query, queryOne } from '@/lib/db'
import { formatDate } from '@/lib/utils'
import { RichTextRenderer } from '@/components/RichTextRenderer'
import {
  ChevronRight,
  Calendar,
  ArrowLeft,
  User,
  Clock,
  ArrowRight,
  Tag,
  Newspaper,
  PhoneCall,
  Send,
} from 'lucide-react'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params
  try {
    const post = await queryOne<{
      title: string
      summary: string | null
      seo_title: string | null
      seo_description: string | null
    }>(
      `SELECT title, summary, seo_title, seo_description
       FROM contents
       WHERE slug = $1 AND is_active = true
       LIMIT 1`,
      [resolvedParams.slug]
    )

    if (post) {
      return {
        title: post.seo_title || `${post.title} | GTS Tin tức`,
        description: post.seo_description || post.summary || undefined,
      }
    }
  } catch {}

  return { title: 'Tin tức & Giải pháp GTS' }
}

export default async function NewsDetailPage({ params }: PageProps) {
  const resolvedParams = await params

  let post: {
    id: string
    title: string
    slug: string
    thumbnail: string | null
    banner: string | null
    summary: string | null
    content: string | null
    published_at: Date | string | null
    created_at: Date | string
    author: string | null
    category: string | null
  } | null = null

  let relatedPosts: Array<{
    id: string
    slug: string
    title: string
    summary: string | null
    thumbnail: string | null
    published_at: Date | string | null
    created_at: Date | string
    category: string | null
  }> = []

  try {
    const rawPost = await queryOne<{
      id: string
      title: string
      slug: string
      thumbnail: string | null
      banner: string | null
      summary: string | null
      content: string | null
      published_at: Date | null
      created_at: Date
      author: string | null
      category: string | null
    }>(
      `SELECT id, title, slug, thumbnail, banner, summary, content,
              published_at, created_at, author, category
       FROM contents
       WHERE slug = $1 AND is_active = true
       LIMIT 1`,
      [resolvedParams.slug]
    )

    if (rawPost) {
      post = rawPost

      const relatedRows = await query<{
        id: string
        slug: string
        title: string
        summary: string | null
        thumbnail: string | null
        published_at: Date | null
        created_at: Date
        category: string | null
      }>(
        `SELECT id, slug, title, summary, thumbnail, published_at, created_at, category
         FROM contents
         WHERE is_active = true AND id != $1
         ORDER BY COALESCE(published_at, created_at) DESC
         LIMIT 3`,
        [rawPost.id]
      ).catch(() => [])

      relatedPosts = relatedRows
    }
  } catch {
    post = null
  }

  // Nếu không tìm thấy bài viết trong CSDL -> 404
  if (!post) {
    notFound()
  }

  const displayDate = post.published_at || post.created_at

  return (
    <div className="bg-[#F8FAFC] py-8 sm:py-12 fade-in">
      <div className="max-w-[880px] mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-6 flex-wrap font-medium">
          <Link href="/" className="hover:text-[#0077CC] transition-colors">
            Trang chủ
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-300" />
          <Link href="/tin-tuc" className="hover:text-[#0077CC] transition-colors">
            Tin tức & Kiến thức
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-300" />
          <span className="text-slate-800 font-bold truncate max-w-xs">{post.title}</span>
        </nav>

        {/* Nút quay lại danh sách tin tức */}
        <Link
          href="/tin-tuc"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#0077CC] transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại danh sách tin tức
        </Link>

        {/* Khung bài viết */}
        <article className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 lg:p-12 shadow-sm mb-12">
          {/* Metadata header */}
          <div className="flex flex-wrap items-center gap-3 mb-5">
            {post.category && (
              <span className="bg-blue-100 text-[#0077CC] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                {post.category}
              </span>
            )}
            <span className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {formatDate(displayDate)}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              5 phút đọc
            </span>
            <span className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold ml-auto">
              <User className="w-3.5 h-3.5 text-[#0077CC]" />
              {post.author || 'Ban biên tập GTS'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 leading-tight mb-6">
            {post.title}
          </h1>

          {/* Ảnh thumbnail / banner chính nếu có */}
          {(post.banner || post.thumbnail) && (
            <div className="w-full aspect-video rounded-2xl overflow-hidden relative mb-8 bg-slate-100">
              <Image
                src={post.banner || post.thumbnail || ''}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          {post.summary && (
            <div className="text-sm sm:text-base text-slate-700 font-medium leading-relaxed bg-blue-50/70 p-5 rounded-2xl mb-8 border-l-4 border-[#0077CC]">
              {post.summary}
            </div>
          )}

          {/* Nội dung bài viết */}
          <div className="prose prose-slate max-w-none prose-headings:font-black prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-4 prose-h3:text-lg prose-p:text-slate-700 prose-p:leading-relaxed prose-li:text-slate-700">
            <RichTextRenderer content={post.content} />
          </div>

          {/* Chân bài viết */}
          <div className="mt-12 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 text-[#0077CC] flex items-center justify-center font-bold">
                GTS
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Bài viết được kiểm duyệt kỹ thuật</div>
                <div className="text-[11px] text-slate-500">Phòng Giải pháp & Tích hợp Hệ thống GTS</div>
              </div>
            </div>

            <Link
              href="/lien-he?type=quote"
              className="text-xs font-bold text-white bg-[#0077CC] hover:bg-[#004A80] px-4 py-2.5 rounded-xl shadow-xs transition-colors"
            >
              Yêu cầu tư vấn kỹ thuật
            </Link>
          </div>
        </article>

        {/* Bài viết liên quan */}
        {relatedPosts.length > 0 && (
          <div>
            <h2 className="text-xl font-black text-slate-900 mb-6">Bài viết khác</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {relatedPosts.map((p) => (
                <Link
                  key={p.id}
                  href={`/tin-tuc/${p.slug}`}
                  className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md hover:border-blue-200 transition-all group block"
                >
                  <span className="text-[11px] text-slate-400 block mb-2 font-medium">
                    {formatDate(p.published_at || p.created_at)}
                  </span>
                  <h3 className="text-sm font-bold text-slate-800 group-hover:text-[#0077CC] line-clamp-2 transition-colors leading-snug">
                    {p.title}
                  </h3>
                  <div className="mt-4 flex items-center gap-1 text-xs font-bold text-[#0077CC]">
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
