package com.backend.backend.controller;

import com.backend.backend.dto.DocSachDaMuaResponse;
import com.backend.backend.service.DocSachDaMuaService;
import com.backend.backend.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/doc_sach_da_mua")
@RequiredArgsConstructor
public class DocSachDaMuaController {

    private final DocSachDaMuaService docSachDaMuaService;
    private final JwtUtil jwtUtil;

    // GET /api/doc_sach_da_mua/{ma_sach} — yêu cầu đăng nhập
    @GetMapping("/{ma_sach}")
    public ResponseEntity<DocSachDaMuaResponse> layUrlDocSach(
            HttpServletRequest request,
            @PathVariable Long ma_sach) {
        Long maNd = layMaNdTuRequest(request);
        return ResponseEntity.ok(docSachDaMuaService.kiemTraQuyenVaLayUrl(maNd, ma_sach));
    }

    private Long layMaNdTuRequest(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Không tìm thấy token xác thực");
        }
        return jwtUtil.layMaNdTuToken(authHeader.substring(7));
    }
}
