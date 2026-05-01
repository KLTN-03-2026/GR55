package com.backend.backend.controller;

import com.backend.backend.dto.ChiTietDonHangResponse;
import com.backend.backend.dto.DonHangResponse;
import com.backend.backend.dto.KiemTraTaiThanhToanResponse;
import com.backend.backend.dto.TaoDonHangResponse;
import com.backend.backend.service.LichSuDonHangService;
import com.backend.backend.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

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

    @GetMapping("/{id_dh}/kiem_tra_tai_thanh_toan")
    public ResponseEntity<KiemTraTaiThanhToanResponse> kiemTraTaiThanhToan(
            HttpServletRequest request,
            @PathVariable Long id_dh) {
        Long maNd = layMaNd(request);
        return ResponseEntity.ok(lichSuDonHangService.kiemTraTaiThanhToan(maNd, id_dh));
    }

    @PostMapping("/{id_dh}/tai_thanh_toan")
    public ResponseEntity<TaoDonHangResponse> taiThanhToan(
            HttpServletRequest request,
            @PathVariable Long id_dh) {
        Long maNd = layMaNd(request);
        TaoDonHangResponse ketQua = lichSuDonHangService.taiThanhToan(maNd, id_dh);
        return ketQua.isSuccess()
                ? ResponseEntity.ok(ketQua)
                : ResponseEntity.badRequest().body(ketQua);
    }

    @PutMapping("/{id_dh}/huy")
    public ResponseEntity<Map<String, Object>> huyDonHang(
            HttpServletRequest request,
            @PathVariable Long id_dh) {
        Long maNd = layMaNd(request);
        Map<String, Object> ketQua = lichSuDonHangService.huyDonHang(maNd, id_dh);
        return (Boolean) ketQua.get("success")
                ? ResponseEntity.ok(ketQua)
                : ResponseEntity.badRequest().body(ketQua);
    }

    private Long layMaNd(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return jwtUtil.layMaNdTuToken(authHeader.substring(7));
        }
        throw new RuntimeException("Vui lòng đăng nhập để tiếp tục");
    }
}
