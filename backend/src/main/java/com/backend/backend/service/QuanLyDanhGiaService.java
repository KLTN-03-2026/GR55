package com.backend.backend.service;

import com.backend.backend.dto.CapNhatTrangThaiDanhGiaRequest;
import com.backend.backend.dto.DanhGiaResponse;
import com.backend.backend.dto.DanhSachDanhGiaAdminResponse;
import com.backend.backend.entity.DanhGia;
import com.backend.backend.entity.NguoiDung;
import com.backend.backend.entity.Sach;
import com.backend.backend.repository.DanhGiaRepository;
import com.backend.backend.repository.NguoiDungRepository;
import com.backend.backend.repository.SachRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuanLyDanhGiaService {

    private final DanhGiaRepository danhGiaRepository;
    private final SachRepository sachRepository;
    private final NguoiDungRepository nguoiDungRepository;

    @Cacheable(value = "danh_gia_admin",
               key = "#tenSach + '_' + #tenNguoiDung + '_' + #soSao + '_' + #tuNgay + '_' + #denNgay + '_' + #trang + '_' + #kichThuoc")
    public DanhSachDanhGiaAdminResponse layDanhSachDanhGia(String tenSach, String tenNguoiDung,
                                                            Integer soSao, String tuNgay, String denNgay,
                                                            int trang, int kichThuoc) {
        LocalDateTime startDate = null;
        LocalDateTime endDate = null;
        if (tuNgay != null && !tuNgay.isBlank()) startDate = LocalDateTime.parse(tuNgay + "T00:00:00");
        if (denNgay != null && !denNgay.isBlank()) endDate = LocalDateTime.parse(denNgay + "T23:59:59");

        Page<DanhGia> page = danhGiaRepository.timDanhGiaAdmin(
                tenSach, tenNguoiDung, soSao, startDate, endDate,
                PageRequest.of(trang - 1, kichThuoc));

        // Batch load NguoiDung và Sach — tránh N+1
        List<Long> dsMaNd = page.getContent().stream().map(DanhGia::getMaNd).distinct().collect(Collectors.toList());
        List<Long> dsMaSach = page.getContent().stream().map(DanhGia::getMaSach).distinct().collect(Collectors.toList());

        Map<Long, String> tenNguoiDungMap = nguoiDungRepository.findAllById(dsMaNd)
                .stream().collect(Collectors.toMap(NguoiDung::getMaNguoiDung, NguoiDung::getHoTen));
        Map<Long, String> tenSachMap = sachRepository.findAllById(dsMaSach)
                .stream().collect(Collectors.toMap(Sach::getMaSach, Sach::getTenSach));

        List<DanhSachDanhGiaAdminResponse.DanhGiaAdminData> danhSach = page.getContent().stream()
                .map(dg -> new DanhSachDanhGiaAdminResponse.DanhGiaAdminData(
                        dg.getMaDg(),
                        tenNguoiDungMap.getOrDefault(dg.getMaNd(), "Ẩn danh"),
                        tenSachMap.getOrDefault(dg.getMaSach(), ""),
                        dg.getSoSao(),
                        dg.getNoiDung(),
                        dg.getNgayTao(),
                        dg.getHienThi()
                ))
                .collect(Collectors.toList());

        return new DanhSachDanhGiaAdminResponse(
                true, "Lấy danh sách đánh giá thành công",
                danhSach, page.getNumber() + 1, page.getTotalPages(), page.getTotalElements());
    }

    @Caching(evict = {
        @CacheEvict(value = "danh_gia_admin", allEntries = true),
        @CacheEvict(value = "danh_gia_sach", allEntries = true),
        @CacheEvict(value = "chi_tiet_sach", allEntries = true)
    })
    @Transactional
    public DanhGiaResponse capNhatTrangThaiDanhGia(Long maDg, CapNhatTrangThaiDanhGiaRequest request) {
        DanhGia danhGia = danhGiaRepository.findById(maDg)
                .orElseThrow(() -> new RuntimeException("Đánh giá không tồn tại"));

        danhGia.setHienThi(request.getHien_thi());
        danhGiaRepository.save(danhGia);
        capNhatDiemTrungBinh(danhGia.getMaSach());

        String message = Boolean.TRUE.equals(request.getHien_thi())
                ? "Hiển thị đánh giá thành công" : "Ẩn đánh giá thành công";
        return new DanhGiaResponse(true, message, null);
    }

    @Caching(evict = {
        @CacheEvict(value = "danh_gia_admin", allEntries = true),
        @CacheEvict(value = "danh_gia_sach", allEntries = true),
        @CacheEvict(value = "chi_tiet_sach", allEntries = true)
    })
    @Transactional
    public DanhGiaResponse xoaDanhGia(Long maDg) {
        DanhGia danhGia = danhGiaRepository.findById(maDg)
                .orElseThrow(() -> new RuntimeException("Đánh giá không tồn tại"));

        Long maSach = danhGia.getMaSach();
        danhGiaRepository.delete(danhGia);
        capNhatDiemTrungBinh(maSach);

        return new DanhGiaResponse(true, "Xóa đánh giá thành công", null);
    }

    private void capNhatDiemTrungBinh(Long maSach) {
        Double avg = danhGiaRepository.tinhDiemTrungBinh(maSach);
        sachRepository.findById(maSach).ifPresent(sach -> {
            sach.setDanhGiaTrungBinh(avg != null
                    ? BigDecimal.valueOf(avg).setScale(2, RoundingMode.HALF_UP)
                    : BigDecimal.ZERO);
            sachRepository.save(sach);
        });
    }
}
