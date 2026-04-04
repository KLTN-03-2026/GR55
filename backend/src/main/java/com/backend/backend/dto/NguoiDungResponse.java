package com.backend.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NguoiDungResponse {
    private boolean thanh_cong;
    private String thong_bao;
    private NguoiDungData du_lieu;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class NguoiDungData {
        private Long ma_nguoi_dung;
        private String ho_ten;
        private String email;
        private String so_dien_thoai;
        private String vai_tro;
        private String trang_thai;
        private LocalDateTime ngay_tao;
        private LocalDateTime lan_dang_nhap_cuoi;
    }
}
