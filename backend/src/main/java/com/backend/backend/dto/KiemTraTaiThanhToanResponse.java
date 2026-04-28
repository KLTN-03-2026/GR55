package com.backend.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class KiemTraTaiThanhToanResponse {
    private boolean success;
    private String message;
    private KiemTraData data;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class KiemTraData {
        private Long id_dh;
        private List<SachItem> sach_da_so_huu;
        private List<SachItem> sach_chua_so_huu;
        private BigDecimal tong_tien_moi;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SachItem {
        private Long ma_sach;
        private String ten_sach;
        private String tac_gia;
        private String anh_bia_url;
        private BigDecimal don_gia;
    }
}
