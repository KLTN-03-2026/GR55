package com.backend.backend.controller;

import com.backend.backend.dto.DanhSachDanhGiaResponse;
import com.backend.backend.service.DanhGiaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/sach/{ma_sach}/danh_gia")
@RequiredArgsConstructor
public class DanhGiaController {

    private final DanhGiaService danhGiaService;

    @GetMapping
    public ResponseEntity<DanhSachDanhGiaResponse> layDanhSachDanhGia(
            @PathVariable Long ma_sach,
            @RequestParam(defaultValue = "moi_nhat") String sort,
            @RequestParam(defaultValue = "1") int trang,
            @RequestParam(defaultValue = "10") int kich_thuoc,
            @RequestHeader(value = "X-User-Id", required = false) Long ma_nd) {
        return ResponseEntity.ok(
                danhGiaService.layDanhSachDanhGia(ma_sach, sort, trang, kich_thuoc, ma_nd));
    }
}
