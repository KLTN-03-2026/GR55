package com.backend.backend.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DangKyResponse {

    private boolean success;
    private String message;
    private DuLieuNguoiDung data;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DuLieuNguoiDung {
        private Long ma_nd;
        private String ho_ten;
        private String email;
        private String so_dien_thoai;
    }
}
