package com.backend.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "lich_su_chat")
@Getter
@Setter
@NoArgsConstructor
public class LichSuChat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ma_lschat")
    private Long maLschat;

    @Column(name = "ma_nd")
    private Long maNd;

    @Column(name = "ma_phien", nullable = false, length = 100)
    private String maPhien;

    @Column(name = "vai_tro")
    private String vaiTro;

    @Column(name = "noi_dung", nullable = false, columnDefinition = "TEXT")
    private String noiDung;

    @Column(name = "y_dinh", length = 50)
    private String yDinh;

    @CreationTimestamp
    @Column(name = "ngay_tao", updatable = false)
    private LocalDateTime ngayTao;
}
