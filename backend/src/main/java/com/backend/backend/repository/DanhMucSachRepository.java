package com.backend.backend.repository;

import com.backend.backend.entity.DanhMucSach;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DanhMucSachRepository extends JpaRepository<DanhMucSach, Long> {

    boolean existsByTenDanhMuc(String tenDanhMuc);

    boolean existsByTenDanhMucAndMaDmNot(String tenDanhMuc, Long maDm);

    Page<DanhMucSach> findByTenDanhMucContainingIgnoreCase(String tenDanhMuc, Pageable pageable);

    @Query("SELECT dm FROM DanhMucSach dm ORDER BY dm.tenDanhMuc")
    List<DanhMucSach> findAllOrderByTen();

    @Query("SELECT COUNT(sd) FROM SachDanhMuc sd WHERE sd.maDm = :maDm")
    int countSachByDanhMuc(@Param("maDm") Long maDm);
}
