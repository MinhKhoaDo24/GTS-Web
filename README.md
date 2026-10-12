# 🌐 GTS Web - B2B Technology & Network Infrastructure Portal

> **GTS (Global Technology & Service)** - Nền tảng website phân phối thiết bị mạng chính hãng và giải pháp hạ tầng CNTT cho doanh nghiệp.

[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-blue?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=flat-square&logo=postgresql)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=flat-square&logo=docker)](https://www.docker.com/)

---

## 📌 Giới thiệu dự án

**GTS Web** là giải pháp website chuyên nghiệp phục vụ doanh nghiệp B2B trong lĩnh vực thiết bị mạng và hạ tầng viễn thông. Hệ thống bao gồm cổng thông tin sản phẩm đa cấp, trang giới thiệu giải pháp - dịch vụ kỹ thuật, cùng hệ thống quản trị nội dung (CMS Admin) chuyên sâu để quản lý danh mục, thông số kỹ thuật động, biến thể phần cứng và các yêu cầu báo giá từ khách hàng.

---

## ✨ Tính năng chính

### 1. Cổng thông tin người dùng (Public Portal)
* **Trang chủ trực quan:** Trưng bày các dòng thiết bị nổi bật, đối tác thương hiệu hàng đầu (Cisco, Ubiquiti, Ruijie, Fortinet, ...) và hệ sinh thái giải pháp.
* **Danh mục sản phẩm đa tầng:**
  * Phân tầng chặt chẽ: `Domain` $\rightarrow$ `Category` $\rightarrow$ `Product Family` $\rightarrow$ `Product` $\rightarrow$ `Variants` (SKU, PID).
  * Bộ lọc sản phẩm đa tiêu chí: thương hiệu, dòng sản phẩm, thuộc tính và trạng thái kỹ thuật.
  * Trang chi tiết sản phẩm toàn diện: Gallery hình ảnh, bảng thông số kỹ thuật theo danh mục, tài liệu datasheet, thiết bị trong cùng hệ sinh thái.
* **Trang Giải pháp doanh nghiệp:**
  * Bảo mật hệ thống mạng (Firewall, VPN, UTM).
  * Giải pháp Server & Trung tâm dữ liệu.
  * Hội nghị truyền hình & Truyền thông hợp nhất.
  * Mạng doanh nghiệp (Switch, Router cao cấp).
  * Hệ thống WiFi diện rộng & VoIP.
* **Trang Dịch vụ CNTT:** Tư vấn thiết kế, triển khai hạ tầng, bảo trì định kỳ và cung cấp linh kiện dự phòng (Spare parts).
* **Form liên hệ & Báo giá trực tuyến:** Tiếp nhận yêu cầu tư vấn, giải pháp và lưu trực tiếp vào cơ sở dữ liệu.
* **Tra cứu bảo hành:** Hệ thống hỗ trợ khách hàng kiểm tra tình trạng thiết bị nhanh chóng.

### 2. Hệ thống quản trị (Admin CMS)
* **Xác thực an toàn:** Sử dụng NextAuth v5 kết hợp mã hóa bcrypt cho tài khoản quản trị.
* **Quản lý danh mục & Thương hiệu:** Thêm mới, chỉnh sửa, gán logo, biểu tượng và sắp xếp thứ tự hiển thị linh hoạt.
* **Quản lý Dòng sản phẩm (Product Families):** Nhóm sản phẩm theo series của từng hãng sản xuất.
* **Quản lý Sản phẩm nâng cao:**
  * **Thông số kỹ thuật động (Dynamic Specifications):** Gán thuộc tính theo từng danh mục, thiết lập thứ tự hiển thị và quản lý alias.
  * **Bộ sưu tập hình ảnh (Gallery):** Tải nhiều ảnh cùng lúc, kéo-thả (Drag & Drop) sắp xếp thứ tự và chọn ảnh đại diện.
  * **Quản lý biến thể (Variants):** Hỗ trợ SKU, PID, Model number, màu sắc, khu vực phân phối và cấu hình riêng.
  * **Liên kết hệ sinh thái (Product Ecosystem):** Thiết lập sản phẩm tương thích, phụ kiện hoặc sản phẩm thay thế.
* **Trình soạn thảo văn bản giàu tính năng (Rich Text):** Tích hợp Tiptap Editor hỗ trợ hình ảnh, liên kết, bảng biểu cho bài viết và nội dung trang.
* **Quản lý Yêu cầu liên hệ (Contact Leads):** Theo dõi trạng thái tiếp nhận, phân công nhân sự phụ trách và phản hồi khách hàng.
* **Cấu hình hệ thống (Site Settings):** Cập nhật hotline, email, địa chỉ, banner và thông tin doanh nghiệp theo thời gian thực.

---

## 🛠️ Công nghệ sử dụng

| Lớp (Layer) | Công nghệ / Thư viện |
| :--- | :--- |
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router, Server Components & Server Actions) |
| **Giao diện** | [React 19](https://react.dev/), [Tailwind CSS v4](https://tailwindcss.com/) |
| **Biểu tượng** | [Lucide React](https://lucide.dev/), [React Icons](https://react-icons.github.io/react-icons/) |
| **Cơ sở dữ liệu** | [PostgreSQL 16](https://www.postgresql.org/) (Quản lý kết nối qua Connection Pool với `pg`) |
| **Truy vấn CSDL** | Data Access Layer (DAL) tối ưu với SQL chuẩn, Indexes & Triggers tự động |
| **Bảo mật & Auth** | [NextAuth.js v5](https://authjs.dev/), [bcryptjs](https://www.npmjs.com/package/bcryptjs) |
| **Biên tập nội dung** | [Tiptap Editor](https://tiptap.dev/) (`starter-kit`, `image`, `link`, `table`) |
| **Tương tác UI** | `@dnd-kit` (Drag & Drop), `embla-carousel-react` (Slider) |
| **Validation** | [Zod](https://zod.dev/), [React Hook Form](https://react-hook-form.com/) |
| **Triển khai** | Docker, Docker Compose |

---

## 📂 Cấu trúc thư mục

```text
gts-web/
├── db/                        # Script SQL khởi tạo cơ sở dữ liệu
│   ├── 01_schema_tables.sql   # DDL định nghĩa các bảng và khóa ngoại
│   ├── 02_indexes.sql         # Đánh chỉ mục tối ưu hiệu năng tìm kiếm
│   └── 03_triggers.sql        # Triggers cập nhật timestamps và dữ liệu
├── public/                    # Tài nguyên tĩnh (ảnh logo, banners, icons)
├── scripts/                   # Script CLI tiện ích
│   ├── init-db.ts             # Thực thi khởi tạo schema database
│   └── seed.ts                # Nạp dữ liệu mẫu ban đầu (admin, brands, categories)
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── (public pages)     # Trang chủ, sản phẩm, giải pháp, dịch vụ, liên hệ...
│   │   ├── admin/             # Hệ thống CMS Dashboard & Đăng nhập
│   │   │   ├── (dashboard)/   # Giao diện quản trị (products, brands, settings...)
│   │   │   └── login/         # Trang đăng nhập quản trị viên
│   │   └── api/               # Next.js API Routes (v2 endpoints cho admin & public)
│   ├── components/            # UI Components dùng chung (Header, Footer, Dialogs...)
│   │   └── admin/             # Components chuyên dụng cho trang quản trị
│   ├── lib/                   # Thư viện dùng chung
│   │   ├── auth.ts            # Cấu hình NextAuth credentials
│   │   ├── db.ts              # PostgreSQL Pool & helpers query()
│   │   └── dal/               # Data Access Layer (truy vấn DB theo từng thực thể)
│   └── types/                 # Định nghĩa TypeScript interface & types
├── .env.example               # Mẫu cấu hình biến môi trường
├── docker-compose.yml         # Thiết lập container PostgreSQL & Next.js
├── Dockerfile                 # Multi-stage Docker build cho ứng dụng
├── package.json
└── tsconfig.json
```

---

## 🚀 Hướng dẫn cài đặt & Khởi chạy

### 1. Yêu cầu hệ thống
* **Node.js**: Phiên bản `20.x` trở lên
* **npm** (hoặc `pnpm` / `yarn`)
* **PostgreSQL**: Phiên bản `16` (hoặc cài đặt qua Docker)

---

### 2. Cài đặt mã nguồn

Clone dự án về máy và cài đặt các dependencies:

```bash
git clone https://github.com/MinhKhoaDo24/GTS-Web.git
cd GTS-Web
npm install
```

---

### 3. Cấu hình biến môi trường

Tạo file `.env` từ file `.env.example`:

```bash
cp .env.example .env
```

Chỉnh sửa thông số trong `.env` cho phù hợp với môi trường của bạn:

```env
# Kết nối cơ sở dữ liệu PostgreSQL
DATABASE_URL="postgresql://gts_user:gts_password_2024@localhost:5432/gts_db?schema=public"

# Khóa bí mật cho NextAuth
NEXTAUTH_SECRET="gts-hardware-secret-b2b-production-key-2024"
NEXTAUTH_URL="http://localhost:3000"

# URL ứng dụng public
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

### 4. Khởi chạy Database & Nạp dữ liệu mẫu

#### Cách A: Chạy PostgreSQL nhanh qua Docker Compose
Nếu chưa cài đặt sẵn PostgreSQL cục bộ, bạn có thể khởi động container PostgreSQL đi kèm:

```bash
docker-compose up -d postgres
```

#### Cách B: Khởi tạo bảng và nạp dữ liệu mẫu (Seeding)
Sau khi PostgreSQL đã sẵn sàng, thực hiện 2 lệnh sau:

```bash
# 1. Tạo các bảng, chỉ mục và triggers
npm run db:init

# 2. Nạp dữ liệu mẫu (Danh mục, Thương hiệu, Cấu hình web, Tài khoản Admin mặc định)
npm run db:seed
```

---

### 5. Khởi chạy môi trường phát triển (Development)

```bash
npm run dev
```

Mở trình duyệt và truy cập:
* 🌐 **Trang chủ:** [http://localhost:3000](http://localhost:3000)
* 🔐 **Trang quản trị:** [http://localhost:3000/admin](http://localhost:3000/admin)

> **Tài khoản quản trị mặc định sau khi seed:**
> * **Email:** `admin@gts.vn`
> * **Mật khẩu:** `admin@gts2024`

---

## 📜 Các Scripts có sẵn

| Lệnh | Mô tả |
| :--- | :--- |
| `npm run dev` | Khởi chạy server phát triển với hot-reloading |
| `npm run build` | Biên dịch dự án tối ưu cho production |
| `npm run start` | Khởi chạy máy chủ production sau khi build |
| `npm run lint` | Kiểm tra quy chuẩn mã nguồn với ESLint |
| `npm run db:init` | Khởi tạo cấu trúc schema database (`db/*.sql`) |
| `npm run db:seed` | Nạp dữ liệu ban đầu vào database |

---

## 🐳 Triển khai với Docker (Production)

Dự án đã được cấu hình sẵn `Dockerfile` và `docker-compose.yml` để triển khai đồng thời cả ứng dụng Next.js và PostgreSQL:

```bash
# Xây dựng và khởi chạy toàn bộ dịch vụ
docker-compose up -d --build

# Xem log hoạt động
docker-compose logs -f web

# Dừng các dịch vụ
docker-compose down
```

---

## 👥 Đóng góp & Phát triển

1. Tạo branch mới cho tính năng hoặc bản sửa lỗi:
   ```bash
   git checkout -b feature/ten-tinh-nang
   ```
2. Commit mã nguồn với thông điệp rõ ràng:
   ```bash
   git commit -m "feat: Thêm tính năng mới"
   ```
3. Đẩy lên remote repository:
   ```bash
   git push origin feature/ten-tinh-nang
   ```
4. Tạo Pull Request trên GitHub để được review và merge vào nhánh `main`.

---

## 📄 Bản quyền

Dự án được xây dựng và sở hữu bởi **GTS (Global Technology & Service)**. Mọi quyền được bảo lưu.
