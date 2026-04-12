package com.backend.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChiTietSachResponse {
    private boolean thanh_cong;
    private String thong_bao;
    private SachChiTietData du_lieu;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class SachChiTietData {
        private Long ma_sach;
        private String ten_sach;
        private String tac_gia;
        private String mo_ta;
        private BigDecimal gia;
        private BigDecimal gia_giam;
        private Double danh_gia_trung_binh;
        private Integer so_luot_danh_gia;
        private String anh_bia_url;
        private String file_pdf_url;
        private Boolean cho_phep_doc_thu;
        private Integer so_trang_doc_thu;
        private Integer luot_xem;
        private Integer so_luong_da_ban;
        private List<DanhMucData> danh_sach_danh_muc;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class DanhMucData {
        private Long ma_dm;
        private String ten_danh_muc;
    }
        private Boolean da_mua;
        private Boolean da_yeu_thich;
        private Boolean la_hoi_vien;
        private Boolean sach_thuoc_goi_hoi_vien;
        private Boolean da_bat_dau_doc;
        private LocalDateTime ngay_tao;
    }
}
