package com.backend.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DanhGiaResponse {
    private boolean success;
    private String message;
    private DanhGiaData data;

    @Getter
    @Setter
    @AllArgsConstructor
    public static class DanhGiaData {
        private Long ma_dg;
        private Long ma_nd;
        private String ten_nguoi_dung;
        private int so_sao;
        private String noi_dung;
        private LocalDateTime ngay_tao;
        private boolean la_cua_toi;
    }
}
