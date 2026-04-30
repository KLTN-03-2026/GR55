package com.backend.backend.controller;

import com.backend.backend.dto.DangKyGoiHoiVienRequest;
import com.backend.backend.dto.DangKyGoiHoiVienResponse;
import com.backend.backend.dto.GoiHoiVienResponse;
import com.backend.backend.service.NangCapHoiVienService;
import com.backend.backend.service.VnpayService;
import com.backend.backend.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/hoi_vien")
@RequiredArgsConstructor
public class HoiVienController {

    private final NangCapHoiVienService nangCapHoiVienService;
    private final VnpayService vnpayService;
    private final JwtUtil jwtUtil;

    @Value("${frontend.url:http://localhost:3000}")
    private String frontendUrl;

    @GetMapping("/goi")
    public ResponseEntity<GoiHoiVienResponse> layDanhSachGoi() {
        return ResponseEntity.ok(nangCapHoiVienService.layDanhSachGoi());
    }

    @PostMapping("/dang_ky")
    public ResponseEntity<DangKyGoiHoiVienResponse> dangKyGoi(
            HttpServletRequest request,
            @Valid @RequestBody DangKyGoiHoiVienRequest yeuCau,
            BindingResult ketQuaKiemTra) {
        if (ketQuaKiemTra.hasErrors()) {
            String thongBao = ketQuaKiemTra.getFieldErrors().get(0).getDefaultMessage();
            return ResponseEntity.badRequest()
                    .body(new DangKyGoiHoiVienResponse(false, thongBao, null));
        }
        Long maNd = layMaNd(request);
        DangKyGoiHoiVienResponse ketQua = nangCapHoiVienService.dangKyGoi(maNd, yeuCau);
        return ketQua.isSuccess() ? ResponseEntity.ok(ketQua) : ResponseEntity.badRequest().body(ketQua);
    }

    // VNPAY redirect người dùng về đây sau khi thanh toán
    @GetMapping("/vnpay_callback")
    public void vnpayCallback(
            @RequestParam Map<String, String> params,
            HttpServletResponse response) throws IOException {
        boolean thanhCong = false;
        String maLoi = params.get("vnp_ResponseCode");
        String txnRef = params.getOrDefault("vnp_TxnRef", "");

        if (vnpayService.xacThucChuKy(params) && "00".equals(maLoi) && txnRef.startsWith("HV")) {
            try {
                long[] ids = vnpayService.phanTichTxnRefHoiVien(txnRef);
                nangCapHoiVienService.xuLyThanhToanThanhCong(ids[0], ids[1]);
                thanhCong = true;
            } catch (Exception ignored) {}
        }

        response.sendRedirect(frontendUrl + "/hoi_vien/ket_qua?thanh_cong=" + thanhCong);
    }

    private Long layMaNd(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return jwtUtil.layMaNdTuToken(authHeader.substring(7));
        }
        throw new RuntimeException("Vui lòng đăng nhập để tiếp tục");
    }
}
