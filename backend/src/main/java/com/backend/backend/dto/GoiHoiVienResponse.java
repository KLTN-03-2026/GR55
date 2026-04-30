package com.backend.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GoiHoiVienResponse {
    private boolean success;
    private String message;
    private List<GoiHoiVienData> data;

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
    }
}
