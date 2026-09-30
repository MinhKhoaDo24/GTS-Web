interface PriceDisplayProps {
  price: number | null | undefined
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export function PriceDisplay({
  price,
  size = 'md',
}: PriceDisplayProps) {
  const sizeClass = {
    sm: 'text-sm sm:text-base font-bold',
    md: 'text-base sm:text-lg font-extrabold',
    lg: 'text-xl sm:text-2xl font-black',
    xl: 'text-2xl sm:text-3xl font-black',
  }[size]

  if (!price || price === 0) {
    return (
      <span
        className="mt-2 inline-flex items-center font-bold text-[#1D4ED8] bg-blue-50/80 px-2.5 py-1 rounded-lg border border-blue-200 tracking-wide text-xs sm:text-sm"
      >
        Liên hệ báo giá
      </span>
    )
  }

  return (
    <span className={`text-[#1D4ED8] tracking-tight ${sizeClass}`}>
      {price.toLocaleString('vi-VN')}₫
    </span>
  )
}
