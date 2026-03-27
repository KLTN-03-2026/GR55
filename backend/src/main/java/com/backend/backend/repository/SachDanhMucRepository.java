package com.backend.backend.repository;

import com.backend.backend.entity.SachDanhMuc;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface SachDanhMucRepository extends JpaRepository<SachDanhMuc, Long> {

    int countByMaDm(Long maDm);

    List<SachDanhMuc> findByMaSach(Long maSach);

    @Transactional
    void deleteByMaSach(Long maSach);
}
