package com.backend.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GiamGiaInfo {
    private BigDecimal gia_sau_giam;
    private String nhan_giam;
}
