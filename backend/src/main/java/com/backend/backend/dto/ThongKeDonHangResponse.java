package com.backend.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ThongKeDonHangResponse {
    private long tong_don;
    private long da_thanh_toan;
    private long cho_thanh_toan;
    private long that_bai;
    private double doanh_thu;
    private double ty_le_thanh_cong;
    private List<DonHangItem> danh_sach;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class DonHangItem {
        private String ma_don_hang;
        private String ho_ten;
        private String email;
        private String ngay_tao;
        private double tong_tien;
        private String trang_thai;
    }
}
