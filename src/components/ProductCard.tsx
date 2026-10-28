import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Cpu, CheckCircle2, AlertCircle, Clock } from 'lucide-react'
import type { ProductWithRelations, LifecycleStatus } from '@/types/database'

export interface ProductCardProps {
  product: {
    id: string | number
    name: string
    slug: string
    model?: string | null
    part_number?: string | null
    sku?: string | null
    price?: number | null
    product_type?: string | null
    thumbnail?: string | null
    images?: string[]
    brand?: {
      name: string
      slug: string
      logo?: string | null
    } | null
    category?: {
      name: string
      slug: string
    } | null
    domain?: {
      name: string
      slug: string
    } | null
    summary?: string | null
    specs_summary?: string | null
    specs?: Array<{
      name: string
      value: string
    }>
    lifecycle_status?: LifecycleStatus | string | null
    is_featured?: boolean
  }
}

export type ProductItem = ProductCardProps['product']


export function ProductCard({ product }: ProductCardProps) {
  const thumbnail = product.thumbnail || null

  // Tách specs summary thành mảng các gạch đầu dòng ngắn gọn (tối đa 3 mục)
  let specBullets: string[] = []
  if (product.specs_summary) {
    specBullets = product.specs_summary
      .split(/[,;\n•|]+/)
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 4)
  } else if (product.specs && product.specs.length > 0) {
    specBullets = product.specs.slice(0, 4).map((s) => `${s.name}: ${s.value}`)
  }

  return (
    <div className="group bg-white rounded-none border border-slate-200 hover:border-[#0077CC] transition-all duration-200 flex flex-col h-full relative hover:shadow-[0_4px_20px_rgba(15,23,42,0.08)]">
      {/* Top Meta Bar: Brand Badge & Lifecycle */}
      <div className="p-3.5 pb-0 flex items-center justify-between gap-2 border-b border-transparent">
        {product.brand?.name ? (
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#0077CC] bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-none">
            {product.brand.name}
          </span>
        ) : (
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded-none">
            Enterprise Tech
          </span>
        )}
      </div>

      {/* Image Container - Phẳng, sắc nét, góc vuông */}
      <Link
        href={`/san-pham/${product.slug}`}
        className="relative aspect-[4/3] bg-slate-50/70 border-b border-slate-100 overflow-hidden flex items-center justify-center p-6 mt-2.5"
      >
        {thumbnail ? (
          <Image
            src={thumbnail}
            alt={product.name}
            fill
            className="object-contain p-4 group-hover:scale-105 transition-transform duration-300 ease-out"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1536px) 33vw, 25vw"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-slate-400 p-4">
            <div className="w-14 h-14 rounded-none bg-slate-200 border border-slate-300 flex items-center justify-center font-bold text-slate-600 text-sm mb-1.5">
              GTS 
            </div>
            <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
              Hardware Spec
            </span>
          </div>
        )}
      </Link>

      {/* Card Content - Thông tin kỹ thuật & Model */}
      <div className="flex flex-col flex-1 p-4 bg-white">
        {/* Model / Part Number Header */}
        <div className="flex items-center justify-between text-xs text-slate-500 gap-2 mb-1.5">
          {product.category?.name && (
            <span className="text-[11px] text-slate-500 truncate max-w-[110px]">
              {product.category.name}
            </span>
          )}
        </div>

        {/* Product Title */}
        <h3 className="text-[15px] font-bold text-slate-900 line-clamp-2 leading-snug group-hover:text-[#0077CC] transition-colors min-h-[2.6rem]">
          <Link href={`/san-pham/${product.slug}`} className="hover:underline">
            {product.name}
          </Link>
        </h3>

        {/* Technical Specs Bullets (B2B highlight) */}
        <div className="mt-3 pt-3 border-t border-slate-100 min-h-[5.5rem]">
          {specBullets.length > 0 ? (
            <ul className="space-y-1">
              {specBullets.map((spec, idx) => (
                <li
                  key={idx}
                  className="text-[12px] text-slate-600 flex items-start gap-1.5 leading-tight"
                >
                  <span className="text-[#0077CC] font-bold mt-0.5">•</span>
                  <span className="line-clamp-1">{spec}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-[12px] text-slate-400 italic flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-slate-400" />
              <span>Liên hệ để nhận datasheet & hồ sơ kỹ thuật</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
