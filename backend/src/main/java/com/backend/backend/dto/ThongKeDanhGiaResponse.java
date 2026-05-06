package com.backend.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ThongKeDanhGiaResponse {
    private long tong_danh_gia;
    private double diem_trung_binh;
    private double ty_le_nguoi_mua_danh_gia;
    private List<PhanBoSao> phan_bo_sao;
    private List<SachDanhGia> sach_cao_nhat;
    private List<SachDanhGia> sach_thap_nhat;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class PhanBoSao {
        private int so_sao;
        private long so_luong;
        private double ty_le;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class SachDanhGia {
        private long ma_sach;
        private String ten_sach;
        private String tac_gia;
        private double diem_trung_binh;
        private long so_danh_gia;
    }
}
