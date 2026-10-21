'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export interface ProjectItem {
  client: string
  sector: string
  service: string
  image: string
}

export interface ProjectsCarouselProps {
  projects: ProjectItem[]
}

export function ProjectsCarousel({ projects }: ProjectsCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const directionRef = useRef<'next' | 'prev'>('next')
  const [isPaused, setIsPaused] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)

  // Tính toán chỉ số card hiện tại khi cuộn
  const updateActiveIndex = useCallback(() => {
    const track = trackRef.current
    if (!track) return

    const firstCard = track.firstElementChild as HTMLElement | null
    if (!firstCard) return

    const step = firstCard.offsetWidth + 24
    const newIndex = Math.round(track.scrollLeft / step)
    setActiveIndex(Math.min(Math.max(newIndex, 0), projects.length - 1))

    // Tự động nhận diện biên để đảo chiều dự phòng nếu người dùng tự vuốt/cuộn
    const maxScroll = track.scrollWidth - track.clientWidth - 10
    if (track.scrollLeft >= maxScroll) {
      directionRef.current = 'prev'
    } else if (track.scrollLeft <= 10) {
      directionRef.current = 'next'
    }
  }, [projects.length])

  // Lắng nghe sự kiện scroll trên track
  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    let rafId: number
    const onScroll = () => {
      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(updateActiveIndex)
    }

    track.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(rafId)
      track.removeEventListener('scroll', onScroll)
    }
  }, [updateActiveIndex])

  // Hàm chuyển slide bước 1 card theo hướng
  const scroll = useCallback(
    (direction: 'prev' | 'next') => {
      const track = trackRef.current
      if (!track) return

      const firstCard = track.firstElementChild as HTMLElement | null
      const step = firstCard ? firstCard.offsetWidth + 24 : track.clientWidth
      directionRef.current = direction
      track.scrollBy({ left: direction === 'next' ? step : -step, behavior: 'smooth' })
    },
    []
  )

  // Nhảy tới card cụ thể khi click dot
  const scrollToCard = (index: number) => {
    const track = trackRef.current
    if (!track) return

    const firstCard = track.firstElementChild as HTMLElement | null
    const step = firstCard ? firstCard.offsetWidth + 24 : track.clientWidth
    track.scrollTo({ left: index * step, behavior: 'smooth' })
    setActiveIndex(index)

    if (index >= projects.length - 1) {
      directionRef.current = 'prev'
    } else if (index === 0) {
      directionRef.current = 'next'
    }
  }

  // Tự động chuyển card mỗi 5s, khi tới cuối thì tự chuyển ngược lại (ping-pong)
  useEffect(() => {
    if (projects.length <= 1 || isPaused) return

    const interval = setInterval(() => {
      const track = trackRef.current
      if (!track) return

      const firstCard = track.firstElementChild as HTMLElement | null
      const step = firstCard ? firstCard.offsetWidth + 24 : track.clientWidth
      const maxScroll = track.scrollWidth - track.clientWidth - 15

      if (directionRef.current === 'next') {
        // Nếu đã ở cuối hoặc bước tiếp theo vượt cuối -> đảo chiều sang 'prev'
        if (track.scrollLeft >= maxScroll) {
          directionRef.current = 'prev'
          track.scrollBy({ left: -step, behavior: 'smooth' })
        } else {
          track.scrollBy({ left: step, behavior: 'smooth' })
          if (track.scrollLeft + step >= maxScroll) {
            directionRef.current = 'prev'
          }
        }
      } else {
        // Hướng 'prev': nếu đã ở đầu hoặc bước lùi vượt đầu -> đảo chiều sang 'next'
        if (track.scrollLeft <= 15) {
          directionRef.current = 'next'
          track.scrollBy({ left: step, behavior: 'smooth' })
        } else {
          track.scrollBy({ left: -step, behavior: 'smooth' })
          if (track.scrollLeft - step <= 15) {
            directionRef.current = 'next'
          }
        }
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [isPaused, projects.length])

  return (
    <div
      className="relative group/carousel"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      {/* Vùng danh sách card dự án */}
      <div
        ref={trackRef}
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {projects.map((proj, idx) => (
          <div
            key={idx}
            className="group snap-start shrink-0 w-[85%] sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] bg-[#0b2875]/70 hover:bg-[#0b2875] rounded-2xl overflow-hidden border border-white/10 hover:border-[#38bdf8]/50 transition-all duration-300 flex flex-col shadow-lg"
          >
            <div className="relative aspect-[16/10] overflow-hidden bg-white/5">
              <Image
                src={proj.image}
                alt={proj.client}
                fill
                sizes="(max-width: 640px) 85vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wide text-white bg-[#061e52]/85 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/20">
                {proj.sector}
              </span>
            </div>

            <div className="p-5 flex flex-col flex-1">
              <h3 className="text-sm font-bold text-white leading-snug mb-2 line-clamp-2 min-h-[2.5rem]">
                {proj.client}
              </h3>
              <p className="text-xs text-slate-300/90 leading-relaxed line-clamp-3">
                {proj.service}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Nút điều hướng trước / sau */}
      <div className="pointer-events-none absolute inset-y-0 -left-2 -right-2 sm:-left-5 sm:-right-5 z-20 hidden sm:flex items-center justify-between">
        <button
          type="button"
          onClick={() => scroll('prev')}
          aria-label="Dự án trước"
          className="pointer-events-auto flex w-11 h-11 items-center justify-center rounded-full bg-white/90 hover:bg-white text-[#061e52] shadow-xl hover:text-[#0077CC] hover:scale-110 active:scale-95 transition-all backdrop-blur-sm"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={() => scroll('next')}
          aria-label="Dự án tiếp theo"
          className="pointer-events-auto flex w-11 h-11 items-center justify-center rounded-full bg-white/90 hover:bg-white text-[#061e52] shadow-xl hover:text-[#0077CC] hover:scale-110 active:scale-95 transition-all backdrop-blur-sm"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Dot indicators căn giữa tinh tế */}
      <div className="mt-5 flex items-center justify-center gap-2">
        {projects.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => scrollToCard(idx)}
            aria-label={`Chuyển đến dự án ${idx + 1}`}
            className={`h-2 rounded-full transition-all duration-300 ${
              activeIndex === idx
                ? 'w-6 bg-[#38bdf8] shadow-sm shadow-[#38bdf8]/50'
                : 'w-2 bg-white/30 hover:bg-white/60'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

