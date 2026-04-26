package com.backend.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DanhSachDanhGiaAdminResponse {
    private boolean success;
    private String message;
    private List<DanhGiaAdminData> danh_sach;
    private int trang_hien_tai;
    private int tong_so_trang;
    private long tong_so_ban_ghi;

    @Getter
    @Setter
    @AllArgsConstructor
    public static class DanhGiaAdminData {
        private Long ma_dg;
        private String ten_nguoi_dung;
        private String ten_sach;
        private int so_sao;
        private String noi_dung;
        private LocalDateTime ngay_tao;
        private Boolean hien_thi;
    }
}
