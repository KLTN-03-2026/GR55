package com.backend.backend.controller;

import com.backend.backend.dto.CapNhatThongTinRequest;
import com.backend.backend.dto.DoiMatKhauRequest;
import com.backend.backend.dto.ThongTinNguoiDungResponse;
import com.backend.backend.service.TaiKhoanCaNhanService;
import com.backend.backend.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/nguoi_dung")
@RequiredArgsConstructor
public class TaiKhoanCaNhanController {

    private final TaiKhoanCaNhanService taiKhoanCaNhanService;
    private final JwtUtil jwtUtil;

    @GetMapping("/thong_tin")
    public ResponseEntity<ThongTinNguoiDungResponse> layThongTin(HttpServletRequest request) {
        Long maNd = layMaNdTuRequest(request);
        return ResponseEntity.ok(taiKhoanCaNhanService.layThongTin(maNd));
    }

    @PutMapping("/thong_tin")
    public ResponseEntity<ThongTinNguoiDungResponse> capNhatThongTin(
            HttpServletRequest request,
            @Valid @RequestBody CapNhatThongTinRequest yeuCau,
            BindingResult ketQuaKiemTra) {
        if (ketQuaKiemTra.hasErrors()) {
            String thongBao = ketQuaKiemTra.getFieldErrors().get(0).getDefaultMessage();
            return ResponseEntity.badRequest()
                    .body(new ThongTinNguoiDungResponse(false, thongBao, null));
        }
        Long maNd = layMaNdTuRequest(request);
        return ResponseEntity.ok(taiKhoanCaNhanService.capNhatThongTin(maNd, yeuCau));
    }

    @PutMapping("/doi_mat_khau")
    public ResponseEntity<ThongTinNguoiDungResponse> doiMatKhau(
            HttpServletRequest request,
            @Valid @RequestBody DoiMatKhauRequest yeuCau,
            BindingResult ketQuaKiemTra) {
        if (ketQuaKiemTra.hasErrors()) {
            String thongBao = ketQuaKiemTra.getFieldErrors().get(0).getDefaultMessage();
            return ResponseEntity.badRequest()
                    .body(new ThongTinNguoiDungResponse(false, thongBao, null));
        }
        Long maNd = layMaNdTuRequest(request);
        return ResponseEntity.ok(taiKhoanCaNhanService.doiMatKhau(maNd, yeuCau));
    }

    private Long layMaNdTuRequest(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Không tìm thấy token xác thực");
        }
        return jwtUtil.layMaNdTuToken(authHeader.substring(7));
    }
}
