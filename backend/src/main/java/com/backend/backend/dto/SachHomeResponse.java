package com.backend.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class SachHomeResponse {
    private Long ma_sach;
    private String ten_sach;
    private String tac_gia;
    private BigDecimal gia;
    private String anh_bia_url;
    private Double danh_gia_trung_binh;
    private Integer luot_xem;
}
