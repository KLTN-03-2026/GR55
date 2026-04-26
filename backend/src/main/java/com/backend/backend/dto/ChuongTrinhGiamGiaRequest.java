package com.backend.backend.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
public class ChuongTrinhGiamGiaRequest {

    @NotBlank(message = "Tên chương trình không được để trống")
    @Size(max = 255, message = "Tên chương trình không quá 255 ký tự")
    private String ten_chuong_trinh;

    @NotNull(message = "Ngày bắt đầu không được để trống")
    private LocalDateTime ngay_bat_dau;

    @NotNull(message = "Ngày kết thúc không được để trống")
    private LocalDateTime ngay_ket_thuc;

    @NotBlank(message = "Loại giảm giá không được để trống")
    private String loai_giam;

    @NotNull(message = "Giá trị giảm không được để trống")
    @DecimalMin(value = "0.01", message = "Giá trị giảm phải lớn hơn 0")
    private BigDecimal gia_tri_giam;

    private CachChonSach cach_chon_sach;

    @Getter
    @Setter
    public static class CachChonSach {
        private String loai; // "danh_sach", "danh_muc", "sach_moi_nhat", "sach_ban_chay", "tat_ca"
        private List<Long> danh_sach_sach;
        private List<Long> danh_sach_danh_muc;
        private Integer so_luong;
    }
}
