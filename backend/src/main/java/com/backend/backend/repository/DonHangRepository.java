package com.backend.backend.repository;

import com.backend.backend.entity.DonHang;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface DonHangRepository extends JpaRepository<DonHang, Long> {

    @Query(value = "SELECT COUNT(*) FROM chi_tiet_don_hang ct " +
                   "INNER JOIN don_hang dh ON ct.id_dh = dh.id_dh " +
                   "WHERE ct.ma_sach = :ma_sach AND dh.trang_thai = 'da_thanh_toan'",
           nativeQuery = true)
    long countSachDaBan(@Param("ma_sach") Long maSach);

    @Query(value = "SELECT COUNT(*) FROM chi_tiet_don_hang ct " +
                   "INNER JOIN don_hang dh ON ct.id_dh = dh.id_dh " +
                   "WHERE ct.ma_sach = :maSach AND dh.ma_nd = :maNd AND dh.trang_thai = 'da_thanh_toan'",
           nativeQuery = true)
    long countDaMuaSach(@Param("maNd") Long maNd, @Param("maSach") Long maSach);

    // Trả về (ma_sach, ngay_mua) — dùng MAX để tránh trùng khi mua nhiều lần
    @Query(value = "SELECT ct.ma_sach, MAX(dh.ngay_tao) AS ngay_mua " +
                   "FROM chi_tiet_don_hang ct " +
                   "INNER JOIN don_hang dh ON ct.id_dh = dh.id_dh " +
                   "WHERE dh.ma_nd = :maNd AND dh.trang_thai = 'da_thanh_toan' " +
                   "GROUP BY ct.ma_sach " +
                   "ORDER BY ngay_mua DESC",
           countQuery = "SELECT COUNT(DISTINCT ct.ma_sach) " +
                        "FROM chi_tiet_don_hang ct " +
                        "INNER JOIN don_hang dh ON ct.id_dh = dh.id_dh " +
                        "WHERE dh.ma_nd = :maNd AND dh.trang_thai = 'da_thanh_toan'",
           nativeQuery = true)
    Page<Object[]> findSachDaMuaByMaNd(@Param("maNd") Long maNd, Pageable pageable);

    @Query(value = "SELECT COUNT(*) FROM chi_tiet_don_hang ct " +
                   "INNER JOIN don_hang dh ON ct.id_dh = dh.id_dh " +
                   "WHERE ct.ma_sach = :maSach AND dh.ma_nd = :maNd AND dh.trang_thai = 'da_thanh_toan'",
           nativeQuery = true)
    long daMuaSach(@Param("maNd") Long maNd, @Param("maSach") Long maSach);

    @Query("SELECT d FROM DonHang d " +
           "WHERE (:trangThai IS NULL OR d.trangThai = :trangThai) " +
           "AND (:tenKhachHang IS NULL OR d.hoTen LIKE %:tenKhachHang%) " +
           "AND (:tuNgay IS NULL OR d.ngayTao >= :tuNgay) " +
           "AND (:denNgay IS NULL OR d.ngayTao <= :denNgay) " +
           "ORDER BY d.ngayTao DESC")
    Page<DonHang> timDonHangAdmin(@Param("trangThai") String trangThai,
                                   @Param("tenKhachHang") String tenKhachHang,
                                   @Param("tuNgay") LocalDateTime tuNgay,
                                   @Param("denNgay") LocalDateTime denNgay,
                                   Pageable pageable);

    @Query("SELECT COUNT(d) FROM DonHang d WHERE d.trangThai = 'da_thanh_toan'")
    long demDonHangThanhCong();

    @Query("SELECT SUM(d.tongTien) FROM DonHang d WHERE d.trangThai = 'da_thanh_toan'")
    java.math.BigDecimal tongDoanhThu();

    @Query(value = "SELECT DATE(ngay_tao) AS thoi_gian, SUM(tong_tien) AS doanh_thu, COUNT(*) AS so_luong " +
                   "FROM don_hang WHERE trang_thai = 'da_thanh_toan' " +
                   "AND ngay_tao BETWEEN :tuNgay AND :denNgay " +
                   "GROUP BY DATE(ngay_tao) ORDER BY DATE(ngay_tao)",
           nativeQuery = true)
    List<Object[]> thongKeDoanhThuTheoNgay(@Param("tuNgay") LocalDateTime tuNgay,
                                            @Param("denNgay") LocalDateTime denNgay);

    @Query(value = "SELECT YEARWEEK(ngay_tao, 1) AS thoi_gian, SUM(tong_tien) AS doanh_thu, COUNT(*) AS so_luong " +
                   "FROM don_hang WHERE trang_thai = 'da_thanh_toan' " +
                   "AND ngay_tao BETWEEN :tuNgay AND :denNgay " +
                   "GROUP BY YEARWEEK(ngay_tao, 1) ORDER BY YEARWEEK(ngay_tao, 1)",
           nativeQuery = true)
    List<Object[]> thongKeDoanhThuTheoTuan(@Param("tuNgay") LocalDateTime tuNgay,
                                            @Param("denNgay") LocalDateTime denNgay);

    @Query(value = "SELECT DATE_FORMAT(ngay_tao, '%Y-%m') AS thoi_gian, SUM(tong_tien) AS doanh_thu, COUNT(*) AS so_luong " +
                   "FROM don_hang WHERE trang_thai = 'da_thanh_toan' " +
                   "AND ngay_tao BETWEEN :tuNgay AND :denNgay " +
                   "GROUP BY DATE_FORMAT(ngay_tao, '%Y-%m') ORDER BY DATE_FORMAT(ngay_tao, '%Y-%m')",
           nativeQuery = true)
    List<Object[]> thongKeDoanhThuTheoThang(@Param("tuNgay") LocalDateTime tuNgay,
                                             @Param("denNgay") LocalDateTime denNgay);

    @Query(value = "SELECT ma_don_hang, ho_ten, email, ngay_tao, tong_tien, trang_thai, phuong_thuc_thanh_toan " +
                   "FROM don_hang WHERE ngay_tao BETWEEN :tuNgay AND :denNgay " +
                   "ORDER BY ngay_tao DESC",
           nativeQuery = true)
    List<Object[]> layDonHangTheoDenNgay(@Param("tuNgay") LocalDateTime tuNgay,
                                          @Param("denNgay") LocalDateTime denNgay);

    @Query(value = "SELECT trang_thai, COUNT(*) AS so_luong, COALESCE(SUM(tong_tien), 0) AS tong_tien " +
                   "FROM don_hang WHERE ngay_tao BETWEEN :tuNgay AND :denNgay " +
                   "GROUP BY trang_thai",
           nativeQuery = true)
    List<Object[]> thongKeDonHangTheoTrangThai(@Param("tuNgay") LocalDateTime tuNgay,
                                                @Param("denNgay") LocalDateTime denNgay);

    List<DonHang> findTop10ByMaNdOrderByNgayTaoDesc(Long maNd);

    @Modifying
    @Query("UPDATE DonHang d SET d.trangThai = 'that_bai' " +
           "WHERE d.trangThai = 'cho_thanh_toan' AND d.ngayTao < :deadline")
    int huyDonHangQuaHan(@Param("deadline") LocalDateTime deadline);

    @Query("SELECT d FROM DonHang d WHERE d.maNd = :maNd " +
           "AND (:trangThai IS NULL OR d.trangThai = :trangThai) " +
           "AND (:tuNgay IS NULL OR d.ngayTao >= :tuNgay) " +
           "AND (:denNgay IS NULL OR d.ngayTao <= :denNgay) " +
           "ORDER BY d.ngayTao DESC")
    Page<DonHang> findDonHangByMaNd(@Param("maNd") Long maNd,
                                     @Param("trangThai") String trangThai,
                                     @Param("tuNgay") LocalDateTime tuNgay,
                                     @Param("denNgay") LocalDateTime denNgay,
                                     Pageable pageable);
}
