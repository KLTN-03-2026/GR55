package com.backend.backend.repository;

import com.backend.backend.entity.DanhGia;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface DanhGiaRepository extends JpaRepository<DanhGia, Long> {

    @Query("SELECT AVG(d.soSao) FROM DanhGia d WHERE d.maSach = :maSach AND d.hienThi = true")
    Double tinhDiemTrungBinh(@Param("maSach") Long maSach);

    @Query("SELECT COUNT(d) FROM DanhGia d WHERE d.maSach = :maSach AND d.hienThi = true")
    Integer demSoLuotDanhGia(@Param("maSach") Long maSach);

    @Query("SELECT d FROM DanhGia d WHERE d.maSach = :maSach AND d.hienThi = true")
    Page<DanhGia> findDanhGiaBySach(@Param("maSach") Long maSach, Pageable pageable);

    @Query("SELECT d.soSao, COUNT(d) FROM DanhGia d WHERE d.maSach = :maSach AND d.hienThi = true GROUP BY d.soSao ORDER BY d.soSao DESC")
    List<Object[]> thongKePhanBoSao(@Param("maSach") Long maSach);

    Optional<DanhGia> findByMaNdAndMaSach(Long maNd, Long maSach);

    boolean existsByMaNdAndMaSach(Long maNd, Long maSach);

    @Modifying
    @Transactional
    @Query("DELETE FROM DanhGia d WHERE d.maNd = :maNd AND d.maSach = :maSach")
    void deleteByMaNdAndMaSach(@Param("maNd") Long maNd, @Param("maSach") Long maSach);

    @Query(value = "SELECT d.* FROM danh_gia d " +
                   "LEFT JOIN nguoi_dung nd ON d.ma_nd = nd.ma_nd " +
                   "LEFT JOIN sach s ON d.ma_sach = s.ma_sach " +
                   "WHERE (:tenSach IS NULL OR s.ten_sach LIKE CONCAT('%', :tenSach, '%')) " +
                   "AND (:tenNguoiDung IS NULL OR nd.ho_ten LIKE CONCAT('%', :tenNguoiDung, '%')) " +
                   "AND (:soSao IS NULL OR d.so_sao = :soSao) " +
                   "AND (:tuNgay IS NULL OR d.ngay_tao >= :tuNgay) " +
                   "AND (:denNgay IS NULL OR d.ngay_tao <= :denNgay) " +
                   "ORDER BY d.ngay_tao DESC",
           countQuery = "SELECT COUNT(d.ma_dg) FROM danh_gia d " +
                        "LEFT JOIN nguoi_dung nd ON d.ma_nd = nd.ma_nd " +
                        "LEFT JOIN sach s ON d.ma_sach = s.ma_sach " +
                        "WHERE (:tenSach IS NULL OR s.ten_sach LIKE CONCAT('%', :tenSach, '%')) " +
                        "AND (:tenNguoiDung IS NULL OR nd.ho_ten LIKE CONCAT('%', :tenNguoiDung, '%')) " +
                        "AND (:soSao IS NULL OR d.so_sao = :soSao) " +
                        "AND (:tuNgay IS NULL OR d.ngay_tao >= :tuNgay) " +
                        "AND (:denNgay IS NULL OR d.ngay_tao <= :denNgay)",
           nativeQuery = true)
    Page<DanhGia> timDanhGiaAdmin(@Param("tenSach") String tenSach,
                                   @Param("tenNguoiDung") String tenNguoiDung,
                                   @Param("soSao") Integer soSao,
                                   @Param("tuNgay") LocalDateTime tuNgay,
                                   @Param("denNgay") LocalDateTime denNgay,
                                   Pageable pageable);
}
