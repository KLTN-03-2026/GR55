package com.backend.backend.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DanhMucResponse {

    private boolean success;
    private String message;
    private DuLieuDanhMuc data;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DuLieuDanhMuc {
        private Long ma_dm;
        private String ten_danh_muc;
        private LocalDateTime ngay_tao;
        private Integer so_luong_sach;
    }
}
