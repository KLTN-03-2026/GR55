package com.backend.backend.controller;

import com.backend.backend.dto.SachGiamGiaHomepageResponse;
import com.backend.backend.service.GiamGiaPublicService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/giam_gia")
@RequiredArgsConstructor
public class GiamGiaPublicController {

    private final GiamGiaPublicService giamGiaPublicService;

    @GetMapping("/hien_thi")
    public ResponseEntity<SachGiamGiaHomepageResponse> hienThiGiamGia() {
        return ResponseEntity.ok(giamGiaPublicService.laySachGiamGia());
    }
}
