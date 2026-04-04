package com.backend.backend.controller;

import com.backend.backend.dto.DanhSachSachDangDocResponse;
import com.backend.backend.dto.LuuTienDoRequest;
import com.backend.backend.dto.TienDoDocResponse;
import com.backend.backend.service.TienDoDocService;
import com.backend.backend.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tien_do_doc")
@RequiredArgsConstructor
public class TienDoDocController {

    private final TienDoDocService tienDoDocService;
    private final JwtUtil jwtUtil;

    @PostMapping
    public ResponseEntity<TienDoDocResponse> luuTienDo(
            HttpServletRequest request,
            @Valid @RequestBody LuuTienDoRequest yeuCau,
            BindingResult ketQuaKiemTra) {
        if (ketQuaKiemTra.hasErrors()) {
            String thongBao = ketQuaKiemTra.getFieldErrors().get(0).getDefaultMessage();
            return ResponseEntity.badRequest()
                    .body(new TienDoDocResponse(false, thongBao, null));
        }
        Long maNd = layMaNdTuRequest(request);
        return ResponseEntity.ok(tienDoDocService.luuTienDo(maNd, yeuCau));
    }

    @GetMapping("/{ma_sach}")
    public ResponseEntity<TienDoDocResponse> layTienDo(
            HttpServletRequest request,
            @PathVariable Long ma_sach) {
        Long maNd = layMaNdTuRequest(request);
        return ResponseEntity.ok(tienDoDocService.layTienDo(maNd, ma_sach));
    }

    @GetMapping("/sach_dang_doc")
    public ResponseEntity<DanhSachSachDangDocResponse> laySachDangDoc(
            HttpServletRequest request,
            @RequestParam(defaultValue = "1") int trang,
            @RequestParam(defaultValue = "10") int kich_thuoc) {
        Long maNd = layMaNdTuRequest(request);
        return ResponseEntity.ok(tienDoDocService.laySachDangDoc(maNd, trang, kich_thuoc));
    }

    private Long layMaNdTuRequest(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Không tìm thấy token xác thực");
        }
        return jwtUtil.layMaNdTuToken(authHeader.substring(7));
    }
}
