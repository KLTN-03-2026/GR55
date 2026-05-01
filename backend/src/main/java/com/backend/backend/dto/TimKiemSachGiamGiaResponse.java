package com.backend.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data @NoArgsConstructor @AllArgsConstructor
public class TimKiemSachGiamGiaResponse {
    private boolean success;
    private String message;
    private List<SachItem> danh_sach;
    private int trang_hien_tai;
    private int tong_so_trang;
    private long tong_so_ban_ghi;

    @Data @NoArgsConstructor @AllArgsConstructor
    public static class SachItem {
        private Long ma_sach;
        private String ten_sach;
        private String tac_gia;
        private String anh_bia_url;
        private BigDecimal gia;
        private boolean trong_chuong_trinh;
    }
}
