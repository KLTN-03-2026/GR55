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
    private final DanhGiaRepository danhGiaRepository;

    @Cacheable(value = "thong_ke_tong_quan")
    public ThongKeTongQuanResponse thongKeTongQuan() {
        long tongNguoiDung = nguoiDungRepository.demTongNguoiDung();
        long tongSach = sachRepository.demTongSach();
        long tongDonHang = donHangRepository.demDonHangThanhCong();
        BigDecimal bd = donHangRepository.tongDoanhThu();
        double tongDoanhThu = (bd != null ? bd.doubleValue() : 0.0)
                            + lichSuHoiVienRepository.tongDoanhThuHoiVien();
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

    public ThongKeDonHangResponse thongKeDonHang(String tuNgay, String denNgay) {
        LocalDateTime startDate = LocalDateTime.parse(tuNgay + "T00:00:00");
        LocalDateTime endDate = LocalDateTime.parse(denNgay + "T23:59:59");

        List<Object[]> results = donHangRepository.thongKeDonHangTheoTrangThai(startDate, endDate);

        long daThanhToan = 0, choThanhToan = 0, thatBai = 0;
        double doanhThu = 0;

        for (Object[] row : results) {
            String trangThai = (String) row[0];
            long soLuong = ((Number) row[1]).longValue();
            double tongTien = ((Number) row[2]).doubleValue();
            switch (trangThai) {
                case "da_thanh_toan" -> { daThanhToan = soLuong; doanhThu = tongTien; }
                case "cho_thanh_toan" -> choThanhToan = soLuong;
                case "that_bai" -> thatBai = soLuong;
            }
        }

        long tongDon = daThanhToan + choThanhToan + thatBai;
        double tyLe = tongDon > 0 ? (daThanhToan * 100.0 / tongDon) : 0;

        List<Object[]> danhSachRaw = donHangRepository.layDonHangTheoDenNgay(startDate, endDate);
        List<ThongKeDonHangResponse.DonHangItem> danhSach = new ArrayList<>();
        for (Object[] row : danhSachRaw) {
            danhSach.add(new ThongKeDonHangResponse.DonHangItem(
                    row[0] != null ? row[0].toString() : "",
                    row[1] != null ? row[1].toString() : "",
                    row[2] != null ? row[2].toString() : "",
                    row[3] != null ? row[3].toString().replace(" ", "T").replaceAll("\\.0$", "") : "",
                    row[4] != null ? ((Number) row[4]).doubleValue() : 0,
                    row[5] != null ? row[5].toString() : ""
            ));
        }

        return new ThongKeDonHangResponse(tongDon, daThanhToan, choThanhToan, thatBai, doanhThu, tyLe, danhSach);
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

    public ThongKeHoiVienResponse thongKeHoiVien() {
        long hoiVienHoatDong = lichSuHoiVienRepository.demHoiVienHienTai(LocalDateTime.now());
        long tongNguoiDung = nguoiDungRepository.demTongNguoiDung();
        double tyLe = tongNguoiDung > 0 ? hoiVienHoatDong * 100.0 / tongNguoiDung : 0;
        double tongDoanhThu = lichSuHoiVienRepository.tongDoanhThuHoiVien();

        List<Object[]> goiRaw = lichSuHoiVienRepository.thongKeTheoGoi();
        List<ThongKeHoiVienResponse.GoiThongKe> theoGoi = new ArrayList<>();
        for (Object[] row : goiRaw) {
            theoGoi.add(new ThongKeHoiVienResponse.GoiThongKe(
                    str(row[0]),
                    row[1] != null ? ((Number) row[1]).doubleValue() : 0,
                    row[2] != null ? ((Number) row[2]).intValue() : 0,
                    row[3] != null ? ((Number) row[3]).longValue() : 0,
                    row[4] != null ? ((Number) row[4]).longValue() : 0,
                    row[5] != null ? ((Number) row[5]).doubleValue() : 0
            ));
        }
        return new ThongKeHoiVienResponse(hoiVienHoatDong, tongNguoiDung, tyLe, tongDoanhThu, theoGoi);
    }

    public ThongKeDanhGiaResponse thongKeDanhGia() {
        List<Object[]> tongQuanList = danhGiaRepository.tongQuanDanhGia();
        Object[] tongQuan = tongQuanList.isEmpty() ? new Object[]{0L, 0.0} : tongQuanList.get(0);
        long tongDanhGia = tongQuan[0] != null ? ((Number) tongQuan[0]).longValue() : 0;
        double diemTb = tongQuan[1] != null ? ((Number) tongQuan[1]).doubleValue() : 0;
        Double tyLeRaw = danhGiaRepository.tyLeNguoiMuaDanhGia();
        double tyLe = tyLeRaw != null ? tyLeRaw : 0;

        List<Object[]> phanBoRaw = danhGiaRepository.thongKePhanBoSaoToanHeThong();
        List<ThongKeDanhGiaResponse.PhanBoSao> phanBo = new ArrayList<>();
        for (Object[] row : phanBoRaw) {
            long soLuong = row[1] != null ? ((Number) row[1]).longValue() : 0;
            double tlSao = tongDanhGia > 0 ? soLuong * 100.0 / tongDanhGia : 0;
            phanBo.add(new ThongKeDanhGiaResponse.PhanBoSao(
                    row[0] != null ? ((Number) row[0]).intValue() : 0,
                    soLuong,
                    Math.round(tlSao * 10.0) / 10.0
            ));
        }

        List<ThongKeDanhGiaResponse.SachDanhGia> cao = mapSachDanhGia(danhGiaRepository.topSachDanhGiaCao());
        List<ThongKeDanhGiaResponse.SachDanhGia> thap = mapSachDanhGia(danhGiaRepository.topSachDanhGiaThap());

        return new ThongKeDanhGiaResponse(tongDanhGia, Math.round(diemTb * 100.0) / 100.0, tyLe, phanBo, cao, thap);
    }

    private List<ThongKeDanhGiaResponse.SachDanhGia> mapSachDanhGia(List<Object[]> rows) {
        List<ThongKeDanhGiaResponse.SachDanhGia> list = new ArrayList<>();
        for (Object[] row : rows) {
            list.add(new ThongKeDanhGiaResponse.SachDanhGia(
                    row[0] != null ? ((Number) row[0]).longValue() : 0,
                    str(row[1]), str(row[2]),
                    row[3] != null ? ((Number) row[3]).doubleValue() : 0,
                    row[4] != null ? ((Number) row[4]).longValue() : 0
            ));
        }
        return list;
    }

    public ThongKeHieuSuatSachResponse thongKeHieuSuatSach() {
        return new ThongKeHieuSuatSachResponse(
                mapHieuSuat(sachRepository.topSachTheoLuotXem()),
                mapHieuSuat(sachRepository.sachNhieuViewItBan())
        );
    }

    private List<ThongKeHieuSuatSachResponse.HieuSuatSach> mapHieuSuat(List<Object[]> rows) {
        List<ThongKeHieuSuatSachResponse.HieuSuatSach> list = new ArrayList<>();
        for (Object[] row : rows) {
            list.add(new ThongKeHieuSuatSachResponse.HieuSuatSach(
                    row[0] != null ? ((Number) row[0]).longValue() : 0,
                    str(row[1]), str(row[2]),
                    row[3] != null ? ((Number) row[3]).doubleValue() : 0,
                    row[4] != null ? ((Number) row[4]).intValue() : 0,
                    row[5] != null ? ((Number) row[5]).intValue() : 0,
                    row[6] != null ? ((Number) row[6]).doubleValue() : 0,
                    row[7] != null ? ((Number) row[7]).doubleValue() : 0
            ));
        }
        return list;
    }
}
