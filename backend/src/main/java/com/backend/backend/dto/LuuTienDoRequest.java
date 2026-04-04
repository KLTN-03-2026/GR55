package com.backend.backend.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class LuuTienDoRequest {

    @NotNull(message = "Mã sách không được để trống")
    private Long ma_sach;

    @Min(value = 1, message = "Trang hiện tại phải lớn hơn hoặc bằng 1")
    private Integer trang_hien_tai = 1;

    @Min(value = 0, message = "Phần trăm phải từ 0 đến 100")
    @Max(value = 100, message = "Phần trăm phải từ 0 đến 100")
    private Double phan_tram = 0.0;
}
