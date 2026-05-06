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

    @Query(value = "SELECT so_sao, COUNT(*) AS so_luong FROM danh_gia WHERE hien_thi = true GROUP BY so_sao ORDER BY so_sao DESC",
           nativeQuery = true)
    List<Object[]> thongKePhanBoSaoToanHeThong();

    @Query(value = "SELECT COUNT(*), COALESCE(AVG(so_sao), 0) FROM danh_gia WHERE hien_thi = true",
           nativeQuery = true)
    List<Object[]> tongQuanDanhGia();

    @Query(value = "SELECT s.ma_sach, s.ten_sach, s.tac_gia, " +
                   "ROUND(AVG(d.so_sao), 2) AS diem_tb, COUNT(d.ma_dg) AS so_danh_gia " +
                   "FROM danh_gia d JOIN sach s ON d.ma_sach = s.ma_sach " +
                   "WHERE d.hien_thi = true AND s.da_xoa = false " +
                   "GROUP BY s.ma_sach, s.ten_sach, s.tac_gia " +
                   "HAVING COUNT(d.ma_dg) >= 1 ORDER BY diem_tb DESC, so_danh_gia DESC LIMIT 5",
           nativeQuery = true)
    List<Object[]> topSachDanhGiaCao();

    @Query(value = "SELECT s.ma_sach, s.ten_sach, s.tac_gia, " +
                   "ROUND(AVG(d.so_sao), 2) AS diem_tb, COUNT(d.ma_dg) AS so_danh_gia " +
                   "FROM danh_gia d JOIN sach s ON d.ma_sach = s.ma_sach " +
                   "WHERE d.hien_thi = true AND s.da_xoa = false " +
                   "GROUP BY s.ma_sach, s.ten_sach, s.tac_gia " +
                   "HAVING COUNT(d.ma_dg) >= 1 ORDER BY diem_tb ASC, so_danh_gia DESC LIMIT 5",
           nativeQuery = true)
    List<Object[]> topSachDanhGiaThap();

    @Query(value = "SELECT ROUND(COUNT(DISTINCT d.ma_nd) * 100.0 / " +
                   "NULLIF((SELECT COUNT(DISTINCT dh.ma_nd) FROM don_hang dh WHERE dh.trang_thai = 'da_thanh_toan'), 0), 1) " +
                   "FROM danh_gia d WHERE d.hien_thi = true",
           nativeQuery = true)
    Double tyLeNguoiMuaDanhGia();
}
