package com.backend.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PhanBoSaoResponse {
    private Integer so_sao;
    private Integer so_luong;
    private Double phan_tram;
}
