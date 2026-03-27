package com.backend.backend.controller;

import com.backend.backend.dto.DanhMucRequest;
import com.backend.backend.dto.DanhMucResponse;
import com.backend.backend.dto.DanhSachDanhMucResponse;
import com.backend.backend.service.DanhMucSachService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/danh_muc")
@PreAuthorize("hasRole('QUAN_TRI')")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class DanhMucSachController {

    private final DanhMucSachService danhMucSachService;

    @GetMapping
    public ResponseEntity<DanhSachDanhMucResponse> layDanhSach(
            @RequestParam(required = false) String tim_kiem,
            @RequestParam(defaultValue = "1") int trang,
            @RequestParam(defaultValue = "10") int kich_thuoc) {
        return ResponseEntity.ok(danhMucSachService.layDanhSachDanhMuc(tim_kiem, trang, kich_thuoc));
    }

    @PostMapping
    public ResponseEntity<DanhMucResponse> themDanhMuc(
            @Valid @RequestBody DanhMucRequest yeuCau,
            BindingResult ketQuaKiemTra) {
        if (ketQuaKiemTra.hasErrors()) {
            String thongBao = ketQuaKiemTra.getFieldErrors().get(0).getDefaultMessage();
            return ResponseEntity.badRequest().body(new DanhMucResponse(false, thongBao, null));
        }

        DanhMucResponse ketQua = danhMucSachService.themDanhMuc(yeuCau);
        if (!ketQua.isSuccess()) {
            return ResponseEntity.badRequest().body(ketQua);
        }
        return ResponseEntity.ok(ketQua);
    }

    @PutMapping("/{ma_dm}")
    public ResponseEntity<DanhMucResponse> suaDanhMuc(
            @PathVariable Long ma_dm,
            @Valid @RequestBody DanhMucRequest yeuCau,
            BindingResult ketQuaKiemTra) {
        if (ketQuaKiemTra.hasErrors()) {
            String thongBao = ketQuaKiemTra.getFieldErrors().get(0).getDefaultMessage();
            return ResponseEntity.badRequest().body(new DanhMucResponse(false, thongBao, null));
        }

        DanhMucResponse ketQua = danhMucSachService.suaDanhMuc(ma_dm, yeuCau);
        if (!ketQua.isSuccess()) {
            return ResponseEntity.badRequest().body(ketQua);
        }
        return ResponseEntity.ok(ketQua);
    }

    @DeleteMapping("/{ma_dm}")
    public ResponseEntity<DanhMucResponse> xoaDanhMuc(@PathVariable Long ma_dm) {
        DanhMucResponse ketQua = danhMucSachService.xoaDanhMuc(ma_dm);
        if (!ketQua.isSuccess()) {
            return ResponseEntity.badRequest().body(ketQua);
        }
        return ResponseEntity.ok(ketQua);
    }
}
