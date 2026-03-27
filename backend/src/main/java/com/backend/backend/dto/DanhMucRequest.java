package com.backend.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DanhMucRequest {

    @NotBlank(message = "Tên danh mục không được để trống")
    @Size(max = 100, message = "Tên danh mục không được vượt quá 100 ký tự")
    @Pattern(
        regexp = "^[\\p{L}0-9 ,\\-&./()]+$",
        message = "Tên danh mục chỉ được chứa chữ cái, số và các ký tự: , - & . / ( )"
    )
    private String ten_danh_muc;
}
