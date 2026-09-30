// =============================================================================
// FILE: src/lib/catalogTaxonomy.ts
// Hệ thống phân loại danh mục sản phẩm 3 cấp độ:
// Cấp 1: Loại sản phẩm (Category: Switch, Router, Firewall, Server, WiFi, Phụ kiện)
// Cấp 2: Hãng sản phẩm (Brand: Cisco, HPE Aruba, Dell, Fortinet, Ubiquiti, Ruijie...)
// Cấp 3: Dòng sản phẩm / Series (Series: Cisco Catalyst 9200, FortiGate 60F, PowerEdge R750...)
// =============================================================================

export interface ProductSeriesItem {
  id: string
  name: string
  slug: string
  description?: string
  popularModels?: string[]
  isFeatured?: boolean
}

export interface BrandCatalogItem {
  id: string
  name: string
  slug: string
  logo?: string
  tagline?: string
  seriesList: ProductSeriesItem[]
}

export interface CategoryCatalogItem {
  id: string
  name: string
  slug: string
  shortName: string
  icon: string
  description: string
  brands: BrandCatalogItem[]
}

export const CATALOG_TAXONOMY: CategoryCatalogItem[] = [
  {
    id: 'cat-switch',
    name: 'Switch / Thiết bị chuyển mạch',
    slug: 'switch',
    shortName: 'Switch',
    icon: 'Layers',
    description: 'Switch Access, Core, Data Center PoE/PoE+ tốc độ 1G/10G/40G/100G',
    brands: [
      {
        id: 'brand-cisco-sw',
        name: 'Cisco Systems',
        slug: 'cisco',
        logo: '/uploads/brands/cisco.webp',
        tagline: 'Premier Enterprise Switching',
        seriesList: [
          {
            id: 'c9200',
            name: 'Cisco Catalyst 9200 / 9200L',
            slug: 'cisco-catalyst-9200',
            description: 'Dòng switch access Layer 3 phổ biến nhất, uplink cố định và module mở rộng',
            popularModels: ['C9200L-24P-4G-E', 'C9200L-48P-4X-E', 'C9200-24T-A'],
            isFeatured: true,
          },
          {
            id: 'c9300',
            name: 'Cisco Catalyst 9300 / 9300L',
            slug: 'cisco-catalyst-9300',
            description: 'Dòng switch stackable cao cấp hỗ trợ StackWise 480G, PoE++ 90W UPOE',
            popularModels: ['C9300-24U-A', 'C9300-48P-E', 'C9300L-48PF-4X-A'],
            isFeatured: true,
          },
          {
            id: 'c1000',
            name: 'Cisco Catalyst 1000 Series',
            slug: 'cisco-catalyst-1000',
            description: 'Switch Layer 2 gọn nhẹ, tiết kiệm ngân sách cho chi nhánh SMB',
            popularModels: ['C1000-24FP-4X-L', 'C1000-48T-4G-L'],
          },
          {
            id: 'c9500',
            name: 'Cisco Catalyst 9500 Core Switch',
            slug: 'cisco-catalyst-9500',
            description: 'Switch Core / Aggregation 40G/100G mật độ cao cho doanh nghiệp',
            popularModels: ['C9500-24Q-A', 'C9500-40X-A'],
          },
          {
            id: 'nexus9000',
            name: 'Cisco Nexus 9000 Data Center',
            slug: 'cisco-nexus-9000',
            description: 'Hạ tầng mạng trung tâm dữ liệu ACI fabric độ trễ cực thấp',
            popularModels: ['N9K-C93180YC-FX', 'N9K-C9336C-FX2'],
          },
          {
            id: 'cbs350',
            name: 'Cisco Business 250 / 350 Series',
            slug: 'cisco-business-series',
            description: 'Dòng switch thông minh giá mềm cho văn phòng nhỏ',
            popularModels: ['CBS350-24T-4G', 'CBS350-48P-4G'],
          },
        ],
      },
      {
        id: 'brand-aruba-sw',
        name: 'HPE Aruba',
        slug: 'hpe-aruba',
        logo: '/uploads/brands/aruba.webp',
        tagline: 'Modern Cloud-Native Switching',
        seriesList: [
          {
            id: 'cx6000',
            name: 'Aruba CX 6000 / 6100 Series',
            slug: 'aruba-cx-6000',
            description: 'Switch Layer 2 access tin cậy với hệ điều hành hiện đại AOS-CX',
            popularModels: ['JL678A (CX 6100 24G PoE+)', 'JL675A (CX 6100 48G PoE+)'],
            isFeatured: true,
          },
          {
            id: 'cx6200',
            name: 'Aruba CX 6200 / 6300 Series',
            slug: 'aruba-cx-6200',
            description: 'Switch Layer 3 có Virtual Switching Framework (VSF) stacking',
            popularModels: ['JL726B (CX 6200F 48G)', 'JL659A (CX 6300M 48G)'],
            isFeatured: true,
          },
          {
            id: 'aruba-ion',
            name: 'Aruba Instant On 1930 / 1960',
            slug: 'aruba-instant-on-switch',
            description: 'Switch quản lý Cloud/App tiện lợi cho doanh nghiệp vừa và nhỏ',
            popularModels: ['JL683B (1930 24G PoE)', 'JL807A (1960 24G PoE)'],
          },
          {
            id: 'cx8320',
            name: 'Aruba CX 8320 / Core Switch',
            slug: 'aruba-cx-8320',
            description: 'Switch Core / Aggregation hiệu năng cao 10G/40G',
            popularModels: ['JL579A (CX 8320 48p 10G)'],
          },
        ],
      },
      {
        id: 'brand-dell-sw',
        name: 'Dell Technologies',
        slug: 'dell',
        logo: '/uploads/brands/dell.webp',
        tagline: 'Scalable Enterprise Networking',
        seriesList: [
          {
            id: 'dell-n1500',
            name: 'Dell PowerSwitch N1500 / N2000',
            slug: 'dell-powerswitch-n-series',
            description: 'Switch mạng campus tiết kiệm năng lượng chuẩn 1GbE',
            popularModels: ['N1524P', 'N2048P'],
            isFeatured: true,
          },
          {
            id: 'dell-n3000',
            name: 'Dell PowerSwitch N3000 / N3200',
            slug: 'dell-powerswitch-n3000',
            description: 'Dòng switch Layer 3 hỗ trợ PoE 60W/90W và uplink 10G/25G',
            popularModels: ['N3224P-ON', 'N3248P-ON'],
          },
          {
            id: 'dell-s-series',
            name: 'Dell PowerSwitch S-Series',
            slug: 'dell-powerswitch-s-series',
            description: 'Switch Data Center 10G/25G/100G Open Networking',
            popularModels: ['S4148F-ON', 'S5248F-ON'],
          },
        ],
      },
      {
        id: 'brand-ruijie-sw',
        name: 'Ruijie Networks',
        slug: 'ruijie',
        logo: '/uploads/brands/ruijie.webp',
        tagline: 'Cloud-Managed Enterprise Switching',
        seriesList: [
          {
            id: 'ruijie-nbs',
            name: 'Ruijie Reyee RG-NBS Series',
            slug: 'ruijie-reyee-nbs',
            description: 'Dòng switch quản lý qua Ruijie Cloud trọn đời miễn phí',
            popularModels: ['RG-NBS3100-24GT4SFP-P', 'RG-NBS3200-48GT4XS'],
            isFeatured: true,
          },
          {
            id: 'ruijie-s2910',
            name: 'Ruijie RG-S2910 Enterprise L3',
            slug: 'ruijie-s2910',
            description: 'Switch Layer 3 bảo mật cao cấp cho cơ quan, ngân hàng',
            popularModels: ['RG-S2910-24GT4SFP-UP-H', 'RG-S2910-48GT4SFP-E'],
          },
          {
            id: 'ruijie-s5750',
            name: 'Ruijie RG-S5750 Core Switch',
            slug: 'ruijie-s5750',
            description: 'Switch Core / Aggregation 10G routing đầy đủ tính năng',
            popularModels: ['RG-S5750-24GT8SFP-P'],
          },
        ],
      },
      {
        id: 'brand-ubiquiti-sw',
        name: 'Ubiquiti UniFi',
        slug: 'ubiquiti',
        logo: '/uploads/brands/ubiquiti.webp',
        tagline: 'Seamless Ecosystem Switching',
        seriesList: [
          {
            id: 'unifi-sw-std',
            name: 'UniFi Switch Standard & Pro',
            slug: 'unifi-switch-standard-pro',
            description: 'Switch quản lý UniFi Controller với màn hình cảm ứng LCM độc đáo',
            popularModels: ['USW-24-PoE', 'USW-48-PoE', 'USW-Pro-24-PoE'],
            isFeatured: true,
          },
          {
            id: 'unifi-sw-ent',
            name: 'UniFi Switch Enterprise PoE',
            slug: 'unifi-switch-enterprise',
            description: 'Switch 2.5GbE Multi-Gigabit chuyên dụng cho WiFi 6E/7',
            popularModels: ['USW-Enterprise-24-PoE', 'USW-Enterprise-48-PoE'],
          },
          {
            id: 'edgeswitch',
            name: 'EdgeSwitch Carrier Grade',
            slug: 'edgeswitch-series',
            description: 'Dòng switch cấu hình dòng lệnh CLI / Web cho ISP và nhà mạng',
            popularModels: ['ES-24-250W', 'ES-48-500W'],
          },
        ],
      },
    ],
  },
  {
    id: 'cat-router',
    name: 'Router / Thiết bị định tuyến',
    slug: 'router',
    shortName: 'Router',
    icon: 'Network',
    description: 'Router VPN, SD-WAN, WAN Edge doanh nghiệp đa chi nhánh',
    brands: [
      {
        id: 'brand-cisco-rt',
        name: 'Cisco Systems',
        slug: 'cisco',
        logo: '/uploads/brands/cisco.webp',
        tagline: 'Enterprise SD-WAN & Edge Routing',
        seriesList: [
          {
            id: 'c8000',
            name: 'Cisco Catalyst 8200 / 8300 Edge',
            slug: 'cisco-catalyst-8000',
            description: 'Nền tảng định tuyến đám mây SD-WAN thế hệ mới thay thế dòng ISR',
            popularModels: ['C8200-1N-4T', 'C8300-1N1S-4T2X'],
            isFeatured: true,
          },
          {
            id: 'isr4000',
            name: 'Cisco ISR 4300 / 4400 Series',
            slug: 'cisco-isr-4000',
            description: 'Dòng router doanh nghiệp bền bỉ, tích hợp voice, security và VPN',
            popularModels: ['ISR4321/K9', 'ISR4331/K9', 'ISR4431/K9'],
            isFeatured: true,
          },
          {
            id: 'isr1000',
            name: 'Cisco ISR 1000 Series',
            slug: 'cisco-isr-1000',
            description: 'Router chi nhánh nhỏ tích hợp kết nối WAN Gigabit & VDSL',
            popularModels: ['C1111-4P', 'C1117-4P'],
          },
        ],
      },
      {
        id: 'brand-mikrotik-rt',
        name: 'MikroTik',
        slug: 'mikrotik',
        logo: '/uploads/brands/mikrotik.webp',
        tagline: 'High Performance RouterOS',
        seriesList: [
          {
            id: 'mikrotik-ccr',
            name: 'MikroTik Cloud Core CCR Series',
            slug: 'mikrotik-ccr',
            description: 'Router tải cực lớn cho ISP, Data Center và tòa nhà văn phòng',
            popularModels: ['CCR2004-16G-2S+', 'CCR2116-12G-4S+', 'CCR1036-8G-2S+'],
            isFeatured: true,
          },
          {
            id: 'mikrotik-rb',
            name: 'MikroTik RB & Hex Series',
            slug: 'mikrotik-rb-series',
            description: 'Router cân bằng tải nhiều đường truyền Internet giá tối ưu',
            popularModels: ['RB5009UG+S+IN', 'hEX S (RB760iGS)', 'RB4011iGS+RM'],
            isFeatured: true,
          },
        ],
      },
      {
        id: 'brand-ruijie-rt',
        name: 'Ruijie Networks',
        slug: 'ruijie',
        logo: '/uploads/brands/ruijie.webp',
        tagline: 'Smart Cloud Gateway',
        seriesList: [
          {
            id: 'ruijie-rg-eg',
            name: 'Ruijie Reyee RG-EG Series',
            slug: 'ruijie-rg-eg',
            description: 'Gateway cân bằng tải đa WAN, chặn web thông minh, quản lý Cloud',
            popularModels: ['RG-EG210G-P V2', 'RG-EG310GH-P-E', 'RG-EG3250'],
            isFeatured: true,
          },
          {
            id: 'ruijie-rsr',
            name: 'Ruijie RG-RSR Enterprise Router',
            slug: 'ruijie-rsr',
            description: 'Router trục chính cho ngân hàng, tổ chức viễn thông và cơ quan',
            popularModels: ['RG-RSR20-X-28', 'RG-RSR30-X'],
          },
        ],
      },
      {
        id: 'brand-aruba-rt',
        name: 'HPE Aruba',
        slug: 'hpe-aruba',
        logo: '/uploads/brands/aruba.webp',
        tagline: 'EdgeConnect SD-WAN Solution',
        seriesList: [
          {
            id: 'aruba-sdwan',
            name: 'Aruba EdgeConnect SD-WAN',
            slug: 'aruba-edgeconnect',
            description: 'Tối ưu ứng dụng SaaS và tự động chuyển hướng đường truyền WAN',
            popularModels: ['EC-XS', 'EC-S-P', 'EC-M-P'],
          },
        ],
      },
    ],
  },
  {
    id: 'cat-firewall',
    name: 'Firewall / Tường lửa bảo mật',
    slug: 'firewall',
    shortName: 'Firewall',
    icon: 'ShieldCheck',
    description: 'Next-Gen Firewall (NGFW), SSL-VPN, IPS/IDS chống tấn công mã độc',
    brands: [
      {
        id: 'brand-fortinet-fw',
        name: 'Fortinet',
        slug: 'fortinet',
        logo: '/uploads/brands/fortinet.webp',
        tagline: 'World Leading Next-Gen Firewall',
        seriesList: [
          {
            id: 'fg-entry',
            name: 'FortiGate Entry-Level (40F / 60F / 70F / 80F)',
            slug: 'fortigate-entry-level',
            description: 'Thiết bị tường lửa cho văn phòng 20 - 150 người dùng với chip bảo mật SOC4',
            popularModels: ['FG-40F', 'FG-60F', 'FG-70F', 'FG-80F'],
            isFeatured: true,
          },
          {
            id: 'fg-mid',
            name: 'FortiGate Mid-Range (100F / 200F / 400F)',
            slug: 'fortigate-mid-range',
            description: 'Tường lửa hiệu năng cao cho trụ sở chính 200 - 1000 người dùng',
            popularModels: ['FG-100F', 'FG-200F', 'FG-400F'],
            isFeatured: true,
          },
          {
            id: 'fg-high',
            name: 'FortiGate High-End (600F / 1000F)',
            slug: 'fortigate-high-end',
            description: 'Tường lửa trung tâm dữ liệu với throughput bảo mật hàng chục Gbps',
            popularModels: ['FG-600F', 'FG-1000F'],
          },
          {
            id: 'fg-bundle',
            name: 'FortiGate UTP / Enterprise Bundle License',
            slug: 'fortigate-bundle',
            description: 'Gói bản quyền Antivirus, Web Filtering, IPS, Anti-Spam chính hãng',
            popularModels: ['FC-10-0060F-950-02-12', 'FC-10-0100F-950-02-12'],
          },
        ],
      },
      {
        id: 'brand-cisco-fw',
        name: 'Cisco Secure',
        slug: 'cisco',
        logo: '/uploads/brands/cisco.webp',
        tagline: 'Zero Trust & Threat Defense',
        seriesList: [
          {
            id: 'cisco-fpr1000',
            name: 'Cisco Secure Firewall 1000 Series',
            slug: 'cisco-firepower-1000',
            description: 'Tường lửa thế hệ mới FPR-1010, FPR-1120, FPR-1140 tích hợp Snort 3',
            popularModels: ['FPR1010-NGFW-K9', 'FPR1120-NGFW-K9'],
            isFeatured: true,
          },
          {
            id: 'cisco-fpr3100',
            name: 'Cisco Secure Firewall 3100 Series',
            slug: 'cisco-firepower-3100',
            description: 'Bảo mật thế hệ mới hiệu năng mã hóa cực nhanh cho Data Center',
            popularModels: ['FPR3110-NGFW-K9', 'FPR3120-NGFW-K9'],
          },
          {
            id: 'cisco-meraki-mx',
            name: 'Cisco Meraki MX Security Appliance',
            slug: 'cisco-meraki-mx',
            description: 'Bảo mật quản lý đám mây 100%, thiết lập VPN Auto-Mesh chỉ 3 cú click',
            popularModels: ['MX68-HW', 'MX85-HW', 'MX250-HW'],
          },
        ],
      },
      {
        id: 'brand-paloalto-fw',
        name: 'Palo Alto Networks',
        slug: 'palo-alto',
        logo: '/uploads/brands/paloalto.webp',
        tagline: 'Industry-Leading ML-Powered NGFW',
        seriesList: [
          {
            id: 'pa-400',
            name: 'Palo Alto PA-400 Series (PA-410 / PA-440)',
            slug: 'palo-alto-pa-400',
            description: 'Tường lửa học máy ML-Powered NGFW không quạt cho văn phòng chi nhánh',
            popularModels: ['PA-410', 'PA-440', 'PA-450'],
            isFeatured: true,
          },
          {
            id: 'pa-1400',
            name: 'Palo Alto PA-1400 / PA-3400 Series',
            slug: 'palo-alto-pa-1400',
            description: 'Giải pháp tường lửa phân tích mối đe dọa chuyên sâu cho doanh nghiệp lớn',
            popularModels: ['PA-1410', 'PA-3410'],
          },
        ],
      },
      {
        id: 'brand-sophos-fw',
        name: 'Sophos',
        slug: 'sophos',
        logo: '/uploads/brands/sophos.webp',
        tagline: 'Synchronized Security Ecosystem',
        seriesList: [
          {
            id: 'sophos-xgs-desk',
            name: 'Sophos XGS Desktop Series',
            slug: 'sophos-xgs-desktop',
            description: 'Kiến trúc vi xử lý kép Xstream tăng tốc luồng kiểm tra SSL/TLS',
            popularModels: ['XGS 116', 'XGS 126', 'XGS 136'],
            isFeatured: true,
          },
          {
            id: 'sophos-xgs-rack',
            name: 'Sophos XGS 1U / 2U Rackmount',
            slug: 'sophos-xgs-rack',
            description: 'Thiết bị tường lửa Rackmount mật độ cổng đồng và quang lớn',
            popularModels: ['XGS 2100', 'XGS 3100'],
          },
        ],
      },
    ],
  },
  {
    id: 'cat-server',
    name: 'Server & Storage / Máy chủ lưu trữ',
    slug: 'server-storage',
    shortName: 'Server & Storage',
    icon: 'Server',
    description: 'Máy chủ Rack, Tower, lưu trữ SAN/NAS và hệ thống sao lưu dự phòng',
    brands: [
      {
        id: 'brand-dell-srv',
        name: 'Dell Technologies',
        slug: 'dell',
        logo: '/uploads/brands/dell.webp',
        tagline: 'PowerEdge - #1 Server in Enterprise',
        seriesList: [
          {
            id: 'pe-2u',
            name: 'Dell PowerEdge R750 / R760 2U Rack',
            slug: 'dell-poweredge-2u',
            description: 'Máy chủ 2U 2-socket Intel Xeon Scalable tiêu chuẩn cho ảo hóa VMware & CSDL',
            popularModels: ['PowerEdge R750 (2x Intel Xeon Gold, 64GB)', 'PowerEdge R760 Gen16'],
            isFeatured: true,
          },
          {
            id: 'pe-1u',
            name: 'Dell PowerEdge R650 / R660 1U Rack',
            slug: 'dell-poweredge-1u',
            description: 'Máy chủ 1U mật độ cao tối ưu không gian tủ rack Datacenter',
            popularModels: ['PowerEdge R650xs', 'PowerEdge R660'],
            isFeatured: true,
          },
          {
            id: 'pe-tower',
            name: 'Dell PowerEdge T150 / T350 Tower',
            slug: 'dell-poweredge-tower',
            description: 'Máy chủ dạng đứng vận hành êm ái cho văn phòng không có phòng máy',
            popularModels: ['PowerEdge T150 (Intel Xeon E-2300)', 'PowerEdge T350'],
          },
          {
            id: 'powervault',
            name: 'Dell PowerVault & PowerStore SAN/NAS',
            slug: 'dell-powervault-storage',
            description: 'Hệ thống tủ đĩa lưu trữ SAN iSCSI / Fibre Channel dung lượng lớn',
            popularModels: ['PowerVault ME5024', 'PowerVault ME5084'],
          },
        ],
      },
      {
        id: 'brand-hpe-srv',
        name: 'HPE (Hewlett Packard)',
        slug: 'hpe',
        logo: '/uploads/brands/hpe.webp',
        tagline: 'ProLiant - Compute Engine of Tomorrow',
        seriesList: [
          {
            id: 'dl380',
            name: 'HPE ProLiant DL380 Gen10 / Gen11',
            slug: 'hpe-proliant-dl380',
            description: 'Dòng máy chủ bán chạy nhất thế giới với chip bảo mật phần cứng iLO',
            popularModels: ['DL380 Gen10 Plus', 'DL380 Gen11 Intel Xeon'],
            isFeatured: true,
          },
          {
            id: 'dl360',
            name: 'HPE ProLiant DL360 Gen10 / Gen11',
            slug: 'hpe-proliant-dl360',
            description: 'Máy chủ Rack 1U 2-socket hiệu năng vượt trội cho hạ tầng tính toán',
            popularModels: ['DL360 Gen10', 'DL360 Gen11'],
          },
          {
            id: 'proliant-ml',
            name: 'HPE ProLiant ML30 / ML110 Tower',
            slug: 'hpe-proliant-ml',
            description: 'Máy chủ tháp đơn socket tin cậy cho ứng dụng kế toán và file server',
            popularModels: ['ML30 Gen10 Plus', 'ML110 Gen10'],
          },
          {
            id: 'hpe-msa',
            name: 'HPE MSA 2060 / 2062 SAN Storage',
            slug: 'hpe-msa-storage',
            description: 'Thiết bị lưu trữ mảng đĩa hỗn hợp Flash Hybrid giá hợp lý',
            popularModels: ['MSA 2060 2.5in Storage', 'MSA 2062 Storage'],
          },
        ],
      },
      {
        id: 'brand-synology-nas',
        name: 'Synology',
        slug: 'synology',
        logo: '/uploads/brands/synology.webp',
        tagline: 'Intelligent Data Management & Backup',
        seriesList: [
          {
            id: 'synology-rs',
            name: 'Synology RackStation Enterprise NAS',
            slug: 'synology-rackstation',
            description: 'Lưu trữ dạng rack 1U/2U/3U cho sao lưu Active Backup for Business',
            popularModels: ['RS2423+', 'RS3621xs+', 'RS4021xs+'],
            isFeatured: true,
          },
          {
            id: 'synology-ds',
            name: 'Synology DiskStation Desktop NAS',
            slug: 'synology-diskstation',
            description: 'Ổ cứng mạng để bàn 4-bay, 6-bay, 8-bay chia sẻ tài liệu nội bộ an toàn',
            popularModels: ['DS923+', 'DS1522+', 'DS1821+'],
            isFeatured: true,
          },
        ],
      },
    ],
  },
  {
    id: 'cat-wifi',
    name: 'WiFi / Thiết bị mạng không dây',
    slug: 'wifi',
    shortName: 'WiFi Doanh nghiệp',
    icon: 'Wifi',
    description: 'Access Point WiFi 6/6E/7, Roaming không độ trễ, chịu tải hàng trăm kết nối',
    brands: [
      {
        id: 'brand-ubiquiti-wf',
        name: 'Ubiquiti UniFi',
        slug: 'ubiquiti',
        logo: '/uploads/brands/ubiquiti.webp',
        tagline: 'High-Density Aesthetic WiFi',
        seriesList: [
          {
            id: 'u6-std',
            name: 'UniFi U6 Pro / U6+ / U6 Lite',
            slug: 'unifi-u6-standard',
            description: 'Access Point WiFi 6 gắn trần thông dụng nhất cho văn phòng và trường học',
            popularModels: ['U6-Pro (4x4 MU-MIMO)', 'U6-Plus', 'U6-Lite'],
            isFeatured: true,
          },
          {
            id: 'u7-ent',
            name: 'UniFi U7 Pro / U6 Enterprise (WiFi 6E & WiFi 7)',
            slug: 'unifi-wifi7-enterprise',
            description: 'Chuẩn không dây 6GHz và WiFi 7 siêu tốc độ với cổng uplink 2.5GbE',
            popularModels: ['U7-Pro (WiFi 7)', 'U6-Enterprise (WiFi 6E)'],
            isFeatured: true,
          },
          {
            id: 'unifi-mesh',
            name: 'UniFi Outdoor & In-Wall AP',
            slug: 'unifi-outdoor-mesh',
            description: 'Thiết bị phát sóng ngoài trời chuẩn chống nước IP67 và âm tường khách sạn',
            popularModels: ['U6-Mesh', 'U6-IW (In-Wall PoE Passthrough)'],
          },
        ],
      },
      {
        id: 'brand-aruba-wf',
        name: 'HPE Aruba',
        slug: 'hpe-aruba',
        logo: '/uploads/brands/aruba.webp',
        tagline: 'Enterprise AI-Powered Wireless',
        seriesList: [
          {
            id: 'aruba-ap500',
            name: 'Aruba AP-505 / AP-515 Campus AP',
            slug: 'aruba-ap-500',
            description: 'Access Point WiFi 6 công nghệ ClientMatch và bảo mật WPA3 Enterprise',
            popularModels: ['AP-505 (R2H28A)', 'AP-515 (Q9H62A)'],
            isFeatured: true,
          },
          {
            id: 'aruba-ap600',
            name: 'Aruba AP-635 / AP-655 (WiFi 6E Tri-Band)',
            slug: 'aruba-ap-600',
            description: 'Bộ phát sóng 3 băng tần 2.4GHz, 5GHz và 6GHz dung lượng cực lớn',
            popularModels: ['AP-635 (R7J27A)', 'AP-655 (R7J37A)'],
          },
          {
            id: 'aruba-ion-ap',
            name: 'Aruba Instant On AP11 / AP22 / AP25',
            slug: 'aruba-instant-on-ap',
            description: 'Dòng sản phẩm cài đặt qua điện thoại cho quán café, showroom, văn phòng SMB',
            popularModels: ['AP22 (R4W02A)', 'AP25 (R9B28A)'],
            isFeatured: true,
          },
        ],
      },
      {
        id: 'brand-ruijie-wf',
        name: 'Ruijie Networks',
        slug: 'ruijie',
        logo: '/uploads/brands/ruijie.webp',
        tagline: 'Free Cloud Management WiFi',
        seriesList: [
          {
            id: 'ruijie-reyee-rap',
            name: 'Ruijie Reyee RG-RAP2260 Series',
            slug: 'ruijie-reyee-rap',
            description: 'AP WiFi 6 chịu tải 100+ clients đồng thời, tự động mesh một chạm',
            popularModels: ['RG-RAP2260(E) AX3200', 'RG-RAP2260(G) AX1800'],
            isFeatured: true,
          },
          {
            id: 'ruijie-rg-ap800',
            name: 'Ruijie RG-AP820 Enterprise AP',
            slug: 'ruijie-rg-ap800',
            description: 'Access Point công nghiệp cho nhà xưởng, bệnh viện và hội trường lớn',
            popularModels: ['RG-AP820-L(V2)', 'RG-AP840-I'],
          },
        ],
      },
      {
        id: 'brand-cisco-wf',
        name: 'Cisco Systems',
        slug: 'cisco',
        logo: '/uploads/brands/cisco.webp',
        tagline: 'Catalyst Wireless Ecosystem',
        seriesList: [
          {
            id: 'cisco-c9100',
            name: 'Cisco Catalyst 9100 Series AP',
            slug: 'cisco-catalyst-9100',
            description: 'Access point tích hợp BLE, Zigbee và phân tích dữ liệu DNA Spaces',
            popularModels: ['C9115AXI-E', 'C9120AXI-E', 'C9130AXI-E'],
            isFeatured: true,
          },
          {
            id: 'cisco-meraki-mr',
            name: 'Cisco Meraki MR Series Cloud AP',
            slug: 'cisco-meraki-mr',
            description: 'Quản lý 100% qua Meraki Dashboard với tường lửa L7 tích hợp sẵn',
            popularModels: ['MR44-HW', 'MR46-HW', 'MR56-HW'],
          },
        ],
      },
    ],
  },
  {
    id: 'cat-accessories',
    name: 'Phụ kiện & Module SFP / Cáp quang',
    slug: 'phu-kien-module',
    shortName: 'Module & Phụ kiện',
    icon: 'Cpu',
    description: 'Module quang SFP/SFP+/QSFP+, cáp DAC, nguồn dự phòng và linh kiện spare part',
    brands: [
      {
        id: 'brand-cisco-acc',
        name: 'Cisco Systems',
        slug: 'cisco',
        logo: '/uploads/brands/cisco.webp',
        tagline: 'Genuine Optical Transceivers',
        seriesList: [
          {
            id: 'cisco-sfp-trans',
            name: 'Module Cisco SFP / SFP+ 1G & 10G',
            slug: 'cisco-sfp-transceivers',
            description: 'Module quang chính hãng GLC-LH-SMD, GLC-SX-MMD, SFP-10G-SR, SFP-10G-LR',
            popularModels: ['GLC-TE (1G RJ45)', 'GLC-LH-SMD (1G Single-mode)', 'SFP-10G-SR (10G Multi-mode)'],
            isFeatured: true,
          },
          {
            id: 'cisco-dac',
            name: 'Cáp Cisco Direct Attach Copper (DAC)',
            slug: 'cisco-dac-cables',
            description: 'Cáp twinax kết nối switch to switch 10G / 40G khoảng cách ngắn 1m, 3m, 5m',
            popularModels: ['SFP-H10GB-CU1M', 'SFP-H10GB-CU3M'],
          },
        ],
      },
      {
        id: 'brand-aruba-acc',
        name: 'HPE Aruba',
        slug: 'hpe-aruba',
        logo: '/uploads/brands/aruba.webp',
        tagline: 'Aruba Certified Transceivers',
        seriesList: [
          {
            id: 'aruba-trans',
            name: 'Module quang Aruba SFP / SFP+',
            slug: 'aruba-transceivers',
            description: 'Transceiver tương thích hoàn toàn hệ điều hành AOS-S và AOS-CX',
            popularModels: ['J4858D (1G SX)', 'J4859D (1G LX)', 'J9150D (10G SR)'],
            isFeatured: true,
          },
        ],
      },
      {
        id: 'brand-oem-acc',
        name: 'OEM Optical & Spare Part',
        slug: 'oem-optical',
        logo: '/uploads/brands/optical.webp',
        tagline: 'Tested 100% Multi-Vendor Compatible',
        seriesList: [
          {
            id: 'oem-modules',
            name: 'Module tương thích Cisco / Dell / HP',
            slug: 'oem-optical-modules',
            description: 'Module quang tiêu chuẩn công nghiệp bảo hành 3 năm 1 đổi 1',
            popularModels: ['SFP-1G-SX-OEM', 'SFP-10G-LR-OEM'],
            isFeatured: true,
          },
          {
            id: 'patch-cords',
            name: 'Dây nhảy quang & Patch Cord B2B',
            slug: 'optical-patch-cords',
            description: 'Dây nhảy chuẩn LC-LC, SC-LC Single-mode/Multi-mode OM3/OM4 đúc sẵn',
            popularModels: ['Patch Cord LC-LC OM3 3M', 'Patch Cord LC-LC Singlemode 5M'],
          },
        ],
      },
    ],
  },
]

// ─── HELPER FUNCTIONS ────────────────────────────────────────────────────────

/**
 * Lấy toàn bộ cây danh mục 3 cấp
 */
export function getCatalogTaxonomy(): CategoryCatalogItem[] {
  return CATALOG_TAXONOMY
}

/**
 * Tìm Category theo slug
 */
export function getCategoryBySlug(slug?: string | null): CategoryCatalogItem | undefined {
  if (!slug) return undefined
  return CATALOG_TAXONOMY.find((c) => c.slug.toLowerCase() === slug.toLowerCase())
}

/**
 * Tìm Brand theo categorySlug và brandSlug
 */
export function getBrandBySlug(
  brandSlug?: string | null,
  categorySlug?: string | null
): BrandCatalogItem | undefined {
  if (!brandSlug) return undefined

  if (categorySlug) {
    const cat = getCategoryBySlug(categorySlug)
    if (cat) {
      const found = cat.brands.find((b) => b.slug.toLowerCase() === brandSlug.toLowerCase())
      if (found) return found
    }
  }

  // Nếu không chỉ định category hoặc không thấy trong category, tìm trên toàn bộ cây
  for (const cat of CATALOG_TAXONOMY) {
    const found = cat.brands.find((b) => b.slug.toLowerCase() === brandSlug.toLowerCase())
    if (found) return found
  }
  return undefined
}

/**
 * Tìm Series theo seriesSlug
 */
export function getSeriesBySlug(seriesSlug?: string | null): {
  series: ProductSeriesItem
  brand: BrandCatalogItem
  category: CategoryCatalogItem
} | undefined {
  if (!seriesSlug) return undefined

  for (const cat of CATALOG_TAXONOMY) {
    for (const br of cat.brands) {
      const s = br.seriesList.find((item) => item.slug.toLowerCase() === seriesSlug.toLowerCase())
      if (s) {
        return { series: s, brand: br, category: cat }
      }
    }
  }
  return undefined
}

/**
 * Lấy danh sách tất cả các Hãng duy nhất trên hệ thống
 */
export function getAllUniqueBrands(): { id: string; name: string; slug: string }[] {
  const map = new Map<string, { id: string; name: string; slug: string }>()
  for (const cat of CATALOG_TAXONOMY) {
    for (const b of cat.brands) {
      if (!map.has(b.slug)) {
        map.set(b.slug, { id: b.id, name: b.name, slug: b.slug })
      }
    }
  }
  return Array.from(map.values())
}
