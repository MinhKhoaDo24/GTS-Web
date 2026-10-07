'use client'

import { useState, useCallback, useTransition } from 'react'
import Image from 'next/image'
import {
  ImageIcon, Upload, Trash2, Star, StarOff,
  GripVertical, Loader2, Plus, Link2, X, CheckCircle2
} from 'lucide-react'
import { useToast } from '@/components/admin/ui/Toast'
import type { ProductImage } from '@/lib/dal/product-extras'

interface GalleryManagerProps {
  productId: string
  initialImages: ProductImage[]
}

export function GalleryManager({ productId, initialImages }: GalleryManagerProps) {
  const { success, error } = useToast()
  const [isPending, startTransition] = useTransition()
  const [images, setImages] = useState<ProductImage[]>(initialImages)
  const [uploading, setUploading] = useState(false)
  const [urlInput, setUrlInput] = useState('')
  const [showUrlInput, setShowUrlInput] = useState(false)

  const refreshImages = useCallback(async () => {
    const res = await fetch(`/api/v2/admin/products/${productId}/images`)
    if (res.ok) {
      const json = await res.json()
      setImages(json.data ?? [])
    }
  }, [productId])

  // Upload file
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    let addedCount = 0

    for (let i = 0; i < files.length; i++) {
      const formData = new FormData()
      formData.append('file', files[i])

      try {
        const uploadRes = await fetch('/api/admin/upload', { method: 'POST', body: formData })
        const uploadData = await uploadRes.json()
        if (!uploadData.url) continue

        const res = await fetch(`/api/v2/admin/products/${productId}/images`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            image_url: uploadData.url,
            image_type: 'gallery',
            is_primary: images.length === 0 && i === 0, // Ảnh đầu tiên làm primary
            sort_order: images.length + i,
          }),
        })
        if (res.ok) addedCount++
      } catch (err) {
        console.error('Upload failed:', err)
      }
    }

    e.target.value = ''
    setUploading(false)
    await refreshImages()
    if (addedCount > 0) success(`Đã thêm ${addedCount} ảnh vào gallery`)
  }

  // Add URL manually
  const handleAddUrl = async () => {
    if (!urlInput.trim()) return
    try {
      const res = await fetch(`/api/v2/admin/products/${productId}/images`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image_url: urlInput.trim(),
          image_type: 'gallery',
          is_primary: images.length === 0,
          sort_order: images.length,
        }),
      })
      if (!res.ok) throw new Error()
      setUrlInput('')
      setShowUrlInput(false)
      await refreshImages()
      success('Đã thêm ảnh từ URL')
    } catch {
      error('Lỗi', 'Không thể thêm ảnh này')
    }
  }

  // Set primary
  const handleSetPrimary = (img: ProductImage) => {
    if (img.is_primary) return
    startTransition(async () => {
      const res = await fetch(`/api/v2/admin/products/${productId}/images`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_id: img.id, is_primary: true, product_id: productId }),
      })
      if (res.ok) {
        await refreshImages()
        success('Đã đặt ảnh đại diện')
      } else {
        error('Lỗi', 'Không thể đặt ảnh đại diện')
      }
    })
  }

  // Delete image
  const handleDelete = (img: ProductImage) => {
    startTransition(async () => {
      const res = await fetch(
        `/api/v2/admin/products/${productId}/images?imageId=${img.id}`,
        { method: 'DELETE' }
      )
      if (res.ok) {
        setImages(prev => prev.filter(i => i.id !== img.id))
        success('Đã xóa ảnh')
      } else {
        error('Lỗi', 'Không thể xóa ảnh này')
      }
    })
  }

  const primaryImage = images.find(i => i.is_primary) ?? images[0]
  const galleryImages = images.filter(i => i.id !== primaryImage?.id)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-blue-600" />
            Gallery ảnh sản phẩm
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {images.length} ảnh · Ảnh có dấu ⭐ là ảnh đại diện chính
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setShowUrlInput(!showUrlInput)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-xl transition-colors"
          >
            <Link2 className="w-3.5 h-3.5" />
            Thêm URL
          </button>
          <label className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-xl cursor-pointer transition-colors">
            <Upload className="w-3.5 h-3.5" />
            {uploading ? 'Đang tải...' : 'Upload ảnh'}
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileUpload}
              disabled={uploading}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* URL Input */}
      {showUrlInput && (
        <div className="flex gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
          <input
            type="url"
            value={urlInput}
            onChange={e => setUrlInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAddUrl()}
            placeholder="https://example.com/image.jpg"
            className="flex-1 text-sm bg-white border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
            autoFocus
          />
          <button
            type="button"
            onClick={handleAddUrl}
            className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors"
          >
            Thêm
          </button>
          <button
            type="button"
            onClick={() => { setShowUrlInput(false); setUrlInput('') }}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Images Grid */}
      {images.length === 0 ? (
        <div className="border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center">
          <ImageIcon className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-sm font-medium text-slate-500">Chưa có ảnh nào</p>
          <p className="text-xs text-slate-400 mt-1">Upload ảnh hoặc thêm URL để bắt đầu</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Primary Image */}
          {primaryImage && (
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Ảnh đại diện
              </p>
              <div className="relative group rounded-2xl overflow-hidden border-2 border-blue-200 bg-slate-50 aspect-video max-w-sm">
                <Image
                  src={primaryImage.image_url}
                  alt={primaryImage.alt_text ?? 'Primary image'}
                  fill
                  className="object-contain p-4"
                  sizes="(max-width: 768px) 100vw, 400px"
                />
                <div className="absolute top-2 left-2 flex gap-1.5">
                  <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    Ảnh đại diện
                  </span>
                </div>
                {/* Overlay actions */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleDelete(primaryImage)}
                    disabled={isPending}
                    className="p-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50"
                    title="Xóa ảnh này"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Gallery Grid */}
          {galleryImages.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Gallery ({galleryImages.length} ảnh)
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3">
                {galleryImages.map((img) => (
                  <div
                    key={img.id}
                    className="relative group aspect-square rounded-xl border border-slate-200 overflow-hidden bg-slate-50"
                  >
                    <Image
                      src={img.image_url}
                      alt={img.alt_text ?? 'Gallery image'}
                      fill
                      className="object-contain p-2"
                      sizes="120px"
                    />

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleSetPrimary(img)}
                        disabled={isPending}
                        className="p-1.5 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors disabled:opacity-50"
                        title="Đặt làm ảnh đại diện"
                      >
                        <Star className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(img)}
                        disabled={isPending}
                        className="p-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                        title="Xóa"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}

                {/* Upload placeholder */}
                <label className="aspect-square border-2 border-dashed border-slate-300 hover:border-blue-400 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors bg-white group">
                  {uploading ? (
                    <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                  ) : (
                    <>
                      <Plus className="w-5 h-5 text-slate-400 group-hover:text-blue-500 transition-colors" />
                      <span className="text-[10px] text-slate-400 group-hover:text-blue-500 mt-1 transition-colors">Thêm ảnh</span>
                    </>
                  )}
                  <input type="file" accept="image/*" multiple onChange={handleFileUpload} disabled={uploading} className="hidden" />
                </label>
              </div>
            </div>
          )}
        </div>
      )}

      {(isPending || uploading) && (
        <div className="flex items-center gap-2 text-xs text-blue-600 bg-blue-50 px-3 py-2 rounded-lg">
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          <span>Đang xử lý...</span>
        </div>
      )}
    </div>
  )
}
