package com.backend.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GoiYTimKiemResponse {
    private List<GoiYData> goi_y;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class GoiYData {
        private Long ma_sach;
        private String ten_sach;
        private String tac_gia;
    }
}
