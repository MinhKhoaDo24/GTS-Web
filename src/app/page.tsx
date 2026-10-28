import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { query } from '@/lib/db'
import type { Brand, SiteSetting, Customer, Partner } from '@/types/database'
import { ProductCard, type ProductItem } from '@/components/ProductCard'
import { ProjectsCarousel, type ProjectItem } from '@/components/ProjectsCarousel'
import { Reveal } from '@/components/Reveal'
import {
  CiscoLogo,
  FortinetLogo,
  HpeArubaLogo,
  DellLogo,
  UbiquitiLogo,
  RuijieLogo,
  MikrotikLogo,
  GrandstreamLogo,
  JuniperLogo,
  ApcLogo,
  VietcombankLogo,
  MbBankLogo,
  VingroupLogo,
  LgInnotekLogo,
  ViettelLogo,
  FptLogo,
  DecathlonLogo,
  PetrovietnamLogo,
  VinmecLogo,
  MuongThanhLogo,
} from '@/components/BrandLogos'
import {
  ArrowRight,
  Headphones,
  Truck,
  Award,
  CheckCircle2,
  PhoneCall,
  Server,
  Building2,
  Layers,
  ChevronRight,
  Sparkles
} from 'lucide-react'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Trang chủ | GTS - Global Technology & Service',
  description:
    'GTS cung cấp thiết bị mạng doanh nghiệp chính hãng: Switch, Router, Firewall, WiFi Access Point, Máy chủ & Lưu trữ. Đối tác chiến lược của Cisco, Fortinet, HPE, Dell, Ubiquiti.',
}

/** 8 Nhóm thiết bị phần cứng chủ lực của GTS */
const hardwareCategories = [
  {
    id: 'switch',
    title: 'Switch',
    image: '/pic/Categories/c9200l-48t-4x-e.jpg',
    href: '/san-pham?search=Switch',
    badge: 'Switching',
  },
  {
    id: 'router',
    title: 'Router',
    image: '/pic/Categories/ccr2116-12g-4s.jpg',
    href: '/san-pham?search=Router',
    badge: 'Routing',
  },
  {
    id: 'firewall',
    title: 'Firewall',
    image: '/pic/Categories/fg-90g.jpg',
    href: '/san-pham?search=Firewall',
    badge: 'Security',
  },
  {
    id: 'wifi',
    title: 'WiFi & Access Point',
    image: '/pic/Categories/access-point-aruba-instant-on-ap22-r4w02a-2x2-wi-fi-6-indoor.jpg',
    href: '/san-pham?search=WiFi',
    badge: 'Wireless',
  },
  {
    id: 'server',
    title: 'Máy Chủ (Server)',
    image: '/pic/Categories/dell-PowerEdge-R350.jpg',
    href: '/san-pham?search=Server',
    badge: 'Compute',
  },
  {
    id: 'storage',
    title: 'Hệ Thống Lưu Trữ (SAN/NAS)',
    image: '/pic/Categories/Synology%20DiskStation%20DS423+.jpg',
    href: '/san-pham?search=Storage',
    badge: 'Storage',
  },
  {
    id: 'transceiver',
    title: 'Module Quang & Phụ Kiện',
    image: '/pic/Categories/1788971321module-quang-cisco-glc-sx-mmd.jpg',
    href: '/san-pham?search=Module',
    badge: 'Cabling & Optics',
  },
  {
    id: 'voip',
    title: 'Tổng Đài IP & Hội Nghị',
    image: '/pic/Categories/Dien-thoai-khong-day-DECT-Yealink-W73P-2.jpg',
    href: '/san-pham?search=VoIP',
    badge: 'Unified Comms',
  },
]

/** Danh sách đối tác công nghệ mặc định khi CSDL chưa có dữ liệu ảnh (logo SVG hardcode) */
const fallbackPartners = [
  { id: 'cisco', name: 'Cisco Systems', logo: '/pic/brands/cisco.svg', Logo: CiscoLogo },
  { id: 'fortinet', name: 'Fortinet', logo: '/pic/brands/fortinet.svg', Logo: FortinetLogo },
  { id: 'hpe', name: 'HPE Aruba', logo: '/pic/brands/hpe.svg', Logo: HpeArubaLogo },
  { id: 'dell', name: 'Dell Technologies', logo: '/pic/brands/dell.svg', Logo: DellLogo },
  { id: 'ubiquiti', name: 'Ubiquiti Networks', logo: '/pic/brands/ubiquiti.svg', Logo: UbiquitiLogo },
  { id: 'ruijie', name: 'Ruijie Reyee', logo: null, Logo: RuijieLogo },
  { id: 'mikrotik', name: 'MikroTik', logo: '/pic/brands/mikrotik.svg', Logo: MikrotikLogo },
  { id: 'grandstream', name: 'Grandstream', logo: null, Logo: GrandstreamLogo },
  { id: 'juniper', name: 'Juniper Networks', logo: '/pic/brands/juniper.svg', Logo: JuniperLogo },
  { id: 'apc', name: 'APC Schneider', logo: '/pic/brands/apc.png', Logo: ApcLogo },
]

/** Danh sách khách hàng tiêu biểu mặc định khi CSDL chưa có dữ liệu ảnh */
/** Danh sách khách hàng tiêu biểu mặc định khi CSDL chưa có dữ liệu ảnh (logo SVG hardcode) */
const fallbackCustomers = [
  { id: 'vcb', name: 'Vietcombank', logo: '/pic/brands/vietcombank.svg', Logo: VietcombankLogo },
  { id: 'mbbank', name: 'MB Bank', logo: '/pic/brands/mbbank.png', Logo: MbBankLogo },
  { id: 'vingroup', name: 'Tập đoàn Vingroup', logo: '/pic/brands/vingroup.svg', Logo: VingroupLogo },
  { id: 'lginnotek', name: 'LG Innotek', logo: '/pic/brands/lginnotek.svg', Logo: LgInnotekLogo },
  { id: 'viettel', name: 'Viettel Telecom', logo: '/pic/brands/viettel.svg', Logo: ViettelLogo },
  { id: 'fpt', name: 'FPT Software', logo: '/pic/brands/fpt.svg', Logo: FptLogo },
  { id: 'decathlon', name: 'Decathlon', logo: '/pic/brands/decathlon.svg', Logo: DecathlonLogo },
  { id: 'petro', name: 'PetroVietnam', logo: '/pic/brands/petrovietnam.svg', Logo: PetrovietnamLogo },
  { id: 'vinmec', name: 'Vinmec Healthcare', logo: null, Logo: VinmecLogo },
  { id: 'muongthanh', name: 'Mường Thanh Group', logo: null, Logo: MuongThanhLogo },
]

/** Danh sách 4 dịch vụ doanh nghiệp */
const featuredServices = [
  {
    id: 'dich-vu-tu-van',
    title: 'Tư Vấn & Thiết Kế Hạ Tầng',
    desc: 'Khảo sát hiện trạng, lập báo cáo phân tích tải, thiết kế sơ đồ topo mạng dự phòng HA và chọn lựa cấu hình phần cứng tối ưu chi phí.',
    tag: 'Consulting & Design',
    href: '/dich-vu/dich-vu-tu-van',
    points: ['Thiết kế sơ đồ mạng HA / Redundant', 'Khảo sát sóng Heatmap WiFi chuyên nghiệp', 'Tối ưu TCO & Chi phí đầu tư dự án'],
  },
  {
    id: 'dich-vu-trien-khai',
    title: 'Triển Khai & Cấu Hình Chuyên Sâu',
    desc: 'Lắp đặt vật lý chuẩn Rack, cấu hình nâng cao VLAN, OSPF, BGP, SD-WAN, Firewall Security Policy và kiểm thử PoC trước bàn giao.',
    tag: 'Implementation',
    href: '/dich-vu/dich-vu-trien-khai',
    points: ['Cấu hình Switch L2/L3, Router, Firewall', 'Tích hợp xác thực 802.1X, Radius, AD', 'Đo kiểm thông lượng và bàn giao As-Built'],
  },
  {
    id: 'dich-vu-bao-tri',
    title: 'Bảo Trì Định Kỳ & Giám Sát SLA',
    desc: 'Hợp đồng bảo trì định kỳ, nâng cấp firmware bản vá bảo mật, sao lưu cấu hình định kỳ và cam kết thời gian phản hồi SLA từ 2h - 4h.',
    tag: 'Maintenance & SLA',
    href: '/dich-vu/dich-vu-bao-tri',
    points: ['Giám sát cảnh báo trạng thái thiết bị 24/7', 'Cập nhật firmware & Bản vá lỗ hổng zero-day', 'Báo cáo định kỳ sức khỏe hệ thống mạng'],
  },
  {
    id: 'dich-vu-spare-part',
    title: 'Linh Kiện Thay Thế (Spare Part) & RMA',
    desc: 'Dịch vụ lưu kho thiết bị dự phòng thay thế khẩn cấp trong vòng 4h, dịch vụ ủy quyền RMA 1-đổi-1 chính hãng cho các dòng sản phẩm trọng yếu.',
    tag: 'Spare Part & RMA',
    href: '/dich-vu/dich-vu-spare-part',
    points: ['Kho spare part sẵn sàng tại Hà Nội & HCM', 'Hỗ trợ thiết bị mượn tương đương khi bảo hành', 'Xử lý thủ tục RMA chính hãng nhanh chóng'],
  },
]

async function getHomeData() {
  try {
    const [rawProducts, brands, partners, customers, settingsArr] = await Promise.all([
      query<{
        id: string
        name: string
        slug: string
        model: string | null
        thumbnail: string | null
        product_type: string
        brand_name: string
        brand_slug: string
        category_name: string
        category_slug: string
        part_number: string | null
        sku: string | null
        specs_summary: string | null
        short_description: string | null
        lifecycle_status: string | null
      }>(
        `SELECT 
           p.id, p.name, p.slug, p.model, p.thumbnail, p.product_type, p.short_description,
           b.name as brand_name, b.slug as brand_slug,
           c.name as category_name, c.slug as category_slug,
           (SELECT pv.part_number FROM product_variants pv WHERE pv.product_id = p.id AND pv.is_active = true ORDER BY pv.id ASC LIMIT 1) as part_number,
           (SELECT pv.sku FROM product_variants pv WHERE pv.product_id = p.id AND pv.is_active = true ORDER BY pv.id ASC LIMIT 1) as sku,
           COALESCE(
             (SELECT string_agg(s.name || ': ' || COALESCE(ps.value_text, ps.value_number::text || COALESCE(' ' || ps.unit_override, ' ' || s.unit, ''), CASE WHEN ps.value_boolean = true THEN 'Có' WHEN ps.value_boolean = false THEN 'Không' ELSE NULL END, ps.min_value::text || ' - ' || ps.max_value::text || COALESCE(' ' || ps.unit_override, ' ' || s.unit, ''), ''), ' • ')
              FROM product_specifications ps
              JOIN specifications s ON ps.specification_id = s.id
              WHERE ps.product_id = p.id
              AND (ps.value_text IS NOT NULL OR ps.value_number IS NOT NULL OR ps.value_boolean IS NOT NULL OR ps.min_value IS NOT NULL)),
             (SELECT pv.specifications_summary FROM product_variants pv WHERE pv.product_id = p.id AND pv.is_active = true ORDER BY pv.id ASC LIMIT 1)
           ) as specs_summary,
           (SELECT pl.status FROM product_lifecycle pl WHERE pl.product_id = p.id LIMIT 1) as lifecycle_status
         FROM products p
         JOIN brands b ON p.brand_id = b.id
         JOIN categories c ON p.category_id = c.id
         WHERE p.is_active = true AND p.is_featured = true
         ORDER BY p.created_at DESC
         LIMIT 8`
      ),
      query<Brand>('SELECT id, name, slug, logo, website FROM brands WHERE is_active = true ORDER BY sort_order ASC, name ASC'),
      query<Partner>('SELECT id, name, slug, logo, website, description, partner_type FROM partners WHERE is_active = true ORDER BY is_featured DESC, name ASC').catch(() => []),
      query<Customer>('SELECT id, name, slug, logo, website, industry, description FROM customers WHERE is_active = true ORDER BY is_featured DESC, name ASC').catch(() => []),
      query<SiteSetting>('SELECT key, value FROM site_settings'),
    ])

    const featuredProducts: ProductItem[] = rawProducts.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      model: p.model,
      thumbnail: p.thumbnail,
      part_number: p.part_number,
      sku: p.sku,
      product_type: p.product_type,
      specs_summary: p.specs_summary || p.short_description || null,
      lifecycle_status: p.lifecycle_status || 'active',
      brand: { name: p.brand_name, slug: p.brand_slug },
      category: { name: p.category_name, slug: p.category_slug },
    }))

    const settings: Record<string, string> = Object.fromEntries(
      settingsArr.map((s) => [s.key, s.value ?? ''])
    )

    return { featuredProducts, brands, partners, customers, settings }
  } catch {
    return {
      featuredProducts: [] as ProductItem[],
      brands: [] as Brand[],
      partners: [] as Partner[],
      customers: [] as Customer[],
      settings: {},
    }
  }
}

/** Dự án tiêu biểu (nguồn: HSNL GTS 2026, ảnh: public/pic/Project) */
const featuredProjects: ProjectItem[] = [
  {
    client: 'CÔNG TY TNHH PIAGGIO VIỆT NAM',
    sector: 'Sản xuất',
    service:
      'Cung cấp và triển khai lắp đặt hạ tầng, cấu hình hệ thống thiết bị mạng cho nhà máy qua 3 dự án liên tiếp — đảm bảo mạng sản xuất vận hành ổn định, liên tục.',
    image: '/pic/Project/CÔNG TY TNHH PIAGGIO VIỆT NAM.jpg',
  },
  {
    client: 'NGÂN HÀNG THƯƠNG MẠI CỔ PHẦN TIÊN PHONG',
    sector: 'Tài chính',
    service:
      'Cung cấp phần mềm và dịch vụ đánh giá an ninh bảo mật, rà soát lỗ hổng và tăng cường phòng thủ cho hệ thống CNTT ngân hàng số.',
    image: '/pic/Project/NGÂN HÀNG THƯƠNG MẠI CỔ PHẦN TIÊN PHONG.jpg',
  },
  {
    client: 'NGÂN HÀNG NCB',
    sector: 'Tài chính',
    service:
      'Tư vấn và triển khai giải pháp hệ thống mạng ngân hàng, tối ưu hạ tầng truyền dẫn cho giao dịch liên tục và an toàn giữa các chi nhánh.',
    image: '/pic/Project/NGÂN HÀNG NCB.jpg',
  },
  {
    client: 'TẬP ĐOÀN BẢO VIỆT',
    sector: 'Bảo hiểm',
    service:
      'Dịch vụ bảo hành, giám sát và duy trì hệ thống thiết bị mạng, đảm bảo khả năng sẵn sàng cao cho hạ tầng CNTT toàn tập đoàn.',
    image: '/pic/Project/TẬP ĐOÀN BẢO VIỆT.jpg',
  },
  {
    client: 'CÔNG TY TNHH LG DISPLAY VIỆT NAM HẢI PHÒNG',
    sector: 'FDI / Nhà máy',
    service:
      'Cung cấp và bảo hành hệ thống thiết bị mạng cho tổ hợp nhà máy, đáp ứng yêu cầu vận hành khắt khe của môi trường sản xuất công nghệ cao.',
    image: '/pic/Project/CÔNG TY TNHH LG DISPLAY VIỆT NAM HẢI PHÒNG.jpg',
  },
  {
    client: 'TẬP ĐOÀN ĐIỆN LỰC VIỆT NAM',
    sector: 'Năng lượng',
    service:
      'Tích hợp hệ thống Switch và Wi-Fi, mở rộng vùng phủ sóng và nâng cấp mạng lõi phục vụ công tác quản lý, vận hành nội bộ.',
    image: '/pic/Project/TẬP ĐOÀN ĐIỆN LỰC VIỆT NAM.jpg',
  },
]

export default async function HomePage() {
  const { featuredProducts, partners, customers, settings } = await getHomeData()
  const hotline = settings.hotline || '0901 234 567'

  // Dữ liệu đối tác / khách hàng từ DB nếu có, fallback danh sách mẫu
  const displayPartners = partners.length > 0 ? partners : fallbackPartners
  const displayCustomers = customers.length > 0 ? customers : fallbackCustomers

  // Nhân đôi để trượt marquee vô tận
  const marqueePartners = [...displayPartners, ...displayPartners]
  const marqueeCustomers = [...displayCustomers, ...displayCustomers]

  return (
    <div className="fade-in bg-white">
      {/* ── 1. HERO BANNER VỚI ẢNH NỀN DATACENTER (BANNER.WEBP) ──── */}
      <section className="relative bg-[#061e52] text-white overflow-hidden">
        {/* Ảnh nền banner datacenter */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Image
            src="/pic/banner.webp"
            alt="Hạ tầng thiết bị mạng & phần cứng doanh nghiệp GTS"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          {/* Lớp phủ gradient nhẹ hơn để ảnh server racks sáng rõ và đẹp mắt hơn */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#061e52]/75 via-[#061e52]/55 to-[#0b2875]/68" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#061e52] via-transparent to-black/40" />
        </div>

        {/* Glow hiệu ứng công nghệ */}
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#0077CC] rounded-full blur-[120px]" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#0EA5E9] rounded-full blur-[140px]" />
        </div>

        <div className="relative z-10 layout-container py-12 sm:py-16 lg:py-24 flex justify-center">
          <div className="py-8 sm:py-12 lg:py-14 px-4 sm:px-12 flex flex-col items-center">
            <Reveal delay={80}>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.15] tracking-tight mb-6 text-center drop-shadow-lg">
                Hạ tầng thiết bị mạng & phần cứng doanh nghiệp{' '}
                <span className="text-[#38bdf8] drop-shadow-md">chính hãng & chuyên sâu</span>{' '}
              </h1>
            </Reveal>

            <Reveal delay={180}>
              <p className="text-base sm:text-xl text-blue-100/90 leading-relaxed mb-10 max-w-2xl text-center drop-shadow">
                GTS cung cấp thiết bị phần cứng chính hãng, đầy đủ CO/CQ và dịch vụ triển khai trọn gói — từ Switch Core, Router, Firewall NGFW đến WiFi 6/7 và Server lưu trữ.
              </p>
            </Reveal>

            <Reveal delay={280}>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link
                  href="/san-pham"
                  className="inline-flex items-center gap-2.5 bg-[#0077CC] hover:bg-[#0256b8] text-white px-8 py-4 rounded-2xl font-bold text-base transition-all hover:shadow-xl hover:-translate-y-0.5 shadow-lg shadow-[#0077CC]/30"
                >
                  <span>Xem Danh mục thiết bị</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/lien-he"
                  className="inline-flex items-center gap-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/30 px-8 py-4 rounded-2xl font-bold text-base transition-all backdrop-blur-md"
                >
                  <span>Liên hệ</span>
                </Link>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Stats bar phía dưới hero banner */}
        <div className="relative z-10 border-t border-white/15 bg-black/30 backdrop-blur-md">
          <div className="layout-container py-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
              {[
                { value: '100% CO/CQ', label: 'Chứng chỉ xuất xứ chính hãng' },
                { value: '200+', label: 'Dự án doanh nghiệp triển khai' },
                { value: '15+', label: 'Hãng công nghệ đối tác chiến lược' },
                { value: '24/7 SLA', label: 'Hỗ trợ kỹ thuật' },
              ].map((stat, idx) => (
                <Reveal key={stat.label} delay={300 + idx * 80}>
                  <div className="p-1">
                    <div className="text-2xl sm:text-3xl font-black text-white tracking-tight drop-shadow-sm">{stat.value}</div>
                    <div className="text-xs sm:text-sm text-blue-200/90 mt-1 font-medium">{stat.label}</div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. DANH MỤC THIẾT BỊ PHẦN CỨNG CHỦ LỰC (SWITCH, ROUTER, FIREWALL, WIFI...) ── */}
      <section className="py-12 sm:py-16 bg-white border-b border-slate-200/80">
        <div className="layout-container">
          {/* Header căn giữa chuẩn SotaTek */}
          <Reveal>
            <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
              <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#0077CC] mb-2">
                DANH MỤC SẢN PHẨM
              </p>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight mb-2">
                Hệ Thống Thiết Bị Hạ Tầng Mạng & Phần Cứng Doanh Nghiệp
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                Thiết bị chính hãng đáp ứng mọi tiêu chuẩn kỹ thuật, từ mạng văn phòng đến trung tâm dữ liệu Enterprise.
              </p>
            </div>
          </Reveal>

          {/* Lưới 8 Card Danh Mục Thiết Bị (ảnh thật minh họa từng nhóm) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {hardwareCategories.map((item, idx) => (
              <Reveal key={item.id} delay={idx * 60}>
                <Link
                  href={item.href}
                  className="group bg-white rounded-2xl overflow-hidden border border-slate-200/90 hover:border-[#0077CC] hover:shadow-lg transition-all duration-300 flex flex-col h-full"
                >
                  {/* Ảnh thật của thiết bị tiêu biểu trong nhóm */}
                  <div className="relative aspect-[3/2] overflow-hidden bg-gradient-to-br from-[#f6f7fc] to-[#eef1f8] border-b border-slate-200/70">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="(max-width: 1024px) 50vw, 25vw"
                      className="object-contain p-2 mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-2 right-2 text-[9px] font-mono font-bold uppercase tracking-wide text-white bg-[#0077CC] px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  </div>

                  {/* Nội dung card gọn */}
                  <div className="p-3.5 flex items-center justify-between gap-2 flex-1">
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#0077CC] transition-colors leading-snug line-clamp-2">
                      {item.title}
                    </h3>
                    <ArrowRight className="w-4 h-4 flex-shrink-0 text-slate-300 group-hover:text-[#0077CC] group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>

          {/* Banner phụ dẫn sang catalogue đầy đủ */}
          <Reveal delay={200}>
            <div className="mt-8 text-center">
              <Link
                href="/san-pham"
                className="inline-flex items-center gap-2 text-sm font-bold text-[#0077CC] hover:text-[#0256b8] transition-colors"
              >
                <span>Xem toàn bộ danh mục sản phẩm & giải pháp phần cứng</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── 3. KHU VỰC ĐỐI TÁC & KHÁCH HÀNG: HEADER CĂN GIỮA, CHỈ HIỆN LOGO ─── */}
      <section className="py-16 sm:py-20 bg-[#f6f7fc] border-b border-slate-200/80 overflow-hidden">
        <div className="layout-container">
          {/* HEADER ĐỐI TÁC, KHÁCH HÀNG Ở CHÍNH GIỮA */}
          <Reveal>
            <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
              <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#0077CC] mb-2.5">
                ĐỐI TÁC CHIẾN LƯỢC & KHÁCH HÀNG TIÊU BIỂU
              </p>
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-4">
                Đồng Hành Cùng Các Doanh Nghiệp & Hãng Công Nghệ Hàng Đầu
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                GTS tự hào là đối tác cung cấp thiết bị và giải pháp hạ tầng CNTT tin cậy của hơn 200+ tổ chức, ngân hàng, nhà máy sản xuất và tập đoàn lớn tại Việt Nam.
              </p>
            </div>
          </Reveal>

          {/* DẢI 1: LOGO ĐỐI TÁC CÔNG NGHỆ (CHỈ HIỆN LOGO HOẶC LOGO TỪ DB) */}
          <Reveal delay={150}>
            <div className="mb-6">
              <div className="text-center mb-3">
                <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                  Hãng công nghệ & Thiết bị phần cứng
                </span>
              </div>

              <div className="overflow-hidden mask-linear-gradient py-2">
                <div className="animate-marquee items-center gap-4 sm:gap-6">
                  {marqueePartners.map((item, idx) => {
                    const LogoComp = 'Logo' in item ? item.Logo : undefined
                    return (
                      <div
                        key={idx}
                        className="flex-shrink-0 h-16 sm:h-20 w-44 sm:w-52 bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:border-[#0077CC] hover:shadow-md transition-all duration-300 flex items-center justify-center p-4 group"
                        title={item.name}
                      >
                        {item.logo ? (
                          <img
                            src={item.logo}
                            alt={item.name}
                            className="max-h-9 sm:max-h-11 max-w-[140px] object-contain transition-all duration-200"
                          />
                        ) : LogoComp ? (
                          <LogoComp className="h-8 sm:h-9 max-w-[150px] transition-all duration-200" />
                        ) : (
                          <span className="font-black text-sm sm:text-base text-slate-700 group-hover:text-[#0077CC] tracking-wider uppercase transition-colors text-center px-2">
                            {item.name}
                          </span>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </Reveal>

          {/* DẢI 2: LOGO KHÁCH HÀNG DOANH NGHIỆP (CHỈ HIỆN LOGO - CHẠY NGƯỢC CHIỀU) */}
          <Reveal delay={250}>
            <div>
              <div className="text-center mb-3">
                <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                  Khách hàng doanh nghiệp, ngân hàng & tập đoàn
                </span>
              </div>

              <div className="overflow-hidden mask-linear-gradient py-2">
                <div className="animate-marquee-reverse items-center gap-4 sm:gap-6">
                  {marqueeCustomers.map((item, idx) => {
                    const LogoComp = 'Logo' in item ? item.Logo : undefined
                    return (
                      <div
                        key={idx}
                        className="flex-shrink-0 h-16 sm:h-20 w-44 sm:w-52 bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:border-[#0077CC] hover:shadow-md transition-all duration-300 flex items-center justify-center p-4 group"
                        title={item.name}
                      >
                        {item.logo ? (
                          <img
                            src={item.logo}
                            alt={item.name}
                            className="max-h-9 sm:max-h-11 max-w-[140px] object-contain transition-all duration-200"
                          />
                        ) : LogoComp ? (
                          <LogoComp className="h-8 sm:h-9 max-w-[150px] transition-all duration-200" />
                        ) : (
                          <span className="font-black text-sm sm:text-base text-slate-700 group-hover:text-[#0077CC] tracking-wider uppercase transition-colors text-center px-2">
                            {item.name}
                          </span>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── 4. KHỐI TỔNG QUAN GTS (SOTATEK ABOUT OVERVIEW: NỀN TRẮNG, 2 CỘT) ──── */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="layout-container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Cột trái: Khối hình ảnh phối cảnh hạ tầng */}
            <div className="lg:col-span-5">
              <Reveal delay={100} className="h-full">
                <div className="relative">
                  <div className="rounded-3xl overflow-hidden shadow-2xl border border-slate-200/90 bg-gradient-to-br from-[#061e52] via-[#0b2875] to-[#1539ce] p-8 sm:p-10 text-white min-h-[440px] flex flex-col justify-between">
                    <div>
                      <div className="inline-flex items-center gap-2 bg-white/10 text-blue-200 text-xs font-bold px-3.5 py-1.5 rounded-full border border-white/20 mb-6 backdrop-blur-sm">
                        <Server className="w-3.5 h-3.5 text-[#38bdf8]" />
                        <span>Trung Tâm Hạ Tầng & Kho Thiết Bị GTS</span>
                      </div>

                      <h3 className="text-2xl sm:text-3xl font-black leading-tight mb-4">
                        Hơn 10 Năm Tiên Phong Cung Ứng Phần Cứng Doanh Nghiệp
                      </h3>

                      <p className="text-blue-100/90 text-sm leading-relaxed">
                        Sở hữu kho thiết bị sẵn sàng tại Hà Nội và TP. Hồ Chí Minh với đầy đủ chủng loại Switch Core, Access, NGFW và Server lưu trữ.
                      </p>
                    </div>

                    <div className="pt-6 border-t border-white/15 grid grid-cols-2 gap-4">
                      <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm border border-white/10">
                        <div className="text-2xl font-black text-[#4ade80]">100%</div>
                        <div className="text-xs text-blue-100 font-medium mt-0.5">CO/CQ Chính Hãng</div>
                      </div>
                      <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm border border-white/10">
                        <div className="text-2xl font-black text-amber-300">24/7</div>
                        <div className="text-xs text-blue-100 font-medium mt-0.5">SLA Kỹ Thuật</div>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Cột phải: Đoạn văn Tổng quan & Nút tìm hiểu thêm */}
            <div className="lg:col-span-7">
              <Reveal delay={200}>
                <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#0077CC] mb-2.5">
                  TỔNG QUAN VỀ GTS
                </p>

                <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight mb-6">
                  Đơn Vị Cung Cấp Dịch Vụ Công Nghệ & Giải Pháp Hạ Tầng Mạng Doanh Nghiệp
                </h2>

                <div className="space-y-4 text-slate-600 text-sm sm:text-base leading-relaxed text-justify mb-8">
                  <p>
                    <strong>GTS (Global Technology Solutions)</strong> là đơn vị phân phối và tích hợp hệ thống phần cứng CNTT chuyên sâu cho doanh nghiệp và tổ chức trong các lĩnh vực tài chính - ngân hàng, sản xuất công nghiệp, y tế và viễn thông. Với đội ngũ kỹ sư giàu kinh nghiệm thực chiến và quy trình triển khai chuẩn quốc tế, GTS được khách hàng tin cậy trong việc tư vấn, cung cấp và vận hành các hệ thống mạng có yêu cầu cao nhất về tính ổn định và bảo mật.
                  </p>
                  <p>
                    Bên cạnh dịch vụ cung ứng thiết bị phần cứng theo dự án, GTS cung cấp mô hình hợp tác linh hoạt như dịch vụ bảo trì định kỳ SLA, cho thuê kho thiết bị dự phòng (Spare Part) và dịch vụ ủy quyền bảo hành RMA, giúp doanh nghiệp hoàn toàn yên tâm tập trung phát triển kinh doanh.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <Link
                    href="/gioi-thieu"
                    className="inline-flex items-center gap-2 bg-[#0077CC] hover:bg-[#0256b8] text-white px-8 py-4 rounded-2xl font-bold text-sm transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
                  >
                    <span>Tìm hiểu thêm về GTS</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/dich-vu"
                    className="inline-flex items-center gap-2 bg-[#f6f7fc] hover:bg-slate-200 text-slate-800 px-7 py-4 rounded-2xl font-bold text-sm transition-all border border-slate-200"
                  >
                    <span>Xem năng lực dịch vụ</span>
                  </Link>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. KHỐI SẢN PHẨM NỔI BẬT (lấy từ DB: is_featured = true) ─── */}
      {featuredProducts.length > 0 && (
        <section className="py-20 sm:py-24 bg-[#f6f7fc] border-y border-slate-200/80">
          <div className="layout-container">
            <Reveal>
              <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 sm:mb-16">
                <div className="max-w-2xl">
                  <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#0077CC] mb-2">
                    SẢN PHẨM NỔI BẬT
                  </p>
                  <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
                    Thiết Bị Hạ Tầng Mạng & Phần Cứng Nổi Bật
                  </h2>
                  <p className="text-slate-600 mt-2 text-sm sm:text-base">
                    Switch Core/Access, Firewall NGFW, WiFi 6/7 và Server được doanh nghiệp lựa chọn nhiều nhất.
                  </p>
                </div>
                <Link
                  href="/san-pham"
                  className="mt-4 sm:mt-0 inline-flex items-center gap-2 text-sm text-[#0077CC] font-bold hover:gap-3 transition-all"
                >
                  Xem toàn bộ sản phẩm <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </Reveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product, idx) => (
                <Reveal key={product.id} delay={idx * 75}>
                  <ProductCard product={product} />
                </Reveal>
              ))}
            </div>

            <div className="text-center mt-12 sm:hidden">
              <Link
                href="/san-pham"
                className="inline-flex items-center gap-2 bg-[#0077CC] text-white px-7 py-3.5 rounded-2xl font-bold text-sm"
              >
                Xem tất cả thiết bị <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── 6. KHỐI DỊCH VỤ DOANH NGHIỆP (HOMENEW-SERVICE SOTATEK STYLE) ───────── */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="layout-container">
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16">
              <div>
                <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#0077CC] mb-2">
                  DỊCH VỤ DOANH NGHIỆP
                </p>
                <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                  Giải Pháp Kỹ Thuật Toàn Diện Cho Vận Hành Doanh Nghiệp
                </h2>
                <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-2xl">
                  Đồng hành cùng khách hàng từ khâu tư vấn thiết kế, thi công triển khai đến bảo trì.
                </p>
              </div>

              <Link
                href="/dich-vu"
                className="mt-4 md:mt-0 inline-flex items-center gap-2 text-sm font-bold text-[#0077CC] hover:text-[#0256b8] transition-all"
              >
                <span>Xem tất cả dịch vụ</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </Reveal>

          {/* Lưới 4 Card Dịch Vụ */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredServices.map((svc, idx) => (
              <Reveal key={svc.id} delay={idx * 90} className="h-full">
                <div className="group bg-[#f6f7fc] hover:bg-white rounded-3xl p-7 border border-slate-200/90 hover:border-[#0077CC] hover:shadow-2xl transition-all duration-300 flex flex-col justify-between h-full">
                  <div>
                    <h3 className="text-lg sm:text-xl font-black text-slate-900 group-hover:text-[#0077CC] transition-colors mb-3 leading-snug">
                      {svc.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed mb-6">
                      {svc.desc}
                    </p>

                    <ul className="space-y-2 mb-6">
                      {svc.points.map((pt, pIdx) => (
                        <li key={pIdx} className="flex items-start gap-2 text-xs text-slate-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link
                    href={svc.href}
                    className="pt-4 border-t border-slate-200/80 flex items-center justify-between text-xs font-bold text-[#0077CC] group-hover:text-[#0256b8]"
                  >
                    <span>Xem chi tiết dịch vụ</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. KHỐI DỰ ÁN TIÊU BIỂU (nguồn: HSNL GTS 2026) ──── */}
      <section className="py-16 sm:py-20 bg-[#061e52] text-white">
        <div className="layout-container">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
              <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#38bdf8] mb-2">
                DỰ ÁN TIÊU BIỂU
              </p>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight mb-3">
                Từ Bài Toán Doanh Nghiệp Đến Triển Khai Thực Tế
              </h2>
              <p className="text-blue-100/80 text-sm">
                Kinh nghiệm cung cấp, triển khai và bảo hành hệ thống hạ tầng mạng cho các tập đoàn, ngân hàng và công ty hàng đầu.
              </p>
            </div>
          </Reveal>

          <Reveal delay={150}>
            <ProjectsCarousel projects={featuredProjects} />
          </Reveal>
        </div>
      </section>

      {/* ── 9. BANNER "LET'S TALK" (SOTATEK STYLE) ───────────────────────────── */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="layout-container">
          <Reveal>
            <div className="bg-[#f6f7fc] rounded-3xl p-8 sm:p-14 border border-slate-200/90 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="max-w-2xl">
                <h3 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-snug">
                  Triển khai giải pháp hạ tầng phù hợp cho bài toán của bạn!
                </h3>
                <p className="text-slate-600 text-sm sm:text-base mt-2">
                  Kỹ sư GTS luôn sẵn sàng khảo sát tại công trình và lên phương án kỹ thuật miễn phí.
                </p>
              </div>
              
              <div className="flex flex-wrap items-center gap-4 flex-shrink-0">
                <a
                  href={`tel:${hotline.replace(/\s/g, '')}`}
                  className="inline-flex items-center gap-2.5 bg-[#0077CC] hover:bg-[#0256b8] text-white px-7 py-4 rounded-2xl font-bold text-sm transition-all shadow-md hover:shadow-lg"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Hotline: {hotline}</span>
                </a>
                <Link
                  href="/lien-he?type=quote"
                  className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-900 border border-slate-300 px-7 py-4 rounded-2xl font-bold text-sm transition-all shadow-sm"
                >
                  <span>Gửi yêu cầu dự án</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
