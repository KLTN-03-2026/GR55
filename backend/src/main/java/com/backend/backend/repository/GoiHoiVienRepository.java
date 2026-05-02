package com.backend.backend.repository;

import com.backend.backend.entity.GoiHoiVien;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GoiHoiVienRepository extends JpaRepository<GoiHoiVien, Long> {
    List<GoiHoiVien> findByHoatDongTrue();
    Optional<GoiHoiVien> findByMaHvAndHoatDongTrue(Long maHv);

    Optional<GoiHoiVien> findByTenGoi(String tenGoi);

    @Query("SELECT g FROM GoiHoiVien g WHERE (:ten IS NULL OR LOWER(g.tenGoi) LIKE LOWER(CONCAT('%', :ten, '%')))")
    Page<GoiHoiVien> findGoiForAdmin(@Param("ten") String ten, Pageable pageable);
}
