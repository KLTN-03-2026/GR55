package com.backend.backend.controller;

import com.backend.backend.dto.SachThuVienResponse;
import com.backend.backend.dto.YeuThichResponse;
import com.backend.backend.service.ThuVienService;
import com.backend.backend.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/thu_vien")
@RequiredArgsConstructor
public class ThuVienController {

    private final ThuVienService thuVienService;
    private final JwtUtil jwtUtil;

    // GET /api/thu_vien/sach_da_mua
    @GetMapping("/sach_da_mua")
    public ResponseEntity<SachThuVienResponse> laySachDaMua(
            HttpServletRequest request,
            @RequestParam(defaultValue = "1") int trang,
            @RequestParam(defaultValue = "12") int kich_thuoc) {
        Long maNd = layMaNdTuRequest(request);
        return ResponseEntity.ok(thuVienService.laySachDaMua(maNd, trang, kich_thuoc));
    }

    // GET /api/thu_vien/sach_yeu_thich
    @GetMapping("/sach_yeu_thich")
    public ResponseEntity<YeuThichResponse> laySachYeuThich(
            HttpServletRequest request,
            @RequestParam(defaultValue = "1") int trang,
            @RequestParam(defaultValue = "12") int kich_thuoc) {
        Long maNd = layMaNdTuRequest(request);
        return ResponseEntity.ok(thuVienService.laySachYeuThich(maNd, trang, kich_thuoc));
    }

    // POST /api/thu_vien/yeu_thich/{ma_sach}
    @PostMapping("/yeu_thich/{ma_sach}")
    public ResponseEntity<YeuThichResponse> themYeuThich(
            HttpServletRequest request,
            @PathVariable Long ma_sach) {
        Long maNd = layMaNdTuRequest(request);
        return ResponseEntity.ok(thuVienService.themYeuThich(maNd, ma_sach));
    }

    // DELETE /api/thu_vien/yeu_thich/{ma_sach}
    @DeleteMapping("/yeu_thich/{ma_sach}")
    public ResponseEntity<YeuThichResponse> xoaYeuThich(
            HttpServletRequest request,
            @PathVariable Long ma_sach) {
        Long maNd = layMaNdTuRequest(request);
        return ResponseEntity.ok(thuVienService.xoaYeuThich(maNd, ma_sach));
    }

    // GET /api/thu_vien/sach_dang_doc
    @GetMapping("/sach_dang_doc")
    public ResponseEntity<SachThuVienResponse> laySachDangDoc(
            HttpServletRequest request,
            @RequestParam(defaultValue = "1") int trang,
            @RequestParam(defaultValue = "12") int kich_thuoc) {
        Long maNd = layMaNdTuRequest(request);
        return ResponseEntity.ok(thuVienService.laySachDangDoc(maNd, trang, kich_thuoc));
    }

    private Long layMaNdTuRequest(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Không tìm thấy token xác thực");
        }
        return jwtUtil.layMaNdTuToken(authHeader.substring(7));
    }
}
