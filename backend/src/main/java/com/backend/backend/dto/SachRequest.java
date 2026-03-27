package com.backend.backend.dto;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SachRequest {

    @NotBlank(message = "Tên sách không được để trống")
    @Size(max = 255, message = "Tên sách không được quá 255 ký tự")
    private String ten_sach;

    @NotBlank(message = "Tác giả không được để trống")
    @Size(max = 100, message = "Tên tác giả không được quá 100 ký tự")
    private String tac_gia;

    private String mo_ta;

    @NotNull(message = "Giá không được để trống")
    @DecimalMin(value = "0", message = "Giá không được nhỏ hơn 0")
    private BigDecimal gia;

    private List<Long> danh_muc_ids;

    private Boolean cho_phep_doc_thu = false;

    @Min(value = 1, message = "Số trang đọc thử phải ít nhất 1 trang")
    private Integer so_trang_doc_thu = 5;
}
