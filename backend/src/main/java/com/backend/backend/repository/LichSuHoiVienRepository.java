package com.backend.backend.repository;

import com.backend.backend.entity.LichSuHoiVien;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface LichSuHoiVienRepository extends JpaRepository<LichSuHoiVien, Long> {

    @Query("SELECT COUNT(l) > 0 FROM LichSuHoiVien l " +
           "WHERE l.maNd = :maNd AND l.trangThai = 'hoat_dong' " +
           "AND l.ngayBatDau <= :now AND l.ngayKetThuc >= :now")
    boolean isHoiVien(@Param("maNd") Long maNd, @Param("now") LocalDateTime now);

    @Query("SELECT COUNT(DISTINCT l.maNd) FROM LichSuHoiVien l " +
           "WHERE l.trangThai = 'hoat_dong' AND l.ngayBatDau <= :now AND l.ngayKetThuc >= :now")
    long demHoiVienHienTai(@Param("now") LocalDateTime now);

    @Query("SELECT COUNT(DISTINCT l.maNd) FROM LichSuHoiVien l " +
           "WHERE l.maHv = :maHv AND l.trangThai = 'hoat_dong' AND l.ngayKetThuc >= CURRENT_TIMESTAMP")
    int demNguoiDungDangSuDung(@Param("maHv") Long maHv);

    @Query("SELECT l.maHv, COUNT(DISTINCT l.maNd) FROM LichSuHoiVien l " +
           "WHERE l.maHv IN :maHvIds AND l.trangThai = 'hoat_dong' AND l.ngayKetThuc >= CURRENT_TIMESTAMP " +
           "GROUP BY l.maHv")
    List<Object[]> demNguoiDungTheoGoiIn(@Param("maHvIds") List<Long> maHvIds);

    @Query(value = "SELECT ghv.ten_goi, ghv.gia, ghv.thoi_han_thang, " +
                   "COUNT(DISTINCT CASE WHEN l.trang_thai = 'hoat_dong' AND l.ngay_ket_thuc >= NOW() THEN l.ma_nd END) AS dang_hoat_dong, " +
                   "COUNT(l.ma_lshv) AS tong_lan_dang_ky, " +
                   "COALESCE(COUNT(l.ma_lshv) * ghv.gia, 0) AS doanh_thu " +
                   "FROM goi_hoi_vien ghv " +
                   "LEFT JOIN lich_su_hoi_vien l ON ghv.ma_hv = l.ma_hv " +
                   "WHERE ghv.hoat_dong = true " +
                   "GROUP BY ghv.ma_hv, ghv.ten_goi, ghv.gia, ghv.thoi_han_thang " +
                   "ORDER BY dang_hoat_dong DESC",
           nativeQuery = true)
    List<Object[]> thongKeTheoGoi();

    @Query(value = "SELECT COALESCE(SUM(ghv.gia), 0) " +
                   "FROM lich_su_hoi_vien l JOIN goi_hoi_vien ghv ON l.ma_hv = ghv.ma_hv",
           nativeQuery = true)
    double tongDoanhThuHoiVien();
}
