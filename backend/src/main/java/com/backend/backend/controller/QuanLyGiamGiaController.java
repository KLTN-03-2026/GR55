package com.backend.backend.controller;

import com.backend.backend.dto.ChuongTrinhGiamGiaRequest;
import com.backend.backend.dto.ChuongTrinhGiamGiaResponse;
import com.backend.backend.dto.DanhSachChuongTrinhResponse;
import com.backend.backend.dto.SachResponse;
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

    @GetMapping("/sach")
    public ResponseEntity<List<SachResponse.DuLieuSach>> laySachTheoTieuChi(
            @RequestParam String loai,
            @RequestParam(required = false) List<Long> danh_muc_ids,
            @RequestParam(required = false) Integer so_luong) {
        return ResponseEntity.ok(quanLyGiamGiaService.laySachTheoTieuChi(loai, danh_muc_ids, so_luong));
    }

    @PostMapping
    public ResponseEntity<ChuongTrinhGiamGiaResponse> themChuongTrinh(
            @Valid @RequestBody ChuongTrinhGiamGiaRequest request) {
        return ResponseEntity.ok(quanLyGiamGiaService.themChuongTrinh(request));
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
