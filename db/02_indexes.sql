-- ============================================================
-- FILE: 02_indexes.sql
-- GTS Website Database - PostgreSQL
-- Toi uu truy van: B-Tree, Composite, Partial, GIN trigram
-- ============================================================
-- CHAY SAU: 01_schema_tables.sql
-- YEU CAU: CREATE EXTENSION IF NOT EXISTS pg_trgm;
-- ============================================================

CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS unaccent;

-- ============================================================
-- [A] BANG: products  (truy van nhieu nhat)
-- ============================================================

-- Loc theo hang + active (trang /brands/{slug})
CREATE INDEX IF NOT EXISTS idx_products_brand_active
    ON products (brand_id, is_active);

-- Loc theo linh vuc + active (trang /domains/{slug})
CREATE INDEX IF NOT EXISTS idx_products_domain_active
    ON products (domain_id, is_active);

-- Loc theo danh muc + active (sidebar filter)
CREATE INDEX IF NOT EXISTS idx_products_category_active
    ON products (category_id, is_active);

-- Loc theo dong san pham
CREATE INDEX IF NOT EXISTS idx_products_family_active
    ON products (family_id, is_active);

-- Multi-filter: hang + linh vuc + danh muc (trang tim kiem nang cao)
CREATE INDEX IF NOT EXISTS idx_products_brand_domain_cat
    ON products (brand_id, domain_id, category_id, is_active);

-- Loc theo trang thai kinh doanh (admin, bao cao)
CREATE INDEX IF NOT EXISTS idx_products_status
    ON products (status, created_at DESC);

-- San pham noi bat trang chu (partial: chi is_featured rows)
CREATE INDEX IF NOT EXISTS idx_products_featured
    ON products (is_featured, created_at DESC)
    WHERE is_featured = TRUE AND is_active = TRUE;

-- EOL date tracking (partial: chi row co gia tri)
CREATE INDEX IF NOT EXISTS idx_products_eol_date
    ON products (eol_date)
    WHERE eol_date IS NOT NULL;

-- Phan trang admin: moi nhat truoc
CREATE INDEX IF NOT EXISTS idx_products_created_at
    ON products (created_at DESC);

-- Full-text search: ten san pham (GIN trigram - ho tro ILIKE)
CREATE INDEX IF NOT EXISTS idx_products_name_trgm
    ON products USING GIN (name gin_trgm_ops);

-- Full-text search: ma model (KH thuong search truc tiep ma hang)
CREATE INDEX IF NOT EXISTS idx_products_model_trgm
    ON products USING GIN (model gin_trgm_ops);

-- Full-text search toan van: name + model + short_description
CREATE INDEX IF NOT EXISTS idx_products_fts
    ON products USING GIN (
        to_tsvector('english',
            coalesce(name, '') || ' ' ||
            coalesce(model, '') || ' ' ||
            coalesce(short_description, '')
        )
    );

-- ============================================================
-- [B] BANG: product_variants
-- ============================================================

-- Lay bien the theo product
CREATE INDEX IF NOT EXISTS idx_pv_product_active
    ON product_variants (product_id, is_active);

-- Tim kiem PID (ma dat hang cua hang) - GIN trigram
CREATE INDEX IF NOT EXISTS idx_pv_pid_trgm
    ON product_variants USING GIN (pid gin_trgm_ops);

-- Tim kiem SKU noi bo
CREATE INDEX IF NOT EXISTS idx_pv_sku_trgm
    ON product_variants USING GIN (sku gin_trgm_ops);

-- ============================================================
-- [C] BANG: product_specifications  (loc sidebar theo thong so)
-- ============================================================

-- Filter theo thong so so (so cong, cong suat W, dung luong GB)
-- VD: WHERE specification_id = 'spec_ports' AND value_number BETWEEN 24 AND 48
CREATE INDEX IF NOT EXISTS idx_ps_spec_value_number
    ON product_specifications (specification_id, value_number)
    WHERE value_number IS NOT NULL;

-- Filter theo thong so text/select (chuan Wi-Fi, giao thuc...)
-- VD: WHERE specification_id = 'spec_wifi' AND value_text = 'wifi-6e'
CREATE INDEX IF NOT EXISTS idx_ps_spec_value_text
    ON product_specifications (specification_id, value_text)
    WHERE value_text IS NOT NULL;

-- Lay toan bo thong so cua 1 san pham (trang chi tiet)
CREATE INDEX IF NOT EXISTS idx_ps_product_id
    ON product_specifications (product_id);

-- Tim kiem trong JSONB (danh sach cong, module...)
CREATE INDEX IF NOT EXISTS idx_ps_value_json
    ON product_specifications USING GIN (value_json jsonb_path_ops)
    WHERE value_json IS NOT NULL;

-- ============================================================
-- [D] BANG: brands / domains / categories
-- ============================================================

-- Dropdown + menu hang (chi active, sort)
CREATE INDEX IF NOT EXISTS idx_brands_active
    ON brands (sort_order, name)
    WHERE is_active = TRUE;

-- Menu linh vuc (chi active)
CREATE INDEX IF NOT EXISTS idx_domains_active
    ON domains (sort_order, name)
    WHERE is_active = TRUE;

-- Cay danh muc: lay danh muc con theo parent
CREATE INDEX IF NOT EXISTS idx_categories_parent
    ON categories (parent_id, sort_order)
    WHERE is_active = TRUE;

-- Sidebar: danh muc theo linh vuc
CREATE INDEX IF NOT EXISTS idx_categories_domain
    ON categories (domain_id, sort_order)
    WHERE is_active = TRUE;

-- ============================================================
-- [E] BANG: product_use_cases / product_platforms / product_relationships
-- ============================================================

-- Tim san pham theo use case + muc do phu hop
CREATE INDEX IF NOT EXISTS idx_puc_usecase_suitability
    ON product_use_cases (use_case_id, suitability);

-- Lay use case cua 1 san pham (trang chi tiet)
CREATE INDEX IF NOT EXISTS idx_puc_product_id
    ON product_use_cases (product_id);

-- Use cases theo linh vuc
CREATE INDEX IF NOT EXISTS idx_use_cases_domain
    ON use_cases (domain_id, sort_order)
    WHERE is_active = TRUE;

-- San pham ho tro platform nao
CREATE INDEX IF NOT EXISTS idx_pp_product_id
    ON product_platforms (product_id);

CREATE INDEX IF NOT EXISTS idx_pp_platform
    ON product_platforms (platform_id, support_type);

-- San pham lien quan, phu kien, thay the
CREATE INDEX IF NOT EXISTS idx_pr_product_type
    ON product_relationships (product_id, relationship_type);

CREATE INDEX IF NOT EXISTS idx_pr_related_product
    ON product_relationships (related_product_id, relationship_type);

-- ============================================================
-- [F] BANG: product_images / product_lifecycle / documents
-- ============================================================

-- Anh chinh (thumbnail listing) - partial: chi is_primary rows
CREATE INDEX IF NOT EXISTS idx_pi_primary
    ON product_images (product_id)
    WHERE is_primary = TRUE;

-- Gallery: tat ca anh theo thu tu
CREATE INDEX IF NOT EXISTS idx_pi_product_sort
    ON product_images (product_id, sort_order);

-- Vong doi: loc theo trang thai
CREATE INDEX IF NOT EXISTS idx_lifecycle_status
    ON product_lifecycle (status, product_id);

-- Vong doi: san pham sap het hang (partial)
CREATE INDEX IF NOT EXISTS idx_lifecycle_end_of_sale
    ON product_lifecycle (end_of_sale_date, product_id)
    WHERE end_of_sale_date IS NOT NULL;

-- Tai lieu theo san pham + loai + ngon ngu
CREATE INDEX IF NOT EXISTS idx_docs_product_type_lang
    ON documents (product_id, document_type, language)
    WHERE is_active = TRUE;

-- ============================================================
-- [G] BANG: contents (Tin tuc + Banner)
-- ============================================================

-- Tin tuc: list theo moi nhat (partial: chi active)
CREATE INDEX IF NOT EXISTS idx_contents_type_published
    ON contents (type, published_at DESC)
    WHERE is_active = TRUE;

-- Banner dang trong lich hien thi
CREATE INDEX IF NOT EXISTS idx_contents_banner
    ON contents (type, sort_order, start_at, end_at)
    WHERE type = 'banner' AND is_active = TRUE;

-- Tin tuc / banner noi bat (partial)
CREATE INDEX IF NOT EXISTS idx_contents_featured
    ON contents (type, published_at DESC)
    WHERE is_featured = TRUE AND is_active = TRUE;

-- Tin tuc theo danh muc
CREATE INDEX IF NOT EXISTS idx_contents_category
    ON contents (category, published_at DESC)
    WHERE type = 'news' AND is_active = TRUE;

-- Full-text search tieu de tin tuc
CREATE INDEX IF NOT EXISTS idx_contents_title_trgm
    ON contents USING GIN (title gin_trgm_ops);

-- ============================================================
-- [H] BANG: solutions / projects / support_contents
-- ============================================================

-- Giai phap noi bat trang chu
CREATE INDEX IF NOT EXISTS idx_solutions_featured
    ON solutions (sort_order, domain_id)
    WHERE is_featured = TRUE AND is_active = TRUE;

-- San pham trong giai phap
CREATE INDEX IF NOT EXISTS idx_sp_solution_id
    ON solution_products (solution_id, sort_order);

CREATE INDEX IF NOT EXISTS idx_sp_product_id
    ON solution_products (product_id);

-- Du an noi bat / portfolio
CREATE INDEX IF NOT EXISTS idx_projects_featured
    ON projects (is_featured, completion_date DESC)
    WHERE is_featured = TRUE AND is_active = TRUE;

-- Du an theo khach hang
CREATE INDEX IF NOT EXISTS idx_projects_customer
    ON projects (customer_id)
    WHERE is_active = TRUE;

-- Ho tro: theo san pham + loai
CREATE INDEX IF NOT EXISTS idx_sc_product_type
    ON support_contents (product_id, type, sort_order)
    WHERE is_active = TRUE;

-- Tim kiem bai ho tro
CREATE INDEX IF NOT EXISTS idx_sc_title_trgm
    ON support_contents USING GIN (title gin_trgm_ops);

-- ============================================================
-- [I] BANG: contact_requests  (CRM / Lead management)
-- ============================================================

-- Loc theo trang thai + ngay (admin CRM)
CREATE INDEX IF NOT EXISTS idx_cr_status_created
    ON contact_requests (status, created_at DESC);

-- Phan cong nhan vien (partial: chi row da phan cong)
CREATE INDEX IF NOT EXISTS idx_cr_assigned_status
    ON contact_requests (assigned_to, status, created_at DESC)
    WHERE assigned_to IS NOT NULL;

-- Tim theo email (check duplicate lead)
CREATE INDEX IF NOT EXISTS idx_cr_email
    ON contact_requests (email, created_at DESC);

-- Tim theo email khong phan biet hoa/thuong (expression index)
CREATE INDEX IF NOT EXISTS idx_cr_email_lower
    ON contact_requests (LOWER(email));

-- Bao cao: san pham duoc bao gia nhieu nhat
CREATE INDEX IF NOT EXISTS idx_cr_type_product
    ON contact_requests (request_type, product_id, created_at DESC)
    WHERE product_id IS NOT NULL;

-- Phan trang admin
CREATE INDEX IF NOT EXISTS idx_cr_created_at
    ON contact_requests (created_at DESC);

-- ============================================================
-- [J] BANG: admin_users
-- ============================================================

-- Dang nhap: tim theo email khong phan biet hoa/thuong
CREATE INDEX IF NOT EXISTS idx_admin_users_email_lower
    ON admin_users (LOWER(email));

-- ============================================================
-- GHI CHU
-- ============================================================
-- 1. UNIQUE constraints tren cac cot slug, email, key da tu dong
--    tao B-Tree index -> khong can tao them.
-- 2. VARCHAR(255) PK: PostgreSQL tu dong tao B-Tree index tren PK.
-- 3. Foreign key columns (brand_id, product_id...): chi index khi
--    la filter chinh cua query, khong index tat ca FK.
-- 4. Sau 30 ngay, kiem tra index khong su dung:
--    SELECT indexrelname, idx_scan
--    FROM   pg_stat_user_indexes
--    WHERE  idx_scan = 0
--    ORDER  BY relname;
-- ============================================================
