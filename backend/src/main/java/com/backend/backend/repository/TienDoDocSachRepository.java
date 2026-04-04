package com.backend.backend.repository;

import com.backend.backend.entity.TienDoDocSach;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TienDoDocSachRepository extends JpaRepository<TienDoDocSach, Long> {

    Optional<TienDoDocSach> findByMaNdAndMaSach(Long maNd, Long maSach);

    @Query("SELECT t FROM TienDoDocSach t WHERE t.maNd = :maNd AND t.phanTram > 0 AND t.phanTram < 100 ORDER BY t.lanDocCuoi DESC")
    Page<TienDoDocSach> findSachDangDoc(@Param("maNd") Long maNd, Pageable pageable);

    @Query("SELECT DISTINCT t.maSach FROM TienDoDocSach t WHERE t.maNd = :maNd")
    List<Long> findSachDaDocByUserId(@Param("maNd") Long maNd);

    boolean existsByMaSach(Long maSach);
}
