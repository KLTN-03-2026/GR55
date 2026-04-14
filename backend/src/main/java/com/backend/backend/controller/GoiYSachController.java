package com.backend.backend.controller;

import com.backend.backend.dto.SachGoiYResponse;
import com.backend.backend.service.GoiYSachService;
import com.backend.backend.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/goi_y")
@RequiredArgsConstructor
public class GoiYSachController {

    private final GoiYSachService goiYSachService;
    private final JwtUtil jwtUtil;

    // GET /api/goi_y?so_luong=10 — JWT tùy chọn
    @GetMapping
    public ResponseEntity<SachGoiYResponse> layGoiYSach(
            HttpServletRequest request,
            @RequestParam(defaultValue = "10") int so_luong) {
        Long maNd = layMaNdTuyChon(request);
        return ResponseEntity.ok(goiYSachService.layGoiYSach(maNd, so_luong));
    }

    private Long layMaNdTuyChon(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            try {
                return jwtUtil.layMaNdTuToken(authHeader.substring(7));
            } catch (Exception e) {
                return null;
            }
        }
        return null;
    }
}
