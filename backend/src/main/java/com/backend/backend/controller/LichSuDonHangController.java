package com.backend.backend.controller;

import com.backend.backend.dto.ChiTietDonHangResponse;
import com.backend.backend.dto.DonHangResponse;
import com.backend.backend.service.LichSuDonHangService;
import com.backend.backend.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/lich_su_don_hang")
@RequiredArgsConstructor
public class LichSuDonHangController {

    private final LichSuDonHangService lichSuDonHangService;
    private final JwtUtil jwtUtil;

    @GetMapping
    public ResponseEntity<DonHangResponse> layDanhSachDonHang(
            HttpServletRequest request,
            @RequestParam(required = false) String trang_thai,
            @RequestParam(required = false) String tu_ngay,
            @RequestParam(required = false) String den_ngay,
            @RequestParam(defaultValue = "1") int trang,
            @RequestParam(defaultValue = "10") int kich_thuoc) {
        Long maNd = layMaNd(request);
        return ResponseEntity.ok(lichSuDonHangService.layDanhSachDonHang(maNd, trang_thai, tu_ngay, den_ngay, trang, kich_thuoc));
    }

    @GetMapping("/{id_dh}")
    public ResponseEntity<ChiTietDonHangResponse> layChiTietDonHang(
            HttpServletRequest request,
            @PathVariable Long id_dh) {
        Long maNd = layMaNd(request);
        return ResponseEntity.ok(lichSuDonHangService.layChiTietDonHang(maNd, id_dh));
    }

    private Long layMaNd(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return jwtUtil.layMaNdTuToken(authHeader.substring(7));
        }
        throw new RuntimeException("Vui lòng đăng nhập để tiếp tục");
    }
}
