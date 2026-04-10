package com.backend.backend.service;

import com.backend.backend.dto.DocSachDaMuaResponse;
import com.backend.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class DocSachDaMuaService {

    private final SachRepository sachRepository;
    private final DonHangRepository donHangRepository;
    private final LichSuHoiVienRepository lichSuHoiVienRepository;
    private final GoiHoiVienSachRepository goiHoiVienSachRepository;

    @Cacheable(value = "quyen_doc_sach", key = "#maNd + '_' + #maSach")
    public DocSachDaMuaResponse kiemTraQuyenVaLayUrl(Long maNd, Long maSach) {
        var sach = sachRepository.findById(maSach)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Sách không tồn tại"));

        if (Boolean.TRUE.equals(sach.getDaXoa())) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Sách không tồn tại");
        }

        boolean daMua = donHangRepository.countDaMuaSach(maNd, maSach) > 0;
        boolean laHoiVien = lichSuHoiVienRepository.isHoiVien(maNd, LocalDateTime.now());
        boolean sachThuocGoiHoiVien = goiHoiVienSachRepository.existsByMaSach(maSach);

        // Có quyền đọc nếu đã mua, hoặc là hội viên và sách thuộc gói hội viên
        boolean coQuyenDoc = daMua || (sachThuocGoiHoiVien && laHoiVien);

        if (!coQuyenDoc) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Bạn không có quyền đọc sách này");
        }

        DocSachDaMuaResponse.DocSachDaMuaData duLieu = new DocSachDaMuaResponse.DocSachDaMuaData(
                sach.getMaSach(),
                sach.getTenSach(),
                sach.getFilePdfUrl(),
                daMua,
                laHoiVien,
                sachThuocGoiHoiVien
        );

        return new DocSachDaMuaResponse(true, "Lấy URL sách thành công", duLieu);
    }
}
