package com.backend.backend.service;

import com.backend.backend.dto.ChuongTrinhGiamGiaRequest;
import com.backend.backend.dto.ChuongTrinhGiamGiaResponse;
import com.backend.backend.dto.DanhSachChuongTrinhResponse;
import com.backend.backend.dto.SachResponse;
import com.backend.backend.entity.ChuongTrinhGiamGia;
import com.backend.backend.entity.ChuongTrinhGiamGiaSach;
import com.backend.backend.entity.Sach;
import com.backend.backend.repository.ChuongTrinhGiamGiaRepository;
import com.backend.backend.repository.ChuongTrinhGiamGiaSachRepository;
import com.backend.backend.repository.SachDanhMucRepository;
import com.backend.backend.repository.SachRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuanLyGiamGiaService {

    private final ChuongTrinhGiamGiaRepository chuongTrinhGiamGiaRepository;
    private final ChuongTrinhGiamGiaSachRepository chuongTrinhGiamGiaSachRepository;
    private final SachRepository sachRepository;
    private final SachDanhMucRepository sachDanhMucRepository;

    @Cacheable(value = "chuong_trinh_giam_gia",
               key = "#ten + '_' + #hoatDong + '_' + #tuNgay + '_' + #denNgay + '_' + #trang + '_' + #kichThuoc")
    public DanhSachChuongTrinhResponse layDanhSachChuongTrinh(String ten, Boolean hoatDong,
                                                               String tuNgay, String denNgay,
                                                               int trang, int kichThuoc) {
        LocalDateTime startDate = null;
        LocalDateTime endDate = null;
        if (tuNgay != null && !tuNgay.isBlank()) startDate = LocalDateTime.parse(tuNgay + "T00:00:00");
        if (denNgay != null && !denNgay.isBlank()) endDate = LocalDateTime.parse(denNgay + "T23:59:59");

        Pageable pageable = PageRequest.of(trang - 1, kichThuoc);
        Page<ChuongTrinhGiamGia> page = chuongTrinhGiamGiaRepository.findChuongTrinhForAdmin(
                (ten != null && !ten.isBlank()) ? ten : null,
                hoatDong, startDate, endDate, pageable);

        List<DanhSachChuongTrinhResponse.ChuongTrinhItem> danhSach = page.getContent().stream()
                .map(ct -> new DanhSachChuongTrinhResponse.ChuongTrinhItem(
                        ct.getMaCt(),
                        ct.getTenChuongTrinh(),
                        ct.getNgayBatDau(),
                        ct.getNgayKetThuc(),
                        ct.getLoaiGiam(),
                        ct.getGiaTriGiam(),
                        ct.getHoatDong(),
                        (int) chuongTrinhGiamGiaSachRepository.countByMaCt(ct.getMaCt())
                ))
                .collect(Collectors.toList());

        return new DanhSachChuongTrinhResponse(
                true, "Lấy danh sách chương trình giảm giá thành công",
                danhSach, page.getNumber() + 1, page.getTotalPages(), page.getTotalElements());
    }

    public List<SachResponse.DuLieuSach> laySachTheoTieuChi(String loai, List<Long> danhMucIds, Integer soLuong) {
        List<Long> sachIds = new ArrayList<>();
        int limit = soLuong != null ? soLuong : 20;

        switch (loai) {
            case "danh_muc":
                if (danhMucIds != null && !danhMucIds.isEmpty())
                    sachIds = sachDanhMucRepository.findSachIdsByDanhMucIds(danhMucIds);
                break;
            case "sach_moi_nhat":
                sachIds = sachRepository.findSachMoiNhat(PageRequest.of(0, limit))
                        .getContent().stream().map(Sach::getMaSach).collect(Collectors.toList());
                break;
            case "sach_ban_chay":
                sachIds = sachRepository.findSachBanChay(PageRequest.of(0, limit))
                        .getContent().stream().map(Sach::getMaSach).collect(Collectors.toList());
                break;
            case "tat_ca":
                sachIds = sachRepository.findAllActiveIds();
                break;
        }

        return sachRepository.findAllById(sachIds).stream()
                .filter(s -> !Boolean.TRUE.equals(s.getDaXoa()))
                .map(s -> new SachResponse.DuLieuSach(
                        s.getMaSach(), s.getTenSach(), s.getTacGia(), null,
                        s.getGia(), s.getAnhBiaUrl(), null, null, null,
                        s.getLuotXem(), s.getDanhGiaTrungBinh(), null, null, s.getNgayTao()))
                .collect(Collectors.toList());
    }

    @Caching(evict = {
        @CacheEvict(value = "chuong_trinh_giam_gia", allEntries = true),
        @CacheEvict(value = "gia_sach_da_giam", allEntries = true),
        @CacheEvict(value = "chi_tiet_sach", allEntries = true)
    })
    @Transactional
    public ChuongTrinhGiamGiaResponse themChuongTrinh(ChuongTrinhGiamGiaRequest request) {
        if (chuongTrinhGiamGiaRepository.findByTenChuongTrinh(request.getTen_chuong_trinh()).isPresent()) {
            return new ChuongTrinhGiamGiaResponse(false, "Tên chương trình đã tồn tại", null);
        }

        if (request.getNgay_bat_dau().isAfter(request.getNgay_ket_thuc())) {
            return new ChuongTrinhGiamGiaResponse(false, "Ngày kết thúc phải sau ngày bắt đầu", null);
        }

        if (request.getCach_chon_sach() == null) {
            return new ChuongTrinhGiamGiaResponse(false, "Cách chọn sách không được để trống", null);
        }

        List<Long> sachIds = laySachIdsTheoCachChon(request.getCach_chon_sach());
        if (sachIds.isEmpty()) {
            return new ChuongTrinhGiamGiaResponse(false, "Không có sách nào được chọn", null);
        }

        ChuongTrinhGiamGia chuongTrinh = new ChuongTrinhGiamGia();
        chuongTrinh.setTenChuongTrinh(request.getTen_chuong_trinh());
        chuongTrinh.setNgayBatDau(request.getNgay_bat_dau());
        chuongTrinh.setNgayKetThuc(request.getNgay_ket_thuc());
        chuongTrinh.setLoaiGiam(request.getLoai_giam());
        chuongTrinh.setGiaTriGiam(request.getGia_tri_giam());
        chuongTrinh.setHoatDong(true);

        ChuongTrinhGiamGia saved = chuongTrinhGiamGiaRepository.save(chuongTrinh);

        LocalDateTime now = LocalDateTime.now();
        List<ChuongTrinhGiamGiaSach> danhSachLienKet = sachIds.stream().map(maSach -> {
            ChuongTrinhGiamGiaSach ctSach = new ChuongTrinhGiamGiaSach();
            ctSach.setMaCt(saved.getMaCt());
            ctSach.setMaSach(maSach);
            ctSach.setNgayTao(now);
            return ctSach;
        }).collect(Collectors.toList());
        chuongTrinhGiamGiaSachRepository.saveAll(danhSachLienKet);

        ChuongTrinhGiamGiaResponse.ChuongTrinhData data = new ChuongTrinhGiamGiaResponse.ChuongTrinhData(
                saved.getMaCt(), saved.getTenChuongTrinh(),
                saved.getNgayBatDau(), saved.getNgayKetThuc(),
                saved.getLoaiGiam(), saved.getGiaTriGiam(),
                saved.getHoatDong(), sachIds.size(), sachIds);

        return new ChuongTrinhGiamGiaResponse(true, "Thêm chương trình giảm giá thành công", data);
    }

    @Caching(evict = {
        @CacheEvict(value = "chuong_trinh_giam_gia", allEntries = true),
        @CacheEvict(value = "gia_sach_da_giam", allEntries = true),
        @CacheEvict(value = "chi_tiet_sach", allEntries = true)
    })
    @Transactional
    public ChuongTrinhGiamGiaResponse capNhatTrangThai(Long maCt, Boolean hoatDong) {
        ChuongTrinhGiamGia chuongTrinh = chuongTrinhGiamGiaRepository.findById(maCt)
                .orElseThrow(() -> new RuntimeException("Chương trình không tồn tại"));

        chuongTrinh.setHoatDong(hoatDong);
        chuongTrinhGiamGiaRepository.save(chuongTrinh);

        return new ChuongTrinhGiamGiaResponse(true,
                hoatDong ? "Kích hoạt chương trình thành công" : "Vô hiệu hóa chương trình thành công", null);
    }

    @Caching(evict = {
        @CacheEvict(value = "chuong_trinh_giam_gia", allEntries = true),
        @CacheEvict(value = "gia_sach_da_giam", allEntries = true),
        @CacheEvict(value = "chi_tiet_sach", allEntries = true)
    })
    @Transactional
    public ChuongTrinhGiamGiaResponse xoaChuongTrinh(Long maCt) {
        ChuongTrinhGiamGia chuongTrinh = chuongTrinhGiamGiaRepository.findById(maCt)
                .orElseThrow(() -> new RuntimeException("Chương trình không tồn tại"));

        if (Boolean.TRUE.equals(chuongTrinh.getHoatDong())
                && chuongTrinh.getNgayKetThuc().isAfter(LocalDateTime.now())) {
            return new ChuongTrinhGiamGiaResponse(false, "Không thể xóa chương trình đang hoạt động", null);
        }

        chuongTrinhGiamGiaSachRepository.deleteByMaCt(maCt);
        chuongTrinhGiamGiaRepository.delete(chuongTrinh);

        return new ChuongTrinhGiamGiaResponse(true, "Xóa chương trình giảm giá thành công", null);
    }

    @Cacheable(value = "gia_sach_da_giam", key = "#maSach")
    public BigDecimal tinhGiaDaGiam(Long maSach) {
        Sach sach = sachRepository.findById(maSach).orElse(null);
        if (sach == null) return null;

        List<Long> maCtIds = chuongTrinhGiamGiaSachRepository.findMaCtsByMaSach(maSach);
        if (maCtIds.isEmpty()) return null;

        BigDecimal giaGiam = null;
        double tienGiamCaoNhat = 0;
        LocalDateTime now = LocalDateTime.now();

        List<ChuongTrinhGiamGia> danhSachCt = chuongTrinhGiamGiaRepository.findAllById(maCtIds);
        for (ChuongTrinhGiamGia ct : danhSachCt) {
            if (!Boolean.TRUE.equals(ct.getHoatDong())
                    || ct.getNgayBatDau().isAfter(now) || ct.getNgayKetThuc().isBefore(now)) continue;

            double tienGiamThucTe = "phan_tram".equals(ct.getLoaiGiam())
                    ? sach.getGia().doubleValue() * ct.getGiaTriGiam().doubleValue() / 100
                    : ct.getGiaTriGiam().doubleValue();

            if (tienGiamThucTe > tienGiamCaoNhat) {
                tienGiamCaoNhat = tienGiamThucTe;
                if ("phan_tram".equals(ct.getLoaiGiam())) {
                    giaGiam = sach.getGia().multiply(BigDecimal.valueOf(1 - ct.getGiaTriGiam().doubleValue() / 100));
                } else {
                    giaGiam = sach.getGia().subtract(ct.getGiaTriGiam());
                    if (giaGiam.compareTo(BigDecimal.ZERO) < 0) giaGiam = BigDecimal.ZERO;
                }
            }
        }

        return giaGiam;
    }

    private List<Long> laySachIdsTheoCachChon(ChuongTrinhGiamGiaRequest.CachChonSach cachChon) {
        int limit = cachChon.getSo_luong() != null ? cachChon.getSo_luong() : 20;
        switch (cachChon.getLoai()) {
            case "danh_sach":
                return cachChon.getDanh_sach_sach() != null ? cachChon.getDanh_sach_sach() : new ArrayList<>();
            case "danh_muc":
                return cachChon.getDanh_sach_danh_muc() != null
                        ? sachDanhMucRepository.findSachIdsByDanhMucIds(cachChon.getDanh_sach_danh_muc())
                        : new ArrayList<>();
            case "sach_moi_nhat":
                return sachRepository.findSachMoiNhat(PageRequest.of(0, limit))
                        .getContent().stream().map(Sach::getMaSach).collect(Collectors.toList());
            case "sach_ban_chay":
                return sachRepository.findSachBanChay(PageRequest.of(0, limit))
                        .getContent().stream().map(Sach::getMaSach).collect(Collectors.toList());
            case "tat_ca":
                return sachRepository.findAllActiveIds();
            default:
                return new ArrayList<>();
        }
    }
}
