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
public class DanhSachDonHangAdminResponse {
    private boolean success;
    private String message;
    private List<DonHangAdminData> danh_sach;
    private int trang_hien_tai;
    private int tong_so_trang;
    private long tong_so_ban_ghi;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DonHangAdminData {
        private Long id_dh;
        private String ma_don_hang;
        private String ten_khach_hang;
        private String email;
        private LocalDateTime ngay_mua;
        private BigDecimal tong_tien;
        private String trang_thai;
        private String phuong_thuc_thanh_toan;
    }
}
