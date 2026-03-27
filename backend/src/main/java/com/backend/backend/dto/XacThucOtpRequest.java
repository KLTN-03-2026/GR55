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
public class XacThucOtpRequest {

    @NotBlank(message = "Email không được để trống")
    private String email;

    @NotBlank(message = "Vui lòng nhập mã OTP 6 số")
    @Pattern(regexp = "^[0-9]{6}$", message = "Vui lòng nhập mã OTP 6 số")
    private String otp;

    @NotBlank(message = "Mật khẩu mới không được để trống")
    @Size(min = 8, max = 64, message = "Mật khẩu phải từ 8-64 ký tự, có ít nhất 1 chữ và 1 số")
    @Pattern(
        regexp = "^(?=.*[a-zA-Z])(?=.*[0-9]).{8,64}$",
        message = "Mật khẩu phải từ 8-64 ký tự, có ít nhất 1 chữ và 1 số"
    )
    private String mat_khau_moi;

    @NotBlank(message = "Xác nhận mật khẩu không được để trống")
    private String xac_nhan_mat_khau_moi;
}
