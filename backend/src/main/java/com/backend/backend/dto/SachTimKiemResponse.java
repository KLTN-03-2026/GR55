package com.backend.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SachTimKiemResponse {
    private boolean thanh_cong;
    private String thong_bao;
    private List<SachTimKiemData> danh_sach;
    private int trang_hien_tai;
    private int tong_so_trang;
    private long tong_so_ban_ghi;
    private String tu_khoa;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SachTimKiemData {
        private Long ma_sach;
        private String ten_sach;
        private String tac_gia;
        private String anh_bia_url;
        private BigDecimal gia;
        private Double danh_gia_trung_binh;
        private List<String> danh_sach_danh_muc;
    }
}
