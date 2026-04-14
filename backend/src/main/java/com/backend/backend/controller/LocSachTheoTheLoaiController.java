package com.backend.backend.controller;

import com.backend.backend.dto.LocTheoTheLoaiRequest;
import com.backend.backend.dto.SachTheoTheLoaiResponse;
import com.backend.backend.service.LocSachTheoTheLoaiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/the_loai")
@RequiredArgsConstructor
public class LocSachTheoTheLoaiController {

    private final LocSachTheoTheLoaiService locSachTheoTheLoaiService;

    // GET /api/the_loai/{ma_the_loai}/sach — không yêu cầu đăng nhập
    @GetMapping("/{ma_the_loai}/sach")
    public ResponseEntity<SachTheoTheLoaiResponse> laySachTheoTheLoai(
            @PathVariable Long ma_the_loai,
            @RequestParam(required = false) Double min_gia,
            @RequestParam(required = false) Double max_gia,
            @RequestParam(required = false) Double min_danh_gia,
            @RequestParam(required = false) Boolean sach_mien_phi,
            @RequestParam(required = false) String sap_xep,
            @RequestParam(defaultValue = "1") int trang,
            @RequestParam(defaultValue = "12") int kich_thuoc) {

        LocTheoTheLoaiRequest request = new LocTheoTheLoaiRequest();
        request.setMa_the_loai(ma_the_loai);
        request.setMin_gia(min_gia);
        request.setMax_gia(max_gia);
        request.setMin_danh_gia(min_danh_gia);
        request.setSach_mien_phi(sach_mien_phi);
        request.setSap_xep(sap_xep);
        request.setTrang(trang);
        request.setKich_thuoc(kich_thuoc);

        return ResponseEntity.ok(locSachTheoTheLoaiService.laySachTheoTheLoai(request));
    }
}
