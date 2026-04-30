package com.backend.backend.controller;

import com.backend.backend.dto.CallbackResponse;
import com.backend.backend.service.MuaSachService;
import com.backend.backend.service.NangCapHoiVienService;
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
    private final NangCapHoiVienService nangCapHoiVienService;

    // IPN endpoint — VNPAY server gọi trực tiếp để xác nhận giao dịch
    @GetMapping("/vnpay_ipn")
    public CallbackResponse vnpayIpn(@RequestParam Map<String, String> params) {
        if (!vnpayService.xacThucChuKy(params)) {
            return new CallbackResponse("97", "Chữ ký không hợp lệ");
        }

        String txnRef = params.getOrDefault("vnp_TxnRef", "");
        String maLoi = params.get("vnp_ResponseCode");

        // Giao dịch hội viên — TxnRef bắt đầu bằng "HV"
        if (txnRef.startsWith("HV")) {
            try {
                long[] ids = vnpayService.phanTichTxnRefHoiVien(txnRef);
                long maNd = ids[0], maHv = ids[1];
                if (!vnpayService.kiemTraSoTienHoiVien(maHv, params.get("vnp_Amount"))) {
                    return new CallbackResponse("04", "Số tiền không khớp");
                }
                if ("00".equals(maLoi)) {
                    nangCapHoiVienService.xuLyThanhToanThanhCong(maNd, maHv);
                    return new CallbackResponse("00", "Giao dịch thành công");
                }
                return new CallbackResponse(maLoi, "Giao dịch thất bại");
            } catch (Exception e) {
                return new CallbackResponse("99", "Lỗi xử lý giao dịch hội viên");
            }
        }

        // Giao dịch mua sách thông thường
        Long idDh;
        try {
            idDh = Long.parseLong(txnRef);
        } catch (NumberFormatException e) {
            return new CallbackResponse("98", "Mã đơn hàng không hợp lệ");
        }

        if (!vnpayService.kiemTraSoTien(idDh, params.get("vnp_Amount"))) {
            return new CallbackResponse("04", "Số tiền không khớp");
        }

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
