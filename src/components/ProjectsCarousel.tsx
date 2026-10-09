'use client'

import { useRef } from 'react'
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

  const scroll = (direction: 'prev' | 'next') => {
    const track = trackRef.current
    if (!track) return
    const firstCard = track.firstElementChild as HTMLElement | null
    const step = firstCard
      ? firstCard.offsetWidth + 24
      : track.clientWidth
    track.scrollBy({ left: direction === 'next' ? step : -step, behavior: 'smooth' })
  }

  return (
    <div className="relative">
      <div
        ref={trackRef}
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {projects.map((proj, idx) => (
          <div
            key={idx}
            className="group snap-start shrink-0 w-[80%] sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] bg-[#0b2875]/70 hover:bg-[#0b2875] rounded-2xl overflow-hidden border border-white/10 hover:border-[#38bdf8]/50 transition-all duration-300 flex flex-col"
          >
            <div className="relative aspect-[16/10] overflow-hidden bg-white/5">
              <Image
                src={proj.image}
                alt={proj.client}
                fill
                sizes="(max-width: 640px) 80vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wide text-white bg-[#061e52]/80 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/20">
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

      <div className="pointer-events-none absolute inset-0 z-20 hidden sm:flex items-center justify-between px-2">
        <button
          type="button"
          onClick={() => scroll('prev')}
          aria-label="Dự án trước"
          className="pointer-events-auto flex w-11 h-11 items-center justify-center rounded-full bg-white text-[#061e52] shadow-lg hover:bg-[#38bdf8] hover:text-white transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={() => scroll('next')}
          aria-label="Dự án tiếp theo"
          className="pointer-events-auto flex w-11 h-11 items-center justify-center rounded-full bg-white text-[#061e52] shadow-lg hover:bg-[#38bdf8] hover:text-white transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
