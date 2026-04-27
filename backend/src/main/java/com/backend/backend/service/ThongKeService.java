package com.backend.backend.service;

import com.backend.backend.dto.*;
import com.backend.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ThongKeService {

    private final NguoiDungRepository nguoiDungRepository;
    private final SachRepository sachRepository;
    private final DonHangRepository donHangRepository;
    private final ChiTietDonHangRepository chiTietDonHangRepository;
    private final DanhMucSachRepository danhMucSachRepository;
    private final LichSuHoiVienRepository lichSuHoiVienRepository;

    @Cacheable(value = "thong_ke_tong_quan")
    public ThongKeTongQuanResponse thongKeTongQuan() {
        long tongNguoiDung = nguoiDungRepository.demTongNguoiDung();
        long tongSach = sachRepository.demTongSach();
        long tongDonHang = donHangRepository.demDonHangThanhCong();
        BigDecimal bd = donHangRepository.tongDoanhThu();
        double tongDoanhThu = bd != null ? bd.doubleValue() : 0.0;
        long tongHoiVien = lichSuHoiVienRepository.demHoiVienHienTai(LocalDateTime.now());

        return new ThongKeTongQuanResponse(tongNguoiDung, tongSach, tongDonHang, tongDoanhThu, tongHoiVien);
    }

    @Cacheable(value = "thong_ke_doanh_thu", key = "#tuNgay + '_' + #denNgay + '_' + #loai")
    public DoanhThuTheoThoiGianResponse thongKeDoanhThu(String tuNgay, String denNgay, String loai) {
        LocalDateTime startDate = LocalDateTime.parse(tuNgay + "T00:00:00");
        LocalDateTime endDate = LocalDateTime.parse(denNgay + "T23:59:59");

        List<Object[]> results;
        switch (loai) {
            case "tuan":
                results = donHangRepository.thongKeDoanhThuTheoTuan(startDate, endDate);
                break;
            case "thang":
                results = donHangRepository.thongKeDoanhThuTheoThang(startDate, endDate);
                break;
            default:
                results = donHangRepository.thongKeDoanhThuTheoNgay(startDate, endDate);
        }

        List<DoanhThuTheoThoiGianResponse.DoanhThuData> data = new ArrayList<>();
        for (Object[] row : results) {
            String thoiGian = row[0].toString();
            double doanhThu = row[1] != null ? ((Number) row[1]).doubleValue() : 0.0;
            long soLuongDon = ((Number) row[2]).longValue();
            data.add(new DoanhThuTheoThoiGianResponse.DoanhThuData(thoiGian, doanhThu, soLuongDon));
        }

        return new DoanhThuTheoThoiGianResponse(data);
    }

    @Cacheable(value = "sach_ban_chay", key = "#tuNgay + '_' + #denNgay")
    public SachBanChayResponse sachBanChay(String tuNgay, String denNgay) {
        LocalDateTime startDate = LocalDateTime.parse(tuNgay + "T00:00:00");
        LocalDateTime endDate = LocalDateTime.parse(denNgay + "T23:59:59");

        List<Object[]> results = chiTietDonHangRepository.findSachBanChay(startDate, endDate);

        List<SachBanChayResponse.SachBanChayData> data = new ArrayList<>();
        for (Object[] row : results) {
            data.add(new SachBanChayResponse.SachBanChayData(
                    ((Number) row[0]).longValue(),
                    (String) row[1],
                    (String) row[2],
                    ((Number) row[3]).longValue(),
                    row[4] != null ? ((Number) row[4]).doubleValue() : 0.0
            ));
        }

        return new SachBanChayResponse(data);
    }

    @Cacheable(value = "nguoi_dung_moi", key = "#tuNgay + '_' + #denNgay")
    public NguoiDungMoiResponse thongKeNguoiDungMoi(String tuNgay, String denNgay) {
        LocalDateTime startDate = LocalDateTime.parse(tuNgay + "T00:00:00");
        LocalDateTime endDate = LocalDateTime.parse(denNgay + "T23:59:59");

        List<Object[]> results = nguoiDungRepository.thongKeNguoiDungMoiTheoNgay(startDate, endDate);

        List<NguoiDungMoiResponse.NguoiDungMoiData> data = new ArrayList<>();
        for (Object[] row : results) {
            data.add(new NguoiDungMoiResponse.NguoiDungMoiData(
                    row[0].toString(),
                    ((Number) row[1]).longValue()
            ));
        }

        return new NguoiDungMoiResponse(data);
    }

    public byte[] xuatCsvDoanhThu(String tuNgay, String denNgay, String loai) {
        DoanhThuTheoThoiGianResponse response = thongKeDoanhThu(tuNgay, denNgay, loai);
        StringBuilder csv = new StringBuilder("﻿");
        csv.append("Thời gian,Doanh thu (VNĐ),Số lượng đơn\n");
        for (DoanhThuTheoThoiGianResponse.DoanhThuData row : response.getData()) {
            csv.append(row.getThoi_gian()).append(',')
               .append(row.getDoanh_thu()).append(',')
               .append(row.getSo_luong_don()).append('\n');
        }
        return csv.toString().getBytes(StandardCharsets.UTF_8);
    }

    public byte[] xuatCsvSachBanChay(String tuNgay, String denNgay) {
        SachBanChayResponse response = sachBanChay(tuNgay, denNgay);
        StringBuilder csv = new StringBuilder("﻿");
        csv.append("Mã sách,Tên sách,Tác giả,Số lượng bán,Doanh thu (VNĐ)\n");
        for (SachBanChayResponse.SachBanChayData row : response.getData()) {
            csv.append(row.getMa_sach()).append(',')
               .append(thoatCsv(row.getTen_sach())).append(',')
               .append(thoatCsv(row.getTac_gia())).append(',')
               .append(row.getSo_luong_ban()).append(',')
               .append(row.getDoanh_thu()).append('\n');
        }
        return csv.toString().getBytes(StandardCharsets.UTF_8);
    }

    public byte[] xuatCsvDonHang(String tuNgay, String denNgay) {
        LocalDateTime startDate = LocalDateTime.parse(tuNgay + "T00:00:00");
        LocalDateTime endDate = LocalDateTime.parse(denNgay + "T23:59:59");
        List<Object[]> rows = donHangRepository.layDonHangTheoDenNgay(startDate, endDate);
        StringBuilder csv = new StringBuilder("﻿");
        csv.append("Mã đơn hàng,Khách hàng,Email,Ngày tạo,Tổng tiền,Trạng thái,Thanh toán\n");
        for (Object[] row : rows) {
            csv.append(thoatCsv(str(row[0]))).append(',')
               .append(thoatCsv(str(row[1]))).append(',')
               .append(thoatCsv(str(row[2]))).append(',')
               .append(str(row[3])).append(',')
               .append(str(row[4])).append(',')
               .append(str(row[5])).append(',')
               .append(str(row[6])).append('\n');
        }
        return csv.toString().getBytes(StandardCharsets.UTF_8);
    }

    public byte[] xuatCsvNguoiDungMoi(String tuNgay, String denNgay) {
        NguoiDungMoiResponse response = thongKeNguoiDungMoi(tuNgay, denNgay);
        StringBuilder csv = new StringBuilder("﻿");
        csv.append("Ngày,Số lượng đăng ký mới\n");
        for (NguoiDungMoiResponse.NguoiDungMoiData row : response.getData()) {
            csv.append(row.getThoi_gian()).append(',')
               .append(row.getSo_luong()).append('\n');
        }
        return csv.toString().getBytes(StandardCharsets.UTF_8);
    }

    private String thoatCsv(String value) {
        if (value == null) return "";
        if (value.contains(",") || value.contains("\"") || value.contains("\n"))
            return "\"" + value.replace("\"", "\"\"") + "\"";
        return value;
    }

    private String str(Object obj) {
        return obj != null ? obj.toString() : "";
    }

    @Cacheable(value = "thong_ke_sach_the_loai")
    public ThongKeSachTheoTheLoaiResponse thongKeSachTheoTheLoai() {
        List<Object[]> results = danhMucSachRepository.thongKeSachTheoTheLoai();
        long tongSach = sachRepository.demTongSach();

        List<ThongKeSachTheoTheLoaiResponse.TheLoaiData> data = new ArrayList<>();
        for (Object[] row : results) {
            String tenTheLoai = (String) row[0];
            long soLuong = ((Number) row[1]).longValue();
            double tyLe = tongSach > 0 ? (soLuong * 100.0 / tongSach) : 0.0;
            data.add(new ThongKeSachTheoTheLoaiResponse.TheLoaiData(tenTheLoai, soLuong, tyLe));
        }

        return new ThongKeSachTheoTheLoaiResponse(data);
    }
}
