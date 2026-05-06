package com.backend.backend.service;

import com.backend.backend.dto.TaoDonHangRequest;
import com.backend.backend.dto.TaoDonHangResponse;
import com.backend.backend.entity.ChiTietDonHang;
import com.backend.backend.entity.DonHang;
import com.backend.backend.entity.GiaoDichThanhToan;
import com.backend.backend.entity.GioHang;
import com.backend.backend.entity.Sach;
import com.backend.backend.repository.ChiTietDonHangRepository;
import com.backend.backend.repository.DonHangRepository;
import com.backend.backend.repository.GiaoDichThanhToanRepository;
import com.backend.backend.repository.GioHangRepository;
import com.backend.backend.repository.SachRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Caching;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MuaSachService {

    private final DonHangRepository donHangRepository;
    private final ChiTietDonHangRepository chiTietDonHangRepository;
    private final GioHangRepository gioHangRepository;
    private final SachRepository sachRepository;
    private final VnpayService vnpayService;
    private final GiaoDichThanhToanRepository giaoDichThanhToanRepository;
    private final GiamGiaPublicService giamGiaPublicService;

    @Transactional
    public TaoDonHangResponse taoDonHang(Long maNd, TaoDonHangRequest request) {
        List<GioHang> gioHangList = gioHangRepository.findByMaNd(maNd);
        if (gioHangList.isEmpty()) {
            return new TaoDonHangResponse(false, "Giỏ hàng trống", null);
        }

        // Load tất cả sách một lần — tránh N+1 query
        List<Long> dsMaSach = gioHangList.stream().map(GioHang::getMaSach).toList();
        List<Sach> dsSach = sachRepository.findAllById(dsMaSach);

        // Kiểm tra sách tồn tại và chưa bị xóa
        Map<Long, Sach> sachMap = new HashMap<>();
        for (Sach sach : dsSach) {
            if (Boolean.TRUE.equals(sach.getDaXoa())) {
                return new TaoDonHangResponse(false, "Sách không còn bán: " + sach.getTenSach(), null);
            }
            sachMap.put(sach.getMaSach(), sach);
        }
        if (sachMap.size() != dsMaSach.size()) {
            return new TaoDonHangResponse(false, "Một số sách trong giỏ hàng không tồn tại", null);
        }

        // Tính giá giảm cho từng sách
        Set<Long> sachIdSet = new HashSet<>(sachMap.keySet());
        Map<Long, BigDecimal> giaGocMap = new HashMap<>();
        sachMap.forEach((id, sach) -> giaGocMap.put(id, sach.getGia()));
        Map<Long, BigDecimal> giaSauGiamMap = giamGiaPublicService.layGiaSauGiamBatch(sachIdSet, giaGocMap);

        // Tính tổng tiền (áp dụng giá giảm nếu có)
        BigDecimal tongTien = BigDecimal.ZERO;
        for (GioHang item : gioHangList) {
            Sach sach = sachMap.get(item.getMaSach());
            BigDecimal donGia = giaSauGiamMap.getOrDefault(sach.getMaSach(), sach.getGia());
            tongTien = tongTien.add(donGia);
        }

        String maDonHang = "DH" + System.currentTimeMillis()
                + UUID.randomUUID().toString().substring(0, 6).toUpperCase();

        DonHang donHang = new DonHang();
        donHang.setMaDonHang(maDonHang);
        donHang.setMaNd(maNd);
        donHang.setHoTen(request.getHoTen());
        donHang.setEmail(request.getEmail());
        donHang.setSoDienThoai(request.getSoDienThoai());
        donHang.setTongTien(tongTien);
        donHang.setPhuongThucThanhToan("VNPAY");
        donHang.setTrangThai("cho_thanh_toan");
        DonHang saved = donHangRepository.save(donHang);

        // Lưu snapshot từng sách vào chi tiết đơn hàng (dùng giá đã giảm nếu có)
        for (GioHang item : gioHangList) {
            Sach sach = sachMap.get(item.getMaSach());
            BigDecimal donGia = giaSauGiamMap.getOrDefault(sach.getMaSach(), sach.getGia());
            ChiTietDonHang chiTiet = new ChiTietDonHang();
            chiTiet.setIdDh(saved.getIdDh());
            chiTiet.setMaSach(sach.getMaSach());
            chiTiet.setTenSach(sach.getTenSach());
            chiTiet.setTacGia(sach.getTacGia());
            chiTiet.setAnhBiaUrl(sach.getAnhBiaUrl());
            chiTiet.setDonGia(donGia);
            chiTietDonHangRepository.save(chiTiet);
        }

        String thanhToanUrl = vnpayService.taoUrlThanhToan(saved.getIdDh(), tongTien, maDonHang, request.isDungQr());
        TaoDonHangResponse.DonHangData data = new TaoDonHangResponse.DonHangData(
                saved.getIdDh(), saved.getMaDonHang(), thanhToanUrl);

        return new TaoDonHangResponse(true, "Tạo đơn hàng thành công", data);
    }

    @Caching(evict = {
        @CacheEvict(value = "lich_su_don_hang", allEntries = true),
        @CacheEvict(value = "chi_tiet_don_hang", allEntries = true),
        @CacheEvict(value = "chi_tiet_sach", allEntries = true),
        @CacheEvict(value = "sach_noi_bat", allEntries = true),
        @CacheEvict(value = "sach_hoi_vien", allEntries = true)
    })
    @Transactional
    public void xuLyThanhToanThanhCong(Long idDh, String maGiaoDichNgoai) {
        DonHang donHang = donHangRepository.findById(idDh)
                .orElseThrow(() -> new RuntimeException("Đơn hàng không tồn tại: " + idDh));
        donHang.setTrangThai("da_thanh_toan");
        donHangRepository.save(donHang);
        gioHangRepository.xoaToanBo(donHang.getMaNd());

        GiaoDichThanhToan giaoDich = new GiaoDichThanhToan();
        giaoDich.setIdDh(idDh);
        giaoDich.setSoTien(donHang.getTongTien());
        giaoDich.setPhuongThuc("VNPAY");
        giaoDich.setTrangThai("thanh_cong");
        giaoDich.setMaGiaoDichNgoai(maGiaoDichNgoai);
        giaoDich.setPhanHoi("Giao dịch thành công");
        giaoDichThanhToanRepository.save(giaoDich);

        List<ChiTietDonHang> chiTietList = chiTietDonHangRepository.findByIdDhOrderByMaCtdhAsc(idDh);
        List<Long> maSachList = chiTietList.stream().map(ChiTietDonHang::getMaSach).toList();
        List<Sach> sachList = sachRepository.findAllById(maSachList);
        for (Sach sach : sachList) {
            sach.setSoLuongDaBan((sach.getSoLuongDaBan() != null ? sach.getSoLuongDaBan() : 0) + 1);
        }
        sachRepository.saveAll(sachList);
    }

    @Caching(evict = {
        @CacheEvict(value = "lich_su_don_hang", allEntries = true),
        @CacheEvict(value = "chi_tiet_don_hang", allEntries = true)
    })
    @Transactional
    public void xuLyThanhToanThatBai(Long idDh, String maGiaoDichNgoai, String maLoi) {
        DonHang donHang = donHangRepository.findById(idDh)
                .orElseThrow(() -> new RuntimeException("Đơn hàng không tồn tại: " + idDh));
        donHang.setTrangThai("that_bai");
        donHangRepository.save(donHang);

        GiaoDichThanhToan giaoDich = new GiaoDichThanhToan();
        giaoDich.setIdDh(idDh);
        giaoDich.setSoTien(donHang.getTongTien());
        giaoDich.setPhuongThuc("VNPAY");
        giaoDich.setTrangThai("that_bai");
        giaoDich.setMaGiaoDichNgoai(maGiaoDichNgoai);
        giaoDich.setPhanHoi("Mã lỗi: " + maLoi);
        giaoDichThanhToanRepository.save(giaoDich);
    }
}
