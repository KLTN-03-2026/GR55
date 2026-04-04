package com.backend.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "tien_do_doc_sach")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TienDoDocSach {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ma_td")
    private Long idTd;

    @Column(name = "ma_nd", nullable = false)
    private Long maNd;

    @Column(name = "ma_sach", nullable = false)
    private Long maSach;

    @Column(name = "trang_hien_tai")
    private Integer trangHienTai = 1;

    @Column(name = "phan_tram", precision = 5, scale = 2)
    private Double phanTram = 0.0;

    @Column(name = "lan_doc_cuoi")
    private LocalDateTime lanDocCuoi;

    @CreationTimestamp
    @Column(name = "ngay_tao", updatable = false)
    private LocalDateTime ngayTao;

    @UpdateTimestamp
    @Column(name = "ngay_cap_nhat")
    private LocalDateTime ngayCapNhat;
}
