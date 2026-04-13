package com.backend.backend.dto;

import lombok.Data;

@Data
public class LocTheoTheLoaiRequest {
    private Long ma_the_loai;
    private Double min_gia;
    private Double max_gia;
    private Double min_danh_gia;
    private Boolean sach_mien_phi;
    private String sap_xep; // moi_nhat, ban_chay, gia_tang_dan, gia_giam_dan
    private int trang = 1;
    private int kich_thuoc = 12;
}
