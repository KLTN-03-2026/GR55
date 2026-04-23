package com.backend.backend.controller;

import com.backend.backend.dto.DanhGiaResponse;
import com.backend.backend.dto.DanhSachDanhGiaResponse;
import com.backend.backend.dto.SuaDanhGiaRequest;
import com.backend.backend.dto.ThemDanhGiaRequest;
import com.backend.backend.service.DanhGiaSachService;
import com.backend.backend.service.DanhGiaService;
import com.backend.backend.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/sach/{ma_sach}/danh_gia")
@RequiredArgsConstructor
public class DanhGiaController {

    private final DanhGiaService danhGiaService;
    private final DanhGiaSachService danhGiaSachService;
    private final JwtUtil jwtUtil;

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

    @PostMapping
    public ResponseEntity<DanhGiaResponse> themDanhGia(
            HttpServletRequest request,
            @PathVariable Long ma_sach,
            @Valid @RequestBody ThemDanhGiaRequest body) {
        Long maNd = layMaNd(request);
        return ResponseEntity.ok(danhGiaSachService.themDanhGia(maNd, ma_sach, body));
    }

    @PutMapping
    public ResponseEntity<DanhGiaResponse> suaDanhGia(
            HttpServletRequest request,
            @PathVariable Long ma_sach,
            @Valid @RequestBody SuaDanhGiaRequest body) {
        Long maNd = layMaNd(request);
        return ResponseEntity.ok(danhGiaSachService.suaDanhGia(maNd, ma_sach, body));
    }

    @DeleteMapping
    public ResponseEntity<DanhGiaResponse> xoaDanhGia(
            HttpServletRequest request,
            @PathVariable Long ma_sach) {
        Long maNd = layMaNd(request);
        return ResponseEntity.ok(danhGiaSachService.xoaDanhGia(maNd, ma_sach));
    }

    private Long layMaNd(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return jwtUtil.layMaNdTuToken(authHeader.substring(7));
        }
        throw new RuntimeException("Vui lòng đăng nhập để tiếp tục");
    }
}
