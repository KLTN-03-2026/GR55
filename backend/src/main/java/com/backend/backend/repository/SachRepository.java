package com.backend.backend.repository;

import com.backend.backend.entity.Sach;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SachRepository extends JpaRepository<Sach, Long> {

    boolean existsByTenSachAndDaXoaFalse(String tenSach);

    boolean existsByTenSachAndMaSachNotAndDaXoaFalse(String tenSach, Long maSach);

    @Query("SELECT s FROM Sach s WHERE s.daXoa = false ORDER BY s.luotXem DESC, s.danhGiaTrungBinh DESC")
    Page<Sach> findSachNoiBat(Pageable pageable);

    @Query("SELECT s FROM Sach s WHERE s.daXoa = false ORDER BY s.ngayTao DESC")
    Page<Sach> findSachMoiNhat(Pageable pageable);

    @Query("SELECT s FROM Sach s WHERE s.daXoa = false AND s.maSach IN " +
           "(SELECT g.maSach FROM GoiHoiVienSach g)")
    Page<Sach> findSachHoiVien(Pageable pageable);

    @Query("SELECT DISTINCT s FROM Sach s " +
           "JOIN SachDanhMuc sd ON s.maSach = sd.maSach " +
           "WHERE s.daXoa = false AND sd.maDm IN :danhSachDanhMuc " +
           "AND s.maSach NOT IN (SELECT td.maSach FROM TienDoDocSach td WHERE td.maNd = :maNd) " +
           "ORDER BY s.luotXem DESC")
    Page<Sach> findSachGoiYThanhVien(@Param("maNd") Long maNd,
                                      @Param("danhSachDanhMuc") List<Long> danhSachDanhMuc,
                                      Pageable pageable);

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

    @Query("SELECT DISTINCT s FROM Sach s " +
           "LEFT JOIN SachDanhMuc sd ON sd.maSach = s.maSach " +
           "WHERE s.daXoa = false " +
           "AND (:tuKhoa IS NULL OR LOWER(s.tenSach) LIKE LOWER(CONCAT('%', :tuKhoa, '%')) " +
           "     OR LOWER(s.tacGia) LIKE LOWER(CONCAT('%', :tuKhoa, '%'))) " +
           "AND (:maDanhMuc IS NULL OR sd.maDm = :maDanhMuc)")
    Page<Sach> timKiemVaLocSach(@Param("tuKhoa") String tuKhoa,
                                 @Param("maDanhMuc") Long maDanhMuc,
                                 Pageable pageable);
}
