package com.backend.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class YeuThichResponse {

    private boolean thanh_cong;
    private String thong_bao;
    private List<SachYeuThichData> du_lieu;
    private int trang_hien_tai;
    private int tong_so_trang;
    private long tong_so_ban_ghi;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SachYeuThichData {
        private Long ma_sach;
        private String ten_sach;
        private String tac_gia;
        private String anh_bia_url;
        private BigDecimal gia;
    }
}
