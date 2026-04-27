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
public class SachBanChayResponse {
    private List<SachBanChayData> data;

    @Getter
    @Setter
    @AllArgsConstructor
    public static class SachBanChayData {
        private Long ma_sach;
        private String ten_sach;
        private String tac_gia;
        private long so_luong_ban;
        private double doanh_thu;
    }
}
