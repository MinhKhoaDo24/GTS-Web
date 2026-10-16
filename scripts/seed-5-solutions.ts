import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
})

const initialSolutions = [
  {
    id: 'sol-wifi',
    name: 'WiFi Doanh nghiệp',
    slug: 'giai-phap-wifi',
    short_description: 'Phủ sóng WiFi 6/6E/7 roaming không gián đoạn cho văn phòng, khách sạn, nhà máy với mật độ hàng ngàn kết nối đồng thời.',
    description: `<h2>Tổng Quan Kiến Trúc Giải Pháp</h2>
<p>Giải pháp mạng không dây (Wireless LAN) chuyên dụng của GTS được xây dựng trên các nền tảng Access Point chuẩn WiFi 6/6E/7 tiên tiến từ Cisco Catalyst, HPE Aruba và Ubiquiti UniFi. Hệ thống sử dụng công nghệ roaming thông minh 802.11r/k/v giúp thiết bị chuyển vùng giữa các Access Point mượt mà không bị ngắt kết nối cuộc gọi VoIP hay video call. Đồng thời hỗ trợ phân quyền truy cập thông minh qua cổng chào Captive Portal, cách ly mạng nội bộ và mạng khách an toàn tuyệt đối.</p>
<h3>Các Thành Phần Cấu Thành Hệ Thống</h3>
<ul>
  <li>Access Point chuẩn WiFi 6/7 chịu tải cao từ 200 - 500+ client/AP</li>
  <li>Hệ thống điều khiển tập trung Cloud Controller hoặc Hardware Controller dự phòng HA</li>
  <li>Hạ tầng chuyển mạch Switch PoE+ / PoE++ chuẩn Multi-Gigabit 2.5G/5Gbps</li>
  <li>Cổng xác thực Captive Portal phân quyền truy cập người dùng và khách hàng</li>
</ul>
<h3>Lợi Ích Doanh Nghiệp Nhận Được</h3>
<ul>
  <li>Phủ sóng không góc chết, tự động điều chỉnh kênh và công suất phát RF thông minh</li>
  <li>Bảo mật chuẩn WPA3-Enterprise, chống giả mạo điểm phát Rogue AP</li>
  <li>Báo cáo trực quan lưu lượng sử dụng và trải nghiệm người dùng theo thời gian thực</li>
  <li>Tiết kiệm chi phí triển khai và dễ dàng mở rộng thêm Access Point khi cần</li>
</ul>`,
    sort_order: 1,
    is_featured: true,
    is_active: true,
    seo_title: 'Giải Pháp WiFi Doanh Nghiệp Mật Độ Cao | GTS',
    seo_description: 'Phủ sóng WiFi 6/6E/7 roaming không gián đoạn cho văn phòng, khách sạn, nhà máy với mật độ hàng ngàn kết nối đồng thời.',
  },
  {
    id: 'sol-mang',
    name: 'Mạng Core / LAN / WAN',
    slug: 'giai-phap-mang',
    short_description: 'Hạ tầng mạng tốc độ 10G/40G/100G với độ trễ cực thấp và dự phòng đường truyền High Availability cho tòa nhà, văn phòng và trung tâm dữ liệu.',
    description: `<h2>Tổng Quan Kiến Trúc Giải Pháp</h2>
<p>Hạ tầng chuyển mạch (Switching) là xương sống của mọi hệ thống thông tin. GTS thiết kế mạng Core/Distribution theo kiến trúc 2 tầng hoặc Spine-Leaf hiện đại, sử dụng các dòng Switch Enterprise (Cisco Catalyst 9000, Ruijie Reyee, HPE Aruba CX). Toàn bộ hệ thống được trang bị tính năng ghép cụm Stacking / VSL / MLAG, dự phòng nguồn kép và đường truyền quang đa hướng, đảm bảo khi một tuyến cáp hay thiết bị gặp sự cố thì mạng vẫn hoạt động liền mạch với thời gian chuyển mạch dưới 50ms.</p>
<h3>Các Thành Phần Cấu Thành Hệ Thống</h3>
<ul>
  <li>Lớp Core Switch tốc độ cổng quang 10G/40G/100G băng thông chuyển mạch terabit</li>
  <li>Lớp Access Switch hỗ trợ cổng Gigabit, PoE+ cấp nguồn camera và Access Point</li>
  <li>Kết nối dự phòng Stacking / LACP phân tải thông minh trên từng tuyến cáp</li>
  <li>Hệ thống quản lý giám sát trạng thái mạng tự động cảnh báo sự cố</li>
</ul>
<h3>Lợi Ích Doanh Nghiệp Nhận Được</h3>
<ul>
  <li>Băng thông cực lớn, không nghẽn cổ chai khi lưu lượng dữ liệu truyền tải tăng vọt</li>
  <li>Khả năng sẵn sàng 99.999% (Five Nines), không xảy ra Single Point of Failure</li>
  <li>Phân chia VLAN bảo mật nghiêm ngặt giữa các phòng ban và máy chủ</li>
  <li>Bảo hành chính hãng kèm dịch vụ hỗ trợ kỹ thuật tại chỗ</li>
</ul>`,
    sort_order: 2,
    is_featured: true,
    is_active: true,
    seo_title: 'Giải Pháp Mạng Core / LAN / WAN Doanh Nghiệp | GTS',
    seo_description: 'Hạ tầng chuyển mạch tốc độ cao 10G/40G/100G với độ trễ cực thấp và dự phòng đường truyền High Availability.',
  },
  {
    id: 'sol-bao-mat',
    name: 'Bảo mật Firewall NGFW',
    slug: 'giai-phap-bao-mat',
    short_description: 'Tường lửa thế hệ mới ngăn chặn mã độc Ransomware, lọc nội dung web, phòng chống xâm nhập IPS và kết nối VPN an toàn.',
    description: `<h2>Tổng Quan Kiến Trúc Giải Pháp</h2>
<p>Trước các nguy cơ tấn công mạng ngày càng tinh vi, giải pháp an ninh của GTS kết hợp tường lửa thế hệ mới (Fortinet FortiGate, Sophos XGS) với kiến trúc bảo mật Zero Trust ("Không tin tưởng ai, luôn xác minh"). Tường lửa thực hiện kiểm tra sâu gói tin SSL/TLS mà không làm suy giảm hiệu năng, phát hiện và tiêu diệt mã độc tống tiền (Ransomware), ngăn chặn rò rỉ dữ liệu (DLP) và thiết lập kênh truyền VPN mã hóa chuẩn quân đội cho nhân sự làm việc từ xa.</p>
<h3>Các Thành Phần Cấu Thành Hệ Thống</h3>
<ul>
  <li>Thiết bị Firewall Next-Gen (NGFW) cụm dự phòng High Availability (Active-Passive)</li>
  <li>Công nghệ AI Sandboxing phân tích tệp lạ ngăn chặn tấn công Zero-day</li>
  <li>Hệ thống phát hiện và ngăn chặn xâm nhập trái phép (IPS / IDS)</li>
  <li>Hạ tầng VPN SSL / IPsec bảo mật đa yếu tố (MFA / 2FA) cho nhân sự làm việc từ xa</li>
</ul>
<h3>Lợi Ích Doanh Nghiệp Nhận Được</h3>
<ul>
  <li>Kiểm soát toàn diện các ứng dụng truy cập mạng (Facebook, YouTube, Torrent...)</li>
  <li>Bảo vệ dữ liệu nhạy cảm của doanh nghiệp trước các cuộc tấn công đánh cắp dữ liệu</li>
  <li>Đáp ứng đầy đủ các tiêu chuẩn kiểm toán an ninh thông tin ISO 27001 và ngân hàng</li>
  <li>Báo cáo chi tiết các nguy cơ và lưu lượng tấn công theo chu kỳ hàng tuần/tháng</li>
</ul>`,
    sort_order: 3,
    is_featured: true,
    is_active: true,
    seo_title: 'Giải Pháp Bảo Mật Mạng Firewall NGFW & Zero Trust | GTS',
    seo_description: 'Tường lửa thế hệ mới ngăn chặn mã độc Ransomware, lọc nội dung web, phòng chống xâm nhập IPS và kết nối VPN an toàn.',
  },
  {
    id: 'sol-voip',
    name: 'Tổng đài VoIP & Call Center',
    slug: 'giai-phap-voip',
    short_description: 'Tiết kiệm 60% cước viễn thông, gọi nội bộ miễn phí trên toàn quốc, tích hợp Softphone trên smartphone và ghi âm cuộc gọi.',
    description: `<h2>Tổng Quan Kiến Trúc Giải Pháp</h2>
<p>GTS cung cấp hệ thống tổng đài IP PBX hiện đại từ Grandstream và Yeastar, thay thế hoàn toàn tổng đài analog cũ kỹ. Hệ thống cho phép doanh nghiệp kết nối không giới hạn các chi nhánh trên toàn quốc thông qua mạng Internet, mọi cuộc gọi nội bộ giữa các phòng ban đều hoàn toàn miễn phí. Hỗ trợ đầy đủ các tính năng thông minh: lời chào tự động IVR phân luồng cuộc gọi, ghi âm cuộc gọi chất lượng cao, hộp thư thoại gửi qua email và ứng dụng Softphone giúp nhân viên nghe gọi số cố định công ty ngay trên smartphone cá nhân.</p>
<h3>Các Thành Phần Cấu Thành Hệ Thống</h3>
<ul>
  <li>Tổng đài IP PBX phần cứng chuyên dụng hoặc Cloud IP PBX linh hoạt</li>
  <li>Điện thoại IP để bàn âm thanh HD Voice có cổng mạng Gigabit kèm PoE</li>
  <li>Đầu số cố định Siptrunk từ các nhà mạng VNPT, Viettel, FPT Telecom</li>
  <li>Ứng dụng Softphone cài đặt trên điện thoại di động iOS / Android và máy tính</li>
</ul>
<h3>Lợi Ích Doanh Nghiệp Nhận Được</h3>
<ul>
  <li>Giảm thiểu tối đa cước viễn thông hàng tháng của doanh nghiệp</li>
  <li>Không bỏ lỡ cuộc gọi của khách hàng nhờ tính năng chuyển cuộc gọi thông minh</li>
  <li>Nâng cao hình ảnh chuyên nghiệp của công ty với lời chào thương hiệu bài bản</li>
  <li>Dễ dàng mở rộng thêm máy nhánh mới trong vài phút mà không cần kéo thêm dây điện thoại</li>
</ul>`,
    sort_order: 4,
    is_featured: true,
    is_active: true,
    seo_title: 'Giải Pháp Tổng Đài VoIP & Truyền Thông Hợp Nhất | GTS',
    seo_description: 'Tiết kiệm 60% cước viễn thông, gọi nội bộ miễn phí trên toàn quốc, tích hợp Softphone trên smartphone và ghi âm cuộc gọi.',
  },
  {
    id: 'sol-hoi-nghi',
    name: 'Hội nghị truyền hình',
    slug: 'giai-phap-hoi-nghi',
    short_description: 'Phòng họp thông minh 4K Teams/Zoom chuyên dụng với camera tự động bắt người nói và micro lọc ồn thông minh.',
    description: `<h2>Tổng Quan Kiến Trúc Giải Pháp</h2>
<p>GTS thiết kế và lắp đặt trọn gói hệ thống hội nghị truyền hình (Video Conference) cho các phòng họp từ nhỏ (Huddle room) đến hội trường lớn 50-100 người. Hệ thống tích hợp camera 4K Ultra HD góc rộng với công nghệ AI tự động nhận diện và phóng to người đang phát biểu (Auto-framing & Speaker Tracking), kết hợp hệ thống micro mảng đa hướng triệt tiêu tiếng vọng và tiếng ồn xung quanh. Tương thích hoàn hảo với các nền tảng họp trực tuyến hàng đầu: Microsoft Teams Rooms, Zoom Rooms, Cisco Webex, Google Meet.</p>
<h3>Các Thành Phần Cấu Thành Hệ Thống</h3>
<ul>
  <li>Camera hội nghị truyền hình 4K công nghệ AI bắt khung hình tự động</li>
  <li>Soundbar tích hợp micro mảng đa hướng và loa tái tạo giọng nói trung thực</li>
  <li>Màn hình hiển thị chuyên dụng độ sáng cao hoạt động bền bỉ</li>
  <li>Bộ điều khiển cảm ứng đặt bàn (Touch Controller) thao tác 1 chạm bắt đầu cuộc họp</li>
</ul>
<h3>Lợi Ích Doanh Nghiệp Nhận Được</h3>
<ul>
  <li>Chất lượng hình ảnh và âm thanh sắc nét, xóa nhòa khoảng cách địa lý</li>
  <li>Thao tác cực kỳ đơn giản, không mất thời gian đấu nối cáp phức tạp trước cuộc họp</li>
  <li>Chia sẻ màn hình và tài liệu thuyết trình không dây mượt mà</li>
  <li>Tối ưu chi phí đi lại và tăng tốc độ ra quyết định trong nội bộ doanh nghiệp</li>
</ul>`,
    sort_order: 5,
    is_featured: true,
    is_active: true,
    seo_title: 'Giải Pháp Phòng Họp Hội Nghị Truyền Hình Thông Minh | GTS',
    seo_description: 'Phòng họp trực tuyến 4K chuyên dụng cho Microsoft Teams, Zoom Rooms với camera tự động bắt người nói và micro lọc ồn.',
  },
]

async function seed() {
  console.log('--- Đang đồng bộ 5 giải pháp vào database ---')
  for (const sol of initialSolutions) {
    const existing = await pool.query('SELECT id FROM solutions WHERE id = $1 OR slug = $2', [sol.id, sol.slug])
    if (existing.rows.length > 0) {
      await pool.query(
        `UPDATE solutions SET
          name = $2,
          slug = $3,
          short_description = $4,
          description = $5,
          sort_order = $6,
          is_featured = $7,
          is_active = $8,
          seo_title = $9,
          seo_description = $10,
          updated_at = NOW()
        WHERE id = $1`,
        [
          existing.rows[0].id,
          sol.name,
          sol.slug,
          sol.short_description,
          sol.description,
          sol.sort_order,
          sol.is_featured,
          sol.is_active,
          sol.seo_title,
          sol.seo_description,
        ]
      )
      console.log(`Đã cập nhật giải pháp: ${sol.name} (${sol.slug})`)
    } else {
      await pool.query(
        `INSERT INTO solutions (
          id, domain_id, name, slug, short_description, description,
          sort_order, is_featured, is_active, seo_title, seo_description
        ) VALUES (
          $1, NULL, $2, $3, $4, $5, $6, $7, $8, $9, $10
        )`,
        [
          sol.id,
          sol.name,
          sol.slug,
          sol.short_description,
          sol.description,
          sol.sort_order,
          sol.is_featured,
          sol.is_active,
          sol.seo_title,
          sol.seo_description,
        ]
      )
      console.log(`Đã tạo mới giải pháp: ${sol.name} (${sol.slug})`)
    }
  }

  const result = await pool.query('SELECT id, name, slug, sort_order, is_active FROM solutions ORDER BY sort_order ASC')
  console.log('Tổng số giải pháp trong database:', result.rowCount)
  console.table(result.rows)
  await pool.end()
}

seed().catch(err => {
  console.error('Lỗi khi seed:', err)
  process.exit(1)
})
