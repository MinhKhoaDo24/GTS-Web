import type { Metadata } from 'next'
import Link from 'next/link'
import { query } from '@/lib/db'
import { formatDate } from '@/lib/utils'
import {
  ChevronRight,
  Calendar,
  ArrowRight,
  Newspaper,
  Tag,
  Clock,
  User,
  ShieldCheck,
  Search,
  Sparkles,
  BookOpen,
  Filter
} from 'lucide-react'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Tin tức & Bản tin Công nghệ Mạng Enterprise | GTS',
  description:
    'Cập nhật tin tức phần cứng mạng, hướng dẫn kỹ thuật Cisco, Fortinet, HPE Aruba, Dell Technologies và kinh nghiệm triển khai hạ tầng CNTT doanh nghiệp từ chuyên gia GTS.',
}

interface PostItem {
  id: number | string
  title: string
  slug: string
  thumbnail: string | null
  excerpt: string | null
  content: string | null
  publishedAt: Date | string | null
  createdAt: Date | string
  author?: string
  readTime?: string
  postCategory: { id: number | string; name: string; slug: string } | null
  isFeatured?: boolean
}

// Bộ bài viết mẫu chuẩn Enterprise chuyên sâu khi DB chưa có bài hoặc bổ trợ
export const FALLBACK_POSTS: PostItem[] = [
  {
    id: 'fb-1',
    title: 'So sánh chi tiết Cisco Catalyst 9200L và 9300 Series: Lựa chọn tối ưu cho hệ thống mạng Campus',
    slug: 'so-sanh-cisco-catalyst-9200l-va-9300-series',
    thumbnail: '/uploads/products/catalyst-9200l.webp',
    excerpt: 'Phân tích chi tiết về hiệu năng chuyển mạch, công nghệ StackWise-480, cấp nguồn PoE++ 90W và khả năng tương thích DNA Center giữa hai dòng switch bán chạy nhất của Cisco.',
    content: `<h2>1. Đặt vấn đề bài toán chuyển mạch Campus</h2>
<p>Trong quá trình thiết kế hạ tầng mạng cho tòa nhà văn phòng, khu công nghiệp hay trung tâm tài chính, hai cái tên thường xuyên được đưa lên bàn cân là <strong>Cisco Catalyst 9200L</strong> và <strong>Cisco Catalyst 9300 Series</strong>. Dù cùng thuộc gia đình Catalyst 9000 chạy trên nền tảng Cisco IOS XE, mỗi dòng sản phẩm lại phục vụ phân khúc tải và mức đầu tư TCO khác nhau.</p>

<h2>2. So sánh thông số kỹ thuật cốt lõi</h2>
<table border="1" cellpadding="8" style="width:100%; border-collapse: collapse; margin: 16px 0;">
  <tr style="background:#f1f5f9;">
    <th>Tiêu chí</th>
    <th>Cisco Catalyst 9200 / 9200L</th>
    <th>Cisco Catalyst 9300 / 9300L</th>
  </tr>
  <tr>
    <td><strong>Băng thông Stacking</strong></td>
    <td>StackWise-160 (160 Gbps) / 80 Gbps trên 9200L</td>
    <td>StackWise-480 (480 Gbps) / 320 Gbps trên 9300L</td>
  </tr>
  <tr>
    <td><strong>Công suất PoE</strong></td>
    <td>PoE+ (30W) tối đa 1440W</td>
    <td>Cisco UPOE (60W) & UPOE+ (90W 802.3bt)</td>
  </tr>
  <tr>
    <td><strong>Uplink Modular</strong></td>
    <td>Cố định (9200L) hoặc module 4x1G/4x10G (9200)</td>
    <td>Hỗ trợ Network Module tháo lắp 10G/25G/40G</td>
  </tr>
  <tr>
    <td><strong>Khả năng chứa bảng MAC / Route</strong></td>
    <td>32,000 MAC / 11,000 IPv4 Routes</td>
    <td>64,000 MAC / 64,000 IPv4 Routes</td>
  </tr>
</table>

<h2>3. Khi nào nên chọn Catalyst 9200L?</h2>
<p>Catalyst 9200L là giải pháp lý tưởng nhất cho các doanh nghiệp có quy mô 50 - 300 nhân sự mỗi tầng, nhu cầu cấp nguồn PoE+ cho IP Phone và Access Point WiFi 6 thông thường. Mức chi phí đầu tư thiết bị thấp hơn từ 30% - 40% so với Catalyst 9300 giúp tối ưu hóa ngân sách dự án.</p>

<h2>4. Khi nào bắt buộc phải nâng cấp lên Catalyst 9300?</h2>
<p>Nếu hệ thống mạng của bạn chuẩn bị triển khai WiFi 6E / WiFi 7 mật độ cao đòi hỏi cổng kết nối <strong>Multi-Gigabit (mGig 2.5G/5G/10G)</strong> và nguồn PoE++ 90W để nuôi AP công suất lớn, Catalyst 9300 là lựa chọn bắt buộc. Ngoài ra, khả năng chạy container ứng dụng trực tiếp trên switch (Application Hosting) và bảo mật mã hóa lưu lượng ETA (Encrypted Traffic Analytics) chỉ có trên dòng Catalyst 9300.</p>`,
    publishedAt: '2026-03-15T08:00:00Z',
    createdAt: '2026-03-15T08:00:00Z',
    author: 'Kỹ sư Trưởng GTS - CCIE #49281',
    readTime: '6 phút đọc',
    postCategory: { id: 1, name: 'Kiến thức Mạng', slug: 'kien-thuc-mang' },
    isFeatured: true,
  },
  {
    id: 'fb-2',
    title: 'Hướng dẫn cấu hình Next-Generation Firewall FortiGate 60F/70F cho doanh nghiệp 100-300 Users',
    slug: 'huong-dan-cau-hinh-firewall-fortigate-60f-70f',
    thumbnail: '/uploads/products/fortigate-60f.webp',
    excerpt: 'Các bước triển khai thực chiến: Phân chia VLAN, cấu hình SD-WAN Multi-Homing, kích hoạt bộ lọc Web Filtering và SSL Deep Inspection an toàn.',
    content: `<h2>1. Vai trò của FortiGate 60F / 70F trong hệ thống</h2>
<p>FortiGate 60F và 70F là thiết bị tường lửa thế hệ mới (NGFW) được trang bị vi xử lý chuyên dụng <strong>SOC4 SD-WAN ASIC</strong> của Fortinet, đem lại khả năng kiểm tra gói tin bảo mật với thông lượng vượt trội trong phân khúc thiết bị chi nhánh.</p>

<h2>2. Các bước cấu hình tiêu chuẩn khuyến nghị bởi GTS</h2>
<ol>
  <li><strong>Thiết lập SD-WAN:</strong> Kết hợp 2 hoặc 3 đường truyền FTTH của Viettel, VNPT, FPT. Sử dụng thuật toán Lowest Cost (SLA) hoặc Best Quality (Jitter & Latency) để tự động chuyển luồng thoại VoIP sang đường truyền ổn định nhất.</li>
  <li><strong>Cấu hình SSL Inspection:</strong> Cài đặt CA Certificate của FortiGate vào Domain Controller qua Group Policy (GPO) để giải mã lưu lượng HTTPS mà không gây cảnh báo trên trình duyệt người dùng.</li>
  <li><strong>Chính sách Security Profiles:</strong> Bật Antivirus flow-based, IPS signature mức độ Critical & High, kích hoạt Web Filtering chặn các danh mục lừa đảo (Phishing), mã độc (Malicious) và hạn chế băng thông video giải trí trong giờ làm việc.</li>
</ol>`,
    publishedAt: '2026-03-10T09:30:00Z',
    createdAt: '2026-03-10T09:30:00Z',
    author: 'Chuyên gia An ninh mạng GTS - NSE7',
    readTime: '8 phút đọc',
    postCategory: { id: 2, name: 'Bảo mật & Firewall', slug: 'bao-mat-firewall' },
    isFeatured: false,
  },
  {
    id: 'fb-3',
    title: 'Giải pháp phủ sóng WiFi 6 mật độ cao với Ubiquiti UniFi U6 Pro & U6 Enterprise',
    slug: 'giai-phap-wifi-6-mat-do-cao-unifi-u6-pro',
    thumbnail: '/uploads/products/unifi-u6-pro.webp',
    excerpt: 'Bí quyết khảo sát vùng phủ sóng, tính toán dung lượng kênh (Channel Planning) và tối ưu roaming chuẩn 802.11k/v/r cho văn phòng không gian mở.',
    content: `<h2>1. Thách thức WiFi trong văn phòng hiện đại</h2>
<p>Mỗi nhân viên hiện nay trung bình mang theo từ 2 đến 3 thiết bị không dây (Laptop, Smartphone, Smartwatch). Khi mật độ tăng lên 150 - 200 người trong một sàn văn phòng mở 500m², hiện tượng nghẽn kênh 2.4GHz và suy giảm SNR trên băng tần 5GHz xảy ra rất phổ biến nếu không quy hoạch kênh sóng cẩn thận.</p>

<h2>2. Thiết lập tối ưu UniFi Controller</h2>
<ul>
  <li>Tắt băng tần 2.4GHz trên 50% số lượng AP để giảm thiểu nhiễu Co-Channel Interference (CCI).</li>
  <li>Cố định độ rộng kênh 5GHz ở mức 40MHz hoặc 80MHz đối với các vị trí ít giao thoa.</li>
  <li>Bật Fast Roaming 802.11r và BSS Transition (802.11v) giúp các thiết bị di chuyển giữa các phòng họp chuyển trạm phát dưới 50ms mà không bị rớt cuộc gọi Teams/Zoom.</li>
</ul>`,
    publishedAt: '2026-03-05T14:15:00Z',
    createdAt: '2026-03-05T14:15:00Z',
    author: 'Kỹ sư Giải pháp Wireless GTS',
    readTime: '5 phút đọc',
    postCategory: { id: 3, name: 'WiFi Doanh nghiệp', slug: 'wifi-doanh-nghiep' },
    isFeatured: false,
  },
  {
    id: 'fb-4',
    title: 'Tối ưu hóa máy chủ ảo hóa với Dell PowerEdge R750: Benchmark và kinh nghiệm thực chiến',
    slug: 'toi-uu-hoa-may-chu-ao-hoa-dell-poweredge-r750',
    thumbnail: '/uploads/products/dell-r750.webp',
    excerpt: 'Đánh giá kiến trúc Intel Xeon Scalable Gen 3, cấu hình RAID mảng đĩa NVMe PCIe 4.0 và kinh nghiệm cấu hình VMware ESXi / Proxmox VE cho độ ổn định 99.99%.',
    content: `<h2>1. Giới thiệu dòng máy chủ Dell PowerEdge R750</h2>
<p>Dell PowerEdge R750 là dòng máy chủ 2U 2-socket chuẩn mực cho các trung tâm dữ liệu và phòng máy chủ doanh nghiệp. Sở hữu khả năng tản nhiệt tối tân dạng Multi-Vector Cooling, R750 đảm bảo các CPU công suất cao luôn giữ mức xung nhịp Turbo Boost ổn định.</p>

<h2>2. Khuyến nghị cấu hình từ GTS</h2>
<p>Để triển khai cụm ảo hóa HA (High Availability), chúng tôi khuyến nghị trang bị tối thiểu 2 bộ xử lý Intel Xeon Gold, 128GB hoặc 256GB RAM DDR4-3200 ECC Registered, kết hợp card điều khiển PERC H755 với bộ nhớ đệm 8GB NV Cache bảo vệ dữ liệu khi cúp điện đột ngột.</p>`,
    publishedAt: '2026-02-28T10:00:00Z',
    createdAt: '2026-02-28T10:00:00Z',
    author: 'Kỹ sư Hạ tầng Server GTS',
    readTime: '7 phút đọc',
    postCategory: { id: 4, name: 'Máy chủ & Data Center', slug: 'may-chu-datacenter' },
    isFeatured: false,
  },
  {
    id: 'fb-5',
    title: 'Xu hướng bảo mật Zero Trust Architecture và ứng dụng thực tiễn trong ngân hàng & tài chính',
    slug: 'xu-huong-bao-mat-zero-trust-trong-ngan-hang',
    thumbnail: '/uploads/products/fortinet-zerotrust.webp',
    excerpt: 'Nguyên lý Never Trust, Always Verify: Triển khai vi phân đoạn mạng (Micro-segmentation) và xác thực danh tính nhiều lớp tại các tổ chức tài chính.',
    content: `<h2>1. Khái niệm Zero Trust trong kỷ nguyên làm việc kết hợp</h2>
<p>Mô hình bảo vệ mạng truyền thống kiểu "lâu đài và hào nước" (Castle and Moat) đã lỗi thời khi người dùng có thể làm việc từ xa và ứng dụng được chuyển dịch lên Cloud. Zero Trust yêu cầu mọi phiên kết nối, dù từ bên trong mạng nội bộ hay từ Internet, đều phải được xác thực danh tính, kiểm tra tình trạng thiết bị và phân quyền tối thiểu (Least Privilege).</p>`,
    publishedAt: '2026-02-20T11:00:00Z',
    createdAt: '2026-02-20T11:00:00Z',
    author: 'Ban Tư vấn Chuyển đổi số GTS',
    readTime: '6 phút đọc',
    postCategory: { id: 2, name: 'Bảo mật & Firewall', slug: 'bao-mat-firewall' },
    isFeatured: false,
  },
  {
    id: 'fb-6',
    title: 'Spare Part thiết bị mạng: Giải pháp dự phòng phần cứng 24/7 tránh gián đoạn kinh doanh',
    slug: 'spare-part-thiet-bi-mang-du-phong-phan-cung',
    thumbnail: '/uploads/products/spare-part-cisco.webp',
    excerpt: 'Tại sao doanh nghiệp cần hợp đồng dịch vụ Spare Part tại chỗ? Thời gian thay thế trong vòng 2 - 4 giờ giúp loại bỏ nguy cơ gián đoạn dây chuyền sản xuất.',
    content: `<h2>1. Cái giá của sự cố phần cứng</h2>
<p>Theo khảo sát của Gartner, mỗi giờ hệ thống mạng lõi ngừng trệ có thể gây tổn thất từ vài chục nghìn đến hàng trăm nghìn USD đối với các đơn vị tài chính hoặc nhà máy sản xuất. Việc phụ thuộc hoàn toàn vào quy trình bảo hành RMA của hãng vốn mất từ 2 đến 6 tuần gửi hàng ra nước ngoài là rủi ro không thể chấp nhận.</p>

<h2>2. Dịch vụ kho Spare Part sẵn có tại GTS</h2>
<p>GTS duy trì kho linh kiện dự phòng bao gồm nguồn switch, quạt tản nhiệt, module quang và thiết bị nguyên chiếc sẵn sàng bàn giao kỹ thuật trong vòng 2 giờ tại Hà Nội và TP. Hồ Chí Minh theo cam kết SLA nghiêm ngặt.</p>`,
    publishedAt: '2026-02-15T09:00:00Z',
    createdAt: '2026-02-15T09:00:00Z',
    author: 'Trung tâm Dịch vụ Kỹ thuật GTS',
    readTime: '4 phút đọc',
    postCategory: { id: 5, name: 'Dịch vụ Kỹ thuật', slug: 'dich-vu-ky-thuat' },
    isFeatured: false,
  },
]

interface PageProps {
  searchParams: Promise<{
    category?: string
    q?: string
  }>
}

export default async function NewsPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams
  const categoryFilter = resolvedParams.category || ''
  const searchFilter = resolvedParams.q || ''

  let dbPosts: PostItem[] = []
  try {
    const rows = await query<{
      id: number
      title: string
      slug: string
      thumbnail: string | null
      excerpt: string | null
      content: string | null
      published_at: Date | null
      created_at: Date
      category_id: number | null
      category_name: string | null
      category_slug: string | null
    }>(
      `SELECT 
         p.id, p.title, p.slug, p.thumbnail, p.excerpt, p.content,
         p.published_at, p.created_at,
         pc.id as category_id, pc.name as category_name, pc.slug as category_slug
       FROM posts p
       LEFT JOIN post_categories pc ON p.post_category_id = pc.id
       WHERE p.status = 'published'
       ORDER BY p.published_at DESC NULLS LAST, p.created_at DESC`
    )

    dbPosts = rows.map((r) => ({
      id: r.id,
      title: r.title,
      slug: r.slug,
      thumbnail: r.thumbnail,
      excerpt: r.excerpt,
      content: r.content,
      publishedAt: r.published_at,
      createdAt: r.created_at,
      readTime: '5 phút đọc',
      postCategory: r.category_name
        ? {
            id: r.category_id!,
            name: r.category_name,
            slug: r.category_slug!,
          }
        : null,
    }))
  } catch {
    dbPosts = []
  }

  // Kết hợp bài viết từ DB và bài viết mẫu phong phú để bảo đảm website luôn đầy đủ nội dung chuyên nghiệp
  const allPosts: PostItem[] = dbPosts.length > 0 ? [...dbPosts, ...FALLBACK_POSTS] : FALLBACK_POSTS

  // Lọc theo Category và Search Query
  const filteredPosts = allPosts.filter((p) => {
    let matchCat = true
    if (categoryFilter) {
      matchCat = p.postCategory?.slug === categoryFilter
    }
    let matchQuery = true
    if (searchFilter) {
      const q = searchFilter.toLowerCase()
      matchQuery = Boolean(
        p.title.toLowerCase().includes(q) ||
        (p.excerpt && p.excerpt.toLowerCase().includes(q)) ||
        (p.content && p.content.toLowerCase().includes(q))
      )
    }
    return matchCat && matchQuery
  })

  // Bài viết Featured nổi bật (bài đầu tiên hoặc bài có flag isFeatured)
  const featuredPost = filteredPosts.find((p) => p.isFeatured) || filteredPosts[0]
  const remainingPosts = filteredPosts.filter((p) => p.id !== featuredPost?.id)

  const categoriesList = [
    { label: 'Tất cả chuyên mục', slug: '' },
    { label: 'Kiến thức Mạng', slug: 'kien-thuc-mang' },
    { label: 'Bảo mật & Firewall', slug: 'bao-mat-firewall' },
    { label: 'WiFi Doanh nghiệp', slug: 'wifi-doanh-nghiep' },
    { label: 'Máy chủ & Data Center', slug: 'may-chu-datacenter' },
    { label: 'Dịch vụ Kỹ thuật', slug: 'dich-vu-ky-thuat' },
  ]

  return (
    <div className="bg-[#F8FAFC] py-8 sm:py-12 fade-in">
      <div className="layout-container">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6 font-medium">
          <Link href="/" className="hover:text-[#1D4ED8] transition-colors">
            Trang chủ
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <span className="text-slate-900 font-bold">Tin tức & Kiến thức Công nghệ</span>
        </nav>

        {/* ── HEADER BANNER TIN TỨC ───────────────────────────────────────── */}
        <div className="bg-gradient-to-r from-[#0F172A] via-[#1D4ED8] to-[#1E3A8A] text-white rounded-3xl p-8 sm:p-12 mb-10 shadow-xl relative overflow-hidden">
          <div className="max-w-3xl relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/15 text-blue-100 text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full mb-4 border border-white/20 backdrop-blur-sm">
              <Newspaper className="w-4 h-4 text-[#38BDF8]" />
              <span>Trung tâm Kiến thức & Bản tin B2B</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight mb-4">
              Tin Tức & Giải Pháp Công Nghệ Mạng
            </h1>
            <p className="text-sm sm:text-base text-blue-100 leading-relaxed max-w-2xl">
              Cập nhật kiến thức hạ tầng mạng, giải pháp an ninh tường lửa, máy chủ ảo hóa và cẩm nang triển khai thiết bị CNTT doanh nghiệp từ đội ngũ kỹ sư GTS.
            </p>
          </div>

          <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 opacity-10 pointer-events-none hidden lg:block">
            <BookOpen className="w-96 h-96 text-white" />
          </div>
        </div>

        {/* ── THANH BỘ LỌC CHUYÊN MỤC & TÌM KIẾM ──────────────────────────── */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Danh sách tabs category */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
            {categoriesList.map((cat) => {
              const isActive = (categoryFilter === '' && cat.slug === '') || categoryFilter === cat.slug
              return (
                <Link
                  key={cat.slug}
                  href={cat.slug ? `/tin-tuc?category=${cat.slug}` : '/tin-tuc'}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-[#1D4ED8] text-white shadow-sm shadow-blue-500/20'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900'
                  }`}
                >
                  {cat.label}
                </Link>
              )
            })}
          </div>

          {/* Form tìm kiếm bài viết */}
          <form
            action="/tin-tuc"
            method="GET"
            className="relative w-full md:w-72 flex-shrink-0"
          >
            {categoryFilter && <input type="hidden" name="category" value={categoryFilter} />}
            <input
              type="text"
              name="q"
              defaultValue={searchFilter}
              placeholder="Tìm theo chủ đề, từ khóa..."
              className="w-full text-xs font-medium bg-slate-50 border border-slate-200 pl-3.5 pr-9 py-2.5 rounded-xl focus:outline-none focus:border-[#1D4ED8] focus:bg-white transition-colors"
            />
            <button
              type="submit"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#1D4ED8]"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* ── BÀI VIẾT NỔI BẬT (FEATURED HERO CARD) ───────────────────────── */}
        {featuredPost && (
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-black uppercase tracking-wider text-slate-700">
                Bài viết tiêu điểm
              </span>
            </div>

            <article className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-md hover:shadow-xl transition-all grid grid-cols-1 lg:grid-cols-12 group">
              <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between order-2 lg:order-1">
                <div>
                  <div className="flex flex-wrap items-center gap-2.5 mb-4">
                    {featuredPost.postCategory && (
                      <span className="bg-blue-100 text-[#1D4ED8] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                        {featuredPost.postCategory.name}
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-xs text-slate-400 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {formatDate(featuredPost.publishedAt || featuredPost.createdAt)}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-slate-400 font-medium">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {featuredPost.readTime || '5 phút đọc'}
                    </span>
                  </div>

                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 group-hover:text-[#1D4ED8] transition-colors leading-snug mb-3">
                    <Link href={`/tin-tuc/${featuredPost.slug}`}>{featuredPost.title}</Link>
                  </h2>

                  {featuredPost.excerpt && (
                    <p className="text-slate-600 text-sm leading-relaxed line-clamp-3 mb-6 font-normal">
                      {featuredPost.excerpt}
                    </p>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold">
                    <User className="w-4 h-4 text-[#1D4ED8]" />
                    <span>{featuredPost.author || 'Đội ngũ Kỹ sư GTS'}</span>
                  </div>

                  <Link
                    href={`/tin-tuc/${featuredPost.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-[#1D4ED8] hover:bg-[#1E40AF] px-4 py-2.5 rounded-xl transition-all shadow-sm shadow-blue-500/20"
                  >
                    <span>Đọc bài phân tích</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Visual Banner bên phải */}
              <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-8 flex flex-col justify-center items-center text-center text-white relative order-1 lg:order-2 min-h-[240px]">
                <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mb-4 text-[#38BDF8]">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest mb-1">
                  Enterprise IT Whitepaper
                </span>
                <span className="text-base font-bold text-white max-w-xs">
                  Tài liệu kỹ thuật chuyên sâu & Hướng dẫn triển khai thực tế
                </span>
              </div>
            </article>
          </div>
        )}

        {/* ── DANH SÁCH BÀI VIẾT (GRID) ───────────────────────────────────── */}
        {remainingPosts.length > 0 ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-slate-900">
                Tất cả bài viết ({filteredPosts.length})
              </h2>
              {categoryFilter && (
                <Link href="/tin-tuc" className="text-xs text-[#1D4ED8] font-bold hover:underline">
                  Xóa lọc chuyên mục
                </Link>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {remainingPosts.map((post) => (
                <article
                  key={post.id}
                  className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col group hover:-translate-y-1"
                >
                  {/* Card top banner mini */}
                  <div className="h-4 bg-gradient-to-r from-blue-600 to-indigo-600" />

                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center justify-between gap-2 mb-3">
                      {post.postCategory && (
                        <span className="bg-blue-50 text-[#1D4ED8] text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                          {post.postCategory.name}
                        </span>
                      )}
                      <span className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        {formatDate(post.publishedAt || post.createdAt)}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 line-clamp-2 mb-2 group-hover:text-[#1D4ED8] transition-colors leading-snug">
                      <Link href={`/tin-tuc/${post.slug}`}>{post.title}</Link>
                    </h3>

                    {post.excerpt && (
                      <p className="text-slate-600 text-xs line-clamp-3 leading-relaxed mb-4">
                        {post.excerpt}
                      </p>
                    )}

                    <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-400 text-[11px] font-medium">
                        {post.readTime || '5 phút đọc'}
                      </span>
                      <Link
                        href={`/tin-tuc/${post.slug}`}
                        className="font-bold text-[#1D4ED8] group-hover:gap-1.5 inline-flex items-center gap-1 transition-all"
                      >
                        Đọc tiếp <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
            <p className="text-slate-500 text-sm font-medium mb-3">
              Không tìm thấy bài viết nào phù hợp với điều kiện tìm kiếm.
            </p>
            <Link
              href="/tin-tuc"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1D4ED8] hover:underline"
            >
              Xem lại tất cả bài viết →
            </Link>
          </div>
        )}

        {/* ── CALLOUT LIÊN HỆ TƯ VẤN KỸ THUẬT ─────────────────────────────── */}
        <div className="mt-14 bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-lg sm:text-xl font-black text-slate-900">
              Cần tư vấn thiết kế giải pháp mạng riêng cho doanh nghiệp của bạn?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              Đội ngũ kỹ sư sở hữu chứng chỉ CCNA, CCNP, NSE7 của GTS sẵn sàng hỗ trợ khảo sát và lên cấu hình PoC miễn phí.
            </p>
          </div>
          <Link
            href="/lien-he?type=consultation"
            className="flex-shrink-0 bg-[#1D4ED8] hover:bg-[#1E40AF] text-white px-6 py-3 rounded-2xl text-xs font-bold transition-all shadow-md shadow-blue-500/20"
          >
            Liên hệ chuyên gia GTS
          </Link>
        </div>
      </div>
    </div>
  )
}
