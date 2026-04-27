package com.backend.backend.repository;

import com.backend.backend.entity.ChiTietDonHang;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ChiTietDonHangRepository extends JpaRepository<ChiTietDonHang, Long> {

    List<ChiTietDonHang> findByIdDhOrderByMaCtdhAsc(Long idDh);

    @Query(value = "SELECT ct.ma_sach, s.ten_sach, s.tac_gia, COUNT(ct.ma_ctdh) AS so_luong, SUM(ct.don_gia) AS doanh_thu " +
                   "FROM chi_tiet_don_hang ct " +
                   "INNER JOIN don_hang dh ON ct.id_dh = dh.id_dh " +
                   "INNER JOIN sach s ON ct.ma_sach = s.ma_sach " +
                   "WHERE dh.trang_thai = 'da_thanh_toan' AND dh.ngay_tao BETWEEN :tuNgay AND :denNgay " +
                   "GROUP BY ct.ma_sach, s.ten_sach, s.tac_gia " +
                   "ORDER BY so_luong DESC LIMIT 10",
           nativeQuery = true)
    List<Object[]> findSachBanChay(@Param("tuNgay") LocalDateTime tuNgay,
                                    @Param("denNgay") LocalDateTime denNgay);
}
