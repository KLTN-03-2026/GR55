package com.backend.backend.repository;

import com.backend.backend.entity.GoiHoiVienSach;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface GoiHoiVienSachRepository extends JpaRepository<GoiHoiVienSach, Long> {

    @Query(value = "SELECT COUNT(*) FROM goi_hoi_vien_sach g " +
                   "WHERE g.ma_sach IN (SELECT sd.ma_sach FROM sach_danh_muc sd WHERE sd.ma_dm = :ma_dm)",
           nativeQuery = true)
    long countSachTrongDanhMucCoTrongGoiHoiVien(@Param("ma_dm") Long maDm);

    boolean existsByMaSach(Long maSach);

    List<GoiHoiVienSach> findByMaHv(Long maHv);

    @Query("SELECT g.maSach FROM GoiHoiVienSach g WHERE g.maHv = :maHv")
    List<Long> findSachIdsByMaHv(@Param("maHv") Long maHv);

    @Query("SELECT g.maHv, COUNT(g) FROM GoiHoiVienSach g WHERE g.maHv IN :maHvIds GROUP BY g.maHv")
    List<Object[]> countSachByMaHvIn(@Param("maHvIds") List<Long> maHvIds);

    @Modifying
    @Transactional
    @Query("DELETE FROM GoiHoiVienSach g WHERE g.maHv = :maHv")
    void deleteByMaHv(@Param("maHv") Long maHv);
}
