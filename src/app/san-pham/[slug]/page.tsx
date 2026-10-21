import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { query, queryOne } from '@/lib/db'
import type { SiteSetting, ProductWithRelations } from '@/types/database'
import { ImageGallery } from '@/components/ImageGallery'
import { RichTextRenderer } from '@/components/RichTextRenderer'
import { ProductCard, type ProductItem } from '@/components/ProductCard'
import {
  ChevronRight,
  Phone,
  Mail,
  Shield,
  Truck,
  CheckCircle2,
  FileText,
  Settings,
  Headphones,
  Award,
  Terminal,
  Activity,
  Send,
  ExternalLink
} from 'lucide-react'
import { SiZalo } from 'react-icons/si'

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params
  const product = await queryOne<{
    name: string
    model: string | null
    short_description: string | null
    thumbnail: string | null
    brand_name: string
  }>(
    `SELECT p.name, p.model, p.short_description, p.thumbnail, b.name as brand_name
     FROM products p
     JOIN brands b ON p.brand_id = b.id
     WHERE p.slug = $1 LIMIT 1`,
    [resolvedParams.slug]
  )

  if (!product) {
    return { title: 'Không tìm thấy sản phẩm | GTS' }
  }

  return {
    title: `${product.name} ${product.model ? `(${product.model})` : ''} | GTS Phân Phối Chính Hãng`,
    description:
      product.short_description ||
      `Cung cấp ${product.name} chính hãng bởi ${product.brand_name} tại GTS. Đầy đủ CO/CQ, bảo hành dự án 12 - 36 tháng, tư vấn thiết kế hệ thống.`,
    openGraph: {
      title: `${product.name} - GTS Enterprise Tech`,
      description: product.short_description || undefined,
      images: product.thumbnail ? [product.thumbnail] : [],
    },
  }
}

export default async function ProductDetailPage({ params }: PageProps) {
  const resolvedParams = await params

  const [rawProduct, settingsArr] = await Promise.all([
    queryOne<{
      id: string
      category_id: string
      brand_id: string
      domain_id: string | null
      name: string
      slug: string
      model: string | null
      product_type: string
      short_description: string | null
      description: string | null
      thumbnail: string | null
      brand_name: string
      brand_slug: string
      category_name: string
      category_slug: string
      domain_name: string | null
      domain_slug: string | null
      part_number: string | null
      sku: string | null
      specs_summary: string | null
      lifecycle_status: string | null
      datasheet_url: string | null
    }>(
      `SELECT 
         p.id, p.category_id, p.brand_id, p.domain_id, p.name, p.slug, p.model, p.product_type,
         p.short_description, p.description, p.thumbnail,
         b.name as brand_name, b.slug as brand_slug,
         c.name as category_name, c.slug as category_slug,
         d.name as domain_name, d.slug as domain_slug,
         (SELECT pv.part_number FROM product_variants pv WHERE pv.product_id = p.id AND pv.is_active = true ORDER BY pv.id ASC LIMIT 1) as part_number,
         (SELECT pv.sku FROM product_variants pv WHERE pv.product_id = p.id AND pv.is_active = true ORDER BY pv.id ASC LIMIT 1) as sku,
         (SELECT pv.specifications_summary FROM product_variants pv WHERE pv.product_id = p.id AND pv.is_active = true ORDER BY pv.id ASC LIMIT 1) as specs_summary,
         (SELECT pl.status FROM product_lifecycle pl WHERE pl.product_id = p.id LIMIT 1) as lifecycle_status,
         p.datasheet_url
       FROM products p
       JOIN brands b ON p.brand_id = b.id
       JOIN categories c ON p.category_id = c.id
       LEFT JOIN domains d ON p.domain_id = d.id
       WHERE p.slug = $1 AND p.is_active = true
       LIMIT 1`,
      [resolvedParams.slug]
    ),
    query<SiteSetting>('SELECT key, value FROM site_settings'),
  ])

  if (!rawProduct) {
    notFound()
  }

  // Tải danh sách ảnh từ product_images (nếu có) hoặc dùng thumbnail
  const productImages = await query<{ image_url: string }>(
    `SELECT image_url FROM product_images WHERE product_id = $1 ORDER BY sort_order ASC, is_primary DESC`,
    [rawProduct.id]
  ).catch(() => [])

  let images: string[] = productImages.map((img) => img.image_url)
  if (images.length === 0 && rawProduct.thumbnail) {
    images = [rawProduct.thumbnail]
  }

  // Tải thông số kỹ thuật chi tiết từ product_specifications join specifications
  const specsRows = await query<{
    spec_name: string
    value_text: string | null
    value_number: number | null
    unit: string | null
    unit_override: string | null
    group_name: string
  }>(
    `SELECT 
       s.name as spec_name, ps.value_text, ps.value_number, s.unit, ps.unit_override,
       sg.name as group_name
     FROM product_specifications ps
     JOIN specifications s ON ps.specification_id = s.id
     JOIN specification_groups sg ON s.group_id = sg.id
     WHERE ps.product_id = $1
     ORDER BY sg.sort_order ASC, s.sort_order ASC`,
    [rawProduct.id]
  ).catch(() => [])

  const settings: Record<string, string> = Object.fromEntries(
    settingsArr.map((s) => [s.key, s.value ?? ''])
  )

  const product = {
    ...rawProduct,
    images,
    brand: { name: rawProduct.brand_name, slug: rawProduct.brand_slug },
    category: { name: rawProduct.category_name, slug: rawProduct.category_slug },
    domain: rawProduct.domain_name
      ? { name: rawProduct.domain_name, slug: rawProduct.domain_slug! }
      : null,
  }

  // Sản phẩm liên quan cùng danh mục
  const rawRelated = await query<{
    id: string
    name: string
    slug: string
    model: string | null
    thumbnail: string | null
    product_type: string
    brand_name: string
    brand_slug: string
    category_name: string
    category_slug: string
    part_number: string | null
    sku: string | null
    specs_summary: string | null
    lifecycle_status: string | null
  }>(
    `SELECT 
       p.id, p.name, p.slug, p.model, p.thumbnail, p.product_type,
       b.name as brand_name, b.slug as brand_slug,
       c.name as category_name, c.slug as category_slug,
       (SELECT pv.part_number FROM product_variants pv WHERE pv.product_id = p.id AND pv.is_active = true ORDER BY pv.id ASC LIMIT 1) as part_number,
       (SELECT pv.sku FROM product_variants pv WHERE pv.product_id = p.id AND pv.is_active = true ORDER BY pv.id ASC LIMIT 1) as sku,
       (SELECT pv.specifications_summary FROM product_variants pv WHERE pv.product_id = p.id AND pv.is_active = true ORDER BY pv.id ASC LIMIT 1) as specs_summary,
       (SELECT pl.status FROM product_lifecycle pl WHERE pl.product_id = p.id LIMIT 1) as lifecycle_status
     FROM products p
     JOIN brands b ON p.brand_id = b.id
     JOIN categories c ON p.category_id = c.id
     WHERE p.category_id = $1 AND p.id != $2 AND p.is_active = true
     ORDER BY p.created_at DESC
     LIMIT 4`,
    [product.category_id, product.id]
  ).catch(() => [])

  const relatedProducts: ProductItem[] = rawRelated.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    model: p.model,
    part_number: p.part_number,
    sku: p.sku,
    product_type: p.product_type,
    thumbnail: p.thumbnail,
    brand: { name: p.brand_name, slug: p.brand_slug },
    category: { name: p.category_name, slug: p.category_slug },
    specs_summary: p.specs_summary,
    lifecycle_status: p.lifecycle_status || 'active',
  }))

  const displayModel = product.model || product.part_number || product.sku

  return (
    <div className="bg-[#F8FAFC] py-8 sm:py-10">
      <div className="layout-container">
        {/* ── Breadcrumb (Sắc nét, góc vuông) ───────────────────────────── */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6 flex-wrap font-medium">
          <Link href="/" className="hover:text-[#0077CC] transition-colors">
            Trang chủ
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300 flex-shrink-0" />
          <Link href="/san-pham" className="hover:text-[#0077CC] transition-colors">
            Sản phẩm & Hạ tầng
          </Link>
          {product.domain && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300 flex-shrink-0" />
              <Link
                href={`/san-pham?domain=${product.domain.slug}`}
                className="hover:text-[#0077CC] transition-colors"
              >
                {product.domain.name}
              </Link>
            </>
          )}
          <ChevronRight className="w-3.5 h-3.5 text-slate-300 flex-shrink-0" />
          <Link
            href={`/san-pham?category=${product.category.slug}`}
            className="hover:text-[#0077CC] transition-colors"
          >
            {product.category.name}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300 flex-shrink-0" />
          <span className="text-slate-900 font-bold truncate max-w-md">{product.name}</span>
        </nav>

        {/* ── Top Section: Gallery + B2B Product Overview ───────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* Gallery - 5 cols (Góc vuông) */}
          <div className="lg:col-span-5 bg-white border border-slate-200 p-4 rounded-none">
            <ImageGallery images={images} productName={product.name} />
          </div>

          {/* Product Overview & Action - 7 cols */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-none shadow-none flex-1 flex flex-col justify-between">
              <div>
                {/* Meta Bar: Brand + Part Number + Lifecycle */}
                <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/san-pham?brand=${product.brand.slug}`}
                      className="bg-blue-50 text-[#0077CC] text-xs font-bold uppercase tracking-wider px-3 py-1 border border-blue-200 rounded-none hover:bg-blue-100 transition-colors"
                    >
                      Hãng: {product.brand.name}
                    </Link>


                  </div>

                  <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-none font-semibold">
                    {product.lifecycle_status === 'active' || !product.lifecycle_status
                      ? '✓ Sẵn sàng cung cấp / Active'
                      : product.lifecycle_status}
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 leading-tight mb-3">
                  {product.name}
                </h1>

                {/* B2B Pricing & Invoicing Notice (KHÔNG CÓ GIÁ CỐ ĐỊNH) */}
                <div className="p-4 bg-slate-50 border border-slate-200 border-l-4 border-l-[#0077CC] mb-5 rounded-none">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Hình thức giá: B2B Project / Đại lý & Doanh nghiệp
                    </span>
                    <span className="text-[11px] text-emerald-700 font-bold bg-emerald-100/80 px-2 py-0.5 rounded-none">
                      Chiết khấu theo số lượng
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Vui lòng gửi yêu cầu báo giá chính thức kèm số lượng hoặc thông tin dự án để nhận mức giá đại lý tốt nhất, bao gồm CO/CQ và hóa đơn VAT.
                  </p>
                </div>

                {/* Specs Summary / Short Description */}
                {(product.short_description || product.specs_summary) && (
                  <div className="mb-6">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                      Đặc điểm kỹ thuật chính:
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50/60 p-3.5 border border-slate-200 rounded-none">
                      {product.short_description || product.specs_summary}
                    </p>
                  </div>
                )}
              </div>

              {/* Direct CTAs for B2B Purchasing */}
              <div className="pt-5 border-t border-slate-200 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Yêu cầu báo giá trực tuyến */}
                  <Link
                    href={`/lien-he?product=${encodeURIComponent(product.slug)}&name=${encodeURIComponent(
                      product.name
                    )}&type=quote`}
                    className="flex items-center justify-center gap-2 bg-[#0077CC] hover:bg-[#004A80] text-white py-3 px-4 rounded-none font-bold text-xs uppercase tracking-wider transition-colors"
                  >
                    <Send className="w-4 h-4" />
                    <span>Yêu cầu báo giá</span>
                  </Link>

                  {/* Hotline */}
                  <a
                    href={`tel:${(settings.hotline || '0901234567').replace(/\s/g, '')}`}
                    className="flex items-center justify-center gap-2 bg-[#0F172A] hover:bg-slate-800 text-white py-3 px-4 rounded-none font-bold text-xs transition-colors"
                  >
                    <Phone className="w-4 h-4 text-amber-400" />
                    <span>Hotline: {settings.hotline || '0901 234 567'}</span>
                  </a>

                  {/* Zalo B2B */}
                  <a
                    href={`https://zalo.me/${(settings.zalo_phone || '0901234567').replace(/\s/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 py-3 px-4 rounded-none font-bold text-xs transition-colors"
                  >
                    <SiZalo className="w-4 h-4 text-[#0068FF]" />
                    <span>Chat Zalo B2B</span>
                  </a>
                </div>

                {/* Datasheet / Technical Document Online Link */}
                {product.datasheet_url && (
                  <a
                    href={product.datasheet_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-slate-50 hover:bg-blue-50/80 text-[#0077CC] border border-blue-200 hover:border-blue-300 py-2.5 px-4 rounded-none font-bold text-xs uppercase tracking-wider transition-colors"
                  >
                    <FileText className="w-4 h-4 text-[#0077CC]" />
                    <span>Xem Datasheet / Tài liệu kỹ thuật online</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-70 ml-0.5" />
                  </a>
                )}

                {/* Trust Highlights */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span>100% Chính hãng</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#0077CC] flex-shrink-0" />
                    <span>Hồ sơ CO/CQ đầy đủ</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                    <span>Giao hàng toàn quốc</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Headphones className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />
                    <span>Hỗ trợ kỹ thuật 24/7</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Middle Section: Detailed Description & Technical Specifications ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-14">
          {/* Detailed Content - 8 cols */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-none">
              <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-slate-200">
                <FileText className="w-5 h-5 text-[#0077CC]" />
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 uppercase tracking-wide">
                  Chi tiết thiết bị & Tính năng
                </h2>
              </div>
              {product.description ? (
                <RichTextRenderer content={product.description} />
              ) : (
                <p className="text-slate-500 text-xs italic">
                  Thông tin mô tả chi tiết của thiết bị đang được cập nhật. Quý khách vui lòng liên hệ kỹ sư GTS để nhận tài liệu datasheet hoàn chỉnh.
                </p>
              )}
            </div>
          </div>

          {/* Specifications Sidebar - 4 cols */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-slate-200 p-6 rounded-none">
              <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-slate-200">
                <Settings className="w-5 h-5 text-[#0077CC]" />
                <h2 className="text-base font-bold text-slate-900 uppercase tracking-wide">
                  Thông số kỹ thuật
                </h2>
              </div>

              {specsRows.length > 0 ? (
                <div className="divide-y divide-slate-100 text-xs">
                  {specsRows.map((sp, idx) => (
                    <div key={idx} className="py-2.5 flex justify-between gap-2">
                      <span className="text-slate-500 font-medium">{sp.spec_name}</span>
                      <span className="text-slate-900 font-mono font-bold text-right">
                        {sp.value_text || sp.value_number}{' '}
                        {sp.unit_override || sp.unit || ''}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3 py-2 text-xs">
                  <p className="text-slate-500 italic">
                    Bảng thông số kỹ thuật chi tiết đang được đồng bộ hóa.
                  </p>
                  {product.datasheet_url && (
                    <a
                      href={product.datasheet_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 font-semibold text-[#0077CC] hover:underline"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Xem datasheet / tài liệu kỹ thuật online</span>
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Support Box */}
            <div className="bg-[#0B1120] border border-slate-800 p-6 text-white rounded-none">
              <div className="flex items-center gap-2 mb-2 text-[#38BDF8] text-xs font-bold uppercase tracking-wider">
                <Terminal className="w-4 h-4" />
                <span>Hỗ trợ thiết kế & Triển khai</span>
              </div>
              <p className="text-slate-300 text-xs leading-relaxed mb-4">
                Đội ngũ kỹ sư GTS có chứng chỉ quốc tế (CCNP, NSE 4+, Aruba ACMP) sẵn sàng tư vấn sơ đồ mạng, kiểm tra tính tương thích và hỗ trợ cấu hình PoC.
              </p>
              <Link
                href="/lien-he?type=consultation"
                className="w-full bg-[#0077CC] hover:bg-[#004A80] text-white py-2.5 px-3 text-xs font-bold text-center block rounded-none uppercase tracking-wider transition-colors"
              >
                Đặt lịch tư vấn giải pháp
              </Link>
            </div>
          </div>
        </div>

        {/* ── Bottom Section: Related Products ──────────────────────────── */}
        {relatedProducts.length > 0 && (
          <div className="pt-6 border-t border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 uppercase tracking-wide">
                  Thiết bị cùng danh mục
                </h2>
                <p className="text-slate-500 text-xs mt-0.5">
                  Các model phần cứng thuộc nhóm {product.category.name}
                </p>
              </div>
              <Link
                href={`/san-pham?category=${product.category.slug}`}
                className="text-xs font-bold text-[#0077CC] hover:underline flex items-center gap-1"
              >
                <span>Xem tất cả</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
