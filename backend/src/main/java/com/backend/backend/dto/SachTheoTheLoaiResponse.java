package com.backend.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SachTheoTheLoaiResponse {
    private boolean thanh_cong;
    private String thong_bao;
    private ThongTinTheLoai thong_tin_the_loai;
    private List<SachData> danh_sach;
    private int trang_hien_tai;
    private int tong_so_trang;
    private long tong_so_ban_ghi;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ThongTinTheLoai {
        private Long ma_the_loai;
        private String ten_the_loai;
        private long so_luong_sach;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SachData {
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
