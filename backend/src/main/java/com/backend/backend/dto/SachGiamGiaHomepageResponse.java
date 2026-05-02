package com.backend.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SachGiamGiaHomepageResponse {
    private boolean thanh_cong;
    private List<ChuongTrinhItem> cac_chuong_trinh;
    private List<SachGiamGiaItem> danh_sach_sach;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ChuongTrinhItem {
        private Long ma_ct;
        private String ten_chuong_trinh;
        private String loai_giam;
        private BigDecimal gia_tri_giam;
        private LocalDateTime ngay_ket_thuc;
        private int so_sach;
        private List<SachGiamGiaItem> danh_sach_sach;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SachGiamGiaItem {
        private Long ma_sach;
        private String ten_sach;
        private String tac_gia;
        private String anh_bia_url;
        private BigDecimal gia_goc;
        private BigDecimal gia_sau_giam;
        private String nhan_giam;
        private Double danh_gia_trung_binh;
        private Integer so_luong_da_ban;
    }
}
