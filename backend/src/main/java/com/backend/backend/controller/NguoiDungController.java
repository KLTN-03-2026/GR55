package com.backend.backend.controller;

import com.backend.backend.dto.*;
import com.backend.backend.service.NguoiDungService;
import com.backend.backend.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class NguoiDungController {

    private final NguoiDungService nguoiDungService;
    private final JwtUtil jwtUtil;

    @PostMapping("/dang_ky")
    public ResponseEntity<?> dangKy(@Valid @RequestBody DangKyRequest yeuCauDangKy,
                                     BindingResult ketQuaKiemTra) {
        if (ketQuaKiemTra.hasErrors()) {
            Map<String, String> loi = new HashMap<>();
            ketQuaKiemTra.getFieldErrors().forEach(fieldError ->
                    loi.put(fieldError.getField(), fieldError.getDefaultMessage()));
            return ResponseEntity.badRequest().body(
                    new DangKyResponse(false, "Thông tin đăng ký không hợp lệ", loi, null));
        }

        DangKyResponse ketQua = nguoiDungService.dangKy(yeuCauDangKy);
        if (!ketQua.isSuccess()) {
            return ResponseEntity.badRequest().body(ketQua);
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(ketQua);
    }

    @PostMapping("/dang_nhap")
    public ResponseEntity<DangNhapResponse> dangNhap(@Valid @RequestBody DangNhapRequest yeuCauDangNhap,
                                                      BindingResult ketQuaKiemTra) {
        if (ketQuaKiemTra.hasErrors()) {
            String thongBaoLoi = ketQuaKiemTra.getFieldErrors().get(0).getDefaultMessage();
            return ResponseEntity.badRequest().body(
                    DangNhapResponse.builder().success(false).message(thongBaoLoi).build());
        }

        DangNhapResponse ketQua = nguoiDungService.dangNhap(yeuCauDangNhap);
        if (!ketQua.isSuccess()) {
            return ResponseEntity.badRequest().body(ketQua);
        }
        return ResponseEntity.ok(ketQua);
    }

    @PostMapping("/dang_xuat")
    public ResponseEntity<Map<String, Object>> dangXuat(HttpServletRequest yeuCau) {
        String tieuDeAuthorization = yeuCau.getHeader("Authorization");
        if (tieuDeAuthorization != null && tieuDeAuthorization.startsWith("Bearer ")) {
            String token = tieuDeAuthorization.substring(7);
            jwtUtil.themVaoDanhSachDen(token);
        }

        Map<String, Object> phanHoi = new HashMap<>();
        phanHoi.put("success", true);
        phanHoi.put("message", "Đăng xuất thành công");
        return ResponseEntity.ok(phanHoi);
    }

    @PostMapping("/quen_mat_khau/gui_otp")
    public ResponseEntity<QuenMatKhauResponse> guiOtp(@Valid @RequestBody GuiOtpRequest yeuCau,
                                                        BindingResult ketQuaKiemTra) {
        if (ketQuaKiemTra.hasErrors()) {
            String thongBao = ketQuaKiemTra.getFieldErrors().get(0).getDefaultMessage();
            return ResponseEntity.badRequest().body(new QuenMatKhauResponse(false, thongBao));
        }

        QuenMatKhauResponse ketQua = nguoiDungService.guiMaOtp(yeuCau);
        if (!ketQua.isSuccess()) {
            return ResponseEntity.badRequest().body(ketQua);
        }
        return ResponseEntity.ok(ketQua);
    }

    @PostMapping("/quen_mat_khau/xac_thuc_otp")
    public ResponseEntity<QuenMatKhauResponse> xacThucOtp(@Valid @RequestBody XacThucOtpRequest yeuCau,
                                                            BindingResult ketQuaKiemTra) {
        if (ketQuaKiemTra.hasErrors()) {
            String thongBao = ketQuaKiemTra.getFieldErrors().get(0).getDefaultMessage();
            return ResponseEntity.badRequest().body(new QuenMatKhauResponse(false, thongBao));
        }

        QuenMatKhauResponse ketQua = nguoiDungService.xacThucOtpVaDatLaiMatKhau(yeuCau);
        if (!ketQua.isSuccess()) {
            return ResponseEntity.badRequest().body(ketQua);
        }
        return ResponseEntity.ok(ketQua);
    }
}
