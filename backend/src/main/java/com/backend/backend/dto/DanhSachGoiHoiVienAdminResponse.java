package com.backend.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DanhSachGoiHoiVienAdminResponse {
    private boolean thanh_cong;
    private String thong_bao;
    private List<GoiHoiVienItem> danh_sach;
    private int trang_hien_tai;
    private int tong_so_trang;
    private long tong_so_ban_ghi;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class GoiHoiVienItem {
        private Long ma_hv;
        private String ten_goi;
        private BigDecimal gia;
        private Integer thoi_han_thang;
        private String mo_ta;
        private Boolean hoat_dong;
        private Integer so_luong_sach;
        private Integer so_nguoi_dung;
    }
}
