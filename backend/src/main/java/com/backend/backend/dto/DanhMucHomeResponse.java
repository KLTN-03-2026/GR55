package com.backend.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DanhMucHomeResponse {
    private Long ma_dm;
    private String ten_danh_muc;
    private Integer so_luong_sach;
}
