'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Upload, X, Loader2 } from 'lucide-react'

interface ImageUploaderProps {
  images: string[]
  onChange: (images: string[]) => void
}

export function ImageUploader({ images, onChange }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [manualUrl, setManualUrl] = useState('')

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    const newImages = [...images]

    for (let i = 0; i < files.length; i++) {
      const formData = new FormData()
      formData.append('file', files[i])

      try {
        const res = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData,
        })
        const data = await res.json()
        if (data.url) {
          newImages.push(data.url)
        }
      } catch (err) {
        console.error('Failed to upload', err)
      }
    }

    onChange(newImages)
    setUploading(false)
    e.target.value = ''
  }

  const handleAddManualUrl = (e: React.FormEvent) => {
    e.preventDefault()
    if (manualUrl.trim()) {
      onChange([...images, manualUrl.trim()])
      setManualUrl('')
    }
  }

  const handleRemove = (index: number) => {
    onChange(images.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {images.map((img, idx) => (
          <div
            key={idx}
            className="relative aspect-square rounded-xl border border-gray-200 overflow-hidden group bg-gray-50 flex items-center justify-center"
          >
            <Image
              src={img}
              alt={`Ảnh ${idx + 1}`}
              fill
              className="object-contain p-2"
              sizes="120px"
            />
            <button
              type="button"
              onClick={() => handleRemove(idx)}
              className="absolute top-1.5 right-1.5 bg-red-600 text-white rounded-lg p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
            >
              <X className="w-3.5 h-3.5" />
            </button>
            {idx === 0 && (
              <span className="absolute bottom-1.5 left-1.5 bg-[#1D4ED8] text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                Ảnh đại diện
              </span>
            )}
          </div>
        ))}

        {/* Upload box */}
        <label className="relative aspect-square border-2 border-dashed border-gray-300 hover:border-[#1D4ED8] rounded-xl flex flex-col items-center justify-center p-3 text-center cursor-pointer transition-colors bg-white">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileUpload}
            disabled={uploading}
            className="hidden"
          />
          {uploading ? (
            <Loader2 className="w-6 h-6 text-[#1D4ED8] animate-spin mb-1" />
          ) : (
            <Upload className="w-6 h-6 text-gray-400 mb-1" />
          )}
          <span className="text-[11px] font-medium text-gray-600">
            {uploading ? 'Đang tải...' : 'Tải ảnh lên'}
          </span>
          <span className="text-[9px] text-gray-400">PNG, JPG, WEBP</span>
        </label>
      </div>

      {/* Or manual URL */}
      <div className="flex gap-2">
        <input
          type="text"
          value={manualUrl}
          onChange={(e) => setManualUrl(e.target.value)}
          placeholder="Hoặc dán URL ảnh trực tiếp..."
          className="flex-1 text-xs border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-[#1D4ED8]"
        />
        <button
          type="button"
          onClick={handleAddManualUrl}
          className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-xs font-medium rounded-lg text-gray-700 transition-colors"
        >
          Thêm URL
        </button>
      </div>
    </div>
  )
}
