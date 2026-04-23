package com.backend.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "chi_tiet_don_hang")
@Getter
@Setter
@NoArgsConstructor
public class ChiTietDonHang {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ma_ctdh")
    private Long maCtdh;

    @Column(name = "id_dh", nullable = false)
    private Long idDh;

    @Column(name = "ma_sach", nullable = false)
    private Long maSach;

    @Column(name = "ten_sach", nullable = false, length = 255)
    private String tenSach;

    @Column(name = "tac_gia", length = 100)
    private String tacGia;

    @Column(name = "anh_bia_url", length = 500)
    private String anhBiaUrl;

    @Column(name = "don_gia", nullable = false, precision = 10, scale = 2)
    private BigDecimal donGia;
}
