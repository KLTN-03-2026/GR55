package com.backend.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaoDonHangResponse {
    private boolean success;
    private String message;
    private DonHangData data;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class DonHangData {
        private Long idDh;
        private String maDonHang;
        private String thanhToanUrl;
    }
}
