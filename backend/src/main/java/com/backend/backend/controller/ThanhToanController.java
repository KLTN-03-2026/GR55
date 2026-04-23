package com.backend.backend.controller;

import com.backend.backend.dto.CallbackResponse;
import com.backend.backend.service.MuaSachService;
import com.backend.backend.service.VnpayService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/thanh_toan")
@RequiredArgsConstructor
public class ThanhToanController {

    private final VnpayService vnpayService;
    private final MuaSachService muaSachService;

    // IPN endpoint — VNPAY server gọi trực tiếp để xác nhận giao dịch
    @GetMapping("/vnpay_ipn")
    public CallbackResponse vnpayIpn(@RequestParam Map<String, String> params) {
        if (!vnpayService.xacThucChuKy(params)) {
            return new CallbackResponse("97", "Chữ ký không hợp lệ");
        }

        Long idDh;
        try {
            idDh = Long.parseLong(params.get("vnp_TxnRef"));
        } catch (NumberFormatException e) {
            return new CallbackResponse("98", "Mã đơn hàng không hợp lệ");
        }

        // Kiểm tra số tiền khớp đơn hàng
        if (!vnpayService.kiemTraSoTien(idDh, params.get("vnp_Amount"))) {
            return new CallbackResponse("04", "Số tiền không khớp");
        }

        String maLoi = params.get("vnp_ResponseCode");
        String maGiaoDichNgoai = params.get("vnp_TransactionNo");

        try {
            if ("00".equals(maLoi)) {
                muaSachService.xuLyThanhToanThanhCong(idDh, maGiaoDichNgoai);
                return new CallbackResponse("00", "Giao dịch thành công");
            } else {
                muaSachService.xuLyThanhToanThatBai(idDh, maGiaoDichNgoai, maLoi);
                return new CallbackResponse(maLoi, "Giao dịch thất bại");
            }
        } catch (RuntimeException e) {
            return new CallbackResponse("01", "Đơn hàng không tồn tại");
        }
    }
}
