package com.backend.backend.controller;

import com.backend.backend.dto.*;
import com.backend.backend.service.QuanLyGiamGiaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/giam_gia")
@PreAuthorize("hasRole('QUAN_TRI')")
@RequiredArgsConstructor
public class QuanLyGiamGiaController {

    private final QuanLyGiamGiaService quanLyGiamGiaService;

    @GetMapping
    public ResponseEntity<DanhSachChuongTrinhResponse> layDanhSachChuongTrinh(
            @RequestParam(required = false) String ten,
            @RequestParam(required = false) Boolean hoat_dong,
            @RequestParam(required = false) String tu_ngay,
            @RequestParam(required = false) String den_ngay,
            @RequestParam(defaultValue = "1") int trang,
            @RequestParam(defaultValue = "10") int kich_thuoc) {
        return ResponseEntity.ok(quanLyGiamGiaService.layDanhSachChuongTrinh(
                ten, hoat_dong, tu_ngay, den_ngay, trang, kich_thuoc));
    }

    @GetMapping("/{ma_ct}")
    public ResponseEntity<ChiTietChuongTrinhResponse> layChiTietChuongTrinh(@PathVariable Long ma_ct) {
        return ResponseEntity.ok(quanLyGiamGiaService.layChiTietChuongTrinh(ma_ct));
    }

    // Tìm kiếm sách có phí để thêm vào chương trình
    @GetMapping("/sach_tim_kiem")
    public ResponseEntity<TimKiemSachGiamGiaResponse> timKiemSachDeThem(
            @RequestParam(required = false) String tu_khoa,
            @RequestParam(required = false) Long ma_ct,
            @RequestParam(required = false) Long ma_danh_muc,
            @RequestParam(required = false) java.math.BigDecimal gia_tu,
            @RequestParam(required = false) java.math.BigDecimal gia_den,
            @RequestParam(defaultValue = "1") int trang,
            @RequestParam(defaultValue = "12") int kich_thuoc) {
        return ResponseEntity.ok(quanLyGiamGiaService.timKiemSachDeThem(
                tu_khoa, ma_ct, ma_danh_muc, gia_tu, gia_den, trang, kich_thuoc));
    }

    @PostMapping
    public ResponseEntity<ChuongTrinhGiamGiaResponse> themChuongTrinh(
            @Valid @RequestBody ChuongTrinhGiamGiaRequest request) {
        return ResponseEntity.ok(quanLyGiamGiaService.themChuongTrinh(request));
    }

    @PutMapping("/{ma_ct}")
    public ResponseEntity<ChuongTrinhGiamGiaResponse> capNhatChuongTrinh(
            @PathVariable Long ma_ct,
            @Valid @RequestBody ChuongTrinhGiamGiaRequest request) {
        return ResponseEntity.ok(quanLyGiamGiaService.capNhatChuongTrinh(ma_ct, request));
    }

    @PostMapping("/{ma_ct}/sach")
    public ResponseEntity<ChuongTrinhGiamGiaResponse> themSachVaoChuongTrinh(
            @PathVariable Long ma_ct,
            @RequestBody List<Long> sach_ids) {
        return ResponseEntity.ok(quanLyGiamGiaService.themSachVaoChuongTrinh(ma_ct, sach_ids));
    }

    @DeleteMapping("/{ma_ct}/sach/{ma_sach}")
    public ResponseEntity<ChuongTrinhGiamGiaResponse> xoaSachKhoiChuongTrinh(
            @PathVariable Long ma_ct,
            @PathVariable Long ma_sach) {
        return ResponseEntity.ok(quanLyGiamGiaService.xoaSachKhoiChuongTrinh(ma_ct, ma_sach));
    }

    @PutMapping("/{ma_ct}/trang_thai")
    public ResponseEntity<ChuongTrinhGiamGiaResponse> capNhatTrangThai(
            @PathVariable Long ma_ct,
            @RequestParam Boolean hoat_dong) {
        return ResponseEntity.ok(quanLyGiamGiaService.capNhatTrangThai(ma_ct, hoat_dong));
    }

    @DeleteMapping("/{ma_ct}")
    public ResponseEntity<ChuongTrinhGiamGiaResponse> xoaChuongTrinh(@PathVariable Long ma_ct) {
        return ResponseEntity.ok(quanLyGiamGiaService.xoaChuongTrinh(ma_ct));
    }
}
