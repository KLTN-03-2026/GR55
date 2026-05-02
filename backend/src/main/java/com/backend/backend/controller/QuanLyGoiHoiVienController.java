package com.backend.backend.controller;

import com.backend.backend.dto.DanhSachGoiHoiVienAdminResponse;
import com.backend.backend.dto.GoiHoiVienAdminRequest;
import com.backend.backend.dto.GoiHoiVienAdminResponse;
import com.backend.backend.dto.TimKiemSachGiamGiaResponse;
import com.backend.backend.service.QuanLyGoiHoiVienService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/goi_hoi_vien")
@PreAuthorize("hasRole('QUAN_TRI')")
@RequiredArgsConstructor
public class QuanLyGoiHoiVienController {

    private final QuanLyGoiHoiVienService quanLyGoiHoiVienService;

    @GetMapping
    public ResponseEntity<DanhSachGoiHoiVienAdminResponse> layDanhSachGoi(
            @RequestParam(required = false) String ten,
            @RequestParam(defaultValue = "1") int trang,
            @RequestParam(defaultValue = "10") int kich_thuoc) {
        return ResponseEntity.ok(quanLyGoiHoiVienService.layDanhSachGoi(ten, trang, kich_thuoc));
    }

    @GetMapping("/sach")
    public ResponseEntity<TimKiemSachGiamGiaResponse> timKiemSachDeChon(
            @RequestParam(required = false) String tu_khoa,
            @RequestParam(required = false) Long ma_hv,
            @RequestParam(defaultValue = "1") int trang,
            @RequestParam(defaultValue = "20") int kich_thuoc) {
        return ResponseEntity.ok(quanLyGoiHoiVienService.timKiemSachDeChon(tu_khoa, ma_hv, trang, kich_thuoc));
    }

    @GetMapping("/{ma_hv}")
    public ResponseEntity<GoiHoiVienAdminResponse> layChiTietGoi(@PathVariable Long ma_hv) {
        return ResponseEntity.ok(quanLyGoiHoiVienService.layChiTietGoi(ma_hv));
    }

    @PostMapping
    public ResponseEntity<GoiHoiVienAdminResponse> themGoi(
            @Valid @RequestBody GoiHoiVienAdminRequest request) {
        return ResponseEntity.ok(quanLyGoiHoiVienService.themGoi(request));
    }

    @PutMapping("/{ma_hv}")
    public ResponseEntity<GoiHoiVienAdminResponse> suaGoi(
            @PathVariable Long ma_hv,
            @Valid @RequestBody GoiHoiVienAdminRequest request) {
        return ResponseEntity.ok(quanLyGoiHoiVienService.suaGoi(ma_hv, request));
    }

    @DeleteMapping("/{ma_hv}")
    public ResponseEntity<GoiHoiVienAdminResponse> xoaGoi(@PathVariable Long ma_hv) {
        return ResponseEntity.ok(quanLyGoiHoiVienService.xoaGoi(ma_hv));
    }

    @PutMapping("/{ma_hv}/trang_thai")
    public ResponseEntity<GoiHoiVienAdminResponse> capNhatTrangThai(
            @PathVariable Long ma_hv,
            @RequestParam Boolean hoat_dong) {
        return ResponseEntity.ok(quanLyGoiHoiVienService.capNhatTrangThai(ma_hv, hoat_dong));
    }
}
