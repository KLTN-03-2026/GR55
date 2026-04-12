package com.backend.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ThongTinNguoiDungResponse {

    private boolean thanh_cong;
    private String thong_bao;
    private ThongTinData du_lieu;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ThongTinData {
        private Long ma_nd;
        private String ho_ten;
        private String email;
        private String so_dien_thoai;
        private String vai_tro;
    }
}
