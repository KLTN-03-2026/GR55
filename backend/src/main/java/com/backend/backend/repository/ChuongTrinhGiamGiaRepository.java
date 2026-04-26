package com.backend.backend.repository;

import com.backend.backend.entity.ChuongTrinhGiamGia;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface ChuongTrinhGiamGiaRepository extends JpaRepository<ChuongTrinhGiamGia, Long> {

    Optional<ChuongTrinhGiamGia> findByTenChuongTrinh(String tenChuongTrinh);

    @Query("SELECT c FROM ChuongTrinhGiamGia c WHERE " +
           "(:ten IS NULL OR c.tenChuongTrinh LIKE %:ten%) " +
           "AND (:hoatDong IS NULL OR c.hoatDong = :hoatDong) " +
           "AND (:tuNgay IS NULL OR c.ngayBatDau >= :tuNgay) " +
           "AND (:denNgay IS NULL OR c.ngayKetThuc <= :denNgay) " +
           "ORDER BY c.ngayTao DESC")
    Page<ChuongTrinhGiamGia> findChuongTrinhForAdmin(@Param("ten") String ten,
                                                       @Param("hoatDong") Boolean hoatDong,
                                                       @Param("tuNgay") LocalDateTime tuNgay,
                                                       @Param("denNgay") LocalDateTime denNgay,
                                                       Pageable pageable);
}
