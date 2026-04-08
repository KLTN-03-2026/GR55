package com.backend.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GioHangResponse {
    private boolean thanh_cong;
    private String thong_bao;
    private GioHangData du_lieu;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class GioHangData {
        private List<GioHangItem> danh_sach;
        private BigDecimal tong_tien;
        private Integer so_luong;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class GioHangItem {
        private Long ma_sach;
        private String ten_sach;
        private String tac_gia;
        private String anh_bia_url;
        private BigDecimal don_gia;
    }
}
