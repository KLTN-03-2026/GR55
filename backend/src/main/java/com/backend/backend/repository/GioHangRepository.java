package com.backend.backend.repository;

import com.backend.backend.entity.GioHang;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface GioHangRepository extends JpaRepository<GioHang, Long> {

    List<GioHang> findByMaNd(Long maNd);

    Optional<GioHang> findByMaNdAndMaSach(Long maNd, Long maSach);

    @Query("SELECT COUNT(g) FROM GioHang g WHERE g.maNd = :maNd")
    int demSoLuong(@Param("maNd") Long maNd);

    @Modifying
    @Transactional
    @Query("DELETE FROM GioHang g WHERE g.maNd = :maNd")
    void xoaToanBo(@Param("maNd") Long maNd);
}
