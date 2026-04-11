# BookNest — Hệ Thống Sách Số Trực Tuyến Tích Hợp Chatbot AI

> Nền tảng mua bán và đọc sách điện tử PDF, tích hợp chatbot AI và thanh toán trực tuyến qua VNPAY.

![Java](https://img.shields.io/badge/Java-17-orange?logo=openjdk)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.2.4-green?logo=springboot)
![React](https://img.shields.io/badge/React-18-blue?logo=react)
![MySQL](https://img.shields.io/badge/MySQL-8.0-blue?logo=mysql)
![Redis](https://img.shields.io/badge/Redis-Cache-red?logo=redis)
![AWS S3](https://img.shields.io/badge/AWS_S3-Storage-orange?logo=amazons3)

---

## Mục lục

- [Giới thiệu](#giới-thiệu)
- [Công nghệ sử dụng](#công-nghệ-sử-dụng)
- [Cấu trúc thư mục](#cấu-trúc-thư-mục)
- [Chức năng chính](#chức-năng-chính)
- [Cài đặt và chạy dự án](#cài-đặt-và-chạy-dự-án)
- [Thành viên nhóm](#thành-viên-nhóm)

---

## Giới thiệu

**BookNest** là hệ thống sách số trực tuyến được xây dựng trong khuôn khổ đồ án tốt nghiệp. Hệ thống cho phép người dùng mua, đọc sách điện tử PDF, theo dõi tiến độ đọc và tương tác với chatbot AI để được hỗ trợ. Thanh toán được tích hợp với cổng VNPAY.

**Điểm nổi bật:**
- Đọc sách trực tiếp trên trình duyệt qua PDF.js
- Hệ thống gói hội viên với quyền đọc sách đặc quyền
- Cache Redis giúp tối ưu hiệu năng
- Lưu trữ file trên AWS S3

---

## Công nghệ sử dụng

| Thành phần | Công nghệ |
|---|---|
| Backend | Java 17, Spring Boot 3.2.4, Spring Security, JPA/Hibernate |
| Frontend | ReactJS 18, React Query, React Router DOM, Axios |
| Database | MySQL 8.0 |
| Cache | Redis |
| Lưu trữ file | AWS S3 (ảnh bìa, file PDF) |
| Xác thực | JWT (JSON Web Token) |
| Thanh toán | VNPAY |
| Chatbot AI | Dialogflow ES |
| Đọc PDF | PDF.js |
| Container | Docker |

---

## Cấu trúc thư mục

```
BookNest/
├── backend/            # Spring Boot backend
│   └── src/
│       └── main/
│           ├── java/   # Source code Java
│           └── resources/
│               └── application.properties
├── frontend/           # ReactJS frontend
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       └── services/
├── database/           # Scripts database
│   └── KLTN_BOOKNEST.sql
└── README.md
```

---

## Chức năng chính

### Người dùng vãng lai
- Xem trang chủ, tìm kiếm và lọc sách theo thể loại
- Xem thông tin chi tiết sách, đọc thử sách và đọc sách miễn phí
- Xem đánh giá sách, gợi ý sách
- Đăng ký tài khoản, chatbot AI hỗ trợ

### Thành viên
- Đăng nhập / Đăng xuất, quên mật khẩu
- Quản lý tài khoản cá nhân
- Quản lý giỏ hàng, mua sách và thanh toán qua VNPAY
- Nâng cấp gói hội viên, xem lịch sử đơn hàng
- Quản lý thư viện cá nhân (sách đã mua, yêu thích, đang đọc)
- Đọc sách đã mua và sách hội viên, lưu tiến độ đọc
- Đánh giá sách

### Quản trị viên
- Quản lý danh mục sách, quản lý sách
- Quản lý người dùng, quản lý đánh giá
- Quản lý đơn hàng, quản lý gói hội viên
- Quản lý chương trình giảm giá
- Thống kê và báo cáo

---

## Cài đặt và chạy dự án

### Yêu cầu

- Java 17+
- Node.js 18+
- MySQL 8.0+
- Redis

### 1. Tạo database

```bash
mysql -u root -p < database/KLTN_BOOKNEST.sql
```

### 2. Cấu hình backend

Tạo file `backend/src/main/resources/application.properties` (hoặc chỉnh sửa file có sẵn):

```properties
# Database
spring.datasource.url=jdbc:mysql://localhost:3306/booknest
spring.datasource.username=root
spring.datasource.password=your_password

# Redis
spring.data.redis.host=localhost
spring.data.redis.port=6379

# JWT
jwt.secret=your_jwt_secret
jwt.expiration=86400000

# AWS S3
aws.s3.bucket-name=booknest-books
aws.s3.region=ap-southeast-2
aws.access-key=your_access_key
aws.secret-key=your_secret_key

# VNPAY
vnpay.tmn-code=your_tmn_code
vnpay.hash-secret=your_hash_secret
```

### 3. Chạy backend

```bash
cd backend
./mvnw spring-boot:run
```

Backend khởi động tại `http://localhost:8080`

### 4. Chạy frontend

```bash
cd frontend
npm install
npm start
```

Frontend khởi động tại `http://localhost:3000`

---

## Thông tin AWS S3

- **Bucket name:** `booknest-books`
- **Region:** `ap-southeast-2` (Sydney)
- **Thư mục:** `covers/` (ảnh bìa), `books/` (file PDF)

---

## Thành viên nhóm

| Họ tên | Vai trò |
|---|---|
| Nguyễn Hùng Thắng | Trưởng nhóm — Backend |
| Phan Quang Thắng | Frontend |
| Trương Đình Nam | Frontend |
| Nguyễn Thị Hồng Nhung | Tester |
| Đồng Thị Thúy | Tester |

**Giảng viên hướng dẫn:** Th.S Nguyễn Quang Ánh

**Thời gian thực hiện:** 12/03/2026 — 15/05/2026
