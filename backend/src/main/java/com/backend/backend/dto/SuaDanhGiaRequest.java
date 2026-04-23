package com.backend.backend.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SuaDanhGiaRequest {

    @Min(value = 1, message = "Số sao phải từ 1 đến 5")
    @Max(value = 5, message = "Số sao phải từ 1 đến 5")
    private int so_sao;

    @Size(max = 500, message = "Nội dung không được quá 500 ký tự")
    private String noi_dung;
}
