package com.backend.backend.repository;

import com.backend.backend.entity.DonHang;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface DonHangRepository extends JpaRepository<DonHang, Long> {

    @Query(value = "SELECT COUNT(*) FROM chi_tiet_don_hang ct " +
                   "INNER JOIN don_hang dh ON ct.id_dh = dh.id_dh " +
                   "WHERE ct.ma_sach = :ma_sach AND dh.trang_thai = 'da_thanh_toan'",
           nativeQuery = true)
    long countSachDaBan(@Param("ma_sach") Long maSach);

    @Query(value = "SELECT COUNT(*) FROM chi_tiet_don_hang ct " +
                   "INNER JOIN don_hang dh ON ct.id_dh = dh.id_dh " +
                   "WHERE ct.ma_sach = :maSach AND dh.ma_nd = :maNd AND dh.trang_thai = 'da_thanh_toan'",
           nativeQuery = true)
    long countDaMuaSach(@Param("maNd") Long maNd, @Param("maSach") Long maSach);

    // Trả về (ma_sach, ngay_mua) — dùng MAX để tránh trùng khi mua nhiều lần
    @Query(value = "SELECT ct.ma_sach, MAX(dh.ngay_tao) AS ngay_mua " +
                   "FROM chi_tiet_don_hang ct " +
                   "INNER JOIN don_hang dh ON ct.id_dh = dh.id_dh " +
                   "WHERE dh.ma_nd = :maNd AND dh.trang_thai = 'da_thanh_toan' " +
                   "GROUP BY ct.ma_sach " +
                   "ORDER BY ngay_mua DESC",
           countQuery = "SELECT COUNT(DISTINCT ct.ma_sach) " +
                        "FROM chi_tiet_don_hang ct " +
                        "INNER JOIN don_hang dh ON ct.id_dh = dh.id_dh " +
                        "WHERE dh.ma_nd = :maNd AND dh.trang_thai = 'da_thanh_toan'",
           nativeQuery = true)
    Page<Object[]> findSachDaMuaByMaNd(@Param("maNd") Long maNd, Pageable pageable);
}
