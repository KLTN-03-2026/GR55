package com.backend.backend.controller;

import com.backend.backend.dto.CapNhatTrangThaiDonHangRequest;
import com.backend.backend.dto.ChiTietDonHangAdminResponse;
import com.backend.backend.dto.DanhGiaResponse;
import com.backend.backend.dto.DanhSachDonHangAdminResponse;
import com.backend.backend.service.QuanLyDonHangService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/don_hang")
@PreAuthorize("hasRole('QUAN_TRI')")
@RequiredArgsConstructor
public class QuanLyDonHangController {

    private final QuanLyDonHangService quanLyDonHangService;

    @GetMapping
    public ResponseEntity<DanhSachDonHangAdminResponse> layDanhSachDonHang(
            @RequestParam(required = false) String trang_thai,
            @RequestParam(required = false) String ten_khach_hang,
            @RequestParam(required = false) String tu_ngay,
            @RequestParam(required = false) String den_ngay,
            @RequestParam(defaultValue = "1") int trang,
            @RequestParam(defaultValue = "10") int kich_thuoc) {
        return ResponseEntity.ok(quanLyDonHangService.layDanhSachDonHang(
                trang_thai, ten_khach_hang, tu_ngay, den_ngay, trang, kich_thuoc));
    }

    @GetMapping("/{id_dh}")
    public ResponseEntity<ChiTietDonHangAdminResponse> layChiTietDonHang(@PathVariable Long id_dh) {
        return ResponseEntity.ok(quanLyDonHangService.layChiTietDonHang(id_dh));
    }

    @PutMapping("/{id_dh}/trang_thai")
    public ResponseEntity<DanhGiaResponse> capNhatTrangThaiDonHang(
            @PathVariable Long id_dh,
            @RequestBody CapNhatTrangThaiDonHangRequest request) {
        return ResponseEntity.ok(quanLyDonHangService.capNhatTrangThaiDonHang(id_dh, request));
    }
}
