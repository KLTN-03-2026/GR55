-- MySQL dump 10.13  Distrib 9.3.0, for Win64 (x86_64)
--
-- Host: localhost    Database: KLTN_BOOKNEST
-- ------------------------------------------------------
-- Server version	9.3.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `chi_tiet_don_hang`
--

DROP TABLE IF EXISTS `chi_tiet_don_hang`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chi_tiet_don_hang` (
  `ma_ctdh` bigint NOT NULL AUTO_INCREMENT,
  `id_dh` bigint NOT NULL,
  `ma_sach` bigint NOT NULL,
  `ten_sach` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `tac_gia` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `anh_bia_url` varchar(500) DEFAULT NULL,
  `don_gia` decimal(10,2) NOT NULL,
  PRIMARY KEY (`ma_ctdh`),
  KEY `idx_id_dh` (`id_dh`),
  KEY `idx_ma_sach` (`ma_sach`),
  CONSTRAINT `chi_tiet_don_hang_ibfk_1` FOREIGN KEY (`id_dh`) REFERENCES `don_hang` (`id_dh`) ON DELETE CASCADE,
  CONSTRAINT `chi_tiet_don_hang_ibfk_2` FOREIGN KEY (`ma_sach`) REFERENCES `sach` (`ma_sach`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chi_tiet_don_hang`
--

LOCK TABLES `chi_tiet_don_hang` WRITE;
/*!40000 ALTER TABLE `chi_tiet_don_hang` DISABLE KEYS */;
/*!40000 ALTER TABLE `chi_tiet_don_hang` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chuong_trinh_giam_gia`
--

DROP TABLE IF EXISTS `chuong_trinh_giam_gia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chuong_trinh_giam_gia` (
  `ma_ct` bigint NOT NULL AUTO_INCREMENT,
  `ten_chuong_trinh` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `loai_giam` enum('phan_tram','tien_co_dinh') NOT NULL,
  `gia_tri_giam` decimal(10,2) NOT NULL,
  `ngay_bat_dau` datetime NOT NULL,
  `ngay_ket_thuc` datetime NOT NULL,
  `hoat_dong` tinyint(1) DEFAULT '1',
  `ngay_tao` datetime DEFAULT CURRENT_TIMESTAMP,
  `ngay_cap_nhat` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`ma_ct`),
  KEY `idx_ten_chuong_trinh` (`ten_chuong_trinh`),
  KEY `idx_hoat_dong` (`hoat_dong`),
  KEY `idx_ngay` (`ngay_bat_dau`,`ngay_ket_thuc`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chuong_trinh_giam_gia`
--

LOCK TABLES `chuong_trinh_giam_gia` WRITE;
/*!40000 ALTER TABLE `chuong_trinh_giam_gia` DISABLE KEYS */;
/*!40000 ALTER TABLE `chuong_trinh_giam_gia` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chuong_trinh_giam_gia_sach`
--

DROP TABLE IF EXISTS `chuong_trinh_giam_gia_sach`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chuong_trinh_giam_gia_sach` (
  `id_lk_ctsach` bigint NOT NULL AUTO_INCREMENT,
  `ma_ct` bigint NOT NULL,
  `ma_sach` bigint NOT NULL,
  `ngay_tao` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_lk_ctsach`),
  UNIQUE KEY `unique_chuong_trinh_sach` (`ma_ct`,`ma_sach`),
  KEY `ma_sach` (`ma_sach`),
  CONSTRAINT `chuong_trinh_giam_gia_sach_ibfk_1` FOREIGN KEY (`ma_ct`) REFERENCES `chuong_trinh_giam_gia` (`ma_ct`) ON DELETE CASCADE,
  CONSTRAINT `chuong_trinh_giam_gia_sach_ibfk_2` FOREIGN KEY (`ma_sach`) REFERENCES `sach` (`ma_sach`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chuong_trinh_giam_gia_sach`
--

LOCK TABLES `chuong_trinh_giam_gia_sach` WRITE;
/*!40000 ALTER TABLE `chuong_trinh_giam_gia_sach` DISABLE KEYS */;
/*!40000 ALTER TABLE `chuong_trinh_giam_gia_sach` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `danh_gia`
--

DROP TABLE IF EXISTS `danh_gia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `danh_gia` (
  `ma_dg` bigint NOT NULL AUTO_INCREMENT,
  `ma_nd` bigint NOT NULL,
  `ma_sach` bigint NOT NULL,
  `so_sao` int NOT NULL,
  `noi_dung` text,
  `hien_thi` tinyint(1) DEFAULT '1',
  `ngay_tao` datetime DEFAULT CURRENT_TIMESTAMP,
  `ngay_cap_nhat` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`ma_dg`),
  UNIQUE KEY `unique_nguoi_dung_sach` (`ma_nd`,`ma_sach`),
  KEY `idx_ma_sach` (`ma_sach`),
  KEY `idx_so_sao` (`so_sao`),
  CONSTRAINT `danh_gia_ibfk_1` FOREIGN KEY (`ma_nd`) REFERENCES `nguoi_dung` (`ma_nd`) ON DELETE CASCADE,
  CONSTRAINT `danh_gia_ibfk_2` FOREIGN KEY (`ma_sach`) REFERENCES `sach` (`ma_sach`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `danh_gia`
--

LOCK TABLES `danh_gia` WRITE;
/*!40000 ALTER TABLE `danh_gia` DISABLE KEYS */;
/*!40000 ALTER TABLE `danh_gia` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `danh_muc_sach`
--

DROP TABLE IF EXISTS `danh_muc_sach`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `danh_muc_sach` (
  `ma_dm` bigint NOT NULL AUTO_INCREMENT,
  `ten_danh_muc` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `ngay_tao` datetime DEFAULT CURRENT_TIMESTAMP,
  `ngay_cap_nhat` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`ma_dm`),
  UNIQUE KEY `ten_danh_muc` (`ten_danh_muc`),
  KEY `idx_ten_danh_muc` (`ten_danh_muc`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `danh_muc_sach`
--

LOCK TABLES `danh_muc_sach` WRITE;
/*!40000 ALTER TABLE `danh_muc_sach` DISABLE KEYS */;
INSERT INTO `danh_muc_sach` VALUES (1,'ß║¿m thß╗▒c - Nß║Ñu ─ân','2026-03-27 06:57:38','2026-03-27 06:57:38'),(2,'Cß╗ò t├¡ch - Thß║ºn thoß║íi','2026-03-27 06:57:51','2026-03-27 06:57:51'),(3,'C├┤ng nghß╗ç th├┤ng tin','2026-03-27 06:58:42','2026-03-27 06:58:42'),(4,'Hß╗ìc ngoß║íi ngß╗»','2026-03-27 06:58:51','2026-03-27 06:58:51'),(5,'Hß╗ôi k├╜ - T├╣y b├║t','2026-03-27 06:58:58','2026-03-27 06:58:58'),(6,'Huyß╗ün b├¡ - Giß║ú t╞░ß╗ƒng','2026-03-27 06:59:05','2026-03-27 06:59:05'),(7,'Khoa hß╗ìc - Kß╗╣ thuß║¡t','2026-03-27 06:59:15','2026-03-27 06:59:15'),(8,'Kiß║┐m hiß╗çp - Ti├¬n hiß╗çp','2026-03-27 06:59:31','2026-03-27 06:59:31'),(9,'Kiß║┐n tr├║c - X├óy dß╗▒ng','2026-03-27 06:59:37','2026-03-27 06:59:37'),(10,'Kinh tß║┐ - Quß║ún l├╜','2026-03-27 06:59:44','2026-03-27 06:59:44'),(11,'Lß╗ïch sß╗¡ - Ch├¡nh trß╗ï','2026-03-27 06:59:52','2026-03-27 06:59:52'),(12,'Marketing - B├ín h├áng','2026-03-27 06:59:59','2026-03-27 06:59:59'),(13,'N├┤ng - L├óm - Ng╞░','2026-03-27 07:00:15','2026-03-27 07:00:15'),(14,'Phi├¬u l╞░u - Mß║ío hiß╗âm','2026-03-27 07:00:23','2026-03-27 07:00:23'),(15,'S├ích gi├ío khoa','2026-03-27 07:00:29','2026-03-27 07:00:29'),(16,'T├óm l├╜ - Kß╗╣ n─âng sß╗æng','2026-03-27 07:00:35','2026-03-27 07:00:35'),(17,'Thß╗â thao - Nghß╗ç thuß║¡t','2026-03-27 07:00:41','2026-03-27 07:00:41'),(18,'Th╞░ viß╗çn ph├íp luß║¡t','2026-03-27 07:00:48','2026-03-27 07:00:48'),(19,'Tiß╗âu thuyß║┐t ph╞░╞íng t├óy','2026-03-27 07:01:05','2026-03-27 07:01:05'),(20,'Tiß╗âu thuyß║┐t Trung Quß╗æc','2026-03-27 07:01:13','2026-03-27 07:01:13'),(21,'Triß║┐t hß╗ìc','2026-03-27 07:01:22','2026-03-27 07:01:22'),(22,'Trinh th├ím - H├¼nh sß╗▒','2026-03-27 07:01:28','2026-03-27 07:01:28'),(23,'Truyß╗çn c╞░ß╗¥i - Tiß║┐u l├óm','2026-03-27 07:01:35','2026-03-27 07:01:35'),(24,'Truyß╗çn ma - Truyß╗çn kinh dß╗ï','2026-03-27 07:01:43','2026-03-27 07:01:43'),(25,'Truyß╗çn ngß║»n - Ng├┤n t├¼nh','2026-03-27 07:01:49','2026-03-27 07:01:49'),(26,'Truyß╗çn tranh','2026-03-27 07:01:55','2026-03-27 07:01:55'),(27,'Tß╗¡ vi - Phong thß╗ºy','2026-03-27 07:02:01','2026-03-27 07:02:01'),(28,'V─ân h├│a - T├┤n gi├ío','2026-03-27 07:02:12','2026-03-27 07:02:12');
/*!40000 ALTER TABLE `danh_muc_sach` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `don_hang`
--

DROP TABLE IF EXISTS `don_hang`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `don_hang` (
  `id_dh` bigint NOT NULL AUTO_INCREMENT,
  `ma_don_hang` varchar(50) NOT NULL,
  `ma_nd` bigint NOT NULL,
  `ho_ten` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `email` varchar(100) NOT NULL,
  `so_dien_thoai` varchar(15) NOT NULL,
  `tong_tien` decimal(12,2) NOT NULL,
  `phuong_thuc_thanh_toan` enum('VNPAY') DEFAULT 'VNPAY',
  `trang_thai` enum('cho_thanh_toan','da_thanh_toan','that_bai','da_huy') DEFAULT 'cho_thanh_toan',
  `ngay_tao` datetime DEFAULT CURRENT_TIMESTAMP,
  `ngay_cap_nhat` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_dh`),
  UNIQUE KEY `ma_don_hang` (`ma_don_hang`),
  KEY `idx_ma_don_hang` (`ma_don_hang`),
  KEY `idx_ma_nd` (`ma_nd`),
  KEY `idx_trang_thai` (`trang_thai`),
  KEY `idx_ngay_tao` (`ngay_tao`),
  CONSTRAINT `don_hang_ibfk_1` FOREIGN KEY (`ma_nd`) REFERENCES `nguoi_dung` (`ma_nd`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `don_hang`
--

LOCK TABLES `don_hang` WRITE;
/*!40000 ALTER TABLE `don_hang` DISABLE KEYS */;
/*!40000 ALTER TABLE `don_hang` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `giao_dich_thanh_toan`
--

DROP TABLE IF EXISTS `giao_dich_thanh_toan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `giao_dich_thanh_toan` (
  `ma_gd` bigint NOT NULL AUTO_INCREMENT,
  `id_dh` bigint NOT NULL,
  `so_tien` decimal(12,2) NOT NULL,
  `phuong_thuc` enum('VNPAY') DEFAULT 'VNPAY',
  `trang_thai` enum('thanh_cong','that_bai') NOT NULL,
  `ma_giao_dich_ngoai` varchar(100) DEFAULT NULL,
  `phan_hoi` text,
  `ngay_thanh_toan` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`ma_gd`),
  KEY `idx_id_dh` (`id_dh`),
  KEY `idx_trang_thai` (`trang_thai`),
  CONSTRAINT `giao_dich_thanh_toan_ibfk_1` FOREIGN KEY (`id_dh`) REFERENCES `don_hang` (`id_dh`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `giao_dich_thanh_toan`
--

LOCK TABLES `giao_dich_thanh_toan` WRITE;
/*!40000 ALTER TABLE `giao_dich_thanh_toan` DISABLE KEYS */;
/*!40000 ALTER TABLE `giao_dich_thanh_toan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gio_hang`
--

DROP TABLE IF EXISTS `gio_hang`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gio_hang` (
  `ma_gh` bigint NOT NULL AUTO_INCREMENT,
  `ma_nd` bigint NOT NULL,
  `ma_sach` bigint NOT NULL,
  `ngay_tao` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`ma_gh`),
  UNIQUE KEY `unique_gio_hang` (`ma_nd`,`ma_sach`),
  KEY `ma_sach` (`ma_sach`),
  CONSTRAINT `gio_hang_ibfk_1` FOREIGN KEY (`ma_nd`) REFERENCES `nguoi_dung` (`ma_nd`) ON DELETE CASCADE,
  CONSTRAINT `gio_hang_ibfk_2` FOREIGN KEY (`ma_sach`) REFERENCES `sach` (`ma_sach`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gio_hang`
--

LOCK TABLES `gio_hang` WRITE;
/*!40000 ALTER TABLE `gio_hang` DISABLE KEYS */;
/*!40000 ALTER TABLE `gio_hang` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `goi_hoi_vien`
--

DROP TABLE IF EXISTS `goi_hoi_vien`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `goi_hoi_vien` (
  `ma_hv` bigint NOT NULL AUTO_INCREMENT,
  `ten_goi` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `gia` decimal(10,2) NOT NULL,
  `thoi_han_thang` int NOT NULL,
  `mo_ta` text,
  `hoat_dong` tinyint(1) DEFAULT '1',
  `ngay_tao` datetime DEFAULT CURRENT_TIMESTAMP,
  `ngay_cap_nhat` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`ma_hv`),
  UNIQUE KEY `ten_goi` (`ten_goi`),
  KEY `idx_hoat_dong` (`hoat_dong`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `goi_hoi_vien`
--

LOCK TABLES `goi_hoi_vien` WRITE;
/*!40000 ALTER TABLE `goi_hoi_vien` DISABLE KEYS */;
/*!40000 ALTER TABLE `goi_hoi_vien` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `goi_hoi_vien_sach`
--

DROP TABLE IF EXISTS `goi_hoi_vien_sach`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `goi_hoi_vien_sach` (
  `id_lk_sachhv` bigint NOT NULL AUTO_INCREMENT,
  `ma_hv` bigint NOT NULL,
  `ma_sach` bigint NOT NULL,
  `ngay_tao` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_lk_sachhv`),
  UNIQUE KEY `unique_goi_sach` (`ma_hv`,`ma_sach`),
  KEY `ma_sach` (`ma_sach`),
  CONSTRAINT `goi_hoi_vien_sach_ibfk_1` FOREIGN KEY (`ma_hv`) REFERENCES `goi_hoi_vien` (`ma_hv`) ON DELETE CASCADE,
  CONSTRAINT `goi_hoi_vien_sach_ibfk_2` FOREIGN KEY (`ma_sach`) REFERENCES `sach` (`ma_sach`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `goi_hoi_vien_sach`
--

LOCK TABLES `goi_hoi_vien_sach` WRITE;
/*!40000 ALTER TABLE `goi_hoi_vien_sach` DISABLE KEYS */;
/*!40000 ALTER TABLE `goi_hoi_vien_sach` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lich_su_chat`
--

DROP TABLE IF EXISTS `lich_su_chat`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lich_su_chat` (
  `ma_lschat` bigint NOT NULL AUTO_INCREMENT,
  `ma_nd` bigint DEFAULT NULL,
  `ma_phien` varchar(100) NOT NULL,
  `vai_tro` enum('user','bot') DEFAULT 'user',
  `noi_dung` text NOT NULL,
  `y_dinh` varchar(50) DEFAULT NULL,
  `ngay_tao` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`ma_lschat`),
  KEY `idx_ma_nd` (`ma_nd`),
  KEY `idx_ma_phien` (`ma_phien`),
  KEY `idx_ngay_tao` (`ngay_tao`),
  CONSTRAINT `lich_su_chat_ibfk_1` FOREIGN KEY (`ma_nd`) REFERENCES `nguoi_dung` (`ma_nd`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lich_su_chat`
--

LOCK TABLES `lich_su_chat` WRITE;
/*!40000 ALTER TABLE `lich_su_chat` DISABLE KEYS */;
/*!40000 ALTER TABLE `lich_su_chat` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lich_su_hoi_vien`
--

DROP TABLE IF EXISTS `lich_su_hoi_vien`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lich_su_hoi_vien` (
  `ma_lshv` bigint NOT NULL AUTO_INCREMENT,
  `ma_nd` bigint NOT NULL,
  `ma_hv` bigint NOT NULL,
  `ngay_bat_dau` datetime NOT NULL,
  `ngay_ket_thuc` datetime NOT NULL,
  `trang_thai` varchar(20) DEFAULT NULL,
  `ma_gd` bigint DEFAULT NULL,
  `ngay_tao` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`ma_lshv`),
  KEY `ma_hv` (`ma_hv`),
  KEY `ma_gd` (`ma_gd`),
  KEY `idx_ma_nd` (`ma_nd`),
  KEY `idx_trang_thai` (`trang_thai`),
  CONSTRAINT `lich_su_hoi_vien_ibfk_1` FOREIGN KEY (`ma_nd`) REFERENCES `nguoi_dung` (`ma_nd`) ON DELETE CASCADE,
  CONSTRAINT `lich_su_hoi_vien_ibfk_2` FOREIGN KEY (`ma_hv`) REFERENCES `goi_hoi_vien` (`ma_hv`) ON DELETE CASCADE,
  CONSTRAINT `lich_su_hoi_vien_ibfk_3` FOREIGN KEY (`ma_gd`) REFERENCES `giao_dich_thanh_toan` (`ma_gd`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lich_su_hoi_vien`
--

LOCK TABLES `lich_su_hoi_vien` WRITE;
/*!40000 ALTER TABLE `lich_su_hoi_vien` DISABLE KEYS */;
/*!40000 ALTER TABLE `lich_su_hoi_vien` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ma_otp`
--

DROP TABLE IF EXISTS `ma_otp`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ma_otp` (
  `Id_otp` bigint NOT NULL AUTO_INCREMENT,
  `ma_nd` bigint NOT NULL,
  `ma_otp` varchar(6) NOT NULL,
  `het_han` datetime NOT NULL,
  `da_dung` tinyint(1) DEFAULT '0',
  `ngay_tao` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id_otp`),
  KEY `idx_ma_nd` (`ma_nd`),
  KEY `idx_ma_otp` (`ma_otp`),
  CONSTRAINT `ma_otp_ibfk_1` FOREIGN KEY (`ma_nd`) REFERENCES `nguoi_dung` (`ma_nd`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ma_otp`
--

LOCK TABLES `ma_otp` WRITE;
/*!40000 ALTER TABLE `ma_otp` DISABLE KEYS */;
INSERT INTO `ma_otp` VALUES (1,1,'857605','2026-03-27 06:39:54',1,'2026-03-27 06:36:54');
/*!40000 ALTER TABLE `ma_otp` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `nguoi_dung`
--

DROP TABLE IF EXISTS `nguoi_dung`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nguoi_dung` (
  `ma_nd` bigint NOT NULL AUTO_INCREMENT,
  `ho_ten` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `email` varchar(100) NOT NULL,
  `so_dien_thoai` varchar(15) NOT NULL,
  `mat_khau` varchar(255) NOT NULL,
  `ma_vt` bigint NOT NULL,
  `trang_thai` enum('hoat_dong','khoa') DEFAULT 'hoat_dong',
  `so_lan_dang_nhap_sai` int DEFAULT '0',
  `khoa_den` datetime DEFAULT NULL,
  `lan_dang_nhap_cuoi` datetime DEFAULT NULL,
  `ngay_tao` datetime DEFAULT CURRENT_TIMESTAMP,
  `ngay_cap_nhat` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`ma_nd`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_email` (`email`),
  KEY `idx_trang_thai` (`trang_thai`),
  KEY `idx_ma_vt` (`ma_vt`),
  CONSTRAINT `nguoi_dung_ibfk_1` FOREIGN KEY (`ma_vt`) REFERENCES `vai_tro` (`ma_vt`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nguoi_dung`
--

LOCK TABLES `nguoi_dung` WRITE;
/*!40000 ALTER TABLE `nguoi_dung` DISABLE KEYS */;
INSERT INTO `nguoi_dung` VALUES (1,'Nguyß╗àn H├╣ng Thß║»ng','hungthang0206@gmail.com','0359598204','$2a$10$EZDhrxLM4SOiHC9beC2sm.kg8f1eyRM/51unYF6r2KzJiOqVDnaj6',1,'hoat_dong',0,NULL,'2026-03-30 13:04:37','2026-03-27 06:25:56','2026-03-30 13:04:37'),(2,'Admin','admin@booknest.com','0359598204','$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LPZMkHPaE2W',2,'hoat_dong',2,NULL,NULL,'2026-03-27 13:28:57','2026-03-27 06:30:14'),(3,'Xu├ón Diß╗çu','xuandieu@gmail.com','0359598204','$2a$10$96LumqIai6xx.eO0epuereu4Z1YQwfAwHUrBRaLKo.sNX1okg4TJm',2,'hoat_dong',0,NULL,'2026-03-30 13:33:23','2026-03-27 13:31:13','2026-03-30 13:33:23');
/*!40000 ALTER TABLE `nguoi_dung` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sach`
--

DROP TABLE IF EXISTS `sach`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sach` (
  `ma_sach` bigint NOT NULL AUTO_INCREMENT,
  `ten_sach` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `tac_gia` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `mo_ta` text,
  `gia` decimal(10,2) NOT NULL DEFAULT '0.00',
  `anh_bia_url` varchar(500) DEFAULT NULL,
  `file_pdf_url` varchar(500) NOT NULL,
  `cho_phep_doc_thu` tinyint(1) DEFAULT '0',
  `so_trang_doc_thu` int DEFAULT '5',
  `luot_xem` int DEFAULT '0',
  `danh_gia_trung_binh` decimal(3,2) DEFAULT '0.00',
  `da_xoa` tinyint(1) DEFAULT '0',
  `ngay_xoa` datetime DEFAULT NULL,
  `ngay_tao` datetime DEFAULT CURRENT_TIMESTAMP,
  `ngay_cap_nhat` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`ma_sach`),
  KEY `idx_ten_sach` (`ten_sach`),
  KEY `idx_tac_gia` (`tac_gia`),
  KEY `idx_gia` (`gia`),
  KEY `idx_luot_xem` (`luot_xem`),
  KEY `idx_da_xoa` (`da_xoa`)
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sach`
--

LOCK TABLES `sach` WRITE;
/*!40000 ALTER TABLE `sach` DISABLE KEYS */;
INSERT INTO `sach` VALUES (1,'206 M├│n Canh Dinh D╞░ß╗íng Cho Trß║╗ Em','Mai Ngß╗ìc','Nß╗Öi dung bao gß╗ôm:Canh c├í ch├⌐p m├ú thß║ºy, Canh t├ío ─æß║¡u ─æen hß║ºm c├í ch├⌐p, Canh g├á ─æß║úng s├óm, Canh g├á b├¡ ─æao, Canh long nh├ún hß║ít sen, Canh bß║ích cß║¡p ├╜ d─⌐ thß╗ït nß║íc, Canh b├¡ ─æao ├╜ d─⌐ thß╗ït nß║íc, Canh rong ─æß╗Å rau c├óu,...',50000.00,'https://booknest-books.s3.ap-southeast-2.amazonaws.com/covers/351cdd27-397e-4fff-afee-c67d9b1e87b0_book1.jpg','https://booknest-books.s3.ap-southeast-2.amazonaws.com/books/7f076c3d-8252-4429-ad68-4b7e53345f17_book1.pdf',1,5,0,0.00,0,NULL,'2026-03-27 07:46:54','2026-03-27 07:46:54'),(2,'120 M├│n S├║p Bß╗ò D╞░ß╗íng Cho Trß║╗ Em V├á Ng╞░ß╗¥i Bß╗çnh','Mß╗╣ Hß║ính','120 m├│n s├║p bß╗ò d╞░ß╗íng cho trß║╗ em & ng╞░ß╗¥i bß╗çnh vß╗¢i mß╗Öt sß╗æ m├│n ─ân nh╞░: 1. C├íc m├│n s├║p cho trß║╗ em 2. C├íc m├│n s├║p cho ng╞░ß╗¥i bß╗çnh ....',40000.00,'https://booknest-books.s3.ap-southeast-2.amazonaws.com/covers/132ddfa4-7e92-41f6-bc7a-dd457a11d73d_book2.jpg','https://booknest-books.s3.ap-southeast-2.amazonaws.com/books/8a2a3d20-25e3-4f96-9699-f257830ebf3b_book2.pdf',1,5,0,0.00,0,NULL,'2026-03-30 01:12:53','2026-03-30 01:12:53'),(3,'M├│n ─én Gi├║p Trß║╗ Th├┤ng Minh Hß╗ìc Giß╗Åi','Nhß║¡t Nguy├¬n','Cuß╗æn s├ích ΓÇ£M├│n ─ân gi├║p trß║╗ th├┤ng minh hß╗ìc giß╗ÅiΓÇ¥ xin giß╗¢i thiß╗çu c├íc loß║íi thß╗▒c phß║⌐m th├┤ng dß╗Ñng h├áng ng├áy, c├íc m├│n ─ân bß╗ò d╞░ß╗íng gi├║p trß║╗ nhß╗Å th├¬m linh lß╗úi, hoß║ít b├ít, gi├║p s─⌐ tß╗¡ th├¬m vß╗»ng tin tr╞░ß╗¢c c├íc kß╗│ thi ─æß║ºy gian nan.',0.00,'https://booknest-books.s3.ap-southeast-2.amazonaws.com/covers/cbd38cbb-7115-4908-b0b3-7037f5eae5d4_book3.jpg','https://booknest-books.s3.ap-southeast-2.amazonaws.com/books/1e71b4ff-155c-4779-8cd7-04d6a4345083_book3.pdf',1,5,0,0.00,0,NULL,'2026-03-30 01:16:39','2026-03-30 01:16:39'),(4,'Thß╗▒c ─É╞ín Dinh D╞░ß╗íng Cho B├⌐ Tß╗½ 1 ─Éß║┐n 3 Tuß╗òi','Hß╗ông Yß║┐n','Vß╗ü n─âng l╞░ß╗úng, trß║╗ cß║ºn khoß║úng 100 -110kcal/kg c├ón nß║╖ng mß╗ùi ng├áy,─æ╞░ß╗úc cung cß║Ñp qua c├íc bß╗»a ─ân nh╞░ bß╗Öt, ch├ío, c╞ím n├ít, b├║n.. . Nß║Ñu vß╗¢i c├íc loß║íi thß╗⌐c ─ân cung cß║Ñp chß║Ñt ─æß║ím nh╞░: Thß╗ït, trß╗⌐ng, c├í, t├┤m.. . Ngo├ái ra, dß║ºu mß╗í trong bß╗»a ─ân c┼⌐ng l├á nguß╗ôn cung cß║Ñp n─âng l╞░ß╗úng quan trß╗ìng. Mß╗Öt ng├áy trß║╗ n├¬n ─ân 150 ΓÇô 200g gß║ío, nß║┐u ─æ├ú d├╣ng b├║n, mß╗│, phß╗ƒ, th├¼ r├║t bß╗¢t gß║ío ─æi',0.00,'https://booknest-books.s3.ap-southeast-2.amazonaws.com/covers/f943f548-6cd3-4261-8c88-e1d74561f918_book4.jpg','https://booknest-books.s3.ap-southeast-2.amazonaws.com/books/0afc4a6d-3754-4d6a-94be-b5ddb03aec55_book4.pdf',1,5,0,0.00,0,NULL,'2026-03-30 01:19:15','2026-03-30 01:19:15'),(5,'Nhß╗»ng M├│n C╞ím Ngon ─Éß║╖c Sß║»c','Tiß╗âu Quß╗│nh','Bß╗»a c╞ím gia ─æ├¼nh Viß╗çt Nam vß╗æn c├│ h├ám ngh─⌐a l├á sum vß║ºy, ─æß║ºm ß║Ñm, t╞░ß╗úng tr╞░ng cho ├╜ ngh─⌐a ─æß║╣p nhß║Ñt cß╗ºa mß╗Öt gia ─æ├¼nh hß║ính ph├║c. Ng├áy nay, c├╣ng vß╗¢i sß╗▒ ph├ít triß╗ân cß╗ºa ─æß║Ñt n╞░ß╗¢c, ch├║ng ta chß║│ng nhß╗»ng ─æ├ú c├│ nhß╗»ng bß╗»a c╞ím no m├á c├▓n c├│ nhß╗»ng bß╗»a c╞ím ngon vß╗¢i kß╗╣ thuß║¡t chß║┐ biß║┐n ─æß║╣p mß║»t h╞ín.',0.00,'https://booknest-books.s3.ap-southeast-2.amazonaws.com/covers/490287b0-e95b-418d-8c53-a0c03a8ce21a_book5.jpg','https://booknest-books.s3.ap-southeast-2.amazonaws.com/books/69647037-0852-4582-a0eb-6599214b5c37_book5.pdf',1,5,0,0.00,0,NULL,'2026-03-30 01:20:43','2026-03-30 01:20:43'),(6,'Nhß╗»ng M├│n ─én Chay Nß╗òi Tiß║┐ng','Thi├¬n Kim','Thß╗▒c ra, c├íc m├│n chay kh├┤ng chß╗ë ngon miß╗çng, cung cß║Ñp ─æß╗º chß║Ñt dinh d╞░ß╗íng m├á c├▓n dß╗à thß╗▒c hiß╗çn. ΓÇ£Nhß╗»ng m├│n ─ân chay nß╗òi tiß║┐ngΓÇ¥ l├á cß║⌐m nang ß║⌐m thß╗▒c chay ho├án hß║úo, n├│ hß║Ñp dß║½n ngay cß║ú nhß╗»ng ng╞░ß╗¥i ─ân mß║╖n ─æ├ú tß╗½ng cho rß║▒ng ─ân chay l├á thiß║┐u dinh d╞░ß╗íng. Cuß╗æn s├ích h╞░ß╗¢ng dß║½n bß║ín l├ám c├íc m├│n chay tß╗½ khai vß╗ï ─æß║┐n tr├íng miß╗çng. Bß║ín h├úy thß╗¡ chß╗ìn mß╗Öt thß╗▒c ─æ╞ín cho bß╗»a ─ân gia ─æ├¼nh m├á bß║ín ╞░a th├¡ch. Sß╗▒ ngß║íc nhi├¬n v├á ngon miß╗çng cß╗ºa mß╗ìi ng╞░ß╗¥i chß║»c chß║»n sß║╜ d├ánh cho bß║ín. Rß╗ôi bß║ín sß║╜ l├ám cho hß╗ì ΓÇ£ghiß╗ünΓÇ¥ ─ân chay bß╗ƒi t├ái chß║┐ biß║┐n cß╗ºa bß║ín qua c├íc m├│n chay nß╗òi tiß║┐ng n├áy! ',0.00,'https://booknest-books.s3.ap-southeast-2.amazonaws.com/covers/75c896e6-58d1-4bb8-a89d-c682853af2b5_book6.jpg','https://booknest-books.s3.ap-southeast-2.amazonaws.com/books/03cfab1f-2e23-4601-9ba3-f13479cef0ae_book6.pdf',1,5,0,0.00,0,NULL,'2026-03-30 01:22:06','2026-03-30 01:22:06'),(7,'Nhß╗»ng M├│n Ngon Viß╗çt Nam (Song Ngß╗» Trung ΓÇô Viß╗çt)','╞»ng ─É├┤ng D╞░╞íng','─Éß╗æi vß╗¢i ng╞░ß╗¥i Viß╗çt, bß╗»a ─ân kh├┤ng chß╗ë ─æß╗â no. Bß╗»a ─ân c├▓n l├á c╞í hß╗Öi sum hß╗ìp giß╗»a c├íc th├ánh vi├¬n trong gia ─æ├¼nh hay gß║╖p gß╗í bß║ín b├¿, ─æß╗ông nghiß╗çp trong bß║ºu kh├┤ng kh├¡ th├ón mß║¡t, ß║Ñm c├║ng. Nhß╗»ng n─âm gß║ºn ─æ├óy, kh├┤ng chß╗ë ß╗ƒ Viß╗çt Nam m├á nhiß╗üu n╞íi tr├¬n thß║┐ giß╗¢i ch├║ trß╗ìng ─æß║┐n bß╗»a ─ân gia ─æ├¼nh nhiß╗üu h╞ín, v├¼ ─ân uß╗æng kh├┤ng chß╗ë ─æem lß║íi cho ta sß╗⌐c khß╗Åe m├á th╞░ß╗ƒng thß╗⌐c m├│n ─ân c├▓n l├á niß╗üm vui. Nß║Ñu ─ân kh├┤ng chß╗ë l├á c├┤ng viß╗çc m├á c├▓n l├á mß╗Öt th├║ ti├¬u khiß╗ân. Trong nh├á bß║┐p cß╗ºa gia ─æ├¼nh Viß╗çt Nam th╞░ß╗¥ng c├│ sß║╡n nhiß╗üu loß║íi gia vß╗ï, c├íc loß║íi d╞░a chua, d╞░a kiß╗çu, trß╗⌐ng c┼⌐ng nh╞░ c├í kh├┤, t├┤m kh├┤ v├á nß║Ñm kh├┤ dß╗▒ trß╗» sß║╡n ─æß╗â tiß╗çn sß╗¡ dß╗Ñng.',40000.00,'https://booknest-books.s3.ap-southeast-2.amazonaws.com/covers/5ed59c9c-467c-4b28-a356-190494392617_book7.jpg','https://booknest-books.s3.ap-southeast-2.amazonaws.com/books/b8e700d3-d41b-454c-adcd-677f15419838_book7.pdf',1,5,0,0.00,0,NULL,'2026-03-30 01:24:19','2026-03-30 01:24:19'),(8,'Thß╗⌐c Uß╗æng V├á Thß║ích Tr├íi C├óy ─Éß║╖c Sß║»c','V┼⌐ V─ân L├ón','Thß║ích l├á mß╗Öt m├│n ─ân ngon, bß╗ò, m├ít rß║Ñt c├│ lß╗úi cho sß╗⌐c khß╗Åe. Tß╗½ x╞░a ─æß║┐n nay ta vß║½n th╞░ß╗¥ng d├╣ng loß║íi rau c├óu sß╗úi hoß║╖c rau c├óu bß╗Öt (agar) ─æß╗â l├ám nhß╗»ng m├│n thß║ích ─æ╞ín giß║ún nh╞░: thß║ích l├í dß╗⌐a n╞░ß╗¢c dß╗½a, thß║ích c├á ph├¬, rau c├óu v├ón thß╗ºy, rau c├óu trß╗⌐ng g├á.',80000.00,'https://booknest-books.s3.ap-southeast-2.amazonaws.com/covers/1a8ed579-3239-441d-aa75-4a6ee46524dc_book8.jpg','https://booknest-books.s3.ap-southeast-2.amazonaws.com/books/19538127-28d3-4b91-a951-7c8c3c3bca00_book8.pdf',1,5,0,0.00,0,NULL,'2026-03-30 01:26:44','2026-03-30 01:26:44'),(9,'V─ân H├│a ß║¿m Thß╗▒c Ninh B├¼nh','L├¬ Thanh Xu├ón','Ninh B├¼nh l├á mß╗Öt trong nhß╗»ng tß╗ënh nß║▒m ß╗ƒ v├╣ng duy├¬n hß║úi thuß╗Öc ch├óu thß╗ò s├┤ng Hß╗ông, c├│ nhß╗»ng n├⌐t ─æß║╖c th├╣ ri├¬ng cß╗ºa nß╗ün v─ân minh l├║a n╞░ß╗¢c, cß╗ºa v─ân ho├í s├┤ng Hß╗ông, trong ─æ├│ c├│ v─ân ho├í ß║⌐m thß╗▒c. V├á ß╗ƒ mß╗ùi v├╣ng miß╗ün tr├¬n dß║úi ─æß║Ñt n├áy lß║íi c├│ nhß╗»ng m├│n ─æß║╖c sß║ún ri├¬ng kh├┤ng chß╗ë hß╗úp khß║⌐u vß╗ï vß╗¢i ng╞░ß╗¥i d├ón sß╗ƒ tß║íi m├á c├▓n l├ám cho nhiß╗üu du kh├ích cß║ú trong n╞░ß╗¢c v├á Quß╗æc tß║┐ ─æß║┐n ─æ├óy th├¡ch th├║, say l├▓ng.',120000.00,'https://booknest-books.s3.ap-southeast-2.amazonaws.com/covers/4b4545d2-5326-40c0-accd-94a0d440f4b5_book9.jpg','https://booknest-books.s3.ap-southeast-2.amazonaws.com/books/92c38eab-a8b0-4e1b-82ad-5e3e5153107d_book9.pdf',1,5,0,0.00,0,NULL,'2026-03-30 08:02:25','2026-03-30 08:02:25'),(10,'Nghß╗ç Thuß║¡t Pha Chß║┐ 460 Loß║íi R╞░ß╗úu Cocktail','B├áng Cß║⌐m','H╞░ß╗¢ng dß║½n c├ích pha chß║┐ r╞░ß╗úu ΓÇô cocktail cho c├íc dß╗ïp kh├íc nhau nh╞░: ─æß╗ô uß╗æng tr╞░ß╗¢c bß╗»a tß╗æi; ─æß╗ô uß╗æng sau bß╗»a tß╗æi; ─æß╗ô uß╗æng ├¡t chß║Ñt bß╗ò; ─æß╗ô uß╗æng thß╗¥i tiß║┐t n├│ngΓÇªGiß╗¢i thiß╗çu tß╗º ─æß╗▒ng cocktail, c├íc loß║íi cockatil, cocktail tr├íi c├óy v├á cocktail kh├┤ng c├│ chß║Ñt r╞░ß╗úuΓÇª',120000.00,'https://booknest-books.s3.ap-southeast-2.amazonaws.com/covers/24792852-686c-4500-bff3-c14945aec4d7_book10.jpg','https://booknest-books.s3.ap-southeast-2.amazonaws.com/books/af44df93-9c2e-434e-8952-6d238becbf66_book10.pdf',1,5,0,0.00,0,NULL,'2026-03-30 08:03:34','2026-03-30 08:03:34'),(11,'Kß╗╣ Thuß║¡t Chß║┐ Biß║┐n C├íc M├│n Lß║⌐u V├á S├║p','Tiß╗âu Quß╗│nh','Trong cuß╗Öc sß╗æng hiß╗çn nay, m├│n lß║⌐u v├á m├│n s├║p ─æ├ú v├á ─æang l├á nhß╗»ng m├│n ─ân ngon, hß╗úp khß║⌐u vß╗ï, lß╗ïch sß╗▒ v├á rß║Ñt phß╗ò biß║┐n trong c├íc gia ─æ├¼nh ß╗ƒ n╞░ß╗¢c ta mß╗ùi khi tß╗ò chß╗⌐c li├¬n hoan hay c├íc dß╗ïp lß╗à tß║┐t',90000.00,'https://booknest-books.s3.ap-southeast-2.amazonaws.com/covers/af6e19df-dbd2-4b33-97ea-59d8fccdf347_book11.jpg','https://booknest-books.s3.ap-southeast-2.amazonaws.com/books/e60af291-d211-4294-a323-de0ce5da4263_book11.pdf',1,5,0,0.00,0,NULL,'2026-03-30 08:04:44','2026-03-30 08:04:44'),(12,'Kß╗╣ Thuß║¡t Chß║┐ Biß║┐n C├íc M├│n Lß║⌐u Xß╗æt S├║p','Nhß║¡t Nguy├¬n','M├│n lß║⌐u, m├│n xß╗æt, m├│n s├║p, (phß╗Ñ gia) ─æ├ú v├á ─æang l├á nhß╗»ng m├│n ─ân ngon, hß╗úp khß║⌐u vß╗ï, lß╗ïch sß╗▒ v├á rß║Ñt phß╗ò biß║┐n trong c├íc gia ─æ├¼nh Viß╗çt mß╗ùi khi tß╗ò chß╗⌐c li├¬n hoan hay c├íc dß╗ïp lß╗à tß║┐. Cuß╗æn s├ích ─æ╞░ß╗úc bi├¬n soß║ín vß╗¢i mß╗Ñc ─æ├¡ch gi├║p c├íc bß║ín nß╗Öi trß╗ú chß║┐ biß║┐n ─æ╞░ß╗úc c├íc m├│n lß║⌐u v├á s├║p, ngon, lß║í miß╗çng v├á hß║Ñp dß║½n:',30000.00,'https://booknest-books.s3.ap-southeast-2.amazonaws.com/covers/628d2267-fcd6-4c1b-92b4-abcb0f99e702_book12.jpg','https://booknest-books.s3.ap-southeast-2.amazonaws.com/books/a1434d44-f4d4-4b13-a637-3970abd49b25_book12.pdf',1,5,0,0.00,0,NULL,'2026-03-30 08:06:11','2026-03-30 08:06:11'),(13,'10 Huyß╗ün Thoß║íi Viking Hay Nhß║Ñt Mß╗ìi Thß╗¥i ─Éß║íi','Michael Cox','10 Huyß╗ün Thoß║íi Viking Hay Nhß║Ñt Mß╗ìi Thß╗¥i ─Éß║íi ─æ╞░ß╗úc tr├¼nh b├áy d╞░ß╗¢i nhiß╗üu h├¼nh thß╗⌐c kh├íc nhau. Sau mß╗ùi huyß╗ün thoß║íi lß║íi c├│ nhß╗»ng dß╗» liß╗çu kß╗│ th├║ li├¬n quan ─æß║┐n chß╗º ─æß╗ü.',0.00,'https://booknest-books.s3.ap-southeast-2.amazonaws.com/covers/673fae91-8f5f-45cc-971e-91629a92b71e_book13.jpg','https://booknest-books.s3.ap-southeast-2.amazonaws.com/books/3bc85357-d82f-42e9-b5a3-c81c03088c6e_book13.pdf',1,5,0,0.00,0,NULL,'2026-03-30 08:08:11','2026-03-30 08:08:11'),(14,'10 Huyß╗ün Thoß║íi Hy Lß║íp Hay Nhß║Ñt Mß╗ìi Thß╗¥i ─Éß║íi','Terry Deary','10 Huyß╗ün Thoß║íi Hy Lß║íp Hay Nhß║Ñt Mß╗ìi Thß╗¥i ─Éß║íi ─æ╞░ß╗úc tr├¼nh b├áy d╞░ß╗¢i nhiß╗üu h├¼nh thß╗⌐c kh├íc nhau. Sau mß╗ùi huyß╗ün thoß║íi lß║íi c├│ nhß╗»ng dß╗» liß╗çu kß╗│ th├║ li├¬n quan ─æß║┐n chß╗º ─æß╗ü.',0.00,'https://booknest-books.s3.ap-southeast-2.amazonaws.com/covers/85f0d595-7b74-4b64-85ec-710a0e69ef13_book14.jpg','https://booknest-books.s3.ap-southeast-2.amazonaws.com/books/0f4483c3-dabb-4643-b463-faa4c7364ee1_book14.pdf',1,5,0,0.00,0,NULL,'2026-03-30 08:09:40','2026-03-30 08:09:40'),(15,'Truyß╗çn Kß╗â T├óy Tß║íng','L╞░u Hß╗ông H├á','Truyß╗çn kß╗â T├óy Tß║íng l├á tuyß╗ân tß║¡p gß╗ôm 39 truyß╗çn d├ón gian T├óy Tß║íng ─æ╞░ß╗úc l╞░u truyß╗ün h├áng ng├án n─âm trong k├╜ ß╗⌐c d├ón gian. Mß╗ùi c├óu chuyß╗çn l├á mß╗Öt huyß╗ün thoß║íi ─æß║╣p, mß╗Öt sß╗▒ t├¡ch hay mß╗Öt ngß╗Ñ ng├┤n vß╗ü nhß╗»ng th├│i tß║¡t cß╗ºa con ng╞░ß╗¥iΓÇª nh╞░ng cuß╗æi c├╣ng, ─æiß╗üu ─æß╗ìng lß║íi trong l├▓ng ng╞░ß╗¥i ─æß╗ìc l├á kh├ít vß╗ìng h╞░ß╗¢ng thiß╗çn v├á bß║ún sß║»c T├óy Tß║íng ─æß║¡m n├⌐t trong mß╗ùi truyß╗çn kß╗â.',0.00,'https://booknest-books.s3.ap-southeast-2.amazonaws.com/covers/6a325985-b211-4fa3-aada-097ec33ea2f9_book15.jpg','https://booknest-books.s3.ap-southeast-2.amazonaws.com/books/bd92bf7c-ba2c-4fc1-9d85-4b766ab0e12b_book13.pdf',1,5,0,0.00,0,NULL,'2026-03-30 08:10:59','2026-03-30 08:10:59'),(16,'365 Chuyß╗çn Kß╗â H├áng ─É├¬m ΓÇô M├╣a Thu','Lep T├┤nxtoi','Tr╞░ß╗¢c giß╗¥ ─æi ngß╗º, cß║ú gia ─æ├¼nh qu├óy quß║ºn b├¬n nhau c├╣ng ─æß╗ìc mß╗Öt v├ái c├óu chuyß╗çn ─æß╗â kh╞íi l├¬n sß╗⌐c sß╗æng m╞ín mß╗ƒn cß╗ºa m├╣a xu├ón, th╞░ß╗ƒng l├úm kh├┤ng gian kho├íng ─æß║ít cß╗ºa m├╣a h├¿, thß║ú hß╗ôn m╞í mß╗Öng c├╣ng sß║»c thu hay cß║úm ─æß╗Öng c├╣ng d╞░ vß╗ï ß║Ñm ├íp giß╗»a m├╣a ─æ├┤ngΓÇª kh├┤ng chß╗ë tß║ío bß║ºu kh├┤ng kh├¡ gia ─æ├¼nh hß║ính ph├║c m├á c├▓n l├á h├ánh trang sß╗æng theo b├⌐ ─æi suß╗æt cuß╗Öc ─æß╗¥i.',30000.00,'https://booknest-books.s3.ap-southeast-2.amazonaws.com/covers/f1dfba12-1653-40bf-bd54-fe51a8bc3655_book16.jpg','https://booknest-books.s3.ap-southeast-2.amazonaws.com/books/96f25dea-8546-448b-bcfd-25d61c87cfe1_book16.pdf',1,5,0,0.00,0,NULL,'2026-03-30 08:12:19','2026-03-30 08:12:19'),(17,'Buratino V├á Chiß║┐c Ch├¼a Kho├í V├áng','Hermann Hesse','B├íc thß╗ú mß╗Öc Giud├⌐pp╞í t├¼nh cß╗¥ nhß║╖t ─æ╞░ß╗úc mß╗Öt thanh cß╗ºi biß║┐t n├│i, b├íc liß╗ün tß║╖ng thanh cß╗ºi ─æ├│ cho ├┤ng bß║ín gi├á C├ícl├┤. B├íc C├ícl├┤ ─æem m├│n qu├á kß╗│ lß║í vß╗ü nh├á v├á gß╗ìt th├ánh mß╗Öt con b├║p b├¬ gß╗ù ─æß║╖t t├¬n l├á Buratin├┤. Mß╗Öt con b├║p b├¬ tr├┤ng giß╗æng hß╗çt mß╗Öt cß║¡u b├⌐ vß╗¢i c├íi m┼⌐i thß║¡t d├ái. Buratin├┤ trong s├íng, th├┤ng minh nh╞░ng rß║Ñt hiß║┐u ─æß╗Öng v├á nghß╗ïch ngß╗úm. C┼⌐ng ch├¡nh v├¼ t├¡nh hiß║┐u ─æß╗Öng ─æ├│ m├á cß║¡u b├⌐ ─æ├ú g├óy n├¬n cho m├¼nh kh├┤ng ├¡t rß║»c rß╗æi. Trong mß╗Öt lß║ºn trß╗æn hß╗ìc ─æi ch╞íi, Buratino bß╗ï M├¿o Madilio v├á C├ío Alixa lß╗½a lß║Ñy mß║Ñt tiß╗ün v├á bß╗ï bß╗ìn c╞░ß╗¢p tß║Ñn c├┤ng. Lß║íc mß║Ñt gia ─æ├¼nh, cß║¡u b├⌐ ng╞░ß╗¥i gß╗ù bß║»t ─æß║ºu b╞░ß╗¢c v├áo nhß╗»ng chuyß║┐n phi├¬u l╞░u ─æß║ºy kß╗│ th├║, bß║Ñt ngß╗¥ nh╞░ng c┼⌐ng kh├┤ng ├¡t nguy hiß╗âm v├á s├│ng gi├│. ─Éß║╖c biß╗çt l├á cuß╗Öc h├ánh tr├¼nh kh├ím b├¡ mß║¡t vß╗ü chiß║┐c ch├¼a kh├│a v├áng m├á Buratino ─æ╞░ß╗úc ch├║ r├╣a To├│ctila tß║╖ng choΓÇª',200000.00,'https://booknest-books.s3.ap-southeast-2.amazonaws.com/covers/51a65dd1-5b35-46bd-b548-932ddb14d83a_book17.jpg','https://booknest-books.s3.ap-southeast-2.amazonaws.com/books/2c0e6e32-a5a5-4f21-9824-6f346edc03b1_book17.pdf',1,5,0,0.00,0,NULL,'2026-03-30 08:13:25','2026-03-30 08:13:25'),(18,'Huß╗ç T├¡m V├á Nhß╗»ng Chuyß╗çn Kh├íc','Terry Deary','Nhß╗»ng c├óu chuyß╗çn cß╗ò t├¡ch kh├┤ng c├│ h├¼nh ß║únh ho├áng tß╗¡, c├┤ng ch├║a, kh├┤ng kß╗â theo lß╗æi b├¼nh d├ón m├á ─æ╞░ß╗úc ─æß║⌐y l├¬n th├ánh nghß╗ç thuß║¡t.',130000.00,'https://booknest-books.s3.ap-southeast-2.amazonaws.com/covers/bd177ad7-7693-455f-a7ef-96dc2ce5be20_book18.jpg','https://booknest-books.s3.ap-southeast-2.amazonaws.com/books/594a4dce-2fc0-4aae-927c-390bd630dd8c_book18.pdf',1,5,0,0.00,0,NULL,'2026-03-30 08:15:12','2026-03-30 08:15:12'),(19,'108 Truyß╗çn Ngß╗Ñ Ng├┤n Hay Nhß║Ñt','Terry Deary','Ngß╗Ñ ng├┤n l├á nhß╗»ng truyß╗çn ngß║»n th╞░ß╗¥ng m╞░ß╗ún chuyß╗çn lo├ái vß║¡t ─æß╗â n├│i vß╗ü viß╗çc ─æß╗¥i nhß║▒m dß║½n ─æß║┐n nhß╗»ng ─æß║ío l├╜, kinh nghiß╗çm sß╗æng. 108 truyß╗çn ngß╗Ñ ng├┤n l├á 108 c├óu chuyß╗çn chß╗º yß║┐u cß╗ºa c├íc con vß║¡t: R├╣a hß╗ìc bay, Ngß╗▒a v├á Lß╗½a, Ch├│ nh├á v├á S├│i, Muß╗ùi v├á S╞░ tß╗¡ΓÇª v├á rß║Ñt nhiß╗üu chuyß╗çn ngß╗Ñ ng├┤n kh├íc. Mß╗ùi c├óu chuyß╗çn ─æ├│ l├á mß╗ùi mß╗Öt b├ái hß╗ìc cho ─æß║┐n giß╗¥ vß║½n c├▓n nguy├¬n gi├í trß╗ï. Vß║¡y nhß╗»ng c├óu chuyß╗çn vß╗ü c├íc con vß║¡t ─æ├│ dß║íy ch├║ng ta ─æiß╗üu g├¼?',40000.00,'https://booknest-books.s3.ap-southeast-2.amazonaws.com/covers/4b233cc4-6d80-447f-97f5-5e7ab1fb64f2_book12.jpg','https://booknest-books.s3.ap-southeast-2.amazonaws.com/books/2b027b83-11b5-48b0-a7a6-e02e696e1aac_book19.pdf',1,5,0,0.00,0,NULL,'2026-03-30 08:16:36','2026-03-30 08:16:36'),(20,'100 Mß║⌐u Chuyß╗çn Cß╗ò ─É├┤ng T├óy','Lep T├┤nxtoi','100 mß║⌐u chuyß╗çn cß╗ò ─É├┤ng T├óy kß╗â vß╗ü nhß╗»ng mß║½u ng╞░ß╗¥i ti├¬u biß╗âu trong cß╗ò sß╗¡ cß╗ºa Hi Lß║íp, La M├ú v├á Trung Quß╗æc, nhß╗»ng c├íi n├┤i cß╗ºa v─ân minh nh├ón loß║íi. Nhß╗»ng g╞░╞íng s├íng ─æ├│ sß║╜ gi├║p cho mß╗ùi ng╞░ß╗¥i khi soi v├áo c├│ thß╗â hoß║╖c tu tß╗ënh, hoß║╖c cß╗æ v╞░╞ín l├¬n nhß╗»ng ─æß╗ënh cao cß╗ºa ─æß║ío l├ám ng╞░ß╗¥i.',30000.00,'https://booknest-books.s3.ap-southeast-2.amazonaws.com/covers/0d3a3ba5-ab63-4b3a-b481-0481ad011f97_book20.jpg','https://booknest-books.s3.ap-southeast-2.amazonaws.com/books/e10642a1-6ae0-4b5c-a8a2-b16442eaca88_book20.pdf',1,5,0,0.00,0,NULL,'2026-03-30 08:17:47','2026-03-30 08:17:47'),(21,'C├┤ng Nghß╗ç Blockchain','V┼⌐ Hß╗»u Tiß╗çp','Blockchain l├á chß╗º ─æß╗ü ─æang v├┤ c├╣ng n├│ng tr├¬n to├án cß║ºu hiß╗çn nay. N├│ c├╣ng vß╗¢i Bitcoin v├á tiß╗ün kß╗╣ thuß║¡t sß╗æ trß╗ƒ th├ánh ─æß╗ü t├ái b├án luß║¡n tr├¬n rß║Ñt nhiß╗üu mß║╖t b├ío v├á trong nhß╗»ng cuß╗Öc tr├▓ chuyß╗çn cß╗ºa mß╗ìi ng╞░ß╗¥i. Tuy nhi├¬n, khi n├│i vß╗ü blockchain vß║½n c├▓n nhiß╗üu tranh c├úi. C├│ ng╞░ß╗¥i lo lß║»ng rß║▒ng Bitcoin c├│ thß╗â chß╗ë l├á bong b├│ng, nhiß╗üu ng╞░ß╗¥i cho rß║▒ng c├┤ng nghß╗ç ph├¡a sau n├│ l├á mß╗Öt sß╗▒ ─æß╗Öt ph├í, v├á c├┤ng nghß╗ç ß║Ñy sß║╜ tiß║┐p tß╗Ñc con ─æ╞░ß╗¥ng cß╗ºa m├¼nh cho ─æß║┐n khi ─æ╞░ß╗úc chß║Ñp nhß║¡n v├á t├¡ch hß╗úp vß╗¢i Internet.',0.00,'https://booknest-books.s3.ap-southeast-2.amazonaws.com/covers/e87bf161-d28b-4344-80a6-e706b4078b77_book21.jpg','https://booknest-books.s3.ap-southeast-2.amazonaws.com/books/c2e9af95-3133-41a0-8ee4-9748145578e8_book21.pdf',1,5,0,0.00,0,NULL,'2026-03-30 13:08:41','2026-03-30 13:08:41'),(22,'Machine Learning C╞í Bß║ún','Olga Filipova','Nhß╗»ng n─âm gß║ºn ─æ├óy, AI ΓÇô Artificial Intelligence (Tr├¡ Tuß╗ç Nh├ón Tß║ío), v├á cß╗Ñ thß╗â h╞ín l├á Machine Learning (Hß╗ìc M├íy hoß║╖c M├íy Hß╗ìc) nß╗òi l├¬n nh╞░ mß╗Öt bß║▒ng chß╗⌐ng cß╗ºa cuß╗Öc c├ích mß║íng c├┤ng nghiß╗çp lß║ºn thß╗⌐ t╞░ (1 ΓÇô ─æß╗Öng c╞í h╞íi n╞░ß╗¢c, 2 ΓÇô n─âng l╞░ß╗úng ─æiß╗çn, 3 ΓÇô c├┤ng nghß╗ç th├┤ng tin). Tr├¡ Tuß╗ç Nh├ón Tß║ío ─æang len lß╗Åi v├áo mß╗ìi l─⌐nh vß╗▒c trong ─æß╗¥i sß╗æng m├á c├│ thß╗â ch├║ng ta kh├┤ng nhß║¡n ra. Xe tß╗▒ h├ánh cß╗ºa Google v├á Tesla, hß╗ç thß╗æng tß╗▒ tag khu├┤n mß║╖t trong ß║únh cß╗ºa Facebook, trß╗ú l├╜ ß║úo Siri cß╗ºa Apple, hß╗ç thß╗æng gß╗úi ├╜ sß║ún phß║⌐m cß╗ºa Amazon, hß╗ç thß╗æng gß╗úi ├╜ phim cß╗ºa Netflix, m├íy ch╞íi cß╗¥ v├óy AlphaGo cß╗ºa Google DeepMind, ΓÇª, chß╗ë l├á mß╗Öt v├ái trong v├┤ v├án nhß╗»ng ß╗⌐ng dß╗Ñng cß╗ºa AI/Machine Learning.',0.00,'https://booknest-books.s3.ap-southeast-2.amazonaws.com/covers/b048aefb-8e10-4c33-9449-b02efc07a53b_book22.jpg','https://booknest-books.s3.ap-southeast-2.amazonaws.com/books/a3ddc12e-1cda-4355-ace8-b5b4d770a33e_book22.pdf',1,5,0,0.00,0,NULL,'2026-03-30 13:09:41','2026-03-30 13:09:41'),(23,'Learning Vue.js 2','Nathan Wu','Olga Filipova l├á mß╗Öt lß║¡p tr├¼nh vi├¬n c├│ kinh nghiß╗çm trong ph├ít triß╗ân fontend, ch├¡nh v├¼ vß║¡y c├íc nß╗Öi dung ─æ╞░ß╗úc viß║┐t ra trong Learning Vue.js 2 l├á rß║Ñt s├ít vß╗¢i thß╗▒c tß║┐. Bß║ún th├ón Olga Filipova c┼⌐ng ─æang quß║ún l├╜ mß╗Öt dß╗▒ ├ín vß╗ü hß╗ìc trß╗▒c tuyß║┐n, do vß║¡y c├íc phß║ºn trong s├ích ─æ╞░ß╗úc kiß║┐n tr├║c c├│ t├¡nh s╞░ phß║ím cao. Vß╗¢i mß╗ùi vß║Ñn ─æß╗ü ─æß╗üu c├│ phß║ºn dß║½n dß║»t v├á c├íc v├¡ dß╗Ñ thß╗▒c h├ánh gi├║p cho viß╗çc nß║»m bß║»t c├íc kiß║┐n thß╗⌐c framework Vue.js 2 trß╗ƒ l├¬n dß╗à d├áng.',0.00,'https://booknest-books.s3.ap-southeast-2.amazonaws.com/covers/7494df7d-a4cb-4f55-8b1a-c4ae7ddbc754_book23.jpg','https://booknest-books.s3.ap-southeast-2.amazonaws.com/books/8fb4781d-c2a6-4fd6-a5ca-5f27c8fcc807_book23.pdf',1,5,0,0.00,0,NULL,'2026-03-30 13:11:07','2026-03-30 13:11:07'),(24,'Laravel 5 Cookbook Enhance Your Amazing Applications','Adam Freeman','Learning Laravel 5: Building Practical Applications is the easiest way to learn web development using Laravel. Throughout 5 chapters, instructor Nathan Wu will teach you how to build many real-world applications from scratch. This bestseller is also completely about you. It has been structured very carefully, teaching you all you need to know from installing your Laravel 5.1 app to deploying it to a live server.',0.00,'https://booknest-books.s3.ap-southeast-2.amazonaws.com/covers/ffbbf37a-1f17-4e35-9ec7-89e84db14394_book24.jpg','https://booknest-books.s3.ap-southeast-2.amazonaws.com/books/3feca6ec-e7b8-4fa3-8a3e-c88db7280bf7_book24.pdf',1,5,0,0.00,0,NULL,'2026-03-30 13:12:13','2026-03-30 13:12:13'),(25,'Pro ASP.NET MVC 5','Emmett Dulaney','The ASP.NET MVC 5 Framework is the latest evolution of MicrosoftΓÇÖs ASP.NET web platform. It provides a high-productivity programming model that promotes cleaner code architecture, test-driven development, and powerful extensibility, combined with all the benefits of ASP.NET.',0.00,'https://booknest-books.s3.ap-southeast-2.amazonaws.com/covers/d5adb12d-0009-473d-a97e-0d39a3233276_book25.jpg','https://booknest-books.s3.ap-southeast-2.amazonaws.com/books/8119a866-6a51-486f-bbe1-6c650bb6741a_book25.pdf',1,5,0,0.00,0,NULL,'2026-03-30 13:13:27','2026-03-30 13:13:27'),(26,'Programming ASP.NET MVC 4','V┼⌐ Hß╗»u Tiß╗çp','Get up and running with ASP.NET MVC 4, and learn how to build modern server-side web applications. This guide helps you understand how the framework performs, and shows you how to use various features to solve many real-world development scenarios youΓÇÖre likely to face. In the process, youΓÇÖll learn how to work with HTML, JavaScript, the Entity Framework, and other web technologies.',0.00,'https://booknest-books.s3.ap-southeast-2.amazonaws.com/covers/b8736870-d364-4882-a655-5ad24418a3a8_book26.jpg','https://booknest-books.s3.ap-southeast-2.amazonaws.com/books/d0ae13d5-9f55-4bff-99f9-b52780314b35_book26.pdf',1,5,0,0.00,0,NULL,'2026-03-30 13:14:28','2026-03-30 13:14:28'),(27,'Linux All-In-One For Dummies ΓÇô 5Th Edition','Olga Filipova','Linux All-in-One For Dummies giß║úi th├¡ch mß╗ìi thß╗⌐ bß║ín cß║ºn ─æß╗â bß║»t ─æß║ºu v├á chß║íy vß╗¢i hß╗ç ─æiß╗üu h├ánh Linux phß╗ò biß║┐n. ─É╞░ß╗úc viß║┐t trong phong c├ích th├ón thiß╗çn v├á dß╗à tiß║┐p cß║¡n, cuß╗æn s├ích l├╜ t╞░ß╗ƒng cho ng╞░ß╗¥i mß╗¢i d├╣ng Linux v├á ng╞░ß╗¥i ─æ├ú c├│ mß╗Öt ├¡t kinh nghiß╗çm vß╗¢i hß╗ç ─æiß╗üu h├ánh n├áy, c┼⌐ng nh╞░ bß║Ñt kß╗│ ai ─æang hß╗ìc chß╗⌐ng chß╗ë Linux cß║Ñp ─æß╗Ö 1. Bß╗æn phß║ºn b├¬n trong s├ích bao gß╗ôm c├íc vß║Ñn ─æß╗ü c╞í bß║ún cß╗ºa Linux, l├ám sao ─æß╗â t╞░╞íng t├íc vß╗¢i n├│, c├íc vß║Ñn ─æß╗ü vß╗ü mß║íng, dß╗ïch vß╗Ñ Internet, quß║ún trß╗ï, bß║úo mß║¡t, kß╗ïch bß║ún scripting v├á chß╗⌐ng chß╗ë cß║Ñp 1.',100000.00,'https://booknest-books.s3.ap-southeast-2.amazonaws.com/covers/d8ea2c71-8ac9-4f79-af4c-69567b7d0d50_book27.jpg','https://booknest-books.s3.ap-southeast-2.amazonaws.com/books/815505d4-ee76-4ea3-aed0-1551bfc26d09_book27.pdf',1,5,0,0.00,0,NULL,'2026-03-30 13:15:28','2026-03-30 13:15:28'),(28,'Giß║úi Thuß║¡t V├á Lß║¡p Tr├¼nh','Nathan Wu','Nß║┐u bß║ín l├á ng╞░ß╗¥i ─æam m├¬ tin hß╗ìc, nß║┐u bß║ín l├á ng╞░ß╗¥i muß╗æn kh├ím ph├í vß╗ü lß║¡p tr├¼nh, hß║│n bß║ín phß║úi biß║┐t ─æß║┐n mß╗Öt cuß╗æn s├ích tin hß╗ìc rß║Ñt nß╗òi tiß║┐ng ß╗ƒ Viß╗çt Nam trong nhiß╗üu n─âm trß╗ƒ lß║íi ─æ├óy. Tß╗½ nhß╗»ng hß╗ìc sinh kh├┤ng chuy├¬n ─æß║┐n nhß╗»ng th├ánh vi├¬n ─æß╗Öi tuyß╗ân thi quß╗æc tß║┐ tin hß╗ìc, c├│ lß║╜ kh├┤ng mß╗Öt ai ch╞░a tß╗½ng hß╗ìc qua cuß╗æn s├ích ─æ╞░ß╗úc bi├¬n soß║ín bß╗ƒi mß╗Öt thß║ºy gi├ío trß║╗ nhß╗»ng ─æß║ºy t├ái n─âng cß╗ºa tr╞░ß╗¥ng ─Éß║íi hß╗ìc S╞░ phß║ím H├á Nß╗Öi, thß║ºy L├¬ Minh Ho├áng.',120000.00,'https://booknest-books.s3.ap-southeast-2.amazonaws.com/covers/6f0c41be-2e5a-4c9c-bfed-869bd9b5fe7a_book28.jpg','https://booknest-books.s3.ap-southeast-2.amazonaws.com/books/5291eba2-df6d-4b45-8b9d-de34e33854b5_book28.pdf',1,5,0,0.00,0,NULL,'2026-03-30 13:16:27','2026-03-30 13:16:27'),(29,'Beginning Programming With Java For Dummies ΓÇô 4Th Edition','Adam Freeman','Beginning Programming with Java For Dummies, 4th Edition is a comprehensive guide to learning one of the most popular programming languages worldwide. This book covers basic development concepts and techniques through a Java lens. Youll learn what goes into a program, how to put the pieces together, how to deal with challenges, and how to make it work. The new Fourth Edition has been updated to align with Java 8, and includes new options for the latest tools and techniques.',70000.00,'https://booknest-books.s3.ap-southeast-2.amazonaws.com/covers/0cd11bf7-1fcc-4898-bdca-4a50569a9df7_book29.jpg','https://booknest-books.s3.ap-southeast-2.amazonaws.com/books/5a1590aa-a386-424f-9084-c6a2ceafe988_book29.pdf',1,5,0,0.00,0,NULL,'2026-03-30 13:17:21','2026-03-30 13:17:21'),(30,'Php, Mysql, Javascript & Html5 All-In-One For Dummies','Emmett Dulaney','PHP, JavaScript, and HTML5 are essential programming languages for creating dynamic websites that work with the MySQL database. PHP and MySQL provide a robust, easy-to-learn, open-source solution for creating superb e-commerce sites and content management. JavaScript and HTML5 add support for the most current multimedia effects. This one-stop guide gives you what you need to know about all four! Seven self-contained minibooks cover web technologies, HTML5 and CSS3, PHP programming, MySQL databases, JavaScript, PHP with templates, and web applications.',90000.00,'https://booknest-books.s3.ap-southeast-2.amazonaws.com/covers/fed02fcb-5986-4ce0-bccd-964487432ce1_book30.jpg','https://booknest-books.s3.ap-southeast-2.amazonaws.com/books/e386ce36-9145-432b-9b0c-f6c3752e6573_book30.pdf',1,5,0,0.00,0,NULL,'2026-03-30 13:18:25','2026-03-30 13:18:25'),(31,'Tß║íi sao ILA l├á lß╗▒a chß╗ìn Tß╗ÉT NHß║ñT cho T╞»╞áNG LAI cß╗ºa con Bß║áN?','Nguyß╗àn Thß╗ï H├á Bß║»c','Bß║ín ─æang t├¼m kiß║┐m mß╗Öt trung t├óm ngoß║íi ngß╗» ─æß║│ng cß║Ñp quß╗æc tß║┐ ─æß╗â con bß║ín ph├ít triß╗ân to├án diß╗çn kß╗╣ n─âng tiß║┐ng Anh? ILA ch├¡nh l├á n╞íi biß║┐n ╞░ß╗¢c m╞í th├ánh hiß╗çn thß╗▒c! Vß╗¢i h╞ín 20 n─âm kinh nghiß╗çm, ILA tß╗▒ h├áo l├á trung t├óm ─æ├áo tß║ío tiß║┐ng Anh h├áng ─æß║ºu tß║íi Viß╗çt Nam, n╞íi h├áng triß╗çu hß╗ìc vi├¬n ─æ├ú ─æß║ít ─æ╞░ß╗úc th├ánh c├┤ng v╞░ß╗út mong ─æß╗úi.',0.00,'https://booknest-books.s3.ap-southeast-2.amazonaws.com/covers/2be2429c-c8fb-430f-88c1-5fdf829091c0_book31.jpg','https://booknest-books.s3.ap-southeast-2.amazonaws.com/books/051dd7c2-314c-4d6a-8ab6-7326c392f3ca_book31.pdf',1,5,0,0.00,0,NULL,'2026-03-30 13:19:42','2026-03-30 13:19:42'),(32,'Tß╗▒ Hß╗ìc Tiß║┐ng Anh Hiß╗çu Quß║ú','Bß╗Ö gi├ío dß╗Ñc v├á ─æ├áo tß║ío','Nß║┐u  nh╞░ bß║ín  mong  muß╗æn  giao  tiß║┐p  tiß║┐ng  Anh  th├ánh  thß║ío,  chuy├¬n nghiß╗çp tß╗½ 3 tß╗¢i 6 th├íng th├¼ cuß╗æn s├ích n├áy sß║╜ l├ám bß║ín thß║Ñt vß╗ìng. Thß╗▒c tß║┐ cho thß║Ñy ch╞░a c├│ ai mß╗¢i bß║»t ─æß║ºu hß╗ìc tiß║┐ng  Anh c├│ thß╗â giao tiß║┐p ─æ╞░ß╗úc tr├┤i chß║úy trong thß╗¥i gian tß╗½ 3 ΓÇô 6 th├íng. ─É├│ l├á ß║úo t╞░ß╗ƒng. Nh╞░ng nß║┐u nh╞░ bß║ín ─æang t├¼m kiß║┐m l├ám nh╞░ thß║┐ n├áo c├│ thß╗â sß╗¡ dß╗Ñng tiß║┐ng Anh giao tiß║┐p th├ánh thß║ío, chuy├¬n nghiß╗çp trong 1 n─âm tß╗¢i th├¼ xin ch├║c mß╗½ng  bß║ín.  T├┤i tin rß║▒ng  nhß╗»ng  b├¡  mß║¡t  ─æ╞░ß╗úc tiß║┐t  lß╗Ö  trong  cuß╗æn s├ích n├áy sß║╜ l├ám bß║ín thß╗Åa m├ún vß╗¢i ─æiß╗üu ─æ├│. ',0.00,'https://booknest-books.s3.ap-southeast-2.amazonaws.com/covers/7b0bacc3-7f49-4424-9371-4a1dd50207c5_book32.jpg','https://booknest-books.s3.ap-southeast-2.amazonaws.com/books/737a70ac-f499-40a5-90fa-74b6ab804c68_book32.pdf',1,5,0,0.00,0,NULL,'2026-03-30 13:20:48','2026-03-30 13:20:48'),(33,'3000 Tß╗½ Vß╗▒ng Tiß║┐ng Anh Th├┤ng Dß╗Ñng Nhß║Ñt','Jung min kyung','Tß╗½ vß╗▒ng ─æ├│ng mß╗Öt vai tr├▓ ─æß║╖c biß╗çt quan trß╗ìng, nhß║Ñt l├á trong giao tiß║┐p. Nhß║▒m ─æ├íp ß╗⌐ng nhu cß║ºu ─æ├│ ch├║ng t├┤i xin giß╗¢i thiß╗çu vß╗¢i bß║ín ─æß╗ìc cuß╗æn 3000 Tß╗½ vß╗▒ng Tiß║┐ng Anh th├┤ng dß╗Ñng nhß║Ñt. Cuß╗æn s├ích bao gß╗ôm 3000 tß╗½ vß╗▒ng c─ân bß║ún v├á th├┤ng dß╗Ñng nhß║Ñt nhß║▒m gi├║p c├íc bß║ín n├óng cao vß╗æn tß╗½ vß╗▒ng cß╗ºa m├¼nh.',0.00,'https://booknest-books.s3.ap-southeast-2.amazonaws.com/covers/4e7dc299-a41f-4451-9a79-6475faf7bb26_book33.jpg','https://booknest-books.s3.ap-southeast-2.amazonaws.com/books/386ad4e3-88b9-4275-ad4c-22c9600945f4_book33.pdf',1,5,0,0.00,0,NULL,'2026-03-30 13:21:43','2026-03-30 13:21:43'),(34,'360 ─Éß╗Öng Tß╗½ Bß║Ñt Quy Tß║»c V├á 12 Th├¼ C╞í Bß║ún Trong Tiß║┐ng Anh','NXB Tß╗½ ─æiß╗ân b├ích khoa','Cuß╗æn s├ích n├áy nh╞░ mß╗Öt ng╞░ß╗¥i bß║ín lu├┤n nhß║»c nhß╗ƒ bß║ín d├╣ng ch├¡nh x├íc c├íc dß║íng nguy├¬n thß╗â, qu├í khß╗⌐ v├á ph├ón tß╗½ cß╗ºa ─æß╗Öng tß╗½. Mß╗ùi ─æß╗Öng tß╗½ ch├║ng t├┤i c├│ ─æ╞░a ra v├¡ dß╗Ñ ─æß╗â bß║ín c├│ thß╗â hiß╗âu ─æ╞░╞íc c├ích d├╣ng cß╗ºa ─æß╗Öng tß╗½ ─æ├│.─æß╗â nhß╗¢ v├á d├╣ng c├íc ─æß╗Öng tß╗½ bß║Ñt quy tß║»c n├áy mß╗Öt c├ích tß╗æt nhß║Ñt c├íc bß║ín l├¬n hß╗ìc thuß╗Öc c├íc v├¡ dß╗Ñ, tß╗½ ─æ├│ c├íc bß║ín sß║╜ nhß╗¢ ─æ╞░ß╗úc t├¼nh huß╗æng v├á vß║¡n dß╗Ñng c├íc ─æß╗Öng tß╗½ n├áy mß╗Öt c├ích hiß╗çu quß║ú nhß║Ñt',0.00,'https://booknest-books.s3.ap-southeast-2.amazonaws.com/covers/701e6715-5724-4462-aa90-1644208adfef_book34.jpg','https://booknest-books.s3.ap-southeast-2.amazonaws.com/books/1f96c335-c8f6-4f02-b9fd-f34a5d8b624e_book34.pdf',1,5,0,0.00,0,NULL,'2026-03-30 13:22:35','2026-03-30 13:22:35'),(35,'Ngß╗» Ph├íp Tiß║┐ng Anh ├ön Thi Toeic','Gabriel Wyner','─É├óy l├á ΓÇ£Hß╗ç thß╗æng ngß╗» ph├ípΓÇ¥ chuß║⌐n cß╗ºa Bß╗Ö gi├ío dß╗Ñc ban h├áng trong loß║ít hß╗ç thß╗æng kiß║┐n thß╗⌐c trß╗ìng t├óm hß╗ìc ├┤n Toeic hiß╗çu quß║ú. ─É├║ng nh╞░ t├¬n gß╗ìi, mß╗Ñc lß╗¢n n├áy nhß║▒m gi├║p ng╞░ß╗¥i hß╗ìc biß║┐t, nß║»m bß║»t v├á hiß╗âu mß╗Öt c├ích c├│ hß╗ç thß╗æng c├íc chuy├¬n ─æß╗ü ngß╗» ph├íp ch├¡nh cß║ºn c├│ ─æß╗â ho├án th├ánh tß╗æt b├ái thi Toeic mß╗¢i vß╗¢i 2 phß║ºn ch├¡nh l├á Nghe v├á ─Éß╗ìc.',0.00,'https://booknest-books.s3.ap-southeast-2.amazonaws.com/covers/b0090f98-0b18-4ecd-9e93-a899d498e2d5_book35.jpg','https://booknest-books.s3.ap-southeast-2.amazonaws.com/books/86d7d2c8-38b2-40e1-8a27-91735b82c243_book35.pdf',1,5,0,0.00,0,NULL,'2026-03-30 13:23:21','2026-03-30 13:23:21'),(36,'384 T├¼nh Huß╗æng Thß╗▒c H├ánh ─É├ám Thoß║íi Tiß║┐ng H├án','Nguyß╗àn Thß╗ï H├á Bß║»c','Cuß╗æn s├ích 384 t├¼nh huß╗æng thß╗▒c h├ánh ─æ├ám thoß║íi tiß║┐ng H├án vß╗¢i 192 mß║½u c├óu c╞í bß║ún, ß╗⌐ng dß╗Ñng ─æ╞░ß╗úc trong nhiß╗üu t├¼nh huß╗æng giao tiß║┐p kh├íc nhau. Mß╗ùi mß║½u c├óu ─æß╗üu c├│ hai t├¼nh huß╗æng ─æ├ám thoß║íi. Bß║ín n├¬n hß╗ìc thuß╗Öc c├íc mß║½u c├óu ─æ├ám thoß║íi n├áy ─æß╗â hiß╗âu c├ích vß║¡n dß╗Ñng.',40000.00,'https://booknest-books.s3.ap-southeast-2.amazonaws.com/covers/5a0a69aa-43ea-40ad-a988-60da25d81509_book36.jpg','https://booknest-books.s3.ap-southeast-2.amazonaws.com/books/66697ca7-3cc4-4c24-a7bb-e016ba167868_book36.pdf',1,5,0,0.00,0,NULL,'2026-03-30 13:24:12','2026-03-30 13:24:12'),(37,'Ngß╗» Ph├íp Tiß║┐ng H├án C╞í Bß║ún','Bß╗Ö gi├ío dß╗Ñc v├á ─æ├áo tß║ío','NGß╗« PH├üP C╞á Bß║óN TIß║╛NG H├ÇN cß╗ºa t├íc giß║ú L├¬ Huy Khoa, hß╗ç thß╗æng mß╗Öt c├ích ─æß║ºy ─æß╗º, ch├¡nh x├íc v├á khoa hß╗ìc nhß║Ñt c├íc kiß║┐n thß╗⌐c c╞í bß║ún vß╗ü ngß╗» ph├íp tiß║┐ng H├án nh╞░ danh tß╗½, ─æß╗Öng tß╗½, t├¡nh tß╗½ΓÇª',70000.00,'https://booknest-books.s3.ap-southeast-2.amazonaws.com/covers/6b06bc9f-a2cc-407f-987a-ba4cb28c4b98_book37.jpg','https://booknest-books.s3.ap-southeast-2.amazonaws.com/books/7a8f0152-c663-4f4a-b399-7e655d00116a_book37.pdf',1,5,0,0.00,0,NULL,'2026-03-30 13:25:19','2026-03-30 13:25:19'),(38,'Kanji Look And Learn N3 ΓÇô N2: Bß║ún Nhß║¡t Viß╗çt','Jung min kyung','Kanji look and learn N3, N2 ΓÇô Bß║ún Nhß║¡t Viß╗çt ─æ╞░ß╗úc bi├¬n soß║ín bß║»t nguß╗ôn tß╗½ quyß╗ân s├ích Kanji Pixtographic ΓÇô l├á cuß╗æn s├ích dß║íy Kanji ß╗ƒ tr├¼nh ─æß╗Ö trung cß║Ñp N3 v├á N2 bß║▒ng h├¼nh ß║únh cß╗▒c hay. Tuy nhi├¬n ─æiß╗âm hß║ín chß║┐ cß╗ºa n├│ l├á tr├¼nh b├áy kh├┤ng ─æ╞░ß╗úc khoa hß╗ìc nh╞░ cuß╗æn Kanji look and learn v├á ho├án to├án bß║▒ng tiß║┐ng Anh. Vß║¡y n├¬n, t├íc giß║ú ─æ├ú gh├⌐p lß║íi c├íc h├¼nh ß║únh tß╗½ cuß╗æn s├ích n├áy v├á phß╗æi hß╗úp gh├⌐p c├íc h├¼nh ß║únh c├│ sß║╡n cß╗ºa quyß╗ân Kanji look and learn ─æß╗â tß║ío n├¬n mß╗Öt quyß╗ân s├ích mß╗¢i, ho├án to├án tiß║┐ng Viß╗çt vß╗¢i c├ích tr├¼nh b├áy khoa hß╗ìc v├á v├┤ c├╣ng dß╗à hß╗ìc vß╗¢i c├íi t├¬n l├á Kanji look and learn N23 phi├¬n bß║ún tiß║┐ng Viß╗çt',50000.00,'https://booknest-books.s3.ap-southeast-2.amazonaws.com/covers/e2f645c1-5702-4dc2-9d0a-7d26d1eb073a_book38.jpg','https://booknest-books.s3.ap-southeast-2.amazonaws.com/books/05c8f1ff-3865-4472-97f0-a992e605aced_book38.pdf',1,5,0,0.00,0,NULL,'2026-03-30 13:26:11','2026-03-30 13:26:11'),(39,'301 C├óu ─É├ám Thoß║íi Tiß║┐ng Hoa','NXB Tß╗½ ─æiß╗ân b├ích khoa','Gi├ío tr├¼nh 301 C├óu ─É├ám Thoß║íi Tiß║┐ng Hoa ─æ╞░ß╗úc xuß║Ñt bß║ún lß║ºn ─æß║ºu ti├¬n v├áo n─âm 1990. N─âm 1998, s├ích ─æ╞░ß╗úc chß╗ënh sß╗¡a, t├íi bß║ún v├á ─æ╞░ß╗úc xß║┐p v├áo hß╗ç thß╗æng gi├ío tr├¼nh tiß║┐ng Trung Quß╗æc d├ánh cho ng╞░ß╗¥i ng╞░ß╗¢c ngo├ái (tß╗º s├ích tinh hoa) cß╗ºa tr╞░ß╗¥ng ─Éß║íi hß╗ìc ng├┤n ngß╗» Bß║»c Kinh.',90000.00,'https://booknest-books.s3.ap-southeast-2.amazonaws.com/covers/6c3327d4-5176-4c4c-ac64-ff81329db538_book39.jpg','https://booknest-books.s3.ap-southeast-2.amazonaws.com/books/7e715b34-6e40-477e-8ca5-c20fae233d0b_book39.pdf',1,5,0,0.00,0,NULL,'2026-03-30 13:42:32','2026-03-30 13:42:32'),(40,'C├ích Hß╗ìc Ngoß║íi Ngß╗» Nhanh V├á Kh├┤ng Bao Giß╗¥ Qu├¬n','Gabriel Wyner','Fluent Forever l├á c├ích dß║íy bß║Ñt cß╗⌐ ngoß║íi ngß╗» n├áo bß║ín muß╗æn mß╗Öt c├ích nhanh nhß║Ñt, hiß╗çu quß║ú nhß║Ñt. ─É├óy l├á t├ái liß╗çu hß╗ìc ngoß║íi ngß╗» ─æ╞░ß╗úc ─æ├ính gi├í cao nhß║Ñt hiß╗çn nay tr├¬n to├án thß║┐ giß╗¢i bß╗¢i n├│ kh├┤ng ─æ╞ín thuß║ºn l├á s├ích dß║íy ngoß║íi ngß╗» m├á l├á mß╗Öt c├║ ─æß╗Öt ph├í t╞░ duy xuß║Ñt sß║»c ─æß╗â l├ám chß╗º n├úo bß╗Ö. ß╗¿ng dß╗Ñng tri thß╗⌐c vß╗ü khoa hß╗ìc thß║ºn kinh, bß║ín kh├┤ng cß║ºn chß╗¥ ─æß║┐n mß╗Öt sß╗▒ may mß║»n t├¼nh cß╗¥ hay cß║ºn mß║½n qu├í sß╗⌐c ─æß╗â ─æ╞░a th├┤ng tin cß║ºn thiß║┐t v├áo n├úo bß╗Ö. Nhß╗»ng g├¼ bß║ín muß╗æn sß║╜ thuß║¡n vß╗¢i tß╗▒ nhi├¬n l╞░u v├áo bß╗Ö nhß╗¢. Bß╗ƒi thß║┐, kh├┤ng phß║úi ngß║½u nhi├¬n, trang web fluent-forever.com trß╗ƒ th├ánh mß╗Öt ΓÇ£hiß╗çn t╞░ß╗úng mß║íngΓÇ¥, dß║íy ngoß║íi ngß╗» cho 1,5 triß╗çu ng╞░ß╗¥i tr├¬n to├án thß║┐ giß╗¢i v├á khiß║┐n h├áng triß╗çu ng╞░ß╗¥i ham th├¡ch thß╗¡ th├ích t╞░ duy t├¼m ─æß║┐n.',100000.00,'https://booknest-books.s3.ap-southeast-2.amazonaws.com/covers/2a9c1b51-886f-4ccc-94a5-7a2186f5cab0_book40.jpg','https://booknest-books.s3.ap-southeast-2.amazonaws.com/books/d6ef712e-4471-44e1-b92e-e3a9db1f4d97_book40.pdf',1,5,0,0.00,0,NULL,'2026-03-30 13:43:42','2026-03-30 13:43:42'),(41,'S├ích n├│i Cuß╗Öc ─æß╗¥i v├á sß╗▒ nghiß╗çp Tß╗òng thß╗æng Mß╗╣ Abraham Lincoln','Jack Weatherford','Tß╗òng thß╗æng thß╗⌐ 16 cß╗ºa n╞░ß╗¢c Mß╗╣ Abraham Lincoln sinh ng├áy 12/2/1809 trong mß╗Öt gia ─æ├¼nh n├┤ng d├ón ngh├¿o ß╗ƒ hß║ít Hardin thuß╗Öc bang Kentucky cß╗ºa Mß╗╣. N─âm 1816, cß║ú gia ─æ├¼nh chuyß╗ân tß╗¢i bang Indiana vß╗¢i hy vß╗ìng ─æß╗òi ─æß╗¥i. Tuy nhi├¬n, chß╗ë 2 n─âm sau ─æ├│, mß║╣ ├┤ng bß║Ñt ngß╗¥ qua ─æß╗¥i. ├ìt n─âm sau ─æ├│, cha ├┤ng t├íi h├┤n.',0.00,'https://booknest-books.s3.ap-southeast-2.amazonaws.com/covers/e71ccd27-f9e4-4194-a556-7f0fba27b25e_book41.jpg','https://booknest-books.s3.ap-southeast-2.amazonaws.com/books/c7af62a5-e9d5-433d-a6b0-ba48d7d237fc_book41.pdf',1,5,0,0.00,0,NULL,'2026-03-30 13:45:53','2026-03-30 13:45:53'),(42,'Th├ánh C├ít T╞░ H├ún V├á Sß╗▒ H├¼nh Th├ánh Thß║┐ Giß╗¢i Hiß╗çn ─Éß║íi','Ng├┤ Thß╗ï  Gi├íng Uy├¬n','ß╗₧ ph╞░╞íng T├óy, ta th╞░ß╗¥ng ngh─⌐ Hy Lß║íp v├á La M├ú l├á hai ─æß║┐ chß║┐ gi├║p dß║½n ─æß║┐n sß╗▒ ph├ít triß╗ân cß╗ºa thß║┐ giß╗¢i hiß╗çn ─æß║íi. Mß║╖t kh├íc, ─æß║┐ chß║┐ M├┤ng Cß╗ò v├á Th├ánh C├ít T╞░ H├ún kh├┤ng ─æ╞░ß╗úc c├íc sß╗¡ gia ph╞░╞íng T├óy ch├║ ├╜ nhiß╗üu. Mß╗ùi khi ─æ╞░ß╗úc nhß║»c ─æß║┐n, chß╗º ─æß╗ü n├áy ─æß╗üu bß╗ï ─æß║╖t trong mß╗Öt bß╗æi cß║únh ti├¬u cß╗▒c, vß╗¢i nhß╗»ng c├óu chuyß╗çn vß╗ü sß╗▒ t├án bß║ío v├á hiß║┐u chiß║┐n.',0.00,'https://booknest-books.s3.ap-southeast-2.amazonaws.com/covers/2f933a9c-b201-4bb4-8508-0293298b33cf_book42.jpg','https://booknest-books.s3.ap-southeast-2.amazonaws.com/books/a1577acb-1a69-4090-92a2-348c38546df5_book42.pdf',1,5,0,0.00,0,NULL,'2026-03-30 13:46:50','2026-03-30 13:46:50'),(43,'B├ính M├¼ Th╞ím, C├á Ph├¬ ─Éß║»ng','Beatrice Sparks','B├ính M├¼ Th╞ím, C├á Ph├¬ ─Éß║»ng nh╞░ mß╗Öt cuß╗æn s├ích tß║ún mß║ín vß╗ü nhß╗»ng c├óu chuyß╗çn ─ân uß╗æng n╞íi ph╞░╞íng T├óy lß║ính gi├í, ─æß╗ông thß╗¥i c├▓n l├á kh├ím ph├í vß╗ü nhß╗»ng cß║únh vß║¡t xung quanh, nhß╗»ng con ─æ╞░ß╗¥ng, nhß╗»ng h├áng phß╗æ, nhß╗»ng d├úy c├óy, nhß╗»ng t├▓a nh├á, kß╗â cß║ú nhß╗»ng khung trß╗¥i lß╗Öng gi├│ tr├¬n t├▓a chung c╞░ cao ng├║t',0.00,'https://booknest-books.s3.ap-southeast-2.amazonaws.com/covers/ed335196-f9a9-4f23-abfb-d8f89922ed25_book43.jpg','https://booknest-books.s3.ap-southeast-2.amazonaws.com/books/65f87b4d-daa3-4b02-91d8-8b0be2e2107e_book43.pdf',1,5,0,0.00,0,NULL,'2026-03-30 13:47:47','2026-03-30 13:47:47'),(44,'Nhß║¡t K├╜ Cß╗ºa Nancy','Zak Ebrahim','THEO Y├èU Cß║ªU Cß╗ªA GIA ─É├îNH NANCY, TO├ÇN Bß╗ÿ T├èN NG╞»ß╗£I V├Ç C├üC ─Éß╗èA DANH TRONG T├üC PHß║¿M ─É├â ─É╞»ß╗óC THAY ─Éß╗öI HO├ÇN TO├ÇN.',0.00,'https://booknest-books.s3.ap-southeast-2.amazonaws.com/covers/e111e4b1-17ed-4020-b849-a47c0678a25e_book44.jpg','https://booknest-books.s3.ap-southeast-2.amazonaws.com/books/52613cca-86db-4c63-aa22-36156c037f6a_book44.pdf',1,5,0,0.00,0,NULL,'2026-03-30 13:48:41','2026-03-30 13:48:41'),(45,'Con Trai Kß║╗ Khß╗ºng Bß╗æ','Kh├ính Ly','Sß║╜ thß║┐ n├áo nß║┐u bß║ín lß╗¢n l├¬n c├╣ng mß╗Öt g├ú khß╗ºng bß╗æ trong nh├á?',0.00,'https://booknest-books.s3.ap-southeast-2.amazonaws.com/covers/2c3a755a-64a8-4c24-9e85-f0b228edc0b2_book45.jpg','https://booknest-books.s3.ap-southeast-2.amazonaws.com/books/1dae44ba-888c-4627-82f2-9a8c158ed3ef_book45.pdf',1,5,0,0.00,0,NULL,'2026-03-30 13:49:40','2026-03-30 13:49:40'),(46,'─Éß║▒ng Sau Nhß╗»ng Nß╗Ñ C╞░ß╗¥i','Jack Weatherford','Nhß║»c ─æß║┐n cß╗æ nhß║íc s─⌐ t├ái hoa Trß╗ïnh C├┤ng S╞ín, ng╞░ß╗¥i ta lß║¡p tß╗⌐c nhß║»c ─æß║┐n Kh├ính Ly, ng╞░ß╗¥i m├á ─æß║┐n giß╗¥ ch╞░a ai c├│ thß╗â thay thß║┐ trong d├▓ng nhß║íc Trß╗ïnh. Lß║ºn ─æß║ºu ti├¬n, mß╗Öt qu├úng ─æß╗¥i ─æ╞░ß╗úc chß╗ï chia sß║╗ c├╣ng ─æß╗Öc giß║ú, kh├ín giß║ú cß╗ºa m├¼nh qua cuß╗æn s├ích ─Éß║▒ng sau nhß╗»ng nß╗Ñ c╞░ß╗¥i. ─É├│ l├á cß║ú mß╗Öt qu├úng thß╗¥i gian 50 n─âm ─æi h├ít c┼⌐ng nh╞░ b├┤n ba khß║»p bß╗æn ph╞░╞íng cß╗ºa chß╗ï, thß║Ñp tho├íng b├│ng d├íng nhß╗»ng ng╞░ß╗¥i ─æ├án ├┤ng m├á theo chß╗ï ΓÇ£nß╗ú cß║ú cuß╗Öc ─æß╗¥iΓÇ¥. V├á d├╣ ─æi ─æ├óu, l├ám g├¼, trong tim chß╗ï vß║½n thiß║┐t tha ch├íy bß╗Ång ╞░ß╗¢c muß╗æn ΓÇ£m├úi m├úi l├ám mß╗Öt ng╞░ß╗¥i Viß╗çt Nam nguy├¬n vß║╣n h├¼nh h├ái',55000.00,'https://booknest-books.s3.ap-southeast-2.amazonaws.com/covers/012ed730-86a9-40d2-84a5-89bc4e23e206_book46.jpg','https://booknest-books.s3.ap-southeast-2.amazonaws.com/books/23875c0e-340d-4f5a-bdcc-8646dbf4ce33_book46.pdf',1,5,0,0.00,0,NULL,'2026-03-30 13:50:42','2026-03-30 13:50:42'),(47,'Nhß╗»ng Ng╞░ß╗¥i C├╣ng Thß╗¥i','Ng├┤ Thß╗ï  Gi├íng Uy├¬n','Tr├¬n diß╗çn b├ái kh├í rß╗Öng thuß╗Öc c├íc l─⌐nh vß╗▒c khoa hß╗ìc v├á c├┤ng nghß╗ç, v─ân h├│a v├á v─ân ch╞░╞íng ΓÇô hß╗ìc thuß║¡t cß╗ºa Tß║íp ch├¡ Tia S├íng ng├│t 10 n─âm nay, c├│ loß║ít b├ái viß║┐t vß╗ü Ch├ón dung, t├┤i rß║Ñt ham ─æß╗ìc v├á mong ─æß╗ìc. ',200000.00,'https://booknest-books.s3.ap-southeast-2.amazonaws.com/covers/c8766ef0-6bf0-44c0-b85b-3965f675f3db_book47.jpg','https://booknest-books.s3.ap-southeast-2.amazonaws.com/books/69570321-745b-4a59-81d2-202b93ac383f_book47.pdf',1,5,0,0.00,0,NULL,'2026-03-30 13:51:41','2026-03-30 13:51:41'),(48,'Thomas Edison ΓÇô Ng╞░ß╗¥i Thß║»p S├íng ─Éß╗ïa Cß║ºu','Beatrice Sparks','Edison thß╗¥i tiß╗âu hß╗ìc bß╗ï cho l├á ─æß╗⌐a trß║╗ chß║¡m ph├ít triß╗ân, lß╗¢n l├¬n ─æß╗æi vß╗¢i v─ân minh nh├ón loß║íi, c├│ cß╗æng hiß║┐n rß║Ñt v─⌐ ─æß║íi nh╞░ ─æ├¿n ─æiß╗çn, ─æiß╗çn thoß║íi, ─æiß╗çn t├¡n, xe ─æiß╗çn, m├íy ghi ├óm, ─æiß╗çn ß║únh, m├íy thu thanh v.vΓÇª, h╞ín 1000 ph├ít minh ho├án to├án nhß╗¥ v├áo tinh thß║ºn nghi├¬n cß╗⌐u si├¬u nh├ón, bß╗ün ch├¡ bß╗ün l├▓ng v├á sß╗▒ nß╗ò lß╗▒c kh├┤ng chß╗ïu l├╣i b╞░ß╗¢c ─æ├ú th├ánh c├┤ng. ΓÇ£Bß╗ün l├▓ng bß╗ün gan l├á gß╗æc cß╗ºa th├ánh c├┤ng. Ng╞░ß╗¥i c├│ ch├¡ viß╗çc ß║»t th├ánh.ΓÇ¥',100000.00,'https://booknest-books.s3.ap-southeast-2.amazonaws.com/covers/cd25c1e8-9c47-4d8d-9411-b75db4d38465_book48.jpg','https://booknest-books.s3.ap-southeast-2.amazonaws.com/books/571cf98e-119e-45a7-9f00-3af91ca5dbef_book48.pdf',1,5,0,0.00,0,NULL,'2026-03-30 13:52:31','2026-03-30 13:52:31'),(49,'V├╡ Nguy├¬n Gi├íp ΓÇô Chiß║┐n Thß║»ng Bß║▒ng Mß╗ìi Gi├í','Zak Ebrahim','S├ích viß║┐t vß╗ü ─Éß║íi t╞░ß╗¢ng V├╡ Nguy├¬n Gi├íp do Cecil B. Currey viß║┐t, sau khi th─âm Viß╗çt Nam vß╗ü n─âm 1997 ─æ├ú ─æ╞░ß╗úc ─Éß║íi t╞░ß╗¢ng tiß║┐p ß╗ƒ nh├á ri├¬ng. T├íc giß║ú l├á gi├ío s╞░ sß╗¡ hß╗ìc ─æ├ú giß║úng dß║íy lß╗ïch sß╗¡ tß║íi tr╞░ß╗¥ng ─Éß║íi hß╗ìc Nam Florida (Hoa Kß╗│) ─æ╞░ß╗úc ─æ├ính gi├í l├á mß╗Öt trong nhß╗»ng sß╗¡ gia xuß║Ñt sß║»c vß╗ü lß╗ïch sß╗¡ chiß║┐n tranh ─æ├ú viß║┐t ba cuß╗æn s├ích vß╗ü Viß╗çt Nam. T├íc giß║ú dß╗▒a v├áo nhiß╗üu nguß╗ôn t╞░ liß╗çu cß╗ºa ta v├á cß║ú cß╗ºa t├¼nh b├ío n╞░ß╗¢c ngo├ái (c├│ nhiß╗üu dß╗» kiß╗çn kh├┤ng ─æß║úm bß║úo ch├¡nh x├íc, cß║ºn phß║úi l╞░ß╗úc bß╗Å hoß║╖c bi├¬n tß║¡p lß║íi) tiß║┐p x├║c vß╗¢i nhiß╗üu c├ín bß╗Ö cao cß║Ñp trong v├á ngo├ái qu├ón ─æß╗Öi.',300000.00,'https://booknest-books.s3.ap-southeast-2.amazonaws.com/covers/c5fd945c-9db7-4987-9414-91381e2dfaba_book49.jpg','https://booknest-books.s3.ap-southeast-2.amazonaws.com/books/17c347c7-aeab-43de-89b1-0cb5238203d9_book49.pdf',1,5,0,0.00,0,NULL,'2026-03-30 13:53:46','2026-03-30 13:53:46'),(50,'Nhß╗»ng Ng├áy Th╞í ß║ñu','Kh├ính Ly','Ng╞░ß╗¥i ta hay giß║Ñu giß║┐m v├á che ─æß║¡y sß╗▒ thß║¡t, nhß║Ñt l├á sß╗▒ ─æ├íng buß╗ôn trong gia ─æ├¼nh. C├│ lß╗úi ├¡ch g├¼ kh├┤ng?',120000.00,'https://booknest-books.s3.ap-southeast-2.amazonaws.com/covers/8819add9-8fe7-4694-9883-bc8764f355d2_book50.jpg','https://booknest-books.s3.ap-southeast-2.amazonaws.com/books/7d340ff3-9acd-49ab-aaec-4b6312c7d716_book50.pdf',1,5,0,0.00,0,NULL,'2026-03-30 13:54:42','2026-03-30 13:54:42');
/*!40000 ALTER TABLE `sach` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sach_danh_muc`
--

DROP TABLE IF EXISTS `sach_danh_muc`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sach_danh_muc` (
  `ma_lk` bigint NOT NULL AUTO_INCREMENT,
  `ma_sach` bigint NOT NULL,
  `ma_dm` bigint NOT NULL,
  PRIMARY KEY (`ma_lk`),
  UNIQUE KEY `unique_sach_danh_muc` (`ma_sach`,`ma_dm`),
  KEY `ma_dm` (`ma_dm`),
  CONSTRAINT `sach_danh_muc_ibfk_1` FOREIGN KEY (`ma_sach`) REFERENCES `sach` (`ma_sach`) ON DELETE CASCADE,
  CONSTRAINT `sach_danh_muc_ibfk_2` FOREIGN KEY (`ma_dm`) REFERENCES `danh_muc_sach` (`ma_dm`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sach_danh_muc`
--

LOCK TABLES `sach_danh_muc` WRITE;
/*!40000 ALTER TABLE `sach_danh_muc` DISABLE KEYS */;
INSERT INTO `sach_danh_muc` VALUES (1,1,1),(2,2,1),(3,3,1),(4,4,1),(5,5,1),(6,6,1),(7,7,1),(8,8,1),(9,9,1),(10,10,1),(11,11,1),(12,12,1),(13,13,2),(14,14,2),(15,15,2),(16,16,2),(17,17,2),(18,18,2),(19,19,2),(20,20,2),(21,21,3),(22,22,3),(23,23,3),(24,24,3),(25,25,3),(26,26,3),(27,27,3),(28,28,3),(29,29,3),(30,30,3),(31,31,4),(32,32,4),(33,33,4),(34,34,4),(35,35,4),(36,36,4),(37,37,4),(38,38,4),(39,39,4),(40,40,4),(41,41,5),(42,42,5),(43,43,5),(44,44,5),(45,45,5),(46,46,5),(47,47,5),(48,48,5),(49,49,5),(50,50,5);
/*!40000 ALTER TABLE `sach_danh_muc` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sach_yeu_thich`
--

DROP TABLE IF EXISTS `sach_yeu_thich`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sach_yeu_thich` (
  `ma_sachyt` bigint NOT NULL AUTO_INCREMENT,
  `ma_nd` bigint NOT NULL,
  `ma_sach` bigint NOT NULL,
  `ngay_tao` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`ma_sachyt`),
  UNIQUE KEY `unique_yeu_thich` (`ma_nd`,`ma_sach`),
  KEY `ma_sach` (`ma_sach`),
  CONSTRAINT `sach_yeu_thich_ibfk_1` FOREIGN KEY (`ma_nd`) REFERENCES `nguoi_dung` (`ma_nd`) ON DELETE CASCADE,
  CONSTRAINT `sach_yeu_thich_ibfk_2` FOREIGN KEY (`ma_sach`) REFERENCES `sach` (`ma_sach`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sach_yeu_thich`
--

LOCK TABLES `sach_yeu_thich` WRITE;
/*!40000 ALTER TABLE `sach_yeu_thich` DISABLE KEYS */;
/*!40000 ALTER TABLE `sach_yeu_thich` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tien_do_doc_sach`
--

DROP TABLE IF EXISTS `tien_do_doc_sach`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tien_do_doc_sach` (
  `ma_td` bigint NOT NULL AUTO_INCREMENT,
  `ma_nd` bigint NOT NULL,
  `ma_sach` bigint NOT NULL,
  `trang_hien_tai` int DEFAULT '1',
  `phan_tram` decimal(5,2) DEFAULT '0.00',
  `lan_doc_cuoi` datetime DEFAULT CURRENT_TIMESTAMP,
  `ngay_tao` datetime DEFAULT CURRENT_TIMESTAMP,
  `ngay_cap_nhat` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `phan_tram_hoan_thanh` double DEFAULT NULL,
  PRIMARY KEY (`ma_td`),
  UNIQUE KEY `unique_nguoi_dung_sach` (`ma_nd`,`ma_sach`),
  KEY `ma_sach` (`ma_sach`),
  CONSTRAINT `tien_do_doc_sach_ibfk_1` FOREIGN KEY (`ma_nd`) REFERENCES `nguoi_dung` (`ma_nd`) ON DELETE CASCADE,
  CONSTRAINT `tien_do_doc_sach_ibfk_2` FOREIGN KEY (`ma_sach`) REFERENCES `sach` (`ma_sach`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tien_do_doc_sach`
--

LOCK TABLES `tien_do_doc_sach` WRITE;
/*!40000 ALTER TABLE `tien_do_doc_sach` DISABLE KEYS */;
/*!40000 ALTER TABLE `tien_do_doc_sach` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vai_tro`
--

DROP TABLE IF EXISTS `vai_tro`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vai_tro` (
  `ma_vt` bigint NOT NULL AUTO_INCREMENT,
  `ten_vai_tro` varchar(50) NOT NULL,
  PRIMARY KEY (`ma_vt`),
  UNIQUE KEY `ten_vai_tro` (`ten_vai_tro`),
  KEY `idx_ten_vai_tro` (`ten_vai_tro`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vai_tro`
--

LOCK TABLES `vai_tro` WRITE;
/*!40000 ALTER TABLE `vai_tro` DISABLE KEYS */;
INSERT INTO `vai_tro` VALUES (2,'quan_tri'),(1,'thanh_vien');
/*!40000 ALTER TABLE `vai_tro` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-03-30 21:14:01
