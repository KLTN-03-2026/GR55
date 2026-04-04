package com.backend.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DanhSachSachDangDocResponse {
    private List<SachDangDocData> danh_sach;
    private int trang_hien_tai;
    private int tong_so_trang;
    private long tong_so_ban_ghi;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class SachDangDocData {
        private Long ma_sach;
        private String ten_sach;
        private String tac_gia;
        private String anh_bia_url;
        private Integer trang_hien_tai;
        private Double phan_tram;
    }
}
