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

/** Helper render Lifecycle status badge phong cách Enterprise B2B */
function LifecycleBadge({ status }: { status?: LifecycleStatus | string | null }) {
  if (!status || status === 'active') {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-none">
        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
        Sẵn sàng / Active
      </span>
    )
  }

  if (status === 'end_of_sale') {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-none">
        <Clock className="w-3 h-3 text-amber-600" />
        End of Sale
      </span>
    )
  }

  if (status === 'discontinued' || status === 'end_of_support') {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-none">
        <AlertCircle className="w-3 h-3 text-rose-600" />
        Ngừng sản xuất
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-slate-600 bg-slate-100 border border-slate-300 px-2 py-0.5 rounded-none">
      {status}
    </span>
  )
}

export function ProductCard({ product }: ProductCardProps) {
  const thumbnail = product.thumbnail || null
  const displayModel = product.model || product.part_number || product.sku || null

  // Tách specs summary thành mảng các gạch đầu dòng ngắn gọn (tối đa 3 mục)
  let specBullets: string[] = []
  if (product.specs_summary) {
    specBullets = product.specs_summary
      .split(/[,;\n•|]+/)
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 3)
  } else if (product.specs && product.specs.length > 0) {
    specBullets = product.specs.slice(0, 3).map((s) => `${s.name}: ${s.value}`)
  }

  return (
    <div className="group bg-white rounded-none border border-slate-200 hover:border-[#1D4ED8] transition-all duration-200 flex flex-col h-full relative hover:shadow-[0_4px_20px_rgba(15,23,42,0.08)]">
      {/* Top Meta Bar: Brand Badge & Lifecycle */}
      <div className="p-3.5 pb-0 flex items-center justify-between gap-2 border-b border-transparent">
        {product.brand?.name ? (
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#1D4ED8] bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-none">
            {product.brand.name}
          </span>
        ) : (
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded-none">
            Enterprise Tech
          </span>
        )}

        <LifecycleBadge status={product.lifecycle_status} />
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

        {/* Hover technical badge */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <span className="text-[10px] font-mono font-bold uppercase bg-slate-900 text-white px-2 py-0.5 rounded-none">
            B2B Unit
          </span>
        </div>
      </Link>

      {/* Card Content - Thông tin kỹ thuật & Model */}
      <div className="flex flex-col flex-1 p-4 bg-white">
        {/* Model / Part Number Header */}
        <div className="flex items-center justify-between text-xs text-slate-500 gap-2 mb-1.5">
          {displayModel ? (
            <div className="font-mono text-[12px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 border border-slate-200 truncate max-w-[180px] rounded-none">
              P/N: {displayModel}
            </div>
          ) : (
            <div className="font-mono text-[11px] text-slate-400">P/N: N/A</div>
          )}
          {product.category?.name && (
            <span className="text-[11px] text-slate-500 truncate max-w-[110px]">
              {product.category.name}
            </span>
          )}
        </div>

        {/* Product Title */}
        <h3 className="text-[15px] font-bold text-slate-900 line-clamp-2 leading-snug group-hover:text-[#1D4ED8] transition-colors min-h-[2.6rem]">
          <Link href={`/san-pham/${product.slug}`} className="hover:underline">
            {product.name}
          </Link>
        </h3>

        {/* Technical Specs Bullets (B2B highlight) */}
        <div className="mt-3 pt-3 border-t border-slate-100 min-h-[4.5rem]">
          {specBullets.length > 0 ? (
            <ul className="space-y-1">
              {specBullets.map((spec, idx) => (
                <li
                  key={idx}
                  className="text-[12px] text-slate-600 flex items-start gap-1.5 leading-tight"
                >
                  <span className="text-[#1D4ED8] font-bold mt-0.5">•</span>
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
