package com.backend.backend.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class DangKyGoiHoiVienRequest {

    @NotNull(message = "Vui lòng chọn gói hội viên")
    private Long ma_goi;
}
