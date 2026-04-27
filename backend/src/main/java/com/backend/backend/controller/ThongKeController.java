package com.backend.backend.controller;

import com.backend.backend.dto.*;
import com.backend.backend.service.ThongKeService;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Caching;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/thong_ke")
@PreAuthorize("hasRole('QUAN_TRI')")
@RequiredArgsConstructor
public class ThongKeController {

    private final ThongKeService thongKeService;

    @GetMapping("/tong_quan")
    public ResponseEntity<ThongKeTongQuanResponse> thongKeTongQuan() {
        return ResponseEntity.ok(thongKeService.thongKeTongQuan());
    }

    @GetMapping("/doanh_thu")
    public ResponseEntity<DoanhThuTheoThoiGianResponse> thongKeDoanhThu(
            @RequestParam String tu_ngay,
            @RequestParam String den_ngay,
            @RequestParam(defaultValue = "ngay") String loai) {
        return ResponseEntity.ok(thongKeService.thongKeDoanhThu(tu_ngay, den_ngay, loai));
    }

    @GetMapping("/sach_ban_chay")
    public ResponseEntity<SachBanChayResponse> sachBanChay(
            @RequestParam String tu_ngay,
            @RequestParam String den_ngay) {
        return ResponseEntity.ok(thongKeService.sachBanChay(tu_ngay, den_ngay));
    }

    @GetMapping("/nguoi_dung_moi")
    public ResponseEntity<NguoiDungMoiResponse> thongKeNguoiDungMoi(
            @RequestParam String tu_ngay,
            @RequestParam String den_ngay) {
        return ResponseEntity.ok(thongKeService.thongKeNguoiDungMoi(tu_ngay, den_ngay));
    }

    @GetMapping("/sach_theo_the_loai")
    public ResponseEntity<ThongKeSachTheoTheLoaiResponse> thongKeSachTheoTheLoai() {
        return ResponseEntity.ok(thongKeService.thongKeSachTheoTheLoai());
    }

    @GetMapping("/xuat_csv/doanh_thu")
    public ResponseEntity<byte[]> xuatCsvDoanhThu(
            @RequestParam String tu_ngay,
            @RequestParam String den_ngay,
            @RequestParam(defaultValue = "ngay") String loai) {
        byte[] csv = thongKeService.xuatCsvDoanhThu(tu_ngay, den_ngay, loai);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"doanh_thu.csv\"")
                .contentType(MediaType.parseMediaType("text/csv; charset=UTF-8"))
                .body(csv);
    }

    @GetMapping("/xuat_csv/sach_ban_chay")
    public ResponseEntity<byte[]> xuatCsvSachBanChay(
            @RequestParam String tu_ngay,
            @RequestParam String den_ngay) {
        byte[] csv = thongKeService.xuatCsvSachBanChay(tu_ngay, den_ngay);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"sach_ban_chay.csv\"")
                .contentType(MediaType.parseMediaType("text/csv; charset=UTF-8"))
                .body(csv);
    }

    @GetMapping("/xuat_csv/don_hang")
    public ResponseEntity<byte[]> xuatCsvDonHang(
            @RequestParam String tu_ngay,
            @RequestParam String den_ngay) {
        byte[] csv = thongKeService.xuatCsvDonHang(tu_ngay, den_ngay);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"don_hang.csv\"")
                .contentType(MediaType.parseMediaType("text/csv; charset=UTF-8"))
                .body(csv);
    }

    @GetMapping("/xuat_csv/nguoi_dung_moi")
    public ResponseEntity<byte[]> xuatCsvNguoiDungMoi(
            @RequestParam String tu_ngay,
            @RequestParam String den_ngay) {
        byte[] csv = thongKeService.xuatCsvNguoiDungMoi(tu_ngay, den_ngay);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"nguoi_dung_moi.csv\"")
                .contentType(MediaType.parseMediaType("text/csv; charset=UTF-8"))
                .body(csv);
    }

    @Caching(evict = {
        @CacheEvict(value = "thong_ke_tong_quan", allEntries = true),
        @CacheEvict(value = "thong_ke_doanh_thu", allEntries = true),
        @CacheEvict(value = "sach_ban_chay", allEntries = true),
        @CacheEvict(value = "nguoi_dung_moi", allEntries = true),
        @CacheEvict(value = "thong_ke_sach_the_loai", allEntries = true)
    })
    @PostMapping("/refresh_cache")
    public ResponseEntity<String> refreshCache() {
        return ResponseEntity.ok("Cache đã được làm mới");
    }
}
