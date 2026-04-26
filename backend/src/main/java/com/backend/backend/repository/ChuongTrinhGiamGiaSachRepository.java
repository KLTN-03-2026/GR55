package com.backend.backend.repository;

import com.backend.backend.entity.ChuongTrinhGiamGiaSach;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface ChuongTrinhGiamGiaSachRepository extends JpaRepository<ChuongTrinhGiamGiaSach, Long> {

    @Query(value = "SELECT COUNT(*) FROM chuong_trinh_giam_gia_sach c " +
                   "WHERE c.ma_sach IN (SELECT sd.ma_sach FROM sach_danh_muc sd WHERE sd.ma_dm = :ma_dm)",
           nativeQuery = true)
    long countSachTrongDanhMucCoGiamGia(@Param("ma_dm") Long maDm);

    boolean existsByMaSach(Long maSach);

    List<ChuongTrinhGiamGiaSach> findByMaCt(Long maCt);

    @Modifying
    @Transactional
    @Query("DELETE FROM ChuongTrinhGiamGiaSach c WHERE c.maCt = :maCt")
    void deleteByMaCt(@Param("maCt") Long maCt);

    @Query("SELECT c.maSach FROM ChuongTrinhGiamGiaSach c WHERE c.maCt = :maCt")
    List<Long> findSachIdsByMaCt(@Param("maCt") Long maCt);

    @Query("SELECT c.maCt FROM ChuongTrinhGiamGiaSach c WHERE c.maSach = :maSach")
    List<Long> findMaCtsByMaSach(@Param("maSach") Long maSach);

    @Query("SELECT COUNT(c) FROM ChuongTrinhGiamGiaSach c WHERE c.maCt = :maCt")
    long countByMaCt(@Param("maCt") Long maCt);
}
