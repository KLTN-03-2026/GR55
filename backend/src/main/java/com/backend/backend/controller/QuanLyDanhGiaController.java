package com.backend.backend.controller;

import com.backend.backend.dto.CapNhatTrangThaiDanhGiaRequest;
import com.backend.backend.dto.DanhGiaResponse;
import com.backend.backend.dto.DanhSachDanhGiaAdminResponse;
import com.backend.backend.service.QuanLyDanhGiaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/danh_gia")
@PreAuthorize("hasRole('QUAN_TRI')")
@RequiredArgsConstructor
public class QuanLyDanhGiaController {

    private final QuanLyDanhGiaService quanLyDanhGiaService;

    @GetMapping
    public ResponseEntity<DanhSachDanhGiaAdminResponse> layDanhSachDanhGia(
            @RequestParam(required = false) String ten_sach,
            @RequestParam(required = false) String ten_nguoi_dung,
            @RequestParam(required = false) Integer so_sao,
            @RequestParam(required = false) String tu_ngay,
            @RequestParam(required = false) String den_ngay,
            @RequestParam(defaultValue = "1") int trang,
            @RequestParam(defaultValue = "10") int kich_thuoc) {
        return ResponseEntity.ok(quanLyDanhGiaService.layDanhSachDanhGia(
                ten_sach, ten_nguoi_dung, so_sao, tu_ngay, den_ngay, trang, kich_thuoc));
    }

    @PutMapping("/{ma_dg}/trang_thai")
    public ResponseEntity<DanhGiaResponse> capNhatTrangThaiDanhGia(
            @PathVariable Long ma_dg,
            @RequestBody CapNhatTrangThaiDanhGiaRequest request) {
        return ResponseEntity.ok(quanLyDanhGiaService.capNhatTrangThaiDanhGia(ma_dg, request));
    }

    @DeleteMapping("/{ma_dg}")
    public ResponseEntity<DanhGiaResponse> xoaDanhGia(@PathVariable Long ma_dg) {
        return ResponseEntity.ok(quanLyDanhGiaService.xoaDanhGia(ma_dg));
    }
}
