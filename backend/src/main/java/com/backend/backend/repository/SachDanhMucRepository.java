package com.backend.backend.repository;

import com.backend.backend.entity.SachDanhMuc;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface SachDanhMucRepository extends JpaRepository<SachDanhMuc, Long> {

    @Query("SELECT COUNT(sd) FROM SachDanhMuc sd WHERE sd.maDm = :maDm AND sd.maSach IN (SELECT s.maSach FROM Sach s WHERE s.daXoa = false)")
    int countByMaDm(@Param("maDm") Long maDm);

    List<SachDanhMuc> findByMaSach(Long maSach);

    List<SachDanhMuc> findByMaSachIn(List<Long> sachIds);

    @Query("SELECT DISTINCT sd.maDm FROM SachDanhMuc sd WHERE sd.maSach IN :sachIds")
    List<Long> findDanhMucIdsBySachIds(@Param("sachIds") List<Long> sachIds);

    @Query("SELECT DISTINCT sd.maSach FROM SachDanhMuc sd WHERE sd.maDm IN :danhMucIds")
    List<Long> findSachIdsByDanhMucIds(@Param("danhMucIds") List<Long> danhMucIds);

    @Modifying
    @Transactional
    @Query("DELETE FROM SachDanhMuc sd WHERE sd.maSach = :maSach")
    void deleteByMaSach(@Param("maSach") Long maSach);
}
