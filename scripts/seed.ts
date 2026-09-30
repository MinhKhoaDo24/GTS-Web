try {
  process.loadEnvFile?.('.env')
} catch {}

import bcrypt from 'bcryptjs'
import { pool, query, queryOne } from '../src/lib/db'

async function seed() {
  console.log('🌱 Seeding database using raw SQL...')

  // 1. Categories
  const categoryDefs = [
    {
      name: 'Switch / Bộ chuyển mạch',
      slug: 'switch',
      description: 'Switch mạng doanh nghiệp, managed/unmanaged từ các hãng hàng đầu',
    },
    {
      name: 'WiFi / Access Point',
      slug: 'wifi-access-point',
      description: 'Thiết bị phát sóng WiFi doanh nghiệp, chuẩn WiFi 6/6E',
    },
    {
      name: 'Router / Firewall',
      slug: 'router-firewall',
      description: 'Thiết bị định tuyến và bảo mật mạng doanh nghiệp',
    },
    {
      name: 'VoIP / Điện thoại IP',
      slug: 'voip-phone',
      description: 'Điện thoại IP, tổng đài VoIP cho doanh nghiệp',
    },
  ]

  const categoryMap: Record<string, number> = {}
  for (const cat of categoryDefs) {
    const res = await queryOne<{ id: number }>(
      `INSERT INTO categories (name, slug, description)
       VALUES ($1, $2, $3)
       ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description
       RETURNING id`,
      [cat.name, cat.slug, cat.description]
    )
    if (res) categoryMap[cat.slug] = res.id
  }
  console.log('✅ Categories seeded:', Object.keys(categoryMap).length)

  // 2. Brands
  const brandDefs = [
    {
      name: 'Cisco',
      slug: 'cisco',
      logo: '/uploads/brands/cisco.webp',
      website: 'https://www.cisco.com',
    },
    {
      name: 'Ubiquiti',
      slug: 'ubiquiti',
      logo: '/uploads/brands/ubiquiti.webp',
      website: 'https://www.ui.com',
    },
    {
      name: 'Ruijie',
      slug: 'ruijie',
      logo: '/uploads/brands/ruijie.webp',
      website: 'https://www.ruijie.com.vn',
    },
    {
      name: 'Fortinet',
      slug: 'fortinet',
      logo: '/uploads/brands/fortinet.webp',
      website: 'https://www.fortinet.com',
    },
    {
      name: 'Grandstream',
      slug: 'grandstream',
      logo: '/uploads/brands/grandstream.webp',
      website: 'https://www.grandstream.com',
    },
  ]

  const brandMap: Record<string, number> = {}
  for (const b of brandDefs) {
    const res = await queryOne<{ id: number }>(
      `INSERT INTO brands (name, slug, logo, website)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, logo = EXCLUDED.logo, website = EXCLUDED.website
       RETURNING id`,
      [b.name, b.slug, b.logo, b.website]
    )
    if (res) brandMap[b.slug] = res.id
  }
  console.log('✅ Brands seeded:', Object.keys(brandMap).length)

  // 3. Products
  const switchDesc = `
<h2>Tổng quan sản phẩm</h2>
<p>Cisco Catalyst 9200L là switch Layer 3 thuộc dòng Catalyst 9000 — thế hệ switch doanh nghiệp hàng đầu của Cisco, được thiết kế tối ưu cho môi trường mạng doanh nghiệp vừa và lớn. Với khả năng cấp nguồn PoE+ lên đến <strong>240W</strong>, thiết bị này đáp ứng dễ dàng cho hệ thống IP Camera, Access Point WiFi 6 và điện thoại IP toàn tòa nhà.</p>
<h2>Tính năng nổi bật</h2>
<ul>
  <li>Hỗ trợ Cisco DNA Center — quản lý tập trung, tự động hóa chính sách mạng</li>
  <li>Tích hợp Cisco TrustSec (SGT) và MACsec 128-bit cho bảo mật lớp 2</li>
  <li>Hỗ trợ VXLAN EVPN khi kết hợp với Catalyst 9000 fabric</li>
  <li>Khả năng netflow linh hoạt phục vụ phân tích lưu lượng</li>
</ul>`

  const wifiDesc = `
<h2>Giới thiệu</h2>
<p>UniFi U6 Pro là Access Point WiFi 6 cao cấp của Ubiquiti, lý tưởng cho môi trường văn phòng mật độ người dùng cao. Thiết bị hỗ trợ <strong>4x4 MU-MIMO</strong> với tốc độ lên đến <strong>5.3 Gbps</strong> tổng hợp hai băng tần.</p>
<h2>Điểm mạnh</h2>
<ul>
  <li>Phủ sóng rộng: bán kính lên đến 40m trong không gian mở</li>
  <li>Hỗ trợ tới <strong>300+ clients</strong> đồng thời mà không suy giảm hiệu năng</li>
  <li>Quản lý tập trung qua UniFi Network Controller (On-premise hoặc Cloud)</li>
  <li>Tự động tối ưu kênh (Band Steering, Airtime Fairness)</li>
  <li>Cấp nguồn qua PoE+ (802.3at), không cần nguồn điện riêng</li>
</ul>`

  const products = [
    {
      categorySlug: 'switch',
      brandSlug: 'cisco',
      name: 'Cisco Catalyst C9200L-24P-4G',
      slug: 'cisco-catalyst-c9200l-24p-4g',
      sku: 'C9200L-24P-4G-A',
      price: 42500000,
      summary: 'Switch Layer 3, 24 cổng PoE+ (240W), 4 uplink SFP 1G, hỗ trợ Cisco DNA Center. Lý tưởng cho doanh nghiệp vừa cần hạ tầng mạng ổn định và bảo mật cao.',
      description: switchDesc,
      images: JSON.stringify(['/uploads/products/cisco-c9200l-1.webp', '/uploads/products/cisco-c9200l-2.webp']),
      specs: JSON.stringify({
        'Số cổng LAN': '24x 10/100/1000 Mbps PoE+',
        'Số cổng Uplink': '4x SFP 1G',
        'PoE Budget': '240W',
        'Switching Capacity': '128 Gbps',
        'Forwarding Rate': '95.23 Mpps',
        'RAM': '4 GB',
        'Flash': '16 GB',
        'Nguồn điện': 'AC 100-240V',
        'Kích thước': '1U Rack (44.5 x 445 x 260 mm)',
        'Trọng lượng': '3.6 kg',
        'Bảo hành': '12 tháng chính hãng',
      }),
      isActive: true,
      isFeatured: true,
    },
    {
      categorySlug: 'wifi-access-point',
      brandSlug: 'ubiquiti',
      name: 'Ubiquiti UniFi U6 Pro',
      slug: 'ubiquiti-unifi-u6-pro',
      sku: 'U6-PRO',
      price: 4200000,
      summary: 'Access Point WiFi 6, 4x4 MU-MIMO, tốc độ 5.3 Gbps, hỗ trợ 300+ clients, quản lý qua UniFi Controller.',
      description: wifiDesc,
      images: JSON.stringify(['/uploads/products/ubiquiti-u6-pro-1.webp']),
      specs: JSON.stringify({
        'Chuẩn WiFi': 'WiFi 6 (802.11ax)',
        'Băng tần': 'Dual Band (2.4GHz + 5GHz)',
        'Tốc độ tối đa': '5.3 Gbps (tổng 2 băng)',
        'Ăng-ten': '4x4 MU-MIMO (5GHz), 4x4 MIMO (2.4GHz)',
        'Số client tối đa': '300+',
        'Nguồn cấp': 'PoE+ (802.3at, 22W)',
        'Giao tiếp': '1x RJ45 2.5G',
        'Bán kính phủ sóng': '~40m (không gian mở)',
        'Bảo hành': '12 tháng chính hãng',
      }),
      isActive: true,
      isFeatured: true,
    },
    {
      categorySlug: 'switch',
      brandSlug: 'ruijie',
      name: 'Ruijie RG-S5310-24GT4XS',
      slug: 'ruijie-rg-s5310-24gt4xs',
      sku: 'RG-S5310-24GT4XS',
      price: null,
      summary: 'Switch Layer 3, 24 cổng Gigabit + 4 uplink 10G SFP+. Giải pháp mạng lõi cho doanh nghiệp vừa, hỗ trợ VLAN, OSPF, BGP.',
      description: '<p>Ruijie RG-S5310-24GT4XS là switch Layer 3 hiệu năng cao, thiết kế cho mạng lõi doanh nghiệp.</p>',
      images: JSON.stringify(['/uploads/products/ruijie-s5310-1.webp']),
      specs: JSON.stringify({
        'Số cổng LAN': '24x 10/100/1000 Mbps',
        'Số cổng Uplink': '4x SFP+ 10G',
        'Switching Capacity': '128 Gbps',
        'Routing': 'OSPF, BGP, RIP, IS-IS',
        'Nguồn điện': 'AC 100-240V',
        'Kích thước': '1U Rack',
        'Bảo hành': '12 tháng',
      }),
      isActive: true,
      isFeatured: false,
    },
    {
      categorySlug: 'router-firewall',
      brandSlug: 'fortinet',
      name: 'Fortinet FortiGate 60F',
      slug: 'fortinet-fortigate-60f',
      sku: 'FG-60F',
      price: null,
      summary: 'NGFW (Next-Generation Firewall) dành cho văn phòng vừa, throughput 10 Gbps, tích hợp SD-WAN, IPS.',
      description: '<p>FortiGate 60F là thiết bị NGFW compact hiệu năng cao của Fortinet, tích hợp đầy đủ các tính năng bảo mật thế hệ tiếp theo.</p>',
      images: JSON.stringify(['/uploads/products/fortigate-60f-1.webp']),
      specs: JSON.stringify({
        'Firewall Throughput': '10 Gbps',
        'IPS Throughput': '1.4 Gbps',
        'NGFW Throughput': '1 Gbps',
        'Cổng WAN': '2x GE RJ45',
        'Cổng LAN': '7x GE RJ45',
        'Người dùng khuyến nghị': '50 – 200',
        'SD-WAN': 'Tích hợp sẵn',
        'Bảo hành': '12 tháng + FortiCare',
      }),
      isActive: true,
      isFeatured: true,
    },
    {
      categorySlug: 'voip-phone',
      brandSlug: 'grandstream',
      name: 'Grandstream GXP2170',
      slug: 'grandstream-gxp2170',
      sku: 'GXP2170',
      price: 1850000,
      summary: 'Điện thoại IP cao cấp 12 tài khoản SIP, màn hình màu 4.3", hỗ trợ PoE, Bluetooth, USB.',
      description: '<p>GXP2170 là điện thoại IP flagship của Grandstream dành cho môi trường doanh nghiệp chuyên nghiệp.</p>',
      images: JSON.stringify(['/uploads/products/gxp2170-1.webp']),
      specs: JSON.stringify({
        'Tài khoản SIP': '12',
        'Màn hình': '4.3" TFT màu (480x272)',
        'Phím tốc độ': '48 phím DSS/BLF lập trình',
        'Bluetooth': 'v4.0',
        'USB': '2x USB 2.0',
        'Bảo hành': '12 tháng chính hãng',
      }),
      isActive: true,
      isFeatured: false,
    },
    {
      categorySlug: 'switch',
      brandSlug: 'cisco',
      name: 'Cisco SG350-28P',
      slug: 'cisco-sg350-28p',
      sku: 'SG350-28P-K9-EU',
      price: 12500000,
      summary: 'Switch managed Layer 2/3, 24 cổng PoE+ (195W), 2 cổng combo SFP, lý tưởng cho SMB cần PoE cho camera và điện thoại IP.',
      description: '<p>Cisco SG350-28P là lựa chọn lý tưởng cho doanh nghiệp nhỏ và vừa cần switch managed với PoE+.</p>',
      images: JSON.stringify(['/uploads/products/cisco-sg350-28p-1.webp']),
      specs: JSON.stringify({
        'Số cổng': '24x GE PoE+ + 2x GE Combo SFP + 2x SFP',
        'PoE Budget': '195W',
        'Switching Capacity': '56 Gbps',
        'Bảo hành': '12 tháng',
      }),
      isActive: true,
      isFeatured: true,
    },
  ]

  for (const p of products) {
    const catId = categoryMap[p.categorySlug]
    const brandId = brandMap[p.brandSlug]
    if (!catId || !brandId) continue

    await query(
      `INSERT INTO products (category_id, brand_id, name, slug, sku, price, summary, description, images, specs, is_active, is_featured)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       ON CONFLICT (slug) DO UPDATE SET
         category_id = EXCLUDED.category_id,
         brand_id = EXCLUDED.brand_id,
         name = EXCLUDED.name,
         sku = EXCLUDED.sku,
         price = EXCLUDED.price,
         summary = EXCLUDED.summary,
         description = EXCLUDED.description,
         images = EXCLUDED.images,
         specs = EXCLUDED.specs,
         is_active = EXCLUDED.is_active,
         is_featured = EXCLUDED.is_featured`,
      [
        catId,
        brandId,
        p.name,
        p.slug,
        p.sku,
        p.price,
        p.summary,
        p.description,
        p.images,
        p.specs,
        p.isActive,
        p.isFeatured,
      ]
    )
  }
  console.log('✅ Products seeded:', products.length)

  // 4. Static Pages
  const pages = [
    {
      slug: 'gioi-thieu',
      title: 'Giới thiệu về GTS',
      seoTitle: 'Giới thiệu GTS - Global Technology & Service',
      seoDescription: 'GTS là đơn vị phân phối và cung cấp giải pháp hạ tầng mạng, thiết bị phần cứng B2B hàng đầu tại Việt Nam.',
      content: `<h2>Về chúng tôi</h2><p>GTS - Global Technology & Service là công ty hoạt động trong lĩnh vực <strong>phân phối và cung cấp giải pháp hạ tầng mạng, thiết bị phần cứng B2B</strong> tại Việt Nam. Với hơn 10 năm kinh nghiệm, chúng tôi tự hào là đối tác tin cậy của hàng trăm doanh nghiệp từ SMB đến Enterprise.</p><h2>Lĩnh vực hoạt động</h2><ul><li>Phân phối thiết bị mạng: Switch, Router, Firewall, WiFi, VoIP</li><li>Tư vấn thiết kế giải pháp hạ tầng mạng doanh nghiệp</li><li>Triển khai, cài đặt và cấu hình hệ thống</li><li>Bảo trì, hỗ trợ kỹ thuật định kỳ</li><li>Cung cấp spare part chính hãng</li></ul>`,
    },
    {
      slug: 'dich-vu-tu-van',
      title: 'Dịch vụ Tư vấn Giải pháp',
      seoTitle: 'Tư vấn giải pháp mạng doanh nghiệp - GTS',
      seoDescription: 'GTS tư vấn thiết kế giải pháp hạ tầng mạng tối ưu cho doanh nghiệp của bạn.',
      content: '<h2>Tư vấn giải pháp</h2><p>Đội ngũ kỹ sư giàu kinh nghiệm của GTS sẽ khảo sát, phân tích nhu cầu và đề xuất giải pháp hạ tầng mạng phù hợp nhất với quy mô và ngân sách của doanh nghiệp bạn.</p>',
    },
    {
      slug: 'dich-vu-trien-khai',
      title: 'Dịch vụ Triển khai & Cài đặt',
      seoTitle: 'Triển khai & Cài đặt hệ thống mạng - GTS',
      seoDescription: 'GTS triển khai, cài đặt và cấu hình hệ thống mạng doanh nghiệp chuyên nghiệp.',
      content: '<h2>Triển khai & Cài đặt</h2><p>Chúng tôi cung cấp dịch vụ triển khai hệ thống mạng end-to-end: từ lắp đặt phần cứng, cấu hình thiết bị, đến kiểm tra và nghiệm thu hệ thống đúng tiến độ.</p>',
    },
    {
      slug: 'dich-vu-bao-tri',
      title: 'Dịch vụ Bảo trì',
      seoTitle: 'Bảo trì hệ thống mạng định kỳ - GTS',
      seoDescription: 'GTS cung cấp dịch vụ bảo trì, hỗ trợ kỹ thuật hệ thống mạng 24/7.',
      content: '<h2>Bảo trì định kỳ</h2><p>GTS cung cấp gói bảo trì hệ thống mạng định kỳ với cam kết SLA rõ ràng, đảm bảo hệ thống của bạn luôn hoạt động ổn định và bảo mật.</p>',
    },
    {
      slug: 'dich-vu-spare-part',
      title: 'Spare Part chính hãng',
      seoTitle: 'Spare Part thiết bị mạng chính hãng - GTS',
      seoDescription: 'Cung cấp spare part, phụ kiện thiết bị mạng Cisco, Ubiquiti, Ruijie, Fortinet chính hãng.',
      content: '<h2>Spare Part chính hãng</h2><p>GTS cung cấp đa dạng spare part chính hãng cho các thiết bị mạng: module SFP/SFP+, dây quang, nguồn dự phòng, quạt tản nhiệt và nhiều linh kiện khác với bảo hành đầy đủ.</p>',
    },
    {
      slug: 'giai-phap-wifi',
      title: 'Giải pháp WiFi doanh nghiệp',
      seoTitle: 'Giải pháp WiFi doanh nghiệp - GTS',
      seoDescription: 'GTS triển khai giải pháp WiFi coverage toàn diện cho văn phòng, nhà máy, khách sạn, trường học.',
      content: '<h2>Giải pháp WiFi</h2><p>Chúng tôi thiết kế và triển khai hệ thống WiFi phủ sóng toàn diện cho mọi quy mô: văn phòng, tòa nhà, nhà máy, khách sạn và trường học với các giải pháp từ Ubiquiti UniFi, Ruijie Cloud, Cisco Meraki.</p>',
    },
    {
      slug: 'giai-phap-mang',
      title: 'Giải pháp Mạng doanh nghiệp',
      seoTitle: 'Giải pháp mạng doanh nghiệp - GTS',
      seoDescription: 'Thiết kế và triển khai hạ tầng mạng LAN/WAN/MPLS cho doanh nghiệp.',
      content: '<h2>Mạng doanh nghiệp</h2><p>GTS thiết kế hạ tầng mạng LAN/WAN hoàn chỉnh: từ mạng nội bộ tòa nhà đến kết nối đa chi nhánh qua MPLS/SD-WAN, đảm bảo băng thông, độ trễ thấp và dự phòng cao.</p>',
    },
    {
      slug: 'giai-phap-voip',
      title: 'Giải pháp VoIP',
      seoTitle: 'Giải pháp VoIP & tổng đài IP - GTS',
      seoDescription: 'Triển khai hệ thống tổng đài VoIP, điện thoại IP cho doanh nghiệp tiết kiệm chi phí.',
      content: '<h2>Giải pháp VoIP</h2><p>Thay thế tổng đài truyền thống bằng giải pháp VoIP hiện đại: tiết kiệm chi phí gọi nội bộ, tích hợp video call, presence, mobile app và nhiều tính năng UC khác.</p>',
    },
    {
      slug: 'giai-phap-hoi-nghi',
      title: 'Giải pháp Hội nghị truyền hình',
      seoTitle: 'Hội nghị truyền hình doanh nghiệp - GTS',
      seoDescription: 'Giải pháp hội nghị truyền hình chuyên nghiệp cho phòng họp doanh nghiệp.',
      content: '<h2>Hội nghị truyền hình</h2><p>GTS cung cấp giải pháp hội nghị truyền hình toàn diện cho phòng họp: từ camera PTZ, codec hội nghị đến hệ thống âm thanh chuyên nghiệp tích hợp Microsoft Teams, Zoom, Cisco Webex.</p>',
    },
    {
      slug: 'giai-phap-bao-mat',
      title: 'Giải pháp Bảo mật mạng',
      seoTitle: 'Giải pháp bảo mật mạng doanh nghiệp - GTS',
      seoDescription: 'Bảo mật hạ tầng mạng với Firewall NGFW, IPS, VPN, Zero Trust.',
      content: '<h2>Bảo mật mạng</h2><p>Bảo vệ toàn diện hạ tầng mạng doanh nghiệp với giải pháp NGFW (Fortinet, Cisco), hệ thống IPS/IDS, VPN site-to-site, Zero Trust Network Access và giám sát an ninh 24/7.</p>',
    },
    {
      slug: 'faq',
      title: 'Câu hỏi thường gặp',
      seoTitle: 'FAQ - Câu hỏi thường gặp | GTS',
      seoDescription: 'Giải đáp các câu hỏi thường gặp về sản phẩm, dịch vụ và chính sách của GTS.',
      content: '<h2>Câu hỏi thường gặp</h2><h3>GTS có bán lẻ cho cá nhân không?</h3><p>GTS chuyên phục vụ khách hàng doanh nghiệp (B2B). Tuy nhiên chúng tôi vẫn hỗ trợ cá nhân với đơn hàng từ 1 sản phẩm trở lên, vui lòng liên hệ trực tiếp để được tư vấn.</p><h3>Sản phẩm có bảo hành không?</h3><p>Tất cả sản phẩm tại GTS đều là hàng chính hãng với đầy đủ bảo hành theo chính sách nhà sản xuất, từ 12 đến 36 tháng tùy sản phẩm.</p>',
    },
    {
      slug: 'chinh-sach-bao-hanh',
      title: 'Chính sách Bảo hành',
      seoTitle: 'Chính sách bảo hành - GTS',
      seoDescription: 'Chính sách bảo hành sản phẩm tại GTS - Global Technology & Service.',
      content: '<h2>Chính sách bảo hành</h2><p>GTS cam kết cung cấp dịch vụ bảo hành chuyên nghiệp, nhanh chóng cho tất cả sản phẩm mua tại GTS.</p>',
    },
  ]

  for (const page of pages) {
    await query(
      `INSERT INTO pages (slug, title, seo_title, seo_description, content)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (slug) DO UPDATE SET
         title = EXCLUDED.title,
         seo_title = EXCLUDED.seo_title,
         seo_description = EXCLUDED.seo_description,
         content = EXCLUDED.content`,
      [page.slug, page.title, page.seoTitle, page.seoDescription, page.content]
    )
  }
  console.log('✅ Pages seeded:', pages.length)

  // 5. Post Categories & Sample Post
  const catPostRes = await queryOne<{ id: number }>(
    `INSERT INTO post_categories (name, slug)
     VALUES ($1, $2)
     ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
     RETURNING id`,
    ['Tin công nghệ', 'tin-cong-nghe']
  )
  await query(
    `INSERT INTO post_categories (name, slug)
     VALUES ($1, $2)
     ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name`,
    ['Giải pháp', 'giai-phap']
  )

  if (catPostRes) {
    await query(
      `INSERT INTO posts (post_category_id, title, slug, excerpt, content, status, published_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (slug) DO UPDATE SET
         title = EXCLUDED.title,
         excerpt = EXCLUDED.excerpt,
         content = EXCLUDED.content,
         status = EXCLUDED.status`,
      [
        catPostRes.id,
        'WiFi 6 là gì và tại sao doanh nghiệp nên nâng cấp ngay?',
        'wifi-6-la-gi-va-tai-sao-doanh-nghiep-nen-nang-cap',
        'WiFi 6 (802.11ax) mang lại tốc độ vượt trội và khả năng xử lý đa thiết bị vượt bậc so với thế hệ trước.',
        '<h2>WiFi 6 là gì?</h2><p>WiFi 6 (chuẩn IEEE 802.11ax) là thế hệ WiFi mới nhất, cải thiện đáng kể hiệu năng trong môi trường nhiều thiết bị.</p>',
        'published',
        new Date(),
      ]
    )
  }
  console.log('✅ Post categories & sample post seeded')

  // 6. Site Settings
  const settings = [
    { key: 'hotline', value: '0901 234 567' },
    { key: 'zalo_phone', value: '0901234567' },
    { key: 'contact_email', value: 'contact@gts.vn' },
    { key: 'address', value: '123 Nguyễn Văn Linh, Phường Tân Phong, Quận 7, TP. Hồ Chí Minh' },
    { key: 'working_hours', value: 'Thứ 2 – Thứ 6: 8:00 – 17:30 | Thứ 7: 8:00 – 12:00' },
    { key: 'google_map_embed_url', value: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.9269!2d106.7005!3d10.7291!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTDCsDQzJzQ0LjgiTiAxMDbCsDQyJzAxLjgiRQ!5e0!3m2!1svi!2svn!4v1234567890' },
    { key: 'facebook_url', value: 'https://facebook.com/gts.vn' },
    { key: 'youtube_url', value: '' },
    { key: 'company_name', value: 'GTS - Global Technology & Service' },
    { key: 'company_short', value: 'GTS' },
    { key: 'tax_code', value: '0123456789' },
    { key: 'warranty_lookup_url', value: '/chinh-sach-bao-hanh' },
  ]

  for (const s of settings) {
    await query(
      `INSERT INTO site_settings (key, value)
       VALUES ($1, $2)
       ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`,
      [s.key, s.value]
    )
  }
  console.log('✅ Site settings seeded:', settings.length)

  // 7. Admin User
  const passwordHash = await bcrypt.hash('admin@gts2024', 12)
  await query(
    `INSERT INTO admin_users (email, password_hash, role)
     VALUES ($1, $2, $3)
     ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash, role = EXCLUDED.role`,
    ['admin@gts.vn', passwordHash, 'admin']
  )
  console.log('✅ Admin user seeded: admin@gts.vn / admin@gts2024')

  console.log('\n🎉 Raw SQL database seeded successfully!')
}

seed()
  .catch((e) => {
    console.error('❌ Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await pool.end()
  })
