package com.backend.backend.service;

import com.backend.backend.dto.CapNhatTrangThaiDonHangRequest;
import com.backend.backend.dto.ChiTietDonHangAdminResponse;
import com.backend.backend.dto.DanhGiaResponse;
import com.backend.backend.dto.DanhSachDonHangAdminResponse;
import com.backend.backend.entity.ChiTietDonHang;
import com.backend.backend.entity.DonHang;
import com.backend.backend.repository.ChiTietDonHangRepository;
import com.backend.backend.repository.DonHangRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuanLyDonHangService {

    private final DonHangRepository donHangRepository;
    private final ChiTietDonHangRepository chiTietDonHangRepository;

    private static final Set<String> TRANG_THAI_HOP_LE = Set.of(
            "cho_thanh_toan", "da_thanh_toan", "that_bai", "da_huy");

    @Cacheable(value = "don_hang_admin",
               key = "#trangThai + '_' + #tenKhachHang + '_' + #tuNgay + '_' + #denNgay + '_' + #trang + '_' + #kichThuoc")
    public DanhSachDonHangAdminResponse layDanhSachDonHang(String trangThai, String tenKhachHang,
                                                            String tuNgay, String denNgay,
                                                            int trang, int kichThuoc) {
        LocalDateTime startDate = null;
        LocalDateTime endDate = null;
        if (tuNgay != null && !tuNgay.isBlank()) startDate = LocalDateTime.parse(tuNgay + "T00:00:00");
        if (denNgay != null && !denNgay.isBlank()) endDate = LocalDateTime.parse(denNgay + "T23:59:59");

        Page<DonHang> page = donHangRepository.timDonHangAdmin(
                (trangThai != null && !trangThai.isBlank()) ? trangThai : null,
                (tenKhachHang != null && !tenKhachHang.isBlank()) ? tenKhachHang : null,
                startDate, endDate,
                PageRequest.of(trang - 1, kichThuoc));

        List<DanhSachDonHangAdminResponse.DonHangAdminData> danhSach = page.getContent().stream()
                .map(dh -> new DanhSachDonHangAdminResponse.DonHangAdminData(
                        dh.getIdDh(),
                        dh.getMaDonHang(),
                        dh.getHoTen(),
                        dh.getEmail(),
                        dh.getNgayTao(),
                        dh.getTongTien(),
                        dh.getTrangThai(),
                        dh.getPhuongThucThanhToan()
                ))
                .collect(Collectors.toList());

        return new DanhSachDonHangAdminResponse(
                true, "Lấy danh sách đơn hàng thành công",
                danhSach, page.getNumber() + 1, page.getTotalPages(), page.getTotalElements());
    }

    @Cacheable(value = "chi_tiet_don_hang_admin", key = "#idDh")
    public ChiTietDonHangAdminResponse layChiTietDonHang(Long idDh) {
        DonHang donHang = donHangRepository.findById(idDh)
                .orElseThrow(() -> new RuntimeException("Đơn hàng không tồn tại"));

        List<ChiTietDonHang> chiTietList = chiTietDonHangRepository.findByIdDhOrderByMaCtdhAsc(idDh);

        List<ChiTietDonHangAdminResponse.SachTrongDon> danhSachSach = chiTietList.stream()
                .map(ct -> new ChiTietDonHangAdminResponse.SachTrongDon(
                        ct.getMaSach(), ct.getTenSach(), ct.getTacGia(), ct.getAnhBiaUrl(), ct.getDonGia()
                ))
                .collect(Collectors.toList());

        ChiTietDonHangAdminResponse.ThongTinKhachHang khachHang = new ChiTietDonHangAdminResponse.ThongTinKhachHang(
                donHang.getHoTen(), donHang.getEmail(), donHang.getSoDienThoai());

        ChiTietDonHangAdminResponse.ChiTietData data = new ChiTietDonHangAdminResponse.ChiTietData(
                donHang.getIdDh(), donHang.getMaDonHang(), donHang.getNgayTao(),
                donHang.getTongTien(), donHang.getTrangThai(), donHang.getPhuongThucThanhToan(),
                khachHang, danhSachSach);

        return new ChiTietDonHangAdminResponse(true, "Lấy chi tiết đơn hàng thành công", data);
    }

    @Caching(evict = {
        @CacheEvict(value = "don_hang_admin", allEntries = true),
        @CacheEvict(value = "chi_tiet_don_hang_admin", key = "#idDh"),
        @CacheEvict(value = "lich_su_don_hang", allEntries = true),
        @CacheEvict(value = "chi_tiet_don_hang", allEntries = true)
    })
    @Transactional
    public DanhGiaResponse capNhatTrangThaiDonHang(Long idDh, CapNhatTrangThaiDonHangRequest request) {
        DonHang donHang = donHangRepository.findById(idDh)
                .orElseThrow(() -> new RuntimeException("Đơn hàng không tồn tại"));

        String trangThaiMoi = request.getTrang_thai();
        if (!TRANG_THAI_HOP_LE.contains(trangThaiMoi)) {
            throw new RuntimeException("Trạng thái không hợp lệ: " + trangThaiMoi);
        }

        donHang.setTrangThai(trangThaiMoi);
        donHangRepository.save(donHang);

        return new DanhGiaResponse(true, "Cập nhật trạng thái đơn hàng thành công", null);
    }
}
