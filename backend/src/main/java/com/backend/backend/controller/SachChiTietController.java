package com.backend.backend.controller;

import com.backend.backend.dto.ChiTietSachResponse;
import com.backend.backend.dto.DanhSachDanhGiaResponse;
import com.backend.backend.dto.SachLienQuanResponse;
import com.backend.backend.service.SachChiTietService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/sach")
@RequiredArgsConstructor
public class SachChiTietController {

    private final SachChiTietService sachChiTietService;

    @GetMapping("/{ma_sach}")
    public ResponseEntity<ChiTietSachResponse> layChiTietSach(
            @PathVariable Long ma_sach,
            @RequestHeader(value = "X-User-Id", required = false) Long ma_nd) {
        sachChiTietService.tangLuotXem(ma_sach);
        return ResponseEntity.ok(sachChiTietService.layChiTietSach(ma_sach, ma_nd));
    }

    @GetMapping("/{ma_sach}/lien_quan")
    public ResponseEntity<SachLienQuanResponse> laySachLienQuan(
            @PathVariable Long ma_sach,
            @RequestParam(defaultValue = "1") int trang,
            @RequestParam(defaultValue = "8") int kich_thuoc) {
        return ResponseEntity.ok(sachChiTietService.laySachLienQuan(ma_sach, trang, kich_thuoc));
    }

    @GetMapping("/{ma_sach}/danh_gia")
    public ResponseEntity<DanhSachDanhGiaResponse> layDanhSachDanhGia(
            @PathVariable Long ma_sach,
            @RequestParam(defaultValue = "1") int trang,
            @RequestParam(defaultValue = "10") int kich_thuoc) {
        return ResponseEntity.ok(sachChiTietService.layDanhSachDanhGia(ma_sach, trang, kich_thuoc));
    }
}
