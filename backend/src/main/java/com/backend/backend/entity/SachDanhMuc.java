package com.backend.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "sach_danh_muc")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SachDanhMuc {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ma_lk")
    private Long maLk;

    @Column(name = "ma_sach", nullable = false)
    private Long maSach;

    @Column(name = "ma_dm", nullable = false)
    private Long maDm;
}
