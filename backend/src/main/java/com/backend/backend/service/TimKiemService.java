package com.backend.backend.service;

import com.backend.backend.dto.GoiYTimKiemResponse;
import com.backend.backend.dto.SachTimKiemResponse;
import com.backend.backend.dto.TimKiemRequest;
import com.backend.backend.entity.DanhMucSach;
import com.backend.backend.repository.DanhMucSachRepository;
import com.backend.backend.repository.SachDanhMucRepository;
import com.backend.backend.repository.SachRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TimKiemService {

    private final SachRepository sachRepository;
    private final SachDanhMucRepository sachDanhMucRepository;
    private final DanhMucSachRepository danhMucSachRepository;

    @Cacheable(value = "tim_kiem_sach",
               key = "#request.tu_khoa + '_' + #request.ma_danh_muc + '_' + #request.min_gia + '_' + #request.max_gia + '_' + #request.min_danh_gia + '_' + #request.sach_mien_phi + '_' + #request.sach_hoi_vien + '_' + #request.sap_xep + '_' + #request.trang + '_' + #request.kich_thuoc")
    public SachTimKiemResponse timKiemSach(TimKiemRequest request) {
        Sort sort = xacDinhSapXep(request.getSap_xep());
        Pageable pageable = PageRequest.of(request.getTrang() - 1, request.getKich_thuoc(), sort);

        BigDecimal minGia = request.getMin_gia() != null ? BigDecimal.valueOf(request.getMin_gia()) : null;
        BigDecimal maxGia = request.getMax_gia() != null ? BigDecimal.valueOf(request.getMax_gia()) : null;
        BigDecimal minDanhGia = request.getMin_danh_gia() != null ? BigDecimal.valueOf(request.getMin_danh_gia()) : null;

        Page<com.backend.backend.entity.Sach> page = sachRepository.timKiemSach(
                request.getTu_khoa(),
                request.getMa_danh_muc(),
                minGia,
                maxGia,
                minDanhGia,
                request.getSach_mien_phi(),
                request.getSach_hoi_vien(),
                pageable
        );

        // Batch load danh mục — tránh N+1 queries
        List<Long> sachIds = page.getContent().stream()
                .map(com.backend.backend.entity.Sach::getMaSach)
                .collect(Collectors.toList());

        Map<Long, List<Long>> sachToDmIds = new HashMap<>();
        if (!sachIds.isEmpty()) {
            sachDanhMucRepository.findByMaSachIn(sachIds).forEach(sd ->
                    sachToDmIds.computeIfAbsent(sd.getMaSach(), k -> new ArrayList<>()).add(sd.getMaDm())
            );
        }

        Set<Long> allDmIds = sachToDmIds.values().stream()
                .flatMap(List::stream)
                .collect(Collectors.toSet());
        Map<Long, String> dmTenMap = danhMucSachRepository.findAllById(allDmIds).stream()
                .collect(Collectors.toMap(DanhMucSach::getMaDm, DanhMucSach::getTenDanhMuc));

        List<SachTimKiemResponse.SachTimKiemData> danhSach = page.getContent().stream()
                .map(sach -> {
                    List<String> tenDanhMuc = sachToDmIds
                            .getOrDefault(sach.getMaSach(), Collections.emptyList())
                            .stream()
                            .map(dmTenMap::get)
                            .filter(Objects::nonNull)
                            .collect(Collectors.toList());

                    return new SachTimKiemResponse.SachTimKiemData(
                            sach.getMaSach(),
                            sach.getTenSach(),
                            sach.getTacGia(),
                            sach.getAnhBiaUrl(),
                            sach.getGia(),
                            sach.getDanhGiaTrungBinh() != null ? sach.getDanhGiaTrungBinh().doubleValue() : 0.0,
                            tenDanhMuc
                    );
                })
                .collect(Collectors.toList());

        return new SachTimKiemResponse(
                true,
                "Tìm kiếm thành công",
                danhSach,
                page.getNumber() + 1,
                page.getTotalPages(),
                page.getTotalElements(),
                request.getTu_khoa()
        );
    }

    @Cacheable(value = "goi_y_tim_kiem", key = "#tuKhoa")
    public GoiYTimKiemResponse goiYTimKiem(String tuKhoa) {
        // Dùng LinkedHashMap để dedup theo maSach, giữ thứ tự
        Map<Long, GoiYTimKiemResponse.GoiYData> ketQua = new LinkedHashMap<>();

        for (Object[] row : sachRepository.goiYTheoTenSach(tuKhoa)) {
            Long maSach = ((Number) row[0]).longValue();
            ketQua.putIfAbsent(maSach, new GoiYTimKiemResponse.GoiYData(maSach, (String) row[1], (String) row[2]));
        }

        if (ketQua.size() < 5) {
            for (Object[] row : sachRepository.goiYTheoTacGia(tuKhoa)) {
                if (ketQua.size() >= 5) break;
                Long maSach = ((Number) row[0]).longValue();
                ketQua.putIfAbsent(maSach, new GoiYTimKiemResponse.GoiYData(maSach, (String) row[1], (String) row[2]));
            }
        }

        return new GoiYTimKiemResponse(new ArrayList<>(ketQua.values()));
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
