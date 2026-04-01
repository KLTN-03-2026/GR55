package com.backend.backend.controller;

import com.backend.backend.dto.DanhSachSachResponse;
import com.backend.backend.dto.SachRequest;
import com.backend.backend.dto.SachResponse;
import com.backend.backend.service.SachService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/admin/sach")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
@PreAuthorize("hasRole('QUAN_TRI')")
public class SachController {

    private final SachService sachService;

    @GetMapping
    public ResponseEntity<DanhSachSachResponse> layDanhSachSach(
            @RequestParam(required = false) String tu_khoa,
            @RequestParam(required = false) Long ma_danh_muc,
            @RequestParam(required = false) String trang_thai,
            @RequestParam(defaultValue = "1") int trang,
            @RequestParam(defaultValue = "10") int kich_thuoc) {
        Boolean mienPhi = "mien_phi".equals(trang_thai) ? Boolean.TRUE
                        : "tra_phi".equals(trang_thai) ? Boolean.FALSE : null;
        return ResponseEntity.ok(sachService.layDanhSachSach(tu_khoa, ma_danh_muc, mienPhi, trang, kich_thuoc));
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<SachResponse> themSachMoi(
            @RequestPart("du_lieu") SachRequest yeuCau,
            @RequestPart("anh_bia") MultipartFile anhBia,
            @RequestPart("file_pdf") MultipartFile filePdf) throws IOException {
        SachResponse ketQua = sachService.themSachMoi(yeuCau, anhBia, filePdf);
        int maHttp = ketQua.isSuccess() ? 201 : 400;
        return ResponseEntity.status(maHttp).body(ketQua);
    }

    @PutMapping(value = "/{ma_sach}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<SachResponse> suaSach(
            @PathVariable Long ma_sach,
            @RequestPart("du_lieu") SachRequest yeuCau,
            @RequestPart(value = "anh_bia", required = false) MultipartFile anhBia,
            @RequestPart(value = "file_pdf", required = false) MultipartFile filePdf) throws IOException {
        SachResponse ketQua = sachService.suaSach(ma_sach, yeuCau, anhBia, filePdf);
        int maHttp = ketQua.isSuccess() ? 200 : 400;
        return ResponseEntity.status(maHttp).body(ketQua);
    }

    @DeleteMapping("/{ma_sach}")
    public ResponseEntity<SachResponse> xoaSach(@PathVariable Long ma_sach) {
        SachResponse ketQua = sachService.xoaSach(ma_sach);
        int maHttp = ketQua.isSuccess() ? 200 : 400;
        return ResponseEntity.status(maHttp).body(ketQua);
    }
}
