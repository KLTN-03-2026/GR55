package com.backend.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
public class ChiTietNguoiDungResponse {
    private NguoiDungResponse.NguoiDungData thong_tin;
    private List<DonHangItem> lich_su_don_hang;

    @Data
    @AllArgsConstructor
    public static class DonHangItem {
        private Long id_dh;
        private String ma_don_hang;
        private LocalDateTime ngay_tao;
        private BigDecimal tong_tien;
        private String trang_thai;
    }
}
