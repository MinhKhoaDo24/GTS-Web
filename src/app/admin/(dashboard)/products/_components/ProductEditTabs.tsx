'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Package, ImageIcon, Layers, Link2, Search, ArrowLeft,
  Eye, ExternalLink, CheckCircle2, AlertCircle
} from 'lucide-react'
import { ProductForm } from './ProductForm'
import { GalleryManager } from './GalleryManager'
import { VariantsManager } from './VariantsManager'
import { RelatedProductsManager } from './RelatedProductsManager'
import { SpecificationsManager } from './SpecificationsManager'
import type { ProductImage, ProductVariant, RelatedProduct } from '@/lib/dal/product-extras'
import type { ProductDetail } from '@/lib/dal/products'
import type { CategoryWithMeta } from '@/lib/dal/categories'

// ─── Types ───────────────────────────────────────────────────────────────────

interface Brand { id: string; name: string; logo?: string | null }

interface ProductEditTabsProps {
  product: ProductDetail
  brands: Brand[]
  categories: CategoryWithMeta[]
  families?: Array<{ id: string; name: string; brand_id?: string | null }>
  images: ProductImage[]
  variants: ProductVariant[]
  relations: RelatedProduct[]
  updateAction: (prev: any, formData: FormData) => Promise<any>
  initialTab?: string
}

type TabKey = 'info' | 'specs' | 'gallery' | 'variants' | 'relations'

const TABS: { key: TabKey; label: string; icon: any; description: string }[] = [
  { key: 'info', label: 'Thông tin', icon: Package, description: 'Thông tin cơ bản & SEO' },
  { key: 'specs', label: 'Thông số kỹ thuật', icon: Search, description: 'Dynamic spec form' },
  { key: 'gallery', label: 'Gallery ảnh', icon: ImageIcon, description: 'Quản lý ảnh sản phẩm' },
  { key: 'variants', label: 'Variants', icon: Layers, description: 'SKU & phiên bản' },
  { key: 'relations', label: 'Sản phẩm liên quan', icon: Link2, description: 'Liên kết sản phẩm' },
]

// ─── Component ───────────────────────────────────────────────────────────────

export function ProductEditTabs({
  product,
  brands,
  categories,
  families = [],
  images,
  variants,
  relations,
  updateAction,
  initialTab,
}: ProductEditTabsProps) {
  const validTabs: TabKey[] = ['info', 'specs', 'gallery', 'variants', 'relations']
  const defaultTab = initialTab && validTabs.includes(initialTab as TabKey)
    ? (initialTab as TabKey)
    : 'info'

  const [activeTab, setActiveTab] = useState<TabKey>(defaultTab)

  const tabCounts: Partial<Record<TabKey, number>> = {
    gallery: images.length,
    variants: variants.length,
    relations: relations.length,
  }

  return (
    <div className="space-y-0">
      {/* Top Header Bar */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs mb-5">
        {/* Product Identity */}
        <div className="px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/products"
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              title="Quay lại danh sách"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="w-px h-6 bg-slate-200" />
            <div>
              <h1 className="text-base font-bold text-slate-900 tracking-tight leading-tight">
                {product.name}
              </h1>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-slate-500 font-mono">{product.model || product.slug}</span>
                {product.is_active ? (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3 h-3" />
                    Đang hiển thị
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-full">
                    <AlertCircle className="w-3 h-3" />
                    Đang ẩn
                  </span>
                )}
                {product.is_featured && (
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-full">
                    ⭐ Nổi bật
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`/san-pham/${product.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-xl transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Xem trang sản phẩm
            </a>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex overflow-x-auto px-4 scrollbar-hide">
          {TABS.map((tab) => {
            const count = tabCounts[tab.key]
            const isActive = activeTab === tab.key
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`
                  flex items-center gap-2 px-4 py-3.5 text-xs font-semibold border-b-2 whitespace-nowrap transition-all
                  ${isActive
                    ? 'border-blue-600 text-blue-700'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                  }
                `}
              >
                <tab.icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {count !== undefined && count > 0 && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center ${
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-slate-100 text-slate-500'
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {/* Tab: Thông tin cơ bản */}
        {activeTab === 'info' && (
          <ProductForm
            action={updateAction}
            brands={brands}
            categories={categories}
            families={families}
            mode="edit"
            hideHeader={true}
            defaultValues={{
              id: product.id,
              name: product.name,
              slug: product.slug,
              model: product.model,
              brand_id: product.brand_id,
              family_id: product.family_id,
              category_id: product.category_id,
              product_type: product.product_type,
              short_description: product.short_description,
              description: product.description,
              thumbnail: product.thumbnail,
              is_active: product.is_active,
              is_featured: product.is_featured,
              seo_title: product.seo_title,
              seo_description: product.seo_description,
              variant_sku: product.variants?.[0]?.sku ?? '',
              variant_part_number: product.variants?.[0]?.part_number ?? '',
              variant_specs_summary: product.variants?.[0]?.specifications_summary ?? '',
            }}
          />
        )}

        {/* Tab: Thông số kỹ thuật (Dynamic Form) */}
        {activeTab === 'specs' && (
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6">
            <SpecificationsManager
              productId={product.id}
              categoryId={product.category_id}
            />
          </div>
        )}

        {/* Tab: Gallery ảnh */}
        {activeTab === 'gallery' && (
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6">
            <GalleryManager productId={product.id} initialImages={images} />
          </div>
        )}

        {/* Tab: Variants */}
        {activeTab === 'variants' && (
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6">
            <VariantsManager productId={product.id} initialVariants={variants} />
          </div>
        )}

        {/* Tab: Related Products */}
        {activeTab === 'relations' && (
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6">
            <RelatedProductsManager productId={product.id} initialRelations={relations} />
          </div>
        )}
      </div>
    </div>
  )
}
