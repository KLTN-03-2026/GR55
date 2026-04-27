package com.backend.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ThongKeTongQuanResponse {
    private long tong_nguoi_dung;
    private long tong_sach;
    private long tong_don_hang;
    private double tong_doanh_thu;
    private long tong_hoi_vien;
}
