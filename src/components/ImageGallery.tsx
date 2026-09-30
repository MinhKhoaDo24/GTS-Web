'use client'

import { useState } from 'react'
import Image from 'next/image'

interface ImageGalleryProps {
  images: string[]
  productName: string
}

export function ImageGallery({ images, productName }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)

  if (!images || images.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-8 flex flex-col items-center justify-center aspect-square text-gray-400">
        <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center font-bold text-gray-400 mb-2">
          GTS
        </div>
        <span className="text-sm">Chưa có ảnh sản phẩm</span>
      </div>
    )
  }

  const currentImage = images[selectedIndex] || images[0]

  return (
    <div className="space-y-4">
      {/* Main Image Display */}
      <div className="relative aspect-square bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm flex items-center justify-center p-6">
        <Image
          src={currentImage}
          alt={`${productName} - Ảnh ${selectedIndex + 1}`}
          fill
          priority
          className="object-contain p-4"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              className={`relative w-20 h-20 flex-shrink-0 bg-white rounded-xl border-2 overflow-hidden transition-all ${
                selectedIndex === idx
                  ? 'border-[#1D4ED8] shadow-sm'
                  : 'border-gray-200 hover:border-gray-300 opacity-70 hover:opacity-100'
              }`}
            >
              <Image
                src={img}
                alt={`${productName} thumbnail ${idx + 1}`}
                fill
                className="object-contain p-1"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
