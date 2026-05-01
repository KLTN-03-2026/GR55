package com.backend.backend.service;

import com.backend.backend.dto.*;
import com.backend.backend.entity.Sach;
import com.backend.backend.entity.SachDanhMuc;
import com.backend.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SachChiTietService {

    private final SachRepository sachRepository;
    private final DanhGiaRepository danhGiaRepository;
    private final DonHangRepository donHangRepository;
    private final SachYeuThichRepository sachYeuThichRepository;
    private final LichSuHoiVienRepository lichSuHoiVienRepository;
    private final GoiHoiVienSachRepository goiHoiVienSachRepository;
    private final SachDanhMucRepository sachDanhMucRepository;
    private final DanhMucSachRepository danhMucSachRepository;
    private final TienDoDocSachRepository tienDoDocSachRepository;
    private final QuanLyGiamGiaService quanLyGiamGiaService;

    @Cacheable(value = "chi_tiet_sach", key = "#maSach + '_' + #maNd")
    public ChiTietSachResponse layChiTietSach(Long maSach, Long maNd) {
        Sach sach = sachRepository.findById(maSach)
                .orElseThrow(() -> new RuntimeException("Sách không tồn tại"));

        // Batch fetch: 1 query thay vì N queries (N+1 fix)
        List<SachDanhMuc> sachDanhMucs = sachDanhMucRepository.findByMaSach(maSach);
        List<Long> danhMucIds = sachDanhMucs.stream()
                .map(SachDanhMuc::getMaDm)
                .collect(Collectors.toList());
        Map<Long, String> tenDanhMucTheoId = danhMucSachRepository.findAllById(danhMucIds).stream()
                .collect(Collectors.toMap(
                        dm -> dm.getMaDm(),
                        dm -> dm.getTenDanhMuc()));
        List<ChiTietSachResponse.SachChiTietData.DanhMucData> danhSachDanhMuc = sachDanhMucs.stream()
                .filter(sdm -> tenDanhMucTheoId.containsKey(sdm.getMaDm()))
                .map(sdm -> new ChiTietSachResponse.SachChiTietData.DanhMucData(
                        sdm.getMaDm(), tenDanhMucTheoId.get(sdm.getMaDm())))
                .collect(Collectors.toList());

        Double diemTrungBinh = danhGiaRepository.tinhDiemTrungBinh(maSach);
        Integer soLuotDanhGia = danhGiaRepository.demSoLuotDanhGia(maSach);
        boolean sachThuocGoiHoiVien = goiHoiVienSachRepository.existsByMaSach(maSach);

        boolean daMua = false;
        boolean daYeuThich = false;
        boolean laHoiVien = false;
        boolean daBatDauDoc = false;

        if (maNd != null) {
            daMua = donHangRepository.countDaMuaSach(maNd, maSach) > 0;
            daYeuThich = sachYeuThichRepository.daYeuThich(maNd, maSach);
            laHoiVien = lichSuHoiVienRepository.isHoiVien(maNd, LocalDateTime.now());
            daBatDauDoc = tienDoDocSachRepository.findByMaNdAndMaSach(maNd, maSach).isPresent();
        }

        ChiTietSachResponse.SachChiTietData duLieu = new ChiTietSachResponse.SachChiTietData(
                sach.getMaSach(),
                sach.getTenSach(),
                sach.getTacGia(),
                sach.getMoTa(),
                sach.getGia(),
                quanLyGiamGiaService.tinhGiaDaGiam(maSach),
                diemTrungBinh != null ? diemTrungBinh : 0.0,
                soLuotDanhGia != null ? soLuotDanhGia : 0,
                sach.getAnhBiaUrl(),
                sach.getFilePdfUrl(),
                sach.getChoPhepDocThu(),
                sach.getSoTrangDocThu(),
                sach.getLuotXem(),
                sach.getSoLuongDaBan() != null ? sach.getSoLuongDaBan() : 0,
                danhSachDanhMuc,
                daMua,
                daYeuThich,
                laHoiVien,
                sachThuocGoiHoiVien,
                daBatDauDoc,
                sach.getNgayTao());

        return new ChiTietSachResponse(true, "Thành công", duLieu);
    }

    @Cacheable(value = "sach_lien_quan", key = "#maSach + '_' + #trang + '_' + #kichThuoc")
    public SachLienQuanResponse laySachLienQuan(Long maSach, int trang, int kichThuoc) {
        List<Long> danhSachMaDm = sachDanhMucRepository.findByMaSach(maSach).stream()
                .map(SachDanhMuc::getMaDm)
                .collect(Collectors.toList());

        if (danhSachMaDm.isEmpty()) {
            return new SachLienQuanResponse(Collections.emptyList(), trang, 0, 0);
        }

        Pageable pageable = PageRequest.of(trang - 1, kichThuoc);
        Page<Sach> page = sachRepository.findSachCungTheLoai(maSach, danhSachMaDm, pageable);

        List<SachLienQuanResponse.SachLienQuanData> danhSach = page.getContent().stream()
                .map(s -> {
                    GiamGiaInfo info = quanLyGiamGiaService.layGiamGiaInfo(s.getMaSach());
                    return new SachLienQuanResponse.SachLienQuanData(
                            s.getMaSach(),
                            s.getTenSach(),
                            s.getTacGia(),
                            s.getGia(),
                            s.getAnhBiaUrl(),
                            s.getDanhGiaTrungBinh() != null ? s.getDanhGiaTrungBinh().doubleValue() : 0.0,
                            s.getLuotXem(),
                            s.getSoLuongDaBan() != null ? s.getSoLuongDaBan() : 0,
                            info != null ? info.getGia_sau_giam() : null,
                            info != null ? info.getNhan_giam() : null);
                })
                .collect(Collectors.toList());

        return new SachLienQuanResponse(
                danhSach,
                page.getNumber() + 1,
                page.getTotalPages(),
                page.getTotalElements());
    }

    @Transactional
    public void tangLuotXem(Long maSach) {
        sachRepository.tangLuotXem(maSach);
    }
}
