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
public class SachThuVienResponse {

    private boolean thanh_cong;
    private String thong_bao;
    private List<SachThuVienData> du_lieu;
    private int trang_hien_tai;
    private int tong_so_trang;
    private long tong_so_ban_ghi;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SachThuVienData {
        private Long ma_sach;
        private String ten_sach;
        private String tac_gia;
        private String anh_bia_url;
        private BigDecimal gia;
        private LocalDateTime ngay_mua;      // sach_da_mua
        private Integer trang_hien_tai;      // sach_dang_doc
        private Double phan_tram;            // sach_dang_doc
    }
}
