## D:/Web GTS/gts-web/data/Cau_truc_Database_32_Bang_Website_GTS.docx
# TÀI LIỆU CẤU TRÚC DATABASE WEBSITE GTS (32 BẢNG CHUẨN)

## I. 🔵 PRODUCT CATALOG — 19 BẢNG

### 01. brands (Thương hiệu / Hãng sản xuất)

|  |
| --- |
| **id** : Khóa chính  **name** : Tên thương hiệu  **slug** : Đường dẫn URL thân thiện  **logo** : Hình ảnh logo thương hiệu  **website** : Trang web chính thức của hãng  **description** : Giới thiệu tổng quan hãng  **country** : Quốc gia xuất xứ  **is\_active** : Trạng thái hoạt động  **sort\_order** : Thứ tự sắp xếp hiển thị  **created\_at, updated\_at** : Thời gian tạo và cập nhật  **Ví dụ thực tế:**  **• id:** 1  **• name:** Cisco  **• slug:** cisco  **• country:** USA  **• is\_active:** true |

### 02. domains (Lĩnh vực công nghệ lớn)

|  |
| --- |
| **id** : Khóa chính  **name** : Tên lĩnh vực lớn trên website  **slug** : Đường dẫn URL  **description** : Mô tả tổng quan về lĩnh vực  **image** : Ảnh đại diện lĩnh vực  **icon** : Biểu tượng hiển thị  **sort\_order** : Thứ tự sắp xếp  **is\_active** : Trạng thái hoạt động  **Ví dụ thực tế:**  **• id:** 1  **• name:** Networking  **• slug:** networking  **• is\_active:** true |

### 03. product\_families (Dòng sản phẩm của hãng)

|  |
| --- |
| **id** : Khóa chính  **brand\_id** : Thuộc hãng nào (brands.id)  **domain\_id** : Thuộc lĩnh vực nào (domains.id)  **name** : Tên dòng sản phẩm  **slug** : Đường dẫn URL  **description** : Giới thiệu về dòng sản phẩm  **image** : Ảnh đại diện dòng sản phẩm  **sort\_order** : Thứ tự sắp xếp  **is\_active** : Trạng thái hoạt động  **Ví dụ thực tế:**  **• id:** 1  **• brand\_id:** 1  **• domain\_id:** 1  **• name:** Catalyst 9300  **• slug:** catalyst-9300 |

### 04. categories (Loại sản phẩm / Chức năng thiết bị)

|  |
| --- |
| **id** : Khóa chính  **domain\_id** : Thuộc lĩnh vực lớn nào (domains.id)  **parent\_id** : Loại sản phẩm cha (categories.id, phân cấp đa tầng)  **name** : Tên loại thiết bị  **slug** : Đường dẫn URL  **description** : Mô tả loại thiết bị  **sort\_order** : Thứ tự sắp xếp  **is\_active** : Trạng thái hoạt động  **Ví dụ thực tế:**  **• id:** 5  **• domain\_id:** 1  **• parent\_id:** 2  **• name:** Access Switch  **• slug:** access-switch |

### 05. products (Bảng sản phẩm trung tâm)

|  |
| --- |
| **id** : Khóa chính  **brand\_id** : Thuộc hãng nào (brands.id)  **domain\_id** : Thuộc lĩnh vực nào (domains.id)  **family\_id** : Thuộc dòng sản phẩm nào (product\_families.id)  **category\_id** : Thuộc loại thiết bị nào (categories.id)  **name** : Tên đầy đủ của sản phẩm  **slug** : Đường dẫn URL chi tiết sản phẩm  **model** : Mã model chính  **short\_description** : Đoạn mô tả tóm tắt tính năng  **description** : Bài viết mô tả chi tiết sản phẩm (HTML)  **product\_type** : Phân loại sản phẩm  **status** : Trạng thái kinh doanh (active, discontinued, coming\_soon)  **release\_date** : Ngày ra mắt  **eol\_date** : Ngày EOL  **thumbnail** : Ảnh đại diện  **is\_featured** : Sản phẩm nổi bật  **is\_active** : Trạng thái hoạt động  **seo\_title, seo\_description** : Thẻ tối ưu SEO  **created\_at, updated\_at** : Thời gian tạo và cập nhật  **Ví dụ thực tế:**  **• id:** 101  **• brand\_id:** 1  **• name:** Cisco Catalyst C9300-48P  **• model:** C9300-48P  **• status:** active |

### 06. product\_variants (Biến thể / PID / SKU / Part Number)

|  |
| --- |
| **id** : Khóa chính  **product\_id** : Thuộc sản phẩm chính nào (products.id)  **sku** : Mã SKU quản lý nội bộ  **pid** : Mã đặt hàng của hãng (Part Number)  **model\_number** : Số model chi tiết  **part\_number** : Part Number cụ thể  **variant\_name** : Tên biến thể  **region** : Vùng/Khu vực hỗ trợ  **color** : Màu sắc thiết bị  **bundle** : Gói bundle đi kèm  **specifications\_summary** : Tóm tắt cấu hình riêng  **status** : Trạng thái  **notes** : Ghi chú kỹ thuật  **is\_active** : Trạng thái hoạt động  **Ví dụ thực tế:**  **• id:** 50  **• product\_id:** 101  **• pid:** C9300-48P-A  **• variant\_name:** Network Advantage Bundle |

### 07. specification\_groups (Nhóm thông số kỹ thuật)

|  |
| --- |
| **id** : Khóa chính  **name** : Tên nhóm thông số  **slug** : Định danh dạng mã  **description** : Mô tả nhóm  **sort\_order** : Thứ tự sắp xếp  **is\_active** : Trạng thái hoạt động  **Ví dụ thực tế:**  **• id:** 1  **• name:** Ports & Interfaces  **• slug:** ports-interfaces |

### 08. specifications (Định nghĩa thông số kỹ thuật cụ thể)

|  |
| --- |
| **id** : Khóa chính  **group\_id** : Thuộc nhóm thông số nào (specification\_groups.id)  **name** : Tên thông số  **slug** : Định danh dạng mã  **data\_type** : Kiểu dữ liệu (number, text, boolean, select, json)  **unit** : Đơn vị tính (Gbps, Mpps, W...)  **description** : Mô tả thông số  **is\_filterable** : Cho phép làm bộ lọc tìm kiếm (true/false)  **is\_searchable** : Cho phép tìm kiếm (true/false)  **sort\_order** : Thứ tự sắp xếp  **is\_active** : Trạng thái hoạt động  **Ví dụ thực tế:**  **• id:** 10  **• group\_id:** 1  **• name:** Number of Ports  **• data\_type:** number  **• unit:** Ports |

### 09. specification\_options (Giá trị lựa chọn định sẵn)

|  |
| --- |
| **id** : Khóa chính  **specification\_id** : Thuộc định nghĩa thông số nào (specifications.id)  **value** : Giá trị lưu trữ  **label** : Nhãn hiển thị trực quan  **sort\_order** : Thứ tự sắp xếp  **is\_active** : Trạng thái hoạt động  **Ví dụ thực tế:**  **• id:** 20  **• specification\_id:** 15  **• value:** wifi-7  **• label:** Wi-Fi 7 |

### 10. product\_specifications (Giá trị thông số thực tế của sản phẩm)

|  |
| --- |
| **id** : Khóa chính  **product\_id** : Thuộc sản phẩm nào (products.id)  **specification\_id** : Thuộc thông số nào (specifications.id)  **value\_number** : Giá trị dạng số  **value\_text** : Giá trị dạng chữ  **value\_boolean** : Giá trị dạng đúng/sai  **value\_json** : Giá trị dạng JSON  **min\_value** : Giá trị tối thiểu  **max\_value** : Giá trị tối đa  **unit\_override** : Ghi đè đơn vị tính  **notes** : Ghi chú thêm  **Ví dụ thực tế:**  **• product\_id:** 101  **• specification\_id:** 10  **• value\_number:** 48 |

### 11. specification\_aliases (Chuẩn hóa tên thông số giữa các hãng)

|  |
| --- |
| **id** : Khóa chính  **specification\_id** : Định nghĩa thông số chuẩn (specifications.id)  **brand\_id** : Hãng sản xuất áp dụng (brands.id)  **alias** : Tên gọi riêng của hãng  **notes** : Ghi chú chuẩn hóa  **Ví dụ thực tế:**  **• specification\_id:** 30  **• brand\_id:** 3  **• alias:** Diagonal FOV |

### 12. platforms (Nền tảng / Hệ sinh thái công nghệ)

|  |
| --- |
| **id** : Khóa chính  **name** : Tên nền tảng  **slug** : Đường dẫn URL  **type** : Phân loại nền tảng  **description** : Mô tả nền tảng  **logo** : Hình ảnh logo  **website** : Trang chủ nền tảng  **is\_active** : Trạng thái hoạt động  **Ví dụ thực tế:**  **• id:** 1  **• name:** Cisco Webex  **• type:** meeting\_app |

### 13. product\_platforms (Quan hệ Sản phẩm ↔ Nền tảng)

|  |
| --- |
| **id** : Khóa chính  **product\_id** : Thuộc sản phẩm nào (products.id)  **platform\_id** : Hỗ trợ nền tảng nào (platforms.id)  **support\_type** : Hình thức hỗ trợ  **version** : Phiên bản tương thích  **notes** : Ghi chú  **Ví dụ thực tế:**  **• product\_id:** 200  **• platform\_id:** 1  **• support\_type:** native |

### 14. use\_cases (Nhu cầu / Tình huống sử dụng thực tế)

|  |
| --- |
| **id** : Khóa chính  **domain\_id** : Thuộc lĩnh vực nào (domains.id)  **parent\_id** : Nhu cầu cha (use\_cases.id)  **name** : Tên nhu cầu  **slug** : Đường dẫn URL  **description** : Mô tả nhu cầu  **sort\_order** : Thứ tự sắp xếp  **is\_active** : Trạng thái hoạt động  **Ví dụ thực tế:**  **• id:** 2  **• domain\_id:** 1  **• name:** Enterprise Network  **• slug:** enterprise-network |

### 15. product\_use\_cases (Quan hệ Sản phẩm ↔ Nhu cầu sử dụng)

|  |
| --- |
| **id** : Khóa chính  **product\_id** : Thuộc sản phẩm nào (products.id)  **use\_case\_id** : Phù hợp với nhu cầu nào (use\_cases.id)  **suitability** : Mức độ phù hợp (Highly Suitable, Suitable, Optional)  **notes** : Ghi chú  **Ví dụ thực tế:**  **• product\_id:** 101  **• use\_case\_id:** 2  **• suitability:** Highly Suitable |

### 16. product\_relationships (Quan hệ tương thích giữa các sản phẩm)

|  |
| --- |
| **id** : Khóa chính  **product\_id** : Sản phẩm gốc (products.id)  **related\_product\_id** : Sản phẩm liên quan (products.id)  **relationship\_type** : Loại quan hệ (compatible\_with, accessory, requires, replacement\_for...)  **notes** : Ghi chú quan hệ  **Ví dụ thực tế:**  **• product\_id:** 200  **• related\_product\_id:** 205  **• relationship\_type:** compatible\_with |

### 17. documents (Kho tài liệu kỹ thuật)

|  |
| --- |
| **id** : Khóa chính  **product\_id** : Thuộc sản phẩm cụ thể (products.id, cho phép NULL nếu tài liệu chung)  **title** : Tiêu đề tài liệu  **document\_type** : Loại tài liệu (datasheet, manual, driver, policy...)  **url** : Đường dẫn URL tải file  **file\_path** : Đường dẫn lưu trữ server  **version** : Phiên bản tài liệu  **language** : Ngôn ngữ (en, vi)  **description** : Mô tả tài liệu  **published\_date** : Ngày phát hành  **is\_active** : Trạng thái hoạt động  **created\_at, updated\_at** : Thời gian tạo và cập nhật  **Ví dụ thực tế:**  **• title:** Cisco C9300 Datasheet  **• product\_id:** 101  **• document\_type:** datasheet |

### 18. product\_images (Thư viện hình ảnh sản phẩm)

|  |
| --- |
| **id** : Khóa chính  **product\_id** : Thuộc sản phẩm nào (products.id)  **image\_url** : Đường dẫn URL hình ảnh  **image\_path** : Đường dẫn vật lý server  **image\_type** : Góc chụp / loại ảnh (front, rear, side...)  **alt\_text** : Chữ thay thế SEO hình ảnh  **sort\_order** : Thứ tự sắp xếp  **is\_primary** : Là ảnh chính đại diện (true/false)  **Ví dụ thực tế:**  **• product\_id:** 101  **• image\_url:** /uploads/products/c9300-front.jpg  **• is\_primary:** true |

### 19. product\_lifecycle (Vòng đời sản phẩm)

|  |
| --- |
| **id** : Khóa chính  **product\_id** : Thuộc sản phẩm nào (products.id)  **status** : Trạng thái vòng đời (active, end\_of\_sale, last\_ship, end\_of\_support, discontinued)  **announcement\_date** : Ngày thông báo  **end\_of\_sale\_date** : Ngày ngừng bán  **last\_ship\_date** : Ngày giao hàng cuối  **end\_of\_support\_date** : Ngày kết thúc hỗ trợ  **replacement\_product\_id** : ID sản phẩm mới thay thế (products.id)  **notes** : Ghi chú vòng đời từ hãng  **Ví dụ thực tế:**  **• product\_id:** 101  **• status:** active |

## II. 🟢 WEBSITE / CMS — 13 BẢNG

### 20. admin\_users (Tài khoản quản trị hệ thống)

|  |
| --- |
| **id** : Khóa chính  **name** : Tên quản trị viên  **email** : Thư điện tử đăng nhập  **password\_hash** : Mật khẩu mã hóa  **is\_active** : Trạng thái kích hoạt tài khoản  **last\_login\_at** : Thời gian đăng nhập gần nhất  **created\_at, updated\_at** : Thời gian tạo và cập nhật  **Ví dụ thực tế:**  **• name:** Admin IT GTS  **• email:** admin@gts.net.vn  **• is\_active:** true |

### 21. pages (Các trang nội dung tĩnh - Page Builder)

|  |
| --- |
| **id** : Khóa chính  **parent\_id** : Trang cha (pages.id, hỗ trợ đa cấp)  **title** : Tiêu đề trang  **slug** : Đường dẫn URL thân thiện  **page\_type** : Phân loại trang (about, policy, general)  **content** : Nội dung chi tiết (HTML)  **thumbnail** : Ảnh đại diện  **banner** : Ảnh banner đầu trang  **seo\_title, seo\_description** : Thẻ tối ưu SEO  **sort\_order** : Thứ tự sắp xếp  **is\_active** : Trạng thái hoạt động  **created\_at, updated\_at** : Thời gian tạo và cập nhật  **Ví dụ thực tế:**  **• title:** Chính sách bảo hành thiết bị  **• slug:** chinh-sach-bao-hanh  **• page\_type:** policy |

### 22. site\_settings (Cấu hình hệ thống dùng chung)

|  |
| --- |
| **id** : Khóa chính  **key** : Mã định danh cấu hình  **value** : Giá trị cấu hình  **type** : Kiểu dữ liệu (text, textarea, image, boolean)  **description** : Mô tả ý nghĩa cấu hình  **is\_active** : Trạng thái hoạt động  **updated\_at** : Thời gian cập nhật  **Ví dụ thực tế:**  **• key:** hotline  **• value:** 090xxxxxxx  **• type:** text |

### 23. contents (Kho nội dung tổng hợp: Tin tức + Banner)

|  |
| --- |
| **id** : Khóa chính  **type** : Phân loại nội dung (news, banner)  **category** : Danh mục tin tức (nếu là news)  **title** : Tiêu đề  **slug** : Đường dẫn URL  **summary** : Tóm tắt ngắn gọn  **content** : Nội dung chi tiết (HTML)  **thumbnail** : Ảnh đại diện (tin tức)  **banner** : Ảnh nền Desktop (banner)  **mobile\_image** : Ảnh nền Mobile (banner)  **link\_url** : Đường dẫn khi bấm banner  **button\_text** : Chữ trên nút bấm CTA  **author** : Tác giả bài viết  **published\_at** : Thời gian xuất bản  **start\_at, end\_at** : Thời gian hiển thị lịch banner  **sort\_order** : Thứ tự sắp xếp  **is\_featured** : Nổi bật  **is\_active** : Trạng thái hoạt động  **seo\_title, seo\_description** : Tối ưu SEO  **created\_at, updated\_at** : Thời gian tạo và cập nhật  **Ví dụ thực tế:**  **• type:** banner  **• title:** Giải pháp CNTT toàn diện cho doanh nghiệp  **• link\_url:** /solutions |

### 24. solutions (Giải pháp công nghệ tổng thể)

|  |
| --- |
| **id** : Khóa chính  **domain\_id** : Thuộc lĩnh vực nào (domains.id)  **name** : Tên giải pháp  **slug** : Đường dẫn URL  **short\_description** : Mô tả ngắn gọn  **description** : Nội dung chi tiết giải pháp (HTML)  **thumbnail** : Ảnh đại diện nhỏ  **banner** : Ảnh banner chi tiết  **sort\_order** : Thứ tự sắp xếp  **is\_featured** : Giải pháp nổi bật  **is\_active** : Trạng thái hoạt động  **seo\_title, seo\_description** : Tối ưu SEO  **created\_at, updated\_at** : Thời gian tạo và cập nhật  **Ví dụ thực tế:**  **• name:** Hạ tầng mạng doanh nghiệp  **• slug:** ha-tang-mang  **• is\_featured:** true |

### 25. solution\_products (Liên kết Giải pháp ↔ Sản phẩm)

|  |
| --- |
| **id** : Khóa chính  **solution\_id** : Thuộc giải pháp nào (solutions.id)  **product\_id** : Thuộc sản phẩm nào (products.id)  **role** : Vai trò thiết bị trong giải pháp (Core Switch, Access Point...)  **notes** : Ghi chú kỹ thuật  **sort\_order** : Thứ tự hiển thị  **Ví dụ thực tế:**  **• solution\_id:** 1  **• product\_id:** 101  **• role:** Access Switch |

### 26. services (Dịch vụ chuyên nghiệp của GTS)

|  |
| --- |
| **id** : Khóa chính  **name** : Tên dịch vụ  **slug** : Đường dẫn URL  **short\_description** : Mô tả ngắn  **description** : Nội dung chi tiết dịch vụ (HTML)  **thumbnail** : Ảnh đại diện  **banner** : Ảnh banner chi tiết  **icon** : Biểu tượng dịch vụ  **sort\_order** : Thứ tự sắp xếp  **is\_featured** : Dịch vụ nổi bật  **is\_active** : Trạng thái hoạt động  **seo\_title, seo\_description** : Tối ưu SEO  **created\_at, updated\_at** : Thời gian tạo và cập nhật  **Ví dụ thực tế:**  **• name:** Khảo sát & thiết kế hệ thống mạng  **• slug:** khao-sat-thiet-ke |

### 27. customers (Khách hàng doanh nghiệp tiêu biểu)

|  |
| --- |
| **id** : Khóa chính  **name** : Tên doanh nghiệp khách hàng  **slug** : Đường dẫn URL  **logo** : Logo công ty khách hàng  **website** : Website khách hàng  **industry** : Lĩnh vực hoạt động (Ngân hàng, Y tế, Giáo dục...)  **description** : Giới thiệu ngắn về khách hàng  **address** : Địa chỉ doanh nghiệp  **is\_featured** : Hiển thị nổi bật trang chủ  **is\_active** : Trạng thái hoạt động  **created\_at, updated\_at** : Thời gian tạo và cập nhật  **Ví dụ thực tế:**  **• name:** Ngân hàng TMCP A  **• industry:** Ngân hàng - Tài chính |

### 28. partners (Đối tác chiến lược & Hãng phân phối)

|  |
| --- |
| **id** : Khóa chính  **brand\_id** : Liên kết tới hãng sản xuất (brands.id, cho phép NULL)  **name** : Tên đối tác  **slug** : Đường dẫn URL  **logo** : Logo đối tác  **website** : Trang web đối tác  **description** : Giới thiệu đối tác  **partner\_type** : Phân loại đối tác (Platinum Partner, Distributor...)  **is\_featured** : Đối tác nổi bật  **is\_active** : Trạng thái hoạt động  **created\_at, updated\_at** : Thời gian tạo và cập nhật  **Ví dụ thực tế:**  **• name:** Cisco Systems  **• brand\_id:** 1 |

### 29. projects (Dự án tiêu biểu & Case Study chuyên sâu)

|  |
| --- |
| **id** : Khóa chính  **customer\_id** : Thuộc khách hàng nào (customers.id, cho phép NULL)  **name** : Tên dự án thực tế  **slug** : Đường dẫn URL  **project\_type** : Phân loại loại hình dự án  **short\_description** : Tóm tắt dự án  **description** : Mô tả chi tiết chung  **location** : Địa điểm triển khai (Tỉnh/Thành phố)  **completion\_date** : Ngày hoàn thành  **thumbnail** : Ảnh đại diện dự án  **banner** : Ảnh banner chi tiết  **challenge** : Thách thức ban đầu của khách hàng (Case study)  **solution** : Giải pháp kỹ thuật GTS cung cấp (Case study)  **result** : Kết quả đạt được thực tế (Case study)  **is\_featured** : Dự án tiêu biểu nổi bật  **is\_active** : Trạng thái hoạt động  **created\_at, updated\_at** : Thời gian tạo và cập nhật  **Ví dụ thực tế:**  **• name:** Triển khai Wi-Fi campus cho Bệnh viện B  **• location:** Hà Nội |

### 30. project\_products (Thiết bị sử dụng trong dự án)

|  |
| --- |
| **id** : Khóa chính  **project\_id** : Thuộc dự án nào (projects.id)  **product\_id** : Thuộc sản phẩm nào (products.id)  **role** : Vai trò thiết bị trong dự án  **notes** : Ghi chú triển khai thực tế  **Ví dụ thực tế:**  **• project\_id:** 10  **• product\_id:** 101  **• role:** Thiết bị chuyển mạch trung tâm tòa nhà |

### 31. support\_contents (Trung tâm hỗ trợ khách hàng tổng hợp)

|  |
| --- |
| **id** : Khóa chính  **type** : Phân loại nội dung hỗ trợ (guide, faq, driver, firmware, document)  **product\_id** : Liên kết sản phẩm cụ thể (products.id, cho phép NULL)  **title** : Tiêu đề bài viết / tài liệu hướng dẫn  **slug** : Đường dẫn URL  **summary** : Tóm tắt nội dung  **content** : Nội dung chi tiết các bước xử lý kỹ thuật (HTML)  **file\_url** : Đường dẫn tải file (driver/firmware/tài liệu)  **thumbnail** : Ảnh minh họa  **sort\_order** : Thứ tự sắp xếp  **is\_featured** : Nổi bật  **is\_active** : Trạng thái hoạt động  **created\_at, updated\_at** : Thời gian tạo và cập nhật  **Ví dụ thực tế:**  **• type:** guide  **• product\_id:** 101  **• title:** Hướng dẫn cấu hình VLAN cơ bản trên Cisco Catalyst |

### 32. contact\_requests (Tiếp nhận tương tác, Báo giá & Tư vấn dự án)

|  |
| --- |
| **id** : Khóa chính  **request\_type** : Phân loại yêu cầu (contact, quote, project\_consultation)  **name** : Họ và tên người liên hệ  **company** : Tên công ty / doanh nghiệp  **email** : Thư điện tử liên hệ  **phone** : Số điện thoại  **product\_id** : Sản phẩm quan tâm (products.id, cho phép NULL)  **solution\_id** : Giải pháp quan tâm (solutions.id, cho phép NULL)  **project\_type** : Loại hình dự án (nếu là form tư vấn dự án)  **budget\_range** : Khoảng ngân sách đầu tư dự kiến  **location** : Địa điểm triển khai dự án  **message** : Lời nhắn / yêu cầu cấu hình cụ thể  **status** : Trạng thái xử lý (new, processing, resolved)  **assigned\_to** : Nhân viên phụ trách (admin\_users.id, cho phép NULL)  **created\_at, updated\_at** : Thời gian gửi và cập nhật  **Ví dụ thực tế:**  **• request\_type:** quote  **• name:** Nguyễn Văn A  **• company:** Công ty Cổ phần ABC  **• product\_id:** 101 |

# VÍ DỤ THỰC TẾ NHẬP DỮ LIỆU 19 BẢNG PRODUCT CATALOG

Tài liệu này thể hiện ví dụ hoàn chỉnh cách đi qua từng bảng trong tổng số 19 bảng của Product Catalog đối với 2 thiết bị thực tế của Cisco: Model chuyển mạch mạng doanh nghiệp Cisco Catalyst C9200L-24T-4G-E và Model thiết bị hội nghị truyền hình cao cấp Cisco Room Kit EQ (Mã đặt hàng: CS-KIT-EQ-K9).

## PHẦN I: VÍ DỤ MODEL CISCO CATALYST C9200L-24T-4G-E

Model thuộc nhóm Networking, phân khúc Access Switch cố định 24 cổng data và 4 cổng uplink 1G.

### 1. brands

|  |
| --- |
| **brands**  ---------------------------------------------  **id =** brand\_cisco  **name =** Cisco  **slug =** cisco  **logo =** /uploads/brands/cisco.png  **website =** https://www.cisco.com  **country =** United States  **is\_active =** true |

### 2. domains

|  |
| --- |
| **domains**  ---------------------------------------------  **id =** domain\_networking  **name =** Networking  **slug =** networking  **description =** Network infrastructure products  **is\_active =** true |

### 3. product\_families

|  |
| --- |
| **product\_families**  ---------------------------------------------  **id =** family\_catalyst\_9200  **brand\_id =** brand\_cisco  **domain\_id =** domain\_networking  **name =** Cisco Catalyst 9200 Series  **slug =** cisco-catalyst-9200-series |

### 4. categories

|  |
| --- |
| **categories**  ---------------------------------------------  **id =** cat\_access\_switch  **domain\_id =** domain\_networking  **parent\_id =** cat\_switch  **name =** Access Switch  **slug =** access-switch |

### 5. products

|  |
| --- |
| **products**  ---------------------------------------------  **id =** product\_c9200l\_24t\_4g\_e  **brand\_id =** brand\_cisco  **domain\_id =** domain\_networking  **family\_id =** family\_catalyst\_9200  **category\_id =** cat\_access\_switch  **name =** Cisco Catalyst C9200L-24T-4G-E  **model =** C9200L-24T-4G-E  **status =** active |

### 6. product\_variants

|  |
| --- |
| **product\_variants**  ---------------------------------------------  **id =** variant\_c9200l\_24t\_4g\_e  **product\_id =** product\_c9200l\_24t\_4g\_e  **pid =** C9200L-24T-4G-E  **variant\_name =** Network Essentials  **status =** active |

### 7. specification\_groups

|  |
| --- |
| **specification\_groups**  ---------------------------------------------  **id =** spec\_group\_ports  **name =** Ports  **slug =** ports |

### 8. specifications

|  |
| --- |
| **specifications**  ---------------------------------------------  **id =** spec\_number\_of\_ports  **group\_id =** spec\_group\_ports  **name =** Number of Ports  **data\_type =** number  **unit =** ports |

### 9. specification\_options

|  |
| --- |
| **specification\_options**  ---------------------------------------------  **id =** option\_data\_only  **specification\_id =** spec\_port\_type  **value =** data\_only  **label =** Data Only |

### 10. product\_specifications

|  |
| --- |
| **product\_specifications**  ---------------------------------------------  **product\_id =** product\_c9200l\_24t\_4g\_e  **specification\_id =** spec\_number\_of\_ports  **value\_number =** 24  **unit\_override =** ports |

### 11. specification\_aliases

|  |
| --- |
| **specification\_aliases**  ---------------------------------------------  **specification\_id =** spec\_switching\_capacity  **brand\_id =** brand\_cisco  **alias =** Switching Capacity |

### 12. platforms

|  |
| --- |
| **platforms**  ---------------------------------------------  **id =** platform\_cisco\_ios\_xe  **name =** Cisco IOS XE  **type =** network\_os |

### 13. product\_platforms

|  |
| --- |
| **product\_platforms**  ---------------------------------------------  **product\_id =** product\_c9200l\_24t\_4g\_e  **platform\_id =** platform\_cisco\_ios\_xe  **support\_type =** native |

### 14. use\_cases

|  |
| --- |
| **use\_cases**  ---------------------------------------------  **id =** usecase\_enterprise\_network  **domain\_id =** domain\_networking  **name =** Enterprise Network |

### 15. product\_use\_cases

|  |
| --- |
| **product\_use\_cases**  ---------------------------------------------  **product\_id =** product\_c9200l\_24t\_4g\_e  **use\_case\_id =** usecase\_enterprise\_network  **suitability =** suitable |

### 16. product\_relationships

|  |
| --- |
| **product\_relationships**  ---------------------------------------------  **product\_id =** product\_c9200l\_24t\_4g\_e  **related\_product\_id =** product\_c9200\_nm\_4g  **relationship\_type =** accessory |

### 17. documents

|  |
| --- |
| **documents**  ---------------------------------------------  **product\_id =** product\_c9200l\_24t\_4g\_e  **title =** Cisco Catalyst 9200 Series Data Sheet  **document\_type =** datasheet |

### 18. product\_images

|  |
| --- |
| **product\_images**  ---------------------------------------------  **product\_id =** product\_c9200l\_24t\_4g\_e  **image\_url =** /uploads/products/c9200l-24t-4g-e.jpg  **is\_primary =** true |

### 19. product\_lifecycle

|  |
| --- |
| **product\_lifecycle**  ---------------------------------------------  **product\_id =** product\_c9200l\_24t\_4g\_e  **status =** active |

## PHẦN II: VÍ DỤ MODEL CISCO ROOM KIT EQ (Mã PID: CS-KIT-EQ-K9)

Model thuộc lĩnh vực Video Conferencing, dòng Room Series cao cấp tích hợp AI Codec Pro, Quad Camera và Table Microphone Pro cho phòng họp lớn.

### 1. brands

|  |
| --- |
| **brands**  ---------------------------------------------  **id =** brand\_cisco  **name =** Cisco  **slug =** cisco |

### 2. domains

|  |
| --- |
| **domains**  ---------------------------------------------  **id =** domain\_video\_conf  **name =** Video Conferencing  **slug =** video-conferencing  **description =** Collaboration and video meeting systems |

### 3. product\_families

|  |
| --- |
| **product\_families**  ---------------------------------------------  **id =** family\_room\_series  **brand\_id =** brand\_cisco  **domain\_id =** domain\_video\_conf  **name =** Cisco Room Series  **slug =** cisco-room-series |

### 4. categories

|  |
| --- |
| **categories**  ---------------------------------------------  **id =** cat\_room\_system  **domain\_id =** domain\_video\_conf  **name =** Room System  **slug =** room-system |

### 5. products

|  |
| --- |
| **products**  ---------------------------------------------  **id =** product\_room\_kit\_eq  **brand\_id =** brand\_cisco  **domain\_id =** domain\_video\_conf  **family\_id =** family\_room\_series  **category\_id =** cat\_room\_system  **name =** Cisco Room Kit EQ  **model =** Room Kit EQ  **status =** active |

### 6. product\_variants

|  |
| --- |
| **product\_variants**  ---------------------------------------------  **id =** variant\_cs\_kit\_eq\_k9  **product\_id =** product\_room\_kit\_eq  **pid =** CS-KIT-EQ-K9  **variant\_name =** Room Kit EQ Standard Bundle  **status =** active |

### 7. specification\_groups

|  |
| --- |
| **specification\_groups**  ---------------------------------------------  **id =** spec\_group\_camera  **name =** Camera & Optics  **slug =** camera-optics |

### 8. specifications

|  |
| --- |
| **specifications**  ---------------------------------------------  **id =** spec\_camera\_resolution  **group\_id =** spec\_group\_camera  **name =** Camera Resolution  **data\_type =** text  **unit =** pixels |

### 9. specification\_options

|  |
| --- |
| **specification\_options**  ---------------------------------------------  **id =** option\_4k\_uhd  **specification\_id =** spec\_camera\_resolution  **value =** 4k  **label =** 4K Ultra HD |

### 10. product\_specifications

|  |
| --- |
| **product\_specifications**  ---------------------------------------------  **product\_id =** product\_room\_kit\_eq  **specification\_id =** spec\_camera\_resolution  **value\_text =** 4K Ultra HD  **notes =** Quad Camera system |

### 11. specification\_aliases

|  |
| --- |
| **specification\_aliases**  ---------------------------------------------  **specification\_id =** spec\_fov  **brand\_id =** brand\_cisco  **alias =** Field of View |

### 12. platforms

|  |
| --- |
| **platforms**  ---------------------------------------------  **id =** platform\_webex\_teams  **name =** Webex & Microsoft Teams  **type =** meeting\_app |

### 13. product\_platforms

|  |
| --- |
| **product\_platforms**  ---------------------------------------------  **product\_id =** product\_room\_kit\_eq  **platform\_id =** platform\_webex\_teams  **support\_type =** certified |

### 14. use\_cases

|  |
| --- |
| **use\_cases**  ---------------------------------------------  **id =** usecase\_boardroom  **domain\_id =** domain\_video\_conf  **name =** Boardroom / Large Meeting Room |

### 15. product\_use\_cases

|  |
| --- |
| **product\_use\_cases**  ---------------------------------------------  **product\_id =** product\_room\_kit\_eq  **use\_case\_id =** usecase\_boardroom  **suitability =** Highly Suitable |

### 16. product\_relationships

|  |
| --- |
| **product\_relationships**  ---------------------------------------------  **product\_id =** product\_room\_kit\_eq  **related\_product\_id =** product\_room\_navigator  **relationship\_type =** compatible\_with |

### 17. documents

|  |
| --- |
| **documents**  ---------------------------------------------  **product\_id =** product\_room\_kit\_eq  **title =** Cisco Room Kit EQ Data Sheet  **document\_type =** datasheet |

### 18. product\_images

|  |
| --- |
| **product\_images**  ---------------------------------------------  **product\_id =** product\_room\_kit\_eq  **image\_url =** /uploads/products/room-kit-eq.jpg  **is\_primary =** true |

### 19. product\_lifecycle

|  |
| --- |
| **product\_lifecycle**  ---------------------------------------------  **product\_id =** product\_room\_kit\_eq  **status =** active |