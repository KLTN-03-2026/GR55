package com.backend.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
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
    @Column(name = "id_td")
    private Long idTd;

    @Column(name = "ma_nd", nullable = false)
    private Long maNd;

    @Column(name = "ma_sach", nullable = false)
    private Long maSach;

    @Column(name = "trang_hien_tai")
    private Integer trangHienTai = 1;

    @Column(name = "phan_tram_hoan_thanh")
    private Double phanTramHoanThanh = 0.0;

    @UpdateTimestamp
    @Column(name = "ngay_cap_nhat")
    private LocalDateTime ngayCapNhat;
}
