package com.backend.backend.service;

import com.backend.backend.dto.DocThuResponse;
import com.backend.backend.entity.Sach;
import com.backend.backend.repository.GoiHoiVienSachRepository;
import com.backend.backend.repository.SachRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class DocThuService {

    private final SachRepository sachRepository;
    private final GoiHoiVienSachRepository goiHoiVienSachRepository;

    private static final int SO_TRANG_DOC_THU_MAC_DINH = 5;

    public DocThuResponse layUrlDocThu(Long maSach) {
        Sach sach = sachRepository.findById(maSach)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Sách không tồn tại"));

        if (Boolean.TRUE.equals(sach.getDaXoa())) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Sách không tồn tại");
        }

        if (!Boolean.TRUE.equals(sach.getChoPhepDocThu())) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN, "Sách này không hỗ trợ đọc thử");
        }

        int soTrangDocThu = sach.getSoTrangDocThu() != null
                ? sach.getSoTrangDocThu()
                : SO_TRANG_DOC_THU_MAC_DINH;

        boolean laSachHoiVien = goiHoiVienSachRepository.existsByMaSach(maSach);
        boolean laSachTraPhi = sach.getGia().compareTo(BigDecimal.ZERO) > 0;

        // URL trả về nguyên — FE PDF viewer tự giới hạn trang theo so_trang_doc_thu
        DocThuResponse.DocThuData duLieu = new DocThuResponse.DocThuData(
                sach.getMaSach(),
                sach.getTenSach(),
                sach.getFilePdfUrl(),
                soTrangDocThu,
                laSachHoiVien,
                laSachTraPhi
        );

        return new DocThuResponse(true, "Lấy thông tin đọc thử thành công", duLieu);
    }
}
