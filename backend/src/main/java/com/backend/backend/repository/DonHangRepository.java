package com.backend.backend.repository;

import com.backend.backend.entity.DonHang;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface DonHangRepository extends JpaRepository<DonHang, Long> {

    @Query(value = "SELECT COUNT(*) > 0 FROM chi_tiet_don_hang ct " +
                   "INNER JOIN don_hang dh ON ct.id_dh = dh.id_dh " +
                   "WHERE ct.ma_sach = :ma_sach AND dh.trang_thai = 'da_thanh_toan'",
           nativeQuery = true)
    boolean kiemTraSachDaBan(@Param("ma_sach") Long maSach);

    @Query(value = "SELECT COUNT(*) > 0 FROM chi_tiet_don_hang ct " +
                   "INNER JOIN don_hang dh ON ct.id_dh = dh.id_dh " +
                   "WHERE ct.ma_sach = :maSach AND dh.ma_nd = :maNd AND dh.trang_thai = 'da_thanh_toan'",
           nativeQuery = true)
    boolean daMuaSach(@Param("maNd") Long maNd, @Param("maSach") Long maSach);
}
