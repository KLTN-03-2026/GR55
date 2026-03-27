package com.backend.backend.repository;

import com.backend.backend.entity.LichSuHoiVien;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface LichSuHoiVienRepository extends JpaRepository<LichSuHoiVien, Long> {

    @Query("SELECT COUNT(l) > 0 FROM LichSuHoiVien l " +
           "WHERE l.maNd = :maNd AND l.trangThai = 'hoat_dong' " +
           "AND l.ngayBatDau <= :now AND l.ngayKetThuc >= :now")
    boolean isHoiVien(@Param("maNd") Long maNd, @Param("now") LocalDateTime now);
}
