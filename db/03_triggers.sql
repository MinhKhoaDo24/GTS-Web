-- ============================================================
-- FILE: 03_triggers.sql
-- GTS Website Database - PostgreSQL
-- Chi cac trigger thiet yeu (set-and-forget)
-- ============================================================
-- CHAY SAU: 01_schema_tables.sql
-- ============================================================
-- 3 TRIGGER DUOC GIU LAI:
--   [1] fn_set_updated_at       - Tu dong cap nhat updated_at
--   [2] fn_ensure_one_primary   - Dam bao 1 anh chinh / san pham
--   [3] fn_sync_product_status  - Dong bo status EOL -> products
-- Cac logic nghiep vu khac xu ly trong JS / Prisma middleware.
-- ============================================================


-- ============================================================
-- [1] Tu dong cap nhat updated_at
-- ============================================================
-- LY DO DUNG TRIGGER:
--   - Raw SQL / migration / pgAdmin se bypass Prisma middleware.
--   - Trigger chay trong cung transaction -> khong the bo sot.
-- ============================================================

CREATE OR REPLACE FUNCTION fn_set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- Ap dung cho tat ca bang co cot updated_at

CREATE OR REPLACE TRIGGER trg_updated_at_brands
    BEFORE UPDATE ON brands
    FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

CREATE OR REPLACE TRIGGER trg_updated_at_product_families
    BEFORE UPDATE ON product_families
    FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

CREATE OR REPLACE TRIGGER trg_updated_at_products
    BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

CREATE OR REPLACE TRIGGER trg_updated_at_product_variants
    BEFORE UPDATE ON product_variants
    FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

CREATE OR REPLACE TRIGGER trg_updated_at_specification_groups
    BEFORE UPDATE ON specification_groups
    FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

CREATE OR REPLACE TRIGGER trg_updated_at_specifications
    BEFORE UPDATE ON specifications
    FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

CREATE OR REPLACE TRIGGER trg_updated_at_product_specifications
    BEFORE UPDATE ON product_specifications
    FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

CREATE OR REPLACE TRIGGER trg_updated_at_platforms
    BEFORE UPDATE ON platforms
    FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

CREATE OR REPLACE TRIGGER trg_updated_at_use_cases
    BEFORE UPDATE ON use_cases
    FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

CREATE OR REPLACE TRIGGER trg_updated_at_documents
    BEFORE UPDATE ON documents
    FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

CREATE OR REPLACE TRIGGER trg_updated_at_product_lifecycle
    BEFORE UPDATE ON product_lifecycle
    FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

CREATE OR REPLACE TRIGGER trg_updated_at_admin_users
    BEFORE UPDATE ON admin_users
    FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

CREATE OR REPLACE TRIGGER trg_updated_at_pages
    BEFORE UPDATE ON pages
    FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

CREATE OR REPLACE TRIGGER trg_updated_at_contents
    BEFORE UPDATE ON contents
    FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

CREATE OR REPLACE TRIGGER trg_updated_at_solutions
    BEFORE UPDATE ON solutions
    FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

CREATE OR REPLACE TRIGGER trg_updated_at_services
    BEFORE UPDATE ON services
    FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

CREATE OR REPLACE TRIGGER trg_updated_at_customers
    BEFORE UPDATE ON customers
    FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

CREATE OR REPLACE TRIGGER trg_updated_at_partners
    BEFORE UPDATE ON partners
    FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

CREATE OR REPLACE TRIGGER trg_updated_at_projects
    BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

CREATE OR REPLACE TRIGGER trg_updated_at_support_contents
    BEFORE UPDATE ON support_contents
    FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

CREATE OR REPLACE TRIGGER trg_updated_at_contact_requests
    BEFORE UPDATE ON contact_requests
    FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

-- NOTE: domains va site_settings khong co updated_at trong schema
-- -> khong can trigger cho 2 bang nay.


-- ============================================================
-- [2] Dam bao chi co 1 anh chinh (is_primary) / san pham
-- ============================================================
-- LY DO DUNG TRIGGER:
--   - Day la rang buoc toan ven du lieu, khong phai logic nghiep vu.
--   - Race condition (2 request dong thoi set is_primary=TRUE)
--     khong the xu ly an toan bang JS.
--   - Trigger chay trong cung transaction -> dam bao atomic.
-- ============================================================

CREATE OR REPLACE FUNCTION fn_ensure_one_primary_image()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    -- Khi 1 anh duoc set is_primary = TRUE:
    -- tu dong reset anh primary cu cua cung san pham ve FALSE
    IF NEW.is_primary = TRUE THEN
        UPDATE product_images
        SET    is_primary = FALSE
        WHERE  product_id = NEW.product_id
          AND  id <> NEW.id
          AND  is_primary = TRUE;    -- Chi update anh dang la primary (tranh I/O thua)
    END IF;
    RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER trg_ensure_one_primary_image
    BEFORE INSERT OR UPDATE OF is_primary ON product_images
    FOR EACH ROW
    WHEN (NEW.is_primary = TRUE)
    EXECUTE FUNCTION fn_ensure_one_primary_image();


-- ============================================================
-- [3] Dong bo products.status khi product_lifecycle thay doi
-- ============================================================
-- LY DO DUNG TRIGGER:
--   - Import du lieu EOL tu hang bang script/migration -> bypass JS.
--   - products.status phai nhat quan voi product_lifecycle.status.
-- QUY TAC MAP:
--   lifecycle.end_of_sale  -> products.end_of_sale
--   lifecycle.discontinued -> products.discontinued
--   lifecycle.end_of_support -> products.discontinued
--   lifecycle.active       -> products.active
--   lifecycle.last_ship    -> giu nguyen (khong thay doi)
-- ============================================================

CREATE OR REPLACE FUNCTION fn_sync_product_status_from_lifecycle()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE
    v_new_status VARCHAR(50);
BEGIN
    v_new_status := CASE NEW.status
        WHEN 'end_of_sale'    THEN 'end_of_sale'
        WHEN 'discontinued'   THEN 'discontinued'
        WHEN 'end_of_support' THEN 'discontinued'
        WHEN 'active'         THEN 'active'
        ELSE NULL   -- last_ship: khong thay doi products.status
    END;

    IF v_new_status IS NOT NULL THEN
        UPDATE products
        SET    status = v_new_status
        WHERE  id = NEW.product_id
          AND  status <> v_new_status;  -- Tranh UPDATE thua
    END IF;

    RETURN NEW;
END;
$$;

-- INSERT: khi them ban ghi lifecycle moi (khong co OLD)
CREATE OR REPLACE TRIGGER trg_sync_product_status_lifecycle_insert
    AFTER INSERT ON product_lifecycle
    FOR EACH ROW
    EXECUTE FUNCTION fn_sync_product_status_from_lifecycle();

-- UPDATE: chi chay khi status thuc su thay doi (co OLD, co NEW)
CREATE OR REPLACE TRIGGER trg_sync_product_status_lifecycle_update
    AFTER UPDATE OF status ON product_lifecycle
    FOR EACH ROW
    WHEN (OLD.status IS DISTINCT FROM NEW.status)
    EXECUTE FUNCTION fn_sync_product_status_from_lifecycle();


-- ============================================================
-- KIEM TRA SAU KHI CHAY FILE
-- ============================================================
-- SELECT trigger_name, event_object_table, event_manipulation,
--        action_timing, action_orientation
-- FROM   information_schema.triggers
-- WHERE  trigger_schema = 'public'
-- ORDER  BY event_object_table, trigger_name;
--
-- Ket qua mong doi:
--   - 21 trigger trg_updated_at_*              (BEFORE UPDATE tren 21 bang)
--   - 1  trigger trg_ensure_one_primary_image  (BEFORE INSERT OR UPDATE)
--   - 1  trigger trg_sync_product_status_lifecycle_insert  (AFTER INSERT)
--   - 1  trigger trg_sync_product_status_lifecycle_update  (AFTER UPDATE)
-- Tong: 24 trigger, 3 trigger function
-- ============================================================
