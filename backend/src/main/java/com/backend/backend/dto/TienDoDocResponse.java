package com.backend.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TienDoDocResponse {
    private boolean thanh_cong;
    private String thong_bao;
    private TienDoData du_lieu;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class TienDoData {
        private Long ma_sach;
        private String ten_sach;
        private String anh_bia_url;
        private Integer trang_hien_tai;
        private Double phan_tram;
    }
}
