package com.backend.backend.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SachResponse {

    private boolean success;
    private String message;
    private DuLieuSach data;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DuLieuSach {
        private Long ma_sach;
        private String ten_sach;
        private String tac_gia;
        private String mo_ta;
        private BigDecimal gia;
        private String anh_bia_url;
        private String file_pdf_url;
        private Boolean cho_phep_doc_thu;
        private Integer so_trang_doc_thu;
        private Integer luot_xem;
        private BigDecimal danh_gia_trung_binh;
        private List<Long> danh_muc_ids;
        private List<String> ten_danh_muc;
        private LocalDateTime ngay_tao;
    }
}
