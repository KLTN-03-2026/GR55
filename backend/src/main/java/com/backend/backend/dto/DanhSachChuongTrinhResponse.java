package com.backend.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DanhSachChuongTrinhResponse {
    private boolean success;
    private String message;
    private List<ChuongTrinhItem> danh_sach;
    private int trang_hien_tai;
    private int tong_so_trang;
    private long tong_so_ban_ghi;

    @Getter
    @Setter
    @AllArgsConstructor
    public static class ChuongTrinhItem {
        private Long ma_ct;
        private String ten_chuong_trinh;
        private LocalDateTime ngay_bat_dau;
        private LocalDateTime ngay_ket_thuc;
        private String loai_giam;
        private BigDecimal gia_tri_giam;
        private Boolean hoat_dong;
        private Integer so_luong_sach;
    }
}
