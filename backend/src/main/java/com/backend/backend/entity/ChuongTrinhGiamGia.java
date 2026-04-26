package com.backend.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "chuong_trinh_giam_gia")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChuongTrinhGiamGia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ma_ct")
    private Long maCt;

    @Column(name = "ten_chuong_trinh", nullable = false, length = 255)
    private String tenChuongTrinh;

    @Column(name = "loai_giam", nullable = false)
    private String loaiGiam;

    @Column(name = "gia_tri_giam", nullable = false, precision = 10, scale = 2)
    private BigDecimal giaTriGiam;

    @Column(name = "ngay_bat_dau", nullable = false)
    private LocalDateTime ngayBatDau;

    @Column(name = "ngay_ket_thuc", nullable = false)
    private LocalDateTime ngayKetThuc;

    @Column(name = "hoat_dong")
    private Boolean hoatDong;

    @CreationTimestamp
    @Column(name = "ngay_tao", updatable = false)
    private LocalDateTime ngayTao;

    @UpdateTimestamp
    @Column(name = "ngay_cap_nhat")
    private LocalDateTime ngayCapNhat;
}
