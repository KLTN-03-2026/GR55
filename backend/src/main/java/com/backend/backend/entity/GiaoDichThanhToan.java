package com.backend.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "giao_dich_thanh_toan")
@Data
public class GiaoDichThanhToan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ma_gd")
    private Long maGd;

    @Column(name = "id_dh", nullable = false)
    private Long idDh;

    @Column(name = "so_tien", nullable = false, precision = 12, scale = 2)
    private BigDecimal soTien;

    @Column(name = "phuong_thuc", length = 20)
    private String phuongThuc = "VNPAY";

    @Column(name = "trang_thai", nullable = false, length = 20)
    private String trangThai;

    @Column(name = "ma_giao_dich_ngoai", length = 50)
    private String maGiaoDichNgoai;

    @Column(name = "phan_hoi", columnDefinition = "TEXT")
    private String phanHoi;

    @CreationTimestamp
    @Column(name = "ngay_thanh_toan", updatable = false)
    private LocalDateTime ngayThanhToan;
}
