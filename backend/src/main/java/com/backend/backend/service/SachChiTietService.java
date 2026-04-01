package com.backend.backend.service;

import com.backend.backend.dto.*;
import com.backend.backend.entity.DanhGia;
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
    private final NguoiDungRepository nguoiDungRepository;

    @Cacheable(value = "chi_tiet_sach", key = "#maSach + '_' + #maNd")
    public ChiTietSachResponse layChiTietSach(Long maSach, Long maNd) {
        Sach sach = sachRepository.findById(maSach)
                .orElseThrow(() -> new RuntimeException("Sách không tồn tại"));

        List<Long> danhSachMaDm = sachDanhMucRepository.findByMaSach(maSach).stream()
                .map(SachDanhMuc::getMaDm)
                .collect(Collectors.toList());

        List<String> tenDanhMuc = danhSachMaDm.stream()
                .map(maDm -> danhMucSachRepository.findById(maDm)
                        .map(dm -> dm.getTenDanhMuc())
                        .orElse(""))
                .filter(ten -> !ten.isEmpty())
                .collect(Collectors.toList());

        Double diemTrungBinh = danhGiaRepository.tinhDiemTrungBinh(maSach);
        Integer soLuotDanhGia = danhGiaRepository.demSoLuotDanhGia(maSach);
        boolean sachThuocGoiHoiVien = goiHoiVienSachRepository.isSachHoiVien(maSach);

        boolean daMua = false;
        boolean daYeuThich = false;
        boolean laHoiVien = false;

        if (maNd != null) {
            daMua = donHangRepository.daMuaSach(maNd, maSach);
            daYeuThich = sachYeuThichRepository.daYeuThich(maNd, maSach);
            laHoiVien = lichSuHoiVienRepository.isHoiVien(maNd, LocalDateTime.now());
        }

        ChiTietSachResponse.SachChiTietData duLieu = new ChiTietSachResponse.SachChiTietData(
                sach.getMaSach(),
                sach.getTenSach(),
                sach.getTacGia(),
                sach.getMoTa(),
                sach.getGia(),
                null, // TODO: tính giá giảm từ bảng chuong_trinh_giam_gia
                diemTrungBinh != null ? diemTrungBinh : 0.0,
                soLuotDanhGia != null ? soLuotDanhGia : 0,
                sach.getAnhBiaUrl(),
                sach.getFilePdfUrl(),
                sach.getChoPhepDocThu(),
                sach.getSoTrangDocThu(),
                sach.getLuotXem(),
                tenDanhMuc,
                daMua,
                daYeuThich,
                laHoiVien,
                sachThuocGoiHoiVien,
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
                .map(s -> new SachLienQuanResponse.SachLienQuanData(
                        s.getMaSach(),
                        s.getTenSach(),
                        s.getTacGia(),
                        s.getGia(),
                        s.getAnhBiaUrl(),
                        s.getDanhGiaTrungBinh() != null ? s.getDanhGiaTrungBinh().doubleValue() : 0.0))
                .collect(Collectors.toList());

        return new SachLienQuanResponse(
                danhSach,
                page.getNumber() + 1,
                page.getTotalPages(),
                page.getTotalElements());
    }

    public DanhSachDanhGiaResponse layDanhSachDanhGia(Long maSach, int trang, int kichThuoc) {
        Pageable pageable = PageRequest.of(trang - 1, kichThuoc);
        Page<DanhGia> page = danhGiaRepository.findDanhGiaBySach(maSach, pageable);

        List<DanhSachDanhGiaResponse.DanhGiaData> danhSach = page.getContent().stream()
                .map(dg -> {
                    String tenNguoiDung = nguoiDungRepository.findById(dg.getMaNd())
                            .map(nd -> nd.getHoTen())
                            .orElse("Ẩn danh");
                    return new DanhSachDanhGiaResponse.DanhGiaData(
                            dg.getMaDg(),
                            dg.getMaNd(),
                            tenNguoiDung,
                            dg.getSoSao(),
                            dg.getNoiDung(),
                            dg.getNgayTao());
                })
                .collect(Collectors.toList());

        return new DanhSachDanhGiaResponse(
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
