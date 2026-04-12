package com.backend.backend.controller;

import com.backend.backend.dto.DocThuResponse;
import com.backend.backend.service.DocThuService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/doc_thu")
@RequiredArgsConstructor
public class DocThuController {

    private final DocThuService docThuService;

    // GET /api/doc_thu/{ma_sach} — không yêu cầu đăng nhập
    @GetMapping("/{ma_sach}")
    public ResponseEntity<DocThuResponse> layUrlDocThu(@PathVariable Long ma_sach) {
        return ResponseEntity.ok(docThuService.layUrlDocThu(ma_sach));
    }
}
