-- ==========================================
-- MIGRATION: Add is_required + is_filterable to category_specifications
-- Run ONCE if the table already exists without these columns.
-- ==========================================

ALTER TABLE category_specifications
  ADD COLUMN IF NOT EXISTS is_required BOOLEAN NOT NULL DEFAULT FALSE;

ALTER TABLE category_specifications
  ADD COLUMN IF NOT EXISTS is_filterable BOOLEAN NOT NULL DEFAULT FALSE;

-- ==========================================
-- SEED: Specification Groups (10 groups)
-- ==========================================

INSERT INTO specification_groups (id, name, slug, description, sort_order, is_active) VALUES
  ('sg-networking',   'Ket noi & Cong',              'networking',   'Thong so ve cong mang va ket noi',  1,  true),
  ('sg-performance',  'Hieu nang & Nang luc',         'performance',  'Thong so ve toc do va dung luong',  2,  true),
  ('sg-power',        'Nguon dien & PoE',             'power',        'Thong so nguon cap dien',           3,  true),
  ('sg-software',     'Phan mem & He dieu hanh',      'software',     'He dieu hanh va tinh nang phan mem', 4, true),
  ('sg-hardware',     'Phan cung & Vat ly',           'hardware',     'Cau hinh phan cung vat ly',         5,  true),
  ('sg-storage',      'Luu tru',                      'storage',      'O cung va bo nho luu tru',          6,  true),
  ('sg-security',     'Bao mat',                      'security',     'Tinh nang va hieu nang bao mat',    7,  true),
  ('sg-wireless',     'Khong day & Wi-Fi',            'wireless',     'Chuan Wi-Fi va tan so phat song',   8,  true),
  ('sg-video',        'Video & Hoi nghi',             'video',        'Thong so camera va am thanh',       9,  true),
  ('sg-management',   'Quan ly & Tich hop',           'management',   'Nen tang quan ly va tuong thich',   10, true)
ON CONFLICT (id) DO NOTHING;

-- ==========================================
-- SEED: Specifications
-- ==========================================

-- === 1. SWITCH ===
INSERT INTO specifications (id, group_id, name, slug, data_type, unit, description, is_filterable, is_searchable, sort_order, is_active) VALUES
  ('spec-sw-ports',        'sg-networking',  'So cong Access',    'so-cong-access',      'number',  'Cong', 'So luong cong downlink 1G/10G (RJ45)',       true,  true,  1, true),
  ('spec-sw-uplink-count', 'sg-networking',  'So cong Uplink',    'so-cong-uplink',      'number',  'Cong', 'So cong SFP/SFP+ duong len',                 true,  false, 2, true),
  ('spec-sw-uplink-speed', 'sg-networking',  'Toc do Uplink',     'toc-do-uplink',       'select',  NULL,   'Bang thong moi cong Uplink',                  true,  false, 3, true),
  ('spec-sw-capacity',     'sg-performance', 'Switching Capacity', 'switching-capacity', 'number',  'Gbps', 'Tong bang thong chuyen mach (Backplane)',      true,  false, 4, true),
  ('spec-sw-forwarding',   'sg-performance', 'Forwarding Rate',   'forwarding-rate',     'number',  'Mpps', 'Toc do chuyen goi (Packet Per Second)',        false, false, 5, true),
  ('spec-sw-poe-support',  'sg-power',       'Ho tro PoE',        'ho-tro-poe',          'boolean', NULL,   'Thiet bi co cap nguon PoE qua cap mang khong?', true, false, 6, true),
  ('spec-sw-poe-budget',   'sg-power',       'PoE Budget',        'poe-budget',          'number',  'W',    'Tong cong suat PoE toi da (Watts)',            true,  false, 7, true),
  ('spec-sw-stacking',     'sg-software',    'Ho tro Stacking',   'ho-tro-stacking',     'boolean', NULL,   'Kha nang xep chong nhieu switch',             true,  false, 8, true),
  ('spec-sw-nos',          'sg-software',    'Network OS',        'network-os',          'text',    NULL,   'He dieu hanh mang (IOS XE, EOS, ...)',         false, true,  9, true),
  ('spec-sw-mac-table',    'sg-performance', 'MAC Address Table', 'mac-address-table',   'number',  'Entry','Kich thuoc bang MAC Address',                 false, false, 10, true)
ON CONFLICT (id) DO NOTHING;

-- === 2. ROUTER ===
INSERT INTO specifications (id, group_id, name, slug, data_type, unit, description, is_filterable, is_searchable, sort_order, is_active) VALUES
  ('spec-rt-wan-ports',      'sg-networking',  'So cong WAN',        'so-cong-wan',          'number', 'Cong', 'So luong va loai cong WAN',                 true,  false, 1, true),
  ('spec-rt-lan-ports',      'sg-networking',  'So cong LAN',        'so-cong-lan',          'number', 'Cong', 'So luong cong LAN noi bo',                  true,  false, 2, true),
  ('spec-rt-wan-throughput', 'sg-performance', 'WAN Throughput',     'wan-throughput',        'number', 'Gbps', 'Bang thong toi da qua WAN',                 true,  false, 3, true),
  ('spec-rt-vpn-throughput', 'sg-performance', 'VPN Throughput',     'vpn-throughput',        'number', 'Mbps', 'Hieu nang ma hoa VPN (IPsec/SSL)',           true,  false, 4, true),
  ('spec-rt-sessions',       'sg-performance', 'Concurrent Sessions','concurrent-sessions',   'number', NULL,   'So phien ket noi dong thoi toi da',          false, false, 5, true),
  ('spec-rt-protocols',      'sg-networking',  'Routing Protocols',  'routing-protocols',     'text',   NULL,   'Cac giao thuc dinh tuyen ho tro',             false, true,  6, true),
  ('spec-rt-vrf',            'sg-software',    'VRF Support',        'vrf-support',           'boolean',NULL,   'Ho tro Virtual Routing and Forwarding',      true,  false, 7, true)
ON CONFLICT (id) DO NOTHING;

-- === 3. FIREWALL ===
INSERT INTO specifications (id, group_id, name, slug, data_type, unit, description, is_filterable, is_searchable, sort_order, is_active) VALUES
  ('spec-fw-throughput',     'sg-security',   'Firewall Throughput',   'firewall-throughput',  'number', 'Gbps', 'Bang thong kiem tra Stateful co ban',       true,  false, 1, true),
  ('spec-fw-ips-throughput', 'sg-security',   'IPS/Threat Throughput', 'ips-throughput',       'number', 'Gbps', 'Hieu nang khi bat IPS va Anti-Malware',     true,  false, 2, true),
  ('spec-fw-vpn-tunnels',    'sg-security',   'VPN Tunnels (Max)',     'vpn-tunnels-max',      'number', NULL,   'So ket noi VPN Site-to-Site toi da',         true,  false, 3, true),
  ('spec-fw-interfaces',     'sg-networking', 'Giao dien mang',        'interfaces',           'text',   NULL,   'So luong va toc do cong (1G, 10G SFP+)',     false, false, 4, true),
  ('spec-fw-ha',             'sg-security',   'High Availability (HA)','high-availability',    'boolean',NULL,   'Ho tro du phong Active-Passive/Active-Active', true, false, 5, true)
ON CONFLICT (id) DO NOTHING;

-- === 4. SERVER ===
INSERT INTO specifications (id, group_id, name, slug, data_type, unit, description, is_filterable, is_searchable, sort_order, is_active) VALUES
  ('spec-sv-cpu',         'sg-hardware',  'CPU Model & Cores',     'cpu-model-cores',   'text',   NULL,    'Dong chip xu ly va so nhan (Intel Xeon, AMD EPYC)', true, true, 1, true),
  ('spec-sv-ram',         'sg-hardware',  'Memory (RAM)',          'memory-ram',         'text',   NULL,    'Dung luong va chuan RAM (DDR5 RDIMM)',         true,  false, 2, true),
  ('spec-sv-dimm-slots',  'sg-hardware',  'DIMM Slots',           'dimm-slots',          'number', NULL,    'So khe cam RAM de nang cap',                   true,  false, 3, true),
  ('spec-sv-drive-bays',  'sg-storage',   'Drive Bays',           'drive-bays',          'text',   NULL,    'So va loai khay o cung ho tro',                true,  false, 4, true),
  ('spec-sv-max-storage', 'sg-storage',   'Maximum Storage',      'maximum-storage',     'text',   NULL,    'Dung luong luu tru toi da mo rong',             false, false, 5, true),
  ('spec-sv-raid',        'sg-storage',   'RAID Controller',      'raid-controller',     'text',   NULL,    'Ho tro phan cung RAID (0,1,5,10)',              false, false, 6, true),
  ('spec-sv-nic',         'sg-networking','Network Ports (NIC)',   'network-ports-nic',   'text',   NULL,    'Cong mang tich hop san tren mainboard',        true,  false, 7, true),
  ('spec-sv-psu',         'sg-power',     'Power Supply (PSU)',    'power-supply',        'text',   NULL,    'Bo nguon va kha nang du phong (1+1)',           false, false, 8, true),
  ('spec-sv-rack-height', 'sg-hardware',  'Rack Height',          'rack-height',         'select', NULL,    'Kich thuoc chieu cao rack (1U, 2U, 4U)',        true,  false, 9, true)
ON CONFLICT (id) DO NOTHING;

-- === 5. ACCESS POINT ===
INSERT INTO specifications (id, group_id, name, slug, data_type, unit, description, is_filterable, is_searchable, sort_order, is_active) VALUES
  ('spec-ap-wifi-std',  'sg-wireless',  'Wi-Fi Standard',         'wifi-standard',       'select', NULL, 'Chuan Wi-Fi ho tro',                            true,  true,  1, true),
  ('spec-ap-bands',     'sg-wireless',  'Frequency Band',         'frequency-band',       'select', NULL, 'Bang tan hoat dong (Dual/Tri-band)',             true,  false, 2, true),
  ('spec-ap-mimo',      'sg-wireless',  'Spatial Streams / MIMO', 'spatial-streams-mimo', 'text',   NULL, 'Cong nghe MU-MIMO (4x4:4, ...)',                false, false, 3, true),
  ('spec-ap-max-rate',  'sg-wireless',  'Maximum Data Rate',      'maximum-data-rate',    'text',   NULL, 'Toc do ly thuyet tong (AX3000, BE11000...)',     true,  false, 4, true),
  ('spec-ap-eth-speed', 'sg-networking','Ethernet Port Speed',    'ethernet-port-speed',  'select', NULL, 'Toc do cong uplink co day (1G, 2.5G)',           true,  false, 5, true),
  ('spec-ap-security',  'sg-security',  'Security Standards',     'security-standards',   'text',   NULL, 'Chuan bao mat khong day (WPA3 Enterprise...)',   false, false, 6, true)
ON CONFLICT (id) DO NOTHING;

-- === 6. HNTH - HOI NGHI TRUYEN HINH ===
INSERT INTO specifications (id, group_id, name, slug, data_type, unit, description, is_filterable, is_searchable, sort_order, is_active) VALUES
  ('spec-vc-resolution', 'sg-video',      'Camera Resolution',      'camera-resolution',   'select', NULL, 'Do phan giai camera (4K, 1080p, ...)',        true,  true,  1, true),
  ('spec-vc-fov',        'sg-video',      'Field of View (FOV)',     'field-of-view',        'number', 'do', 'Goc nhin ong kinh (do)',                      true,  false, 2, true),
  ('spec-vc-zoom',       'sg-video',      'Zoom Capability',         'zoom-capability',      'text',   NULL, 'Zoom quang hoc / ky thuat so',                false, false, 3, true),
  ('spec-vc-mic-range',  'sg-video',      'Microphone Pickup Range', 'mic-pickup-range',     'text',   NULL, 'Khoang cach thu am toi da',                   false, false, 4, true),
  ('spec-vc-display',    'sg-video',      'Display Support',         'display-support',      'select', NULL, 'So man hinh xuat hinh (Single/Dual)',          true,  false, 5, true),
  ('spec-vc-platforms',  'sg-management', 'Supported Platforms',     'supported-platforms',  'text',   NULL, 'Nen tang hoi nghi tuong thich (Teams, Webex)', true, true,  6, true)
ON CONFLICT (id) DO NOTHING;

-- ==========================================
-- SEED: Specification Options (for 'select' data_type)
-- ==========================================

-- Uplink Speed
INSERT INTO specification_options (id, specification_id, value, label, sort_order, is_active) VALUES
  ('sopt-upspd-1g',   'spec-sw-uplink-speed', '1G',   '1 Gbps',   1, true),
  ('sopt-upspd-10g',  'spec-sw-uplink-speed', '10G',  '10 Gbps',  2, true),
  ('sopt-upspd-25g',  'spec-sw-uplink-speed', '25G',  '25 Gbps',  3, true),
  ('sopt-upspd-40g',  'spec-sw-uplink-speed', '40G',  '40 Gbps',  4, true),
  ('sopt-upspd-100g', 'spec-sw-uplink-speed', '100G', '100 Gbps', 5, true)
ON CONFLICT (id) DO NOTHING;

-- Rack Height
INSERT INTO specification_options (id, specification_id, value, label, sort_order, is_active) VALUES
  ('sopt-rack-1u', 'spec-sv-rack-height', '1U', '1U', 1, true),
  ('sopt-rack-2u', 'spec-sv-rack-height', '2U', '2U', 2, true),
  ('sopt-rack-4u', 'spec-sv-rack-height', '4U', '4U', 3, true),
  ('sopt-rack-8u', 'spec-sv-rack-height', '8U', '8U (Tower/Modular)', 4, true)
ON CONFLICT (id) DO NOTHING;

-- Wi-Fi Standard
INSERT INTO specification_options (id, specification_id, value, label, sort_order, is_active) VALUES
  ('sopt-wifi-5',  'spec-ap-wifi-std', 'wifi-5',  'Wi-Fi 5 (802.11ac)', 1, true),
  ('sopt-wifi-6',  'spec-ap-wifi-std', 'wifi-6',  'Wi-Fi 6 (802.11ax)', 2, true),
  ('sopt-wifi-6e', 'spec-ap-wifi-std', 'wifi-6e', 'Wi-Fi 6E (6 GHz)',   3, true),
  ('sopt-wifi-7',  'spec-ap-wifi-std', 'wifi-7',  'Wi-Fi 7 (802.11be)', 4, true)
ON CONFLICT (id) DO NOTHING;

-- Frequency Band
INSERT INTO specification_options (id, specification_id, value, label, sort_order, is_active) VALUES
  ('sopt-band-dual', 'spec-ap-bands', 'dual', 'Dual-band (2.4 GHz + 5 GHz)',         1, true),
  ('sopt-band-tri',  'spec-ap-bands', 'tri',  'Tri-band (2.4 GHz + 5 GHz + 6 GHz)', 2, true)
ON CONFLICT (id) DO NOTHING;

-- Ethernet Port Speed (AP)
INSERT INTO specification_options (id, specification_id, value, label, sort_order, is_active) VALUES
  ('sopt-eth-100m', 'spec-ap-eth-speed', '100M', '100 Mbps', 1, true),
  ('sopt-eth-1g',   'spec-ap-eth-speed', '1G',   '1 Gbps',   2, true),
  ('sopt-eth-2-5g', 'spec-ap-eth-speed', '2.5G', '2.5 Gbps', 3, true),
  ('sopt-eth-5g',   'spec-ap-eth-speed', '5G',   '5 Gbps',   4, true),
  ('sopt-eth-10g',  'spec-ap-eth-speed', '10G',  '10 Gbps',  5, true)
ON CONFLICT (id) DO NOTHING;

-- Camera Resolution
INSERT INTO specification_options (id, specification_id, value, label, sort_order, is_active) VALUES
  ('sopt-res-1080p', 'spec-vc-resolution', '1080p', 'Full HD (1080p)', 1, true),
  ('sopt-res-4k',    'spec-vc-resolution', '4K',    '4K Ultra HD',      2, true),
  ('sopt-res-12mp',  'spec-vc-resolution', '12MP',  '12 Megapixel',     3, true)
ON CONFLICT (id) DO NOTHING;

-- Display Support (VC)
INSERT INTO specification_options (id, specification_id, value, label, sort_order, is_active) VALUES
  ('sopt-disp-single', 'spec-vc-display', 'single', 'Single Display', 1, true),
  ('sopt-disp-dual',   'spec-vc-display', 'dual',   'Dual Display',   2, true)
ON CONFLICT (id) DO NOTHING;

-- ==========================================
-- SEED: Category ↔ Specification Mappings
--
-- NOTE: category_id phai khop voi id thuc te trong bang categories.
--   'cat-switch'       = category Switch
--   'cat-router'       = category Router
--   'cat-firewall'     = category Firewall
--   'cat-server'       = category Server
--   'cat-access-point' = category Access Point / Wi-Fi AP
--   'cat-hnth'         = category Hoi nghi truyen hinh
--
-- Xem category id thuc te bang lenh:
--   SELECT id, name FROM categories ORDER BY name;
-- Sau do thay the cac gia tri 'cat-switch', 'cat-router', ... bang id thuc te.
-- ==========================================

-- === SWITCH ===
INSERT INTO category_specifications (id, category_id, specification_id, is_required, is_filterable, sort_order, is_active) VALUES
  ('cs-sw-001', 'cat-switch', 'spec-sw-ports',        true,  true,  1,  true),
  ('cs-sw-002', 'cat-switch', 'spec-sw-uplink-count', true,  false, 2,  true),
  ('cs-sw-003', 'cat-switch', 'spec-sw-uplink-speed', true,  true,  3,  true),
  ('cs-sw-004', 'cat-switch', 'spec-sw-capacity',     true,  true,  4,  true),
  ('cs-sw-005', 'cat-switch', 'spec-sw-forwarding',   false, false, 5,  true),
  ('cs-sw-006', 'cat-switch', 'spec-sw-poe-support',  true,  true,  6,  true),
  ('cs-sw-007', 'cat-switch', 'spec-sw-poe-budget',   false, false, 7,  true),
  ('cs-sw-008', 'cat-switch', 'spec-sw-stacking',     false, true,  8,  true),
  ('cs-sw-009', 'cat-switch', 'spec-sw-nos',          false, false, 9,  true),
  ('cs-sw-010', 'cat-switch', 'spec-sw-mac-table',    false, false, 10, true)
ON CONFLICT ON CONSTRAINT uq_category_spec DO NOTHING;

-- === ROUTER ===
INSERT INTO category_specifications (id, category_id, specification_id, is_required, is_filterable, sort_order, is_active) VALUES
  ('cs-rt-001', 'cat-router', 'spec-rt-wan-ports',      true,  true,  1, true),
  ('cs-rt-002', 'cat-router', 'spec-rt-lan-ports',      true,  false, 2, true),
  ('cs-rt-003', 'cat-router', 'spec-rt-wan-throughput', true,  true,  3, true),
  ('cs-rt-004', 'cat-router', 'spec-rt-vpn-throughput', false, false, 4, true),
  ('cs-rt-005', 'cat-router', 'spec-rt-sessions',       false, false, 5, true),
  ('cs-rt-006', 'cat-router', 'spec-rt-protocols',      false, false, 6, true),
  ('cs-rt-007', 'cat-router', 'spec-rt-vrf',            false, true,  7, true)
ON CONFLICT ON CONSTRAINT uq_category_spec DO NOTHING;

-- === FIREWALL ===
INSERT INTO category_specifications (id, category_id, specification_id, is_required, is_filterable, sort_order, is_active) VALUES
  ('cs-fw-001', 'cat-firewall', 'spec-fw-throughput',     true,  true,  1, true),
  ('cs-fw-002', 'cat-firewall', 'spec-fw-ips-throughput', true,  true,  2, true),
  ('cs-fw-003', 'cat-firewall', 'spec-fw-vpn-tunnels',    true,  false, 3, true),
  ('cs-fw-004', 'cat-firewall', 'spec-fw-interfaces',     true,  false, 4, true),
  ('cs-fw-005', 'cat-firewall', 'spec-fw-ha',             false, true,  5, true)
ON CONFLICT ON CONSTRAINT uq_category_spec DO NOTHING;

-- === SERVER ===
INSERT INTO category_specifications (id, category_id, specification_id, is_required, is_filterable, sort_order, is_active) VALUES
  ('cs-sv-001', 'cat-server', 'spec-sv-cpu',         true,  true,  1, true),
  ('cs-sv-002', 'cat-server', 'spec-sv-ram',         true,  true,  2, true),
  ('cs-sv-003', 'cat-server', 'spec-sv-dimm-slots',  false, false, 3, true),
  ('cs-sv-004', 'cat-server', 'spec-sv-drive-bays',  true,  false, 4, true),
  ('cs-sv-005', 'cat-server', 'spec-sv-max-storage', false, false, 5, true),
  ('cs-sv-006', 'cat-server', 'spec-sv-raid',        false, false, 6, true),
  ('cs-sv-007', 'cat-server', 'spec-sv-nic',         true,  false, 7, true),
  ('cs-sv-008', 'cat-server', 'spec-sv-psu',         false, false, 8, true),
  ('cs-sv-009', 'cat-server', 'spec-sv-rack-height', true,  true,  9, true)
ON CONFLICT ON CONSTRAINT uq_category_spec DO NOTHING;

-- === ACCESS POINT ===
INSERT INTO category_specifications (id, category_id, specification_id, is_required, is_filterable, sort_order, is_active) VALUES
  ('cs-ap-001', 'cat-access-point', 'spec-ap-wifi-std',  true,  true,  1, true),
  ('cs-ap-002', 'cat-access-point', 'spec-ap-bands',     true,  true,  2, true),
  ('cs-ap-003', 'cat-access-point', 'spec-ap-mimo',      false, false, 3, true),
  ('cs-ap-004', 'cat-access-point', 'spec-ap-max-rate',  true,  false, 4, true),
  ('cs-ap-005', 'cat-access-point', 'spec-ap-eth-speed', true,  true,  5, true),
  ('cs-ap-006', 'cat-access-point', 'spec-ap-security',  false, false, 6, true)
ON CONFLICT ON CONSTRAINT uq_category_spec DO NOTHING;

-- === HNTH / VIDEO CONFERENCING ===
INSERT INTO category_specifications (id, category_id, specification_id, is_required, is_filterable, sort_order, is_active) VALUES
  ('cs-vc-001', 'cat-hnth', 'spec-vc-resolution', true,  true,  1, true),
  ('cs-vc-002', 'cat-hnth', 'spec-vc-fov',        true,  false, 2, true),
  ('cs-vc-003', 'cat-hnth', 'spec-vc-zoom',       false, false, 3, true),
  ('cs-vc-004', 'cat-hnth', 'spec-vc-mic-range',  false, false, 4, true),
  ('cs-vc-005', 'cat-hnth', 'spec-vc-display',    true,  true,  5, true),
  ('cs-vc-006', 'cat-hnth', 'spec-vc-platforms',  true,  true,  6, true)
ON CONFLICT ON CONSTRAINT uq_category_spec DO NOTHING;
