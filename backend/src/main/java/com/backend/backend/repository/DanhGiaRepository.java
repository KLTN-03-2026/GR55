package com.backend.backend.repository;

import com.backend.backend.entity.DanhGia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DanhGiaRepository extends JpaRepository<DanhGia, Long> {

    @Query("SELECT AVG(d.soSao) FROM DanhGia d WHERE d.maSach = :maSach AND d.hienThi = true")
    Double tinhDiemTrungBinh(@Param("maSach") Long maSach);

    @Query("SELECT COUNT(d) FROM DanhGia d WHERE d.maSach = :maSach AND d.hienThi = true")
    Integer demSoLuotDanhGia(@Param("maSach") Long maSach);

    Optional<DanhGia> findByMaNdAndMaSach(Long maNd, Long maSach);
}
