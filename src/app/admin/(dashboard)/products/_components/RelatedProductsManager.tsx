'use client'

import { useState, useTransition, useCallback, useRef, useEffect } from 'react'
import Image from 'next/image'
import {
  Link2, Search, X, Trash2, Loader2, Package, Plus, ArrowRight
} from 'lucide-react'
import { useToast } from '@/components/admin/ui/Toast'
import type { RelatedProduct } from '@/lib/dal/product-extras'

interface RelatedProductsManagerProps {
  productId: string
  initialRelations: RelatedProduct[]
}

const RELATIONSHIP_TYPES = [
  { value: 'related', label: 'Sản phẩm liên quan' },
  { value: 'accessory', label: 'Phụ kiện' },
  { value: 'upgrade', label: 'Nâng cấp lên' },
  { value: 'replacement', label: 'Sản phẩm thay thế' },
  { value: 'bundle', label: 'Bán kèm theo' },
  { value: 'compatible', label: 'Tương thích' },
]

function getTypeLabel(type: string | null) {
  return RELATIONSHIP_TYPES.find(t => t.value === type)?.label ?? type ?? 'Liên quan'
}

function getTypeColor(type: string | null) {
  switch (type) {
    case 'accessory': return 'bg-violet-50 text-violet-700 border-violet-200'
    case 'upgrade': return 'bg-blue-50 text-blue-700 border-blue-200'
    case 'replacement': return 'bg-amber-50 text-amber-700 border-amber-200'
    case 'bundle': return 'bg-green-50 text-green-700 border-green-200'
    case 'compatible': return 'bg-cyan-50 text-cyan-700 border-cyan-200'
    default: return 'bg-slate-50 text-slate-600 border-slate-200'
  }
}

interface SearchResult {
  id: string
  name: string
  slug: string
  thumbnail: string | null
  brand_name: string | null
}

export function RelatedProductsManager({ productId, initialRelations }: RelatedProductsManagerProps) {
  const { success, error } = useToast()
  const [isPending, startTransition] = useTransition()
  const [relations, setRelations] = useState<RelatedProduct[]>(initialRelations)
  const [showSearch, setShowSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [searching, setSearching] = useState(false)
  const [selectedType, setSelectedType] = useState('related')
  const searchRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Debounced search
  const handleSearch = useCallback((q: string) => {
    setSearchQuery(q)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (!q.trim()) { setSearchResults([]); return }

    debounceRef.current = setTimeout(async () => {
      setSearching(true)
      try {
        const res = await fetch(
          `/api/v2/admin/products/${productId}/relations?search=${encodeURIComponent(q)}`
        )
        if (res.ok) {
          const json = await res.json()
          // Filter out already-added relations
          const existingIds = relations.map(r => r.related_product_id)
          setSearchResults((json.data ?? []).filter((p: SearchResult) => !existingIds.includes(p.id)))
        }
      } finally {
        setSearching(false)
      }
    }, 300)
  }, [productId, relations])

  useEffect(() => {
    if (showSearch) {
      setTimeout(() => searchRef.current?.focus(), 100)
    }
  }, [showSearch])

  const handleAddRelation = (product: SearchResult) => {
    startTransition(async () => {
      try {
        const res = await fetch(`/api/v2/admin/products/${productId}/relations`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            related_product_id: product.id,
            relationship_type: selectedType,
          }),
        })
        if (!res.ok) throw new Error()

        // Optimistically add to list
        const newRelation: RelatedProduct = {
          id: '',
          relationship_id: Date.now().toString(),
          product_id: productId,
          related_product_id: product.id,
          relationship_type: selectedType,
          notes: null,
          related_name: product.name,
          related_slug: product.slug,
          related_thumbnail: product.thumbnail,
          related_brand: product.brand_name,
        }
        setRelations(prev => [...prev, newRelation])
        setSearchQuery('')
        setSearchResults([])
        success(`Đã thêm "${product.name}" vào danh sách liên quan`)
      } catch {
        error('Lỗi', 'Không thể thêm sản phẩm liên quan')
      }
    })
  }

  const handleRemoveRelation = (relation: RelatedProduct) => {
    startTransition(async () => {
      try {
        const res = await fetch(
          `/api/v2/admin/products/${productId}/relations?relationId=${relation.relationship_id}`,
          { method: 'DELETE' }
        )
        if (!res.ok) throw new Error()
        setRelations(prev => prev.filter(r => r.relationship_id !== relation.relationship_id))
        success('Đã xóa liên kết sản phẩm')
      } catch {
        error('Lỗi', 'Không thể xóa liên kết này')
      }
    })
  }

  // Group by relationship type
  const grouped = RELATIONSHIP_TYPES
    .map(t => ({
      type: t,
      items: relations.filter(r => r.relationship_type === t.value),
    }))
    .filter(g => g.items.length > 0)

  const ungrouped = relations.filter(
    r => !RELATIONSHIP_TYPES.some(t => t.value === r.relationship_type)
  )

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Link2 className="w-4 h-4 text-emerald-600" />
            Sản phẩm liên quan
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {relations.length} liên kết · Giúp khách hàng khám phá thêm sản phẩm phù hợp
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowSearch(!showSearch)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 px-3 py-2 rounded-xl transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Thêm liên kết
        </button>
      </div>

      {/* Search Panel */}
      {showSearch && (
        <div className="border border-emerald-200 bg-emerald-50/30 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Tìm & thêm sản phẩm</p>
            <button
              type="button"
              onClick={() => { setShowSearch(false); setSearchQuery(''); setSearchResults([]) }}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Type selector */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Loại liên kết</label>
            <div className="flex flex-wrap gap-2">
              {RELATIONSHIP_TYPES.map(t => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setSelectedType(t.value)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
                    selectedType === t.value
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-300'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Search input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              ref={searchRef}
              type="text"
              value={searchQuery}
              onChange={e => handleSearch(e.target.value)}
              placeholder="Tìm theo tên sản phẩm, model, slug..."
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
            />
            {searching && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500 animate-spin" />
            )}
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-50 max-h-64 overflow-y-auto">
              {searchResults.map(product => (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => handleAddRelation(product)}
                  disabled={isPending}
                  className="w-full flex items-center gap-3 p-3 hover:bg-emerald-50 transition-colors text-left disabled:opacity-60 group"
                >
                  <div className="w-10 h-10 rounded-lg border border-slate-100 bg-slate-50 flex items-center justify-center relative overflow-hidden flex-shrink-0">
                    {product.thumbnail ? (
                      <Image src={product.thumbnail} alt={product.name} fill className="object-contain p-1" sizes="40px" />
                    ) : (
                      <Package className="w-5 h-5 text-slate-300" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-800 truncate group-hover:text-emerald-700">{product.name}</p>
                    <p className="text-[10px] text-slate-500">{product.brand_name}</p>
                  </div>
                  <Plus className="w-4 h-4 text-emerald-500 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          )}

          {searchQuery && !searching && searchResults.length === 0 && (
            <p className="text-xs text-slate-500 text-center py-3">
              Không tìm thấy sản phẩm nào phù hợp
            </p>
          )}
        </div>
      )}

      {/* Relations List */}
      {relations.length === 0 && !showSearch ? (
        <div className="border-2 border-dashed border-slate-200 rounded-2xl p-10 text-center">
          <Link2 className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-medium text-slate-500">Chưa có sản phẩm liên quan</p>
          <p className="text-xs text-slate-400 mt-1">Thêm các sản phẩm phụ kiện, tương thích hoặc có thể nâng cấp</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Grouped by type */}
          {grouped.map(({ type, items }) => (
            <div key={type.value}>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                {type.label} ({items.length})
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {items.map(rel => (
                  <RelationCard
                    key={rel.relationship_id}
                    relation={rel}
                    onRemove={handleRemoveRelation}
                    isPending={isPending}
                  />
                ))}
              </div>
            </div>
          ))}

          {/* Ungrouped */}
          {ungrouped.length > 0 && (
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Khác</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {ungrouped.map(rel => (
                  <RelationCard
                    key={rel.relationship_id}
                    relation={rel}
                    onRemove={handleRemoveRelation}
                    isPending={isPending}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Card Sub-component ───────────────────────────────────────────────────────

function RelationCard({
  relation,
  onRemove,
  isPending,
}: {
  relation: RelatedProduct
  onRemove: (r: RelatedProduct) => void
  isPending: boolean
}) {
  return (
    <div className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-xl hover:border-slate-300 transition-colors group">
      <div className="w-10 h-10 rounded-lg border border-slate-100 bg-slate-50 flex items-center justify-center relative overflow-hidden flex-shrink-0">
        {relation.related_thumbnail ? (
          <Image
            src={relation.related_thumbnail}
            alt={relation.related_name}
            fill
            className="object-contain p-1"
            sizes="40px"
          />
        ) : (
          <Package className="w-5 h-5 text-slate-300" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-slate-800 truncate">{relation.related_name}</p>
        <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
          {relation.related_brand && (
            <span className="text-[10px] text-slate-500">{relation.related_brand}</span>
          )}
          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${getTypeColor(relation.relationship_type)}`}>
            {getTypeLabel(relation.relationship_type)}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-1 flex-shrink-0">
        <a
          href={`/san-pham/${relation.related_slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
          title="Xem trang sản phẩm"
        >
          <ArrowRight className="w-3.5 h-3.5" />
        </a>
        <button
          type="button"
          onClick={() => onRemove(relation)}
          disabled={isPending}
          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
          title="Xóa liên kết"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}
