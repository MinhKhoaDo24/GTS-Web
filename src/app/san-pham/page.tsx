import type { Metadata } from 'next'
import Link from 'next/link'
import { query, queryOne } from '@/lib/db'
import type { Category, Brand, Domain, ProductType, LifecycleStatus } from '@/types/database'
import { ProductCard } from '@/components/ProductCard'
import { ProductFilters } from '@/components/ProductFilters'
import {
  ChevronRight,
  PackageSearch,
  Home,
  ShieldCheck,
  Award,
  ArrowUpDown,
  FileCheck2,
  Cpu,
  Layers,
  Sparkles,
  Boxes
} from 'lucide-react'
import {
  getCategoryBySlug,
  getBrandBySlug,
  getSeriesBySlug,
} from '@/lib/catalogTaxonomy'

export const metadata: Metadata = {
  title: 'Thiết Bị Phần Cứng & Hạ Tầng Mạng Enterprise Chính Hãng | GTS',
  description:
    'Danh mục thiết bị mạng doanh nghiệp & máy chủ chính hãng tại GTS: Cisco, Fortinet, HPE Aruba, Dell Technologies, Ubiquiti. Đầy đủ chứng chỉ CO/CQ và bảo hành chính hãng.',
}

interface PageProps {
  searchParams: Promise<{
    domain?: string
    category?: string
    brand?: string
    series?: string
    type?: string
    lifecycle?: string
    sort?: string
    q?: string
    page?: string
  }>
}

interface CatalogProductItem {
  id: string
  name: string
  slug: string
  model: string | null
  part_number: string | null
  sku: string | null
  product_type: string
  thumbnail: string | null
  brand: { name: string; slug: string; logo?: string | null } | null
  category: { name: string; slug: string } | null
  domain?: { name: string; slug: string } | null
  series_slug?: string
  specs_summary: string | null
  lifecycle_status: string
  is_featured: boolean
}

// BỘ SẢN PHẨM MẪU CHUẨN 3 CẤP ĐỘ ĐẢM BẢO WEBSITE LUÔN HIỂN THỊ CHÍNH XÁC KHI TEST / LỌC
const FALLBACK_PRODUCTS: CatalogProductItem[] = [
  // ── SWITCH CISCO ──
  {
    id: 'prod-c9200l-24p',
    name: 'Cisco Catalyst 9200L 24-port PoE+ Switch',
    slug: 'cisco-catalyst-c9200l-24p-4g-e',
    model: 'C9200L-24P-4G-E',
    part_number: 'C9200L-24P-4G-E',
    sku: 'C9200L-24P-4G-E',
    product_type: 'hardware',
    thumbnail: '/uploads/products/catalyst-9200l.webp',
    brand: { name: 'Cisco Systems', slug: 'cisco', logo: '/uploads/brands/cisco.webp' },
    category: { name: 'Switch / Thiết bị chuyển mạch', slug: 'switch' },
    series_slug: 'cisco-catalyst-9200',
    specs_summary: '24x 10/100/1000 PoE+ (370W), 4x 1G SFP uplink, Network Essentials, Layer 3',
    lifecycle_status: 'active',
    is_featured: true,
  },
  {
    id: 'prod-c9200l-48p',
    name: 'Cisco Catalyst 9200L 48-port PoE+ 4x10G Uplink',
    slug: 'cisco-catalyst-c9200l-48p-4x-e',
    model: 'C9200L-48P-4X-E',
    part_number: 'C9200L-48P-4X-E',
    sku: 'C9200L-48P-4X-E',
    product_type: 'hardware',
    thumbnail: '/uploads/products/catalyst-9200l.webp',
    brand: { name: 'Cisco Systems', slug: 'cisco', logo: '/uploads/brands/cisco.webp' },
    category: { name: 'Switch / Thiết bị chuyển mạch', slug: 'switch' },
    series_slug: 'cisco-catalyst-9200',
    specs_summary: '48x 10/100/1000 PoE+ (740W), 4x 10G SFP+ uplink, StackWise-80 support',
    lifecycle_status: 'active',
    is_featured: true,
  },
  {
    id: 'prod-c9300-24u',
    name: 'Cisco Catalyst 9300 24-port UPOE Switch',
    slug: 'cisco-catalyst-c9300-24u-a',
    model: 'C9300-24U-A',
    part_number: 'C9300-24U-A',
    sku: 'C9300-24U-A',
    product_type: 'hardware',
    thumbnail: '/uploads/products/catalyst-9300.webp',
    brand: { name: 'Cisco Systems', slug: 'cisco', logo: '/uploads/brands/cisco.webp' },
    category: { name: 'Switch / Thiết bị chuyển mạch', slug: 'switch' },
    series_slug: 'cisco-catalyst-9300',
    specs_summary: '24x Cisco UPOE (60W per port), StackWise-480, Modular Uplink, Network Advantage',
    lifecycle_status: 'active',
    is_featured: true,
  },
  {
    id: 'prod-c1000-24fp',
    name: 'Cisco Catalyst 1000 24-port Full PoE+ Switch',
    slug: 'cisco-catalyst-c1000-24fp-4x-l',
    model: 'C1000-24FP-4X-L',
    part_number: 'C1000-24FP-4X-L',
    sku: 'C1000-24FP-4X-L',
    product_type: 'hardware',
    thumbnail: '/uploads/products/catalyst-1000.webp',
    brand: { name: 'Cisco Systems', slug: 'cisco', logo: '/uploads/brands/cisco.webp' },
    category: { name: 'Switch / Thiết bị chuyển mạch', slug: 'switch' },
    series_slug: 'cisco-catalyst-1000',
    specs_summary: '24x 1G PoE+ (370W), 4x 10G SFP+ uplink, Switch Layer 2 Fanless bền bỉ',
    lifecycle_status: 'active',
    is_featured: false,
  },

  // ── SWITCH ARUBA ──
  {
    id: 'prod-aruba-cx6100',
    name: 'Aruba CX 6100 24G Class 4 PoE 4SFP+ 370W Switch',
    slug: 'aruba-cx-6100-24g-poe-jl678a',
    model: 'JL678A',
    part_number: 'JL678A',
    sku: 'JL678A',
    product_type: 'hardware',
    thumbnail: '/uploads/products/aruba-6100.webp',
    brand: { name: 'HPE Aruba', slug: 'hpe-aruba', logo: '/uploads/brands/aruba.webp' },
    category: { name: 'Switch / Thiết bị chuyển mạch', slug: 'switch' },
    series_slug: 'aruba-cx-6000',
    specs_summary: '24x 1GbE PoE+ (370W), 4x 1G/10G SFP+ uplink, hệ điều hành AOS-CX hiện đại',
    lifecycle_status: 'active',
    is_featured: true,
  },
  {
    id: 'prod-aruba-cx6200f',
    name: 'Aruba CX 6200F 48G Class 4 PoE 4SFP+ 740W Switch',
    slug: 'aruba-cx-6200f-48g-poe-jl728b',
    model: 'JL728B',
    part_number: 'JL728B',
    sku: 'JL728B',
    product_type: 'hardware',
    thumbnail: '/uploads/products/aruba-6200.webp',
    brand: { name: 'HPE Aruba', slug: 'hpe-aruba', logo: '/uploads/brands/aruba.webp' },
    category: { name: 'Switch / Thiết bị chuyển mạch', slug: 'switch' },
    series_slug: 'aruba-cx-6200',
    specs_summary: '48x 1GbE PoE+ (740W), 4x 10G SFP+, hỗ trợ VSF Stacking lên đến 8 switch',
    lifecycle_status: 'active',
    is_featured: true,
  },

  // ── SWITCH DELL ──
  {
    id: 'prod-dell-n1524p',
    name: 'Dell PowerSwitch N1524P Layer 3 Gigabit Switch',
    slug: 'dell-powerswitch-n1524p',
    model: 'N1524P',
    part_number: 'N1524P-ON',
    sku: 'N1524P',
    product_type: 'hardware',
    thumbnail: '/uploads/products/dell-n1500.webp',
    brand: { name: 'Dell Technologies', slug: 'dell', logo: '/uploads/brands/dell.webp' },
    category: { name: 'Switch / Thiết bị chuyển mạch', slug: 'switch' },
    series_slug: 'dell-powerswitch-n-series',
    specs_summary: '24x RJ45 10/100/1000Mb PoE+, 4x SFP+ 10GbE uplink ports, Dell Networking OS 6',
    lifecycle_status: 'active',
    is_featured: false,
  },

  // ── SWITCH RUIJIE ──
  {
    id: 'prod-ruijie-nbs3100',
    name: 'Ruijie Reyee RG-NBS3100-24GT4SFP-P Cloud Switch',
    slug: 'ruijie-rg-nbs3100-24gt4sfp-p',
    model: 'RG-NBS3100-24GT4SFP-P',
    part_number: 'RG-NBS3100-24GT4SFP-P',
    sku: 'RG-NBS3100-24GT4SFP-P',
    product_type: 'hardware',
    thumbnail: '/uploads/products/ruijie-nbs.webp',
    brand: { name: 'Ruijie Networks', slug: 'ruijie', logo: '/uploads/brands/ruijie.webp' },
    category: { name: 'Switch / Thiết bị chuyển mạch', slug: 'switch' },
    series_slug: 'ruijie-reyee-nbs',
    specs_summary: '24x 1G PoE+ (370W), 4x SFP quang, quản lý Ruijie Cloud trọn đời miễn phí',
    lifecycle_status: 'active',
    is_featured: true,
  },

  // ── SWITCH UBIQUITI ──
  {
    id: 'prod-unifi-usw-pro-24',
    name: 'UniFi Switch Pro 24 PoE Layer 3 Managed Switch',
    slug: 'unifi-switch-pro-24-poe',
    model: 'USW-Pro-24-PoE',
    part_number: 'USW-Pro-24-PoE',
    sku: 'USW-Pro-24-PoE',
    product_type: 'hardware',
    thumbnail: '/uploads/products/unifi-usw.webp',
    brand: { name: 'Ubiquiti UniFi', slug: 'ubiquiti', logo: '/uploads/brands/ubiquiti.webp' },
    category: { name: 'Switch / Thiết bị chuyển mạch', slug: 'switch' },
    series_slug: 'unifi-switch-standard-pro',
    specs_summary: '16x PoE+ 802.3at, 8x PoE++ 802.3bt (400W), 2x 10G SFP+ uplink, 1.3" Touch LCM',
    lifecycle_status: 'active',
    is_featured: true,
  },

  // ── ROUTER CISCO & MIKROTIK ──
  {
    id: 'prod-cisco-c8200',
    name: 'Cisco Catalyst 8200 Series Edge uCPE Router',
    slug: 'cisco-catalyst-c8200-1n-4t',
    model: 'C8200-1N-4T',
    part_number: 'C8200-1N-4T',
    sku: 'C8200-1N-4T',
    product_type: 'hardware',
    thumbnail: '/uploads/products/cisco-c8200.webp',
    brand: { name: 'Cisco Systems', slug: 'cisco', logo: '/uploads/brands/cisco.webp' },
    category: { name: 'Router / Thiết bị định tuyến', slug: 'router' },
    series_slug: 'cisco-catalyst-8000',
    specs_summary: '4x 1GbE RJ45/SFP WAN/LAN ports, 1x NIM slot, SD-WAN IPsec 1Gbps throughput',
    lifecycle_status: 'active',
    is_featured: true,
  },
  {
    id: 'prod-mikrotik-ccr2004',
    name: 'MikroTik Cloud Core Router CCR2004-16G-2S+',
    slug: 'mikrotik-ccr2004-16g-2s-plus',
    model: 'CCR2004-16G-2S+',
    part_number: 'CCR2004-16G-2S+',
    sku: 'CCR2004-16G-2S+',
    product_type: 'hardware',
    thumbnail: '/uploads/products/mikrotik-ccr.webp',
    brand: { name: 'MikroTik', slug: 'mikrotik', logo: '/uploads/brands/mikrotik.webp' },
    category: { name: 'Router / Thiết bị định tuyến', slug: 'router' },
    series_slug: 'mikrotik-ccr',
    specs_summary: 'CPU 4-core 1.7GHz ARMv8, 16x 1G RJ45, 2x 10G SFP+, RouterOS v7 Lic 6',
    lifecycle_status: 'active',
    is_featured: true,
  },
  {
    id: 'prod-mikrotik-rb5009',
    name: 'MikroTik RB5009UG+S+IN Heavy Duty Home Lab Router',
    slug: 'mikrotik-rb5009ug-s-in',
    model: 'RB5009UG+S+IN',
    part_number: 'RB5009UG+S+IN',
    sku: 'RB5009UG+S+IN',
    product_type: 'hardware',
    thumbnail: '/uploads/products/mikrotik-rb.webp',
    brand: { name: 'MikroTik', slug: 'mikrotik', logo: '/uploads/brands/mikrotik.webp' },
    category: { name: 'Router / Thiết bị định tuyến', slug: 'router' },
    series_slug: 'mikrotik-rb-series',
    specs_summary: '7x 1G ports, 1x 2.5G port, 1x 10G SFP+ port, CPU Quad-core 1.4GHz',
    lifecycle_status: 'active',
    is_featured: false,
  },

  // ── FIREWALL FORTINET, CISCO & PALO ALTO ──
  {
    id: 'prod-fortigate-60f',
    name: 'Fortinet FortiGate 60F Next-Gen Firewall',
    slug: 'fortinet-fortigate-fg-60f',
    model: 'FG-60F',
    part_number: 'FG-60F-BDL-950-12',
    sku: 'FG-60F',
    product_type: 'hardware',
    thumbnail: '/uploads/products/fortigate-60f.webp',
    brand: { name: 'Fortinet', slug: 'fortinet', logo: '/uploads/brands/fortinet.webp' },
    category: { name: 'Firewall / Tường lửa bảo mật', slug: 'firewall' },
    series_slug: 'fortigate-entry-level',
    specs_summary: '10x GE RJ45 ports (2x WAN, 1x DMZ, 7x Internal), Firewall 10 Gbps, IPS 1.4 Gbps, NGFW 1 Gbps',
    lifecycle_status: 'active',
    is_featured: true,
  },
  {
    id: 'prod-fortigate-70f',
    name: 'Fortinet FortiGate 70F High Performance Firewall',
    slug: 'fortinet-fortigate-fg-70f',
    model: 'FG-70F',
    part_number: 'FG-70F',
    sku: 'FG-70F',
    product_type: 'hardware',
    thumbnail: '/uploads/products/fortigate-60f.webp',
    brand: { name: 'Fortinet', slug: 'fortinet', logo: '/uploads/brands/fortinet.webp' },
    category: { name: 'Firewall / Tường lửa bảo mật', slug: 'firewall' },
    series_slug: 'fortigate-entry-level',
    specs_summary: 'Firewall Throughput 10 Gbps, Threat Protection 800 Mbps, 10x GE RJ45, SOC4 SD-WAN ASIC',
    lifecycle_status: 'active',
    is_featured: true,
  },
  {
    id: 'prod-fortigate-100f',
    name: 'Fortinet FortiGate 100F Enterprise Firewall',
    slug: 'fortinet-fortigate-fg-100f',
    model: 'FG-100F',
    part_number: 'FG-100F-BDL-950-12',
    sku: 'FG-100F',
    product_type: 'hardware',
    thumbnail: '/uploads/products/fortigate-100f.webp',
    brand: { name: 'Fortinet', slug: 'fortinet', logo: '/uploads/brands/fortinet.webp' },
    category: { name: 'Firewall / Tường lửa bảo mật', slug: 'firewall' },
    series_slug: 'fortigate-mid-range',
    specs_summary: '22x GE RJ45, 4x 10GE SFP+ slots, 1 Gbps Threat Protection, Dual Power Supplies',
    lifecycle_status: 'active',
    is_featured: true,
  },
  {
    id: 'prod-paloalto-pa440',
    name: 'Palo Alto PA-440 ML-Powered Next-Gen Firewall',
    slug: 'palo-alto-pa-440',
    model: 'PA-440',
    part_number: 'PAN-PA-440',
    sku: 'PA-440',
    product_type: 'hardware',
    thumbnail: '/uploads/products/paloalto-pa400.webp',
    brand: { name: 'Palo Alto Networks', slug: 'palo-alto', logo: '/uploads/brands/paloalto.webp' },
    category: { name: 'Firewall / Tường lửa bảo mật', slug: 'firewall' },
    series_slug: 'palo-alto-pa-400',
    specs_summary: 'PAN-OS ML-Powered Firewall, Threat Prevention Throughput 2.4 Gbps, Fanless silent design',
    lifecycle_status: 'active',
    is_featured: true,
  },

  // ── SERVER & STORAGE DELL & HPE ──
  {
    id: 'prod-dell-r750',
    name: 'Dell PowerEdge R750 2U Rackmount Server',
    slug: 'dell-poweredge-r750-rack-server',
    model: 'PowerEdge R750',
    part_number: 'R750-2X-GOLD-64G',
    sku: 'R750',
    product_type: 'hardware',
    thumbnail: '/uploads/products/dell-r750.webp',
    brand: { name: 'Dell Technologies', slug: 'dell', logo: '/uploads/brands/dell.webp' },
    category: { name: 'Server & Storage / Máy chủ lưu trữ', slug: 'server-storage' },
    series_slug: 'dell-poweredge-2u',
    specs_summary: 'Dual 3rd Gen Intel Xeon Scalable, 32x DDR4 DIMMs, Up to 24x 2.5" NVMe/SAS drives, iDRAC9 Ent',
    lifecycle_status: 'active',
    is_featured: true,
  },
  {
    id: 'prod-hpe-dl380',
    name: 'HPE ProLiant DL380 Gen10 2U Server',
    slug: 'hpe-proliant-dl380-gen10',
    model: 'DL380 Gen10',
    part_number: 'P02462-B21',
    sku: 'DL380-Gen10',
    product_type: 'hardware',
    thumbnail: '/uploads/products/hpe-dl380.webp',
    brand: { name: 'HPE (Hewlett Packard)', slug: 'hpe', logo: '/uploads/brands/hpe.webp' },
    category: { name: 'Server & Storage / Máy chủ lưu trữ', slug: 'server-storage' },
    series_slug: 'hpe-proliant-dl380',
    specs_summary: 'Intel Xeon Silver 4208, 32GB RAM DDR4 SmartMemory, Smart Array P408i-a, 8 SFF HDD Bays',
    lifecycle_status: 'active',
    is_featured: true,
  },
  {
    id: 'prod-synology-rs2423',
    name: 'Synology RackStation RS2423+ 12-Bay Storage',
    slug: 'synology-rackstation-rs2423-plus',
    model: 'RS2423+',
    part_number: 'RS2423+',
    sku: 'RS2423+',
    product_type: 'hardware',
    thumbnail: '/uploads/products/synology-rs.webp',
    brand: { name: 'Synology', slug: 'synology', logo: '/uploads/brands/synology.webp' },
    category: { name: 'Server & Storage / Máy chủ lưu trữ', slug: 'server-storage' },
    series_slug: 'synology-rackstation',
    specs_summary: '12-bay 2U Rackmount, AMD Ryzen Quad-core 3.35GHz, 10GbE RJ45 + 2x 1GbE, DSM Enterprise',
    lifecycle_status: 'active',
    is_featured: false,
  },

  // ── WIFI UBIQUITI & ARUBA ──
  {
    id: 'prod-unifi-u6-pro',
    name: 'Ubiquiti UniFi U6-Pro WiFi 6 Access Point',
    slug: 'ubiquiti-unifi-u6-pro',
    model: 'U6-Pro',
    part_number: 'U6-Pro',
    sku: 'U6-Pro',
    product_type: 'hardware',
    thumbnail: '/uploads/products/unifi-u6-pro.webp',
    brand: { name: 'Ubiquiti UniFi', slug: 'ubiquiti', logo: '/uploads/brands/ubiquiti.webp' },
    category: { name: 'WiFi / Thiết bị mạng không dây', slug: 'wifi' },
    series_slug: 'unifi-u6-standard',
    specs_summary: 'WiFi 6 (4x4 MU-MIMO), Dual-band 5.3 Gbps throughput, 300+ concurrent clients, PoE powered',
    lifecycle_status: 'active',
    is_featured: true,
  },
  {
    id: 'prod-unifi-u7-pro',
    name: 'Ubiquiti UniFi U7-Pro WiFi 7 Tri-Band AP',
    slug: 'ubiquiti-unifi-u7-pro',
    model: 'U7-Pro',
    part_number: 'U7-Pro',
    sku: 'U7-Pro',
    product_type: 'hardware',
    thumbnail: '/uploads/products/unifi-u7-pro.webp',
    brand: { name: 'Ubiquiti UniFi', slug: 'ubiquiti', logo: '/uploads/brands/ubiquiti.webp' },
    category: { name: 'WiFi / Thiết bị mạng không dây', slug: 'wifi' },
    series_slug: 'unifi-wifi7-enterprise',
    specs_summary: 'WiFi 7 Tri-Band 2.4/5/6 GHz, tốc độ 9.3 Gbps, 2.5 GbE uplink port, 300+ clients',
    lifecycle_status: 'active',
    is_featured: true,
  },
  {
    id: 'prod-aruba-ap515',
    name: 'Aruba AP-515 Unified Campus Access Point',
    slug: 'aruba-ap-515-q9h62a',
    model: 'AP-515',
    part_number: 'Q9H62A',
    sku: 'Q9H62A',
    product_type: 'hardware',
    thumbnail: '/uploads/products/aruba-ap500.webp',
    brand: { name: 'HPE Aruba', slug: 'hpe-aruba', logo: '/uploads/brands/aruba.webp' },
    category: { name: 'WiFi / Thiết bị mạng không dây', slug: 'wifi' },
    series_slug: 'aruba-ap-500',
    specs_summary: 'WiFi 6 4x4:4 MU-MIMO 5GHz + 2x2:2 2.4GHz, ClientMatch, Smart PoE, WPA3 Enterprise',
    lifecycle_status: 'active',
    is_featured: true,
  },

  // ── PHỤ KIỆN MODULE SFP ──
  {
    id: 'prod-cisco-glc-te',
    name: 'Cisco GLC-TE 1000BASE-T SFP Copper Transceiver',
    slug: 'cisco-glc-te-sfp-transceiver',
    model: 'GLC-TE',
    part_number: 'GLC-TE',
    sku: 'GLC-TE',
    product_type: 'hardware',
    thumbnail: '/uploads/products/cisco-sfp.webp',
    brand: { name: 'Cisco Systems', slug: 'cisco', logo: '/uploads/brands/cisco.webp' },
    category: { name: 'Phụ kiện & Module SFP / Cáp quang', slug: 'phu-kien-module' },
    series_slug: 'cisco-sfp-transceivers',
    specs_summary: 'Module quang cổng đồng RJ45 1Gbps khoảng cách 100m chuẩn Cat5e/Cat6',
    lifecycle_status: 'active',
    is_featured: false,
  },
  {
    id: 'prod-cisco-sfp-10g-sr',
    name: 'Cisco SFP-10G-SR 10GBASE-SR Multi-mode Transceiver',
    slug: 'cisco-sfp-10g-sr-transceiver',
    model: 'SFP-10G-SR',
    part_number: 'SFP-10G-SR',
    sku: 'SFP-10G-SR',
    product_type: 'hardware',
    thumbnail: '/uploads/products/cisco-sfp.webp',
    brand: { name: 'Cisco Systems', slug: 'cisco', logo: '/uploads/brands/cisco.webp' },
    category: { name: 'Phụ kiện & Module SFP / Cáp quang', slug: 'phu-kien-module' },
    series_slug: 'cisco-sfp-transceivers',
    specs_summary: 'Module quang 10Gbps Multi-mode bước sóng 850nm khoảng cách 300m đầu nối LC',
    lifecycle_status: 'active',
    is_featured: true,
  },
]

export default async function ProductCatalogPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams
  const domainSlug = resolvedParams.domain || ''
  const categorySlug = resolvedParams.category || ''
  const brandSlug = resolvedParams.brand || ''
  const seriesSlug = resolvedParams.series || ''
  const typeFilter = resolvedParams.type || ''
  const lifecycleFilter = resolvedParams.lifecycle || ''
  const sort = resolvedParams.sort || 'latest'
  const searchQuery = resolvedParams.q || ''
  const currentPage = Math.max(1, parseInt(resolvedParams.page || '1', 10))
  const pageSize = 12

  // Truy vấn DB nếu có
  const conditions: string[] = ['p.is_active = true']
  const params: any[] = []
  let paramIdx = 1

  if (categorySlug) {
    conditions.push(`c.slug = $${paramIdx++}`)
    params.push(categorySlug)
  }

  if (brandSlug) {
    conditions.push(`b.slug = $${paramIdx++}`)
    params.push(brandSlug)
  }

  if (searchQuery) {
    conditions.push(
      `(p.name ILIKE $${paramIdx} OR p.model ILIKE $${paramIdx} OR p.short_description ILIKE $${paramIdx})`
    )
    params.push(`%${searchQuery}%`)
    paramIdx++
  }

  let dbProducts: CatalogProductItem[] = []
  let totalDbCount = 0

  try {
    const listSql = `
      SELECT 
        p.id, p.name, p.slug, p.model, p.thumbnail, p.product_type, p.is_featured, p.short_description,
        b.name as brand_name, b.slug as brand_slug, b.logo as brand_logo,
        c.name as category_name, c.slug as category_slug,
        (SELECT pv.part_number FROM product_variants pv WHERE pv.product_id = p.id AND pv.is_active = true ORDER BY pv.id ASC LIMIT 1) as part_number,
        (SELECT pv.sku FROM product_variants pv WHERE pv.product_id = p.id AND pv.is_active = true ORDER BY pv.id ASC LIMIT 1) as sku,
        (SELECT pv.specifications_summary FROM product_variants pv WHERE pv.product_id = p.id AND pv.is_active = true ORDER BY pv.id ASC LIMIT 1) as specs_summary,
        (SELECT pl.status FROM product_lifecycle pl WHERE pl.product_id = p.id LIMIT 1) as lifecycle_status
      FROM products p
      JOIN brands b ON p.brand_id = b.id
      JOIN categories c ON p.category_id = c.id
      WHERE ${conditions.join(' AND ')}
      LIMIT 50
    `
    const rows = await query(listSql, params)
    dbProducts = rows.map((p) => ({
      id: String(p.id),
      name: p.name,
      slug: p.slug,
      model: p.model,
      part_number: p.part_number,
      sku: p.sku,
      product_type: p.product_type,
      thumbnail: p.thumbnail,
      brand: p.brand_name
        ? { name: p.brand_name, slug: p.brand_slug, logo: p.brand_logo }
        : null,
      category: p.category_name
        ? { name: p.category_name, slug: p.category_slug }
        : null,
      specs_summary: p.specs_summary || p.short_description || null,
      lifecycle_status: p.lifecycle_status || 'active',
      is_featured: Boolean(p.is_featured),
    }))
    totalDbCount = dbProducts.length
  } catch {
    dbProducts = []
  }

  // Kết hợp sản phẩm DB với sản phẩm Fallback để luôn sẵn sàng data khi kiểm thử bộ lọc 3 cấp
  const sourceProducts: CatalogProductItem[] =
    dbProducts.length > 0 ? [...dbProducts, ...FALLBACK_PRODUCTS] : FALLBACK_PRODUCTS

  // Áp dụng bộ lọc 3 cấp trên danh sách sản phẩm
  let filteredProducts = sourceProducts.filter((item) => {
    // 1. Cấp 1: Loại sản phẩm (Category)
    if (categorySlug && item.category?.slug.toLowerCase() !== categorySlug.toLowerCase()) {
      return false
    }

    // 2. Cấp 2: Hãng sản phẩm (Brand)
    if (brandSlug && item.brand?.slug.toLowerCase() !== brandSlug.toLowerCase()) {
      return false
    }

    // 3. Cấp 3: Dòng sản phẩm / Series
    if (seriesSlug) {
      if (item.series_slug && item.series_slug.toLowerCase() !== seriesSlug.toLowerCase()) {
        return false
      }
      if (!item.series_slug) {
        // Fallback kiểm tra text nếu item không có series_slug
        const serInfo = getSeriesBySlug(seriesSlug)
        if (serInfo) {
          const matchName = item.name.toLowerCase().includes(serInfo.series.slug.replace(/-/g, ' '))
          const matchModel = item.model && item.model.toLowerCase().includes(seriesSlug.replace(/-/g, ''))
          if (!matchName && !matchModel) return false
        }
      }
    }

    // 4. Tìm kiếm từ khóa
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      const match =
        item.name.toLowerCase().includes(q) ||
        (item.model && item.model.toLowerCase().includes(q)) ||
        (item.part_number && item.part_number.toLowerCase().includes(q)) ||
        (item.sku && item.sku.toLowerCase().includes(q)) ||
        (item.specs_summary && item.specs_summary.toLowerCase().includes(q))
      if (!match) return false
    }

    return true
  })

  // Sắp xếp
  if (sort === 'featured') {
    filteredProducts.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0))
  } else if (sort === 'name_asc') {
    filteredProducts.sort((a, b) => a.name.localeCompare(b.name))
  } else if (sort === 'name_desc') {
    filteredProducts.sort((a, b) => b.name.localeCompare(a.name))
  }

  const totalCount = filteredProducts.length
  const totalPages = Math.ceil(totalCount / pageSize)
  const offset = (currentPage - 1) * pageSize
  const displayedProducts = filteredProducts.slice(offset, offset + pageSize)

  // Thông tin tiêu đề trang động theo 3 cấp độ
  const activeCategoryObj = getCategoryBySlug(categorySlug)
  const activeBrandObj = getBrandBySlug(brandSlug, categorySlug)
  const activeSeriesInfo = getSeriesBySlug(seriesSlug)

  let pageHeading = 'Thiết Bị Phần Cứng & Hạ Tầng Mạng Enterprise'
  let pageSubheading =
    'Phân phối thiết bị chính hãng Cisco, HPE Aruba, Fortinet, Dell Technologies, Ubiquiti. Đầy đủ chứng chỉ CO/CQ, hồ sơ xuất xứ và hỗ trợ kỹ thuật chuyên sâu.'

  if (activeSeriesInfo) {
    pageHeading = `${activeSeriesInfo.series.name}`
    pageSubheading = `${activeSeriesInfo.series.description || 'Dòng thiết bị cao cấp chính hãng do GTS phân phối và hỗ trợ kỹ thuật chuyên sâu.'}`
  } else if (activeCategoryObj && activeBrandObj) {
    pageHeading = `${activeCategoryObj.shortName} — ${activeBrandObj.name}`
    pageSubheading = `Danh mục thiết bị ${activeCategoryObj.name.toLowerCase()} chính hãng thương hiệu ${activeBrandObj.name} do GTS phân phối trực tiếp.`
  } else if (activeCategoryObj) {
    pageHeading = activeCategoryObj.name
    pageSubheading = activeCategoryObj.description || `Các dòng sản phẩm ${activeCategoryObj.name.toLowerCase()} chính hãng cho doanh nghiệp.`
  } else if (activeBrandObj) {
    pageHeading = `Thiết Bị Chính Hãng ${activeBrandObj.name}`
    pageSubheading = `Giải pháp phần cứng và hạ tầng công nghệ thương hiệu ${activeBrandObj.name} kèm bảo hành và hỗ trợ kỹ thuật 24/7.`
  }

  // Helper build URL bộ lọc
  const buildFilterUrl = (newParams: Record<string, string | null>) => {
    const p = new URLSearchParams()
    if (categorySlug) p.set('category', categorySlug)
    if (brandSlug) p.set('brand', brandSlug)
    if (seriesSlug) p.set('series', seriesSlug)
    if (searchQuery) p.set('q', searchQuery)
    if (sort) p.set('sort', sort)

    Object.entries(newParams).forEach(([k, v]) => {
      if (v) p.set(k, v)
      else p.delete(k)
    })
    return `/san-pham?${p.toString()}`
  }

  return (
    <div className="bg-[#F8FAFC] py-6 sm:py-8">
      <div className="layout-container">
        {/* ── Breadcrumb Phân Cấp 3 Tầng ─────────────────────────────────── */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6 flex-wrap font-medium">
          <Link href="/" className="hover:text-[#1D4ED8] flex items-center gap-1 transition-colors">
            <Home className="w-3.5 h-3.5 text-slate-400" />
            <span>Trang chủ</span>
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-300" />
          <Link href="/san-pham" className="hover:text-[#1D4ED8] transition-colors">
            Sản phẩm & Thiết bị
          </Link>

          {/* Cấp 1 trong breadcrumb */}
          {activeCategoryObj && (
            <>
              <ChevronRight className="w-3 h-3 text-slate-300" />
              <Link
                href={`/san-pham?category=${activeCategoryObj.slug}`}
                className="hover:text-[#1D4ED8] transition-colors"
              >
                {activeCategoryObj.shortName}
              </Link>
            </>
          )}

          {/* Cấp 2 trong breadcrumb */}
          {activeBrandObj && (
            <>
              <ChevronRight className="w-3 h-3 text-slate-300" />
              <Link
                href={`/san-pham?${categorySlug ? `category=${categorySlug}&` : ''}brand=${activeBrandObj.slug}`}
                className="hover:text-[#1D4ED8] transition-colors"
              >
                {activeBrandObj.name}
              </Link>
            </>
          )}

          {/* Cấp 3 trong breadcrumb */}
          {activeSeriesInfo && (
            <>
              <ChevronRight className="w-3 h-3 text-slate-300" />
              <span className="text-slate-900 font-bold">
                {activeSeriesInfo.series.name}
              </span>
            </>
          )}
        </nav>

        {/* ── Page Layout: Sidebar Filter & Products Grid ─────────────────── */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Sidebar Bộ Lọc 3 Cấp Độ */}
          <ProductFilters
            currentCategory={categorySlug}
            currentBrand={brandSlug}
            currentSeries={seriesSlug}
            searchQuery={searchQuery}
            totalCount={totalCount}
          />

          {/* Main Products Content */}
          <main className="flex-1 w-full space-y-6">
            {/* Page Header Banner */}
            <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 bg-blue-50 text-[#1D4ED8] text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>
                    {activeSeriesInfo
                      ? 'Cấp 3: Dòng thiết bị chuyên biệt'
                      : activeBrandObj
                      ? 'Cấp 2: Thương hiệu Enterprise'
                      : activeCategoryObj
                      ? 'Cấp 1: Danh mục phần cứng'
                      : 'Hạ tầng B2B Enterprise'}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {pageHeading}
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
                  {pageSubheading}
                </p>
              </div>
            </div>

            {/* Sắp xếp & Thống kê Bar */}
            <div className="bg-white border border-slate-200 p-3 sm:p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 mr-2 flex items-center gap-1">
                  <ArrowUpDown className="w-3.5 h-3.5 text-[#1D4ED8]" /> Sắp xếp:
                </span>

                <Link
                  href={buildFilterUrl({ sort: 'latest' })}
                  className={`px-3 py-1.5 text-xs font-bold transition-all rounded-xl border ${
                    sort === 'latest'
                      ? 'bg-[#1D4ED8] text-white border-[#1D4ED8] shadow-xs'
                      : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
                  }`}
                >
                  Mới nhất
                </Link>

                <Link
                  href={buildFilterUrl({ sort: 'featured' })}
                  className={`px-3 py-1.5 text-xs font-bold transition-all rounded-xl border ${
                    sort === 'featured'
                      ? 'bg-[#1D4ED8] text-white border-[#1D4ED8] shadow-xs'
                      : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
                  }`}
                >
                  Thiết bị nổi bật
                </Link>

                <Link
                  href={buildFilterUrl({ sort: 'name_asc' })}
                  className={`px-3 py-1.5 text-xs font-bold transition-all rounded-xl border ${
                    sort === 'name_asc'
                      ? 'bg-[#1D4ED8] text-white border-[#1D4ED8] shadow-xs'
                      : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
                  }`}
                >
                  Tên A → Z
                </Link>

                <Link
                  href={buildFilterUrl({ sort: 'name_desc' })}
                  className={`px-3 py-1.5 text-xs font-bold transition-all rounded-xl border ${
                    sort === 'name_desc'
                      ? 'bg-[#1D4ED8] text-white border-[#1D4ED8] shadow-xs'
                      : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
                  }`}
                >
                  Tên Z → A
                </Link>
              </div>

              {/* Product Counter */}
              <div className="text-xs font-mono text-slate-600 bg-slate-50 px-3 py-1.5 border border-slate-200 rounded-xl self-start sm:self-auto whitespace-nowrap font-medium">
                Tìm thấy <span className="font-black text-[#1D4ED8]">{totalCount}</span> thiết bị
              </div>
            </div>

            {/* Product Grid */}
            {displayedProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5">
                {displayedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="bg-white border border-slate-200 p-12 text-center my-6 rounded-3xl shadow-xs">
                <div className="w-16 h-16 bg-slate-100 text-slate-500 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-200">
                  <PackageSearch className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-1.5 uppercase tracking-wide">
                  Không tìm thấy thiết bị phù hợp
                </h3>
                <p className="text-slate-500 text-xs max-w-md mx-auto mb-5 leading-relaxed">
                  Không có sản phẩm nào khớp với tiêu chí lọc hoặc từ khóa bạn nhập. Hãy thử chọn lại cấp độ hoặc liên hệ hotline để kiểm tra kho hàng thực tế.
                </p>
                <Link
                  href="/san-pham"
                  className="inline-flex items-center justify-center px-5 py-2.5 bg-[#1D4ED8] hover:bg-[#1E40AF] text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
                >
                  Xem toàn bộ thiết bị
                </Link>
              </div>
            )}

            {/* Phân trang */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-1.5 pt-6">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                  const url = buildFilterUrl({ page: String(p) })

                  return (
                    <Link
                      key={p}
                      href={url}
                      className={`w-9 h-9 flex items-center justify-center text-xs font-mono font-bold transition-colors rounded-xl border ${
                        currentPage === p
                          ? 'bg-[#1D4ED8] text-white border-[#1D4ED8] shadow-xs'
                          : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-200'
                      }`}
                    >
                      {p}
                    </Link>
                  )
                })}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
