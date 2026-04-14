package com.backend.backend.dto;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DangKyRequest {

    @NotBlank(message = "Họ tên không được để trống")
    @Size(min = 2, max = 50, message = "Họ tên phải từ 2-50 ký tự và không chứa số hoặc ký tự đặc biệt")
    @Pattern(
        regexp = "^[\\p{L} ]{2,50}$",
        message = "Họ tên phải từ 2-50 ký tự và không chứa số hoặc ký tự đặc biệt"
    )
    private String ho_ten;

    @NotBlank(message = "Email không được để trống")
    @Email(message = "Email không đúng định dạng")
    @Pattern(
        regexp = "^[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}$",
        message = "Email không đúng định dạng"
    )
    private String email;

    @NotBlank(message = "Số điện thoại không được để trống")
    @Pattern(
        regexp = "^0[0-9]{9}$",
        message = "Số điện thoại phải là 10 số và bắt đầu bằng 0"
    )
    private String so_dien_thoai;

    @NotBlank(message = "Mật khẩu không được để trống")
    @Size(min = 8, max = 64, message = "Mật khẩu phải từ 8-64 ký tự, bao gồm ít nhất 1 chữ cái và 1 số")
    @Pattern(
        regexp = "^(?=.*[a-zA-Z])(?=.*[0-9]).{8,64}$",
        message = "Mật khẩu phải từ 8-64 ký tự, bao gồm ít nhất 1 chữ cái và 1 số"
    )
    private String mat_khau;

    @NotBlank(message = "Xác nhận mật khẩu không được để trống")
    private String xac_nhan_mat_khau;
}
