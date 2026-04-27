package com.backend.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ThongKeSachTheoTheLoaiResponse {
    private List<TheLoaiData> data;

    @Getter
    @Setter
    @AllArgsConstructor
    public static class TheLoaiData {
        private String ten_the_loai;
        private long so_luong;
        private double ty_le;
    }
}
