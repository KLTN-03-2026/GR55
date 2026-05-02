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
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chi_tiet_don_hang`
--

LOCK TABLES `chi_tiet_don_hang` WRITE;
/*!40000 ALTER TABLE `chi_tiet_don_hang` DISABLE KEYS */;
INSERT INTO `chi_tiet_don_hang` VALUES (1,1,8,'Thức Uống Và Thạch Trái Cây Đặc Sắc','Vũ Văn Lân','https://booknest-books.s3.ap-southeast-2.amazonaws.com/covers/1a8ed579-3239-441d-aa75-4a6ee46524dc_book8.jpg',80000.00),(2,1,9,'Văn Hóa Ẩm Thực Ninh Bình','Lê Thanh Xuân','https://booknest-books.s3.ap-southeast-2.amazonaws.com/covers/4b4545d2-5326-40c0-accd-94a0d440f4b5_book9.jpg',120000.00),(3,1,10,'Nghệ Thuật Pha Chế 460 Loại Rượu Cocktail','Bàng Cẩm','https://booknest-books.s3.ap-southeast-2.amazonaws.com/covers/24792852-686c-4500-bff3-c14945aec4d7_book10.jpg',120000.00),(4,1,11,'Kỹ Thuật Chế Biến Các Món Lẩu Và Súp','Tiểu Quỳnh','https://booknest-books.s3.ap-southeast-2.amazonaws.com/covers/af6e19df-dbd2-4b33-97ea-59d8fccdf347_book11.jpg',90000.00),(5,2,8,'Thức Uống Và Thạch Trái Cây Đặc Sắc','Vũ Văn Lân','https://booknest-books.s3.ap-southeast-2.amazonaws.com/covers/1a8ed579-3239-441d-aa75-4a6ee46524dc_book8.jpg',80000.00),(6,2,9,'Văn Hóa Ẩm Thực Ninh Bình','Lê Thanh Xuân','https://booknest-books.s3.ap-southeast-2.amazonaws.com/covers/4b4545d2-5326-40c0-accd-94a0d440f4b5_book9.jpg',120000.00),(7,2,10,'Nghệ Thuật Pha Chế 460 Loại Rượu Cocktail','Bàng Cẩm','https://booknest-books.s3.ap-southeast-2.amazonaws.com/covers/24792852-686c-4500-bff3-c14945aec4d7_book10.jpg',120000.00),(8,2,11,'Kỹ Thuật Chế Biến Các Món Lẩu Và Súp','Tiểu Quỳnh','https://booknest-books.s3.ap-southeast-2.amazonaws.com/covers/af6e19df-dbd2-4b33-97ea-59d8fccdf347_book11.jpg',90000.00),(9,3,8,'Thức Uống Và Thạch Trái Cây Đặc Sắc','Vũ Văn Lân','https://booknest-books.s3.ap-southeast-2.amazonaws.com/covers/1a8ed579-3239-441d-aa75-4a6ee46524dc_book8.jpg',80000.00),(10,3,9,'Văn Hóa Ẩm Thực Ninh Bình','Lê Thanh Xuân','https://booknest-books.s3.ap-southeast-2.amazonaws.com/covers/4b4545d2-5326-40c0-accd-94a0d440f4b5_book9.jpg',120000.00),(11,3,10,'Nghệ Thuật Pha Chế 460 Loại Rượu Cocktail','Bàng Cẩm','https://booknest-books.s3.ap-southeast-2.amazonaws.com/covers/24792852-686c-4500-bff3-c14945aec4d7_book10.jpg',120000.00),(12,3,11,'Kỹ Thuật Chế Biến Các Món Lẩu Và Súp','Tiểu Quỳnh','https://booknest-books.s3.ap-southeast-2.amazonaws.com/covers/af6e19df-dbd2-4b33-97ea-59d8fccdf347_book11.jpg',90000.00),(13,4,8,'Thức Uống Và Thạch Trái Cây Đặc Sắc','Vũ Văn Lân','https://booknest-books.s3.ap-southeast-2.amazonaws.com/covers/1a8ed579-3239-441d-aa75-4a6ee46524dc_book8.jpg',80000.00),(14,4,9,'Văn Hóa Ẩm Thực Ninh Bình','Lê Thanh Xuân','https://booknest-books.s3.ap-southeast-2.amazonaws.com/covers/4b4545d2-5326-40c0-accd-94a0d440f4b5_book9.jpg',120000.00),(15,4,10,'Nghệ Thuật Pha Chế 460 Loại Rượu Cocktail','Bàng Cẩm','https://booknest-books.s3.ap-southeast-2.amazonaws.com/covers/24792852-686c-4500-bff3-c14945aec4d7_book10.jpg',120000.00),(16,4,11,'Kỹ Thuật Chế Biến Các Món Lẩu Và Súp','Tiểu Quỳnh','https://booknest-books.s3.ap-southeast-2.amazonaws.com/covers/af6e19df-dbd2-4b33-97ea-59d8fccdf347_book11.jpg',90000.00),(17,5,8,'Thức Uống Và Thạch Trái Cây Đặc Sắc','Vũ Văn Lân','https://booknest-books.s3.ap-southeast-2.amazonaws.com/covers/1a8ed579-3239-441d-aa75-4a6ee46524dc_book8.jpg',80000.00),(18,5,9,'Văn Hóa Ẩm Thực Ninh Bình','Lê Thanh Xuân','https://booknest-books.s3.ap-southeast-2.amazonaws.com/covers/4b4545d2-5326-40c0-accd-94a0d440f4b5_book9.jpg',120000.00),(19,5,10,'Nghệ Thuật Pha Chế 460 Loại Rượu Cocktail','Bàng Cẩm','https://booknest-books.s3.ap-southeast-2.amazonaws.com/covers/24792852-686c-4500-bff3-c14945aec4d7_book10.jpg',120000.00),(20,5,11,'Kỹ Thuật Chế Biến Các Món Lẩu Và Súp','Tiểu Quỳnh','https://booknest-books.s3.ap-southeast-2.amazonaws.com/covers/af6e19df-dbd2-4b33-97ea-59d8fccdf347_book11.jpg',90000.00),(21,6,8,'Thức Uống Và Thạch Trái Cây Đặc Sắc','Vũ Văn Lân','https://booknest-books.s3.ap-southeast-2.amazonaws.com/covers/1a8ed579-3239-441d-aa75-4a6ee46524dc_book8.jpg',80000.00),(22,6,9,'Văn Hóa Ẩm Thực Ninh Bình','Lê Thanh Xuân','https://booknest-books.s3.ap-southeast-2.amazonaws.com/covers/4b4545d2-5326-40c0-accd-94a0d440f4b5_book9.jpg',120000.00),(23,6,10,'Nghệ Thuật Pha Chế 460 Loại Rượu Cocktail','Bàng Cẩm','https://booknest-books.s3.ap-southeast-2.amazonaws.com/covers/24792852-686c-4500-bff3-c14945aec4d7_book10.jpg',120000.00),(24,6,11,'Kỹ Thuật Chế Biến Các Món Lẩu Và Súp','Tiểu Quỳnh','https://booknest-books.s3.ap-southeast-2.amazonaws.com/covers/af6e19df-dbd2-4b33-97ea-59d8fccdf347_book11.jpg',90000.00),(25,7,10,'Nghệ Thuật Pha Chế 460 Loại Rượu Cocktail','Bàng Cẩm','https://booknest-books.s3.ap-southeast-2.amazonaws.com/covers/24792852-686c-4500-bff3-c14945aec4d7_book10.jpg',120000.00),(26,8,10,'Nghệ Thuật Pha Chế 460 Loại Rượu Cocktail','Bàng Cẩm','https://booknest-books.s3.ap-southeast-2.amazonaws.com/covers/24792852-686c-4500-bff3-c14945aec4d7_book10.jpg',120000.00),(27,9,10,'Nghệ Thuật Pha Chế 460 Loại Rượu Cocktail','Bàng Cẩm','https://booknest-books.s3.ap-southeast-2.amazonaws.com/covers/24792852-686c-4500-bff3-c14945aec4d7_book10.jpg',120000.00),(28,10,16,'365 Chuyện Kể Hàng Đêm – Mùa Thu','Lep Tônxtoi','https://booknest-books.s3.ap-southeast-2.amazonaws.com/covers/f1dfba12-1653-40bf-bd54-fe51a8bc3655_book16.jpg',30000.00),(29,11,49,'Võ Nguyên Giáp – Chiến Thắng Bằng Mọi Giá','Zak Ebrahim','https://booknest-books.s3.ap-southeast-2.amazonaws.com/covers/c5fd945c-9db7-4987-9414-91381e2dfaba_book49.jpg',210000.00),(30,12,10,'Nghệ Thuật Pha Chế 460 Loại Rượu Cocktail','Bàng Cẩm','https://booknest-books.s3.ap-southeast-2.amazonaws.com/covers/24792852-686c-4500-bff3-c14945aec4d7_book10.jpg',120000.00),(31,12,49,'Võ Nguyên Giáp – Chiến Thắng Bằng Mọi Giá','Zak Ebrahim','https://booknest-books.s3.ap-southeast-2.amazonaws.com/covers/c5fd945c-9db7-4987-9414-91381e2dfaba_book49.jpg',210000.00),(32,13,9,'Văn Hóa Ẩm Thực Ninh Bình','Lê Thanh Xuân','https://booknest-books.s3.ap-southeast-2.amazonaws.com/covers/4b4545d2-5326-40c0-accd-94a0d440f4b5_book9.jpg',120000.00),(33,13,49,'Võ Nguyên Giáp – Chiến Thắng Bằng Mọi Giá','Zak Ebrahim','https://booknest-books.s3.ap-southeast-2.amazonaws.com/covers/c5fd945c-9db7-4987-9414-91381e2dfaba_book49.jpg',210000.00);
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
  `loai_giam` varchar(255) NOT NULL,
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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chuong_trinh_giam_gia`
--

LOCK TABLES `chuong_trinh_giam_gia` WRITE;
/*!40000 ALTER TABLE `chuong_trinh_giam_gia` DISABLE KEYS */;
INSERT INTO `chuong_trinh_giam_gia` VALUES (2,'Tri ân khách hàng','phan_tram',30.00,'2026-04-01 01:01:00','2026-06-02 01:01:00',1,'2026-05-01 01:02:18','2026-05-01 11:33:37');
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
) ENGINE=InnoDB AUTO_INCREMENT=58 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chuong_trinh_giam_gia_sach`
--

LOCK TABLES `chuong_trinh_giam_gia_sach` WRITE;
/*!40000 ALTER TABLE `chuong_trinh_giam_gia_sach` DISABLE KEYS */;
INSERT INTO `chuong_trinh_giam_gia_sach` VALUES (51,2,18,'2026-05-01 06:18:56'),(52,2,39,'2026-05-01 06:18:56'),(53,2,1,'2026-05-01 06:18:56'),(54,2,2,'2026-05-01 06:18:56'),(55,2,11,'2026-05-01 06:18:56'),(56,2,8,'2026-05-01 06:18:56'),(57,2,49,'2026-05-01 06:18:56');
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
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `danh_gia`
--

LOCK TABLES `danh_gia` WRITE;
/*!40000 ALTER TABLE `danh_gia` DISABLE KEYS */;
INSERT INTO `danh_gia` VALUES (1,1,3,5,'nội dung phong phú và dễ hiểu!',1,'2026-04-07 08:39:04','2026-04-07 08:39:04'),(2,4,3,4,'Khá tốt, nhưng một số chỗ hơi khó theo dõi.',1,'2026-04-07 08:40:14','2026-04-07 08:40:14'),(3,5,3,5,'Tuyệt vời, tôi đã đọc xong trong một ngày.',1,'2026-04-07 08:40:48','2026-04-07 08:40:48'),(4,6,4,5,'Một trong những cuốn sách hay nhất tôi từng đọc!',1,'2026-04-07 08:41:30','2026-04-07 08:41:30'),(5,1,4,3,'Nội dung ổn nhưng chưa đáp ứng kỳ vọng.',1,'2026-04-07 08:42:00','2026-05-01 18:33:09');
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
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `danh_muc_sach`
--

LOCK TABLES `danh_muc_sach` WRITE;
/*!40000 ALTER TABLE `danh_muc_sach` DISABLE KEYS */;
INSERT INTO `danh_muc_sach` VALUES (1,'Ẩm thực - Nấu ăn','2026-03-27 06:57:38','2026-03-27 06:57:38'),(2,'Cổ tích - Thần thoại','2026-03-27 06:57:51','2026-03-27 06:57:51'),(3,'Công nghệ thông tin','2026-03-27 06:58:42','2026-03-27 06:58:42'),(4,'Học ngoại ngữ','2026-03-27 06:58:51','2026-03-27 06:58:51'),(5,'Hồi ký - Tùy bút','2026-03-27 06:58:58','2026-03-27 06:58:58'),(6,'Huyền bí - Giả tưởng','2026-03-27 06:59:05','2026-03-27 06:59:05'),(7,'Khoa học - Kỹ thuật','2026-03-27 06:59:15','2026-03-27 06:59:15'),(8,'Kiếm hiệp - Tiên hiệp','2026-03-27 06:59:31','2026-03-27 06:59:31'),(9,'Kiến trúc - Xây dựng','2026-03-27 06:59:37','2026-03-27 06:59:37'),(10,'Kinh tế - Quản lý','2026-03-27 06:59:44','2026-03-27 06:59:44'),(11,'Lịch sử - Chính trị','2026-03-27 06:59:52','2026-03-27 06:59:52'),(12,'Marketing - Bán hàng','2026-03-27 06:59:59','2026-03-27 06:59:59'),(13,'Nông - Lâm - Ngư','2026-03-27 07:00:15','2026-03-27 07:00:15'),(14,'Phiêu lưu - Mạo hiểm','2026-03-27 07:00:23','2026-03-27 07:00:23'),(15,'Sách giáo khoa','2026-03-27 07:00:29','2026-03-27 07:00:29'),(16,'Tâm lý - Kỹ năng sống','2026-03-27 07:00:35','2026-03-27 07:00:35'),(17,'Thể thao - Nghệ thuật','2026-03-27 07:00:41','2026-03-27 07:00:41'),(18,'Thư viện pháp luật','2026-03-27 07:00:48','2026-03-27 07:00:48'),(19,'Tiểu thuyết phương tây','2026-03-27 07:01:05','2026-03-27 07:01:05'),(20,'Tiểu thuyết Trung Quốc','2026-03-27 07:01:13','2026-03-27 07:01:13'),(21,'Triết học','2026-03-27 07:01:22','2026-03-27 07:01:22'),(22,'Trinh thám - Hình sự','2026-03-27 07:01:28','2026-03-27 07:01:28'),(23,'Truyện cười - Tiếu lâm','2026-03-27 07:01:35','2026-03-27 07:01:35'),(24,'Truyện ma - Truyện kinh dị','2026-03-27 07:01:43','2026-03-27 07:01:43'),(25,'Truyện ngắn - Ngôn tình','2026-03-27 07:01:49','2026-03-27 07:01:49'),(26,'Truyện tranh','2026-03-27 07:01:55','2026-03-27 07:01:55'),(27,'Tử vi - Phong thủy','2026-03-27 07:02:01','2026-03-27 07:02:01'),(28,'Văn hóa - Tôn giáo','2026-03-27 07:02:12','2026-03-27 07:02:12');
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
  `phuong_thuc_thanh_toan` varchar(20) DEFAULT NULL,
  `trang_thai` varchar(20) DEFAULT NULL,
  `ngay_tao` datetime DEFAULT CURRENT_TIMESTAMP,
  `ngay_cap_nhat` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_dh`),
  UNIQUE KEY `ma_don_hang` (`ma_don_hang`),
  KEY `idx_ma_don_hang` (`ma_don_hang`),
  KEY `idx_ma_nd` (`ma_nd`),
  KEY `idx_trang_thai` (`trang_thai`),
  KEY `idx_ngay_tao` (`ngay_tao`),
  CONSTRAINT `don_hang_ibfk_1` FOREIGN KEY (`ma_nd`) REFERENCES `nguoi_dung` (`ma_nd`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `don_hang`
--

LOCK TABLES `don_hang` WRITE;
/*!40000 ALTER TABLE `don_hang` DISABLE KEYS */;
INSERT INTO `don_hang` VALUES (1,'DH1776754492545ADEAC2',1,'Nguyễn Hùng Thắng','hungthang0206@gmail.com','0359598204',410000.00,'VNPAY','that_bai','2026-04-21 06:54:53','2026-04-28 06:42:54'),(2,'DH17767545206833C0FEA',1,'Nguyễn Hùng Thắng','hungthang0206@gmail.com','0359598204',410000.00,'VNPAY','that_bai','2026-04-21 06:55:21','2026-04-28 06:42:54'),(3,'DH1776755139359EDF983',1,'Nguyễn Hùng Thắng','hungthang0206@gmail.com','0359598204',410000.00,'VNPAY','that_bai','2026-04-21 07:05:39','2026-04-21 07:06:17'),(4,'DH177692727327767FD04',1,'Nguyễn Hùng Thắng','hungthang0206@gmail.com','0359598204',410000.00,'VNPAY','that_bai','2026-04-23 06:54:33','2026-04-23 06:59:28'),(5,'DH17769275894218942E9',1,'Nguyễn Hùng Thắng','hungthang0206@gmail.com','0359598204',410000.00,'VNPAY','that_bai','2026-04-23 06:59:49','2026-04-23 07:00:02'),(6,'DH1776927619014359C4B',1,'Nguyễn Hùng Thắng','hungthang0206@gmail.com','0359598204',410000.00,'VNPAY','that_bai','2026-04-23 07:00:19','2026-04-23 07:01:12'),(7,'DH17769279802340214AE',1,'Nguyễn Hùng Thắng','hungthang0206@gmail.com','0359598204',120000.00,'VNPAY','that_bai','2026-04-23 07:06:20','2026-04-28 06:42:54'),(8,'DH17769280348024969EE',1,'Nguyễn Hùng Thắng','hungthang0206@gmail.com','0359598204',120000.00,'VNPAY','that_bai','2026-04-23 07:07:15','2026-04-28 06:42:54'),(9,'DH1776928143353B524F8',1,'Nguyễn Hùng Thắng','hungthang0206@gmail.com','0359598204',120000.00,'VNPAY','da_thanh_toan','2026-04-23 07:09:03','2026-04-23 07:09:37'),(10,'DH17776152973478B3FFF',1,'Nguyễn Hùng Thắng','hungthang0206@gmail.com','0359598204',30000.00,'VNPAY','da_huy','2026-05-01 06:01:37','2026-05-01 06:02:58'),(11,'DH17777115030350834CD',7,'Thành viên ba','thanhvienba@gmail.com','0359598204',210000.00,'VNPAY','da_thanh_toan','2026-05-02 08:45:03','2026-05-02 08:45:53'),(12,'DH17777119267451083D5',8,'Thành viên bốn','thanhvienbon@gmail.com','0359598204',330000.00,'VNPAY','da_thanh_toan','2026-05-02 08:52:07','2026-05-02 08:53:00'),(13,'DH17777125198959CD0D1',9,'Thành viên năm','thanhviennam@gmail.com','0359598204',330000.00,'VNPAY','da_thanh_toan','2026-05-02 09:02:00','2026-05-02 09:02:57');
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
  `phuong_thuc` varchar(20) DEFAULT NULL,
  `trang_thai` varchar(20) NOT NULL,
  `ma_giao_dich_ngoai` varchar(100) DEFAULT NULL,
  `phan_hoi` text,
  `ngay_thanh_toan` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`ma_gd`),
  KEY `idx_id_dh` (`id_dh`),
  KEY `idx_trang_thai` (`trang_thai`),
  CONSTRAINT `giao_dich_thanh_toan_ibfk_1` FOREIGN KEY (`id_dh`) REFERENCES `don_hang` (`id_dh`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `giao_dich_thanh_toan`
--

LOCK TABLES `giao_dich_thanh_toan` WRITE;
/*!40000 ALTER TABLE `giao_dich_thanh_toan` DISABLE KEYS */;
INSERT INTO `giao_dich_thanh_toan` VALUES (1,3,410000.00,'VNPAY','that_bai','0','Mã lỗi: 24','2026-04-21 07:06:17'),(2,4,410000.00,'VNPAY','that_bai','15510395','Mã lỗi: 00','2026-04-23 06:59:28'),(3,5,410000.00,'VNPAY','that_bai','0','Mã lỗi: 24','2026-04-23 07:00:02'),(4,6,410000.00,'VNPAY','that_bai','15510413','Mã lỗi: 00','2026-04-23 07:01:12'),(5,9,120000.00,'VNPAY','thanh_cong','15510449','Giao dịch thành công','2026-04-23 07:09:37'),(6,10,30000.00,'VNPAY','thanh_cong','15518697','Giao dịch thành công','2026-05-01 06:02:34'),(7,11,210000.00,'VNPAY','thanh_cong','15519548','Giao dịch thành công','2026-05-02 08:45:53'),(8,12,330000.00,'VNPAY','thanh_cong','15519557','Giao dịch thành công','2026-05-02 08:53:00'),(9,13,330000.00,'VNPAY','thanh_cong','15519565','Giao dịch thành công','2026-05-02 09:02:57');
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
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
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
  `vai_tro` varchar(255) DEFAULT NULL,
  `noi_dung` text NOT NULL,
  `y_dinh` varchar(50) DEFAULT NULL,
  `ngay_tao` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`ma_lschat`),
  KEY `idx_ma_nd` (`ma_nd`),
  KEY `idx_ma_phien` (`ma_phien`),
  KEY `idx_ngay_tao` (`ngay_tao`),
  CONSTRAINT `lich_su_chat_ibfk_1` FOREIGN KEY (`ma_nd`) REFERENCES `nguoi_dung` (`ma_nd`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=87 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lich_su_chat`
--

LOCK TABLES `lich_su_chat` WRITE;
/*!40000 ALTER TABLE `lich_su_chat` DISABLE KEYS */;
INSERT INTO `lich_su_chat` VALUES (1,NULL,'session_1776584312763_r5mggez','user','tôi muốn tìm kiếm 1 cuốn sách về nấu ăn',NULL,'2026-04-19 07:39:14'),(2,NULL,'session_1776584312763_r5mggez','bot','Xin lỗi, tôi đang gặp sự cố kỹ thuật. Vui lòng thử lại sau.',NULL,'2026-04-19 07:39:15'),(3,NULL,'session_1776584390131_69d4eqt','user','Tìm sách văn học',NULL,'2026-04-19 07:39:56'),(4,NULL,'session_1776584390131_69d4eqt','bot','Xin lỗi, tôi đang gặp sự cố kỹ thuật. Vui lòng thử lại sau.',NULL,'2026-04-19 07:39:56'),(5,NULL,'session_1776584408406_g9kimcf','user','Gói hội viên là gì?',NULL,'2026-04-19 07:40:14'),(6,NULL,'session_1776584408406_g9kimcf','bot','Xin lỗi, tôi đang gặp sự cố kỹ thuật. Vui lòng thử lại sau.',NULL,'2026-04-19 07:40:15'),(7,NULL,'session_1776584408406_g9kimcf','user','tôi muốn tìm kiếm 1 cuốn sách về nấu ăn',NULL,'2026-04-19 07:40:36'),(8,NULL,'session_1776584408406_g9kimcf','bot','Xin lỗi, tôi đang gặp sự cố kỹ thuật. Vui lòng thử lại sau.',NULL,'2026-04-19 07:40:36'),(9,NULL,'session_1776584563075_q8m2imw','user','Gói hội viên là gì?',NULL,'2026-04-19 07:44:34'),(10,NULL,'session_1776584563075_q8m2imw','bot','Xin lỗi, tôi đang gặp sự cố kỹ thuật. Vui lòng thử lại sau.',NULL,'2026-04-19 07:44:35'),(11,NULL,'session_1776584563075_q8m2imw','user','tôi muốn tìm kiếm 1 cuốn sách về nấu ăn',NULL,'2026-04-19 07:44:53'),(12,NULL,'session_1776584563075_q8m2imw','bot','Xin lỗi, tôi đang gặp sự cố kỹ thuật. Vui lòng thử lại sau.',NULL,'2026-04-19 07:44:53'),(13,NULL,'session_1776584861371_ce32s8p','user','Gói hội viên là gì?',NULL,'2026-04-19 07:48:42'),(14,NULL,'session_1776584861371_ce32s8p','bot','Xin lỗi, tôi đang gặp sự cố kỹ thuật. Vui lòng thử lại sau.',NULL,'2026-04-19 07:48:43'),(15,NULL,'session_1776584861371_ce32s8p','user','tôi muốn tìm 1 cuốn sách về nấu ăn',NULL,'2026-04-19 07:49:09'),(16,NULL,'session_1776584861371_ce32s8p','bot','Xin lỗi, tôi đang gặp sự cố kỹ thuật. Vui lòng thử lại sau.',NULL,'2026-04-19 07:49:09'),(17,NULL,'session_1776585271046_ihgvenv','user','Gói hội viên là gì?',NULL,'2026-04-19 07:54:37'),(18,NULL,'session_1776585271046_ihgvenv','bot','Xin lỗi, tôi đang gặp sự cố kỹ thuật. Vui lòng thử lại sau.',NULL,'2026-04-19 07:54:38'),(19,NULL,'session_1776585271046_ihgvenv','user','1 cuốn sách về nấu ăn',NULL,'2026-04-19 07:54:50'),(20,NULL,'session_1776585271046_ihgvenv','bot','Xin lỗi, tôi đang gặp sự cố kỹ thuật. Vui lòng thử lại sau.',NULL,'2026-04-19 07:54:50'),(21,NULL,'session_1776585271046_ihgvenv','user','1 cuốn sách về nấu ăn',NULL,'2026-04-19 07:56:32'),(22,NULL,'session_1776585271046_ihgvenv','bot','Xin lỗi, tôi đang gặp sự cố kỹ thuật. Vui lòng thử lại sau.',NULL,'2026-04-19 07:56:33'),(23,NULL,'session_1776585421229_5crl0s9','user','Gói hội viên là gì?',NULL,'2026-04-19 07:57:10'),(24,NULL,'session_1776585421229_5crl0s9','bot','Xin lỗi, tôi đang gặp sự cố kỹ thuật. Vui lòng thử lại sau.',NULL,'2026-04-19 07:57:10'),(25,NULL,'session_1776585421229_5crl0s9','user','1 cuốn sách về nấu ăn',NULL,'2026-04-19 07:57:20'),(26,NULL,'session_1776585421229_5crl0s9','bot','Xin lỗi, tôi đang gặp sự cố kỹ thuật. Vui lòng thử lại sau.',NULL,'2026-04-19 07:57:20'),(27,NULL,'session_1776585648336_72p3lm4','user','Tìm sách văn học',NULL,'2026-04-19 08:01:01'),(28,NULL,'session_1776585648336_72p3lm4','bot','Xin lỗi, tôi đang gặp sự cố kỹ thuật. Vui lòng thử lại sau.',NULL,'2026-04-19 08:01:02'),(29,NULL,'session_1776585648336_72p3lm4','user','sách về công nghệ thông tin',NULL,'2026-04-19 08:01:24'),(30,NULL,'session_1776585648336_72p3lm4','bot','Xin lỗi, tôi đang gặp sự cố kỹ thuật. Vui lòng thử lại sau.',NULL,'2026-04-19 08:01:25'),(31,NULL,'session_1776585901626_8qziq7e','user','Tìm sách văn học',NULL,'2026-04-19 08:05:10'),(32,NULL,'session_1776585901626_8qziq7e','bot','Xin lỗi, tôi đang gặp sự cố kỹ thuật. Vui lòng thử lại sau.',NULL,'2026-04-19 08:05:11'),(33,NULL,'session_1776585901626_8qziq7e','user','sách về công nghệ thông tin',NULL,'2026-04-19 08:05:24'),(34,NULL,'session_1776585901626_8qziq7e','bot','Xin lỗi, tôi đang gặp sự cố kỹ thuật. Vui lòng thử lại sau.',NULL,'2026-04-19 08:05:25'),(35,NULL,'session_1776586301464_b3m0hns','user','Gói hội viên là gì?',NULL,'2026-04-19 08:11:47'),(36,NULL,'session_1776586301464_b3m0hns','bot','Xin lỗi, tôi đang gặp sự cố kỹ thuật. Vui lòng thử lại sau.',NULL,'2026-04-19 08:11:48'),(37,NULL,'session_1776586301464_b3m0hns','user','sách về công nghệ thông tin',NULL,'2026-04-19 08:12:03'),(38,NULL,'session_1776586301464_b3m0hns','bot','Xin lỗi, tôi đang gặp sự cố kỹ thuật. Vui lòng thử lại sau.',NULL,'2026-04-19 08:12:03'),(39,NULL,'session_1776586564524_9pvzowk','user','Gói hội viên là gì?',NULL,'2026-04-19 08:17:05'),(40,NULL,'session_1776586564524_9pvzowk','bot','Xin lỗi, tôi đang gặp sự cố kỹ thuật. Vui lòng thử lại sau.',NULL,'2026-04-19 08:17:06'),(41,NULL,'session_1776586564524_9pvzowk','user','sách công nghệ thông tin',NULL,'2026-04-19 08:17:13'),(42,NULL,'session_1776586564524_9pvzowk','bot','Xin lỗi, tôi đang gặp sự cố kỹ thuật. Vui lòng thử lại sau.',NULL,'2026-04-19 08:17:14'),(43,NULL,'session_1776587112378_ar708ws','user','Gói hội viên là gì?',NULL,'2026-04-19 08:25:18'),(44,NULL,'session_1776587112378_ar708ws','bot','Xin lỗi, tôi đang gặp sự cố kỹ thuật. Vui lòng thử lại sau.',NULL,'2026-04-19 08:25:19'),(45,NULL,'session_1776587112378_ar708ws','user','sách công nghệ thông tin',NULL,'2026-04-19 08:25:31'),(46,NULL,'session_1776587112378_ar708ws','bot','Xin lỗi, tôi đang gặp sự cố kỹ thuật. Vui lòng thử lại sau.',NULL,'2026-04-19 08:25:31'),(47,NULL,'session_1776587579594_90k51ir','user','Hướng dẫn mua sách',NULL,'2026-04-19 08:33:11'),(48,NULL,'session_1776587579594_90k51ir','bot','Xin lỗi, tôi đang gặp sự cố kỹ thuật. Vui lòng thử lại sau.',NULL,'2026-04-19 08:33:12'),(49,NULL,'session_1776587579594_90k51ir','user','sách công nghệ thông tin',NULL,'2026-04-19 08:37:38'),(50,NULL,'session_1776587579594_90k51ir','bot','Xin lỗi, tôi đang gặp sự cố kỹ thuật. Vui lòng thử lại sau.',NULL,'2026-04-19 08:37:38'),(51,NULL,'session_1776587579594_90k51ir','user','Hướng dẫn mua sách',NULL,'2026-04-19 08:37:53'),(52,NULL,'session_1776587579594_90k51ir','bot','Xin lỗi, tôi đang gặp sự cố kỹ thuật. Vui lòng thử lại sau.',NULL,'2026-04-19 08:37:53'),(53,NULL,'session_1776588411073_em7c4oq','user','Tìm sách văn học',NULL,'2026-04-19 08:47:00'),(54,NULL,'session_1776588411073_em7c4oq','bot','Xin lỗi, tôi đang gặp sự cố kỹ thuật. Vui lòng thử lại sau.',NULL,'2026-04-19 08:47:01'),(55,NULL,'session_1776588411073_em7c4oq','user','sách công nghệ thông tin',NULL,'2026-04-19 08:47:25'),(56,NULL,'session_1776588411073_em7c4oq','bot','Xin lỗi, tôi đang gặp sự cố kỹ thuật. Vui lòng thử lại sau.',NULL,'2026-04-19 08:47:25'),(57,NULL,'session_1776588580021_0xt2bvl','user','Hướng dẫn mua sách',NULL,'2026-04-19 08:49:49'),(58,NULL,'session_1776588580021_0xt2bvl','bot','Xin lỗi, tôi đang gặp sự cố kỹ thuật. Vui lòng thử lại sau.',NULL,'2026-04-19 08:49:50'),(59,NULL,'session_1776750397825_ajh7obx','user','Tìm sách văn học',NULL,'2026-04-21 05:47:53'),(60,NULL,'session_1776750397825_ajh7obx','bot','Xin lỗi, tôi đang gặp sự cố kỹ thuật. Vui lòng thử lại sau.',NULL,'2026-04-21 05:47:54'),(61,NULL,'session_1776750397825_ajh7obx','user','1 cuốn sách về nấu ănn',NULL,'2026-04-21 05:48:11'),(62,NULL,'session_1776750397825_ajh7obx','bot','Xin lỗi, tôi đang gặp sự cố kỹ thuật. Vui lòng thử lại sau.',NULL,'2026-04-21 05:48:12'),(63,NULL,'session_1776751987333_eszbnzi','user','Tìm sách văn học',NULL,'2026-04-21 06:13:19'),(64,NULL,'session_1776751987333_eszbnzi','bot','Xin lỗi, tôi đang gặp sự cố kỹ thuật. Vui lòng thử lại sau.',NULL,'2026-04-21 06:13:26'),(65,1,'session_1776751987333_eszbnzi','user','1 cuốn sách về nấu ăn',NULL,'2026-04-21 06:17:28'),(66,1,'session_1776751987333_eszbnzi','bot','Chào bạn! BookNest có nhiều sách về nấu ăn lắm. Bạn có muốn tôi tìm giúp không?','nấu ăn','2026-04-21 06:17:31'),(67,1,'session_1776751987333_eszbnzi','user','có, tìm giúp tôi',NULL,'2026-04-21 06:17:42'),(68,1,'session_1776751987333_eszbnzi','bot','Xin lỗi, tôi đang gặp sự cố kỹ thuật. Vui lòng thử lại sau.',NULL,'2026-04-21 06:17:43'),(69,1,'session_1776751987333_eszbnzi','user','có, tìm giúp tôi',NULL,'2026-04-21 06:18:05'),(70,1,'session_1776751987333_eszbnzi','bot','```json\n{\n  \"van_ban\": \"Tuyệt vời! BookNest sẽ tìm giúp bạn những cuốn sách hay về nấu ăn nhé. Bạn có muốn tìm sách nấu ăn theo một loại hình cụ thể nào không (ví dụ: món Á, món Âu, món chay, làm bánh...)?\",\n  \"tu_khoa_tim_kiem\": \"nấu ăn\",\n  \"y_dinh\": \"nấu ăn\"\n}\n```',NULL,'2026-04-21 06:18:07'),(71,1,'session_1776752944948_jhfgbzm','user','tâm trạng buồn thì nên đọc sách gì bạn?',NULL,'2026-04-21 06:29:41'),(72,1,'session_1776752944948_jhfgbzm','bot','Chào bạn, khi tâm trạng không tốt, bạn có thể tìm đến những cuốn sách truyền cảm hứng, tiểu thuyết nhẹ nhàng hoặc sách self-help để tìm sự an ủi và động lực nhé. BookNest có rất nhiều lựa chọn phù hợp để giúp bạn cảm thấy tốt hơn đó ạ!',NULL,'2026-04-21 06:29:48'),(73,1,'session_1776752944948_jhfgbzm','user','tim giúp tôi sách về thể loại cổ tích đi ạ',NULL,'2026-04-21 06:30:38'),(74,1,'session_1776752944948_jhfgbzm','bot','Chào bạn, BookNest có rất nhiều sách thuộc thể loại cổ tích đáng yêu đấy ạ. Để mình tìm giúp bạn nhé!','cổ tích','2026-04-21 06:30:40'),(75,1,'session_1776752944948_jhfgbzm','user','tìm giúp tôi đi',NULL,'2026-04-21 06:30:56'),(76,1,'session_1776752944948_jhfgbzm','bot','Chắc chắn rồi! BookNest có rất nhiều tựa sách cổ tích hay để bạn khám phá. Bạn muốn mình gợi ý thêm không ạ?','cổ tích','2026-04-21 06:30:58'),(77,1,'session_1776752944948_jhfgbzm','user','gợi ý thêm giúp tôi',NULL,'2026-04-21 06:31:09'),(78,1,'session_1776752944948_jhfgbzm','bot','Chào bạn, với thể loại cổ tích, bạn có thể tham khảo những tác phẩm kinh điển như \'Truyện cổ Andersen\', \'Truyện cổ Grimm\', hay \'Nghìn lẻ một đêm\'. BookNest có đủ cả đó ạ! Bạn có muốn mình tìm chi tiết từng cuốn không?','cổ tích','2026-04-21 06:31:12'),(79,1,'session_1776927007085_2anvzsc','user','Tìm sách văn học',NULL,'2026-04-23 06:51:16'),(80,1,'session_1776927007085_2anvzsc','bot','Chào bạn! Để tìm sách văn học, bạn có thể nhập \"văn học\" vào ô tìm kiếm trên trang chủ BookNest nhé. Chúc bạn tìm được những tác phẩm ưng ý!','văn học','2026-04-23 06:51:19'),(81,1,'session_1776927007085_2anvzsc','user','tìm giúp tôi 1 cuốn được không ạ',NULL,'2026-04-23 06:51:38'),(82,1,'session_1776927007085_2anvzsc','bot','Tuyệt vời! BookNest có thể gợi ý cho bạn cuốn \"Tắt đèn\" của Ngô Tất Tố, một tác phẩm văn học kinh điển Việt Nam. Bạn có muốn BookNest tìm thêm theo chủ đề hay tác giả cụ thể nào trong văn học không?','văn học','2026-04-23 06:51:44'),(83,1,'session_1776927830355_uhp3542','user','Tìm sách văn học',NULL,'2026-04-23 07:04:15'),(84,1,'session_1776927830355_uhp3542','bot','Xin lỗi, tôi đang gặp sự cố kỹ thuật. Vui lòng thử lại sau.',NULL,'2026-04-23 07:04:17'),(85,1,'session_1776927830355_uhp3542','user','tìm giúp tôi sách về nấu ăn',NULL,'2026-04-23 07:04:34'),(86,1,'session_1776927830355_uhp3542','bot','Chào bạn, BookNest có nhiều đầu sách hay về chủ đề nấu ăn. Bạn muốn tìm sách công thức, ẩm thực vùng miền hay kỹ thuật nấu ăn cụ thể nào không?','nấu ăn','2026-04-23 07:04:38');
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
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ma_otp`
--

LOCK TABLES `ma_otp` WRITE;
/*!40000 ALTER TABLE `ma_otp` DISABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nguoi_dung`
--

LOCK TABLES `nguoi_dung` WRITE;
/*!40000 ALTER TABLE `nguoi_dung` DISABLE KEYS */;
INSERT INTO `nguoi_dung` VALUES (1,'Nguyễn Hùng Thắng','hungthang0206@gmail.com','0359598204','$2a$10$kBcn1so3jKnSM0W5laLRlOb0W.fR4ZFELgVLAGtYXA3Zbxqy7vyhe',1,'hoat_dong',0,NULL,'2026-05-01 11:31:13','2026-03-27 06:25:56','2026-05-01 11:31:13'),(2,'Admin','admin@booknest.com','0359598204','$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LPZMkHPaE2W',2,'hoat_dong',0,NULL,NULL,'2026-03-27 13:28:57','2026-04-04 13:44:17'),(3,'Xuân Diệu','xuandieu@gmail.com','0359598204','$2a$10$96LumqIai6xx.eO0epuereu4Z1YQwfAwHUrBRaLKo.sNX1okg4TJm',2,'hoat_dong',0,NULL,'2026-05-02 09:03:41','2026-03-27 13:31:13','2026-05-02 09:03:41'),(4,'thành viên ','thanhvien@gmail.com','0359598204','$2a$10$VriG295ctX83fV5sLzNE4.MgDj51nCaKf0ykpYbmJxbGy9SvNsU8a',1,'hoat_dong',0,NULL,NULL,'2026-03-31 02:14:08','2026-03-31 02:14:08'),(5,'thành viên một','hungthang@gmail.com','0359598204','$2a$10$cpYMwGXOoMMu5qG7vQMbfO6vBaRwvFmNQqczwLdN4S1SkmUjmxLQa',1,'hoat_dong',0,NULL,NULL,'2026-04-02 07:24:36','2026-04-04 13:43:37'),(6,'thành viên hai','hungthang01@gmail.com','0359598204','$2a$10$DUsODdU11GZP0xT7RAWRhONd5IRMU.Q2UhkCAnvLSKKAisqi6CCFK',1,'hoat_dong',0,NULL,NULL,'2026-04-02 07:33:56','2026-04-04 13:43:37'),(7,'Thành viên ba','thanhvienba@gmail.com','0359598204','$2a$12$gnvRKlTQjq7.njZoW9wko.R7NX91Ap6L3TCEIlptp6LlJYNkP5Fjm',1,'hoat_dong',0,NULL,'2026-05-02 08:50:05','2026-03-01 08:00:00','2026-05-02 08:50:05'),(8,'Thành viên bốn','thanhvienbon@gmail.com','0359598204','$2a$12$gnvRKlTQjq7.njZoW9wko.R7NX91Ap6L3TCEIlptp6LlJYNkP5Fjm',1,'hoat_dong',0,NULL,'2026-05-02 08:51:32','2026-03-03 08:00:00','2026-05-02 08:51:32'),(9,'Thành viên năm','thanhviennam@gmail.com','0359598204','$2a$12$gnvRKlTQjq7.njZoW9wko.R7NX91Ap6L3TCEIlptp6LlJYNkP5Fjm',1,'hoat_dong',0,NULL,'2026-05-02 09:01:13','2026-03-04 08:00:00','2026-05-02 09:01:13'),(10,'Thành viên sáu','thanhviensau@gmail.com','0359598204','$2a$12$gnvRKlTQjq7.njZoW9wko.R7NX91Ap6L3TCEIlptp6LlJYNkP5Fjm',1,'hoat_dong',0,NULL,NULL,'2026-03-06 08:00:00','2026-05-02 00:05:26'),(11,'Thành viên bảy','thanhvienbay@gmail.com','0359598204','$2a$12$gnvRKlTQjq7.njZoW9wko.R7NX91Ap6L3TCEIlptp6LlJYNkP5Fjm',1,'hoat_dong',0,NULL,NULL,'2026-03-09 08:00:00','2026-05-02 00:05:26'),(12,'Thành viên tám','thanhvientam@gmail.com','0359598204','$2a$12$gnvRKlTQjq7.njZoW9wko.R7NX91Ap6L3TCEIlptp6LlJYNkP5Fjm',1,'hoat_dong',0,NULL,NULL,'2026-03-11 08:00:00','2026-05-02 00:05:26'),(13,'Thành viên chín','thanhvienchin@gmail.com','0359598204','$2a$12$gnvRKlTQjq7.njZoW9wko.R7NX91Ap6L3TCEIlptp6LlJYNkP5Fjm',1,'hoat_dong',0,NULL,NULL,'2026-03-18 08:00:00','2026-05-02 00:05:26'),(14,'Thành viên mười','thanhvienmuoi@gmail.com','0359598204','$2a$12$gnvRKlTQjq7.njZoW9wko.R7NX91Ap6L3TCEIlptp6LlJYNkP5Fjm',1,'hoat_dong',0,NULL,NULL,'2026-03-21 08:00:00','2026-05-02 00:05:26'),(15,'TV mười một','tvmuoimot@gmail.com','0359598204','$2a$12$gnvRKlTQjq7.njZoW9wko.R7NX91Ap6L3TCEIlptp6LlJYNkP5Fjm',1,'hoat_dong',0,NULL,NULL,'2026-03-22 08:00:00','2026-05-02 00:05:26'),(16,'TV mười hai','tvmuoihai@gmail.com','0359598204','$2a$12$gnvRKlTQjq7.njZoW9wko.R7NX91Ap6L3TCEIlptp6LlJYNkP5Fjm',1,'hoat_dong',0,NULL,NULL,'2026-03-27 08:00:00','2026-05-02 00:05:26'),(17,'TV mười ba','tvmuoiba@gmail.com','0359598204','$2a$12$gnvRKlTQjq7.njZoW9wko.R7NX91Ap6L3TCEIlptp6LlJYNkP5Fjm',1,'hoat_dong',0,NULL,NULL,'2026-03-30 08:00:00','2026-05-02 00:05:26'),(18,'TV mười bốn','tvmuoibon@gmail.com','0359598204','$2a$12$gnvRKlTQjq7.njZoW9wko.R7NX91Ap6L3TCEIlptp6LlJYNkP5Fjm',1,'hoat_dong',0,NULL,NULL,'2026-04-06 08:00:00','2026-05-02 00:05:26'),(19,'TV mười lăm','tvmuoilam@gmail.com','0359598204','$2a$12$gnvRKlTQjq7.njZoW9wko.R7NX91Ap6L3TCEIlptp6LlJYNkP5Fjm',1,'hoat_dong',0,NULL,NULL,'2026-04-06 08:00:00','2026-05-02 00:05:26'),(20,'TV mười sáu','tvmuoisau@gmail.com','0359598204','$2a$12$gnvRKlTQjq7.njZoW9wko.R7NX91Ap6L3TCEIlptp6LlJYNkP5Fjm',1,'hoat_dong',0,NULL,NULL,'2026-04-08 08:00:00','2026-05-02 00:05:26'),(21,'TV mười bảy','tvmuoibay@gmail.com','0359598204','$2a$12$gnvRKlTQjq7.njZoW9wko.R7NX91Ap6L3TCEIlptp6LlJYNkP5Fjm',1,'hoat_dong',0,NULL,NULL,'2026-04-10 08:00:00','2026-05-02 00:05:26'),(22,'TV mười tám','tvmuoitam@gmail.com','0359598204','$2a$12$gnvRKlTQjq7.njZoW9wko.R7NX91Ap6L3TCEIlptp6LlJYNkP5Fjm',1,'hoat_dong',0,NULL,NULL,'2026-04-10 08:00:00','2026-05-02 00:05:26'),(23,'TV mười chín','tvmuoichin@gmail.com','0359598204','$2a$12$gnvRKlTQjq7.njZoW9wko.R7NX91Ap6L3TCEIlptp6LlJYNkP5Fjm',1,'hoat_dong',0,NULL,NULL,'2026-04-12 08:00:00','2026-05-02 00:05:26'),(24,'TV hai mươi','tvhaimuoi@gmail.com','0359598204','$2a$12$gnvRKlTQjq7.njZoW9wko.R7NX91Ap6L3TCEIlptp6LlJYNkP5Fjm',1,'hoat_dong',0,NULL,NULL,'2026-04-15 08:00:00','2026-05-02 00:05:26'),(25,'TV hai mốt','tvhaimot@gmail.com','0359598204','$2a$12$gnvRKlTQjq7.njZoW9wko.R7NX91Ap6L3TCEIlptp6LlJYNkP5Fjm',1,'hoat_dong',0,NULL,NULL,'2026-04-16 08:00:00','2026-05-02 00:05:26'),(26,'TV hai hai','tvhaihai@gmail.com','0359598204','$2a$12$gnvRKlTQjq7.njZoW9wko.R7NX91Ap6L3TCEIlptp6LlJYNkP5Fjm',1,'hoat_dong',0,NULL,'2026-05-01 17:50:31','2026-04-16 08:00:00','2026-05-01 17:50:31'),(27,'TV hai ba','tvhaiba@gmail.com','0359598204','$2a$12$gnvRKlTQjq7.njZoW9wko.R7NX91Ap6L3TCEIlptp6LlJYNkP5Fjm',1,'hoat_dong',0,NULL,NULL,'2026-04-20 08:00:00','2026-05-02 00:05:26'),(28,'TV hai tu','tvhaitu@gmail.com','0359598204','$2a$12$gnvRKlTQjq7.njZoW9wko.R7NX91Ap6L3TCEIlptp6LlJYNkP5Fjm',1,'hoat_dong',0,NULL,NULL,'2026-04-23 08:00:00','2026-05-02 00:05:26'),(29,'TV hai lăm','tvhailam@gmail.com','0359598204','$2a$12$gnvRKlTQjq7.njZoW9wko.R7NX91Ap6L3TCEIlptp6LlJYNkP5Fjm',1,'hoat_dong',0,NULL,NULL,'2026-04-24 08:00:00','2026-05-02 00:05:26'),(30,'TV hai sáu','tvhaisau@gmail.com','0359598204','$2a$12$gnvRKlTQjq7.njZoW9wko.R7NX91Ap6L3TCEIlptp6LlJYNkP5Fjm',1,'hoat_dong',0,NULL,NULL,'2026-04-24 08:00:00','2026-05-02 00:05:26'),(31,'TV hai bảy','tvhaibay@gmail.com','0359598204','$2a$12$gnvRKlTQjq7.njZoW9wko.R7NX91Ap6L3TCEIlptp6LlJYNkP5Fjm',1,'hoat_dong',0,NULL,NULL,'2026-04-27 08:00:00','2026-05-02 00:05:26'),(32,'TV hai tám','tvhaitam@gmail.com','0359598204','$2a$12$gnvRKlTQjq7.njZoW9wko.R7NX91Ap6L3TCEIlptp6LlJYNkP5Fjm',1,'hoat_dong',0,NULL,NULL,'2026-04-29 08:00:00','2026-05-02 00:05:26'),(33,'TV hai chín','tvhaichin@gmail.com','0359598204','$2a$12$gnvRKlTQjq7.njZoW9wko.R7NX91Ap6L3TCEIlptp6LlJYNkP5Fjm',1,'hoat_dong',0,NULL,NULL,'2026-04-29 08:00:00','2026-05-02 00:05:26'),(34,'TV ba mươi','tvbamuoi@gmail.com','0359598204','$2a$12$gnvRKlTQjq7.njZoW9wko.R7NX91Ap6L3TCEIlptp6LlJYNkP5Fjm',1,'hoat_dong',0,NULL,NULL,'2026-04-30 08:00:00','2026-05-02 00:05:26');
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
  `so_luong_da_ban` int DEFAULT '0',
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
) ENGINE=InnoDB AUTO_INCREMENT=53 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sach`
--

LOCK TABLES `sach` WRITE;
/*!40000 ALTER TABLE `sach` DISABLE KEYS */;
INSERT INTO `sach` VALUES (1,'206 Món Canh Dinh Dưỡng Cho Trẻ Em','Mai Ngọc','Nội dung bao gồm:Canh cá chép mã thầy, Canh táo đậu đen hầm cá chép, Canh gà đảng sâm, Canh gà bí đao, Canh long nhãn hạt sen, Canh bạch cập ý dĩ thịt nạc, Canh bí đao ý dĩ thịt nạc, Canh rong đỏ rau câu,...',50000.00,'https://booknest-books.s3.ap-southeast-2.amazonaws.com/covers/351cdd27-397e-4fff-afee-c67d9b1e87b0_book1.jpg','https://booknest-books.s3.ap-southeast-2.amazonaws.com/books/7f076c3d-8252-4429-ad68-4b7e53345f17_book1.pdf',1,5,10,0,0.00,0,NULL,'2026-03-27 07:46:54','2026-04-23 14:04:47'),(2,'120 Món Súp Bổ Dưỡng Cho Trẻ Em Và Người Bệnh','Mỹ Hạnh','120 món súp bổ dưỡng cho trẻ em & người bệnh với một số món ăn như: 1. Các món súp cho trẻ em 2. Các món súp cho người bệnh ....',40000.00,'https://booknest-books.s3.ap-southeast-2.amazonaws.com/covers/132ddfa4-7e92-41f6-bc7a-dd457a11d73d_book2.jpg','https://booknest-books.s3.ap-southeast-2.amazonaws.com/books/8a2a3d20-25e3-4f96-9699-f257830ebf3b_book2.pdf',1,5,24,0,0.00,0,NULL,'2026-03-30 01:12:53','2026-05-02 15:28:52'),(3,'Món Ăn Giúp Trẻ Thông Minh Học Giỏi','Nhật Nguyên','Cuốn sách “Món ăn giúp trẻ thông minh học giỏi” xin giới thiệu các loại thực phẩm thông dụng hàng ngày, các món ăn bổ dưỡng giúp trẻ nhỏ thêm linh lợi, hoạt bát, giúp sĩ tử thêm vững tin trước các kỳ thi đầy gian nan.',0.00,'https://booknest-books.s3.ap-southeast-2.amazonaws.com/covers/cbd38cbb-7115-4908-b0b3-7037f5eae5d4_book3.jpg','https://booknest-books.s3.ap-southeast-2.amazonaws.com/books/1e71b4ff-155c-4779-8cd7-04d6a4345083_book3.pdf',1,5,31,0,0.00,0,NULL,'2026-03-30 01:16:39','2026-04-27 21:23:22'),(4,'Thực Đơn Dinh Dưỡng Cho Bé Từ 1 Đến 3 Tuổi','Hồng Yến','Về năng lượng, trẻ cần khoảng 100 -110kcal/kg cân nặng mỗi ngày,được cung cấp qua các bữa ăn như bột, cháo, cơm nát, bún.. . Nấu với các loại thức ăn cung cấp chất đạm như: Thịt, trứng, cá, tôm.. . Ngoài ra, dầu mỡ trong bữa ăn cũng là nguồn cung cấp năng lượng quan trọng. Một ngày trẻ nên ăn 150 – 200g gạo, nếu đã dùng bún, mỳ, phở, thì rút bớt gạo đi',0.00,'https://booknest-books.s3.ap-southeast-2.amazonaws.com/covers/f943f548-6cd3-4261-8c88-e1d74561f918_book4.jpg','https://booknest-books.s3.ap-southeast-2.amazonaws.com/books/0afc4a6d-3754-4d6a-94be-b5ddb03aec55_book4.pdf',1,5,3,0,4.00,0,NULL,'2026-03-30 01:19:15','2026-05-01 11:33:09'),(5,'Những Món Cơm Ngon Đặc Sắc','Tiểu Quỳnh','Bữa cơm gia đình Việt Nam vốn có hàm nghĩa là sum vầy, đầm ấm, tượng trưng cho ý nghĩa đẹp nhất của một gia đình hạnh phúc. Ngày nay, cùng với sự phát triển của đất nước, chúng ta chẳng những đã có những bữa cơm no mà còn có những bữa cơm ngon với kỹ thuật chế biến đẹp mắt hơn.',0.00,'https://booknest-books.s3.ap-southeast-2.amazonaws.com/covers/490287b0-e95b-418d-8c53-a0c03a8ce21a_book5.jpg','https://booknest-books.s3.ap-southeast-2.amazonaws.com/books/69647037-0852-4582-a0eb-6599214b5c37_book5.pdf',1,5,1,0,0.00,0,NULL,'2026-03-30 01:20:43','2026-04-04 13:11:59'),(6,'Những Món Ăn Chay Nổi Tiếng','Thiên Kim','Thực ra, các món chay không chỉ ngon miệng, cung cấp đủ chất dinh dưỡng mà còn dễ thực hiện. “Những món ăn chay nổi tiếng” là cẩm nang ẩm thực chay hoàn hảo, nó hấp dẫn ngay cả những người ăn mặn đã từng cho rằng ăn chay là thiếu dinh dưỡng. Cuốn sách hướng dẫn bạn làm các món chay từ khai vị đến tráng miệng. Bạn hãy thử chọn một thực đơn cho bữa ăn gia đình mà bạn ưa thích. Sự ngạc nhiên và ngon miệng của mọi người chắc chắn sẽ dành cho bạn. Rồi bạn sẽ làm cho họ “ghiền” ăn chay bởi tài chế biến của bạn qua các món chay nổi tiếng này! ',0.00,'https://booknest-books.s3.ap-southeast-2.amazonaws.com/covers/75c896e6-58d1-4bb8-a89d-c682853af2b5_book6.jpg','https://booknest-books.s3.ap-southeast-2.amazonaws.com/books/03cfab1f-2e23-4601-9ba3-f13479cef0ae_book6.pdf',1,5,10,0,0.00,0,NULL,'2026-03-30 01:22:06','2026-04-13 20:38:42'),(7,'Những Món Ngon Việt Nam (Song Ngữ Trung – Việt)','Ưng Đông Dương','Đối với người Việt, bữa ăn không chỉ để no. Bữa ăn còn là cơ hội sum họp giữa các thành viên trong gia đình hay gặp gỡ bạn bè, đồng nghiệp trong bầu không khí thân mật, ấm cúng. Những năm gần đây, không chỉ ở Việt Nam mà nhiều nơi trên thế giới chú trọng đến bữa ăn gia đình nhiều hơn, vì ăn uống không chỉ đem lại cho ta sức khỏe mà thưởng thức món ăn còn là niềm vui. Nấu ăn không chỉ là công việc mà còn là một thú tiêu khiển. Trong nhà bếp của gia đình Việt Nam thường có sẵn nhiều loại gia vị, các loại dưa chua, dưa kiệu, trứng cũng như cá khô, tôm khô và nấm khô dự trữ sẵn để tiện sử dụng.',40000.00,'https://booknest-books.s3.ap-southeast-2.amazonaws.com/covers/5ed59c9c-467c-4b28-a356-190494392617_book7.jpg','https://booknest-books.s3.ap-southeast-2.amazonaws.com/books/b8e700d3-d41b-454c-adcd-677f15419838_book7.pdf',1,5,0,0,0.00,0,NULL,'2026-03-30 01:24:19','2026-03-30 01:24:19'),(8,'Thức Uống Và Thạch Trái Cây Đặc Sắc','Vũ Văn Lân','Thạch là một món ăn ngon, bổ, mát rất có lợi cho sức khỏe. Từ xưa đến nay ta vẫn thường dùng loại rau câu sợi hoặc rau câu bột (agar) để làm những món thạch đơn giản như: thạch lá dứa nước dừa, thạch cà phê, rau câu vân thủy, rau câu trứng gà.',80000.00,'https://booknest-books.s3.ap-southeast-2.amazonaws.com/covers/1a8ed579-3239-441d-aa75-4a6ee46524dc_book8.jpg','https://booknest-books.s3.ap-southeast-2.amazonaws.com/books/19538127-28d3-4b91-a951-7c8c3c3bca00_book8.pdf',1,5,4,0,0.00,0,NULL,'2026-03-30 01:26:44','2026-04-08 22:22:44'),(9,'Văn Hóa Ẩm Thực Ninh Bình','Lê Thanh Xuân','Ninh Bình là một trong những tỉnh nằm ở vùng duyên hải thuộc châu thổ sông Hồng, có những nét đặc thù riêng của nền văn minh lúa nước, của văn hoá sông Hồng, trong đó có văn hoá ẩm thực. Và ở mỗi vùng miền trên dải đất này lại có những món đặc sản riêng không chỉ hợp khẩu vị với người dân sở tại mà còn làm cho nhiều du khách cả trong nước và Quốc tế đến đây thích thú, say lòng.',120000.00,'https://booknest-books.s3.ap-southeast-2.amazonaws.com/covers/4b4545d2-5326-40c0-accd-94a0d440f4b5_book9.jpg','https://booknest-books.s3.ap-southeast-2.amazonaws.com/books/92c38eab-a8b0-4e1b-82ad-5e3e5153107d_book9.pdf',1,5,30,0,0.00,0,NULL,'2026-03-30 08:02:25','2026-05-02 16:03:29'),(10,'Nghệ Thuật Pha Chế 460 Loại Rượu Cocktail','Bàng Cẩm','Hướng dẫn cách pha chế rượu – cocktail cho các dịp khác nhau như: đồ uống trước bữa tối; đồ uống sau bữa tối; đồ uống ít chất bổ; đồ uống thời tiết nóng…Giới thiệu tủ đựng cocktail, các loại cockatil, cocktail trái cây và cocktail không có chất rượu…',120000.00,'https://booknest-books.s3.ap-southeast-2.amazonaws.com/covers/24792852-686c-4500-bff3-c14945aec4d7_book10.jpg','https://booknest-books.s3.ap-southeast-2.amazonaws.com/books/af44df93-9c2e-434e-8952-6d238becbf66_book10.pdf',1,5,17,0,0.00,0,NULL,'2026-03-30 08:03:34','2026-05-02 15:54:57'),(11,'Kỹ Thuật Chế Biến Các Món Lẩu Và Súp','Tiểu Quỳnh','Trong cuộc sống hiện nay, món lẩu và món súp đã và đang là những món ăn ngon, hợp khẩu vị, lịch sự và rất phổ biến trong các gia đình ở nước ta mỗi khi tổ chức liên hoan hay các dịp lễ tết',90000.00,'https://booknest-books.s3.ap-southeast-2.amazonaws.com/covers/af6e19df-dbd2-4b33-97ea-59d8fccdf347_book11.jpg','https://booknest-books.s3.ap-southeast-2.amazonaws.com/books/e60af291-d211-4294-a323-de0ce5da4263_book11.pdf',1,5,11,0,0.00,0,NULL,'2026-03-30 08:04:44','2026-05-01 18:26:45'),(12,'Kỹ Thuật Chế Biến Các Món Lẩu Xốt Súp','Nhật Nguyên','Món lẩu, món xốt, món súp, (phụ gia) đã và đang là những món ăn ngon, hợp khẩu vị, lịch sự và rất phổ biến trong các gia đình Việt mỗi khi tổ chức liên hoan hay các dịp lễ tế. Cuốn sách được biên soạn với mục đích giúp các bạn nội trợ chế biến được các món lẩu và súp, ngon, lạ miệng và hấp dẫn:',30000.00,'https://booknest-books.s3.ap-southeast-2.amazonaws.com/covers/628d2267-fcd6-4c1b-92b4-abcb0f99e702_book12.jpg','https://booknest-books.s3.ap-southeast-2.amazonaws.com/books/a1434d44-f4d4-4b13-a637-3970abd49b25_book12.pdf',1,5,0,0,0.00,0,NULL,'2026-03-30 08:06:11','2026-03-30 08:06:11'),(13,'10 Huyền Thoại Viking Hay Nhất Mọi Thời Đại','Michael Cox','10 Huyền Thoại Viking Hay Nhất Mọi Thời Đại được trình bày dưới nhiều hình thức khác nhau. Sau mỗi huyền thoại lại có những dữ liệu kỳ thú liên quan đến chủ đề.',0.00,'https://booknest-books.s3.ap-southeast-2.amazonaws.com/covers/673fae91-8f5f-45cc-971e-91629a92b71e_book13.jpg','https://booknest-books.s3.ap-southeast-2.amazonaws.com/books/3bc85357-d82f-42e9-b5a3-c81c03088c6e_book13.pdf',1,5,0,0,0.00,0,NULL,'2026-03-30 08:08:11','2026-03-30 08:08:11'),(14,'10 Huyền Thoại Hy Lạp Hay Nhất Mọi Thời Đại','Terry Deary','10 Huyền Thoại Hy Lạp Hay Nhất Mọi Thời Đại được trình bày dưới nhiều hình thức khác nhau. Sau mỗi huyền thoại lại có những dữ liệu kỳ thú liên quan đến chủ đề.',0.00,'https://booknest-books.s3.ap-southeast-2.amazonaws.com/covers/85f0d595-7b74-4b64-85ec-710a0e69ef13_book14.jpg','https://booknest-books.s3.ap-southeast-2.amazonaws.com/books/0f4483c3-dabb-4643-b463-faa4c7364ee1_book14.pdf',1,5,0,0,0.00,0,NULL,'2026-03-30 08:09:40','2026-03-30 08:09:40'),(15,'Truyện Kể Tây Tạng','Lưu Hồng Hà','Truyện kể Tây Tạng là tuyển tập gồm 39 truyện dân gian Tây Tạng được lưu truyền hàng ngàn năm trong ký ức dân gian. Mỗi câu chuyện là một huyền thoại đẹp, một sự tích hay một ngụ ngôn về những thói tật của con người… nhưng cuối cùng, điều đọng lại trong lòng người đọc là khát vọng hướng thiện và bản sắc Tây Tạng đậm nét trong mỗi truyện kể.',0.00,'https://booknest-books.s3.ap-southeast-2.amazonaws.com/covers/6a325985-b211-4fa3-aada-097ec33ea2f9_book15.jpg','https://booknest-books.s3.ap-southeast-2.amazonaws.com/books/bd92bf7c-ba2c-4fc1-9d85-4b766ab0e12b_book13.pdf',1,5,3,0,0.00,0,NULL,'2026-03-30 08:10:59','2026-04-08 22:22:05'),(16,'365 Chuyện Kể Hàng Đêm – Mùa Thu','Lep Tônxtoi','Trước giờ đi ngủ, cả gia đình quây quần bên nhau cùng đọc một vài câu chuyện để khơi lên sức sống mơn mởn của mùa xuân, thưởng lãm không gian khoáng đạt của mùa hè, thả hồn mơ mộng cùng sắc thu hay cảm động cùng dư vị ấm áp giữa mùa đông… không chỉ tạo bầu không khí gia đình hạnh phúc mà còn là hành trang sống theo bé đi suốt cuộc đời.',30000.00,'https://booknest-books.s3.ap-southeast-2.amazonaws.com/covers/f1dfba12-1653-40bf-bd54-fe51a8bc3655_book16.jpg','https://booknest-books.s3.ap-southeast-2.amazonaws.com/books/96f25dea-8546-448b-bcfd-25d61c87cfe1_book16.pdf',1,5,1,0,0.00,0,NULL,'2026-03-30 08:12:19','2026-04-23 14:11:28'),(17,'Buratino Và Chiếc Chìa Khoá Vàng','Hermann Hesse','Bác thợ mộc Giudéppơ tình cờ nhặt được một thanh củi biết nói, bác liền tặng thanh củi đó cho ông bạn già Cáclô. Bác Cáclô đem món quà kỳ lạ về nhà và gọt thành một con búp bê gỗ đặt tên là Buratinô. Một con búp bê trông giống hệt một cậu bé với cái mũi thật dài. Buratinô trong sáng, thông minh nhưng rất hiếu động và nghịch ngợm. Cũng chính vì tính hiếu động đó mà cậu bé đã gây nên cho mình không ít rắc rối. Trong một lần trốn học đi chơi, Buratino bị Mèo Madilio và Cáo Alixa lừa lấy mất tiền và bị bọn cướp tấn công. Lạc mất gia đình, cậu bé người gỗ bắt đầu bước vào những chuyến phiêu lưu đầy kỳ thú, bất ngờ nhưng cũng không ít nguy hiểm và sóng gió. Đặc biệt là cuộc hành trình khám bí mật về chiếc chìa khóa vàng mà Buratino được chú rùa Toóctila tặng cho…',200000.00,'https://booknest-books.s3.ap-southeast-2.amazonaws.com/covers/51a65dd1-5b35-46bd-b548-932ddb14d83a_book17.jpg','https://booknest-books.s3.ap-southeast-2.amazonaws.com/books/2c0e6e32-a5a5-4f21-9824-6f346edc03b1_book17.pdf',1,5,0,0,0.00,0,NULL,'2026-03-30 08:13:25','2026-03-30 08:13:25'),(18,'Huệ Tím Và Những Chuyện Khác','Terry Deary','Những câu chuyện cổ tích không có hình ảnh hoàng tử, công chúa, không kể theo lối bình dân mà được đẩy lên thành nghệ thuật.',130000.00,'https://booknest-books.s3.ap-southeast-2.amazonaws.com/covers/bd177ad7-7693-455f-a7ef-96dc2ce5be20_book18.jpg','https://booknest-books.s3.ap-southeast-2.amazonaws.com/books/594a4dce-2fc0-4aae-927c-390bd630dd8c_book18.pdf',1,5,0,0,0.00,0,NULL,'2026-03-30 08:15:12','2026-03-30 08:15:12'),(19,'108 Truyện Ngụ Ngôn Hay Nhất','Terry Deary','Ngụ ngôn là những truyện ngắn thường mượn chuyện loài vật để nói về việc đời nhằm dẫn đến những đạo lý, kinh nghiệm sống. 108 truyện ngụ ngôn là 108 câu chuyện chủ yếu của các con vật: Rùa học bay, Ngựa và Lừa, Chó nhà và Sói, Muỗi và Sư tử… và rất nhiều chuyện ngụ ngôn khác. Mỗi câu chuyện đó là mỗi một bài học cho đến giờ vẫn còn nguyên giá trị. Vậy những câu chuyện về các con vật đó dạy chúng ta điều gì?',40000.00,'https://booknest-books.s3.ap-southeast-2.amazonaws.com/covers/4b233cc4-6d80-447f-97f5-5e7ab1fb64f2_book12.jpg','https://booknest-books.s3.ap-southeast-2.amazonaws.com/books/2b027b83-11b5-48b0-a7a6-e02e696e1aac_book19.pdf',1,5,0,0,0.00,0,NULL,'2026-03-30 08:16:36','2026-03-30 08:16:36'),(20,'100 Mẩu Chuyện Cổ Đông Tây','Lep Tônxtoi','100 mẩu chuyện cổ Đông Tây kể về những mẫu người tiêu biểu trong cổ sử của Hi Lạp, La Mã và Trung Quốc, những cái nôi của văn minh nhân loại. Những gương sáng đó sẽ giúp cho mỗi người khi soi vào có thể hoặc tu tỉnh, hoặc cố vươn lên những đỉnh cao của đạo làm người.',30000.00,'https://booknest-books.s3.ap-southeast-2.amazonaws.com/covers/0d3a3ba5-ab63-4b3a-b481-0481ad011f97_book20.jpg','https://booknest-books.s3.ap-southeast-2.amazonaws.com/books/e10642a1-6ae0-4b5c-a8a2-b16442eaca88_book20.pdf',1,5,0,0,0.00,0,NULL,'2026-03-30 08:17:47','2026-03-30 08:17:47'),(21,'Công Nghệ Blockchain','Vũ Hữu Tiệp','Blockchain là chủ đề đang vô cùng nóng trên toàn cầu hiện nay. Nó cùng với Bitcoin và tiền kỹ thuật số trở thành đề tài bàn luận trên rất nhiều mặt báo và trong những cuộc trò chuyện của mọi người. Tuy nhiên, khi nói về blockchain vẫn còn nhiều tranh cãi. Có người lo lắng rằng Bitcoin có thể chỉ là bong bóng, nhiều người cho rằng công nghệ phía sau nó là một sự đột phá, và công nghệ ấy sẽ tiếp tục con đường của mình cho đến khi được chấp nhận và tích hợp với Internet.',0.00,'https://booknest-books.s3.ap-southeast-2.amazonaws.com/covers/e87bf161-d28b-4344-80a6-e706b4078b77_book21.jpg','https://booknest-books.s3.ap-southeast-2.amazonaws.com/books/c2e9af95-3133-41a0-8ee4-9748145578e8_book21.pdf',1,5,3,0,0.00,0,NULL,'2026-03-30 13:08:41','2026-04-08 22:22:21'),(22,'Machine Learning Cơ Bản','Olga Filipova','Những năm gần đây, AI – Artificial Intelligence (Trí Tuệ Nhân Tạo), và cụ thể hơn là Machine Learning (Học Máy hoặc Máy Học) nổi lên như một bằng chứng của cuộc cách mạng công nghiệp lần thứ tư (1 – động cơ hơi nước, 2 – năng lượng điện, 3 – công nghệ thông tin). Trí Tuệ Nhân Tạo đang len lỏi vào mọi lĩnh vực trong đời sống mà có thể chúng ta không nhận ra. Xe tự hành của Google và Tesla, hệ thống tự tag khuôn mặt trong ảnh của Facebook, trợ lý ảo Siri của Apple, hệ thống gợi ý sản phẩm của Amazon, hệ thống gợi ý phim của Netflix, máy chơi cờ vây AlphaGo của Google DeepMind, …, chỉ là một vài trong vô vàn những ứng dụng của AI/Machine Learning.',0.00,'https://booknest-books.s3.ap-southeast-2.amazonaws.com/covers/b048aefb-8e10-4c33-9449-b02efc07a53b_book22.jpg','https://booknest-books.s3.ap-southeast-2.amazonaws.com/books/a3ddc12e-1cda-4355-ace8-b5b4d770a33e_book22.pdf',1,5,3,0,0.00,0,NULL,'2026-03-30 13:09:41','2026-04-08 22:20:35'),(23,'Learning Vue.js 2','Nathan Wu','Olga Filipova là một lập trình viên có kinh nghiệm trong phát triển fontend, chính vì vậy các nội dung được viết ra trong Learning Vue.js 2 là rất sát với thực tế. Bản thân Olga Filipova cũng đang quản lý một dự án về học trực tuyến, do vậy các phần trong sách được kiến trúc có tính sư phạm cao. Với mỗi vấn đề đều có phần dẫn dắt và các ví dụ thực hành giúp cho việc nắm bắt các kiến thức framework Vue.js 2 trở lên dễ dàng.',0.00,'https://booknest-books.s3.ap-southeast-2.amazonaws.com/covers/7494df7d-a4cb-4f55-8b1a-c4ae7ddbc754_book23.jpg','https://booknest-books.s3.ap-southeast-2.amazonaws.com/books/8fb4781d-c2a6-4fd6-a5ca-5f27c8fcc807_book23.pdf',1,5,0,0,0.00,0,NULL,'2026-03-30 13:11:07','2026-03-30 13:11:07'),(24,'Laravel 5 Cookbook Enhance Your Amazing Applications','Adam Freeman','Learning Laravel 5: Building Practical Applications is the easiest way to learn web development using Laravel. Throughout 5 chapters, instructor Nathan Wu will teach you how to build many real-world applications from scratch. This bestseller is also completely about you. It has been structured very carefully, teaching you all you need to know from installing your Laravel 5.1 app to deploying it to a live server.',0.00,'https://booknest-books.s3.ap-southeast-2.amazonaws.com/covers/ffbbf37a-1f17-4e35-9ec7-89e84db14394_book24.jpg','https://booknest-books.s3.ap-southeast-2.amazonaws.com/books/3feca6ec-e7b8-4fa3-8a3e-c88db7280bf7_book24.pdf',1,5,0,0,0.00,0,NULL,'2026-03-30 13:12:13','2026-03-30 13:12:13'),(25,'Pro ASP.NET MVC 5','Emmett Dulaney','The ASP.NET MVC 5 Framework is the latest evolution of Microsoft’s ASP.NET web platform. It provides a high-productivity programming model that promotes cleaner code architecture, test-driven development, and powerful extensibility, combined with all the benefits of ASP.NET.',0.00,'https://booknest-books.s3.ap-southeast-2.amazonaws.com/covers/d5adb12d-0009-473d-a97e-0d39a3233276_book25.jpg','https://booknest-books.s3.ap-southeast-2.amazonaws.com/books/8119a866-6a51-486f-bbe1-6c650bb6741a_book25.pdf',1,5,0,0,0.00,0,NULL,'2026-03-30 13:13:27','2026-03-30 13:13:27'),(26,'Programming ASP.NET MVC 4','Vũ Hữu Tiệp','Get up and running with ASP.NET MVC 4, and learn how to build modern server-side web applications. This guide helps you understand how the framework performs, and shows you how to use various features to solve many real-world development scenarios you’re likely to face. In the process, you’ll learn how to work with HTML, JavaScript, the Entity Framework, and other web technologies.',0.00,'https://booknest-books.s3.ap-southeast-2.amazonaws.com/covers/b8736870-d364-4882-a655-5ad24418a3a8_book26.jpg','https://booknest-books.s3.ap-southeast-2.amazonaws.com/books/d0ae13d5-9f55-4bff-99f9-b52780314b35_book26.pdf',1,5,0,0,0.00,0,NULL,'2026-03-30 13:14:28','2026-03-30 13:14:28'),(27,'Linux All-In-One For Dummies – 5Th Edition','Olga Filipova','Linux All-in-One For Dummies giải thích mọi thứ bạn cần để bắt đầu và chạy với hệ điều hành Linux phổ biến. Được viết trong phong cách thân thiện và dễ tiếp cận, cuốn sách lý tưởng cho người mới dùng Linux và người đã có một ít kinh nghiệm với hệ điều hành này, cũng như bất kỳ ai đang học chứng chỉ Linux cấp độ 1. Bốn phần bên trong sách bao gồm các vấn đề cơ bản của Linux, làm sao để tương tác với nó, các vấn đề về mạng, dịch vụ Internet, quản trị, bảo mật, kịch bản scripting và chứng chỉ cấp 1.',100000.00,'https://booknest-books.s3.ap-southeast-2.amazonaws.com/covers/d8ea2c71-8ac9-4f79-af4c-69567b7d0d50_book27.jpg','https://booknest-books.s3.ap-southeast-2.amazonaws.com/books/815505d4-ee76-4ea3-aed0-1551bfc26d09_book27.pdf',1,5,0,0,0.00,0,NULL,'2026-03-30 13:15:28','2026-03-30 13:15:28'),(28,'Giải Thuật Và Lập Trình','Nathan Wu','Nếu bạn là người đam mê tin học, nếu bạn là người muốn khám phá về lập trình, hẳn bạn phải biết đến một cuốn sách tin học rất nổi tiếng ở Việt Nam trong nhiều năm trở lại đây. Từ những học sinh không chuyên đến những thành viên đội tuyển thi quốc tế tin học, có lẽ không một ai chưa từng học qua cuốn sách được biên soạn bởi một thầy giáo trẻ những đầy tài năng của trường Đại học Sư phạm Hà Nội, thầy Lê Minh Hoàng.',120000.00,'https://booknest-books.s3.ap-southeast-2.amazonaws.com/covers/6f0c41be-2e5a-4c9c-bfed-869bd9b5fe7a_book28.jpg','https://booknest-books.s3.ap-southeast-2.amazonaws.com/books/5291eba2-df6d-4b45-8b9d-de34e33854b5_book28.pdf',1,5,0,0,0.00,0,NULL,'2026-03-30 13:16:27','2026-03-30 13:16:27'),(29,'Beginning Programming With Java For Dummies – 4Th Edition','Adam Freeman','Beginning Programming with Java For Dummies, 4th Edition is a comprehensive guide to learning one of the most popular programming languages worldwide. This book covers basic development concepts and techniques through a Java lens. Youll learn what goes into a program, how to put the pieces together, how to deal with challenges, and how to make it work. The new Fourth Edition has been updated to align with Java 8, and includes new options for the latest tools and techniques.',70000.00,'https://booknest-books.s3.ap-southeast-2.amazonaws.com/covers/0cd11bf7-1fcc-4898-bdca-4a50569a9df7_book29.jpg','https://booknest-books.s3.ap-southeast-2.amazonaws.com/books/5a1590aa-a386-424f-9084-c6a2ceafe988_book29.pdf',1,5,0,0,0.00,0,NULL,'2026-03-30 13:17:21','2026-03-30 13:17:21'),(30,'Php, Mysql, Javascript & Html5 All-In-One For Dummies','Emmett Dulaney','PHP, JavaScript, and HTML5 are essential programming languages for creating dynamic websites that work with the MySQL database. PHP and MySQL provide a robust, easy-to-learn, open-source solution for creating superb e-commerce sites and content management. JavaScript and HTML5 add support for the most current multimedia effects. This one-stop guide gives you what you need to know about all four! Seven self-contained minibooks cover web technologies, HTML5 and CSS3, PHP programming, MySQL databases, JavaScript, PHP with templates, and web applications.',90000.00,'https://booknest-books.s3.ap-southeast-2.amazonaws.com/covers/fed02fcb-5986-4ce0-bccd-964487432ce1_book30.jpg','https://booknest-books.s3.ap-southeast-2.amazonaws.com/books/e386ce36-9145-432b-9b0c-f6c3752e6573_book30.pdf',1,5,0,0,0.00,0,NULL,'2026-03-30 13:18:25','2026-03-30 13:18:25'),(31,'Tại sao ILA là lựa chọn TỐT NHẤT cho TƯƠNG LAI của con BẠN?','Nguyễn Thị Hà Bắc','Bạn đang tìm kiếm một trung tâm ngoại ngữ đẳng cấp quốc tế để con bạn phát triển toàn diện kỹ năng tiếng Anh? ILA chính là nơi biến ước mơ thành hiện thực! Với hơn 20 năm kinh nghiệm, ILA tự hào là trung tâm đào tạo tiếng Anh hàng đầu tại Việt Nam, nơi hàng triệu học viên đã đạt được thành công vượt mong đợi.',0.00,'https://booknest-books.s3.ap-southeast-2.amazonaws.com/covers/2be2429c-c8fb-430f-88c1-5fdf829091c0_book31.jpg','https://booknest-books.s3.ap-southeast-2.amazonaws.com/books/051dd7c2-314c-4d6a-8ab6-7326c392f3ca_book31.pdf',1,5,0,0,0.00,0,NULL,'2026-03-30 13:19:42','2026-03-30 13:19:42'),(32,'Tự Học Tiếng Anh Hiệu Quả','Bộ giáo dục và đào tạo','Nếu  như bạn  mong  muốn  giao  tiếp  tiếng  Anh  thành  thạo,  chuyên nghiệp từ 3 tới 6 tháng thì cuốn sách này sẽ làm bạn thất vọng. Thực tế cho thấy chưa có ai mới bắt đầu học tiếng  Anh có thể giao tiếp được trôi chảy trong thời gian từ 3 – 6 tháng. Đó là ảo tưởng. Nhưng nếu như bạn đang tìm kiếm làm như thế nào có thể sử dụng tiếng Anh giao tiếp thành thạo, chuyên nghiệp trong 1 năm tới thì xin chúc mừng  bạn.  Tôi tin rằng  những  bí  mật  được tiết  lộ  trong  cuốn sách này sẽ làm bạn thỏa mãn với điều đó. ',0.00,'https://booknest-books.s3.ap-southeast-2.amazonaws.com/covers/7b0bacc3-7f49-4424-9371-4a1dd50207c5_book32.jpg','https://booknest-books.s3.ap-southeast-2.amazonaws.com/books/737a70ac-f499-40a5-90fa-74b6ab804c68_book32.pdf',1,5,0,0,0.00,0,NULL,'2026-03-30 13:20:48','2026-03-30 13:20:48'),(33,'3000 Từ Vựng Tiếng Anh Thông Dụng Nhất','Jung min kyung','Từ vựng đóng một vai trò đặc biệt quan trọng, nhất là trong giao tiếp. Nhằm đáp ứng nhu cầu đó chúng tôi xin giới thiệu với bạn đọc cuốn 3000 Từ vựng Tiếng Anh thông dụng nhất. Cuốn sách bao gồm 3000 từ vựng căn bản và thông dụng nhất nhằm giúp các bạn nâng cao vốn từ vựng của mình.',0.00,'https://booknest-books.s3.ap-southeast-2.amazonaws.com/covers/4e7dc299-a41f-4451-9a79-6475faf7bb26_book33.jpg','https://booknest-books.s3.ap-southeast-2.amazonaws.com/books/386ad4e3-88b9-4275-ad4c-22c9600945f4_book33.pdf',1,5,0,0,0.00,0,NULL,'2026-03-30 13:21:43','2026-03-30 13:21:43'),(34,'360 Động Từ Bất Quy Tắc Và 12 Thì Cơ Bản Trong Tiếng Anh','NXB Từ điển bách khoa','Cuốn sách này như một người bạn luôn nhắc nhở bạn dùng chính xác các dạng nguyên thể, quá khứ và phân từ của động từ. Mỗi động từ chúng tôi có đưa ra ví dụ để bạn có thể hiểu đươc cách dùng của động từ đó.để nhớ và dùng các động từ bất quy tắc này một cách tốt nhất các bạn lên học thuộc các ví dụ, từ đó các bạn sẽ nhớ được tình huống và vận dụng các động từ này một cách hiệu quả nhất',0.00,'https://booknest-books.s3.ap-southeast-2.amazonaws.com/covers/701e6715-5724-4462-aa90-1644208adfef_book34.jpg','https://booknest-books.s3.ap-southeast-2.amazonaws.com/books/1f96c335-c8f6-4f02-b9fd-f34a5d8b624e_book34.pdf',1,5,0,0,0.00,0,NULL,'2026-03-30 13:22:35','2026-03-30 13:22:35'),(35,'Ngữ Pháp Tiếng Anh Ôn Thi Toeic','Gabriel Wyner','Đây là “Hệ thống ngữ pháp” chuẩn của Bộ giáo dục ban hàng trong loạt hệ thống kiến thức trọng tâm học ôn Toeic hiệu quả. Đúng như tên gọi, mục lớn này nhằm giúp người học biết, nắm bắt và hiểu một cách có hệ thống các chuyên đề ngữ pháp chính cần có để hoàn thành tốt bài thi Toeic mới với 2 phần chính là Nghe và Đọc.',0.00,'https://booknest-books.s3.ap-southeast-2.amazonaws.com/covers/b0090f98-0b18-4ecd-9e93-a899d498e2d5_book35.jpg','https://booknest-books.s3.ap-southeast-2.amazonaws.com/books/86d7d2c8-38b2-40e1-8a27-91735b82c243_book35.pdf',1,5,0,0,0.00,0,NULL,'2026-03-30 13:23:21','2026-03-30 13:23:21'),(36,'384 Tình Huống Thực Hành Đàm Thoại Tiếng Hàn','Nguyễn Thị Hà Bắc','Cuốn sách 384 tình huống thực hành đàm thoại tiếng Hàn với 192 mẫu câu cơ bản, ứng dụng được trong nhiều tình huống giao tiếp khác nhau. Mỗi mẫu câu đều có hai tình huống đàm thoại. Bạn nên học thuộc các mẫu câu đàm thoại này để hiểu cách vận dụng.',40000.00,'https://booknest-books.s3.ap-southeast-2.amazonaws.com/covers/5a0a69aa-43ea-40ad-a988-60da25d81509_book36.jpg','https://booknest-books.s3.ap-southeast-2.amazonaws.com/books/66697ca7-3cc4-4c24-a7bb-e016ba167868_book36.pdf',1,5,0,0,0.00,0,NULL,'2026-03-30 13:24:12','2026-03-30 13:24:12'),(37,'Ngữ Pháp Tiếng Hàn Cơ Bản','Bộ giáo dục và đào tạo','NGỮ PHÁP CƠ BẢN TIẾNG HÀN của tác giả Lê Huy Khoa, hệ thống một cách đầy đủ, chính xác và khoa học nhất các kiến thức cơ bản về ngữ pháp tiếng Hàn như danh từ, động từ, tính từ…',70000.00,'https://booknest-books.s3.ap-southeast-2.amazonaws.com/covers/6b06bc9f-a2cc-407f-987a-ba4cb28c4b98_book37.jpg','https://booknest-books.s3.ap-southeast-2.amazonaws.com/books/7a8f0152-c663-4f4a-b399-7e655d00116a_book37.pdf',1,5,0,0,0.00,0,NULL,'2026-03-30 13:25:19','2026-03-30 13:25:19'),(38,'Kanji Look And Learn N3 – N2: Bản Nhật Việt','Jung min kyung','Kanji look and learn N3, N2 – Bản Nhật Việt được biên soạn bắt nguồn từ quyển sách Kanji Pixtographic – là cuốn sách dạy Kanji ở trình độ trung cấp N3 và N2 bằng hình ảnh cực hay. Tuy nhiên điểm hạn chế của nó là trình bày không được khoa học như cuốn Kanji look and learn và hoàn toàn bằng tiếng Anh. Vậy nên, tác giả đã ghép lại các hình ảnh từ cuốn sách này và phối hợp ghép các hình ảnh có sẵn của quyển Kanji look and learn để tạo nên một quyển sách mới, hoàn toàn tiếng Việt với cách trình bày khoa học và vô cùng dễ học với cái tên là Kanji look and learn N23 phiên bản tiếng Việt',50000.00,'https://booknest-books.s3.ap-southeast-2.amazonaws.com/covers/e2f645c1-5702-4dc2-9d0a-7d26d1eb073a_book38.jpg','https://booknest-books.s3.ap-southeast-2.amazonaws.com/books/05c8f1ff-3865-4472-97f0-a992e605aced_book38.pdf',1,5,0,0,0.00,0,NULL,'2026-03-30 13:26:11','2026-03-30 13:26:11'),(39,'301 Câu Đàm Thoại Tiếng Hoa','NXB Từ điển bách khoa','Giáo trình 301 Câu Đàm Thoại Tiếng Hoa được xuất bản lần đầu tiên vào năm 1990. Năm 1998, sách được chỉnh sửa, tái bản và được xếp vào hệ thống giáo trình tiếng Trung Quốc dành cho người ngước ngoài (tủ sách tinh hoa) của trường Đại học ngôn ngữ Bắc Kinh.',90000.00,'https://booknest-books.s3.ap-southeast-2.amazonaws.com/covers/6c3327d4-5176-4c4c-ac64-ff81329db538_book39.jpg','https://booknest-books.s3.ap-southeast-2.amazonaws.com/books/7e715b34-6e40-477e-8ca5-c20fae233d0b_book39.pdf',1,5,0,0,0.00,0,NULL,'2026-03-30 13:42:32','2026-03-30 13:42:32'),(40,'Cách Học Ngoại Ngữ Nhanh Và Không Bao Giờ Quên','Gabriel Wyner','Fluent Forever là cách dạy bất cứ ngoại ngữ nào bạn muốn một cách nhanh nhất, hiệu quả nhất. Đây là tài liệu học ngoại ngữ được đánh giá cao nhất hiện nay trên toàn thế giới bới nó không đơn thuần là sách dạy ngoại ngữ mà là một cú đột phá tư duy xuất sắc để làm chủ não bộ. Ứng dụng tri thức về khoa học thần kinh, bạn không cần chờ đến một sự may mắn tình cờ hay cần mẫn quá sức để đưa thông tin cần thiết vào não bộ. Những gì bạn muốn sẽ thuận với tự nhiên lưu vào bộ nhớ. Bởi thế, không phải ngẫu nhiên, trang web fluent-forever.com trở thành một “hiện tượng mạng”, dạy ngoại ngữ cho 1,5 triệu người trên toàn thế giới và khiến hàng triệu người ham thích thử thách tư duy tìm đến.',100000.00,'https://booknest-books.s3.ap-southeast-2.amazonaws.com/covers/2a9c1b51-886f-4ccc-94a5-7a2186f5cab0_book40.jpg','https://booknest-books.s3.ap-southeast-2.amazonaws.com/books/d6ef712e-4471-44e1-b92e-e3a9db1f4d97_book40.pdf',1,5,0,0,0.00,0,NULL,'2026-03-30 13:43:42','2026-03-30 13:43:42'),(41,'Sách nói Cuộc đời và sự nghiệp Tổng thống Mỹ Abraham Lincoln','Jack Weatherford','Tổng thống thứ 16 của nước Mỹ Abraham Lincoln sinh ngày 12/2/1809 trong một gia đình nông dân nghèo ở hạt Hardin thuộc bang Kentucky của Mỹ. Năm 1816, cả gia đình chuyển tới bang Indiana với hy vọng đổi đời. Tuy nhiên, chỉ 2 năm sau đó, mẹ ông bất ngờ qua đời. Ít năm sau đó, cha ông tái hôn.',0.00,'https://booknest-books.s3.ap-southeast-2.amazonaws.com/covers/e71ccd27-f9e4-4194-a556-7f0fba27b25e_book41.jpg','https://booknest-books.s3.ap-southeast-2.amazonaws.com/books/c7af62a5-e9d5-433d-a6b0-ba48d7d237fc_book41.pdf',1,5,0,0,0.00,0,NULL,'2026-03-30 13:45:53','2026-03-30 13:45:53'),(42,'Thành Cát Tư Hãn Và Sự Hình Thành Thế Giới Hiện Đại','Ngô Thị  Giáng Uyên','Ở phương Tây, ta thường nghĩ Hy Lạp và La Mã là hai đế chế giúp dẫn đến sự phát triển của thế giới hiện đại. Mặt khác, đế chế Mông Cổ và Thành Cát Tư Hãn không được các sử gia phương Tây chú ý nhiều. Mỗi khi được nhắc đến, chủ đề này đều bị đặt trong một bối cảnh tiêu cực, với những câu chuyện về sự tàn bạo và hiếu chiến.',0.00,'https://booknest-books.s3.ap-southeast-2.amazonaws.com/covers/2f933a9c-b201-4bb4-8508-0293298b33cf_book42.jpg','https://booknest-books.s3.ap-southeast-2.amazonaws.com/books/a1577acb-1a69-4090-92a2-348c38546df5_book42.pdf',1,5,0,0,0.00,0,NULL,'2026-03-30 13:46:50','2026-03-30 13:46:50'),(43,'Bánh Mì Thơm, Cà Phê Đắng','Beatrice Sparks','Bánh Mì Thơm, Cà Phê Đắng như một cuốn sách tản mạn về những câu chuyện ăn uống nơi phương Tây lạnh giá, đồng thời còn là khám phá về những cảnh vật xung quanh, những con đường, những hàng phố, những dãy cây, những tòa nhà, kể cả những khung trời lộng gió trên tòa chung cư cao ngút',0.00,'https://booknest-books.s3.ap-southeast-2.amazonaws.com/covers/ed335196-f9a9-4f23-abfb-d8f89922ed25_book43.jpg','https://booknest-books.s3.ap-southeast-2.amazonaws.com/books/65f87b4d-daa3-4b02-91d8-8b0be2e2107e_book43.pdf',1,5,0,0,0.00,0,NULL,'2026-03-30 13:47:47','2026-03-30 13:47:47'),(44,'Nhật Ký Của Nancy','Zak Ebrahim','THEO YÊU CẦU CỦA GIA ĐÌNH NANCY, TOÀN BỘ TÊN NGƯỜI VÀ CÁC ĐỊA DANH TRONG TÁC PHẨM ĐÃ ĐƯỢC THAY ĐỔI HOÀN TOÀN.',0.00,'https://booknest-books.s3.ap-southeast-2.amazonaws.com/covers/e111e4b1-17ed-4020-b849-a47c0678a25e_book44.jpg','https://booknest-books.s3.ap-southeast-2.amazonaws.com/books/52613cca-86db-4c63-aa22-36156c037f6a_book44.pdf',1,5,0,0,0.00,0,NULL,'2026-03-30 13:48:41','2026-03-30 13:48:41'),(45,'Con Trai Kẻ Khủng Bố','Khánh Ly','Sẽ thế nào nếu bạn lớn lên cùng một gã khủng bố trong nhà?',0.00,'https://booknest-books.s3.ap-southeast-2.amazonaws.com/covers/2c3a755a-64a8-4c24-9e85-f0b228edc0b2_book45.jpg','https://booknest-books.s3.ap-southeast-2.amazonaws.com/books/1dae44ba-888c-4627-82f2-9a8c158ed3ef_book45.pdf',1,5,4,0,0.00,0,NULL,'2026-03-30 13:49:40','2026-04-08 22:21:33'),(46,'Đằng Sau Những Nụ Cười','Jack Weatherford','Nhắc đến cố nhạc sĩ tài hoa Trịnh Công Sơn, người ta lập tức nhắc đến Khánh Ly, người mà đến giờ chưa ai có thể thay thế trong dòng nhạc Trịnh. Lần đầu tiên, một quãng đời được chị chia sẻ cùng độc giả, khán giả của mình qua cuốn sách Đằng sau những nụ cười. Đó là cả một quãng thời gian 50 năm đi hát cũng như bôn ba khắp bốn phương của chị, thấp thoáng bóng dáng những người đàn ông mà theo chị “nợ cả cuộc đời”. Và dù đi đâu, làm gì, trong tim chị vẫn thiết tha cháy bỏng ước muốn “mãi mãi làm một người Việt Nam nguyên vẹn hình hài',55000.00,'https://booknest-books.s3.ap-southeast-2.amazonaws.com/covers/012ed730-86a9-40d2-84a5-89bc4e23e206_book46.jpg','https://booknest-books.s3.ap-southeast-2.amazonaws.com/books/23875c0e-340d-4f5a-bdcc-8646dbf4ce33_book46.pdf',1,5,0,0,0.00,0,NULL,'2026-03-30 13:50:42','2026-03-30 13:50:42'),(47,'Những Người Cùng Thời','Ngô Thị  Giáng Uyên','Trên diện bài khá rộng thuộc các lĩnh vực khoa học và công nghệ, văn hóa và văn chương – học thuật của Tạp chí Tia Sáng ngót 10 năm nay, có loạt bài viết về Chân dung, tôi rất ham đọc và mong đọc. ',200000.00,'https://booknest-books.s3.ap-southeast-2.amazonaws.com/covers/c8766ef0-6bf0-44c0-b85b-3965f675f3db_book47.jpg','https://booknest-books.s3.ap-southeast-2.amazonaws.com/books/69570321-745b-4a59-81d2-202b93ac383f_book47.pdf',1,5,6,0,0.00,0,NULL,'2026-03-30 13:51:41','2026-04-08 22:21:46'),(48,'Thomas Edison – Người Thắp Sáng Địa Cầu','Beatrice Sparks','Edison thời tiểu học bị cho là đứa trẻ chậm phát triển, lớn lên đối với văn minh nhân loại, có cống hiến rất vĩ đại như đèn điện, điện thoại, điện tín, xe điện, máy ghi âm, điện ảnh, máy thu thanh v.v…, hơn 1000 phát minh hoàn toàn nhờ vào tinh thần nghiên cứu siêu nhân, bền chí bền lòng và sự nổ lực không chịu lùi bước đã thành công. “Bền lòng bền gan là gốc của thành công. Người có chí việc ắt thành.”',100000.00,'https://booknest-books.s3.ap-southeast-2.amazonaws.com/covers/cd25c1e8-9c47-4d8d-9411-b75db4d38465_book48.jpg','https://booknest-books.s3.ap-southeast-2.amazonaws.com/books/571cf98e-119e-45a7-9f00-3af91ca5dbef_book48.pdf',1,5,1,0,0.00,0,NULL,'2026-03-30 13:52:31','2026-04-13 21:06:44'),(49,'Võ Nguyên Giáp – Chiến Thắng Bằng Mọi Giá','Zak Ebrahim','Sách viết về Đại tướng Võ Nguyên Giáp do Cecil B. Currey viết, sau khi thăm Việt Nam về năm 1997 đã được Đại tướng tiếp ở nhà riêng. Tác giả là giáo sư sử học đã giảng dạy lịch sử tại trường Đại học Nam Florida (Hoa Kỳ) được đánh giá là một trong những sử gia xuất sắc về lịch sử chiến tranh đã viết ba cuốn sách về Việt Nam. Tác giả dựa vào nhiều nguồn tư liệu của ta và cả của tình báo nước ngoài (có nhiều dữ kiện không đảm bảo chính xác, cần phải lược bỏ hoặc biên tập lại) tiếp xúc với nhiều cán bộ cao cấp trong và ngoài quân đội.',300000.00,'https://booknest-books.s3.ap-southeast-2.amazonaws.com/covers/c5fd945c-9db7-4987-9414-91381e2dfaba_book49.jpg','https://booknest-books.s3.ap-southeast-2.amazonaws.com/books/17c347c7-aeab-43de-89b1-0cb5238203d9_book49.pdf',1,5,15,0,0.00,0,NULL,'2026-03-30 13:53:46','2026-05-02 16:03:01'),(50,'Những Ngày Thơ Ấu','Khánh Ly','Người ta hay giấu giếm và che đậy sự thật, nhất là sự đáng buồn trong gia đình. Có lợi ích gì không?',120000.00,'https://booknest-books.s3.ap-southeast-2.amazonaws.com/covers/8819add9-8fe7-4694-9883-bc8764f355d2_book50.jpg','https://booknest-books.s3.ap-southeast-2.amazonaws.com/books/7d340ff3-9acd-49ab-aaec-4b6312c7d716_book50.pdf',1,5,0,0,0.00,0,NULL,'2026-03-30 13:54:42','2026-03-30 13:54:42'),(51,'sách test 1','abc','gfgfgf',0.00,'https://booknest-books.s3.ap-southeast-2.amazonaws.com/covers/3def69b3-d6db-4ab7-8166-c9f595d4fa9a_sachtest1.jpg','https://booknest-books.s3.ap-southeast-2.amazonaws.com/books/5ad7c253-3a42-4a32-a013-86d4bbc8acc9_sachtest1.pdf',1,5,0,0,0.00,1,'2026-04-02 15:06:41','2026-04-02 14:34:33','2026-04-02 15:06:41'),(52,'sách test11','abc','agfagag',0.00,'https://booknest-books.s3.ap-southeast-2.amazonaws.com/covers/d24b514d-daa7-4893-a591-31a488f23f94_sachtest1.jpg','https://booknest-books.s3.ap-southeast-2.amazonaws.com/books/db66736a-beea-483c-ae69-e5c5a3f2d170_sachtest2.pdf',1,5,0,0,0.00,1,'2026-04-02 15:23:20','2026-04-02 15:22:21','2026-04-02 15:23:20');
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
) ENGINE=InnoDB AUTO_INCREMENT=59 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
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
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sach_yeu_thich`
--

LOCK TABLES `sach_yeu_thich` WRITE;
/*!40000 ALTER TABLE `sach_yeu_thich` DISABLE KEYS */;
INSERT INTO `sach_yeu_thich` VALUES (6,1,3,'2026-04-08 15:04:49'),(7,1,11,'2026-04-08 15:20:15'),(8,1,22,'2026-04-08 15:20:34'),(9,1,10,'2026-04-08 15:21:22'),(10,1,45,'2026-04-08 15:21:33'),(11,1,47,'2026-04-08 15:21:47'),(12,1,15,'2026-04-08 15:22:05'),(13,1,21,'2026-04-08 15:22:20');
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
  `phan_tram` double DEFAULT NULL,
  `lan_doc_cuoi` datetime DEFAULT CURRENT_TIMESTAMP,
  `ngay_tao` datetime DEFAULT CURRENT_TIMESTAMP,
  `ngay_cap_nhat` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `phan_tram_hoan_thanh` double DEFAULT NULL,
  PRIMARY KEY (`ma_td`),
  UNIQUE KEY `unique_nguoi_dung_sach` (`ma_nd`,`ma_sach`),
  KEY `ma_sach` (`ma_sach`),
  CONSTRAINT `tien_do_doc_sach_ibfk_1` FOREIGN KEY (`ma_nd`) REFERENCES `nguoi_dung` (`ma_nd`) ON DELETE CASCADE,
  CONSTRAINT `tien_do_doc_sach_ibfk_2` FOREIGN KEY (`ma_sach`) REFERENCES `sach` (`ma_sach`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tien_do_doc_sach`
--

LOCK TABLES `tien_do_doc_sach` WRITE;
/*!40000 ALTER TABLE `tien_do_doc_sach` DISABLE KEYS */;
INSERT INTO `tien_do_doc_sach` VALUES (1,1,6,18,9.78,'2026-04-08 14:23:58','2026-04-06 07:32:37','2026-04-08 14:23:58',NULL),(2,1,3,5,6.49,'2026-04-08 15:04:35','2026-04-07 01:47:48','2026-04-08 15:04:35',NULL),(3,1,22,14,3.32,'2026-04-08 15:20:51','2026-04-08 15:20:51','2026-04-08 15:20:51',NULL),(4,1,45,19,22.89,'2026-04-08 15:21:43','2026-04-08 15:21:43','2026-04-08 15:21:43',NULL),(5,1,15,8,3.67,'2026-04-08 15:22:13','2026-04-08 15:22:13','2026-04-08 15:22:13',NULL),(6,1,21,6,37.5,'2026-04-08 15:22:28','2026-04-08 15:22:28','2026-04-08 15:22:28',NULL),(7,1,10,12,9.16,'2026-04-23 07:10:27','2026-04-23 07:10:26','2026-04-23 07:10:27',NULL),(8,7,49,7,1.84,'2026-05-02 08:50:51','2026-05-02 08:50:37','2026-05-02 08:50:51',NULL),(9,8,10,44,33.59,'2026-05-02 08:53:59','2026-05-02 08:53:59','2026-05-02 08:53:59',NULL);
/*!40000 ALTER TABLE `tien_do_doc_sach` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `token_blacklist`
--

DROP TABLE IF EXISTS `token_blacklist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `token_blacklist` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `het_han` datetime(6) NOT NULL,
  `token` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=68 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `token_blacklist`
--

LOCK TABLES `token_blacklist` WRITE;
/*!40000 ALTER TABLE `token_blacklist` DISABLE KEYS */;
INSERT INTO `token_blacklist` VALUES (1,'2026-04-01 02:05:28.000000','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJodW5ndGhhbmcwMjA2QGdtYWlsLmNvbSIsInZhaV90cm8iOiJ0aGFuaF92aWVuIiwiaWF0IjoxNzc0OTIyNzI4LCJleHAiOjE3NzUwMDkxMjh9.MEWR-iiRf_TAMbZZx6XUdGFJgFyGYD3OgB4Rx1qmam8'),(2,'2026-04-01 02:06:01.000000','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ4dWFuZGlldUBnbWFpbC5jb20iLCJ2YWlfdHJvIjoicXVhbl90cmkiLCJpYXQiOjE3NzQ5MjI3NjEsImV4cCI6MTc3NTAwOTE2MX0.r5eo2G4_ph0xR1w8txY1aHQLv1r1XAE2a-tG_S6CHK8'),(3,'2026-04-01 02:11:45.000000','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ4dWFuZGlldUBnbWFpbC5jb20iLCJ2YWlfdHJvIjoicXVhbl90cmkiLCJpYXQiOjE3NzQ5MjMxMDUsImV4cCI6MTc3NTAwOTUwNX0.1CGBR-lZKC9V4ftuNfoV1MpPOiQlZL8xOn52FA-lZy0'),(4,'2026-04-01 02:30:58.000000','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ4dWFuZGlldUBnbWFpbC5jb20iLCJ2YWlfdHJvIjoicXVhbl90cmkiLCJpYXQiOjE3NzQ5MjQyNTgsImV4cCI6MTc3NTAxMDY1OH0.xKUbgZwNADL8xm_g5TtUEekU1FNBr8-rflIq2NCYIlg'),(5,'2026-04-01 05:15:23.000000','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ4dWFuZGlldUBnbWFpbC5jb20iLCJ2YWlfdHJvIjoicXVhbl90cmkiLCJpYXQiOjE3NzQ5MzQxMjMsImV4cCI6MTc3NTAyMDUyM30.DgzbALMXACUyn5zjTxkc7bVgg6JvAv96pqyOQ4u4fr0'),(6,'2026-04-01 05:35:02.000000','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ4dWFuZGlldUBnbWFpbC5jb20iLCJ2YWlfdHJvIjoicXVhbl90cmkiLCJpYXQiOjE3NzQ5MzUzMDIsImV4cCI6MTc3NTAyMTcwMn0.BLl6I_UxWW3HhBDkIcF--Ka6G6sbJDNPhgOJkqgmU3c'),(7,'2026-04-01 05:40:26.000000','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ4dWFuZGlldUBnbWFpbC5jb20iLCJ2YWlfdHJvIjoicXVhbl90cmkiLCJpYXQiOjE3NzQ5MzU2MjYsImV4cCI6MTc3NTAyMjAyNn0.XGkYy1ju8Cu2w61KmTUctbKVN-MxupJR4B7A6U3l2Ng'),(8,'2026-04-01 05:46:57.000000','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ4dWFuZGlldUBnbWFpbC5jb20iLCJ2YWlfdHJvIjoicXVhbl90cmkiLCJpYXQiOjE3NzQ5MzYwMTcsImV4cCI6MTc3NTAyMjQxN30.GoZ5DV96CWHNRVSg_kiAG0VqE46oCpsBZjqXLfOXuWA'),(9,'2026-04-01 05:51:36.000000','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ4dWFuZGlldUBnbWFpbC5jb20iLCJ2YWlfdHJvIjoicXVhbl90cmkiLCJpYXQiOjE3NzQ5MzYyOTYsImV4cCI6MTc3NTAyMjY5Nn0.Bi4hQ8cPi3vQ5zwY-C5K-zccPaaDIxp--F4augWqV_4'),(10,'2026-04-01 05:54:39.000000','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ4dWFuZGlldUBnbWFpbC5jb20iLCJ2YWlfdHJvIjoicXVhbl90cmkiLCJpYXQiOjE3NzQ5MzY0NzksImV4cCI6MTc3NTAyMjg3OX0.OaGqFvorMe96fif8ZPxJVt10_2ZvTZdlAWBCu5nhNgI'),(11,'2026-04-03 07:37:18.000000','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJodW5ndGhhbmcwMjA2QGdtYWlsLmNvbSIsInZhaV90cm8iOiJ0aGFuaF92aWVuIiwiaWF0IjoxNzc1MTE1NDM4LCJleHAiOjE3NzUyMDE4Mzh9.osyPaWoXwPaCPWUZwst5iaGI42SOpwpq5t7SX9D7i-k'),(12,'2026-04-03 07:43:53.000000','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJodW5ndGhhbmcwMjA2QGdtYWlsLmNvbSIsInZhaV90cm8iOiJ0aGFuaF92aWVuIiwiaWF0IjoxNzc1MTE1ODMzLCJleHAiOjE3NzUyMDIyMzN9.w5jJbGh2FyhEMZCgik2qM-jwrgJS0lnSrq47Ixq1EaY'),(13,'2026-04-03 07:44:07.000000','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ4dWFuZGlldUBnbWFpbC5jb20iLCJ2YWlfdHJvIjoicXVhbl90cmkiLCJpYXQiOjE3NzUxMTU4NDcsImV4cCI6MTc3NTIwMjI0N30.wHKW00vqAVa7gcN603l6u5pZopE2rU9h134hC8LQy0U'),(14,'2026-04-03 07:53:09.000000','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ4dWFuZGlldUBnbWFpbC5jb20iLCJ2YWlfdHJvIjoicXVhbl90cmkiLCJpYXQiOjE3NzUxMTYzODksImV4cCI6MTc3NTIwMjc4OX0.HK4RzPAJ6MNw9EhUPjbA4-6vamiHxaLswn_GIdU3B44'),(15,'2026-04-03 08:17:17.000000','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ4dWFuZGlldUBnbWFpbC5jb20iLCJ2YWlfdHJvIjoicXVhbl90cmkiLCJpYXQiOjE3NzUxMTc4MzcsImV4cCI6MTc3NTIwNDIzN30.WFAQtD8TQr-YL2zuEWk3e5M5Xv6pAr8HpMuREIAmt3g'),(16,'2026-04-03 10:50:32.000000','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ4dWFuZGlldUBnbWFpbC5jb20iLCJ2YWlfdHJvIjoicXVhbl90cmkiLCJpYXQiOjE3NzUxMjcwMzIsImV4cCI6MTc3NTIxMzQzMn0.5rmUzXjIuOVKNkuRfer8avkNC94elSY7xcRBAxUji1w'),(17,'2026-04-03 11:16:36.000000','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ4dWFuZGlldUBnbWFpbC5jb20iLCJ2YWlfdHJvIjoicXVhbl90cmkiLCJpYXQiOjE3NzUxMjg1OTYsImV4cCI6MTc3NTIxNDk5Nn0.AOP90Iz0qwi3ZHyCjvHdEVgRLN2TCA3k6bnek6dQE8A'),(18,'2026-04-03 14:16:40.000000','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ4dWFuZGlldUBnbWFpbC5jb20iLCJ2YWlfdHJvIjoicXVhbl90cmkiLCJpYXQiOjE3NzUxMzk0MDAsImV4cCI6MTc3NTIyNTgwMH0.nEGR7tLtMJRzppg8zi-7-ws-_WXJRGDaFHulvI5NUYk'),(19,'2026-04-03 14:50:21.000000','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ4dWFuZGlldUBnbWFpbC5jb20iLCJ2YWlfdHJvIjoicXVhbl90cmkiLCJpYXQiOjE3NzUxNDE0MjEsImV4cCI6MTc3NTIyNzgyMX0.8rGxsw8qrcw_F37bp1n-jhYmctv_RAXFSAxFvGilLZ4'),(20,'2026-04-03 15:05:56.000000','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ4dWFuZGlldUBnbWFpbC5jb20iLCJ2YWlfdHJvIjoicXVhbl90cmkiLCJpYXQiOjE3NzUxNDIzNTYsImV4cCI6MTc3NTIyODc1Nn0.tKZCMR0vmHhM3MxZDn9wPL_zL7TbdFRISHK-7CAbGTM'),(21,'2026-04-05 02:07:47.000000','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJodW5ndGhhbmcwMjA2QGdtYWlsLmNvbSIsIm1hX25kIjoxLCJ2YWlfdHJvIjoidGhhbmhfdmllbiIsImlhdCI6MTc3NTI2ODQ2NywiZXhwIjoxNzc1MzU0ODY3fQ.6-qnlhUIBeqTPYL879dyxkDELmL8iC_U9bmbkCkRDBY'),(22,'2026-04-05 02:09:20.000000','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ4dWFuZGlldUBnbWFpbC5jb20iLCJtYV9uZCI6MywidmFpX3RybyI6InF1YW5fdHJpIiwiaWF0IjoxNzc1MjY4NTYwLCJleHAiOjE3NzUzNTQ5NjB9.ByR7W6m7ZdYLlNxNRDc8rhUQ7sDdElXhbkfHG1wqhgg'),(23,'2026-04-05 02:14:19.000000','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJodW5ndGhhbmcwMjA2QGdtYWlsLmNvbSIsIm1hX25kIjoxLCJ2YWlfdHJvIjoidGhhbmhfdmllbiIsImlhdCI6MTc3NTI2ODg1OSwiZXhwIjoxNzc1MzU1MjU5fQ.y_TII4R8zp_L0nkSeI7k0zYVoRzGS754RyyVs9oV1xw'),(24,'2026-04-05 02:17:46.000000','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ4dWFuZGlldUBnbWFpbC5jb20iLCJtYV9uZCI6MywidmFpX3RybyI6InF1YW5fdHJpIiwiaWF0IjoxNzc1MjY5MDY2LCJleHAiOjE3NzUzNTU0NjZ9.zNlIv2B2PJrVzbFixNKct4kUnCwuljDhsb-zPncpBYo'),(25,'2026-04-05 02:32:37.000000','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJodW5ndGhhbmcwMjA2QGdtYWlsLmNvbSIsIm1hX25kIjoxLCJ2YWlfdHJvIjoidGhhbmhfdmllbiIsImlhdCI6MTc3NTI2OTk1NywiZXhwIjoxNzc1MzU2MzU3fQ.ukgzP5D57CSlTZ5Ne3-V2VgKN8zQ8LcHyjAYsnyhwIs'),(26,'2026-04-05 02:38:02.000000','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJodW5ndGhhbmcwMjA2QGdtYWlsLmNvbSIsIm1hX25kIjoxLCJ2YWlfdHJvIjoidGhhbmhfdmllbiIsImlhdCI6MTc3NTI3MDI4MiwiZXhwIjoxNzc1MzU2NjgyfQ.SsvOjvEQDccIcyIGrPVo9M9fjVvszZQyz9yVO0yNhP4'),(27,'2026-04-05 02:43:43.000000','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ4dWFuZGlldUBnbWFpbC5jb20iLCJtYV9uZCI6MywidmFpX3RybyI6InF1YW5fdHJpIiwiaWF0IjoxNzc1MjcwNjIzLCJleHAiOjE3NzUzNTcwMjN9.sSwcVVabc2qfSju5F2R_UmO4wDp_g08f6T6teqAONqE'),(28,'2026-04-05 05:49:57.000000','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJodW5ndGhhbmcwMjA2QGdtYWlsLmNvbSIsIm1hX25kIjoxLCJ2YWlfdHJvIjoidGhhbmhfdmllbiIsImlhdCI6MTc3NTI4MTc5NywiZXhwIjoxNzc1MzY4MTk3fQ.yoRqh6S8vWV8Xznvu3IDHr9D8CQpdxiV9D7ELht0c2E'),(29,'2026-04-05 06:03:11.000000','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJodW5ndGhhbmcwMjA2QGdtYWlsLmNvbSIsIm1hX25kIjoxLCJ2YWlfdHJvIjoidGhhbmhfdmllbiIsImlhdCI6MTc3NTI4MjU5MSwiZXhwIjoxNzc1MzY4OTkxfQ.0781w6wtHJOpPSaL_aL8pdCIzqcuVlOiY9lfZECPum8'),(30,'2026-04-05 06:29:29.000000','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJodW5ndGhhbmcwMjA2QGdtYWlsLmNvbSIsIm1hX25kIjoxLCJ2YWlfdHJvIjoidGhhbmhfdmllbiIsImlhdCI6MTc3NTI4NDE2OSwiZXhwIjoxNzc1MzcwNTY5fQ.uqhJDlXfYcg0YL6Q99eNuyxW-b39bl6mj_yQ6CLXuGA'),(31,'2026-04-05 06:31:27.000000','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ4dWFuZGlldUBnbWFpbC5jb20iLCJtYV9uZCI6MywidmFpX3RybyI6InF1YW5fdHJpIiwiaWF0IjoxNzc1Mjg0Mjg3LCJleHAiOjE3NzUzNzA2ODd9.cLYIJaxqc7Z2zpWvLb7_0jvKf4ZLQODPU0zUc3KP8eU'),(32,'2026-04-05 06:46:37.000000','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJodW5ndGhhbmcwMjA2QGdtYWlsLmNvbSIsIm1hX25kIjoxLCJ2YWlfdHJvIjoidGhhbmhfdmllbiIsImlhdCI6MTc3NTI4NTE5NywiZXhwIjoxNzc1MzcxNTk3fQ.HGdnvvYP1xXaEhoFYQbwT-LS6O89ZgrLBjO6oIti-eQ'),(33,'2026-04-05 06:48:51.000000','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ4dWFuZGlldUBnbWFpbC5jb20iLCJtYV9uZCI6MywidmFpX3RybyI6InF1YW5fdHJpIiwiaWF0IjoxNzc1Mjg1MzMxLCJleHAiOjE3NzUzNzE3MzF9.UX-jtvHcVgzTllsx7rAyA5lY_pOdbnnHwzz-cGexJGA'),(34,'2026-04-07 07:29:42.000000','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJodW5ndGhhbmcwMjA2QGdtYWlsLmNvbSIsIm1hX25kIjoxLCJ2YWlfdHJvIjoidGhhbmhfdmllbiIsImlhdCI6MTc3NTQ2MDU4MiwiZXhwIjoxNzc1NTQ2OTgyfQ.H6WNwuePuTs2TC9-IYnhuhoZrk00g70bjc6ivTtE1xI'),(35,'2026-04-09 13:27:45.000000','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJodW5ndGhhbmcwMjA2QGdtYWlsLmNvbSIsIm1hX25kIjoxLCJ2YWlfdHJvIjoidGhhbmhfdmllbiIsImlhdCI6MTc3NTY1NDg2NSwiZXhwIjoxNzc1NzQxMjY1fQ.joG10Ar30KCfBLvX13A0qepp55qq03KLXqVKptycVvc'),(36,'2026-04-09 14:23:09.000000','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJodW5ndGhhbmcwMjA2QGdtYWlsLmNvbSIsIm1hX25kIjoxLCJ2YWlfdHJvIjoidGhhbmhfdmllbiIsImlhdCI6MTc3NTY1ODE4OSwiZXhwIjoxNzc1NzQ0NTg5fQ.QaXAwbuNLkWWMybgQyByj-WYvx4hAqVXD5l9Zb28bBY'),(37,'2026-04-09 14:50:51.000000','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJodW5ndGhhbmcwMjA2QGdtYWlsLmNvbSIsIm1hX25kIjoxLCJ2YWlfdHJvIjoidGhhbmhfdmllbiIsImlhdCI6MTc3NTY1OTg1MSwiZXhwIjoxNzc1NzQ2MjUxfQ.mQXUkgseU2qhbdE37o_pDga2MBFR2Ik0Zt734eOfXI0'),(38,'2026-04-09 15:03:33.000000','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJodW5ndGhhbmcwMjA2QGdtYWlsLmNvbSIsIm1hX25kIjoxLCJ2YWlfdHJvIjoidGhhbmhfdmllbiIsImlhdCI6MTc3NTY2MDYxMywiZXhwIjoxNzc1NzQ3MDEzfQ.x1aRS5hBowAiIthyVSuxUkaAFRerm4siznnxXwe1ScE'),(39,'2026-04-18 09:06:01.000000','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJodW5ndGhhbmcwMjA2QGdtYWlsLmNvbSIsIm1hX25kIjoxLCJ2YWlfdHJvIjoidGhhbmhfdmllbiIsImlhdCI6MTc3NjQxNjc2MSwiZXhwIjoxNzc2NTAzMTYxfQ.b-_HEQg6g0S_OK15-lQ8rhIZrwp42I4jVijuV1vdJYA'),(40,'2026-04-22 06:29:20.000000','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJodW5ndGhhbmcwMjA2QGdtYWlsLmNvbSIsIm1hX25kIjoxLCJ2YWlfdHJvIjoidGhhbmhfdmllbiIsImlhdCI6MTc3Njc1Mjk2MCwiZXhwIjoxNzc2ODM5MzYwfQ.NNN7FA8g2RJS79yUgfrSIhjnxk9yCMDI6I9B09l2-Jk'),(41,'2026-04-22 07:04:56.000000','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJodW5ndGhhbmcwMjA2QGdtYWlsLmNvbSIsIm1hX25kIjoxLCJ2YWlfdHJvIjoidGhhbmhfdmllbiIsImlhdCI6MTc3Njc1NTA5NiwiZXhwIjoxNzc2ODQxNDk2fQ.nkJt-dnZB2Rw8XEbWF7BNqH1GEWQebIlg1CT2CxsQjc'),(42,'2026-04-24 07:04:03.000000','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJodW5ndGhhbmcwMjA2QGdtYWlsLmNvbSIsIm1hX25kIjoxLCJ2YWlfdHJvIjoidGhhbmhfdmllbiIsImlhdCI6MTc3NjkyNzg0MywiZXhwIjoxNzc3MDE0MjQzfQ.1WUfAexyWOeLCIu-3kUoPgeiMr9UZRtJLzDQ9dtZDGk'),(43,'2026-04-24 07:08:50.000000','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJodW5ndGhhbmcwMjA2QGdtYWlsLmNvbSIsIm1hX25kIjoxLCJ2YWlfdHJvIjoidGhhbmhfdmllbiIsImlhdCI6MTc3NjkyODEzMCwiZXhwIjoxNzc3MDE0NTMwfQ.ylt6-px4eqoDWgX9vVRfaJI3Lr7edy5ewLeXuwtDadA'),(44,'2026-04-24 07:12:30.000000','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ4dWFuZGlldUBnbWFpbC5jb20iLCJtYV9uZCI6MywidmFpX3RybyI6InF1YW5fdHJpIiwiaWF0IjoxNzc2OTI4MzUwLCJleHAiOjE3NzcwMTQ3NTB9.DEgbsO7vXacZkwF-H7FZWGYWp9wV1sxT5VZkM7jYw2U'),(45,'2026-04-28 14:32:46.000000','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJodW5ndGhhbmcwMjA2QGdtYWlsLmNvbSIsIm1hX25kIjoxLCJ2YWlfdHJvIjoidGhhbmhfdmllbiIsImlhdCI6MTc3NzMwMDM2NiwiZXhwIjoxNzc3Mzg2NzY2fQ.faXB3DP2lsWKNwh7nDO0WsFlPYSp-0gd5v2cyPcKPcQ'),(46,'2026-04-28 14:49:00.000000','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJodW5ndGhhbmcwMjA2QGdtYWlsLmNvbSIsIm1hX25kIjoxLCJ2YWlfdHJvIjoidGhhbmhfdmllbiIsImlhdCI6MTc3NzMwMTM0MCwiZXhwIjoxNzc3Mzg3NzQwfQ.jf23Hri2iGAR2S7jQ9fzNb20XMBwmr7OgFZv1Sou0Pk'),(47,'2026-04-28 23:44:52.000000','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJodW5ndGhhbmcwMjA2QGdtYWlsLmNvbSIsIm1hX25kIjoxLCJ2YWlfdHJvIjoidGhhbmhfdmllbiIsImlhdCI6MTc3NzMzMzQ5MiwiZXhwIjoxNzc3NDE5ODkyfQ.ZqDM7BbacbepI42mYt2H-QwN8nBRxFxsUIsPZI6X08s'),(48,'2026-05-01 16:23:24.000000','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJodW5ndGhhbmcwMjA2QGdtYWlsLmNvbSIsIm1hX25kIjoxLCJ2YWlfdHJvIjoidGhhbmhfdmllbiIsImlhdCI6MTc3NzU2NjIwNCwiZXhwIjoxNzc3NjUyNjA0fQ.d-PNF4manzNhy0mGnlRKh4BzKhVoF6w4PZ8RvyRmOkc'),(49,'2026-05-01 16:24:14.000000','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ4dWFuZGlldUBnbWFpbC5jb20iLCJtYV9uZCI6MywidmFpX3RybyI6InF1YW5fdHJpIiwiaWF0IjoxNzc3NTY2MjU0LCJleHAiOjE3Nzc2NTI2NTR9._6Oj6-QLvMN4oEyzV3wh2X2kVcOWyvo4btFq6Sce_q4'),(50,'2026-05-02 00:29:53.000000','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJodW5ndGhhbmcwMjA2QGdtYWlsLmNvbSIsIm1hX25kIjoxLCJ2YWlfdHJvIjoidGhhbmhfdmllbiIsImlhdCI6MTc3NzU5NTM5MywiZXhwIjoxNzc3NjgxNzkzfQ.q5qc_zkkqlS6igmQVlsGVqZdm3OuyH6bsQLgubDed0s'),(51,'2026-05-02 00:30:12.000000','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ4dWFuZGlldUBnbWFpbC5jb20iLCJtYV9uZCI6MywidmFpX3RybyI6InF1YW5fdHJpIiwiaWF0IjoxNzc3NTk1NDEyLCJleHAiOjE3Nzc2ODE4MTJ9.NgpwcO8T_Q_L99w2OWPlERRGNe50kCAPgyq3W2tvFE8'),(52,'2026-05-02 00:59:51.000000','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ4dWFuZGlldUBnbWFpbC5jb20iLCJtYV9uZCI6MywidmFpX3RybyI6InF1YW5fdHJpIiwiaWF0IjoxNzc3NTk3MTkxLCJleHAiOjE3Nzc2ODM1OTF9.1BkzpuQ8SWMgnIU2YkOTsYikOGSjseQy1o9C31_Jj0M'),(53,'2026-05-02 05:42:21.000000','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJodW5ndGhhbmcwMjA2QGdtYWlsLmNvbSIsIm1hX25kIjoxLCJ2YWlfdHJvIjoidGhhbmhfdmllbiIsImlhdCI6MTc3NzYxNDE0MSwiZXhwIjoxNzc3NzAwNTQxfQ.fkY5shl9ZT9oiIC1Wpbnq7TSgVvjBa7Ut4h-dkUcbsM'),(54,'2026-05-02 05:43:18.000000','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ4dWFuZGlldUBnbWFpbC5jb20iLCJtYV9uZCI6MywidmFpX3RybyI6InF1YW5fdHJpIiwiaWF0IjoxNzc3NjE0MTk4LCJleHAiOjE3Nzc3MDA1OTh9.qQllfoP8xmtz7grnhDekQPqf_ZMhe6ME3PJjAl2krj8'),(55,'2026-05-02 05:58:22.000000','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJodW5ndGhhbmcwMjA2QGdtYWlsLmNvbSIsIm1hX25kIjoxLCJ2YWlfdHJvIjoidGhhbmhfdmllbiIsImlhdCI6MTc3NzYxNTEwMiwiZXhwIjoxNzc3NzAxNTAyfQ.cj3kBfhyU6jTHDMo6pNh40YRWw6NXuO19ffcrF4K4sM'),(56,'2026-05-02 06:03:32.000000','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ4dWFuZGlldUBnbWFpbC5jb20iLCJtYV9uZCI6MywidmFpX3RybyI6InF1YW5fdHJpIiwiaWF0IjoxNzc3NjE1NDEyLCJleHAiOjE3Nzc3MDE4MTJ9.KFamDLz3Lk2l0LOspU-V7fQIPZj-iWybBzVk0QkKMIo'),(57,'2026-05-02 06:17:25.000000','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJodW5ndGhhbmcwMjA2QGdtYWlsLmNvbSIsIm1hX25kIjoxLCJ2YWlfdHJvIjoidGhhbmhfdmllbiIsImlhdCI6MTc3NzYxNjI0NSwiZXhwIjoxNzc3NzAyNjQ1fQ.-wbsUcBsY78NjA_nDdHztR2mfsI85hfu_Dox-tX9CvQ'),(58,'2026-05-02 06:18:03.000000','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ4dWFuZGlldUBnbWFpbC5jb20iLCJtYV9uZCI6MywidmFpX3RybyI6InF1YW5fdHJpIiwiaWF0IjoxNzc3NjE2MjgzLCJleHAiOjE3Nzc3MDI2ODN9.fZmCWv0uyXuP_xaRWZiShcbNDh_1ZYbR5nLbaVNuSl0'),(59,'2026-05-02 11:31:13.000000','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJodW5ndGhhbmcwMjA2QGdtYWlsLmNvbSIsIm1hX25kIjoxLCJ2YWlfdHJvIjoidGhhbmhfdmllbiIsImlhdCI6MTc3NzYzNTA3MywiZXhwIjoxNzc3NzIxNDczfQ.eG0oEYMBYxy3jpE_2k2bAoR5gDh4eWsIUwkPGYmHtjQ'),(60,'2026-05-02 11:32:08.000000','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ4dWFuZGlldUBnbWFpbC5jb20iLCJtYV9uZCI6MywidmFpX3RybyI6InF1YW5fdHJpIiwiaWF0IjoxNzc3NjM1MTI4LCJleHAiOjE3Nzc3MjE1Mjh9.sNZgc6LGiZOCOAk3U3hwHrpyk2AFUBaC6RZGMhPbRZc'),(61,'2026-05-02 17:50:31.000000','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0dmhhaWhhaUBnbWFpbC5jb20iLCJtYV9uZCI6MjYsInZhaV90cm8iOiJ0aGFuaF92aWVuIiwiaWF0IjoxNzc3NjU3ODMxLCJleHAiOjE3Nzc3NDQyMzF9.JU2whz8SYDqsIWgrZCfVQRU4mtiDBn1cXBWeChx92xc'),(62,'2026-05-03 08:29:15.000000','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ4dWFuZGlldUBnbWFpbC5jb20iLCJtYV9uZCI6MywidmFpX3RybyI6InF1YW5fdHJpIiwiaWF0IjoxNzc3NzEwNTU1LCJleHAiOjE3Nzc3OTY5NTV9.8WrYmwZwHSTABDgxmlUx5J4Qeqy0TAGItJUtzHKhE5s'),(63,'2026-05-03 08:32:47.000000','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0aGFuaHZpZW5iYUBnbWFpbC5jb20iLCJtYV9uZCI6NywidmFpX3RybyI6InRoYW5oX3ZpZW4iLCJpYXQiOjE3Nzc3MTA3NjcsImV4cCI6MTc3Nzc5NzE2N30._LX2dPadhBNQssRGL67Rotzhw2cP6xdWpfKtaH6_-CQ'),(64,'2026-05-03 08:50:05.000000','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0aGFuaHZpZW5iYUBnbWFpbC5jb20iLCJtYV9uZCI6NywidmFpX3RybyI6InRoYW5oX3ZpZW4iLCJpYXQiOjE3Nzc3MTE4MDUsImV4cCI6MTc3Nzc5ODIwNX0.Go8zDKIqmdF3WeoVuecCvz4DyrSJ7b8iDFEF0MWs_Is'),(65,'2026-05-03 08:51:32.000000','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0aGFuaHZpZW5ib25AZ21haWwuY29tIiwibWFfbmQiOjgsInZhaV90cm8iOiJ0aGFuaF92aWVuIiwiaWF0IjoxNzc3NzExODkyLCJleHAiOjE3Nzc3OTgyOTJ9.9GcWVVOtt5BYiU-CKNSZL7xqcjTXS-f3wch9Wm0jn0w'),(66,'2026-05-03 09:01:13.000000','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0aGFuaHZpZW5uYW1AZ21haWwuY29tIiwibWFfbmQiOjksInZhaV90cm8iOiJ0aGFuaF92aWVuIiwiaWF0IjoxNzc3NzEyNDczLCJleHAiOjE3Nzc3OTg4NzN9.-i6atnkhtWl3HQi-zH2roDvUyaM3l17twM59V3j1tFE'),(67,'2026-05-03 09:03:40.000000','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ4dWFuZGlldUBnbWFpbC5jb20iLCJtYV9uZCI6MywidmFpX3RybyI6InF1YW5fdHJpIiwiaWF0IjoxNzc3NzEyNjIwLCJleHAiOjE3Nzc3OTkwMjB9.oHZsBIXaua93ibvOwQunpKbIb-TSx4l-CSd3ONhyKUc');
/*!40000 ALTER TABLE `token_blacklist` ENABLE KEYS */;
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

-- Dump completed on 2026-05-02 16:07:44
