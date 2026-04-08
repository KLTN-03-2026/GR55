package com.backend.backend.service;

import com.backend.backend.dto.DanhSachDanhGiaResponse;
import com.backend.backend.dto.PhanBoSaoResponse;
import com.backend.backend.entity.DanhGia;
import com.backend.backend.repository.DanhGiaRepository;
import com.backend.backend.repository.NguoiDungRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DanhGiaService {

    private final DanhGiaRepository danhGiaRepository;
    private final NguoiDungRepository nguoiDungRepository;

    // Self-injection để @Cacheable hoạt động khi gọi nội bộ (tránh Spring AOP self-invocation)
    @Lazy
    @Autowired
    private DanhGiaService self;

    // Cache dùng chung cho mọi user — la_cua_toi được gán lại sau khi lấy từ cache
    @Cacheable(value = "danh_gia_sach",
               key = "#maSach + '_' + #sort + '_' + #trang + '_' + #kichThuoc")
    public DanhSachDanhGiaResponse layDanhSachDanhGiaCached(
            Long maSach, String sort, int trang, int kichThuoc) {

        Sort sortOrder = switch (sort != null ? sort : "moi_nhat") {
            case "cu_nhat"  -> Sort.by(Sort.Direction.ASC,  "ngayTao");
            case "cao_nhat" -> Sort.by(Sort.Direction.DESC, "soSao");
            default         -> Sort.by(Sort.Direction.DESC, "ngayTao");
        };

        Pageable pageable = PageRequest.of(trang - 1, kichThuoc, sortOrder);
        Page<DanhGia> page = danhGiaRepository.findDanhGiaBySach(maSach, pageable);

        // Batch load tên người dùng — 1 query thay vì N queries
        List<Long> danhSachMaNd = page.getContent().stream()
                .map(DanhGia::getMaNd).distinct().collect(Collectors.toList());
        Map<Long, String> tenNguoiDungMap = nguoiDungRepository.findAllById(danhSachMaNd)
                .stream()
                .collect(Collectors.toMap(
                        nd -> nd.getMaNguoiDung(),
                        nd -> nd.getHoTen()));

        List<DanhSachDanhGiaResponse.DanhGiaData> danhSach = page.getContent().stream()
                .map(dg -> new DanhSachDanhGiaResponse.DanhGiaData(
                        dg.getMaDg(),
                        dg.getMaNd(),
                        tenNguoiDungMap.getOrDefault(dg.getMaNd(), "Ẩn danh"),
                        dg.getSoSao(),
                        dg.getNoiDung(),
                        dg.getNgayTao(),
                        false)) // la_cua_toi gán lại ở layDanhSachDanhGia()
                .collect(Collectors.toList());

        Double diemTrungBinh = danhGiaRepository.tinhDiemTrungBinh(maSach);
        Integer tongSoDanhGia = danhGiaRepository.demSoLuotDanhGia(maSach);

        List<Object[]> phanBoRaw = danhGiaRepository.thongKePhanBoSao(maSach);
        int tong = tongSoDanhGia != null ? tongSoDanhGia : 0;
        List<PhanBoSaoResponse> phanBoSao = new ArrayList<>();
        for (int i = 5; i >= 1; i--) {
            int soLuong = 0;
            for (Object[] row : phanBoRaw) {
                if (((Number) row[0]).intValue() == i) {
                    soLuong = ((Number) row[1]).intValue();
                    break;
                }
            }
            double phanTram = tong > 0 ? (soLuong * 100.0 / tong) : 0.0;
            phanBoSao.add(new PhanBoSaoResponse(i, soLuong, phanTram));
        }

        return new DanhSachDanhGiaResponse(
                diemTrungBinh != null ? diemTrungBinh : 0.0,
                tong,
                phanBoSao,
                danhSach,
                page.getNumber() + 1,
                page.getTotalPages(),
                page.getTotalElements());
    }

    public DanhSachDanhGiaResponse layDanhSachDanhGia(
            Long maSach, String sort, int trang, int kichThuoc, Long maNd) {
        DanhSachDanhGiaResponse ketQua = self.layDanhSachDanhGiaCached(maSach, sort, trang, kichThuoc);
        if (maNd == null) return ketQua;

        // Gán lại la_cua_toi dựa theo maNd sau khi lấy từ cache
        List<DanhSachDanhGiaResponse.DanhGiaData> danhSachCapNhat = ketQua.getDanh_sach().stream()
                .map(dg -> new DanhSachDanhGiaResponse.DanhGiaData(
                        dg.getMa_dg(), dg.getMa_nd(), dg.getTen_nguoi_dung(),
                        dg.getSo_sao(), dg.getNoi_dung(), dg.getNgay_tao(),
                        dg.getMa_nd() != null && dg.getMa_nd().equals(maNd)))
                .collect(Collectors.toList());

        return new DanhSachDanhGiaResponse(
                ketQua.getDiem_trung_binh(),
                ketQua.getTong_so_danh_gia(),
                ketQua.getPhan_bo_sao(),
                danhSachCapNhat,
                ketQua.getTrang_hien_tai(),
                ketQua.getTong_so_trang(),
                ketQua.getTong_so_ban_ghi());
    }

    @CacheEvict(value = "danh_gia_sach", allEntries = true)
    public void xoaCache() {
        // Được gọi khi có thay đổi đánh giá
    }
}
