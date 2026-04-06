package com.backend.backend.controller;

import com.backend.backend.dto.GioHangResponse;
import com.backend.backend.dto.ThemVaoGioRequest;
import com.backend.backend.service.GioHangService;
import com.backend.backend.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/gio_hang")
@RequiredArgsConstructor
public class GioHangController {

    private final GioHangService gioHangService;
    private final JwtUtil jwtUtil;

    @PostMapping
    public ResponseEntity<GioHangResponse> themVaoGio(
            HttpServletRequest request,
            @Valid @RequestBody ThemVaoGioRequest yeuCau,
            BindingResult ketQuaKiemTra) {
        if (ketQuaKiemTra.hasErrors()) {
            String thongBao = ketQuaKiemTra.getFieldErrors().get(0).getDefaultMessage();
            return ResponseEntity.badRequest()
                    .body(new GioHangResponse(false, thongBao, null));
        }
        Long maNd = layMaNdTuRequest(request);
        return ResponseEntity.ok(gioHangService.themVaoGio(maNd, yeuCau));
    }

    @GetMapping
    public ResponseEntity<GioHangResponse> layGioHang(HttpServletRequest request) {
        Long maNd = layMaNdTuRequest(request);
        return ResponseEntity.ok(gioHangService.layGioHang(maNd));
    }

    @DeleteMapping("/{ma_sach}")
    public ResponseEntity<GioHangResponse> xoaKhoiGio(
            HttpServletRequest request,
            @PathVariable Long ma_sach) {
        Long maNd = layMaNdTuRequest(request);
        return ResponseEntity.ok(gioHangService.xoaKhoiGio(maNd, ma_sach));
    }

    @GetMapping("/so_luong")
    public ResponseEntity<Integer> laySoLuong(HttpServletRequest request) {
        Long maNd = layMaNdTuRequest(request);
        return ResponseEntity.ok(gioHangService.laySoLuong(maNd));
    }

    private Long layMaNdTuRequest(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Không tìm thấy token xác thực");
        }
        return jwtUtil.layMaNdTuToken(authHeader.substring(7));
    }
}
