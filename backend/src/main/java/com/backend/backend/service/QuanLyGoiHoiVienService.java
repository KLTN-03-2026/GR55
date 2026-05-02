package com.backend.backend.service;

import com.backend.backend.dto.DanhSachGoiHoiVienAdminResponse;
import com.backend.backend.dto.GoiHoiVienAdminRequest;
import com.backend.backend.dto.GoiHoiVienAdminResponse;
import com.backend.backend.dto.TimKiemSachGiamGiaResponse;
import com.backend.backend.entity.GoiHoiVien;
import com.backend.backend.entity.GoiHoiVienSach;
import com.backend.backend.entity.Sach;
import com.backend.backend.repository.GoiHoiVienRepository;
import com.backend.backend.repository.GoiHoiVienSachRepository;
import com.backend.backend.repository.LichSuHoiVienRepository;
import com.backend.backend.repository.SachRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuanLyGoiHoiVienService {

    private final GoiHoiVienRepository goiHoiVienRepository;
    private final GoiHoiVienSachRepository goiHoiVienSachRepository;
    private final LichSuHoiVienRepository lichSuHoiVienRepository;
    private final SachRepository sachRepository;

    @Cacheable(value = "goi_hoi_vien_admin",
               key = "#ten + '_' + #trang + '_' + #kichThuoc")
    public DanhSachGoiHoiVienAdminResponse layDanhSachGoi(String ten, int trang, int kichThuoc) {
        String tuKhoa = (ten != null && !ten.isBlank()) ? ten : null;
        Pageable pageable = PageRequest.of(trang - 1, kichThuoc);
        Page<GoiHoiVien> page = goiHoiVienRepository.findGoiForAdmin(tuKhoa, pageable);

        List<Long> maHvIds = page.getContent().stream()
                .map(GoiHoiVien::getMaHv)
                .collect(Collectors.toList());

        // Batch load số lượng sách và người dùng — tránh N+1
        Map<Long, Integer> soSachMap = new HashMap<>();
        Map<Long, Integer> soNguoiDungMap = new HashMap<>();
        if (!maHvIds.isEmpty()) {
            goiHoiVienSachRepository.countSachByMaHvIn(maHvIds).forEach(row ->
                    soSachMap.put(((Number) row[0]).longValue(), ((Number) row[1]).intValue()));
            lichSuHoiVienRepository.demNguoiDungTheoGoiIn(maHvIds).forEach(row ->
                    soNguoiDungMap.put(((Number) row[0]).longValue(), ((Number) row[1]).intValue()));
        }

        List<DanhSachGoiHoiVienAdminResponse.GoiHoiVienItem> danhSach = page.getContent().stream()
                .map(goi -> new DanhSachGoiHoiVienAdminResponse.GoiHoiVienItem(
                        goi.getMaHv(),
                        goi.getTenGoi(),
                        goi.getGia(),
                        goi.getThoiHanThang(),
                        goi.getMoTa(),
                        goi.getHoatDong(),
                        soSachMap.getOrDefault(goi.getMaHv(), 0),
                        soNguoiDungMap.getOrDefault(goi.getMaHv(), 0)
                ))
                .collect(Collectors.toList());

        return new DanhSachGoiHoiVienAdminResponse(
                true, "Lấy danh sách thành công",
                danhSach, page.getNumber() + 1, page.getTotalPages(), page.getTotalElements());
    }

    public GoiHoiVienAdminResponse layChiTietGoi(Long maHv) {
        GoiHoiVien goi = goiHoiVienRepository.findById(maHv)
                .orElseThrow(() -> new RuntimeException("Gói hội viên không tồn tại"));

        List<Long> sachIds = goiHoiVienSachRepository.findSachIdsByMaHv(maHv);

        return new GoiHoiVienAdminResponse(true, "Lấy chi tiết thành công",
                new GoiHoiVienAdminResponse.GoiHoiVienData(
                        goi.getMaHv(), goi.getTenGoi(), goi.getGia(), goi.getThoiHanThang(),
                        goi.getMoTa(), goi.getHoatDong(), sachIds.size(), sachIds));
    }

    public TimKiemSachGiamGiaResponse timKiemSachDeChon(String tuKhoa, Long maHv, int trang, int kichThuoc) {
        String kw = (tuKhoa != null && !tuKhoa.isBlank()) ? tuKhoa.trim() : null;
        Pageable pageable = PageRequest.of(trang - 1, kichThuoc);
        Page<Sach> page = sachRepository.timKiemSachChoGoiHoiVien(kw, pageable);

        Set<Long> sachTrongGoi = maHv != null
                ? new HashSet<>(goiHoiVienSachRepository.findSachIdsByMaHv(maHv))
                : Collections.emptySet();

        List<TimKiemSachGiamGiaResponse.SachItem> items = page.getContent().stream()
                .map(s -> new TimKiemSachGiamGiaResponse.SachItem(
                        s.getMaSach(), s.getTenSach(), s.getTacGia(), s.getAnhBiaUrl(),
                        s.getGia(), sachTrongGoi.contains(s.getMaSach())))
                .collect(Collectors.toList());

        return new TimKiemSachGiamGiaResponse(
                true, "Tìm kiếm thành công",
                items, page.getNumber() + 1, page.getTotalPages(), page.getTotalElements());
    }

    @Caching(evict = {
        @CacheEvict(value = "goi_hoi_vien_admin", allEntries = true),
        @CacheEvict(value = "goi_hoi_vien", allEntries = true),
        @CacheEvict(value = "sach_hoi_vien", allEntries = true)
    })
    @Transactional
    public GoiHoiVienAdminResponse themGoi(GoiHoiVienAdminRequest request) {
        if (goiHoiVienRepository.findByTenGoi(request.getTen_goi()).isPresent()) {
            return new GoiHoiVienAdminResponse(false, "Tên gói đã tồn tại", null);
        }

        GoiHoiVien goi = new GoiHoiVien();
        goi.setTenGoi(request.getTen_goi());
        goi.setGia(request.getGia());
        goi.setThoiHanThang(request.getThoi_han_thang());
        goi.setMoTa(request.getMo_ta());
        goi.setHoatDong(request.getHoat_dong() != null ? request.getHoat_dong() : true);
        GoiHoiVien saved = goiHoiVienRepository.save(goi);

        List<Long> sachIds = luuDanhSachSach(saved.getMaHv(), request.getDanh_sach_sach());

        return new GoiHoiVienAdminResponse(true, "Thêm gói thành công",
                new GoiHoiVienAdminResponse.GoiHoiVienData(
                        saved.getMaHv(), saved.getTenGoi(), saved.getGia(), saved.getThoiHanThang(),
                        saved.getMoTa(), saved.getHoatDong(), sachIds.size(), sachIds));
    }

    @Caching(evict = {
        @CacheEvict(value = "goi_hoi_vien_admin", allEntries = true),
        @CacheEvict(value = "goi_hoi_vien", allEntries = true),
        @CacheEvict(value = "sach_hoi_vien", allEntries = true)
    })
    @Transactional
    public GoiHoiVienAdminResponse suaGoi(Long maHv, GoiHoiVienAdminRequest request) {
        GoiHoiVien goi = goiHoiVienRepository.findById(maHv)
                .orElseThrow(() -> new RuntimeException("Gói hội viên không tồn tại"));

        if (!goi.getTenGoi().equals(request.getTen_goi())) {
            Optional<GoiHoiVien> trung = goiHoiVienRepository.findByTenGoi(request.getTen_goi());
            if (trung.isPresent() && !trung.get().getMaHv().equals(maHv)) {
                return new GoiHoiVienAdminResponse(false, "Tên gói đã tồn tại", null);
            }
        }

        goi.setTenGoi(request.getTen_goi());
        goi.setGia(request.getGia());
        goi.setThoiHanThang(request.getThoi_han_thang());
        goi.setMoTa(request.getMo_ta());
        goi.setHoatDong(request.getHoat_dong() != null ? request.getHoat_dong() : goi.getHoatDong());
        goiHoiVienRepository.save(goi);

        goiHoiVienSachRepository.deleteByMaHv(maHv);
        List<Long> sachIds = luuDanhSachSach(maHv, request.getDanh_sach_sach());

        return new GoiHoiVienAdminResponse(true, "Cập nhật gói thành công",
                new GoiHoiVienAdminResponse.GoiHoiVienData(
                        goi.getMaHv(), goi.getTenGoi(), goi.getGia(), goi.getThoiHanThang(),
                        goi.getMoTa(), goi.getHoatDong(), sachIds.size(), sachIds));
    }

    @Caching(evict = {
        @CacheEvict(value = "goi_hoi_vien_admin", allEntries = true),
        @CacheEvict(value = "goi_hoi_vien", allEntries = true),
        @CacheEvict(value = "sach_hoi_vien", allEntries = true)
    })
    @Transactional
    public GoiHoiVienAdminResponse xoaGoi(Long maHv) {
        GoiHoiVien goi = goiHoiVienRepository.findById(maHv)
                .orElseThrow(() -> new RuntimeException("Gói hội viên không tồn tại"));

        int soNguoiDung = lichSuHoiVienRepository.demNguoiDungDangSuDung(maHv);
        if (soNguoiDung > 0) {
            return new GoiHoiVienAdminResponse(false,
                    "Không thể xóa gói đang có " + soNguoiDung + " người dùng sử dụng", null);
        }

        goiHoiVienSachRepository.deleteByMaHv(maHv);
        goiHoiVienRepository.delete(goi);
        return new GoiHoiVienAdminResponse(true, "Xóa gói thành công", null);
    }

    @Caching(evict = {
        @CacheEvict(value = "goi_hoi_vien_admin", allEntries = true),
        @CacheEvict(value = "goi_hoi_vien", allEntries = true)
    })
    @Transactional
    public GoiHoiVienAdminResponse capNhatTrangThai(Long maHv, Boolean hoatDong) {
        GoiHoiVien goi = goiHoiVienRepository.findById(maHv)
                .orElseThrow(() -> new RuntimeException("Gói hội viên không tồn tại"));
        goi.setHoatDong(hoatDong);
        goiHoiVienRepository.save(goi);
        return new GoiHoiVienAdminResponse(true,
                hoatDong ? "Kích hoạt gói thành công" : "Vô hiệu hóa gói thành công", null);
    }

    private List<Long> luuDanhSachSach(Long maHv, List<Long> sachIds) {
        if (sachIds == null || sachIds.isEmpty()) return Collections.emptyList();
        LocalDateTime now = LocalDateTime.now();
        List<GoiHoiVienSach> links = sachIds.stream().map(maSach -> {
            GoiHoiVienSach gs = new GoiHoiVienSach();
            gs.setMaHv(maHv);
            gs.setMaSach(maSach);
            gs.setNgayTao(now);
            return gs;
        }).collect(Collectors.toList());
        goiHoiVienSachRepository.saveAll(links);
        return sachIds;
    }
}
