package com.backend.backend.service;

import com.backend.backend.dto.GioHangResponse;
import com.backend.backend.dto.ThemVaoGioRequest;
import com.backend.backend.entity.GioHang;
import com.backend.backend.entity.Sach;
import com.backend.backend.repository.GioHangRepository;
import com.backend.backend.repository.SachRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GioHangService {

    private final GioHangRepository gioHangRepository;
    private final SachRepository sachRepository;

    @Transactional
    public GioHangResponse themVaoGio(Long maNd, ThemVaoGioRequest yeuCau) {
        Sach sach = sachRepository.findById(yeuCau.getMa_sach())
                .orElseThrow(() -> new RuntimeException("Sách không tồn tại"));
        if (Boolean.TRUE.equals(sach.getDaXoa())) {
            throw new RuntimeException("Sách không tồn tại");
        }

        if (gioHangRepository.findByMaNdAndMaSach(maNd, yeuCau.getMa_sach()).isPresent()) {
            return new GioHangResponse(false, "Sách đã có trong giỏ hàng", null);
        }

        GioHang gioHang = new GioHang();
        gioHang.setMaNd(maNd);
        gioHang.setMaSach(yeuCau.getMa_sach());
        gioHangRepository.save(gioHang);

        int soLuong = gioHangRepository.demSoLuong(maNd);
        return new GioHangResponse(true, "Thêm vào giỏ hàng thành công",
                new GioHangResponse.GioHangData(null, null, soLuong));
    }

    public GioHangResponse layGioHang(Long maNd) {
        List<GioHang> danhSachGio = gioHangRepository.findByMaNd(maNd);
        return xayDungGioHangResponse(danhSachGio);
    }

    @Transactional
    public GioHangResponse xoaKhoiGio(Long maNd, Long maSach) {
        GioHang gioHang = gioHangRepository.findByMaNdAndMaSach(maNd, maSach)
                .orElseThrow(() -> new RuntimeException("Sách không có trong giỏ hàng"));
        gioHangRepository.delete(gioHang);

        // Gọi trực tiếp repository thay vì layGioHang() để tránh self-invocation bypass cache
        List<GioHang> danhSachGio = gioHangRepository.findByMaNd(maNd);
        return xayDungGioHangResponse(danhSachGio);
    }

    public int laySoLuong(Long maNd) {
        return gioHangRepository.demSoLuong(maNd);
    }

    private GioHangResponse xayDungGioHangResponse(List<GioHang> danhSachGio) {
        // Batch load sách — 1 query thay vì N queries
        List<Long> danhSachMaSach = danhSachGio.stream()
                .map(GioHang::getMaSach)
                .collect(Collectors.toList());
        Map<Long, Sach> sachMap = sachRepository.findAllById(danhSachMaSach)
                .stream()
                .filter(s -> !Boolean.TRUE.equals(s.getDaXoa()))
                .collect(Collectors.toMap(Sach::getMaSach, s -> s));

        List<GioHangResponse.GioHangItem> danhSachItem = danhSachGio.stream()
                .map(item -> {
                    Sach sach = sachMap.get(item.getMaSach());
                    if (sach == null) return null;
                    return new GioHangResponse.GioHangItem(
                            sach.getMaSach(),
                            sach.getTenSach(),
                            sach.getTacGia(),
                            sach.getAnhBiaUrl(),
                            sach.getGia()
                    );
                })
                .filter(item -> item != null)
                .collect(Collectors.toList());

        BigDecimal tongTien = danhSachItem.stream()
                .map(GioHangResponse.GioHangItem::getDon_gia)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return new GioHangResponse(true, "Lấy giỏ hàng thành công",
                new GioHangResponse.GioHangData(danhSachItem, tongTien, danhSachItem.size()));
    }
}
