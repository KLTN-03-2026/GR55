package com.backend.backend.repository;

import com.backend.backend.entity.DanhMucSach;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DanhMucSachRepository extends JpaRepository<DanhMucSach, Long> {

    boolean existsByTenDanhMuc(String tenDanhMuc);

    boolean existsByTenDanhMucAndMaDmNot(String tenDanhMuc, Long maDm);

    Page<DanhMucSach> findByTenDanhMucContainingIgnoreCase(String tenDanhMuc, Pageable pageable);
}
