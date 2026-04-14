package com.backend.backend.service;

import com.backend.backend.dto.SachGoiYResponse;
import com.backend.backend.entity.Sach;
import com.backend.backend.repository.SachRepository;
import com.backend.backend.repository.TienDoDocSachRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GoiYSachService {

    private final SachRepository sachRepository;
    private final TienDoDocSachRepository tienDoDocSachRepository;

    public SachGoiYResponse layGoiYSach(Long maNd, int soLuong) {
        if (maNd != null) {
            return layGoiYThanhVien(maNd, soLuong);
        }
        return layGoiYKhach(soLuong);
    }

    @Cacheable(value = "goi_y_sach_khach", key = "#soLuong")
    public SachGoiYResponse layGoiYKhach(int soLuong) {
        List<Sach> ketQua = sachRepository.findSachNoiBat(PageRequest.of(0, soLuong)).getContent();
        return xayDungResponse("Sách phổ biến", ketQua);
    }

    @Cacheable(value = "goi_y_sach_thanh_vien", key = "#maNd + '_' + #soLuong")
    public SachGoiYResponse layGoiYThanhVien(Long maNd, int soLuong) {
        List<Long> theLoaiYeuThich = tienDoDocSachRepository.findTheLoaiYeuThichByUserId(maNd);
        if (!theLoaiYeuThich.isEmpty()) {
            Page<Sach> page = sachRepository.findSachGoiYThanhVien(
                    maNd, theLoaiYeuThich, PageRequest.of(0, soLuong));
            if (!page.isEmpty()) {
                return xayDungResponse("Gợi ý sách dựa trên lịch sử đọc", page.getContent());
            }
        }
        // Chưa có lịch sử hoặc đã đọc hết → fallback phổ biến
        List<Sach> phoBien = sachRepository.findSachNoiBat(PageRequest.of(0, soLuong)).getContent();
        return xayDungResponse("Sách phổ biến", phoBien);
    }

    private SachGoiYResponse xayDungResponse(String thongBao, List<Sach> sachs) {
        List<SachGoiYResponse.SachGoiYData> danhSach = sachs.stream()
                .map(s -> new SachGoiYResponse.SachGoiYData(
                        s.getMaSach(),
                        s.getTenSach(),
                        s.getTacGia(),
                        s.getAnhBiaUrl(),
                        s.getGia(),
                        s.getDanhGiaTrungBinh() != null ? s.getDanhGiaTrungBinh().doubleValue() : 0.0
                ))
                .collect(Collectors.toList());
        return new SachGoiYResponse(true, thongBao, danhSach);
    }
}
