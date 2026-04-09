package com.backend.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DocSachResponse {

    private boolean thanh_cong;
    private String thong_bao;
    private DocSachData du_lieu;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DocSachData {
        private Long ma_sach;
        private String ten_sach;
        private String file_pdf_url;
        private Boolean cho_phep_doc_thu;
        private Integer so_trang_doc_thu;
        private Boolean da_dang_nhap;
    }
}
