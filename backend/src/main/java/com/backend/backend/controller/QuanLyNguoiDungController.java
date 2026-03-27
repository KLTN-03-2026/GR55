package com.backend.backend.controller;

import com.backend.backend.dto.*;
import com.backend.backend.service.NguoiDungService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/nguoi_dung")
@PreAuthorize("hasRole('QUAN_TRI')")
@RequiredArgsConstructor
public class QuanLyNguoiDungController {

    private final NguoiDungService nguoiDungService;

    @GetMapping
    public ResponseEntity<DanhSachNguoiDungResponse> layDanhSach(
            @RequestParam(required = false) String tu_khoa,
            @RequestParam(required = false) String vai_tro,
            @RequestParam(required = false) String trang_thai,
            @RequestParam(defaultValue = "1") int trang,
            @RequestParam(defaultValue = "10") int kich_thuoc) {
        return ResponseEntity.ok(
                nguoiDungService.layDanhSachNguoiDung(tu_khoa, vai_tro, trang_thai, trang, kich_thuoc));
    }

    @GetMapping("/{ma_nd}")
    public ResponseEntity<ChiTietNguoiDungResponse> layChiTiet(@PathVariable Long ma_nd) {
        return ResponseEntity.ok(nguoiDungService.layChiTietNguoiDung(ma_nd));
    }

    @PutMapping("/{ma_nd}/khoa_mo")
    public ResponseEntity<NguoiDungResponse> khoaMoTaiKhoan(@PathVariable Long ma_nd) {
        NguoiDungResponse ketQua = nguoiDungService.khoaMoKhoaTaiKhoan(ma_nd);
        if (!ketQua.isThanh_cong()) {
            return ResponseEntity.badRequest().body(ketQua);
        }
        return ResponseEntity.ok(ketQua);
    }
}
