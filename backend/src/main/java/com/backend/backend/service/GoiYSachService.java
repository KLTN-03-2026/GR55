package com.backend.backend.service;

import com.backend.backend.dto.GiamGiaInfo;
import com.backend.backend.dto.SachGoiYResponse;
import com.backend.backend.entity.Sach;
import com.backend.backend.repository.LichSuChatRepository;
import com.backend.backend.repository.SachRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GoiYSachService {

    private final SachRepository sachRepository;
    private final QuanLyGiamGiaService quanLyGiamGiaService;
    private final LichSuChatRepository lichSuChatRepository;

    @Caching(cacheable = {
        @Cacheable(value = "goi_y_sach_khach", key = "#soLuong", condition = "#maNd == null"),
        @Cacheable(value = "goi_y_sach_thanh_vien", key = "#maNd + '_' + #soLuong", condition = "#maNd != null")
    })
    public SachGoiYResponse layGoiYSach(Long maNd, int soLuong) {
        if (maNd != null) {
            return layGoiYThanhVien(maNd, soLuong);
        }
        return layGoiYKhach(soLuong);
    }

    public SachGoiYResponse layGoiYKhach(int soLuong) {
        List<Sach> ketQua = sachRepository.findSachNoiBat(PageRequest.of(0, soLuong)).getContent();
        return xayDungResponse("Sách phổ biến", ketQua);
    }

    public SachGoiYResponse layGoiYThanhVien(Long maNd, int soLuong) {
        // Lấy y_dinh mới nhất từ chatbot AI
        List<String> yDinhList = lichSuChatRepository.findYDinhMoiNhatByMaNd(maNd, PageRequest.of(0, 1));

        if (!yDinhList.isEmpty()) {
            // Có y_dinh: 4 sách theo AI + 4 sách phổ biến
            String yDinh = yDinhList.get(0);
            List<Sach> sachAI = sachRepository
                    .timKiemSach(yDinh, null, null, null, null, null, null, PageRequest.of(0, 4))
                    .getContent();

            List<Long> daMuon = sachAI.stream().map(Sach::getMaSach).collect(Collectors.toList());
            List<Sach> phoBien = sachRepository.findSachNoiBat(PageRequest.of(0, soLuong)).getContent()
                    .stream().filter(s -> !daMuon.contains(s.getMaSach()))
                    .limit(soLuong - sachAI.size())
                    .collect(Collectors.toList());

            List<Sach> ketHop = new java.util.ArrayList<>(sachAI);
            ketHop.addAll(phoBien);
            return xayDungResponse("Gợi ý cho bạn", ketHop);
        }

        // Không có y_dinh: fallback 8 sách phổ biến
        List<Sach> phoBien = sachRepository.findSachNoiBat(PageRequest.of(0, soLuong)).getContent();
        return xayDungResponse("Gợi ý cho bạn", phoBien);
    }

    // Gợi ý dựa trên y_dinh từ chatbot AI (endpoint riêng)
    public SachGoiYResponse layGoiYTheoYDinh(Long maNd, int soLuong) {
        if (maNd == null) return new SachGoiYResponse(true, "", List.of());
        List<String> yDinhList = lichSuChatRepository.findYDinhMoiNhatByMaNd(maNd, PageRequest.of(0, 1));
        if (yDinhList.isEmpty()) return new SachGoiYResponse(true, "", List.of());
        String yDinh = yDinhList.get(0);
        List<Sach> sachs = sachRepository
                .timKiemSach(yDinh, null, null, null, null, null, null, PageRequest.of(0, soLuong))
                .getContent();
        if (sachs.isEmpty()) return new SachGoiYResponse(true, "", List.of());
        return xayDungResponse("Dựa trên sở thích của bạn: " + yDinh, sachs);
    }

    private SachGoiYResponse xayDungResponse(String thongBao, List<Sach> sachs) {
        List<SachGoiYResponse.SachGoiYData> danhSach = sachs.stream()
                .map(s -> {
                    GiamGiaInfo info = quanLyGiamGiaService.layGiamGiaInfo(s.getMaSach());
                    return new SachGoiYResponse.SachGoiYData(
                            s.getMaSach(),
                            s.getTenSach(),
                            s.getTacGia(),
                            s.getAnhBiaUrl(),
                            s.getGia(),
                            s.getDanhGiaTrungBinh() != null ? s.getDanhGiaTrungBinh().doubleValue() : 0.0,
                            info != null ? info.getGia_sau_giam() : null,
                            info != null ? info.getNhan_giam() : null);
                })
                .collect(Collectors.toList());
        return new SachGoiYResponse(true, thongBao, danhSach);
    }
}
