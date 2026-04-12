package com.backend.backend.controller;

import com.backend.backend.dto.DocSachResponse;
import com.backend.backend.service.DocSachMienPhiService;
import com.backend.backend.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/doc_sach_mien_phi")
@RequiredArgsConstructor
public class DocSachMienPhiController {

    private final DocSachMienPhiService docSachMienPhiService;
    private final JwtUtil jwtUtil;

    // GET /api/doc_sach_mien_phi/{ma_sach}
    // Không yêu cầu đăng nhập — JWT tùy chọn để xác định da_dang_nhap
    @GetMapping("/{ma_sach}")
    public ResponseEntity<DocSachResponse> layUrlDocSach(
            HttpServletRequest request,
            @PathVariable Long ma_sach) {
        Long maNd = layMaNdTuyCHon(request);
        return ResponseEntity.ok(docSachMienPhiService.layUrlDocSach(ma_sach, maNd));
    }

    // Trích xuất maNd từ JWT nếu có, trả null nếu không có hoặc token không hợp lệ
    private Long layMaNdTuyCHon(HttpServletRequest request) {
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
