import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight, FileText, PhoneCall } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Quy định & Điều khoản sử dụng',
  description:
    'Quy định và điều khoản sử dụng website, dịch vụ của GTS - Global Technology & Service dành cho khách hàng doanh nghiệp.',
}

interface PolicySection {
  id: string
  title: string
  paragraphs: string[]
  bullets?: string[]
}

/**
 * Cấu trúc nội dung Quy định & Điều khoản.
 * Nội dung mang tính khung tham khảo, doanh nghiệp bổ sung/điều chỉnh
 * cho đúng thông tin pháp lý chính thức trước khi phát hành.
 */
const sections: PolicySection[] = [
  {
    id: 'pham-vi',
    title: '1. Phạm vi áp dụng',
    paragraphs: [
      'Các điều khoản dưới đây áp dụng cho việc truy cập và sử dụng website cũng như các dịch vụ do GTS cung cấp. Khi tiếp tục sử dụng, Quý khách được xem là đã đọc, hiểu và đồng ý với các quy định này.',
    ],
  },
  {
    id: 'tai-khoan',
    title: '2. Tài khoản & trách nhiệm người dùng',
    paragraphs: [
      'Quý khách chịu trách nhiệm bảo mật thông tin tài khoản (nếu có) và toàn bộ hoạt động phát sinh dưới tài khoản của mình.',
    ],
    bullets: [
      'Cung cấp thông tin chính xác, đầy đủ khi đăng ký hoặc gửi yêu cầu báo giá.',
      'Không sử dụng website vào mục đích vi phạm pháp luật hoặc gây ảnh hưởng đến hệ thống.',
      'Thông báo kịp thời cho GTS khi phát hiện truy cập trái phép.',
    ],
  },
  {
    id: 'don-hang',
    title: '3. Đặt hàng, báo giá & thanh toán',
    paragraphs: [
      'Thông tin sản phẩm, giá và tình trạng hàng hóa trên website có thể thay đổi theo thực tế. Báo giá chính thức được xác nhận qua bộ phận kinh doanh của GTS.',
    ],
    bullets: [
      'Giá trị hợp đồng, phương thức và thời hạn thanh toán được thống nhất trên báo giá/hợp đồng.',
      'Đơn hàng được xem là xác lập khi hai bên xác nhận bằng văn bản hoặc email.',
    ],
  },
  {
    id: 'bao-hanh',
    title: '4. Bảo hành & dịch vụ kỹ thuật',
    paragraphs: [
      'Chính sách bảo hành, đổi trả và hỗ trợ kỹ thuật thực hiện theo quy định của từng hãng và cam kết dịch vụ của GTS.',
    ],
    bullets: [
      'Thiết bị chính hãng kèm đầy đủ chứng từ CO/CQ theo quy định.',
      'Thời hạn và điều kiện bảo hành chi tiết được nêu trong hợp đồng/phiếu bảo hành.',
    ],
  },
  {
    id: 'so-huu-tri-tue',
    title: '5. Quyền sở hữu trí tuệ',
    paragraphs: [
      'Toàn bộ nội dung, thương hiệu, logo và tài liệu trên website thuộc quyền sở hữu của GTS hoặc các bên liên quan. Nghiêm cấm sao chép, phân phối khi chưa được chấp thuận bằng văn bản.',
    ],
  },
  {
    id: 'gioi-han-trach-nhiem',
    title: '6. Giới hạn trách nhiệm',
    paragraphs: [
      'GTS nỗ lực bảo đảm thông tin chính xác nhưng không chịu trách nhiệm cho thiệt hại gián tiếp phát sinh từ việc sử dụng thông tin trên website ngoài phạm vi hợp đồng đã ký kết.',
    ],
  },
  {
    id: 'thay-doi-dieu-khoan',
    title: '7. Thay đổi điều khoản',
    paragraphs: [
      'GTS có thể cập nhật các điều khoản này theo thời gian. Phiên bản mới có hiệu lực kể từ thời điểm đăng tải trên website.',
    ],
  },
  {
    id: 'lien-he',
    title: '8. Thông tin liên hệ',
    paragraphs: [
      'Mọi thắc mắc liên quan đến quy định và điều khoản, Quý khách vui lòng liên hệ bộ phận chăm sóc khách hàng của GTS để được hỗ trợ.',
    ],
  },
]


export default function TermsPage() {
  return (
    <div className="bg-[#F8FAFC] py-10 sm:py-14">
      <div className="max-w-[1000px] mx-auto px-4">
        <nav className="flex items-center gap-1.5 text-xs text-gray-500 mb-6 font-inter">
          <Link href="/" className="hover:text-[#0077CC] transition-colors">
            Trang chủ
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-gray-800 font-medium">Quy định & Điều khoản</span>
        </nav>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-10 shadow-sm">
          <div className="flex items-start gap-4 pb-6 mb-8 border-b border-gray-100">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0077CC] flex items-center justify-center flex-shrink-0">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">
                Quy định & Điều khoản sử dụng
              </h1>
              <p className="text-sm text-gray-500 mt-2 font-inter">
                Cập nhật gần nhất: đang chờ ban hành chính thức. Vui lòng liên hệ GTS để nhận bản điều khoản có hiệu lực.
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

          <div className="mt-10 pt-8 border-t border-gray-100 bg-blue-50/50 -mx-6 -mb-6 sm:-mx-10 sm:-mb-10 p-6 sm:p-8 rounded-b-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-gray-900">
                Cần tư vấn thêm về điều khoản hợp tác?
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 mt-1 font-inter">
                Bộ phận kinh doanh GTS sẵn sàng giải đáp và cung cấp hợp đồng mẫu chi tiết.
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