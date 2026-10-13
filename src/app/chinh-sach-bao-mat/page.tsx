import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight, ShieldCheck, PhoneCall } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Chính sách bảo mật',
  description:
    'Chính sách bảo mật thông tin khách hàng của GTS - Global Technology & Service: cách thu thập, sử dụng và bảo vệ dữ liệu cá nhân.',
}

interface PolicySection {
  id: string
  title: string
  paragraphs: string[]
  bullets?: string[]
}

/**
 * Cấu trúc nội dung Chính sách bảo mật.
 * Nội dung mang tính khung tham khảo, doanh nghiệp bổ sung/điều chỉnh
 * cho đúng thông tin chính thức trước khi phát hành.
 */
const sections: PolicySection[] = [
  {
    id: 'thu-thap',
    title: '1. Thông tin chúng tôi thu thập',
    paragraphs: [
      'GTS thu thập các thông tin cần thiết để cung cấp dịch vụ và hỗ trợ khách hàng, bao gồm thông tin do Quý khách chủ động cung cấp và dữ liệu phát sinh khi sử dụng website.',
    ],
    bullets: [
      'Thông tin liên hệ: họ tên, số điện thoại, email, tên doanh nghiệp.',
      'Nội dung yêu cầu báo giá, tư vấn hoặc hỗ trợ kỹ thuật.',
      'Dữ liệu kỹ thuật cơ bản: địa chỉ IP, loại trình duyệt, trang đã truy cập.',
    ],
  },
  {
    id: 'muc-dich',
    title: '2. Mục đích sử dụng thông tin',
    paragraphs: [
      'Thông tin được sử dụng nhằm phục vụ hoạt động kinh doanh hợp pháp và nâng cao chất lượng dịch vụ.',
    ],
    bullets: [
      'Tiếp nhận, xử lý yêu cầu báo giá và chăm sóc khách hàng.',
      'Thực hiện hợp đồng, giao nhận và hỗ trợ bảo hành.',
      'Cải thiện trải nghiệm website và nội dung phù hợp.',
    ],
  },
  {
    id: 'chia-se',
    title: '3. Chia sẻ thông tin',
    paragraphs: [
      'GTS không mua bán thông tin cá nhân của khách hàng. Thông tin chỉ được chia sẻ trong phạm vi cần thiết với đối tác vận chuyển, hãng sản xuất hoặc khi có yêu cầu hợp pháp từ cơ quan nhà nước.',
    ],
  },
  {
    id: 'bao-mat',
    title: '4. Lưu trữ & bảo mật dữ liệu',
    paragraphs: [
      'Dữ liệu được lưu trữ trên hệ thống có biện pháp bảo vệ kỹ thuật và quản trị phù hợp nhằm hạn chế truy cập trái phép, mất mát hoặc rò rỉ.',
    ],
  },
  {
    id: 'cookie',
    title: '5. Cookie & công nghệ theo dõi',
    paragraphs: [
      'Website có thể sử dụng cookie để ghi nhớ tùy chọn và phân tích lưu lượng truy cập. Quý khách có thể điều chỉnh cài đặt cookie trên trình duyệt của mình.',
    ],
  },
  {
    id: 'quyen-nguoi-dung',
    title: '6. Quyền của khách hàng',
    paragraphs: [
      'Quý khách có quyền yêu cầu truy cập, chỉnh sửa hoặc xóa thông tin cá nhân của mình trong phạm vi pháp luật cho phép.',
    ],
  },
  {
    id: 'thay-doi',
    title: '7. Thay đổi chính sách',
    paragraphs: [
      'Chính sách bảo mật có thể được cập nhật theo thời gian. Phiên bản mới có hiệu lực kể từ thời điểm đăng tải trên website.',
    ],
  },
  {
    id: 'lien-he',
    title: '8. Liên hệ',
    paragraphs: [
      'Mọi yêu cầu liên quan đến dữ liệu cá nhân và quyền riêng tư, Quý khách vui lòng liên hệ bộ phận chăm sóc khách hàng của GTS.',
    ],
  },
]


export default function PrivacyPage() {
  return (
    <div className="bg-[#F8FAFC] py-10 sm:py-14">
      <div className="max-w-[1000px] mx-auto px-4">
        <nav className="flex items-center gap-1.5 text-xs text-gray-500 mb-6 font-inter">
          <Link href="/" className="hover:text-[#0077CC] transition-colors">
            Trang chủ
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-gray-800 font-medium">Chính sách bảo mật</span>
        </nav>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-10 shadow-sm">
          <div className="flex items-start gap-4 pb-6 mb-8 border-b border-gray-100">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#0077CC] flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">
                Chính sách bảo mật
              </h1>
              <p className="text-sm text-gray-500 mt-2 font-inter">
                Cập nhật gần nhất: đang chờ ban hành chính thức. Vui lòng liên hệ GTS để nhận bản chính sách có hiệu lực.
              </p>
            </div>
          </div>

          <div className="space-y-8">
            {sections.map((section) => (
              <section key={section.id} id={section.id} className="scroll-mt-24">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">
                  {section.title}
                </h2>
                <div className="space-y-3 font-inter text-[15px] leading-relaxed text-gray-600">
                  {section.paragraphs.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                  {section.bullets && (
                    <ul className="list-disc pl-5 space-y-1.5 marker:text-[#0077CC]">
                      {section.bullets.map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </section>
            ))}
          </div>

          <div className="mt-10 pt-8 border-t border-gray-100 bg-emerald-50/40 -mx-6 -mb-6 sm:-mx-10 sm:-mb-10 p-6 sm:p-8 rounded-b-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-gray-900">
                Có câu hỏi về quyền riêng tư & dữ liệu?
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 mt-1 font-inter">
                GTS cam kết bảo vệ thông tin của Quý khách và sẵn sàng hỗ trợ mọi yêu cầu.
              </p>
            </div>
            <Link
              href="/lien-he"
              className="inline-flex items-center gap-2 bg-[#0077CC] hover:bg-[#004A80] text-white px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all whitespace-nowrap shadow-sm hover:shadow"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Liên hệ GTS</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}