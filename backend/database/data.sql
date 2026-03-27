CREATE DATABASE IF NOT EXISTS KLTN_BOOKNEST;
USE KLTN_BOOKNEST;

CREATE TABLE vai_tro (
    ma_vt BIGINT PRIMARY KEY AUTO_INCREMENT,
    ten_vai_tro VARCHAR(50) NOT NULL UNIQUE,
    INDEX idx_ten_vai_tro (ten_vai_tro)
);

CREATE TABLE nguoi_dung (
    ma_nd BIGINT PRIMARY KEY AUTO_INCREMENT,
    ho_ten NVARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    so_dien_thoai VARCHAR(15) NOT NULL,
    mat_khau VARCHAR(255) NOT NULL,
    ma_vt BIGINT NOT NULL,  
    trang_thai ENUM('hoat_dong', 'khoa') DEFAULT 'hoat_dong',
    so_lan_dang_nhap_sai INT DEFAULT 0,
    khoa_den DATETIME DEFAULT NULL,
    lan_dang_nhap_cuoi DATETIME DEFAULT NULL,
    ngay_tao DATETIME DEFAULT CURRENT_TIMESTAMP,
    ngay_cap_nhat DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (ma_vt) REFERENCES vai_tro(ma_vt),
    INDEX idx_email (email),
    INDEX idx_trang_thai (trang_thai),
    INDEX idx_ma_vt (ma_vt)  
);

CREATE TABLE ma_otp (
    Id_otp BIGINT PRIMARY KEY AUTO_INCREMENT,
    ma_nd BIGINT NOT NULL,
    ma_otp VARCHAR(6) NOT NULL,
    het_han DATETIME NOT NULL,
    da_dung BOOLEAN DEFAULT FALSE,
    ngay_tao DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ma_nd) REFERENCES nguoi_dung(ma_nd) ON DELETE CASCADE,
    INDEX idx_ma_nd (ma_nd),
    INDEX idx_ma_otp (ma_otp)
);

CREATE TABLE danh_muc_sach (
    ma_dm BIGINT PRIMARY KEY AUTO_INCREMENT,
    ten_danh_muc NVARCHAR(100) NOT NULL UNIQUE,
    ngay_tao DATETIME DEFAULT CURRENT_TIMESTAMP,
    ngay_cap_nhat DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_ten_danh_muc (ten_danh_muc)
);

CREATE TABLE sach (
    ma_sach BIGINT PRIMARY KEY AUTO_INCREMENT,
    ten_sach NVARCHAR(255) NOT NULL,
    tac_gia NVARCHAR(100) NOT NULL,
    mo_ta TEXT,
    gia DECIMAL(10,2) NOT NULL DEFAULT 0,
    anh_bia_url VARCHAR(500),
    file_pdf_url VARCHAR(500) NOT NULL,
    cho_phep_doc_thu BOOLEAN DEFAULT FALSE,
    so_trang_doc_thu INT DEFAULT 5,
    luot_xem INT DEFAULT 0,
    danh_gia_trung_binh DECIMAL(3,2) DEFAULT 0,
    da_xoa BOOLEAN DEFAULT FALSE,
    ngay_xoa DATETIME DEFAULT NULL,
    ngay_tao DATETIME DEFAULT CURRENT_TIMESTAMP,
    ngay_cap_nhat DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_ten_sach (ten_sach),
    INDEX idx_tac_gia (tac_gia),
    INDEX idx_gia (gia),
    INDEX idx_luot_xem (luot_xem),
    INDEX idx_da_xoa (da_xoa)
);

CREATE TABLE sach_danh_muc (
    ma_lk BIGINT PRIMARY KEY AUTO_INCREMENT,
    ma_sach BIGINT NOT NULL,
    ma_dm BIGINT NOT NULL,
    FOREIGN KEY (ma_sach) REFERENCES sach(ma_sach) ON DELETE CASCADE,
    FOREIGN KEY (ma_dm) REFERENCES danh_muc_sach(ma_dm) ON DELETE CASCADE,
    UNIQUE KEY unique_sach_danh_muc (ma_sach, ma_dm)
);

CREATE TABLE gio_hang (
    ma_gh BIGINT PRIMARY KEY AUTO_INCREMENT,
    ma_nd BIGINT NOT NULL,
    ma_sach BIGINT NOT NULL,
    ngay_tao DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ma_nd) REFERENCES nguoi_dung(ma_nd) ON DELETE CASCADE,
    FOREIGN KEY (ma_sach) REFERENCES sach(ma_sach) ON DELETE CASCADE,
    UNIQUE KEY unique_gio_hang (ma_nd, ma_sach)
);

CREATE TABLE don_hang (
    id_dh BIGINT PRIMARY KEY AUTO_INCREMENT,
    ma_don_hang VARCHAR(50) NOT NULL UNIQUE,
    ma_nd BIGINT NOT NULL,
    ho_ten NVARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    so_dien_thoai VARCHAR(15) NOT NULL,
    tong_tien DECIMAL(12,2) NOT NULL,
    phuong_thuc_thanh_toan ENUM('VNPAY') DEFAULT 'VNPAY',
    trang_thai ENUM('cho_thanh_toan', 'da_thanh_toan', 'that_bai', 'da_huy') DEFAULT 'cho_thanh_toan',
    ngay_tao DATETIME DEFAULT CURRENT_TIMESTAMP,
    ngay_cap_nhat DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (ma_nd) REFERENCES nguoi_dung(ma_nd) ON DELETE CASCADE,
    INDEX idx_ma_don_hang (ma_don_hang),
    INDEX idx_ma_nd (ma_nd),
    INDEX idx_trang_thai (trang_thai),
    INDEX idx_ngay_tao (ngay_tao)
);

CREATE TABLE chi_tiet_don_hang (
    ma_ctdh BIGINT PRIMARY KEY AUTO_INCREMENT,
    id_dh BIGINT NOT NULL,
    ma_sach BIGINT NOT NULL,
    ten_sach NVARCHAR(255) NOT NULL,
    tac_gia NVARCHAR(100) NOT NULL,
    anh_bia_url VARCHAR(500),
    don_gia DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (id_dh) REFERENCES don_hang(id_dh) ON DELETE CASCADE,
    FOREIGN KEY (ma_sach) REFERENCES sach(ma_sach) ON DELETE CASCADE,
    INDEX idx_id_dh (id_dh),
    INDEX idx_ma_sach (ma_sach)
);

CREATE TABLE giao_dich_thanh_toan (
    ma_gd BIGINT PRIMARY KEY AUTO_INCREMENT,
    id_dh BIGINT NOT NULL,
    so_tien DECIMAL(12,2) NOT NULL,
    phuong_thuc ENUM('VNPAY') DEFAULT 'VNPAY',
    trang_thai ENUM('thanh_cong', 'that_bai') NOT NULL,
    ma_giao_dich_ngoai VARCHAR(100),
    phan_hoi TEXT,
    ngay_thanh_toan DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_dh) REFERENCES don_hang(id_dh) ON DELETE CASCADE,
    INDEX idx_id_dh (id_dh),
    INDEX idx_trang_thai (trang_thai)
);

CREATE TABLE danh_gia (
    ma_dg BIGINT PRIMARY KEY AUTO_INCREMENT,
    ma_nd BIGINT NOT NULL,
    ma_sach BIGINT NOT NULL,
    so_sao TINYINT NOT NULL,
    noi_dung TEXT,
    hien_thi BOOLEAN DEFAULT TRUE,
    ngay_tao DATETIME DEFAULT CURRENT_TIMESTAMP,
    ngay_cap_nhat DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (ma_nd) REFERENCES nguoi_dung(ma_nd) ON DELETE CASCADE,
    FOREIGN KEY (ma_sach) REFERENCES sach(ma_sach) ON DELETE CASCADE,
    UNIQUE KEY unique_nguoi_dung_sach (ma_nd, ma_sach),
    INDEX idx_ma_sach (ma_sach),
    INDEX idx_so_sao (so_sao)
);

CREATE TABLE sach_yeu_thich (
    ma_sachyt BIGINT PRIMARY KEY AUTO_INCREMENT,
    ma_nd BIGINT NOT NULL,
    ma_sach BIGINT NOT NULL,
    ngay_tao DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ma_nd) REFERENCES nguoi_dung(ma_nd) ON DELETE CASCADE,
    FOREIGN KEY (ma_sach) REFERENCES sach(ma_sach) ON DELETE CASCADE,
    UNIQUE KEY unique_yeu_thich (ma_nd, ma_sach)
);

CREATE TABLE tien_do_doc_sach (
    ma_td BIGINT PRIMARY KEY AUTO_INCREMENT,
    ma_nd BIGINT NOT NULL,
    ma_sach BIGINT NOT NULL,
    trang_hien_tai INT DEFAULT 1,
    phan_tram DECIMAL(5,2) DEFAULT 0,
    lan_doc_cuoi DATETIME DEFAULT CURRENT_TIMESTAMP,
    ngay_tao DATETIME DEFAULT CURRENT_TIMESTAMP,
    ngay_cap_nhat DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (ma_nd) REFERENCES nguoi_dung(ma_nd) ON DELETE CASCADE,
    FOREIGN KEY (ma_sach) REFERENCES sach(ma_sach) ON DELETE CASCADE,
    UNIQUE KEY unique_nguoi_dung_sach (ma_nd, ma_sach)
);

CREATE TABLE goi_hoi_vien (
    ma_hv BIGINT PRIMARY KEY AUTO_INCREMENT,
    ten_goi NVARCHAR(100) NOT NULL UNIQUE,
    gia DECIMAL(10,2) NOT NULL,
    thoi_han_thang INT NOT NULL,
    mo_ta TEXT,
    hoat_dong BOOLEAN DEFAULT TRUE,
    ngay_tao DATETIME DEFAULT CURRENT_TIMESTAMP,
    ngay_cap_nhat DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_hoat_dong (hoat_dong)
);

CREATE TABLE goi_hoi_vien_sach (
    id_lk_sachhv BIGINT PRIMARY KEY AUTO_INCREMENT,
    ma_hv BIGINT NOT NULL,
    ma_sach BIGINT NOT NULL,
    ngay_tao DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ma_hv) REFERENCES goi_hoi_vien(ma_hv) ON DELETE CASCADE,
    FOREIGN KEY (ma_sach) REFERENCES sach(ma_sach) ON DELETE CASCADE,
    UNIQUE KEY unique_goi_sach (ma_hv, ma_sach)
);

CREATE TABLE lich_su_hoi_vien (
    ma_lshv BIGINT PRIMARY KEY AUTO_INCREMENT,
    ma_nd BIGINT NOT NULL,
    ma_hv BIGINT NOT NULL,
    ngay_bat_dau DATETIME NOT NULL,
    ngay_ket_thuc DATETIME NOT NULL,
    trang_thai ENUM('hoat_dong', 'het_han') DEFAULT 'hoat_dong',
    ma_gd BIGINT NULL,
    ngay_tao DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ma_nd) REFERENCES nguoi_dung(ma_nd) ON DELETE CASCADE,
    FOREIGN KEY (ma_hv) REFERENCES goi_hoi_vien(ma_hv) ON DELETE CASCADE,
    FOREIGN KEY (ma_gd) REFERENCES giao_dich_thanh_toan(ma_gd) ON DELETE SET NULL,
    INDEX idx_ma_nd (ma_nd),
    INDEX idx_trang_thai (trang_thai)
);

CREATE TABLE chuong_trinh_giam_gia (
    ma_ct BIGINT PRIMARY KEY AUTO_INCREMENT,
    ten_chuong_trinh NVARCHAR(255) NOT NULL,
    loai_giam ENUM('phan_tram', 'tien_co_dinh') NOT NULL,
    gia_tri_giam DECIMAL(10,2) NOT NULL,
    ngay_bat_dau DATETIME NOT NULL,
    ngay_ket_thuc DATETIME NOT NULL,
    hoat_dong BOOLEAN DEFAULT TRUE,
    ngay_tao DATETIME DEFAULT CURRENT_TIMESTAMP,
    ngay_cap_nhat DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_ten_chuong_trinh (ten_chuong_trinh),
    INDEX idx_hoat_dong (hoat_dong),
    INDEX idx_ngay (ngay_bat_dau, ngay_ket_thuc)
);

CREATE TABLE chuong_trinh_giam_gia_sach (
    id_lk_ctsach BIGINT PRIMARY KEY AUTO_INCREMENT,
    ma_ct BIGINT NOT NULL,
    ma_sach BIGINT NOT NULL,
    ngay_tao DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ma_ct) REFERENCES chuong_trinh_giam_gia(ma_ct) ON DELETE CASCADE,
    FOREIGN KEY (ma_sach) REFERENCES sach(ma_sach) ON DELETE CASCADE,
    UNIQUE KEY unique_chuong_trinh_sach (ma_ct, ma_sach)
);

CREATE TABLE lich_su_chat (
    ma_lschat BIGINT PRIMARY KEY AUTO_INCREMENT,
    ma_nd BIGINT NULL,
    ma_phien VARCHAR(100) NOT NULL,
    vai_tro ENUM('user', 'bot') DEFAULT 'user',
    noi_dung TEXT NOT NULL,
    y_dinh VARCHAR(50),
    ngay_tao DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ma_nd) REFERENCES nguoi_dung(ma_nd) ON DELETE SET NULL,
    INDEX idx_ma_nd (ma_nd),
    INDEX idx_ma_phien (ma_phien),
    INDEX idx_ngay_tao (ngay_tao)
);