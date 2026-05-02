package com.backend.backend.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
public class GoiHoiVienAdminRequest {

    @NotBlank(message = "Tên gói không được để trống")
    @Size(max = 100, message = "Tên gói không quá 100 ký tự")
    private String ten_goi;

    @NotNull(message = "Giá không được để trống")
    @DecimalMin(value = "0", message = "Giá phải lớn hơn hoặc bằng 0")
    private BigDecimal gia;

    @NotNull(message = "Thời hạn không được để trống")
    @Min(value = 1, message = "Thời hạn phải lớn hơn 0")
    private Integer thoi_han_thang;

    private String mo_ta;

    private Boolean hoat_dong = true;

    private List<Long> danh_sach_sach;
}
