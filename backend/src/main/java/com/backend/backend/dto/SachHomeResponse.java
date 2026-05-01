package com.backend.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SachHomeResponse {
    private Long ma_sach;
    private String ten_sach;
    private String tac_gia;
    private BigDecimal gia;
    private String anh_bia_url;
    private Double danh_gia_trung_binh;
    private Integer luot_xem;
    private Integer so_luong_da_ban;
    private BigDecimal gia_sau_giam;
    private String nhan_giam;
}
