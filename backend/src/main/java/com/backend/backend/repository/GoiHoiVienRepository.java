package com.backend.backend.repository;

import com.backend.backend.entity.GoiHoiVien;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GoiHoiVienRepository extends JpaRepository<GoiHoiVien, Long> {
    List<GoiHoiVien> findByHoatDongTrue();
    Optional<GoiHoiVien> findByMaHvAndHoatDongTrue(Long maHv);
}
