package com.backend.backend.service;

import com.backend.backend.dto.DangKyGoiHoiVienRequest;
import com.backend.backend.dto.DangKyGoiHoiVienResponse;
import com.backend.backend.dto.GoiHoiVienResponse;
import com.backend.backend.entity.GoiHoiVien;
import com.backend.backend.entity.LichSuHoiVien;
import com.backend.backend.repository.GoiHoiVienRepository;
import com.backend.backend.repository.LichSuHoiVienRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NangCapHoiVienService {

    private final GoiHoiVienRepository goiHoiVienRepository;
    private final LichSuHoiVienRepository lichSuHoiVienRepository;
    private final VnpayService vnpayService;

    @Cacheable(value = "goi_hoi_vien", unless = "#result == null")
    public GoiHoiVienResponse layDanhSachGoi() {
        List<GoiHoiVien> goiList = goiHoiVienRepository.findByHoatDongTrue();
        List<GoiHoiVienResponse.GoiHoiVienData> data = goiList.stream()
                .map(goi -> new GoiHoiVienResponse.GoiHoiVienData(
                        goi.getMaHv(), goi.getTenGoi(), goi.getGia(),
                        goi.getThoiHanThang(), goi.getMoTa(), goi.getHoatDong()))
                .collect(Collectors.toList());
        return new GoiHoiVienResponse(true, "Lấy danh sách gói thành công", data);
    }

    @Cacheable(value = "thong_tin_hoi_vien", key = "#maNd")
    public boolean kiemTraHoiVien(Long maNd) {
        return lichSuHoiVienRepository.isHoiVien(maNd, LocalDateTime.now());
    }

    public DangKyGoiHoiVienResponse dangKyGoi(Long maNd, DangKyGoiHoiVienRequest request) {
        if (kiemTraHoiVien(maNd)) {
            return new DangKyGoiHoiVienResponse(false, "Bạn đang là hội viên còn hiệu lực", null);
        }

        GoiHoiVien goi = goiHoiVienRepository.findByMaHvAndHoatDongTrue(request.getMa_goi())
                .orElseThrow(() -> new RuntimeException("Gói hội viên không tồn tại hoặc không còn hoạt động"));

        String thanhToanUrl = vnpayService.taoUrlThanhToanHoiVien(maNd, goi.getMaHv(), goi.getGia(), request.isDungQr());
        return new DangKyGoiHoiVienResponse(true, "Tạo yêu cầu thanh toán thành công",
                new DangKyGoiHoiVienResponse.DangKyData(thanhToanUrl));
    }

    @Transactional
    @CacheEvict(value = "thong_tin_hoi_vien", key = "#maNd")
    public void xuLyThanhToanThanhCong(Long maNd, Long maHv) {
        // Idempotent: bỏ qua nếu IPN đã xử lý trước đó
        if (lichSuHoiVienRepository.isHoiVien(maNd, LocalDateTime.now())) {
            return;
        }

        GoiHoiVien goi = goiHoiVienRepository.findById(maHv)
                .orElseThrow(() -> new RuntimeException("Gói hội viên không tồn tại"));

        LocalDateTime now = LocalDateTime.now();
        LichSuHoiVien lichSu = new LichSuHoiVien();
        lichSu.setMaNd(maNd);
        lichSu.setMaHv(maHv);
        lichSu.setNgayBatDau(now);
        lichSu.setNgayKetThuc(now.plusMonths(goi.getThoiHanThang()));
        lichSu.setTrangThai("hoat_dong");
        lichSuHoiVienRepository.save(lichSu);
    }
}
