import type { Metadata } from 'next'
import Link from 'next/link'
import { query, queryOne } from '@/lib/db'
import type { PageContent, SiteSetting } from '@/types/database'
import { RichTextRenderer } from '@/components/RichTextRenderer'
import { Reveal } from '@/components/Reveal'
import {
  ShieldCheck,
  Award,
  Building2,
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  Target,
  Eye,
  HeartHandshake,
  Cpu,
  CheckCircle2,
  Rocket,
  Quote,
} from 'lucide-react'

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const page = await queryOne<PageContent>(
    `SELECT seo_title, seo_description, title FROM pages WHERE slug = 'gioi-thieu' OR slug = 've-gts' LIMIT 1`
  ).catch(() => null)

  return {
    title:
      page?.seo_title ||
      'Về GTS - Global Technology & Service | Nhà Phân Phối Thiết Bị Mạng Chính Hãng',
    description:
      page?.seo_description ||
      'Giới thiệu công ty GTS: Nhà cung cấp thiết bị phần cứng mạng, máy chủ và giải pháp an ninh mạng hàng đầu Việt Nam. Đối tác chính thức của Cisco, Fortinet, HPE, Dell, Ubiquiti.',
  }
}

const milestones = [
  {
    year: 'Giai đoạn 01',
    title: 'Xây dựng nền tảng',
    desc: 'Khởi đầu với định hướng phân phối thiết bị phần cứng mạng chính hãng cho doanh nghiệp và tổ chức tại Việt Nam.',
  },
  {
    year: 'Giai đoạn 02',
    title: 'Mở rộng hệ sinh thái',
    desc: 'Mở rộng danh mục thiết bị và giải pháp từ các hãng công nghệ quốc tế, đáp ứng đa dạng nhu cầu hạ tầng CNTT.',
  },
  {
    year: 'Giai đoạn 03',
    title: 'Phát triển dịch vụ kỹ thuật',
    desc: 'Xây dựng đội ngũ kỹ sư chuyên môn cao, cung cấp dịch vụ tư vấn thiết kế, triển khai và bảo hành chuyên sâu.',
  },
  {
    year: 'Giai đoạn 04',
    title: 'Đồng hành cùng doanh nghiệp',
    desc: 'Từng bước đồng hành cùng các tập đoàn, ngân hàng và nhà máy trong cung cấp, tích hợp và bảo trì hạ tầng mạng.',
  },
]

const coreValues = [
  {
    icon: ShieldCheck,
    color: 'bg-blue-50 text-[#1D4ED8]',
    title: 'Chính Hãng 100%',
    desc: 'Cam kết bồi thường 200% nếu phát hiện hàng giả, hàng nhái hoặc không có CO/CQ hợp lệ.',
  },
  {
    icon: Award,
    color: 'bg-emerald-50 text-[#22C55E]',
    title: 'Kỹ Thuật Chuyên Sâu',
    desc: 'Đội ngũ kỹ sư sở hữu chứng chỉ quốc tế CCNA, CCNP, NSE4 sẵn sàng tư vấn thiết kế PoC miễn phí.',
  },
  {
    icon: HeartHandshake,
    color: 'bg-amber-50 text-[#F59E0B]',
    title: 'Đồng Hành Lâu Dài',
    desc: 'Chính sách bảo hành 1 đổi 1 trong thời gian bảo hành, hỗ trợ spare part mượn tạm khi xảy ra sự cố.',
  },
  {
    icon: Cpu,
    color: 'bg-purple-50 text-purple-600',
    title: 'Tối Ưu Ngân Sách',
    desc: 'Báo giá dự án cạnh tranh nhất thị trường, chiết khấu sâu cho các đơn vị tích hợp hệ thống (SI).',
  },
]

const partners = [
  { name: 'Cisco Systems', level: 'Premier Partner' },
  { name: 'Fortinet', level: 'Advanced Partner' },
  { name: 'HPE Aruba Networking', level: 'Silver Partner' },
  { name: 'Dell Technologies', level: 'Authorized Partner' },
  { name: 'Ubiquiti / Ruijie', level: 'Official Distributor' },
]

const partnerMarquee = [
  'Cisco', 'Fortinet', 'HPE Aruba', 'Dell', 'Ubiquiti', 'Ruijie',
  'Juniper', 'Palo Alto', 'VMware', 'Microsoft', 'Synology', 'APC',
]


export default async function AboutPage() {
  const [dbPage, settingsArr] = await Promise.all([
    queryOne<PageContent>(
      `SELECT id, title, slug, content, thumbnail, banner, seo_title, seo_description FROM pages WHERE slug = 'gioi-thieu' OR slug = 've-gts' LIMIT 1`
    ).catch(() => null),
    query<SiteSetting>('SELECT key, value FROM site_settings').catch(() => []),
  ])

  const settings: Record<string, string> = Object.fromEntries(
    settingsArr.map((setting) => [setting.key, setting.value ?? ''])
  )
  const hotline = settings.hotline || '0901 234 567'
  const email = settings.contact_email || 'contact@gts.com.vn'
  const address = settings.address || 'Hà Nội & TP. Hồ Chí Minh'
  const hasCustomContent = Boolean(
    dbPage?.content && dbPage.content.trim().length > 50
  )

  return (
    <main className="bg-[#F8FAFC] pb-16 fade-in">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#071B48] text-white">
        <div className="absolute inset-0 tech-grid opacity-70" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,rgba(37,99,235,0.42),transparent_38%)]" />
        <div className="float-orb absolute -right-24 top-10 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="float-orb absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" style={{ animationDelay: '2s' }} />
        <div className="absolute -right-20 -bottom-32 h-96 w-96 rounded-full border border-white/10" />
        <div className="layout-container relative z-10 py-6 sm:py-8 lg:py-10">
          <div className="max-w-4xl">
            <h1 className="max-w-3xl text-3xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              {dbPage?.title || 'Kiến Tạo Hạ Tầng Số Vững Chắc Cùng GTS'}
            </h1>
            <p className="mt-6 max-w-2xl text-sm leading-relaxed text-blue-100/80 sm:text-base">
              Đối tác phân phối và tích hợp hạ tầng mạng, máy chủ và an ninh mạng chuẩn quốc tế cho doanh nghiệp, tổ chức tài chính và nhà máy tại Việt Nam.
            </p>
          </div>
        </div>
      </section>

      {hasCustomContent ? (
        <div className="layout-container py-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-12">
            <RichTextRenderer content={dbPage!.content!} />
          </div>
        </div>
      ) : (
        <>
          {/* Company introduction */}
          <section className="layout-container py-14 sm:py-20">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-stretch">
              <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-10 lg:col-span-7">
                <span className="text-xs font-black uppercase tracking-widest text-[#1D4ED8]">
                  Giới thiệu doanh nghiệp
                </span>
                <h2 className="mt-3 text-2xl font-black leading-tight text-slate-900 sm:text-4xl">
                  Đơn Vị Phân Phối &amp; Tích Hợp Hạ Tầng Công Nghệ Doanh Nghiệp
                </h2>
                <div className="mt-6 space-y-4 text-sm leading-7 text-slate-600 sm:text-base">
                  <p>
                    Công ty TNHH Giải Pháp Công Nghệ &amp; Dịch Vụ Toàn Cầu (GTS) được thành lập với mục tiêu trở thành nhà cung cấp phần cứng mạng chuyên nghiệp và đáng tin cậy, kết nối các hãng công nghệ hàng đầu thế giới với doanh nghiệp Việt Nam.
                  </p>
                  <p>
                    Với triết lý <strong className="text-slate-900">&ldquo;Find your true solution&rdquo;</strong>, GTS không chỉ cung cấp thiết bị mà còn đồng hành từ khảo sát, tư vấn, thiết kế đến triển khai, bảo hành và tối ưu vận hành lâu dài.
                  </p>
                </div>

                <div className="mt-7 flex flex-wrap gap-2">
                  {['CO/CQ chính hãng', 'VAT hợp lệ', 'Bảo hành theo hãng'].map((tag) => (
                    <span key={tag} className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl bg-[#0F172A] p-7 text-white shadow-xl sm:p-9 lg:col-span-5">
                <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-400">
                  <Building2 className="h-4 w-4" />
                  Năng lực phân phối
                </span>
                <h3 className="mt-2 text-2xl font-black">Đối Tác Công Nghệ</h3>
                <div className="mt-7 space-y-4">
                  {partners.map((partner) => (
                    <div key={partner.name} className="flex items-center justify-between gap-4 border-b border-white/10 pb-4 last:border-0 last:pb-0">
                      <span className="text-sm text-slate-300">{partner.name}</span>
                      <span className="text-right text-xs font-bold text-emerald-400">{partner.level}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-8 rounded-2xl border border-blue-400/20 bg-blue-500/10 p-4">
                  <p className="text-xs leading-6 text-blue-100/80">
                    Thiết bị xuất kho đi kèm chứng nhận xuất xứ, chứng nhận chất lượng và chính sách bảo hành minh bạch.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Partner marquee */}
          <section className="border-y border-slate-200 bg-white py-10">
            <div className="layout-container mb-6 text-center">
              <span className="text-xs font-black uppercase tracking-widest text-slate-400">
                Thương hiệu công nghệ GTS phân phối &amp; tích hợp
              </span>
            </div>
            <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
              <div className="animate-marquee gap-4">
                {[...partnerMarquee, ...partnerMarquee].map((brand, index) => (
                  <span
                    key={`${brand}-${index}`}
                    className="mx-2 flex shrink-0 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-6 py-3 text-sm font-black text-slate-700"
                  >
                    <Cpu className="h-4 w-4 text-[#1D4ED8]" />
                    {brand}
                  </span>
                ))}
              </div>
            </div>
          </section>

          {/* Growth timeline */}
          <section className="bg-[#F8FAFC] py-14 sm:py-20">
            <div className="layout-container">
              <Reveal>
                <div className="mx-auto mb-10 max-w-2xl text-center">
                  <span className="text-xs font-black uppercase tracking-widest text-[#1D4ED8]">
                    Growth Process · Company Milestones
                  </span>
                  <h2 className="mt-3 text-2xl font-black text-slate-900 sm:text-4xl">
                    Quá Trình Hình Thành &amp; Phát Triển
                  </h2>
                  <p className="mt-4 text-sm leading-6 text-slate-600">
                    Từ năng lực phân phối nền tảng đến quy trình triển khai bài bản, GTS từng bước định hình vị thế trong lĩnh vực hạ tầng công nghệ doanh nghiệp.
                  </p>
                </div>
              </Reveal>

              <div className="relative grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <div className="pointer-events-none absolute left-0 right-0 top-[52px] hidden h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent lg:block" />
                {milestones.map((milestone, index) => (
                  <Reveal key={milestone.year} delay={index * 120}>
                    <article className="group relative z-10 h-full rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:-translate-y-1 hover:shadow-lg">
                      <div className="mb-5 flex items-center justify-between">
                        <span className="text-lg font-black text-[#1D4ED8]">{milestone.year}</span>
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-xs font-black text-[#1D4ED8] ring-4 ring-[#F8FAFC] transition-colors group-hover:bg-[#1D4ED8] group-hover:text-white">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                      </div>
                      <h3 className="text-base font-black text-slate-900">{milestone.title}</h3>
                      <p className="mt-2 text-xs leading-6 text-slate-600">{milestone.desc}</p>
                    </article>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* Vision and mission */}
          <section className="layout-container py-14 sm:py-20">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <article className="relative overflow-hidden rounded-3xl border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-8 sm:p-10">
                <Eye className="absolute -bottom-8 -right-8 h-36 w-36 text-blue-100" />
                <div className="relative z-10">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#1D4ED8] text-white">
                    <Eye className="h-6 w-6" />
                  </div>
                  <h2 className="mt-5 text-2xl font-black text-slate-900">Tầm Nhìn</h2>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    Trở thành nhà tích hợp hạ tầng CNTT và trung tâm dữ liệu hàng đầu khu vực, đạt chuẩn đối tác cao cấp từ Cisco, Fortinet, HPE và Dell.
                  </p>
                </div>
              </article>

              <article className="relative overflow-hidden rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-green-50 p-8 sm:p-10">
                <Target className="absolute -bottom-8 -right-8 h-36 w-36 text-emerald-100" />
                <div className="relative z-10">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500 text-white">
                    <Target className="h-6 w-6" />
                  </div>
                  <h2 className="mt-5 text-2xl font-black text-slate-900">Sứ Mệnh</h2>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    Cung cấp thiết bị chính hãng cùng dịch vụ kỹ thuật chuyên sâu, giúp hạ tầng công nghệ của khách hàng vận hành ổn định, an toàn và liên tục 24/7.
                  </p>
                </div>
              </article>
            </div>
          </section>


          {/* Core values */}
          <section className="bg-[#071B48] py-14 text-white sm:py-20">
            <div className="layout-container">
              <div className="mx-auto mb-10 max-w-2xl text-center">
                <span className="text-xs font-black uppercase tracking-widest text-cyan-400">
                  Giá trị cốt lõi
                </span>
                <h2 className="mt-3 text-2xl font-black sm:text-4xl">
                  4 Trụ Cột Tạo Nên Uy Tín Của GTS
                </h2>
                <p className="mt-4 text-sm leading-6 text-blue-100/70">
                  Những nguyên tắc giúp GTS duy trì chất lượng, tính minh bạch và hiệu quả vận hành trong từng dự án bàn giao.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {coreValues.map((item, index) => (
                  <Reveal key={item.title} delay={index * 100}>
                    <article className="card-sheen relative h-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06] p-6 transition-colors hover:bg-white/10">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${item.color}`}>
                        <item.icon className="h-6 w-6" />
                      </div>
                      <h3 className="mt-5 text-base font-black">{item.title}</h3>
                      <p className="mt-2 text-xs leading-6 text-blue-100/70">{item.desc}</p>
                    </article>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* Open letter */}
          <section className="layout-container py-14 sm:py-20">
            <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-12 lg:p-16">
              <Quote className="absolute right-7 top-6 h-24 w-24 text-blue-50 sm:h-32 sm:w-32" />
              <div className="relative z-10 max-w-4xl">
                <span className="text-xs font-black uppercase tracking-widest text-[#1D4ED8]">
                  Thông điệp của Ban lãnh đạo
                </span>
                <h2 className="mt-3 text-2xl font-black text-slate-900 sm:text-4xl">Thư Ngỏ</h2>
                <div className="mt-6 space-y-4 text-sm leading-7 text-slate-600 sm:text-base">
                  <p className="font-bold text-slate-900">Kính gửi Quý Khách hàng và Quý Đối tác,</p>
                  <p>
                    GTS xin gửi lời chào trân trọng và sự biết ơn chân thành tới Quý vị vì niềm tin và sự đồng hành trong suốt hành trình phát triển. Chúng tôi luôn xem mỗi mối quan hệ là một tài sản quý giá và mỗi dự án là một cam kết phải được thực hiện bằng trách nhiệm cao nhất.
                  </p>
                  <p>
                    Với tinh thần không ngừng cải tiến và đổi mới, GTS không chỉ hướng đến việc cung cấp thiết bị, giải pháp công nghệ chất lượng mà còn mong muốn xây dựng những quan hệ hợp tác bền vững. Sự ổn định trong vận hành và thành công của khách hàng chính là động lực để đội ngũ GTS hoàn thiện mình mỗi ngày.
                  </p>
                  <p>
                    Chúng tôi tin rằng sự minh bạch, năng lực kỹ thuật và tinh thần đồng hành sẽ tiếp tục là nền tảng để GTS mang lại giá trị lâu dài cho khách hàng và cộng đồng doanh nghiệp Việt Nam.
                  </p>
                </div>
                <div className="mt-8 border-t border-slate-200 pt-6">
                  <p className="font-black text-slate-900">Ban Giám đốc GTS</p>
                  <p className="mt-1 text-xs text-slate-500">
                    Công ty TNHH Giải Pháp Công Nghệ &amp; Dịch Vụ Toàn Cầu
                  </p>
                </div>
              </div>
            </div>
          </section>


          {/* Call to action */}
          <section className="layout-container">
            <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-[#1D4ED8] to-[#0F3A8A] p-8 text-white shadow-xl sm:p-12">
              <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
                <div className="lg:col-span-7">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-blue-100">
                    <Rocket className="h-4 w-4" />
                    Bắt đầu dự án của bạn
                  </div>
                  <h2 className="mt-4 text-2xl font-black sm:text-4xl">
                    Cần Tư Vấn Giải Pháp Hạ Tầng Mạng?
                  </h2>
                  <p className="mt-4 max-w-2xl text-sm leading-7 text-blue-100/80">
                    Đội ngũ kỹ sư GTS sẵn sàng khảo sát, tư vấn thiết kế và xây dựng phương án phù hợp với nhu cầu vận hành và ngân sách của doanh nghiệp.
                  </p>
                  <div className="mt-7 flex flex-wrap gap-3">
                    <Link href="/lien-he" className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-black text-[#1D4ED8] transition-colors hover:bg-blue-50">
                      Yêu cầu tư vấn
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                    <a href={`tel:${hotline.replace(/\s/g, '')}`} className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-black text-white transition-colors hover:bg-white/20">
                      <Phone className="h-4 w-4" />
                      {hotline}
                    </a>
                  </div>
                </div>

                <div className="space-y-3 lg:col-span-5">
                  {[
                    { icon: Phone, label: 'Hotline', value: hotline },
                    { icon: Mail, label: 'Email', value: email },
                    { icon: MapPin, label: 'Địa chỉ', value: address },
                  ].map((item) => (
                    <div key={item.label} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
                      <item.icon className="mt-0.5 h-5 w-5 shrink-0 text-cyan-300" />
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-blue-200">{item.label}</p>
                        <p className="mt-1 break-words text-sm font-semibold text-white">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </main>
  )
}
