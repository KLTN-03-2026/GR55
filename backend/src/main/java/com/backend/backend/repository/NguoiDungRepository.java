package com.backend.backend.repository;

import com.backend.backend.entity.NguoiDung;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface NguoiDungRepository extends JpaRepository<NguoiDung, Long> {

    Optional<NguoiDung> findByEmail(String email);

    boolean existsByEmail(String email);

    @Query("SELECT COUNT(n) FROM NguoiDung n")
    long demTongNguoiDung();

    @Query(value = "SELECT COUNT(*) FROM nguoi_dung WHERE ma_vt = 1", nativeQuery = true)
    long demThanhVien();

    @Query(value = "SELECT COUNT(*) FROM nguoi_dung WHERE ma_vt = 2", nativeQuery = true)
    long demQuanTri();

    @Query(value = "SELECT DATE(n.ngay_tao) AS ngay, COUNT(*) AS so_luong " +
                   "FROM nguoi_dung n " +
                   "WHERE n.ngay_tao BETWEEN :tuNgay AND :denNgay " +
                   "GROUP BY DATE(n.ngay_tao) ORDER BY DATE(n.ngay_tao)",
           nativeQuery = true)
    List<Object[]> thongKeNguoiDungMoiTheoNgay(@Param("tuNgay") LocalDateTime tuNgay,
                                                @Param("denNgay") LocalDateTime denNgay);

    @Query("SELECT nd FROM NguoiDung nd WHERE " +
           "(:tu_khoa IS NULL OR nd.hoTen LIKE %:tu_khoa% OR nd.email LIKE %:tu_khoa%) AND " +
           "(:ma_vt IS NULL OR nd.vaiTro.maVaiTro = :ma_vt) AND " +
           "(:trang_thai IS NULL OR nd.trangThai = :trang_thai)")
    Page<NguoiDung> timKiemNguoiDung(
            @Param("tu_khoa") String tuKhoa,
            @Param("ma_vt") Long maVaiTro,
            @Param("trang_thai") NguoiDung.TrangThai trangThai,
            Pageable pageable);
}
