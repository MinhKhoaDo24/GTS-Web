import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { query, queryOne } from '@/lib/db'
import type { SiteSetting } from '@/types/database'
import { RichTextRenderer } from '@/components/RichTextRenderer'
import { ChevronRight, PhoneCall } from 'lucide-react'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params
  try {
    const page = await queryOne<{
      title: string
      seo_title: string | null
      seo_description: string | null
    }>(
      'SELECT title, seo_title, seo_description FROM pages WHERE slug = $1 LIMIT 1',
      [resolvedParams.slug]
    )

    if (!page) {
      return { title: 'Trang không tồn tại' }
    }

    return {
      title: page.seo_title || page.title,
      description: page.seo_description || `Thông tin về ${page.title} tại GTS.`,
    }
  } catch {
    return { title: 'GTS - Dịch vụ & Giải pháp' }
  }
}

export default async function DynamicStaticPage({ params }: PageProps) {
  const resolvedParams = await params

  let page: {
    id: number
    title: string
    slug: string
    content: string | null
    seo_title: string | null
    seo_description: string | null
  } | null = null
  let settings: Record<string, string> = {}

  try {
    const [pageResult, settingsArr] = await Promise.all([
      queryOne<{
        id: number
        title: string
        slug: string
        content: string | null
        seo_title: string | null
        seo_description: string | null
      }>(
        'SELECT id, title, slug, content, seo_title, seo_description FROM pages WHERE slug = $1 LIMIT 1',
        [resolvedParams.slug]
      ),
      query<SiteSetting>('SELECT key, value FROM site_settings'),
    ])
    page = pageResult
    settings = Object.fromEntries(settingsArr.map((s) => [s.key, s.value ?? '']))
  } catch {
    notFound()
  }

  if (!page) {
    notFound()
  }

  return (
    <div className="bg-[#F8FAFC] py-10 sm:py-14">
      <div className="max-w-[1000px] mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-500 mb-6">
          <Link href="/" className="hover:text-[#1D4ED8] transition-colors">
            Trang chủ
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-gray-800 font-medium">{page.title}</span>
        </nav>

        {/* Card Content Container */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-10 shadow-sm">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100">
            {page.title}
          </h1>

          {page.content ? (
            <RichTextRenderer content={page.content} />
          ) : (
            <p className="text-gray-500 text-sm">Nội dung đang được cập nhật...</p>
          )}

          {/* Direct CTA footer */}
          <div className="mt-10 pt-8 border-t border-gray-100 bg-blue-50/50 -mx-6 -mb-6 sm:-mx-10 sm:-mb-10 p-6 sm:p-8 rounded-b-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-gray-900">
                Bạn cần tư vấn chi tiết về dịch vụ / giải pháp này?
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                Kỹ sư GTS sẵn sàng khảo sát thực tế và đưa ra đề xuất kỹ thuật tối ưu nhất.
              </p>
            </div>
            <a
              href={`tel:${(settings.hotline || '0901234567').replace(/\s/g, '')}`}
              className="inline-flex items-center gap-2 bg-[#1D4ED8] hover:bg-[#1e40af] text-white px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all whitespace-nowrap shadow-sm hover:shadow"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Hotline: {settings.hotline || '0901 234 567'}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
