package com.backend.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "goi_hoi_vien_sach")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class GoiHoiVienSach {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_lk_sachhv")
    private Long idLkSachHv;

    @Column(name = "ma_hv", nullable = false)
    private Long maHv;

    @Column(name = "ma_sach", nullable = false)
    private Long maSach;

    @Column(name = "ngay_tao")
    private LocalDateTime ngayTao;
}
