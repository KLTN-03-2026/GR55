package com.backend.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "chuong_trinh_giam_gia_sach")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChuongTrinhGiamGiaSach {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_lk_ctsach")
    private Long idLkCtSach;

    @Column(name = "ma_ct", nullable = false)
    private Long maCt;

    @Column(name = "ma_sach", nullable = false)
    private Long maSach;

    @Column(name = "ngay_tao")
    private LocalDateTime ngayTao;
}
