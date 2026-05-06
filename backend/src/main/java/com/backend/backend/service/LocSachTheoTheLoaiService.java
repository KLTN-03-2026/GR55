package com.backend.backend.service;

import com.backend.backend.dto.GiamGiaInfo;
import com.backend.backend.dto.LocTheoTheLoaiRequest;
import com.backend.backend.dto.SachTheoTheLoaiResponse;
import com.backend.backend.entity.DanhMucSach;
import com.backend.backend.entity.Sach;
import com.backend.backend.repository.DanhMucSachRepository;
import com.backend.backend.repository.GoiHoiVienSachRepository;
import com.backend.backend.repository.SachRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LocSachTheoTheLoaiService {

    private final SachRepository sachRepository;
    private final DanhMucSachRepository danhMucSachRepository;
    private final QuanLyGiamGiaService quanLyGiamGiaService;
    private final GoiHoiVienSachRepository goiHoiVienSachRepository;

    @Cacheable(value = "sach_theo_the_loai",
               key = "#request.ma_the_loai + '_' + #request.min_gia + '_' + #request.max_gia + '_' + #request.min_danh_gia + '_' + #request.sach_mien_phi + '_' + #request.sach_hoi_vien + '_' + #request.sap_xep + '_' + #request.trang + '_' + #request.kich_thuoc")
    public SachTheoTheLoaiResponse laySachTheoTheLoai(LocTheoTheLoaiRequest request) {
        DanhMucSach danhMuc = danhMucSachRepository.findById(request.getMa_the_loai())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Thể loại không tồn tại"));

        Sort sort = xacDinhSapXep(request.getSap_xep());
        Pageable pageable = PageRequest.of(request.getTrang() - 1, request.getKich_thuoc(), sort);

        BigDecimal minGia = request.getMin_gia() != null ? BigDecimal.valueOf(request.getMin_gia()) : null;
        BigDecimal maxGia = request.getMax_gia() != null ? BigDecimal.valueOf(request.getMax_gia()) : null;
        BigDecimal minDanhGia = request.getMin_danh_gia() != null ? BigDecimal.valueOf(request.getMin_danh_gia()) : null;

        Page<Sach> page = sachRepository.findSachByTheLoai(
                request.getMa_the_loai(),
                minGia,
                maxGia,
                minDanhGia,
                request.getSach_mien_phi(),
                request.getSach_hoi_vien(),
                pageable
        );

        // Dùng countSachByDanhMuc đã có để lấy tổng số sách trong thể loại
        long tongSoSach = danhMucSachRepository.countSachByDanhMuc(request.getMa_the_loai());

        List<Long> sachIds = page.getContent().stream()
                .map(Sach::getMaSach)
                .collect(Collectors.toList());
        Set<Long> hoiVienIds = sachIds.isEmpty()
                ? Collections.emptySet()
                : new HashSet<>(goiHoiVienSachRepository.findActiveSachIdsIn(sachIds));

        List<SachTheoTheLoaiResponse.SachData> danhSach = page.getContent().stream()
                .map(sach -> {
                    GiamGiaInfo info = quanLyGiamGiaService.layGiamGiaInfo(sach.getMaSach());
                    return new SachTheoTheLoaiResponse.SachData(
                            sach.getMaSach(),
                            sach.getTenSach(),
                            sach.getTacGia(),
                            sach.getAnhBiaUrl(),
                            sach.getGia(),
                            sach.getDanhGiaTrungBinh() != null ? sach.getDanhGiaTrungBinh().doubleValue() : 0.0,
                            info != null ? info.getGia_sau_giam() : null,
                            info != null ? info.getNhan_giam() : null,
                            hoiVienIds.contains(sach.getMaSach()));
                })
                .collect(Collectors.toList());

        SachTheoTheLoaiResponse.ThongTinTheLoai thongTin = new SachTheoTheLoaiResponse.ThongTinTheLoai(
                danhMuc.getMaDm(),
                danhMuc.getTenDanhMuc(),
                tongSoSach
        );

        return new SachTheoTheLoaiResponse(
                true,
                "Lấy sách theo thể loại thành công",
                thongTin,
                danhSach,
                page.getNumber() + 1,
                page.getTotalPages(),
                page.getTotalElements()
        );
    }

    private Sort xacDinhSapXep(String sapXep) {
        if (sapXep == null) return Sort.by("ngayTao").descending();
        return switch (sapXep) {
            case "doc_nhieu"    -> Sort.by("luotXem").descending();
            case "gia_tang_dan" -> Sort.by("gia").ascending();
            case "gia_giam_dan" -> Sort.by("gia").descending();
            default             -> Sort.by("luotXem").descending();
        };
    }
}
