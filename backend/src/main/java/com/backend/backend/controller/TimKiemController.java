package com.backend.backend.controller;

import com.backend.backend.dto.GoiYTimKiemResponse;
import com.backend.backend.dto.SachTimKiemResponse;
import com.backend.backend.dto.TimKiemRequest;
import com.backend.backend.service.TimKiemService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tim_kiem")
@RequiredArgsConstructor
public class TimKiemController {

    private final TimKiemService timKiemService;

    // GET /api/tim_kiem — không yêu cầu đăng nhập
    @GetMapping
    public ResponseEntity<SachTimKiemResponse> timKiemSach(
            @RequestParam(required = false) String tu_khoa,
            @RequestParam(required = false) Long ma_danh_muc,
            @RequestParam(required = false) Double min_gia,
            @RequestParam(required = false) Double max_gia,
            @RequestParam(required = false) Double min_danh_gia,
            @RequestParam(required = false) Boolean sach_mien_phi,
            @RequestParam(required = false) Boolean sach_hoi_vien,
            @RequestParam(required = false) String sap_xep,
            @RequestParam(defaultValue = "1") int trang,
            @RequestParam(defaultValue = "12") int kich_thuoc) {

        TimKiemRequest request = new TimKiemRequest();
        request.setTu_khoa(tu_khoa);
        request.setMa_danh_muc(ma_danh_muc);
        request.setMin_gia(min_gia);
        request.setMax_gia(max_gia);
        request.setMin_danh_gia(min_danh_gia);
        request.setSach_mien_phi(sach_mien_phi);
        request.setSach_hoi_vien(sach_hoi_vien);
        request.setSap_xep(sap_xep);
        request.setTrang(trang);
        request.setKich_thuoc(kich_thuoc);

        return ResponseEntity.ok(timKiemService.timKiemSach(request));
    }

    // GET /api/tim_kiem/goi_y?tu_khoa=... — không yêu cầu đăng nhập
    @GetMapping("/goi_y")
    public ResponseEntity<GoiYTimKiemResponse> goiYTimKiem(@RequestParam String tu_khoa) {
        return ResponseEntity.ok(timKiemService.goiYTimKiem(tu_khoa));
    }
}
