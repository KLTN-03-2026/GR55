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
}
