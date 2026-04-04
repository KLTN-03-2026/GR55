package com.backend.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "sach_yeu_thich")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SachYeuThich {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ma_sachyt")
    private Long idYt;

    @Column(name = "ma_nd", nullable = false)
    private Long maNd;

    @Column(name = "ma_sach", nullable = false)
    private Long maSach;

    @CreationTimestamp
    @Column(name = "ngay_tao", updatable = false)
    private LocalDateTime ngayTao;
}
