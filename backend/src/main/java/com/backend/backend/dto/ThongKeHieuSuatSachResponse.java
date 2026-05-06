package com.backend.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ThongKeHieuSuatSachResponse {
    private List<HieuSuatSach> top_xem;
    private List<HieuSuatSach> it_chuyen_doi;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class HieuSuatSach {
        private long ma_sach;
        private String ten_sach;
        private String tac_gia;
        private double gia;
        private int luot_xem;
        private int so_luong_da_ban;
        private double doanh_thu;
        private double ty_le_chuyen_doi;
    }
}
