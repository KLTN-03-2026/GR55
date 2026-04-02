package com.backend.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DanhSachDanhGiaResponse {
    private Double diem_trung_binh;
    private Integer tong_so_danh_gia;
    private List<PhanBoSaoResponse> phan_bo_sao;
    private List<DanhGiaData> danh_sach;
    private int trang_hien_tai;
    private int tong_so_trang;
    private long tong_so_ban_ghi;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class DanhGiaData {
        private Long ma_dg;
        private Long ma_nd;
        private String ten_nguoi_dung;
        private Integer so_sao;
        private String noi_dung;
        private LocalDateTime ngay_tao;
        private Boolean la_cua_toi;
    }
}
