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
@Table(name = "sach")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Sach {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ma_sach")
    private Long maSach;

    @Column(name = "ten_sach", nullable = false, length = 255)
    private String tenSach;

    @Column(name = "tac_gia", nullable = false, length = 100)
    private String tacGia;

    @Column(name = "mo_ta", columnDefinition = "TEXT")
    private String moTa;

    @Column(name = "gia", nullable = false, precision = 10, scale = 2)
    private BigDecimal gia = BigDecimal.ZERO;

    @Column(name = "anh_bia_url", length = 500)
    private String anhBiaUrl;

    @Column(name = "file_pdf_url", nullable = false, length = 500)
    private String filePdfUrl;

    @Column(name = "cho_phep_doc_thu")
    private Boolean choPhepDocThu = false;

    @Column(name = "so_trang_doc_thu")
    private Integer soTrangDocThu = 5;

    @Column(name = "luot_xem")
    private Integer luotXem = 0;

    @Column(name = "danh_gia_trung_binh", precision = 3, scale = 2)
    private BigDecimal danhGiaTrungBinh = BigDecimal.ZERO;

    @Column(name = "da_xoa")
    private Boolean daXoa = false;

    @Column(name = "ngay_xoa")
    private LocalDateTime ngayXoa;

    @CreationTimestamp
    @Column(name = "ngay_tao", updatable = false)
    private LocalDateTime ngayTao;

    @UpdateTimestamp
    @Column(name = "ngay_cap_nhat")
    private LocalDateTime ngayCapNhat;
}
