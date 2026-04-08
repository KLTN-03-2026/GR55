package com.backend.backend.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ThemVaoGioRequest {

    @NotNull(message = "Mã sách không được để trống")
    private Long ma_sach;
}
