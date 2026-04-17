package com.backend.backend.controller;

import com.backend.backend.dto.*;
import com.backend.backend.service.TrangChuService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/home")
@RequiredArgsConstructor
public class TrangChuController {

    private final TrangChuService trangChuService;

    @GetMapping("/danh_muc")
    public ResponseEntity<List<DanhMucHomeResponse>> layDanhMuc() {
        return ResponseEntity.ok(trangChuService.layDanhSachDanhMuc());
    }

    @GetMapping("/sach_noi_bat")
    public ResponseEntity<DanhSachSachHomeResponse> laySachNoiBat(
            @RequestParam(defaultValue = "1") int trang,
            @RequestParam(defaultValue = "10") int kich_thuoc) {
        return ResponseEntity.ok(trangChuService.laySachNoiBat(trang, kich_thuoc));
    }

    @GetMapping("/sach_mien_phi")
    public ResponseEntity<DanhSachSachHomeResponse> laySachMienPhi(
            @RequestParam(defaultValue = "1") int trang,
            @RequestParam(defaultValue = "10") int kich_thuoc) {
        return ResponseEntity.ok(trangChuService.laySachMienPhi(trang, kich_thuoc));
    }

    @GetMapping("/sach_hoi_vien")
    public ResponseEntity<DanhSachSachHomeResponse> laySachHoiVien(
            @RequestParam(defaultValue = "1") int trang,
            @RequestParam(defaultValue = "10") int kich_thuoc) {
        return ResponseEntity.ok(trangChuService.laySachHoiVien(trang, kich_thuoc));
    }

    @GetMapping("/sach_goi_y")
    public ResponseEntity<DanhSachSachHomeResponse> laySachGoiY(
            @RequestParam(required = false) Long ma_nd,
            @RequestParam(defaultValue = "1") int trang,
            @RequestParam(defaultValue = "10") int kich_thuoc) {
        return ResponseEntity.ok(trangChuService.laySachGoiY(ma_nd, trang, kich_thuoc));
    }
}
