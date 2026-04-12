package com.backend.backend.service;

import com.backend.backend.dto.DocSachResponse;
import com.backend.backend.entity.Sach;
import com.backend.backend.repository.SachRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class DocSachMienPhiService {

    private final SachRepository sachRepository;

    public DocSachResponse layUrlDocSach(Long maSach, Long maNd) {
        Sach sach = sachRepository.findById(maSach)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Sách không tồn tại"));

        if (Boolean.TRUE.equals(sach.getDaXoa())) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Sách không tồn tại");
        }

        if (sach.getGia().compareTo(BigDecimal.ZERO) != 0) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN, "Sách này không miễn phí. Vui lòng mua để đọc");
        }

        DocSachResponse.DocSachData duLieu = new DocSachResponse.DocSachData(
                sach.getMaSach(),
                sach.getTenSach(),
                sach.getFilePdfUrl(),
                sach.getChoPhepDocThu(),
                sach.getSoTrangDocThu(),
                maNd != null
        );

        return new DocSachResponse(true, "Lấy thông tin sách thành công", duLieu);
    }
}
