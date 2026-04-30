package com.backend.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "lich_su_hoi_vien")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LichSuHoiVien {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ma_lshv")
    private Long idLsHv;

    @Column(name = "ma_nd", nullable = false)
    private Long maNd;

    @Column(name = "ma_hv", nullable = false)
    private Long maHv;

    @Column(name = "trang_thai", length = 20)
    private String trangThai = "hoat_dong";

    @Column(name = "ngay_bat_dau")
    private LocalDateTime ngayBatDau;

    @Column(name = "ngay_ket_thuc")
    private LocalDateTime ngayKetThuc;

    @CreationTimestamp
    @Column(name = "ngay_tao", updatable = false)
    private LocalDateTime ngayTao;
}
