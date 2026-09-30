'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Phone,
  Mail,
  Search,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  ShieldCheck,
  Wifi,
  Network,
  PhoneCall,
  Video,
  Lock,
  Wrench,
  Package,
  Lightbulb,
  Settings,
  MapPin,
  Globe,
  Server,
  Cpu,
  ArrowRight,
  Layers,
  Sparkles,
  Building2,
  Newspaper,
  Boxes
} from 'lucide-react'
import type { Category, Brand, Domain, ProductSummary } from '@/types/database'
import {
  CATALOG_TAXONOMY,
  CategoryCatalogItem,
  BrandCatalogItem,
  ProductSeriesItem,
} from '@/lib/catalogTaxonomy'

interface SiteSettings {
  hotline?: string
  contact_email?: string
  address?: string
  company_name?: string
  warranty_lookup_url?: string
}

interface HeaderProps {
  settings: SiteSettings
  categories?: Category[]
  brands?: Brand[]
  domains?: Domain[]
  featuredProducts?: ProductSummary[]
}

const serviceItems = [
  { label: 'Tư vấn giải pháp mạng', href: '/dich-vu-tu-van', icon: Lightbulb, desc: 'Khảo sát & thiết kế tối ưu ngân sách' },
  { label: 'Triển khai & Cài đặt', href: '/dich-vu-trien-khai', icon: Settings, desc: 'Lắp đặt phần cứng & cấu hình chuẩn' },
  { label: 'Bảo trì định kỳ 24/7', href: '/dich-vu-bao-tri', icon: Wrench, desc: 'Cam kết SLA xử lý sự cố nhanh' },
  { label: 'Spare Part chính hãng', href: '/dich-vu-spare-part', icon: Package, desc: 'Linh kiện thay thế sẵn kho' },
]

const solutionItems = [
  { label: 'WiFi Doanh nghiệp', href: '/giai-phap-wifi', icon: Wifi, desc: 'Phủ sóng WiFi 6/6E mật độ cao' },
  { label: 'Mạng Core / LAN / WAN', href: '/giai-phap-mang', icon: Network, desc: 'Hạ tầng mạng tốc độ 10G/40G/100G' },
  { label: 'Bảo mật Firewall NGFW', href: '/giai-phap-bao-mat', icon: Lock, desc: 'Ngăn chặn tấn công & mã hóa dữ liệu' },
  { label: 'Tổng đài VoIP & Call Center', href: '/giai-phap-voip', icon: PhoneCall, desc: 'Tiết kiệm 60% cước gọi nội bộ' },
  { label: 'Hội nghị truyền hình', href: '/giai-phap-hoi-nghi', icon: Video, desc: 'Phòng họp thông minh 4K Teams/Zoom' },
]

// Helper render icon cho Cấp 1
function getCategoryIcon(iconName: string) {
  switch (iconName) {
    case 'Layers':
      return <Layers className="w-4 h-4 text-blue-600" />
    case 'Network':
      return <Network className="w-4 h-4 text-indigo-600" />
    case 'ShieldCheck':
      return <ShieldCheck className="w-4 h-4 text-emerald-600" />
    case 'Server':
      return <Server className="w-4 h-4 text-amber-600" />
    case 'Wifi':
      return <Wifi className="w-4 h-4 text-cyan-600" />
    case 'Cpu':
      return <Cpu className="w-4 h-4 text-purple-600" />
    default:
      return <Boxes className="w-4 h-4 text-blue-600" />
  }
}

export function Header({
  settings,
}: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [productMegaMenuOpen, setProductMegaMenuOpen] = useState(false)
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false)
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false)
  const [solutionsDropdownOpen, setSolutionsDropdownOpen] = useState(false)

  // Quản lý 3 cấp của Nav Sản Phẩm
  const [activeCatSlug, setActiveCatSlug] = useState<string>('switch')
  const [activeBrandSlug, setActiveBrandSlug] = useState<string>('cisco')

  // Quản lý Mobile Accordion
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null)
  const [mobileCatExpanded, setMobileCatExpanded] = useState<string | null>(null)
  const [mobileBrandExpanded, setMobileBrandExpanded] = useState<string | null>(null)

  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

  const productMenuRef = useRef<HTMLDivElement>(null)
  const catMenuRef = useRef<HTMLDivElement>(null)

  // Cấp 1 đang chọn
  const currentCategory: CategoryCatalogItem =
    CATALOG_TAXONOMY.find((c) => c.slug === activeCatSlug) || CATALOG_TAXONOMY[0]

  // Cấp 2 đang chọn
  const currentBrand: BrandCatalogItem =
    currentCategory.brands.find((b) => b.slug === activeBrandSlug) || currentCategory.brands[0]

  // Cấp 3: Dòng sản phẩm
  const currentSeriesList: ProductSeriesItem[] = currentBrand?.seriesList || []

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (productMenuRef.current && !productMenuRef.current.contains(event.target as Node)) {
        setProductMegaMenuOpen(false)
      }
      if (catMenuRef.current && !catMenuRef.current.contains(event.target as Node)) {
        setCategoryDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Khóa scroll khi mở mobile drawer
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/san-pham?q=${encodeURIComponent(searchQuery.trim())}`)
      setProductMegaMenuOpen(false)
      setCategoryDropdownOpen(false)
      setMobileOpen(false)
    }
  }

  // Hover Cấp 1 -> cập nhật Cấp 1 và tự động chọn hãng đầu tiên của Cấp 1
  const handleCategoryHover = (catSlug: string) => {
    setActiveCatSlug(catSlug)
    const cat = CATALOG_TAXONOMY.find((c) => c.slug === catSlug)
    if (cat && cat.brands.length > 0) {
      setActiveBrandSlug(cat.brands[0].slug)
    }
  }

  // Hover Cấp 2 -> cập nhật Cấp 2
  const handleBrandHover = (brandSlug: string) => {
    setActiveBrandSlug(brandSlug)
  }

  const toggleMobileMenu = (key: string) => {
    setMobileExpanded((prev) => (prev === key ? null : key))
  }

  const toggleMobileCat = (catSlug: string) => {
    setMobileCatExpanded((prev) => (prev === catSlug ? null : catSlug))
  }

  const toggleMobileBrand = (brandKey: string) => {
    setMobileBrandExpanded((prev) => (prev === brandKey ? null : brandKey))
  }

  const hotline = settings.hotline || '0901 234 567'
  const email = settings.contact_email || 'contact@gts.com.vn'
  const address = settings.address || 'Hà Nội & TP. Hồ Chí Minh'

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm transition-all">
      {/* ── TẦNG 1: TOP BAR (Dark Navy #0B1120) ──────────────────────────────── */}
      <div className="bg-[#0B1120] text-slate-300 text-xs py-2 border-b border-slate-800">
        <div className="layout-container flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="hidden lg:flex items-center gap-2 text-slate-300 font-medium">
              <MapPin className="w-3.5 h-3.5 text-[#38BDF8] flex-shrink-0" />
              <span className="truncate max-w-sm">{address}</span>
            </div>
            <div className="hidden md:flex items-center gap-2 text-slate-300">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>{email}</span>
            </div>
            <a
              href={`tel:${hotline.replace(/\s/g, '')}`}
              className="flex items-center gap-1.5 text-white font-bold hover:text-[#38BDF8] transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>
                Hotline: <strong className="text-amber-400">{hotline}</strong>
              </span>
            </a>
          </div>

          <div className="flex items-center gap-3 text-[11px] font-semibold tracking-wide text-slate-400">
            <div className="inline-flex items-center gap-1.5 bg-slate-800/80 hover:bg-slate-700 px-3 py-1 rounded-full text-slate-200 font-semibold text-[11px] cursor-pointer transition-colors border border-slate-700">
              <Globe className="w-3 h-3 text-[#38BDF8]" />
              <span>VIỆT NAM</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── TẦNG 2: MAIN HEADER (Logo + Nút Danh Mục + Search + Hotline) ─────── */}
      <div className="bg-white py-3 sm:py-3.5 border-b border-slate-200/80">
        <div className="layout-container flex items-center justify-between gap-4 lg:gap-8">
          {/* Logo GTS */}
          <Link href="/" className="flex items-center gap-3.5 flex-shrink-0 group">
            <div className="flex items-center justify-center overflow-hidden rounded-2xl group-hover:scale-105 transition-transform duration-300">
              <img
                src="/pic/logo_no_background.png"
                alt="GTS Logo"
                className="h-10 w-auto sm:h-11 object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl sm:text-[26px] font-black text-[#0F172A] tracking-tight group-hover:text-[#1D4ED8] transition-colors">
                Global Technology & Service
              </span>
              <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 tracking-wider uppercase">
                Find your true solution
              </span>
            </div>
          </Link>

          {/* Desktop Search Bar + Nút "Danh Mục" Cũ Nhanh */}
          <div className="hidden md:flex flex-1 max-w-3xl items-center gap-3">
            {/* Nút Danh mục nhanh */}
            <div className="relative" ref={catMenuRef}>
              <button
                type="button"
                onClick={() => setCategoryDropdownOpen((prev) => !prev)}
                className="inline-flex items-center gap-2 bg-[#1D4ED8] hover:bg-[#1E40AF] text-white px-5 py-3 rounded-full font-bold text-sm shadow-md shadow-blue-500/20 transition-all hover:scale-102 active:scale-98 whitespace-nowrap cursor-pointer"
              >
                <Menu className="w-4 h-4 text-white" />
                <span>Danh mục</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    categoryDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Dropdown Danh Mục nhanh theo 6 loại Cấp 1 */}
              {categoryDropdownOpen && (
                <div className="absolute top-full left-0 mt-3 w-80 bg-white rounded-3xl shadow-2xl border border-slate-100 p-4 z-50 animate-in fade-in-50 zoom-in-95 duration-200">
                  <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-slate-500 pb-2 border-b border-slate-100 mb-2">
                    <span>Phân loại thiết bị</span>
                    <span className="text-[10px] text-blue-600 lowercase font-medium">6 nhóm</span>
                  </div>
                  <div className="space-y-1">
                    <Link
                      href="/san-pham"
                      onClick={() => setCategoryDropdownOpen(false)}
                      className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-[#1D4ED8] bg-blue-50/80 hover:bg-blue-100 transition-colors"
                    >
                      <span>Tất cả thiết bị</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    {CATALOG_TAXONOMY.map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/san-pham?category=${cat.slug}`}
                        onClick={() => setCategoryDropdownOpen(false)}
                        className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-[#1D4ED8] transition-colors group"
                      >
                        <div className="flex items-center gap-2.5">
                          {getCategoryIcon(cat.icon)}
                          <span>{cat.shortName}</span>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#1D4ED8] transition-colors" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Input tìm kiếm */}
            <form onSubmit={handleSearch} className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Nhập tên sản phẩm, Model, mã P/N hoặc Series (VD: C9200, FG-60F, R750)..."
                className="w-full h-12 sm:h-12.5 pl-6 pr-14 text-sm font-medium text-slate-900 bg-slate-50 hover:bg-white focus:bg-white border-2 border-slate-200 hover:border-slate-300 focus:border-[#1D4ED8] rounded-full shadow-inner focus:outline-none focus:ring-4 focus:ring-blue-100/60 transition-all placeholder:text-slate-400"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 w-9.5 h-9.5 bg-[#1D4ED8] hover:bg-[#1E40AF] text-white rounded-full flex items-center justify-center shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
                title="Tìm kiếm"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Hotline Action */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href={`tel:${hotline.replace(/\s/g, '')}`}
              className="flex items-center gap-3 bg-slate-50 hover:bg-white border border-slate-200 hover:border-blue-300 px-4 py-2.5 rounded-2xl shadow-xs hover:shadow-md transition-all group"
            >
              <div className="w-10 h-10 text-black rounded-xl flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                <Phone className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-gray-800 uppercase tracking-wide">
                  Tư vấn báo giá
                </span>
                <span className="text-sm font-black text-[#0F172A] group-hover:text-[#1D4ED8] transition-colors">
                  {hotline}
                </span>
              </div>
            </a>
          </div>

          {/* Mobile Hamburger */}
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="md:hidden w-11 h-11 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-center text-slate-800 hover:text-[#1D4ED8] shadow-xs"
            aria-label="Mở menu mobile"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden layout-container mt-3">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm Model, P/N, tên thiết bị..."
              className="w-full h-11 pl-4 pr-12 text-sm bg-slate-50 border border-slate-200 rounded-full shadow-xs focus:outline-none focus:border-[#1D4ED8]"
            />
            <button
              type="submit"
              className="absolute right-1 top-1/2 -translate-y-1/2 w-9 h-9 bg-[#1D4ED8] text-white rounded-full flex items-center justify-center"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* ── TẦNG 3: SUB-NAVBAR CHÍNH (3 CẤP ĐỘ SẢN PHẨM & TRANG TIN TỨC) ───────── */}
      <nav className="hidden md:block bg-white border-b border-slate-200 shadow-xs">
        <div className="layout-container py-1">
          <div className="w-full flex items-center justify-between text-[15px] xl:text-[16px] font-bold text-slate-800">
            <div className="flex items-center gap-1 xl:gap-2">
              {/* 1. Trang chủ */}
              <Link
                href="/"
                className="px-3.5 xl:px-4.5 py-2.5 rounded-xl hover:bg-blue-50 hover:text-[#1D4ED8] transition-all whitespace-nowrap"
              >
                Trang chủ
              </Link>

              {/* 2. Giới thiệu */}
              <Link
                href="/gioi-thieu"
                className="px-3.5 xl:px-4.5 py-2.5 rounded-xl hover:bg-blue-50 hover:text-[#1D4ED8] transition-all whitespace-nowrap"
              >
                Giới thiệu
              </Link>

              {/* ── 3. SẢN PHẨM (MENU 3 CẤP ĐỘ HOÀN TOÀN MỚI) ────────────────── */}
              <div
                className="relative"
                ref={productMenuRef}
                onMouseEnter={() => setProductMegaMenuOpen(true)}
                onMouseLeave={() => setProductMegaMenuOpen(false)}
              >
                <Link
                  href="/san-pham"
                  onClick={() => setProductMegaMenuOpen(false)}
                  className={`inline-flex items-center gap-1.5 px-3.5 xl:px-4.5 py-2.5 rounded-xl transition-all whitespace-nowrap ${
                    productMegaMenuOpen
                      ? 'bg-blue-50 text-[#1D4ED8]'
                      : 'hover:bg-blue-50 hover:text-[#1D4ED8]'
                  }`}
                >
                  <span>Sản phẩm</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                      productMegaMenuOpen ? 'rotate-180 text-[#1D4ED8]' : ''
                    }`}
                  />
                </Link>

                {/* ── MEGA MENU 3 CẤP ĐỘ: CẤP 1 (LOẠI) -> CẤP 2 (HÃNG) -> CẤP 3 (DÒNG) ── */}
                {productMegaMenuOpen && (
                  <div className="absolute top-full left-0 mt-1 w-[960px] lg:w-[1040px] xl:w-[1100px] bg-white rounded-3xl shadow-[0_25px_70px_-15px_rgba(15,23,42,0.22)] border border-slate-200 overflow-hidden z-50 animate-in fade-in-50 slide-in-from-top-2 duration-200">
                    {/* Top Guide Bar */}
                    <div className="bg-slate-900 text-white px-6 py-2.5 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        <span className="font-semibold text-slate-200">
                          Danh mục sản phẩm
                        </span>
                      </div>
                      <Link
                        href="/san-pham"
                        onClick={() => setProductMegaMenuOpen(false)}
                        className="inline-flex items-center gap-1 text-[#38BDF8] hover:underline font-bold"
                      >
                        <span>Tất cả thiết bị</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>

                    {/* 3 Cột phân cấp: Cột 1 (Loại) | Cột 2 (Hãng) | Cột 3 (Dòng Series) */}
                    <div className="grid grid-cols-12 min-h-[420px]">
                      {/* ── CỘT 1: CẤP 1 - LOẠI SẢN PHẨM (3.2 / 12) ── */}
                      <div className="col-span-3 lg:col-span-3 border-r border-slate-200/80 bg-slate-50/70 p-4 flex flex-col justify-between">
                        <div>
                          <div className="px-2 pb-2.5 mb-2 border-b border-slate-200 flex items-center justify-between">
                            <span className="text-[11px] font-black uppercase tracking-wider text-slate-500">
                              Loại thiết bị
                            </span>
                            <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full font-bold">
                              {CATALOG_TAXONOMY.length}
                            </span>
                          </div>

                          <div className="space-y-1">
                            {CATALOG_TAXONOMY.map((cat) => {
                              const isSelected = cat.slug === activeCatSlug
                              return (
                                <div
                                  key={cat.id}
                                  onMouseEnter={() => handleCategoryHover(cat.slug)}
                                  className="relative"
                                >
                                  <Link
                                    href={`/san-pham?category=${cat.slug}`}
                                    onClick={() => setProductMegaMenuOpen(false)}
                                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs font-bold transition-all text-left group ${
                                      isSelected
                                        ? 'bg-[#1D4ED8] text-white shadow-md shadow-blue-500/25'
                                        : 'text-slate-700 hover:bg-white hover:text-[#1D4ED8]'
                                    }`}
                                  >
                                    <div className="flex items-center gap-2.5 truncate">
                                      <span className={isSelected ? 'text-white' : ''}>
                                        {getCategoryIcon(cat.icon)}
                                      </span>
                                      <span className="truncate">{cat.shortName}</span>
                                    </div>
                                    <ChevronRight
                                      className={`w-4 h-4 flex-shrink-0 transition-transform ${
                                        isSelected
                                          ? 'text-white translate-x-0.5'
                                          : 'text-slate-300 group-hover:text-[#1D4ED8]'
                                      }`}
                                    />
                                  </Link>
                                </div>
                              )
                            })}
                          </div>
                        </div>

                        {/* Direct CTA Cấp 1 */}
                        <div className="pt-3 border-t border-slate-200 px-1">
                          <Link
                            href={`/san-pham?category=${currentCategory.slug}`}
                            onClick={() => setProductMegaMenuOpen(false)}
                            className="text-[11px] font-bold text-[#1D4ED8] hover:underline flex items-center gap-1"
                          >
                            <span>Xem toàn bộ {currentCategory.shortName}</span>
                            <ArrowRight className="w-3 h-3" />
                          </Link>
                        </div>
                      </div>

                      {/* ── CỘT 2: CẤP 2 - HÃNG SẢN XUẤT (3.3 / 12) ── */}
                      <div className="col-span-3 lg:col-span-3 border-r border-slate-200/80 bg-white p-4 flex flex-col justify-between">
                        <div>
                          <div className="px-2 pb-2.5 mb-2 border-b border-slate-200 flex items-center justify-between">
                            <span className="text-[11px] font-black uppercase tracking-wider text-slate-500">
                              Hãng sản xuất
                            </span>
                            <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-full font-bold">
                              {currentCategory.brands.length} hãng
                            </span>
                          </div>

                          <div className="space-y-1">
                            {currentCategory.brands.map((brand) => {
                              const isSelected = brand.slug === activeBrandSlug
                              return (
                                <div
                                  key={brand.id}
                                  onMouseEnter={() => handleBrandHover(brand.slug)}
                                  className="relative"
                                >
                                  <Link
                                    href={`/san-pham?category=${currentCategory.slug}&brand=${brand.slug}`}
                                    onClick={() => setProductMegaMenuOpen(false)}
                                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs transition-all text-left group ${
                                      isSelected
                                        ? 'bg-blue-50 text-[#1D4ED8] font-black border border-blue-200 shadow-xs'
                                        : 'text-slate-700 hover:bg-slate-50 hover:text-[#1D4ED8] font-bold'
                                    }`}
                                  >
                                    <div className="truncate">
                                      <div className="truncate">{brand.name}</div>
                                      {brand.tagline && (
                                        <div
                                          className={`text-[10px] font-normal truncate mt-0.5 ${
                                            isSelected ? 'text-blue-600' : 'text-slate-400'
                                          }`}
                                        >
                                          {brand.tagline}
                                        </div>
                                      )}
                                    </div>
                                    <ChevronRight
                                      className={`w-4 h-4 flex-shrink-0 transition-transform ${
                                        isSelected
                                          ? 'text-[#1D4ED8] translate-x-0.5'
                                          : 'text-slate-300 group-hover:text-[#1D4ED8]'
                                      }`}
                                    />
                                  </Link>
                                </div>
                              )
                            })}
                          </div>
                        </div>

                        {/* Direct CTA Cấp 2 */}
                        <div className="pt-3 border-t border-slate-100 px-1">
                          <Link
                            href={`/san-pham?category=${currentCategory.slug}&brand=${currentBrand.slug}`}
                            onClick={() => setProductMegaMenuOpen(false)}
                            className="text-[11px] font-bold text-slate-600 hover:text-[#1D4ED8] flex items-center gap-1"
                          >
                            <span>Xem tất cả {currentBrand.name}</span>
                            <ArrowRight className="w-3 h-3" />
                          </Link>
                        </div>
                      </div>

                      {/* ── CỘT 3: CẤP 3 - DÒNG SẢN PHẨM / SERIES (5.5 / 12) ── */}
                      <div className="col-span-6 lg:col-span-6 bg-slate-50/50 p-4 sm:p-5 flex flex-col justify-between">
                        <div>
                          <div className="px-1 pb-2.5 mb-3 border-b border-slate-200 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] font-black uppercase tracking-wider text-slate-500">
                                Dòng sản phẩm
                              </span>
                            </div>
                            <span className="text-[11px] text-slate-400 font-medium">
                              {currentSeriesList.length} dòng máy
                            </span>
                          </div>

                          {/* Danh sách Series / Dòng sản phẩm */}
                          <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
                            {currentSeriesList.map((series) => (
                              <Link
                                key={series.id}
                                href={`/san-pham?category=${currentCategory.slug}&brand=${currentBrand.slug}&series=${series.slug}`}
                                onClick={() => setProductMegaMenuOpen(false)}
                                className="block p-3 rounded-2xl bg-white border border-slate-200/80 hover:border-blue-300 hover:shadow-md hover:shadow-blue-500/5 transition-all group"
                              >
                                <div className="flex items-start justify-between gap-2">
                                  <div>
                                    <div className="text-xs font-black text-slate-900 group-hover:text-[#1D4ED8] transition-colors flex items-center gap-1.5">
                                      <span>{series.name}</span>
                                    </div>
                                    {series.description && (
                                      <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5 font-medium">
                                        {series.description}
                                      </p>
                                    )}
                                  </div>
                                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#1D4ED8] group-hover:translate-x-1 transition-all flex-shrink-0 mt-0.5" />
                                </div>

                                {/* Model tiêu biểu */}
                                {series.popularModels && series.popularModels.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mt-2 pt-2 border-t border-slate-100">
                                    {series.popularModels.map((m, idx) => (
                                      <span
                                        key={idx}
                                        className="text-[10px] font-mono font-semibold bg-slate-100 group-hover:bg-blue-50 group-hover:text-blue-700 text-slate-600 px-2 py-0.5 rounded-md"
                                      >
                                        {m}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </Link>
                            ))}
                          </div>
                        </div>

                        {/* Footer Cột 3 */}
                        <div className="mt-3 pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                          <span className="text-[11px] text-slate-500 font-medium">
                            Đang xem: <strong className="text-slate-800">{currentCategory.shortName}</strong> →{' '}
                            <strong className="text-slate-800">{currentBrand.name}</strong>
                          </span>
                          <Link
                            href={`/san-pham?category=${currentCategory.slug}&brand=${currentBrand.slug}`}
                            onClick={() => setProductMegaMenuOpen(false)}
                            className="font-bold text-[#1D4ED8] hover:underline flex items-center gap-1"
                          >
                            <span>Xem thêm</span> 
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 4. Giải Pháp */}
              <div
                className="relative"
                onMouseEnter={() => setSolutionsDropdownOpen(true)}
                onMouseLeave={() => setSolutionsDropdownOpen(false)}
              >
                <Link
                  href="/giai-phap"
                  className={`inline-flex items-center gap-1.5 px-3.5 xl:px-4.5 py-2.5 rounded-xl transition-all whitespace-nowrap ${
                    solutionsDropdownOpen
                      ? 'bg-blue-50 text-[#1D4ED8]'
                      : 'hover:bg-blue-50 hover:text-[#1D4ED8]'
                  }`}
                >
                  <span>Giải pháp</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                      solutionsDropdownOpen ? 'rotate-180 text-[#1D4ED8]' : ''
                    }`}
                  />
                </Link>

                {solutionsDropdownOpen && (
                  <div className="absolute top-full left-0 mt-1 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2.5 z-50 animate-in fade-in-50 duration-200">
                    <div className="px-3 py-1.5 text-xs font-black uppercase tracking-wider text-slate-400 border-b border-slate-100 mb-1">
                      Giải pháp hạ tầng mạng
                    </div>
                    {solutionItems.map((sol, idx) => {
                      const Icon = sol.icon
                      return (
                        <Link
                          key={idx}
                          href={sol.href}
                          onClick={() => setSolutionsDropdownOpen(false)}
                          className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-blue-50 text-slate-800 hover:text-[#1D4ED8] transition-colors"
                        >
                          <div className="w-8 h-8 rounded-lg bg-green-100/60 text-[#22C55E] flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-sm font-bold">{sol.label}</div>
                            <div className="text-xs text-slate-500 font-normal line-clamp-1">{sol.desc}</div>
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* 5. Dịch Vụ */}
              <div
                className="relative"
                onMouseEnter={() => setServicesDropdownOpen(true)}
                onMouseLeave={() => setServicesDropdownOpen(false)}
              >
                <Link
                  href="/dich-vu"
                  className={`inline-flex items-center gap-1.5 px-3.5 xl:px-4.5 py-2.5 rounded-xl transition-all whitespace-nowrap ${
                    servicesDropdownOpen
                      ? 'bg-blue-50 text-[#1D4ED8]'
                      : 'hover:bg-blue-50 hover:text-[#1D4ED8]'
                  }`}
                >
                  <span>Dịch vụ</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                      servicesDropdownOpen ? 'rotate-180 text-[#1D4ED8]' : ''
                    }`}
                  />
                </Link>

                {servicesDropdownOpen && (
                  <div className="absolute top-full left-0 mt-1 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2.5 z-50 animate-in fade-in-50 duration-200">
                    <div className="px-3 py-1.5 text-xs font-black uppercase tracking-wider text-slate-400 border-b border-slate-100 mb-1">
                      Dịch vụ kỹ thuật Enterprise
                    </div>
                    {serviceItems.map((srv, idx) => {
                      const Icon = srv.icon
                      return (
                        <Link
                          key={idx}
                          href={srv.href}
                          onClick={() => setServicesDropdownOpen(false)}
                          className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-blue-50 text-slate-800 hover:text-[#1D4ED8] transition-colors"
                        >
                          <div className="w-8 h-8 rounded-lg bg-blue-100/60 text-[#1D4ED8] flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-sm font-bold">{srv.label}</div>
                            <div className="text-xs text-slate-500 font-normal line-clamp-1">{srv.desc}</div>
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* ── 6. TIN TỨC (MỚI THÊM VÀO HEADER THEO YÊU CẦU) ─────────── */}
              <Link
                href="/tin-tuc"
                className="px-3.5 xl:px-4.5 py-2.5 rounded-xl hover:bg-blue-50 hover:text-[#1D4ED8] transition-all whitespace-nowrap"
              >
                Tin tức
              </Link>

              {/* 7. Liên hệ */}
              <Link
                href="/lien-he"
                className="px-3.5 xl:px-4.5 py-2.5 rounded-xl hover:bg-blue-50 hover:text-[#1D4ED8] transition-all whitespace-nowrap"
              >
                Liên hệ
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ── MOBILE DRAWER NAVIGATION (HỖ TRỢ 3 CẤP ĐỘ SẢN PHẨM & TIN TỨC) ───── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative w-full max-w-xs sm:max-w-sm bg-white h-full shadow-2xl z-10 flex flex-col rounded-r-3xl overflow-y-auto">
            {/* Header Drawer */}
            <div className="p-5 bg-[#0B1120] text-white flex items-center justify-between">
              <span className="font-mono font-bold text-sm tracking-wider uppercase">
                GTS ENTERPRISE MENU
              </span>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Nav list */}
            <div className="p-4 space-y-1 text-sm font-semibold divide-y divide-slate-100">
              <div className="pb-2">
                <Link
                  href="/"
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2 rounded-xl text-slate-800 hover:bg-blue-50 hover:text-[#1D4ED8]"
                >
                  Trang chủ
                </Link>
              </div>

              {/* Sản phẩm Accordion 3 cấp độ */}
              <div className="py-2">
                <button
                  type="button"
                  onClick={() => toggleMobileMenu('products')}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-slate-800 font-bold hover:bg-slate-50 cursor-pointer"
                >
                  <span>Sản phẩm</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      mobileExpanded === 'products' ? 'rotate-180 text-[#1D4ED8]' : 'text-slate-400'
                    }`}
                  />
                </button>
                {mobileExpanded === 'products' && (
                  <div className="pl-3 space-y-2 pt-2 border-l-2 border-blue-200 ml-3">
                    <Link
                      href="/san-pham"
                      onClick={() => setMobileOpen(false)}
                      className="block py-1 text-xs font-black text-[#1D4ED8]"
                    >
                      → Xem tất cả sản phẩm
                    </Link>

                    {/* Cấp 1 trên mobile */}
                    {CATALOG_TAXONOMY.map((cat) => {
                      const isCatOpen = mobileCatExpanded === cat.slug
                      return (
                        <div key={cat.id} className="bg-slate-50 rounded-xl p-2 border border-slate-200/60">
                          <div className="flex items-center justify-between">
                            <Link
                              href={`/san-pham?category=${cat.slug}`}
                              onClick={() => setMobileOpen(false)}
                              className="text-xs font-black text-slate-800 hover:text-[#1D4ED8]"
                            >
                              {cat.name}
                            </Link>
                            <button
                              type="button"
                              onClick={() => toggleMobileCat(cat.slug)}
                              className="p-1 text-slate-400 hover:text-[#1D4ED8]"
                            >
                              <ChevronDown
                                className={`w-3.5 h-3.5 transition-transform ${
                                  isCatOpen ? 'rotate-180 text-[#1D4ED8]' : ''
                                }`}
                              />
                            </button>
                          </div>

                          {/* Cấp 2 trên mobile */}
                          {isCatOpen && (
                            <div className="mt-2 pt-2 border-t border-slate-200 pl-2 space-y-1.5">
                              {cat.brands.map((br) => {
                                const brandKey = `${cat.slug}-${br.slug}`
                                const isBrandOpen = mobileBrandExpanded === brandKey
                                return (
                                  <div key={br.id} className="bg-white rounded-lg p-1.5 border border-slate-200/60">
                                    <div className="flex items-center justify-between">
                                      <Link
                                        href={`/san-pham?category=${cat.slug}&brand=${br.slug}`}
                                        onClick={() => setMobileOpen(false)}
                                        className="text-[11px] font-bold text-slate-700 hover:text-[#1D4ED8]"
                                      >
                                        {br.name}
                                      </Link>
                                      <button
                                        type="button"
                                        onClick={() => toggleMobileBrand(brandKey)}
                                        className="p-1 text-slate-400 hover:text-[#1D4ED8]"
                                      >
                                        <ChevronDown
                                          className={`w-3 h-3 transition-transform ${
                                            isBrandOpen ? 'rotate-180 text-[#1D4ED8]' : ''
                                          }`}
                                        />
                                      </button>
                                    </div>

                                    {/* Cấp 3 trên mobile */}
                                    {isBrandOpen && (
                                      <div className="mt-1.5 pt-1.5 border-t border-slate-100 pl-2 space-y-1">
                                        {br.seriesList.map((ser) => (
                                          <Link
                                            key={ser.id}
                                            href={`/san-pham?category=${cat.slug}&brand=${br.slug}&series=${ser.slug}`}
                                            onClick={() => setMobileOpen(false)}
                                            className="block text-[10px] text-slate-600 hover:text-[#1D4ED8] py-0.5"
                                          >
                                            • {ser.name}
                                          </Link>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                )
                              })}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Giải pháp */}
              <div className="py-2">
                <button
                  type="button"
                  onClick={() => toggleMobileMenu('solutions')}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-slate-800 font-bold hover:bg-slate-50 cursor-pointer"
                >
                  <span>Giải pháp doanh nghiệp</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      mobileExpanded === 'solutions' ? 'rotate-180 text-[#1D4ED8]' : 'text-slate-400'
                    }`}
                  />
                </button>
                {mobileExpanded === 'solutions' && (
                  <div className="pl-4 space-y-1 pt-1 border-l-2 border-blue-100 ml-3">
                    {solutionItems.map((sol, idx) => (
                      <Link
                        key={idx}
                        href={sol.href}
                        onClick={() => setMobileOpen(false)}
                        className="block py-1.5 text-xs text-slate-600 hover:text-[#1D4ED8]"
                      >
                        {sol.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Dịch vụ */}
              <div className="py-2">
                <button
                  type="button"
                  onClick={() => toggleMobileMenu('services')}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-slate-800 font-bold hover:bg-slate-50 cursor-pointer"
                >
                  <span>Dịch vụ kỹ thuật</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      mobileExpanded === 'services' ? 'rotate-180 text-[#1D4ED8]' : 'text-slate-400'
                    }`}
                  />
                </button>
                {mobileExpanded === 'services' && (
                  <div className="pl-4 space-y-1 pt-1 border-l-2 border-blue-100 ml-3">
                    {serviceItems.map((srv, idx) => (
                      <Link
                        key={idx}
                        href={srv.href}
                        onClick={() => setMobileOpen(false)}
                        className="block py-1.5 text-xs text-slate-600 hover:text-[#1D4ED8]"
                      >
                        {srv.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Tin tức Mobile */}
              <div className="py-2">
                <Link
                  href="/tin-tuc"
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2 rounded-xl text-slate-800 hover:bg-blue-50 hover:text-[#1D4ED8]"
                >
                  Tin tức & Kiến thức
                </Link>
              </div>

              {/* Giới thiệu */}
              <div className="py-2">
                <Link
                  href="/gioi-thieu"
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2 rounded-xl text-slate-800 hover:bg-blue-50 hover:text-[#1D4ED8]"
                >
                  Về GTS
                </Link>
              </div>

              {/* Liên hệ */}
              <div className="py-2">
                <Link
                  href="/lien-he"
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2 rounded-xl text-slate-800 hover:bg-blue-50 hover:text-[#1D4ED8]"
                >
                  Liên hệ
                </Link>
              </div>
            </div>

            {/* Mobile Footer */}
            <div className="mt-auto p-4 bg-slate-50 border-t border-slate-200 space-y-2.5">
              <Link
                href="/lien-he?type=quote"
                onClick={() => setMobileOpen(false)}
                className="w-full bg-[#1D4ED8] text-white py-3 px-4 text-xs font-bold text-center block rounded-2xl shadow-sm uppercase tracking-wider"
              >
                Yêu cầu báo giá B2B
              </Link>
              <a
                href={`tel:${hotline.replace(/\s/g, '')}`}
                className="w-full bg-[#0F172A] text-white py-3 px-4 text-xs font-bold text-center block rounded-2xl"
              >
                Hotline: {hotline}
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
