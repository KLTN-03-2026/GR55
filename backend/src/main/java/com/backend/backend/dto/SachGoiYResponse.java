package com.backend.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SachGoiYResponse {

    private boolean thanh_cong;
    private String thong_bao;
    private List<SachGoiYData> danh_sach;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class SachGoiYData {
        private Long ma_sach;
        private String ten_sach;
        private String tac_gia;
        private String anh_bia_url;
        private BigDecimal gia;
        private Double danh_gia_trung_binh;
        private BigDecimal gia_sau_giam;
        private String nhan_giam;
    }
}
