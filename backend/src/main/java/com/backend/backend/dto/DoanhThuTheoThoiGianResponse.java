package com.backend.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DoanhThuTheoThoiGianResponse {
    private List<DoanhThuData> data;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DoanhThuData {
        private String thoi_gian;
        private double doanh_thu;
        private long so_luong_don;
    }
}
