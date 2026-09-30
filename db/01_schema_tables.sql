-- ==========================================
-- GTS WEBSITE DATABASE DDL (PostgreSQL)
-- ==========================================

-- ------------------------------------------
-- 1. PRODUCT CATALOG - CORE
-- ------------------------------------------

CREATE TABLE domains (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255),
    slug VARCHAR(255),
    description TEXT,
    image VARCHAR(255),
    icon VARCHAR(255),
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE brands (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255),
    slug VARCHAR(255),
    logo VARCHAR(255),
    website VARCHAR(255),
    description TEXT,
    country VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE product_families (
    id VARCHAR(255) PRIMARY KEY,
    brand_id VARCHAR(255),
    domain_id VARCHAR(255),
    name VARCHAR(255),
    slug VARCHAR(255),
    description TEXT,
    image VARCHAR(255),
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE categories (
    id VARCHAR(255) PRIMARY KEY,
    domain_id VARCHAR(255),
    parent_id VARCHAR(255),
    name VARCHAR(255),
    slug VARCHAR(255),
    description TEXT,
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE products (
    id VARCHAR(255) PRIMARY KEY,
    brand_id VARCHAR(255),
    domain_id VARCHAR(255),
    family_id VARCHAR(255),
    category_id VARCHAR(255),
    name VARCHAR(255),
    slug VARCHAR(255),
    model VARCHAR(255),
    short_description TEXT,
    description TEXT,
    product_type VARCHAR(100),
    status VARCHAR(50),
    release_date DATE,
    eol_date DATE,
    thumbnail VARCHAR(255),
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    seo_title VARCHAR(255),
    seo_description VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE product_variants (
    id VARCHAR(255) PRIMARY KEY,
    product_id VARCHAR(255),
    sku VARCHAR(100),
    pid VARCHAR(100),
    model_number VARCHAR(100),
    part_number VARCHAR(100),
    variant_name VARCHAR(255),
    region VARCHAR(100),
    color VARCHAR(100),
    bundle VARCHAR(255),
    specifications_summary TEXT,
    status VARCHAR(50),
    notes TEXT,
    is_active BOOLEAN DEFAULT TRUE
);

-- ------------------------------------------
-- 2. SPECIFICATIONS
-- ------------------------------------------

CREATE TABLE specification_groups (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255),
    slug VARCHAR(255),
    description TEXT,
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE specifications (
    id VARCHAR(255) PRIMARY KEY,
    group_id VARCHAR(255),
    name VARCHAR(255),
    slug VARCHAR(255),
    data_type VARCHAR(50),
    unit VARCHAR(50),
    description TEXT,
    is_filterable BOOLEAN DEFAULT FALSE,
    is_searchable BOOLEAN DEFAULT FALSE,
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE specification_options (
    id VARCHAR(255) PRIMARY KEY,
    specification_id VARCHAR(255),
    value VARCHAR(255),
    label VARCHAR(255),
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE product_specifications (
    id VARCHAR(255) PRIMARY KEY,
    product_id VARCHAR(255),
    specification_id VARCHAR(255),
    value_number NUMERIC,
    value_text TEXT,
    value_boolean BOOLEAN,
    value_json JSONB,
    min_value NUMERIC,
    max_value NUMERIC,
    unit_override VARCHAR(50),
    notes TEXT
);

CREATE TABLE specification_aliases (
    id VARCHAR(255) PRIMARY KEY,
    specification_id VARCHAR(255),
    brand_id VARCHAR(255),
    alias VARCHAR(255),
    notes TEXT
);

-- ------------------------------------------
-- 3. ECOSYSTEM / PRODUCT RELATIONS
-- ------------------------------------------

CREATE TABLE platforms (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255),
    slug VARCHAR(255),
    type VARCHAR(100),
    description TEXT,
    logo VARCHAR(255),
    website VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE product_platforms (
    id VARCHAR(255) PRIMARY KEY,
    product_id VARCHAR(255),
    platform_id VARCHAR(255),
    support_type VARCHAR(100),
    version VARCHAR(100),
    notes TEXT
);

CREATE TABLE use_cases (
    id VARCHAR(255) PRIMARY KEY,
    domain_id VARCHAR(255),
    parent_id VARCHAR(255),
    name VARCHAR(255),
    slug VARCHAR(255),
    description TEXT,
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE product_use_cases (
    id VARCHAR(255) PRIMARY KEY,
    product_id VARCHAR(255),
    use_case_id VARCHAR(255),
    suitability VARCHAR(100),
    notes TEXT
);

CREATE TABLE product_relationships (
    id VARCHAR(255) PRIMARY KEY,
    product_id VARCHAR(255),
    related_product_id VARCHAR(255),
    relationship_type VARCHAR(100),
    notes TEXT
);

CREATE TABLE documents (
    id VARCHAR(255) PRIMARY KEY,
    product_id VARCHAR(255),
    title VARCHAR(255),
    document_type VARCHAR(100),
    url VARCHAR(255),
    file_path VARCHAR(255),
    version VARCHAR(50),
    language VARCHAR(50),
    description TEXT,
    published_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE product_images (
    id VARCHAR(255) PRIMARY KEY,
    product_id VARCHAR(255),
    image_url VARCHAR(255),
    image_path VARCHAR(255),
    image_type VARCHAR(100),
    alt_text VARCHAR(255),
    sort_order INT DEFAULT 0,
    is_primary BOOLEAN DEFAULT FALSE
);

CREATE TABLE product_lifecycle (
    id VARCHAR(255) PRIMARY KEY,
    product_id VARCHAR(255),
    status VARCHAR(100),
    announcement_date DATE,
    end_of_sale_date DATE,
    last_ship_date DATE,
    end_of_support_date DATE,
    replacement_product_id VARCHAR(255),
    notes TEXT
);

-- ------------------------------------------
-- 4. WEBSITE / CMS
-- ------------------------------------------

CREATE TABLE admin_users (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    password_hash VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE pages (
    id VARCHAR(255) PRIMARY KEY,
    parent_id VARCHAR(255),
    title VARCHAR(255),
    slug VARCHAR(255),
    page_type VARCHAR(100),
    content TEXT,
    thumbnail VARCHAR(255),
    banner VARCHAR(255),
    seo_title VARCHAR(255),
    seo_description VARCHAR(255),
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE site_settings (
    id VARCHAR(255) PRIMARY KEY,
    key VARCHAR(255) UNIQUE,
    value TEXT,
    type VARCHAR(50),
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE contents (
    id VARCHAR(255) PRIMARY KEY,
    type VARCHAR(100),
    category VARCHAR(100),
    title VARCHAR(255),
    slug VARCHAR(255),
    summary TEXT,
    content TEXT,
    thumbnail VARCHAR(255),
    banner VARCHAR(255),
    mobile_image VARCHAR(255),
    link_url VARCHAR(255),
    button_text VARCHAR(100),
    author VARCHAR(255),
    published_at TIMESTAMPTZ,
    start_at TIMESTAMPTZ,
    end_at TIMESTAMPTZ,
    sort_order INT DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    seo_title VARCHAR(255),
    seo_description VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE solutions (
    id VARCHAR(255) PRIMARY KEY,
    domain_id VARCHAR(255),
    name VARCHAR(255),
    slug VARCHAR(255),
    short_description TEXT,
    description TEXT,
    thumbnail VARCHAR(255),
    banner VARCHAR(255),
    sort_order INT DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    seo_title VARCHAR(255),
    seo_description VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE solution_products (
    id VARCHAR(255) PRIMARY KEY,
    solution_id VARCHAR(255),
    product_id VARCHAR(255),
    role VARCHAR(100),
    notes TEXT,
    sort_order INT DEFAULT 0
);

CREATE TABLE services (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255),
    slug VARCHAR(255),
    short_description TEXT,
    description TEXT,
    thumbnail VARCHAR(255),
    banner VARCHAR(255),
    icon VARCHAR(255),
    sort_order INT DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    seo_title VARCHAR(255),
    seo_description VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE customers (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255),
    slug VARCHAR(255),
    logo VARCHAR(255),
    website VARCHAR(255),
    industry VARCHAR(100),
    description TEXT,
    address TEXT,
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE partners (
    id VARCHAR(255) PRIMARY KEY,
    brand_id VARCHAR(255),
    name VARCHAR(255),
    slug VARCHAR(255),
    logo VARCHAR(255),
    website VARCHAR(255),
    description TEXT,
    partner_type VARCHAR(100),
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE projects (
    id VARCHAR(255) PRIMARY KEY,
    customer_id VARCHAR(255),
    name VARCHAR(255),
    slug VARCHAR(255),
    project_type VARCHAR(100),
    short_description TEXT,
    description TEXT,
    location VARCHAR(255),
    completion_date DATE,
    thumbnail VARCHAR(255),
    banner VARCHAR(255),
    challenge TEXT,
    solution TEXT,
    result TEXT,
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE project_products (
    id VARCHAR(255) PRIMARY KEY,
    project_id VARCHAR(255),
    product_id VARCHAR(255),
    role VARCHAR(100),
    notes TEXT
);

CREATE TABLE support_contents (
    id VARCHAR(255) PRIMARY KEY,
    type VARCHAR(100),
    product_id VARCHAR(255),
    title VARCHAR(255),
    slug VARCHAR(255),
    summary TEXT,
    content TEXT,
    file_url VARCHAR(255),
    thumbnail VARCHAR(255),
    sort_order INT DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE contact_requests (
    id VARCHAR(255) PRIMARY KEY,
    request_type VARCHAR(100),
    name VARCHAR(255),
    company VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    product_id VARCHAR(255),
    solution_id VARCHAR(255),
    project_type VARCHAR(100),
    budget_range VARCHAR(100),
    location VARCHAR(255),
    message TEXT,
    status VARCHAR(50),
    assigned_to VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- FOREIGN KEY CONSTRAINTS (RELATIONSHIPS)
-- ==========================================

-- Product Catalog
ALTER TABLE product_families ADD CONSTRAINT fk_product_families_brand FOREIGN KEY (brand_id) REFERENCES brands(id) ON DELETE SET NULL;
ALTER TABLE product_families ADD CONSTRAINT fk_product_families_domain FOREIGN KEY (domain_id) REFERENCES domains(id) ON DELETE SET NULL;

ALTER TABLE categories ADD CONSTRAINT fk_categories_domain FOREIGN KEY (domain_id) REFERENCES domains(id) ON DELETE SET NULL;
ALTER TABLE categories ADD CONSTRAINT fk_categories_parent FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL;

ALTER TABLE products ADD CONSTRAINT fk_products_brand FOREIGN KEY (brand_id) REFERENCES brands(id) ON DELETE SET NULL;
ALTER TABLE products ADD CONSTRAINT fk_products_domain FOREIGN KEY (domain_id) REFERENCES domains(id) ON DELETE SET NULL;
ALTER TABLE products ADD CONSTRAINT fk_products_family FOREIGN KEY (family_id) REFERENCES product_families(id) ON DELETE SET NULL;
ALTER TABLE products ADD CONSTRAINT fk_products_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL;

ALTER TABLE product_variants ADD CONSTRAINT fk_product_variants_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE;

-- Specifications
ALTER TABLE specifications ADD CONSTRAINT fk_specifications_group FOREIGN KEY (group_id) REFERENCES specification_groups(id) ON DELETE SET NULL;

ALTER TABLE specification_options ADD CONSTRAINT fk_specification_options_spec FOREIGN KEY (specification_id) REFERENCES specifications(id) ON DELETE CASCADE;

ALTER TABLE product_specifications ADD CONSTRAINT fk_product_specifications_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE;
ALTER TABLE product_specifications ADD CONSTRAINT fk_product_specifications_spec FOREIGN KEY (specification_id) REFERENCES specifications(id) ON DELETE CASCADE;

ALTER TABLE specification_aliases ADD CONSTRAINT fk_specification_aliases_spec FOREIGN KEY (specification_id) REFERENCES specifications(id) ON DELETE CASCADE;
ALTER TABLE specification_aliases ADD CONSTRAINT fk_specification_aliases_brand FOREIGN KEY (brand_id) REFERENCES brands(id) ON DELETE SET NULL;

-- Ecosystem
ALTER TABLE product_platforms ADD CONSTRAINT fk_product_platforms_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE;
ALTER TABLE product_platforms ADD CONSTRAINT fk_product_platforms_platform FOREIGN KEY (platform_id) REFERENCES platforms(id) ON DELETE CASCADE;

ALTER TABLE use_cases ADD CONSTRAINT fk_use_cases_domain FOREIGN KEY (domain_id) REFERENCES domains(id) ON DELETE SET NULL;
ALTER TABLE use_cases ADD CONSTRAINT fk_use_cases_parent FOREIGN KEY (parent_id) REFERENCES use_cases(id) ON DELETE SET NULL;

ALTER TABLE product_use_cases ADD CONSTRAINT fk_product_use_cases_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE;
ALTER TABLE product_use_cases ADD CONSTRAINT fk_product_use_cases_use_case FOREIGN KEY (use_case_id) REFERENCES use_cases(id) ON DELETE CASCADE;

ALTER TABLE product_relationships ADD CONSTRAINT fk_product_relationships_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE;
ALTER TABLE product_relationships ADD CONSTRAINT fk_product_relationships_related FOREIGN KEY (related_product_id) REFERENCES products(id) ON DELETE CASCADE;

ALTER TABLE documents ADD CONSTRAINT fk_documents_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE;

ALTER TABLE product_images ADD CONSTRAINT fk_product_images_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE;

ALTER TABLE product_lifecycle ADD CONSTRAINT fk_product_lifecycle_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE;
ALTER TABLE product_lifecycle ADD CONSTRAINT fk_product_lifecycle_replacement FOREIGN KEY (replacement_product_id) REFERENCES products(id) ON DELETE SET NULL;

-- Website / CMS
ALTER TABLE pages ADD CONSTRAINT fk_pages_parent FOREIGN KEY (parent_id) REFERENCES pages(id) ON DELETE SET NULL;

ALTER TABLE solutions ADD CONSTRAINT fk_solutions_domain FOREIGN KEY (domain_id) REFERENCES domains(id) ON DELETE SET NULL;

ALTER TABLE solution_products ADD CONSTRAINT fk_solution_products_solution FOREIGN KEY (solution_id) REFERENCES solutions(id) ON DELETE CASCADE;
ALTER TABLE solution_products ADD CONSTRAINT fk_solution_products_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE;

ALTER TABLE partners ADD CONSTRAINT fk_partners_brand FOREIGN KEY (brand_id) REFERENCES brands(id) ON DELETE SET NULL;

ALTER TABLE projects ADD CONSTRAINT fk_projects_customer FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL;

ALTER TABLE project_products ADD CONSTRAINT fk_project_products_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE;
ALTER TABLE project_products ADD CONSTRAINT fk_project_products_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE;

ALTER TABLE support_contents ADD CONSTRAINT fk_support_contents_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL;

ALTER TABLE contact_requests ADD CONSTRAINT fk_contact_requests_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL;
ALTER TABLE contact_requests ADD CONSTRAINT fk_contact_requests_solution FOREIGN KEY (solution_id) REFERENCES solutions(id) ON DELETE SET NULL;
ALTER TABLE contact_requests ADD CONSTRAINT fk_contact_requests_admin FOREIGN KEY (assigned_to) REFERENCES admin_users(id) ON DELETE SET NULL;