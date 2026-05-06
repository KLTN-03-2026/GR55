package com.backend.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatResponse {
    private boolean thanhCong;
    private String phanHoi;
    private List<SachData> sachGoiY;
    private String tuKhoaTimKiem;

    public ChatResponse(boolean thanhCong, String phanHoi) {
        this.thanhCong = thanhCong;
        this.phanHoi = phanHoi;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class SachData {
        private Long ma_sach;
        private String ten_sach;
        private String tac_gia;
        private String anh_bia_url;
        private BigDecimal gia;
        private Double danh_gia_trung_binh;
    }
}
