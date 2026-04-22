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
public class ChiTietDonHangResponse {
    private boolean success;
    private String message;
    private ChiTietData data;

    @Getter
    @Setter
    @AllArgsConstructor
    public static class ChiTietData {
        private Long id_dh;
        private String ma_don_hang;
        private LocalDateTime ngay_tao;
        private BigDecimal tong_tien;
        private String trang_thai;
        private String phuong_thuc_thanh_toan;
        private ThongTinKhachHang khach_hang;
        private List<SachTrongDon> danh_sach_sach;
    }

    @Getter
    @Setter
    @AllArgsConstructor
    public static class ThongTinKhachHang {
        private String ho_ten;
        private String email;
        private String so_dien_thoai;
    }

    @Getter
    @Setter
    @AllArgsConstructor
    public static class SachTrongDon {
        private Long ma_sach;
        private String ten_sach;
        private String tac_gia;
        private String anh_bia_url;
        private BigDecimal don_gia;
    }
}
