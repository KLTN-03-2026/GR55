package com.backend.backend.repository;

import com.backend.backend.entity.Sach;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface SachRepository extends JpaRepository<Sach, Long> {

    boolean existsByTenSachAndDaXoaFalse(String tenSach);

    boolean existsByTenSachAndMaSachNotAndDaXoaFalse(String tenSach, Long maSach);

    @Query("SELECT s FROM Sach s WHERE s.daXoa = false ORDER BY s.luotXem DESC, s.danhGiaTrungBinh DESC")
    Page<Sach> findSachNoiBat(Pageable pageable);

    @Query("SELECT s FROM Sach s WHERE s.daXoa = false ORDER BY s.ngayTao DESC")
    Page<Sach> findSachMoiNhat(Pageable pageable);

    @Query("SELECT s FROM Sach s WHERE s.daXoa = false AND s.gia = 0 ORDER BY s.luotXem DESC, s.danhGiaTrungBinh DESC")
    Page<Sach> findSachMienPhi(Pageable pageable);

    @Query(value = "SELECT s.* FROM sach s WHERE s.da_xoa = false AND s.ma_sach IN " +
                   "(SELECT g.ma_sach FROM goi_hoi_vien_sach g) ORDER BY RAND()",
           countQuery = "SELECT COUNT(*) FROM sach s WHERE s.da_xoa = false AND s.ma_sach IN " +
                        "(SELECT g.ma_sach FROM goi_hoi_vien_sach g)",
           nativeQuery = true)
    Page<Sach> findSachHoiVien(Pageable pageable);

    @Query("SELECT DISTINCT s FROM Sach s " +
           "JOIN SachDanhMuc sd ON s.maSach = sd.maSach " +
           "WHERE s.daXoa = false AND sd.maDm IN :danhSachDanhMuc " +
           "AND s.maSach NOT IN (SELECT td.maSach FROM TienDoDocSach td WHERE td.maNd = :maNd) " +
           "ORDER BY s.luotXem DESC")
    Page<Sach> findSachGoiYThanhVien(@Param("maNd") Long maNd,
                                      @Param("danhSachDanhMuc") List<Long> danhSachDanhMuc,
                                      Pageable pageable);

    // Tìm kiếm và lọc sách cho trang quản lý
    @Query("SELECT DISTINCT s FROM Sach s " +
           "LEFT JOIN SachDanhMuc sd ON sd.maSach = s.maSach " +
           "WHERE s.daXoa = false " +
           "AND (:tuKhoa IS NULL OR LOWER(s.tenSach) LIKE LOWER(CONCAT('%', :tuKhoa, '%')) " +
           "     OR LOWER(s.tacGia) LIKE LOWER(CONCAT('%', :tuKhoa, '%'))) " +
           "AND (:maDanhMuc IS NULL OR sd.maDm = :maDanhMuc) " +
           "AND (:mienPhi IS NULL OR (:mienPhi = true AND s.gia = 0) OR (:mienPhi = false AND s.gia > 0))")
    Page<Sach> timKiemVaLocSach(@Param("tuKhoa") String tuKhoa,
                                 @Param("maDanhMuc") Long maDanhMuc,
                                 @Param("mienPhi") Boolean mienPhi,
                                 Pageable pageable);

    // Tìm kiếm sách với đầy đủ bộ lọc
    @Query("SELECT DISTINCT s FROM Sach s " +
           "LEFT JOIN SachDanhMuc sd ON sd.maSach = s.maSach " +
           "WHERE s.daXoa = false " +
           "AND (:tuKhoa IS NULL OR LOWER(s.tenSach) LIKE LOWER(CONCAT('%', :tuKhoa, '%')) " +
           "     OR LOWER(s.tacGia) LIKE LOWER(CONCAT('%', :tuKhoa, '%'))) " +
           "AND (:maDanhMuc IS NULL OR sd.maDm = :maDanhMuc) " +
           "AND (:minGia IS NULL OR s.gia >= :minGia) " +
           "AND (:maxGia IS NULL OR s.gia <= :maxGia) " +
           "AND (:minDanhGia IS NULL OR s.danhGiaTrungBinh >= :minDanhGia) " +
           "AND (:mienPhi IS NULL OR (:mienPhi = true AND s.gia = 0) OR (:mienPhi = false AND s.gia > 0)) " +
           "AND (:sachHoiVien IS NULL " +
           "     OR (:sachHoiVien = true AND s.maSach IN (SELECT g.maSach FROM GoiHoiVienSach g)) " +
           "     OR (:sachHoiVien = false AND s.maSach NOT IN (SELECT g.maSach FROM GoiHoiVienSach g)))")
    Page<Sach> timKiemSach(@Param("tuKhoa") String tuKhoa,
                            @Param("maDanhMuc") Long maDanhMuc,
                            @Param("minGia") BigDecimal minGia,
                            @Param("maxGia") BigDecimal maxGia,
                            @Param("minDanhGia") BigDecimal minDanhGia,
                            @Param("mienPhi") Boolean mienPhi,
                            @Param("sachHoiVien") Boolean sachHoiVien,
                            Pageable pageable);

    // Gợi ý tìm kiếm theo tên sách (native SQL để dùng LIMIT)
    @Query(value = "SELECT s.ma_sach, s.ten_sach, s.tac_gia FROM sach s " +
                   "WHERE s.da_xoa = false AND LOWER(s.ten_sach) LIKE LOWER(CONCAT('%', :tuKhoa, '%')) " +
                   "ORDER BY s.luot_xem DESC LIMIT 5",
           nativeQuery = true)
    List<Object[]> goiYTheoTenSach(@Param("tuKhoa") String tuKhoa);

    // Gợi ý tìm kiếm theo tác giả (native SQL để dùng LIMIT)
    @Query(value = "SELECT s.ma_sach, s.ten_sach, s.tac_gia FROM sach s " +
                   "WHERE s.da_xoa = false AND LOWER(s.tac_gia) LIKE LOWER(CONCAT('%', :tuKhoa, '%')) " +
                   "ORDER BY s.luot_xem DESC LIMIT 5",
           nativeQuery = true)
    List<Object[]> goiYTheoTacGia(@Param("tuKhoa") String tuKhoa);

    @Modifying
    @Query("UPDATE Sach s SET s.luotXem = s.luotXem + 1 WHERE s.maSach = :maSach")
    void tangLuotXem(@Param("maSach") Long maSach);

    @Query("SELECT DISTINCT s FROM Sach s " +
           "JOIN SachDanhMuc sd ON s.maSach = sd.maSach " +
           "WHERE s.daXoa = false AND s.maSach <> :maSach AND sd.maDm IN :danhSachDanhMuc " +
           "ORDER BY s.luotXem DESC, s.danhGiaTrungBinh DESC")
    Page<Sach> findSachCungTheLoai(@Param("maSach") Long maSach,
                                    @Param("danhSachDanhMuc") List<Long> danhSachDanhMuc,
                                    Pageable pageable);
}
