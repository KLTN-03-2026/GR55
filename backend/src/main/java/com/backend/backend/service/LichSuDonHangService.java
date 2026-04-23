package com.backend.backend.service;

import com.backend.backend.dto.ChiTietDonHangResponse;
import com.backend.backend.dto.DonHangResponse;
import com.backend.backend.entity.ChiTietDonHang;
import com.backend.backend.entity.DonHang;
import com.backend.backend.repository.ChiTietDonHangRepository;
import com.backend.backend.repository.DonHangRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LichSuDonHangService {

    private final DonHangRepository donHangRepository;
    private final ChiTietDonHangRepository chiTietDonHangRepository;

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
}
