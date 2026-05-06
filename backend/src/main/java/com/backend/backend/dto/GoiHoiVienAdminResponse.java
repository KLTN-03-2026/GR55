package com.backend.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GoiHoiVienAdminResponse {
    private boolean thanh_cong;
    private String thong_bao;
    private GoiHoiVienData du_lieu;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class GoiHoiVienData {
        private Long ma_hv;
        private String ten_goi;
        private BigDecimal gia;
        private Integer thoi_han_thang;
        private String mo_ta;
        private Boolean hoat_dong;
        private Integer so_luong_sach;
        private List<SachItem> danh_sach_sach;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SachItem {
        private Long ma_sach;
        private String ten_sach;
        private String tac_gia;
        private String anh_bia_url;
        private BigDecimal gia;
    }
}
