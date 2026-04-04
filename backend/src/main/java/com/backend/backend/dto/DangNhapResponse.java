package com.backend.backend.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DangNhapResponse {

    private boolean success;
    private String message;
    private String token;
    private ThongTinNguoiDung data;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ThongTinNguoiDung {
        private Long ma_nguoi_dung;
        private String ho_ten;
        private String email;
        private String vai_tro;
    }
}
