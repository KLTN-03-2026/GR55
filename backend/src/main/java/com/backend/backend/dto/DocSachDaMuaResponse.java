package com.backend.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DocSachDaMuaResponse {
    private boolean thanh_cong;
    private String thong_bao;
    private DocSachDaMuaData du_lieu;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DocSachDaMuaData {
        private Long ma_sach;
        private String ten_sach;
        private String file_pdf_url;
        private Boolean da_mua;
        private Boolean la_hoi_vien;
        private Boolean sach_thuoc_goi_hoi_vien;
    }
}
