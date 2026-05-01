package com.backend.backend.service;

import com.backend.backend.dto.ChiTietDonHangResponse;
import com.backend.backend.dto.DonHangResponse;
import com.backend.backend.dto.KiemTraTaiThanhToanResponse;
import com.backend.backend.dto.TaoDonHangResponse;
import com.backend.backend.entity.ChiTietDonHang;
import com.backend.backend.entity.DonHang;
import com.backend.backend.repository.ChiTietDonHangRepository;
import com.backend.backend.repository.DonHangRepository;
import com.backend.backend.repository.TienDoDocSachRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LichSuDonHangService {

    private final DonHangRepository donHangRepository;
    private final ChiTietDonHangRepository chiTietDonHangRepository;
    private final TienDoDocSachRepository tienDoDocSachRepository;
    private final VnpayService vnpayService;

    @Cacheable(value = "lich_su_don_hang", key = "#maNd + '_' + #trangThai + '_' + #tuNgay + '_' + #denNgay + '_' + #trang + '_' + #kichThuoc")
    public DonHangResponse layDanhSachDonHang(Long maNd, String trangThai, String tuNgay, String denNgay, int trang, int kichThuoc) {
        LocalDateTime startDate = null;
        LocalDateTime endDate = null;

        if (tuNgay != null && !tuNgay.isBlank()) {
            startDate = LocalDateTime.parse(tuNgay + "T00:00:00");
        }
        if (denNgay != null && !denNgay.isBlank()) {
            endDate = LocalDateTime.parse(denNgay + "T23:59:59");
        }

        Page<DonHang> page = donHangRepository.findDonHangByMaNd(
                maNd,
                (trangThai != null && !trangThai.isBlank()) ? trangThai : null,
                startDate,
                endDate,
                PageRequest.of(trang - 1, kichThuoc)
        );

        List<DonHangResponse.DonHangData> danhSach = page.getContent().stream()
                .map(dh -> new DonHangResponse.DonHangData(
                        dh.getIdDh(),
                        dh.getMaDonHang(),
                        dh.getNgayTao(),
                        dh.getTongTien(),
                        dh.getTrangThai(),
                        dh.getPhuongThucThanhToan()
                ))
                .collect(Collectors.toList());

        return new DonHangResponse(
                true,
                "Lấy danh sách đơn hàng thành công",
                danhSach,
                page.getNumber() + 1,
                page.getTotalPages(),
                page.getTotalElements()
        );
    }

    @Cacheable(value = "chi_tiet_don_hang", key = "#maNd + '_' + #idDh")
    public ChiTietDonHangResponse layChiTietDonHang(Long maNd, Long idDh) {
        DonHang donHang = donHangRepository.findById(idDh)
                .orElseThrow(() -> new RuntimeException("Đơn hàng không tồn tại"));

        if (!donHang.getMaNd().equals(maNd)) {
            throw new RuntimeException("Bạn không có quyền xem đơn hàng này");
        }

        List<ChiTietDonHang> chiTietList = chiTietDonHangRepository.findByIdDhOrderByMaCtdhAsc(idDh);

        List<ChiTietDonHangResponse.SachTrongDon> danhSachSach = chiTietList.stream()
                .map(ct -> new ChiTietDonHangResponse.SachTrongDon(
                        ct.getMaSach(),
                        ct.getTenSach(),
                        ct.getTacGia(),
                        ct.getAnhBiaUrl(),
                        ct.getDonGia()
                ))
                .collect(Collectors.toList());

        ChiTietDonHangResponse.ThongTinKhachHang khachHang = new ChiTietDonHangResponse.ThongTinKhachHang(
                donHang.getHoTen(),
                donHang.getEmail(),
                donHang.getSoDienThoai()
        );

        ChiTietDonHangResponse.ChiTietData data = new ChiTietDonHangResponse.ChiTietData(
                donHang.getIdDh(),
                donHang.getMaDonHang(),
                donHang.getNgayTao(),
                donHang.getTongTien(),
                donHang.getTrangThai(),
                donHang.getPhuongThucThanhToan(),
                khachHang,
                danhSachSach
        );

        return new ChiTietDonHangResponse(true, "Lấy chi tiết đơn hàng thành công", data);
    }

    public KiemTraTaiThanhToanResponse kiemTraTaiThanhToan(Long maNd, Long idDh) {
        DonHang donHang = donHangRepository.findById(idDh)
                .orElseThrow(() -> new RuntimeException("Đơn hàng không tồn tại"));

        if (!donHang.getMaNd().equals(maNd))
            throw new RuntimeException("Không có quyền truy cập đơn hàng này");

        if (!"cho_thanh_toan".equals(donHang.getTrangThai()))
            return new KiemTraTaiThanhToanResponse(false, "Đơn hàng không ở trạng thái chờ thanh toán", null);

        List<ChiTietDonHang> chiTietList = chiTietDonHangRepository.findByIdDhOrderByMaCtdhAsc(idDh);

        List<KiemTraTaiThanhToanResponse.SachItem> daSoHuu = new ArrayList<>();
        List<KiemTraTaiThanhToanResponse.SachItem> chuaSoHuu = new ArrayList<>();
        BigDecimal tongTienMoi = BigDecimal.ZERO;

        for (ChiTietDonHang ct : chiTietList) {
            KiemTraTaiThanhToanResponse.SachItem item = new KiemTraTaiThanhToanResponse.SachItem(
                    ct.getMaSach(), ct.getTenSach(), ct.getTacGia(), ct.getAnhBiaUrl(), ct.getDonGia());
            if (donHangRepository.daMuaSach(maNd, ct.getMaSach())) {
                daSoHuu.add(item);
            } else {
                chuaSoHuu.add(item);
                tongTienMoi = tongTienMoi.add(ct.getDonGia());
            }
        }

        return new KiemTraTaiThanhToanResponse(true, "Kiểm tra thành công",
                new KiemTraTaiThanhToanResponse.KiemTraData(idDh, daSoHuu, chuaSoHuu, tongTienMoi));
    }

    @Caching(evict = {
        @CacheEvict(value = "lich_su_don_hang", allEntries = true),
        @CacheEvict(value = "chi_tiet_don_hang", allEntries = true)
    })
    @Transactional
    public TaoDonHangResponse taiThanhToan(Long maNd, Long idDh) {
        DonHang donHangCu = donHangRepository.findById(idDh)
                .orElseThrow(() -> new RuntimeException("Đơn hàng không tồn tại"));

        if (!donHangCu.getMaNd().equals(maNd))
            throw new RuntimeException("Không có quyền truy cập đơn hàng này");

        if (!"cho_thanh_toan".equals(donHangCu.getTrangThai()))
            return new TaoDonHangResponse(false, "Đơn hàng không ở trạng thái chờ thanh toán", null);

        List<ChiTietDonHang> chiTietList = chiTietDonHangRepository.findByIdDhOrderByMaCtdhAsc(idDh);

        List<ChiTietDonHang> sachChuaSoHuu = chiTietList.stream()
                .filter(ct -> !donHangRepository.daMuaSach(maNd, ct.getMaSach()))
                .collect(Collectors.toList());

        // Hủy đơn cũ dù kết quả thế nào
        donHangCu.setTrangThai("that_bai");
        donHangRepository.save(donHangCu);

        if (sachChuaSoHuu.isEmpty())
            return new TaoDonHangResponse(false, "Bạn đã sở hữu toàn bộ sách trong đơn này", null);

        BigDecimal tongTienMoi = sachChuaSoHuu.stream()
                .map(ChiTietDonHang::getDonGia)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        String maDonHangMoi = "DH" + System.currentTimeMillis()
                + UUID.randomUUID().toString().substring(0, 6).toUpperCase();

        DonHang donHangMoi = new DonHang();
        donHangMoi.setMaDonHang(maDonHangMoi);
        donHangMoi.setMaNd(maNd);
        donHangMoi.setHoTen(donHangCu.getHoTen());
        donHangMoi.setEmail(donHangCu.getEmail());
        donHangMoi.setSoDienThoai(donHangCu.getSoDienThoai());
        donHangMoi.setTongTien(tongTienMoi);
        donHangMoi.setPhuongThucThanhToan("VNPAY");
        donHangMoi.setTrangThai("cho_thanh_toan");
        DonHang saved = donHangRepository.save(donHangMoi);

        List<ChiTietDonHang> chiTietMoi = sachChuaSoHuu.stream().map(ct -> {
            ChiTietDonHang chiTiet = new ChiTietDonHang();
            chiTiet.setIdDh(saved.getIdDh());
            chiTiet.setMaSach(ct.getMaSach());
            chiTiet.setTenSach(ct.getTenSach());
            chiTiet.setTacGia(ct.getTacGia());
            chiTiet.setAnhBiaUrl(ct.getAnhBiaUrl());
            chiTiet.setDonGia(ct.getDonGia());
            return chiTiet;
        }).collect(Collectors.toList());
        chiTietDonHangRepository.saveAll(chiTietMoi);

        String thanhToanUrl = vnpayService.taoUrlThanhToan(saved.getIdDh(), tongTienMoi, maDonHangMoi);
        return new TaoDonHangResponse(true, "Tạo đơn thanh toán lại thành công",
                new TaoDonHangResponse.DonHangData(saved.getIdDh(), saved.getMaDonHang(), thanhToanUrl));
    }

    @Caching(evict = {
        @CacheEvict(value = "lich_su_don_hang", allEntries = true),
        @CacheEvict(value = "chi_tiet_don_hang", allEntries = true)
    })
    @Transactional
    public Map<String, Object> huyDonHang(Long maNd, Long idDh) {
        DonHang donHang = donHangRepository.findById(idDh)
                .orElseThrow(() -> new RuntimeException("Đơn hàng không tồn tại"));

        if (!donHang.getMaNd().equals(maNd))
            throw new RuntimeException("Bạn không có quyền hủy đơn hàng này");

        if (!"da_thanh_toan".equals(donHang.getTrangThai()))
            return Map.of("success", false, "message", "Chỉ có thể hủy đơn hàng đã thanh toán");

        if (donHang.getNgayTao().plusDays(3).isBefore(LocalDateTime.now()))
            return Map.of("success", false, "message", "Đơn hàng đã quá 3 ngày kể từ khi mua, không thể hủy");

        List<ChiTietDonHang> chiTietList = chiTietDonHangRepository.findByIdDhOrderByMaCtdhAsc(idDh);
        List<Long> danhSachMaSach = chiTietList.stream()
                .map(ChiTietDonHang::getMaSach)
                .collect(Collectors.toList());

        if (tienDoDocSachRepository.coSachDaDocQua5Trang(maNd, danhSachMaSach))
            return Map.of("success", false, "message", "Bạn đã đọc quá 5 trang của một hoặc nhiều sách trong đơn, không thể hủy");

        donHang.setTrangThai("da_huy");
        donHangRepository.save(donHang);

        return Map.of("success", true, "message", "Hủy đơn hàng thành công");
    }
}
