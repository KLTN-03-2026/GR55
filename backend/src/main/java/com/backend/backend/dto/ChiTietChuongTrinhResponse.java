package com.backend.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data @NoArgsConstructor @AllArgsConstructor
public class ChiTietChuongTrinhResponse {
    private boolean success;
    private String message;
    private ChiTietData data;

    @Data @NoArgsConstructor @AllArgsConstructor
    public static class ChiTietData {
        private Long ma_ct;
        private String ten_chuong_trinh;
        private LocalDateTime ngay_bat_dau;
        private LocalDateTime ngay_ket_thuc;
        private String loai_giam;
        private BigDecimal gia_tri_giam;
        private Boolean hoat_dong;
        private int tong_so_sach;
        private List<SachTrongCt> danh_sach_sach;
    }

    @Data @NoArgsConstructor @AllArgsConstructor
    public static class SachTrongCt {
        private Long ma_sach;
        private String ten_sach;
        private String tac_gia;
        private String anh_bia_url;
        private BigDecimal gia_goc;
        private BigDecimal gia_sau_giam;
    }
}
