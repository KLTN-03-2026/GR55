package com.backend.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DangKyGoiHoiVienResponse {
    private boolean success;
    private String message;
    private DangKyData data;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DangKyData {
        private String thanh_toan_url;
    }
}
