# 📘 SÁCH HƯỚNG DẪN SỬ DỤNG HỆ THỐNG QUẢN TRỊ ADMIN (CMS) - GTS WEB

> **Dành cho:** Quản trị viên hệ thống (Admin), Quản lý sản phẩm (Product Manager), Biên tập viên nội dung (Content Editor) và Chuyên viên kinh doanh (Sales Lead).  
> **Hệ thống:** GTS Web - Cổng thông tin & Phân phối thiết bị hạ tầng mạng viễn thông B2B.  
> **Địa chỉ truy cập Admin:** `https://[ten-mien-cua-ban]/admin` (hoặc `http://localhost:3000/admin` khi chạy thử nghiệm).

---

## 📑 MỤC LỤC HƯỚNG DẪN

1. [Đăng nhập & Tổng quan Bảng điều khiển (Dashboard)](#1-đăng-nhập--tổng-quan-bảng-điều-khiển-dashboard)
2. [Quy trình Quản lý Danh mục & Phân loại Thiết bị](#2-quy-trình-quản-lý-danh-mục--phân-loại-thiết-bị)
3. [Quản lý Hãng sản xuất (Brands) & Dòng sản phẩm (Families)](#3-quản-lý-hãng-sản-xuất-brands--dòng-sản-phẩm-families)
4. [Quản lý Thông số Kỹ thuật Động (Specifications)](#4-quản-lý-thông-số-kỹ-thuật-động-specifications)
5. [Quản lý Sản phẩm Chuyên sâu (Products Management)](#5-quản-lý-sản-phẩm-chuyên-sâu-products-management)
   - [5.1. Thêm mới một sản phẩm chuẩn B2B](#51-thêm-mới-một-sản-phẩm-chuẩn-b2b)
   - [5.2. Chỉnh sửa chuyên sâu: 5 Tab chức năng](#52-chỉnh-sửa-chuyên-sâu-5-tab-chức-năng)
6. [Quản lý Gói Giải pháp Kỹ thuật (Solutions)](#6-quản-lý-gói-giải-pháp-kỹ-thuật-solutions)
7. [Quản lý Bài viết, Tin tức & Banner Quảng cáo (Contents)](#7-quản-lý-bài-viết-tin-tức--banner-quảng-cáo-contents)
8. [Quản lý & Xử lý Yêu cầu Báo giá / Tư vấn Khách hàng (Contacts)](#8-quản-lý--xử-lý-yêu-cầu-báo-giá--tư-vấn-khách-hàng-contacts)
9. [Cấu hình Thông tin Doanh nghiệp & Website (Site Settings)](#9-cấu-hình-thông-tin-doanh-nghiệp--website-site-settings)
10. [Quy chuẩn Nhập liệu & Mẹo Vận hành Tối ưu](#10-quy-chuẩn-nhập-liệu--mẹo-vận-hành-tối-ưu)

---

## 1. ĐĂNG NHẬP & TỔNG QUAN BẢNG ĐIỀU KHIỂN (DASHBOARD)

### 1.1. Đăng nhập hệ thống quản trị
1. Mở trình duyệt và truy cập vào đường dẫn: `/admin` hoặc `/admin/login`.
2. Giao diện đăng nhập bảo mật của GTS hiển thị:
   - **Email quản trị:** Nhập email tài khoản admin (Ví dụ mặc định: `admin@gts.vn`).
   - **Mật khẩu:** Nhập mật khẩu quản trị (Mặc định khi khởi tạo: `admin@gts2024`).
3. Nhấp nút **Đăng nhập**. Hệ thống sẽ kiểm tra bảo mật bằng chữ ký JWT và tự động chuyển hướng bạn đến màn hình Bảng điều khiển chính.

> [!NOTE]
> Nếu bạn cố tình truy cập vào bất kỳ trang quản trị nào khi chưa đăng nhập, hệ thống sẽ tự động chuyển hướng bạn về trang đăng nhập và lưu lại trang bạn muốn đến (`callbackUrl`). Sau khi đăng nhập thành công, bạn sẽ được tự động quay lại đúng trang đó.

### 1.2. Tổng quan giao diện Bảng điều khiển (`/admin`)
Ngay sau khi đăng nhập thành công, bạn sẽ thấy màn hình Tổng quan kinh doanh và dữ liệu:
* **Các thẻ thống kê nhanh (KPI Cards):**
  * **Tổng sản phẩm:** Tổng số lượng thiết bị phần cứng/phần mềm hiện có trên website.
  * **Hãng sản xuất:** Số lượng thương hiệu đối tác đang được phân phối.
  * **Danh mục thiết bị:** Số lượng phân cấp danh mục mạng đang hoạt động.
  * **Yêu cầu liên hệ mới:** Số lượng yêu cầu tư vấn/báo giá từ khách hàng chưa được xử lý (kèm biểu tượng cảnh báo màu đỏ nếu có liên hệ mới).
* **Bảng danh sách yêu cầu báo giá mới nhất:** Hiển thị 5 khách hàng gửi yêu cầu gần nhất gồm tên, công ty, số điện thoại, thiết bị quan tâm và thời gian gửi.
* **Bảng sản phẩm cập nhật gần đây:** Giúp bạn theo dõi tiến độ cập nhật thiết bị của các quản trị viên khác.

---

## 2. QUY TRÌNH QUẢN LÝ DANH MỤC & PHÂN LOẠI THIẾT BỊ

Đường dẫn: Nhấp vào **Danh mục thiết bị** trên menu bên trái (`/admin/categories`).

Danh mục là xương sống định hình cây phân cấp sản phẩm trên website (Ví dụ: *Thiết bị mạng -> Switch -> Managed Switch*).

### 2.1. Xem danh sách danh mục
* Màn hình hiển thị bảng danh mục gồm: Tên danh mục, Đường dẫn (Slug), Lĩnh vực (Domain), Danh mục cha (Parent), Số lượng sản phẩm đang có, Thứ tự sắp xếp và Trạng thái hoạt động.

### 2.2. Thêm mới danh mục thiết bị (`/admin/categories/new`)
1. Nhấp nút **+ Thêm danh mục** ở góc trên bên phải.
2. Điền các trường thông tin:
   * **Tên danh mục:** Tên hiển thị (Ví dụ: `Bộ chuyển mạch PoE`, `WiFi Doanh nghiệp`).
   * **Đường dẫn (Slug):** Hệ thống tự động tạo dạng chữ thường không dấu (Ví dụ: `bo-chuyen-mach-poe`). Bạn có thể tùy biến nếu cần.
   * **Lĩnh vực (Domain):** Chọn lĩnh vực cấp cao nhất (Hạ tầng mạng, Viễn thông, Bảo mật...).
   * **Danh mục cha (Parent Category):**
     * Để trống nếu đây là **Danh mục cấp 1** (Danh mục gốc).
     * Chọn danh mục cha nếu đây là **Danh mục con cấp 2 hoặc cấp 3** (Ví dụ: danh mục *Switch PoE* có danh mục cha là *Switch*).
   * **Mô tả danh mục:** Nhập đoạn giới thiệu ngắn phục vụ SEO và hiển thị đầu trang sản phẩm.
   * **Thứ tự sắp xếp (Sort order):** Số nguyên (0, 1, 2...). Số nhỏ hơn sẽ được ưu tiên hiển thị trước ngoài website.
   * **Trạng thái:** Tích chọn **Kích hoạt** để danh mục hiển thị ra bên ngoài website.
3. Nhấp **Lưu danh mục**.

### 2.3. Chỉnh sửa và Xóa danh mục
* **Chỉnh sửa:** Nhấp nút **Sửa** (biểu tượng cây bút) trên dòng danh mục để cập nhật thông tin.
* **Xóa:** Nhấp biểu tượng **Thùng rác**.
  > [!WARNING]
  > Nếu danh mục đang chứa sản phẩm, việc xóa danh mục sẽ khiến các sản phẩm đó bị mất liên kết danh mục (`category_id` chuyển về null). Bạn nên chuyển sản phẩm sang danh mục khác trước khi xóa.

---

## 3. QUẢN LÝ HÃNG SẢN XUẤT (BRANDS) & DÒNG SẢN PHẨM (FAMILIES)

### 3.1. Quản lý Hãng sản xuất (`/admin/brands`)
Quản lý các thương hiệu công nghệ phân phối (Cisco, Ubiquiti, Fortinet, Ruijie, Aruba...):
1. **Thêm mới thương hiệu:**
   * **Tên hãng:** Ví dụ: `Cisco Systems`, `Ubiquiti Inc.`.
   * **Slug:** Đường dẫn tĩnh (Ví dụ: `cisco`, `ubiquiti`).
   * **Logo thương hiệu:** Nhấp **Chọn ảnh** để tải lên logo hãng (nên dùng ảnh PNG nền trong suốt hoặc WebP vuông tỉ lệ 1:1).
   * **Website chính thức:** Nhập URL hãng (Ví dụ: `https://www.cisco.com`).
   * **Quốc gia:** Ví dụ: `Hoa Kỳ`, `Đài Loan`...
   * **Mô tả ngắn:** Giới thiệu ngắn về bề dày lịch sử và năng lực của thương hiệu.
   * **Thứ tự hiển thị & Kích hoạt:** Đặt số thứ tự ưu tiên trên thanh đối tác trang chủ.
2. **Sắp xếp & Cập nhật:** Bạn có thể bật/tắt nhanh trạng thái hiển thị của hãng trực tiếp trên danh sách.

### 3.2. Quản lý Dòng sản phẩm / Series (`/admin/product-families`)
Dòng sản phẩm giúp gom nhóm các model thuộc cùng một thế hệ phần cứng của hãng:
* **Ví dụ thực tế:**
  * Hãng Cisco $\rightarrow$ Dòng sản phẩm: `Cisco Catalyst 9200 Series`, `Cisco Catalyst 9300 Series`.
  * Hãng Fortinet $\rightarrow$ Dòng sản phẩm: `FortiGate Next-Gen Firewall Series`.
* **Thao tác thêm dòng sản phẩm:**
  1. Nhấp **+ Thêm dòng sản phẩm**.
  2. Nhập **Tên dòng sản phẩm** và **Slug**.
  3. Chọn **Hãng sản xuất** tương ứng từ danh sách dropdown.
  4. Tải lên ảnh đại diện cho dòng sản phẩm (ảnh mặt trước thiết bị).
  5. Nhập mô tả tính năng nổi bật của dòng sản phẩm này.
  6. Nhấp **Lưu thông tin**.

---

## 4. QUẢN LÝ THÔNG SỐ KỸ THUẬT ĐỘNG (SPECIFICATIONS)

Đường dẫn: Menu bên trái $\rightarrow$ **Thông số kỹ thuật** (`/admin/specifications`).

Đây là tính năng độc quyền mạnh mẽ của GTS Web, cho phép từng nhóm danh mục sản phẩm có một bảng thông số kỹ thuật riêng biệt mà không bị trùng lặp hay cứng nhắc:

```
[Danh mục: Switch]           ──► Cổng LAN, Throughput, PoE Budget, Switching Capacity
[Danh mục: WiFi AP]          ──► Chuẩn WiFi 6/6E, Băng tần, MIMO, Số người dùng tối đa
[Danh mục: Firewall]         ──► IPS Throughput, VPN Tunnels, Số lượng phiên đồng thời
```

Màn hình bao gồm **2 Tab chức năng chính**:

### 4.1. Tab 1: Danh sách & Định nghĩa Thông số kỹ thuật
Dùng để tạo mới thuộc tính kỹ thuật vào "ngân hàng thông số" của hệ thống:
1. **Nhóm thông số (Specification Groups):**
   * Cho phép phân loại các thông số thành nhóm hiển thị gọn gàng (Ví dụ nhóm: *Hiệu năng phần cứng*, *Cổng giao tiếp*, *Nguồn điện & Môi trường*, *Tính năng phần mềm*).
   * Bạn có thể tạo thêm nhóm thông số mới hoặc sắp xếp thứ tự hiển thị của nhóm.
2. **Thêm một thuộc tính kỹ thuật mới:**
   * **Tên thông số:** Ví dụ: `Số cổng Gigabit Ethernet`, `Công suất cấp nguồn PoE`, `Chuẩn kết nối`.
   * **Nhóm thông số:** Chọn nhóm chứa thuộc tính này.
   * **Kiểu dữ liệu (Data Type):**
     * `number`: Dành cho chỉ số dạng số thực tế để tiện lọc/so sánh (Ví dụ: 24, 48, 370).
     * `text`: Dành cho văn bản tự do (Ví dụ: `1U Rackmount`, `Kim loại sơn tĩnh điện`).
     * `boolean`: Dạng Có / Không (Ví dụ: `Có hỗ trợ quạt dự phòng`).
     * `select`: Chọn 1 giá trị trong danh sách định sẵn (Bạn sẽ nhập các tùy chọn như: `Layer 2`, `Layer 3`, `Managed`, `Smart Managed`).
     * `range`: Khoảng giá trị (Min - Max, ví dụ nhiệt độ: `-5°C đến 50°C`).
   * **Đơn vị tính (Unit):** Ví dụ: `W`, `Gbps`, `Port`, `Mpps`, `User`.
   * **Bộ lọc (Filterable):** Tích chọn nếu muốn thuộc tính này xuất hiện trên thanh lọc thuộc tính ngoài trang danh sách sản phẩm.
3. Nhấp **Lưu thông số**.

### 4.2. Tab 2: Phân bổ Thông số cho Danh mục (Category-Spec Mapping)
Tab này quyết định: **Danh mục nào sẽ có những thông số nào khi nhập liệu sản phẩm?**

* **Các bước thao tác:**
  1. Ở cột bên trái, nhấp chọn **Danh mục thiết bị** bạn muốn cấu hình (Ví dụ: chọn danh mục `Switch`).
  2. Ở bảng bên phải, hệ thống sẽ liệt kê toàn bộ ngân hàng thông số kỹ thuật theo từng nhóm.
  3. **Tích chọn checkbox** trước các thông số mà danh mục này sở hữu (Ví dụ với Switch: tích chọn *Số cổng*, *Tốc độ switching*, *Công suất PoE*, *Cổng quang SFP*...).
  4. Bạn có thể sử dụng các nút thao tác nhanh: **Chọn tất cả trong nhóm** hoặc **Bỏ chọn tất cả**.
  5. Nhấp nút màu xanh **Lưu cấu hình phân bổ**.

> [!TIP]
> **Hiệu quả thực tế:** Sau khi bạn lưu xong, bất cứ khi nào bạn hoặc nhân viên vào trang Thêm/Sửa một sản phẩm thuộc danh mục *Switch*, hệ thống sẽ tự động vẽ ra đúng các ô nhập liệu cho những thông số bạn đã chọn, giúp chuẩn hóa dữ liệu 100%.

---

## 5. QUẢN LÝ SẢN PHẨM CHUYÊN SÂU (PRODUCTS MANAGEMENT)

Đường dẫn: Menu bên trái $\rightarrow$ **Sản phẩm** (`/admin/products`).

### 5.1. Thêm mới một sản phẩm chuẩn B2B (`/admin/products/new`)
Nhấp nút **+ Thêm sản phẩm** ở góc trên bên phải màn hình:

#### Bước 1: Khai báo Phân loại & Cây danh mục
* **Tên sản phẩm:** Tên thương mại đầy đủ của thiết bị (Ví dụ: `Switch Cisco Catalyst C9200L-24P-4G-E 24 Port PoE+`).
* **Đường dẫn tĩnh (Slug):** Tự động sinh dựa trên tên thiết bị (`switch-cisco-catalyst-c9200l-24p-4g-e`). Bạn có thể bấm biểu tượng bút chì để tự sửa theo chuẩn SEO.
* **Hãng sản xuất (Brand):** Bắt buộc chọn hãng (Ví dụ: `Cisco`).
* **Dòng sản phẩm (Family):** Chọn dòng tương ứng (Ví dụ: `Catalyst 9200 Series`).
* **Danh mục sản phẩm (Category):** Bắt buộc chọn đúng danh mục (Ví dụ: `Switch / Bộ chuyển mạch`).
* **Phân loại sản phẩm (Product Type):**
  * `hardware`: Thiết bị phần cứng vật lý (Switch, Router, AP...).
  * `software`: Phần mềm quản trị mạng.
  * `license`: Bản quyền license tính năng / gia hạn bảo hành.
  * `service`: Gói dịch vụ kỹ thuật triển khai.
  * `bundle`: Gói combo trọn bộ nhiều thiết bị.

#### Bước 2: Mô tả sản phẩm & Nội dung giàu tính năng
* **Model:** Nhập mã model chính (Ví dụ: `C9200L-24P-4G-E`).
* **Mô tả ngắn (Short description):** Đoạn văn bản 2-3 câu tóm tắt điểm nổi bật nhất của thiết bị (hiển thị ở thẻ xem nhanh và khung báo giá).
* **Bài viết chi tiết (Detailed Description):** Sử dụng Trình soạn thảo **Tiptap Rich Text**:
  * Định dạng tiêu đề đoạn `H2`, `H3`.
  * Bôi đậm tính năng kỹ thuật quan trọng.
  * Chèn bảng so sánh, danh sách gạch đầu dòng.
  * Nhấp biểu tượng **Hình ảnh** để chèn trực tiếp sơ đồ đấu nối hoặc ảnh chụp cận cảnh thiết bị vào giữa bài viết.

#### Bước 3: Hình ảnh đại diện & Tùy chọn hiển thị
* **Ảnh đại diện (Thumbnail):**
  * Nhấp vào khung tải ảnh để chọn tệp từ máy tính, hoặc dán link ảnh trực tiếp.
  * Ảnh sẽ được lưu trữ an toàn trong thư mục máy chủ và tự sinh đường dẫn xem trước.
* **Kích hoạt hiển thị (Active):** Bật để sản phẩm xuất hiện ngoài trang web. Tắt nếu sản phẩm tạm thời hết hàng hoặc đang chuẩn bị nội dung.
* **Sản phẩm nổi bật (Featured):** Bật nếu muốn thiết bị xuất hiện tại khu vực **Sản phẩm tiêu biểu** ở trang chủ.

#### Bước 4: Khởi tạo biến thể đầu tiên & Tối ưu SEO
* **Mã SKU / PID ban đầu:** Nhập mã part quản lý kho (Ví dụ: `C9200L-24P-4G-E`).
* **Cấu hình tóm tắt:** Nhập chuỗi cấu hình (Ví dụ: `24x 1G PoE+ (370W), 4x 1G SFP uplinks, Network Essentials`).
* **Tiêu đề SEO & Mô tả SEO:** Tùy biến thẻ tiêu đề hiển thị trên Google Search để tăng thứ hạng tìm kiếm.

#### Bước 5: Hoàn tất
Nhấp **Lưu & Tiếp tục**. Hệ thống sẽ tạo bản ghi sản phẩm và tự động mở trang **Chỉnh sửa nâng cao 5 Tab** để bạn hoàn thiện thông số chi tiết.

---

### 5.2. Chỉnh sửa chuyên sâu: 5 Tab chức năng (`/admin/products/[id]`)

Khi mở một sản phẩm bất kỳ, bạn sẽ làm việc với thanh điều hướng 5 Tab:

```
┌──────────────┬──────────────────────┬───────────────┬────────────┬────────────────────┐
│ 1. Thông tin │ 2. Thông số kỹ thuật │ 3. Gallery ảnh│ 4. Variants│ 5. SP Liên quan    │
└──────────────┴──────────────────────┴───────────────┴────────────┴────────────────────┘
```

#### Tab 1: Thông tin cơ bản (Info)
* Cho phép chỉnh sửa lại toàn bộ tên, mô tả ngắn, nội dung Tiptap, model, danh mục, phân loại và metadata SEO.
* Nhấp **Cập nhật thông tin** để lưu thay đổi.

#### Tab 2: Thông số kỹ thuật (Dynamic Specifications)
* Hệ thống sẽ nạp toàn bộ danh mục thông số đã được cấu hình riêng cho danh mục của sản phẩm này.
* **Thao tác nhập liệu:**
  * Các trường dạng số (Number): Chỉ cần gõ số thực tế (Ví dụ cổng: `24`, Công suất: `370`).
  * Các trường dạng Dropdown: Nhấp chọn giá trị chuẩn từ danh sách.
  * Các trường ghi chú hoặc đơn vị tùy biến: Có thể ghi đè đơn vị nếu thiết bị có đơn vị đặc thù.
* Nhấp nút **Lưu thông số kỹ thuật** màu xanh. Dữ liệu sẽ lập tức được cập nhật vào bảng thông số kỹ thuật chi tiết ở trang người dùng.

#### Tab 3: Bộ sưu tập hình ảnh (Gallery Manager)
* Dành cho thiết bị có nhiều góc chụp (Mặt trước, mặt sau cổng kết nối, phụ kiện nguồn, hình ảnh lắp trong tủ rack):
  1. Nhấp **Tải ảnh lên** để chọn một hoặc nhiều ảnh cùng lúc từ máy tính.
  2. **Chọn ảnh đại diện chính (Primary):** Nhấp vào nút **Đặt làm ảnh chính** trên bức ảnh bạn muốn dùng làm ảnh đại diện trên toàn trang. Biểu tượng ngôi sao vàng sẽ sáng lên.
  3. **Kéo - thả sắp xếp thứ tự:** Dùng chuột kéo các bức ảnh để thay đổi thứ tự lướt xem ảnh (Slider) ngoài trang chi tiết.
  4. Nhấp biểu tượng thùng rác màu đỏ để xóa ảnh hỏng hoặc ảnh cũ.

#### Tab 4: Quản lý Biến thể (Variants Manager - SKU / PID)
Một dòng thiết bị thường có nhiều phiên bản (Ví dụ: bản 24 cổng, bản 48 cổng, bản nguồn AC, bản nguồn DC, bản License Advantage...):
* **Thêm mới biến thể:**
  1. Nhấp **+ Thêm biến thể mới**.
  2. Điền: **Mã SKU**, **Mã Part Number**, **Tên phiên bản**, **Khu vực phân phối** (Global / VN), **Tóm tắt cấu hình**.
  3. Chọn tình trạng: `Đang kinh doanh (Active)`, `Hàng đặt trước (Pre-order)`, hoặc `Ngừng sản xuất (Discontinued)`.
  4. Nhấp **Lưu biến thể**.
* **Sửa / Xóa:** Bạn có thể chỉnh sửa trực tiếp thông tin từng biến thể hoặc xóa mã SKU không còn kinh doanh.

#### Tab 5: Sản phẩm liên quan & Hệ sinh thái (Related Products)
Giúp nhân viên kỹ thuật và khách hàng dễ dàng tìm thấy các phụ kiện tương thích:
1. Nhấp **+ Thêm liên kết sản phẩm**.
2. Tìm kiếm sản phẩm liên quan theo tên hoặc model.
3. Chọn kiểu quan hệ:
   * **Phụ kiện kèm theo:** Dây nguồn phụ, Module quang SFP+, Bộ tai gắn rack (Rackmount kit), Card mở rộng.
   * **Sản phẩm tương đương / Thay thế:** Dành cho các thiết bị cùng phân khúc để khách hàng cân nhắc.
   * **Hệ sinh thái:** Thiết bị Router / Tường lửa thường đi kèm với Switch này trong một mô hình mạng hoàn chỉnh.
4. Nhấp **Lưu liên kết**.

---

## 6. QUẢN LÝ GÓI GIẢI PHÁP KỸ THUẬT (SOLUTIONS)

Đường dẫn: Menu bên trái $\rightarrow$ **Giải pháp** (`/admin/solutions`).

Dành cho các gói giải pháp doanh nghiệp tổng thể (Ví dụ: *Hạ tầng mạng văn phòng cao ốc*, *Hệ thống WiFi mật độ cao cho trường đại học / khách sạn*, *Giải pháp Data Center Spine-Leaf*):

1. **Xem danh sách giải pháp:** Quản lý tiêu đề giải pháp, lĩnh vực phụ trách, thứ tự hiển thị và trạng thái kích hoạt.
2. **Thêm mới giải pháp (`/admin/solutions/new`):**
   * **Tên giải pháp:** Ví dụ: `Giải pháp Mạng Doanh nghiệp Vừa và Nhỏ (SME)`.
   * **Đường dẫn (Slug):** `giai-phap-mang-doanh-nghiep-sme`.
   * **Mô tả ngắn gọn:** Tóm tắt năng lực giải quyết bài toán hạ tầng của giải pháp.
   * **Nội dung giải pháp (Rich text):** Soạn thảo chi tiết về:
     * Thách thức hiện tại của khách hàng.
     * Sơ đồ nguyên lý hoạt động của hệ thống mạng.
     * Danh sách các thiết bị đề xuất sử dụng.
     * Hiệu quả kinh tế và độ ổn định sau khi triển khai.
   * **Ảnh Thumbnail & Banner:** Tải lên banner đồ họa nằm ngang thể hiện tổng thể mô hình giải pháp.
   * **Cờ giải pháp tiêu biểu (Featured):** Bật để đưa lên Slider trang chủ.
   * **Cấu hình SEO:** Nhập từ khóa giải pháp để tối ưu tìm kiếm.
3. Nhấp **Lưu giải pháp**.

---

## 7. QUẢN LÝ BÀI VIẾT, TIN TỨC & BANNER QUẢNG CÁO (CONTENTS)

Đường dẫn: Menu bên trái $\rightarrow$ **Bài viết & Tin tức** (`/admin/contents`).

Module này chịu trách nhiệm cho toàn bộ phần truyền thông trên website, bao gồm tin công nghệ, cẩm nang kỹ thuật và các banner khuyến mãi.

### 7.1. Phân loại nội dung
Khi thêm bài viết, bạn cần chọn đúng **Loại nội dung (Type)**:
* `news`: Tin tức công nghệ, sự kiện ra mắt thiết bị mới của các hãng.
* `blog`: Bài viết tư vấn kỹ thuật, hướng dẫn cấu hình (How-to, CLI config).
* `banner`: Banner quảng cáo chạy trên thanh trượt Slider trang chủ.
* `promotion`: Chương trình khuyến mãi, tặng kèm thiết bị, giảm giá dự án.
* `case_study`: Bài viết thực tế về các dự án hạ tầng GTS đã triển khai cho đối tác lớn.

### 7.2. Các thao tác biên tập nội dung
1. Nhấp **+ Tạo bài viết mới**.
2. Nhập **Tiêu đề bài viết** và kiểm tra **Slug URL**.
3. Nhập **Tên tác giả** (Ví dụ: `Bộ phận Kỹ thuật GTS`).
4. Nhập đoạn **Tóm tắt (Excerpt)**: Hiển thị trên thẻ xem trước bài viết ngoài danh sách tin tức.
5. Soạn thảo **Nội dung chi tiết bài viết** bằng trình soạn thảo Tiptap Editor (hỗ trợ đầy đủ chèn ảnh minh họa, trích dẫn, bảng biểu).
6. **Hình ảnh:**
   * Tải ảnh **Thumbnail** (cho tin tức, tỉ lệ 16:9).
   * Tải ảnh **Banner ngang** (dành cho bài viết nổi bật hoặc banner slider trang chủ).
7. **Tùy chọn dành riêng cho Banner quảng cáo:**
   * **Đường dẫn liên kết (Link URL):** Khi khách hàng nhấp vào banner ngoài trang chủ, website sẽ mở link này (Ví dụ: `/san-pham/switch-cisco-c9200l`).
   * **Tên nút bấm (Button Text):** Nhập chữ hiển thị trên nút (Ví dụ: `Khám phá ngay`, `Nhận báo giá`).
8. **Thời gian xuất bản:** Chọn ngày giờ xuất bản hiển thị trên bài viết.
9. Nhấp **Xuất bản bài viết**.

---

## 8. QUẢN LÝ & XỬ LÝ YÊU CẦU BÁO GIÁ / TƯ VẤN KHÁCH HÀNG (CONTACTS)

Đường dẫn: Menu bên trái $\rightarrow$ **Yêu cầu liên hệ** (`/admin/contacts`).

Khi khách hàng bấm vào nút "Nhận báo giá" hoặc điền form "Liên hệ tư vấn" ngoài website, dữ liệu sẽ được lưu tự động vào đây theo thời gian thực.

### 8.1. Đọc và Tra cứu Yêu cầu
* Huy hiệu số màu đỏ trên menu bên trái sẽ hiển thị tổng số lượng **yêu cầu mới chưa xử lý**.
* Bảng danh sách liên hệ gồm:
  * **Họ tên khách hàng** & **Tên công ty / Doanh nghiệp**.
  * **Thông tin liên lạc:** Số điện thoại và Email.
  * **Mối quan tâm:** Thiết bị hoặc Gói giải pháp cụ thể mà khách hàng đang hỏi mua.
  * **Lời nhắn / Yêu cầu chi tiết:** Số lượng cần báo giá, tiến độ dự án, ngân sách dự kiến...
  * **Trạng thái hiện tại:** Hiển thị bằng các nhãn màu trực quan:
    * 🔴 **Mới nhận (New):** Khách mới gửi, chưa có ai liên hệ lại.
    * 🟡 **Đã liên hệ (Contacted):** Nhân viên kinh doanh đã gọi điện hoặc phản hồi email.
    * 🟢 **Đã hoàn thành (Resolved):** Đã chốt báo giá hoặc ký kết hợp đồng dự án thành công.
    * ⚪ **Đã hủy (Cancelled):** Yêu cầu spam, sai thông tin liên hệ hoặc khách hủy dự án.

### 8.2. Các thao tác xử lý của Quản trị viên / Sales
1. **Xem toàn bộ nội dung chi tiết:** Nhấp nút **Xem** (biểu tượng con mắt) ở cuối dòng để mở cửa sổ Pop-up hiển thị đầy đủ thông tin và lời nhắn của khách.
2. **Cập nhật tiến độ xử lý:**
   * Trong cửa sổ chi tiết, nhấp vào menu thả xuống của **Trạng thái**.
   * Chuyển từ `Mới nhận` $\rightarrow$ `Đã liên hệ` (sau khi đã gọi tư vấn cho khách).
   * Chuyển thành `Đã hoàn thành` khi đã gửi báo giá chính thức.
   * Nhấp nút **Lưu trạng thái**.
3. **Xóa yêu cầu:** Nhấp biểu tượng thùng rác đối với các yêu cầu spam thử nghiệm. Hệ thống sẽ hiển thị hộp thoại xác nhận trước khi xóa vĩnh viễn khỏi CSDL.

---

## 9. CẤU HÌNH THÔNG TIN DOANH NGHIỆP & WEBSITE (SITE SETTINGS)

Đường dẫn: Menu bên trái $\rightarrow$ **Cấu hình Website** (`/admin/settings`).

Đây là trung tâm điều khiển các thông tin định danh của công ty GTS hiển thị trên Header, Footer, Trang liên hệ và Trang chính sách bảo hành:

### 9.1. Các nhóm trường cấu hình
1. **Thông tin định danh pháp lý:**
   * **Tên công ty đầy đủ:** `GTS - Global Technology & Service`.
   * **Tên viết tắt:** `GTS`.
   * **Mã số thuế doanh nghiệp:** `0123456789`.
2. **Đường dây nóng & Hỗ trợ kỹ thuật:**
   * **Hotline kinh doanh:** Ví dụ: `0901 234 567` (hiển thị trên nút gọi nhanh ở Header).
   * **Số điện thoại Zalo:** `0901234567` (kết nối trực tiếp vào nút Chat Zalo nổi trên màn hình).
   * **Email tiếp nhận thông tin:** `contact@gts.vn`.
3. **Địa chỉ & Giờ làm việc:**
   * **Địa chỉ trụ sở / Kho hàng:** `123 Nguyễn Văn Linh, Phường Tân Phong, Quận 7, TP. Hồ Chí Minh`.
   * **Thời gian làm việc:** `Thứ 2 – Thứ 6: 8:00 – 17:30 | Thứ 7: 8:00 – 12:00`.
4. **Bản đồ số & Mạng xã hội:**
   * **Đường dẫn nhúng Google Maps (Embed URL):** Dán link `src` từ thẻ iframe chia sẻ của Google Maps để hiển thị bản đồ chỉ đường trên trang Liên hệ.
   * **Đường dẫn Fanpage Facebook:** Link trang Facebook chính thức của công ty.
   * **Kênh Youtube:** Link video giới thiệu năng lực doanh nghiệp.

### 9.2. Cách lưu cấu hình
* Sau khi chỉnh sửa các ô thông tin, cuộn xuống dưới cùng và nhấp nút **Lưu cấu hình**.
* Hệ thống sẽ xuất hiện thông báo màu xanh: *"Đã lưu cấu hình thành công! Thay đổi sẽ hiển thị ngay trên website"*. Toàn bộ Header, Footer và các khối liên hệ ngoài trang chủ sẽ được cập nhật đồng bộ ngay lập tức mà không cần khởi động lại máy chủ.

---

## 10. QUY CHUẨN NHẬP LIỆU & MẸO VẬN HÀNH TỐI ƯU

Để website luôn đạt tốc độ tải trang nhanh nhất, hình ảnh sắc nét và chuẩn SEO B2B, quản trị viên nên tuân thủ các quy tắc sau:

### 10.1. Quy chuẩn Tối ưu Hình ảnh tải lên
* **Định dạng khuyến nghị:** Sử dụng ảnh `.webp` hoặc `.png` / `.jpg` đã nén dung lượng.
* **Dung lượng tối đa:** Không nên tải ảnh vượt quá **2MB / ảnh** (lý tưởng nhất là từ 150KB - 500KB).
* **Tỉ lệ khung hình chuẩn:**
  * **Ảnh sản phẩm (Thumbnail & Gallery):** Tỉ lệ vuông `1:1` (Khuyến nghị: `800x800` px hoặc `1000x1000` px), nền trắng hoặc nền trong suốt (transparent).
  * **Banner Slider trang chủ:** Tỉ lệ ngang rộng `16:9` hoặc `21:9` (Khuyến nghị: `1920x800` px).
  * **Ảnh tin tức / bài viết:** Tỉ lệ `16:9` (Khuyến nghị: `1200x675` px).

### 10.2. Quy tắc Đặt tên Đường dẫn (Slug URL)
* Tên đường dẫn slug ảnh hưởng trực tiếp đến kết quả tìm kiếm trên Google:
  * **Đúng chuẩn:** Viết thường, không dấu, các từ cách nhau bằng dấu gạch ngang `-` (Ví dụ: `switch-cisco-c9200l-24p`).
  * **Không nên:** Chứa ký tự có dấu (`sản-phẩm`), chứa dấu cách (`switch cisco`), hoặc chứa ký tự đặc biệt (`switch#cisco@123`).

### 10.3. Quy trình Đề xuất khi Đăng tải một Thiết bị Mới
Để việc đăng sản phẩm diễn ra nhanh chóng và không bị thiếu sót thông tin:
```
Bước 1: Kiểm tra Hãng sản xuất đã có chưa (Nếu chưa có ──► Vào Brands tạo mới).
   │
Bước 2: Kiểm tra Danh mục phù hợp đã có chưa (Nếu chưa có ──► Vào Categories tạo mới).
   │
Bước 3: Cấu hình bảng Thông số kỹ thuật cho danh mục (Nếu là danh mục mới ──► Vào Specifications gán mapping).
   │
Bước 4: Vào Products ──► Bấm "+ Thêm sản phẩm" ──► Nhập tên, chọn hãng, danh mục, mô tả và lưu lại.
   │
Bước 5: Chuyển qua Tab Gallery để tải nhiều góc chụp của thiết bị và chọn 1 ảnh chính.
   │
Bước 6: Chuyển qua Tab Thông số kỹ thuật để điền đầy đủ các thông số mạng.
   │
Bước 7: Thêm các mã SKU biến thể (nếu thiết bị có nhiều tùy chọn nguồn/cổng) và gán phụ kiện liên quan.
```

---

> 📞 **Cần hỗ trợ kỹ thuật chuyên sâu:** Trong trường hợp gặp sự cố hệ thống, lỗi kết nối cơ sở dữ liệu hoặc cần mở rộng thêm các tính năng quản trị mới, vui lòng liên hệ trực tiếp với Đội ngũ Kỹ thuật Phát triển Hệ thống GTS Web.
