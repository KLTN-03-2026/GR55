package com.backend.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "ma_otp")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MaOtp {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id_otp")
    private Long idOtp;

    @Column(name = "ma_nd", nullable = false)
    private Long maNd;

    @Column(name = "ma_otp", nullable = false, length = 6)
    private String maOtp;

    @Column(name = "het_han", nullable = false)
    private LocalDateTime hetHan;

    @Column(name = "da_dung")
    private Boolean daDung = false;

    @Column(name = "ngay_tao", updatable = false)
    private LocalDateTime ngayTao;

    @PrePersist
    protected void truocKhiLuu() {
        ngayTao = LocalDateTime.now();
    }
}
