package com.backend.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DanhMucHomeResponse {
    private Long ma_dm;
    private String ten_danh_muc;
    private Integer so_luong_sach;
}
