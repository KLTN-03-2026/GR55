package com.backend.backend.repository;

import com.backend.backend.entity.GoiHoiVienSach;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface GoiHoiVienSachRepository extends JpaRepository<GoiHoiVienSach, Long> {

    @Query(value = "SELECT COUNT(*) > 0 FROM goi_hoi_vien_sach g " +
                   "WHERE g.ma_sach IN (SELECT sd.ma_sach FROM sach_danh_muc sd WHERE sd.ma_dm = :ma_dm)",
           nativeQuery = true)
    boolean kiemTraSachTrongDanhMucCoTrongGoiHoiVien(@Param("ma_dm") Long maDm);

    boolean existsByMaSach(Long maSach);

    @Query("SELECT COUNT(g) > 0 FROM GoiHoiVienSach g WHERE g.maSach = :maSach")
    boolean isSachHoiVien(@Param("maSach") Long maSach);
}
