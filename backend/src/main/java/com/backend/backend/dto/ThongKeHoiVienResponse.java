package com.backend.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ThongKeHoiVienResponse {
    private long hoi_vien_hoat_dong;
    private long tong_nguoi_dung;
    private double ty_le_hoi_vien;
    private double tong_doanh_thu;
    private List<GoiThongKe> theo_goi;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class GoiThongKe {
        private String ten_goi;
        private double gia;
        private int thoi_han_thang;
        private long dang_hoat_dong;
        private long tong_lan_dang_ky;
        private double doanh_thu;
    }
}
