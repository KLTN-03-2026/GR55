package com.backend.backend.controller;

import com.backend.backend.dto.TaoDonHangRequest;
import com.backend.backend.dto.TaoDonHangResponse;
import com.backend.backend.service.MuaSachService;
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
@RequestMapping("/api/mua_sach")
@RequiredArgsConstructor
public class MuaSachController {

    private final MuaSachService muaSachService;
    private final VnpayService vnpayService;
    private final JwtUtil jwtUtil;

    @Value("${frontend.url:http://localhost:3000}")
    private String frontendUrl;

    @PostMapping("/tao_don")
    public ResponseEntity<TaoDonHangResponse> taoDonHang(
            HttpServletRequest request,
            @Valid @RequestBody TaoDonHangRequest yeuCau,
            BindingResult ketQuaKiemTra) {

        if (ketQuaKiemTra.hasErrors()) {
            String thongBao = ketQuaKiemTra.getFieldErrors().get(0).getDefaultMessage();
            return ResponseEntity.badRequest()
                    .body(new TaoDonHangResponse(false, thongBao, null));
        }

        Long maNd = layMaNdTuRequest(request);
        TaoDonHangResponse ketQua = muaSachService.taoDonHang(maNd, yeuCau);
        return ketQua.isSuccess()
                ? ResponseEntity.ok(ketQua)
                : ResponseEntity.badRequest().body(ketQua);
    }

    @GetMapping("/vnpay_callback")
    public void vnpayCallback(
            @RequestParam Map<String, String> params,
            HttpServletResponse response) throws IOException {

        boolean chuKyHopLe = vnpayService.xacThucChuKy(params);
        String maLoi = params.get("vnp_ResponseCode");
        Long idDh = Long.parseLong(params.get("vnp_TxnRef"));
        boolean soTienHopLe = vnpayService.kiemTraSoTien(idDh, params.get("vnp_Amount"));
        boolean thanhCong = chuKyHopLe && soTienHopLe && "00".equals(maLoi);
        String maGiaoDichNgoai = params.get("vnp_TransactionNo");

        if (thanhCong) {
            muaSachService.xuLyThanhToanThanhCong(idDh, maGiaoDichNgoai);
        } else {
            muaSachService.xuLyThanhToanThatBai(idDh, maGiaoDichNgoai, maLoi);
        }

        response.sendRedirect(frontendUrl + "/thanh_toan/ket_qua?thanh_cong=" + thanhCong + "&id_dh=" + idDh);
    }

    private Long layMaNdTuRequest(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Không tìm thấy token xác thực");
        }
        return jwtUtil.layMaNdTuToken(authHeader.substring(7));
    }
}
