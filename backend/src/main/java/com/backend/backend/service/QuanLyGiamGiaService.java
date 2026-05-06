package com.backend.backend.service;

import com.backend.backend.dto.*;
import com.backend.backend.entity.ChuongTrinhGiamGia;
import com.backend.backend.entity.ChuongTrinhGiamGiaSach;
import com.backend.backend.entity.Sach;
import com.backend.backend.repository.ChuongTrinhGiamGiaRepository;
import com.backend.backend.repository.ChuongTrinhGiamGiaSachRepository;
import com.backend.backend.repository.GoiHoiVienSachRepository;
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
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuanLyGiamGiaService {

    private final ChuongTrinhGiamGiaRepository chuongTrinhGiamGiaRepository;
    private final ChuongTrinhGiamGiaSachRepository chuongTrinhGiamGiaSachRepository;
    private final GoiHoiVienSachRepository goiHoiVienSachRepository;
    private final SachRepository sachRepository;

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
                        ct.getMaCt(), ct.getTenChuongTrinh(), ct.getNgayBatDau(), ct.getNgayKetThuc(),
                        ct.getLoaiGiam(), ct.getGiaTriGiam(), ct.getHoatDong(),
                        (int) chuongTrinhGiamGiaSachRepository.countByMaCt(ct.getMaCt())))
                .collect(Collectors.toList());

        return new DanhSachChuongTrinhResponse(true, "Lấy danh sách chương trình giảm giá thành công",
                danhSach, page.getNumber() + 1, page.getTotalPages(), page.getTotalElements());
    }

    public ChiTietChuongTrinhResponse layChiTietChuongTrinh(Long maCt) {
        ChuongTrinhGiamGia ct = chuongTrinhGiamGiaRepository.findById(maCt)
                .orElseThrow(() -> new RuntimeException("Chương trình không tồn tại"));

        List<Long> sachIds = chuongTrinhGiamGiaSachRepository.findSachIdsByMaCt(maCt);
        List<Sach> sachList = sachRepository.findAllById(sachIds);

        List<ChiTietChuongTrinhResponse.SachTrongCt> sachItems = sachList.stream()
                .map(sach -> new ChiTietChuongTrinhResponse.SachTrongCt(
                        sach.getMaSach(), sach.getTenSach(), sach.getTacGia(), sach.getAnhBiaUrl(),
                        sach.getGia(), tinhGiaSauGiam(sach.getGia(), ct)))
                .collect(Collectors.toList());

        return new ChiTietChuongTrinhResponse(true, "Lấy chi tiết chương trình thành công",
                new ChiTietChuongTrinhResponse.ChiTietData(
                        ct.getMaCt(), ct.getTenChuongTrinh(), ct.getNgayBatDau(), ct.getNgayKetThuc(),
                        ct.getLoaiGiam(), ct.getGiaTriGiam(), ct.getHoatDong(),
                        sachItems.size(), sachItems));
    }

    @Caching(evict = {
        @CacheEvict(value = "chuong_trinh_giam_gia", allEntries = true),
        @CacheEvict(value = "gia_sach_da_giam", allEntries = true),
        @CacheEvict(value = "chi_tiet_sach", allEntries = true),
        @CacheEvict(value = "giam_gia_home", allEntries = true),
        @CacheEvict(value = "giam_gia_info_sach", allEntries = true)
    })
    @Transactional
    public ChuongTrinhGiamGiaResponse themChuongTrinh(ChuongTrinhGiamGiaRequest request) {
        String loi = kiemTraRequest(request, null);
        if (loi != null) return new ChuongTrinhGiamGiaResponse(false, loi, null);

        ChuongTrinhGiamGia ct = new ChuongTrinhGiamGia();
        ct.setTenChuongTrinh(request.getTen_chuong_trinh());
        ct.setNgayBatDau(request.getNgay_bat_dau());
        ct.setNgayKetThuc(request.getNgay_ket_thuc());
        ct.setLoaiGiam(request.getLoai_giam());
        ct.setGiaTriGiam(request.getGia_tri_giam());
        ct.setHoatDong(false);

        ChuongTrinhGiamGia saved = chuongTrinhGiamGiaRepository.save(ct);

        return new ChuongTrinhGiamGiaResponse(true, "Tạo chương trình giảm giá thành công",
                new ChuongTrinhGiamGiaResponse.ChuongTrinhData(
                        saved.getMaCt(), saved.getTenChuongTrinh(), saved.getNgayBatDau(),
                        saved.getNgayKetThuc(), saved.getLoaiGiam(), saved.getGiaTriGiam(),
                        saved.getHoatDong(), 0, Collections.emptyList()));
    }

    @Caching(evict = {
        @CacheEvict(value = "chuong_trinh_giam_gia", allEntries = true),
        @CacheEvict(value = "gia_sach_da_giam", allEntries = true),
        @CacheEvict(value = "chi_tiet_sach", allEntries = true),
        @CacheEvict(value = "giam_gia_home", allEntries = true),
        @CacheEvict(value = "giam_gia_info_sach", allEntries = true)
    })
    @Transactional
    public ChuongTrinhGiamGiaResponse capNhatChuongTrinh(Long maCt, ChuongTrinhGiamGiaRequest request) {
        ChuongTrinhGiamGia ct = chuongTrinhGiamGiaRepository.findById(maCt)
                .orElseThrow(() -> new RuntimeException("Chương trình không tồn tại"));

        String loi = kiemTraRequest(request, maCt);
        if (loi != null) return new ChuongTrinhGiamGiaResponse(false, loi, null);

        ct.setTenChuongTrinh(request.getTen_chuong_trinh());
        ct.setNgayBatDau(request.getNgay_bat_dau());
        ct.setNgayKetThuc(request.getNgay_ket_thuc());
        ct.setLoaiGiam(request.getLoai_giam());
        ct.setGiaTriGiam(request.getGia_tri_giam());
        chuongTrinhGiamGiaRepository.save(ct);

        return new ChuongTrinhGiamGiaResponse(true, "Cập nhật chương trình thành công", null);
    }

    public TimKiemSachGiamGiaResponse timKiemSachDeThem(String tuKhoa, Long maCt,
                                                          Long maDanhMuc, BigDecimal giaMin, BigDecimal giaMax,
                                                          int trang, int kichThuoc) {
        String kw = (tuKhoa != null && !tuKhoa.isBlank()) ? tuKhoa.trim() : null;
        Pageable pageable = PageRequest.of(trang - 1, kichThuoc);
        Page<Sach> page = sachRepository.timKiemSachCoPhiChoGiamGia(kw, maDanhMuc, giaMin, giaMax, pageable);

        Set<Long> sachIdsInCt = maCt != null
                ? new HashSet<>(chuongTrinhGiamGiaSachRepository.findSachIdsByMaCt(maCt))
                : Collections.emptySet();

        List<TimKiemSachGiamGiaResponse.SachItem> items = page.getContent().stream()
                .map(s -> new TimKiemSachGiamGiaResponse.SachItem(
                        s.getMaSach(), s.getTenSach(), s.getTacGia(), s.getAnhBiaUrl(),
                        s.getGia(), sachIdsInCt.contains(s.getMaSach())))
                .collect(Collectors.toList());

        return new TimKiemSachGiamGiaResponse(true, "Tìm kiếm thành công",
                items, trang, page.getTotalPages(), page.getTotalElements());
    }

    @Caching(evict = {
        @CacheEvict(value = "chuong_trinh_giam_gia", allEntries = true),
        @CacheEvict(value = "gia_sach_da_giam", allEntries = true),
        @CacheEvict(value = "chi_tiet_sach", allEntries = true),
        @CacheEvict(value = "giam_gia_home", allEntries = true),
        @CacheEvict(value = "giam_gia_info_sach", allEntries = true)
    })
    @Transactional
    public ChuongTrinhGiamGiaResponse themSachVaoChuongTrinh(Long maCt, List<Long> sachIds) {
        if (!chuongTrinhGiamGiaRepository.existsById(maCt))
            return new ChuongTrinhGiamGiaResponse(false, "Chương trình không tồn tại", null);
        if (sachIds == null || sachIds.isEmpty())
            return new ChuongTrinhGiamGiaResponse(false, "Danh sách sách không được rỗng", null);

        Set<Long> existing = new HashSet<>(chuongTrinhGiamGiaSachRepository.findSachIdsByMaCt(maCt));

        // Sách đang thuộc gói hội viên không được thêm vào chương trình giảm giá
        Set<Long> sachTrongGoi = new HashSet<>(goiHoiVienSachRepository.findSachIdsTrongBatKyGoi(sachIds));

        List<Long> newIds = sachIds.stream()
                .filter(id -> !existing.contains(id) && !sachTrongGoi.contains(id))
                .collect(Collectors.toList());

        int boQuaGoi = (int) sachIds.stream().filter(id -> !existing.contains(id) && sachTrongGoi.contains(id)).count();
        int boQuaDa = (int) sachIds.stream().filter(existing::contains).count();

        if (newIds.isEmpty()) {
            String msg = boQuaGoi > 0
                    ? "Không thể thêm: " + boQuaGoi + " sách đang thuộc gói hội viên"
                    : "Tất cả sách đã có trong chương trình";
            return new ChuongTrinhGiamGiaResponse(false, msg, null);
        }

        LocalDateTime now = LocalDateTime.now();
        List<ChuongTrinhGiamGiaSach> links = newIds.stream().map(maSach -> {
            ChuongTrinhGiamGiaSach link = new ChuongTrinhGiamGiaSach();
            link.setMaCt(maCt);
            link.setMaSach(maSach);
            link.setNgayTao(now);
            return link;
        }).collect(Collectors.toList());
        chuongTrinhGiamGiaSachRepository.saveAll(links);

        StringBuilder msg = new StringBuilder("Đã thêm " + newIds.size() + " sách");
        if (boQuaGoi > 0) msg.append(", bỏ qua ").append(boQuaGoi).append(" sách đang trong gói hội viên");
        if (boQuaDa > 0) msg.append(", bỏ qua ").append(boQuaDa).append(" sách đã có trong chương trình");
        return new ChuongTrinhGiamGiaResponse(true, msg.toString(), null);
    }

    @Caching(evict = {
        @CacheEvict(value = "chuong_trinh_giam_gia", allEntries = true),
        @CacheEvict(value = "gia_sach_da_giam", allEntries = true),
        @CacheEvict(value = "chi_tiet_sach", allEntries = true),
        @CacheEvict(value = "giam_gia_home", allEntries = true),
        @CacheEvict(value = "giam_gia_info_sach", allEntries = true)
    })
    @Transactional
    public ChuongTrinhGiamGiaResponse xoaSachKhoiChuongTrinh(Long maCt, Long maSach) {
        if (!chuongTrinhGiamGiaRepository.existsById(maCt))
            return new ChuongTrinhGiamGiaResponse(false, "Chương trình không tồn tại", null);

        chuongTrinhGiamGiaSachRepository.deleteByMaCtAndMaSach(maCt, maSach);
        return new ChuongTrinhGiamGiaResponse(true, "Đã xóa sách khỏi chương trình", null);
    }

    @Caching(evict = {
        @CacheEvict(value = "chuong_trinh_giam_gia", allEntries = true),
        @CacheEvict(value = "gia_sach_da_giam", allEntries = true),
        @CacheEvict(value = "chi_tiet_sach", allEntries = true),
        @CacheEvict(value = "giam_gia_home", allEntries = true),
        @CacheEvict(value = "giam_gia_info_sach", allEntries = true)
    })
    @Transactional
    public ChuongTrinhGiamGiaResponse capNhatTrangThai(Long maCt, Boolean hoatDong) {
        ChuongTrinhGiamGia ct = chuongTrinhGiamGiaRepository.findById(maCt)
                .orElseThrow(() -> new RuntimeException("Chương trình không tồn tại"));
        ct.setHoatDong(hoatDong);
        chuongTrinhGiamGiaRepository.save(ct);
        return new ChuongTrinhGiamGiaResponse(true,
                hoatDong ? "Kích hoạt chương trình thành công" : "Vô hiệu hóa chương trình thành công", null);
    }

    @Caching(evict = {
        @CacheEvict(value = "chuong_trinh_giam_gia", allEntries = true),
        @CacheEvict(value = "gia_sach_da_giam", allEntries = true),
        @CacheEvict(value = "chi_tiet_sach", allEntries = true),
        @CacheEvict(value = "giam_gia_home", allEntries = true),
        @CacheEvict(value = "giam_gia_info_sach", allEntries = true)
    })
    @Transactional
    public ChuongTrinhGiamGiaResponse xoaChuongTrinh(Long maCt) {
        ChuongTrinhGiamGia ct = chuongTrinhGiamGiaRepository.findById(maCt)
                .orElseThrow(() -> new RuntimeException("Chương trình không tồn tại"));

        if (Boolean.TRUE.equals(ct.getHoatDong()) && ct.getNgayKetThuc().isAfter(LocalDateTime.now()))
            return new ChuongTrinhGiamGiaResponse(false, "Không thể xóa chương trình đang hoạt động", null);

        chuongTrinhGiamGiaSachRepository.deleteByMaCt(maCt);
        chuongTrinhGiamGiaRepository.delete(ct);
        return new ChuongTrinhGiamGiaResponse(true, "Xóa chương trình giảm giá thành công", null);
    }

    @Cacheable(value = "gia_sach_da_giam", key = "#maSach", unless = "#result == null")
    public BigDecimal tinhGiaDaGiam(Long maSach) {
        Sach sach = sachRepository.findById(maSach).orElse(null);
        if (sach == null) return null;

        List<Long> maCtIds = chuongTrinhGiamGiaSachRepository.findMaCtsByMaSach(maSach);
        if (maCtIds.isEmpty()) return null;

        BigDecimal giaGiam = null;
        double tienGiamCaoNhat = 0;
        LocalDateTime now = LocalDateTime.now();

        for (ChuongTrinhGiamGia ct : chuongTrinhGiamGiaRepository.findAllById(maCtIds)) {
            if (!Boolean.TRUE.equals(ct.getHoatDong())
                    || ct.getNgayBatDau().isAfter(now) || ct.getNgayKetThuc().isBefore(now)) continue;

            double tienGiamThucTe = "phan_tram".equals(ct.getLoaiGiam())
                    ? sach.getGia().doubleValue() * ct.getGiaTriGiam().doubleValue() / 100
                    : ct.getGiaTriGiam().doubleValue();

            if (tienGiamThucTe > tienGiamCaoNhat) {
                tienGiamCaoNhat = tienGiamThucTe;
                giaGiam = tinhGiaSauGiam(sach.getGia(), ct);
            }
        }
        return giaGiam;
    }

    @Cacheable(value = "giam_gia_info_sach", key = "#maSach", unless = "#result == null")
    public GiamGiaInfo layGiamGiaInfo(Long maSach) {
        Sach sach = sachRepository.findById(maSach).orElse(null);
        if (sach == null) return null;

        List<Long> maCtIds = chuongTrinhGiamGiaSachRepository.findMaCtsByMaSach(maSach);
        if (maCtIds.isEmpty()) return null;

        GiamGiaInfo best = null;
        double tienGiamCaoNhat = 0;
        LocalDateTime now = LocalDateTime.now();

        for (ChuongTrinhGiamGia ct : chuongTrinhGiamGiaRepository.findAllById(maCtIds)) {
            if (!Boolean.TRUE.equals(ct.getHoatDong())
                    || ct.getNgayBatDau().isAfter(now) || ct.getNgayKetThuc().isBefore(now)) continue;

            double tienGiam = "phan_tram".equals(ct.getLoaiGiam())
                    ? sach.getGia().doubleValue() * ct.getGiaTriGiam().doubleValue() / 100
                    : ct.getGiaTriGiam().doubleValue();

            if (tienGiam > tienGiamCaoNhat) {
                tienGiamCaoNhat = tienGiam;
                best = new GiamGiaInfo(tinhGiaSauGiam(sach.getGia(), ct), taoNhanGiam(ct));
            }
        }
        return best;
    }

    private String taoNhanGiam(ChuongTrinhGiamGia ct) {
        if ("phan_tram".equals(ct.getLoaiGiam())) {
            return "-" + ct.getGiaTriGiam().stripTrailingZeros().toPlainString() + "%";
        }
        return "-" + java.text.NumberFormat.getNumberInstance(java.util.Locale.forLanguageTag("vi-VN"))
                                           .format(ct.getGiaTriGiam().longValue()) + "đ";
    }

    private String kiemTraRequest(ChuongTrinhGiamGiaRequest req, Long maCtHienTai) {
        if (!List.of("phan_tram", "tien_co_dinh").contains(req.getLoai_giam()))
            return "Loại giảm không hợp lệ (phan_tram hoặc tien_co_dinh)";

        if ("phan_tram".equals(req.getLoai_giam())) {
            BigDecimal val = req.getGia_tri_giam();
            if (val.compareTo(BigDecimal.ONE) < 0 || val.compareTo(BigDecimal.valueOf(99)) > 0)
                return "Phần trăm giảm phải từ 1 đến 99";
        }

        if (req.getNgay_bat_dau().isAfter(req.getNgay_ket_thuc()))
            return "Ngày kết thúc phải sau ngày bắt đầu";

        Optional<ChuongTrinhGiamGia> existing = chuongTrinhGiamGiaRepository.findByTenChuongTrinh(req.getTen_chuong_trinh());
        if (existing.isPresent() && !existing.get().getMaCt().equals(maCtHienTai))
            return "Tên chương trình đã tồn tại";

        return null;
    }

    private BigDecimal tinhGiaSauGiam(BigDecimal gia, ChuongTrinhGiamGia ct) {
        if ("phan_tram".equals(ct.getLoaiGiam())) {
            return gia.multiply(BigDecimal.valueOf(1 - ct.getGiaTriGiam().doubleValue() / 100));
        }
        BigDecimal result = gia.subtract(ct.getGiaTriGiam());
        return result.compareTo(BigDecimal.ZERO) < 0 ? BigDecimal.ZERO : result;
    }
}
