package com.backend.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DocThuResponse {

    private boolean thanh_cong;
    private String thong_bao;
    private DocThuData du_lieu;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DocThuData {
        private Long ma_sach;
        private String ten_sach;
        private String file_pdf_url;
        private Integer so_trang_doc_thu;
        private Boolean la_sach_hoi_vien;
        private Boolean la_sach_tra_phi;
    }
}
