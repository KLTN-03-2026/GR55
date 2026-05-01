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

    @Query(value = "SELECT t.* FROM tien_do_doc_sach t " +
                   "WHERE t.ma_nd = :maNd AND t.phan_tram > 0 AND t.phan_tram < 100 " +
                   "AND EXISTS (" +
                   "  SELECT 1 FROM chi_tiet_don_hang ct " +
                   "  INNER JOIN don_hang dh ON ct.id_dh = dh.id_dh " +
                   "  WHERE dh.ma_nd = :maNd AND dh.trang_thai = 'da_thanh_toan' AND ct.ma_sach = t.ma_sach" +
                   ") ORDER BY t.lan_doc_cuoi DESC",
           countQuery = "SELECT COUNT(*) FROM tien_do_doc_sach t " +
                        "WHERE t.ma_nd = :maNd AND t.phan_tram > 0 AND t.phan_tram < 100 " +
                        "AND EXISTS (" +
                        "  SELECT 1 FROM chi_tiet_don_hang ct " +
                        "  INNER JOIN don_hang dh ON ct.id_dh = dh.id_dh " +
                        "  WHERE dh.ma_nd = :maNd AND dh.trang_thai = 'da_thanh_toan' AND ct.ma_sach = t.ma_sach" +
                        ")",
           nativeQuery = true)
    Page<TienDoDocSach> findSachDangDoc(@Param("maNd") Long maNd, Pageable pageable);

    @Query("SELECT DISTINCT t.maSach FROM TienDoDocSach t WHERE t.maNd = :maNd")
    List<Long> findSachDaDocByUserId(@Param("maNd") Long maNd);

    boolean existsByMaSach(Long maSach);

    @Query("SELECT sd.maDm FROM TienDoDocSach td " +
           "JOIN SachDanhMuc sd ON td.maSach = sd.maSach " +
           "WHERE td.maNd = :maNd " +
           "GROUP BY sd.maDm ORDER BY COUNT(sd.maDm) DESC")
    List<Long> findTheLoaiYeuThichByUserId(@Param("maNd") Long maNd);

    @Query("SELECT CASE WHEN COUNT(t) > 0 THEN true ELSE false END FROM TienDoDocSach t " +
           "WHERE t.maNd = :maNd AND t.maSach IN :danhSachMaSach AND t.trangHienTai > 5")
    boolean coSachDaDocQua5Trang(@Param("maNd") Long maNd, @Param("danhSachMaSach") List<Long> danhSachMaSach);
}
