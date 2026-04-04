package com.backend.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SachLienQuanResponse {
    private List<SachLienQuanData> danh_sach;
    private int trang_hien_tai;
    private int tong_so_trang;
    private long tong_so_ban_ghi;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class SachLienQuanData {
        private Long ma_sach;
        private String ten_sach;
        private String tac_gia;
        private BigDecimal gia;
        private String anh_bia_url;
        private Double danh_gia_trung_binh;
        private Integer luot_xem;
        private Integer so_luong_da_ban;
    }
}
