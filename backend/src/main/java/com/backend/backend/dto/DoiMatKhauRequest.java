package com.backend.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class DoiMatKhauRequest {

    @NotBlank(message = "Mật khẩu cũ không được để trống")
    private String mat_khau_cu;

    @NotBlank(message = "Mật khẩu mới không được để trống")
    @Size(min = 8, max = 64, message = "Mật khẩu phải từ 8 đến 64 ký tự")
    @Pattern(regexp = "^(?=.*[A-Za-z])(?=.*\\d).+$",
             message = "Mật khẩu phải có ít nhất 1 chữ cái và 1 số")
    private String mat_khau_moi;

    @NotBlank(message = "Xác nhận mật khẩu không được để trống")
    private String xac_nhan_mat_khau;
}
