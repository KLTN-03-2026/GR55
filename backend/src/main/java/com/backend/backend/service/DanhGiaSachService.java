package com.backend.backend.service;

import com.backend.backend.dto.DanhGiaResponse;
import com.backend.backend.dto.SuaDanhGiaRequest;
import com.backend.backend.dto.ThemDanhGiaRequest;
import com.backend.backend.entity.DanhGia;
import com.backend.backend.entity.NguoiDung;
import com.backend.backend.entity.Sach;
import com.backend.backend.repository.DanhGiaRepository;
import com.backend.backend.repository.DonHangRepository;
import com.backend.backend.repository.GoiHoiVienSachRepository;
import com.backend.backend.repository.LichSuHoiVienRepository;
import com.backend.backend.repository.NguoiDungRepository;
import com.backend.backend.repository.SachRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Caching;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class DanhGiaSachService {

    private final DanhGiaRepository danhGiaRepository;
    private final SachRepository sachRepository;
    private final NguoiDungRepository nguoiDungRepository;
    private final DonHangRepository donHangRepository;
    private final LichSuHoiVienRepository lichSuHoiVienRepository;
    private final GoiHoiVienSachRepository goiHoiVienSachRepository;

    private boolean kiemTraQuyenDanhGia(Long maNd, Long maSach) {
        Sach sach = sachRepository.findById(maSach)
                .orElseThrow(() -> new RuntimeException("Sách không tồn tại"));

        // Sách miễn phí: chỉ cần đăng nhập
        if (sach.getGia().compareTo(BigDecimal.ZERO) == 0) {
            return true;
        }

        // Sách trả phí: kiểm tra đã mua
        if (donHangRepository.daMuaSach(maNd, maSach) > 0) {
            return true;
        }

        // Sách hội viên: kiểm tra là hội viên và sách thuộc gói
        boolean laSachHoiVien = goiHoiVienSachRepository.existsByMaSach(maSach);
        if (laSachHoiVien) {
            return lichSuHoiVienRepository.isHoiVien(maNd, LocalDateTime.now());
        }

        return false;
    }

    @Caching(evict = {
        @CacheEvict(value = "danh_gia_sach", allEntries = true),
        @CacheEvict(value = "chi_tiet_sach", allEntries = true)
    })
    @Transactional
    public DanhGiaResponse themDanhGia(Long maNd, Long maSach, ThemDanhGiaRequest request) {
        if (!kiemTraQuyenDanhGia(maNd, maSach)) {
            return new DanhGiaResponse(false, "Bạn chưa mua sách này hoặc không có quyền đánh giá", null);
        }

        if (danhGiaRepository.existsByMaNdAndMaSach(maNd, maSach)) {
            return new DanhGiaResponse(false, "Bạn đã đánh giá sách này rồi", null);
        }

        NguoiDung nguoiDung = nguoiDungRepository.findById(maNd)
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));

        DanhGia danhGia = new DanhGia();
        danhGia.setMaNd(maNd);
        danhGia.setMaSach(maSach);
        danhGia.setSoSao(request.getSo_sao());
        danhGia.setNoiDung(request.getNoi_dung());
        danhGia.setHienThi(true);

        DanhGia saved = danhGiaRepository.save(danhGia);
        capNhatDiemTrungBinh(maSach);

        return new DanhGiaResponse(true, "Đánh giá thành công",
                xayDungData(saved, nguoiDung.getHoTen(), true));
    }

    @Caching(evict = {
        @CacheEvict(value = "danh_gia_sach", allEntries = true),
        @CacheEvict(value = "chi_tiet_sach", allEntries = true)
    })
    @Transactional
    public DanhGiaResponse suaDanhGia(Long maNd, Long maSach, SuaDanhGiaRequest request) {
        DanhGia danhGia = danhGiaRepository.findByMaNdAndMaSach(maNd, maSach)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đánh giá"));

        danhGia.setSoSao(request.getSo_sao());
        danhGia.setNoiDung(request.getNoi_dung());
        danhGiaRepository.save(danhGia);
        capNhatDiemTrungBinh(maSach);

        String tenNguoiDung = nguoiDungRepository.findById(maNd)
                .map(NguoiDung::getHoTen).orElse("");

        return new DanhGiaResponse(true, "Sửa đánh giá thành công",
                xayDungData(danhGia, tenNguoiDung, true));
    }

    @Caching(evict = {
        @CacheEvict(value = "danh_gia_sach", allEntries = true),
        @CacheEvict(value = "chi_tiet_sach", allEntries = true)
    })
    @Transactional
    public DanhGiaResponse xoaDanhGia(Long maNd, Long maSach) {
        if (!danhGiaRepository.existsByMaNdAndMaSach(maNd, maSach)) {
            return new DanhGiaResponse(false, "Không tìm thấy đánh giá", null);
        }

        danhGiaRepository.deleteByMaNdAndMaSach(maNd, maSach);
        capNhatDiemTrungBinh(maSach);

        return new DanhGiaResponse(true, "Xóa đánh giá thành công", null);
    }

    private void capNhatDiemTrungBinh(Long maSach) {
        Double avg = danhGiaRepository.tinhDiemTrungBinh(maSach);
        Sach sach = sachRepository.findById(maSach)
                .orElseThrow(() -> new RuntimeException("Sách không tồn tại"));
        sach.setDanhGiaTrungBinh(avg != null
                ? BigDecimal.valueOf(avg).setScale(2, RoundingMode.HALF_UP)
                : BigDecimal.ZERO);
        sachRepository.save(sach);
    }

    private DanhGiaResponse.DanhGiaData xayDungData(DanhGia danhGia, String tenNguoiDung, boolean laCuaToi) {
        return new DanhGiaResponse.DanhGiaData(
                danhGia.getMaDg(),
                danhGia.getMaNd(),
                tenNguoiDung,
                danhGia.getSoSao(),
                danhGia.getNoiDung(),
                danhGia.getNgayTao(),
                laCuaToi
        );
    }
}
