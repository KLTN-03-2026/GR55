package com.backend.backend.service;

import com.backend.backend.dto.*;
import com.backend.backend.entity.MaOtp;
import com.backend.backend.entity.NguoiDung;
import com.backend.backend.entity.VaiTro;
import com.backend.backend.repository.DonHangRepository;
import com.backend.backend.repository.MaOtpRepository;
import com.backend.backend.repository.NguoiDungRepository;
import com.backend.backend.repository.VaiTroRepository;
import com.backend.backend.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.security.SecureRandom;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NguoiDungService {

    private final NguoiDungRepository nguoiDungRepository;
    private final VaiTroRepository vaiTroRepository;
    private final MaOtpRepository maOtpRepository;
    private final DonHangRepository donHangRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final MailService mailService;

    public DangKyResponse dangKy(DangKyRequest yeuCauDangKy) {
        if (nguoiDungRepository.existsByEmail(yeuCauDangKy.getEmail())) {
            return new DangKyResponse(false, "Email đã tồn tại trong hệ thống", null, null);
        }

        if (!yeuCauDangKy.getMat_khau().equals(yeuCauDangKy.getXac_nhan_mat_khau())) {
            return new DangKyResponse(false, "Xác nhận mật khẩu không khớp", null, null);
        }

        VaiTro vaiTroThanhVien = vaiTroRepository.findById(1L)
                .orElseThrow(() -> new RuntimeException("Vai trò thành viên không tồn tại"));

        NguoiDung nguoiDungMoi = new NguoiDung();
        nguoiDungMoi.setHoTen(yeuCauDangKy.getHo_ten());
        nguoiDungMoi.setEmail(yeuCauDangKy.getEmail());
        nguoiDungMoi.setSoDienThoai(yeuCauDangKy.getSo_dien_thoai());
        nguoiDungMoi.setMatKhau(passwordEncoder.encode(yeuCauDangKy.getMat_khau()));
        nguoiDungMoi.setVaiTro(vaiTroThanhVien);
        nguoiDungMoi.setTrangThai(NguoiDung.TrangThai.hoat_dong);

        NguoiDung nguoiDungDaLuu = nguoiDungRepository.save(nguoiDungMoi);

        DangKyResponse.DuLieuNguoiDung duLieu = new DangKyResponse.DuLieuNguoiDung(
                nguoiDungDaLuu.getMaNguoiDung(),
                nguoiDungDaLuu.getHoTen(),
                nguoiDungDaLuu.getEmail(),
                nguoiDungDaLuu.getSoDienThoai()
        );

        return new DangKyResponse(true, "Đăng ký thành công!", null, duLieu);
    }

    public DangNhapResponse dangNhap(DangNhapRequest yeuCauDangNhap) {
        NguoiDung nguoiDung = nguoiDungRepository.findByEmail(yeuCauDangNhap.getEmail())
                .orElse(null);

        if (nguoiDung == null) {
            return DangNhapResponse.builder()
                    .success(false)
                    .message("Email không tồn tại trong hệ thống")
                    .build();
        }

        // 1. Kiểm tra admin khóa vĩnh viễn (trang_thai = khoa, không có khoa_den)
        if (nguoiDung.getTrangThai() == NguoiDung.TrangThai.khoa) {
            return DangNhapResponse.builder()
                    .success(false)
                    .message("Tài khoản đã bị khóa. Vui lòng liên hệ quản trị viên")
                    .build();
        }

        // 2. Kiểm tra tạm khóa 15 phút do đăng nhập sai (chỉ dựa vào khoa_den, không liên quan trang_thai)
        if (nguoiDung.getKhoaDen() != null) {
            if (nguoiDung.getKhoaDen().isAfter(LocalDateTime.now())) {
                return DangNhapResponse.builder()
                        .success(false)
                        .message("Tài khoản tạm thời bị khóa. Vui lòng thử lại sau 15 phút")
                        .build();
            }
            // Hết 15 phút — reset tự động, không đụng trang_thai
            nguoiDung.setKhoaDen(null);
            nguoiDung.setSoLanDangNhapSai(0);
            nguoiDungRepository.save(nguoiDung);
        }

        if (!passwordEncoder.matches(yeuCauDangNhap.getMat_khau(), nguoiDung.getMatKhau())) {
            int soLanSai = nguoiDung.getSoLanDangNhapSai() + 1;
            nguoiDung.setSoLanDangNhapSai(soLanSai);

            if (soLanSai >= 5) {
                // Chỉ set khoa_den, KHÔNG thay đổi trang_thai
                nguoiDung.setKhoaDen(LocalDateTime.now().plusMinutes(15));
                nguoiDungRepository.save(nguoiDung);
                return DangNhapResponse.builder()
                        .success(false)
                        .message("Tài khoản tạm thời bị khóa do nhập sai mật khẩu quá 5 lần. Vui lòng thử lại sau 15 phút")
                        .build();
            }

            nguoiDungRepository.save(nguoiDung);
            return DangNhapResponse.builder()
                    .success(false)
                    .message("Mật khẩu không chính xác. Còn " + (5 - soLanSai) + " lần thử")
                    .build();
        }

        nguoiDung.setSoLanDangNhapSai(0);
        nguoiDung.setKhoaDen(null);
        nguoiDung.setLanDangNhapCuoi(LocalDateTime.now());
        nguoiDungRepository.save(nguoiDung);

        String tenVaiTro = nguoiDung.getVaiTro().getTenVaiTro();
        String token = jwtUtil.taoToken(nguoiDung.getMaNguoiDung(), nguoiDung.getEmail(), tenVaiTro);

        DangNhapResponse.ThongTinNguoiDung thongTin = new DangNhapResponse.ThongTinNguoiDung(
                nguoiDung.getMaNguoiDung(),
                nguoiDung.getHoTen(),
                nguoiDung.getEmail(),
                tenVaiTro
        );

        return DangNhapResponse.builder()
                .success(true)
                .message("Đăng nhập thành công")
                .token(token)
                .data(thongTin)
                .build();
    }

    public QuenMatKhauResponse guiMaOtp(GuiOtpRequest yeuCauGuiOtp) {
        NguoiDung nguoiDung = nguoiDungRepository.findByEmail(yeuCauGuiOtp.getEmail())
                .orElse(null);

        if (nguoiDung == null) {
            return new QuenMatKhauResponse(false, "Email không tồn tại trong hệ thống");
        }

        maOtpRepository.deleteByMaNd(nguoiDung.getMaNguoiDung());

        String chuoiOtp = String.format("%06d", new SecureRandom().nextInt(1000000));

        MaOtp maOtpMoi = new MaOtp();
        maOtpMoi.setMaNd(nguoiDung.getMaNguoiDung());
        maOtpMoi.setMaOtp(chuoiOtp);
        maOtpMoi.setHetHan(LocalDateTime.now().plusMinutes(3));
        maOtpMoi.setDaDung(false);
        maOtpRepository.save(maOtpMoi);

        String tieuDe = "Mã xác thực đặt lại mật khẩu - BookNest";
        String noiDung = "Chào " + nguoiDung.getHoTen() + ",\n\n"
                + "Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản BookNest.\n"
                + "Mã xác thực của bạn là: " + chuoiOtp + "\n\n"
                + "Mã có hiệu lực trong 3 phút.\n"
                + "Nếu không phải bạn yêu cầu, vui lòng bỏ qua email này.\n\n"
                + "Trân trọng,\n"
                + "Đội ngũ BookNest";

        try {
            mailService.guiEmail(yeuCauGuiOtp.getEmail(), tieuDe, noiDung);
        } catch (Exception e) {
            return new QuenMatKhauResponse(false, "Không thể gửi email. Vui lòng thử lại sau");
        }

        return new QuenMatKhauResponse(true, "Mã xác thực đã được gửi đến email của bạn");
    }

    public QuenMatKhauResponse xacThucOtpVaDatLaiMatKhau(XacThucOtpRequest yeuCau) {
        NguoiDung nguoiDung = nguoiDungRepository.findByEmail(yeuCau.getEmail())
                .orElse(null);

        if (nguoiDung == null) {
            return new QuenMatKhauResponse(false, "Email không tồn tại trong hệ thống");
        }

        MaOtp maOtp = maOtpRepository
                .findByMaNdAndMaOtpAndDaDungFalse(nguoiDung.getMaNguoiDung(), yeuCau.getOtp())
                .orElse(null);

        if (maOtp == null) {
            return new QuenMatKhauResponse(false, "Mã OTP không chính xác");
        }

        if (maOtp.getHetHan().isBefore(LocalDateTime.now())) {
            return new QuenMatKhauResponse(false, "Mã OTP đã hết hạn. Vui lòng yêu cầu lại");
        }

        if (!yeuCau.getMat_khau_moi().equals(yeuCau.getXac_nhan_mat_khau_moi())) {
            return new QuenMatKhauResponse(false, "Xác nhận mật khẩu không khớp");
        }

        nguoiDung.setMatKhau(passwordEncoder.encode(yeuCau.getMat_khau_moi()));
        nguoiDung.setSoLanDangNhapSai(0);
        nguoiDung.setKhoaDen(null);
        nguoiDung.setTrangThai(NguoiDung.TrangThai.hoat_dong);
        nguoiDungRepository.save(nguoiDung);

        maOtpRepository.delete(maOtp);

        return new QuenMatKhauResponse(true, "Đặt lại mật khẩu thành công");
    }

    // ===================== ADMIN - QUẢN LÝ NGƯỜI DÙNG =====================

    public DanhSachNguoiDungResponse layDanhSachNguoiDung(
            String tuKhoa, String vaiTro, String trangThai, int trang, int kichThuoc) {

        Pageable pageable = PageRequest.of(trang - 1, kichThuoc, Sort.by("ngayTao").descending());

        Long maVaiTro = null;
        if (vaiTro != null && !vaiTro.isEmpty()) {
            if ("quan_tri".equals(vaiTro)) maVaiTro = 2L;
            else if ("thanh_vien".equals(vaiTro)) maVaiTro = 1L;
        }

        NguoiDung.TrangThai trangThaiEnum = null;
        if (trangThai != null && !trangThai.isEmpty()) {
            try {
                trangThaiEnum = NguoiDung.TrangThai.valueOf(trangThai);
            } catch (IllegalArgumentException ignored) {}
        }

        Page<NguoiDung> page = nguoiDungRepository.timKiemNguoiDung(
                (tuKhoa != null && !tuKhoa.isEmpty()) ? tuKhoa : null,
                maVaiTro, trangThaiEnum, pageable);

        List<NguoiDungResponse.NguoiDungData> danhSach = page.getContent().stream()
                .map(this::chuyenDoiSangNguoiDungData)
                .collect(Collectors.toList());

        return new DanhSachNguoiDungResponse(
                danhSach,
                page.getNumber() + 1,
                page.getTotalPages(),
                page.getTotalElements());
    }

    public ChiTietNguoiDungResponse layChiTietNguoiDung(Long maNd) {
        NguoiDung nguoiDung = nguoiDungRepository.findById(maNd)
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));

        List<ChiTietNguoiDungResponse.DonHangItem> lichSu = donHangRepository
                .findTop10ByMaNdOrderByNgayTaoDesc(nguoiDung.getMaNguoiDung())
                .stream()
                .map(dh -> new ChiTietNguoiDungResponse.DonHangItem(
                        dh.getIdDh(),
                        dh.getMaDonHang(),
                        dh.getNgayTao(),
                        dh.getTongTien(),
                        dh.getTrangThai()))
                .collect(Collectors.toList());

        return new ChiTietNguoiDungResponse(chuyenDoiSangNguoiDungData(nguoiDung), lichSu);
    }

    @Transactional
    public NguoiDungResponse khoaMoKhoaTaiKhoan(Long maNd) {
        NguoiDung nguoiDung = nguoiDungRepository.findById(maNd)
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));

        if (nguoiDung.getVaiTro().getMaVaiTro().equals(2L)) {
            return new NguoiDungResponse(false, "Không thể khóa tài khoản quản trị viên", null);
        }

        String thongBao;
        if (nguoiDung.getTrangThai() == NguoiDung.TrangThai.hoat_dong) {
            nguoiDung.setTrangThai(NguoiDung.TrangThai.khoa);
            thongBao = "Đã khóa tài khoản thành công";
        } else {
            nguoiDung.setTrangThai(NguoiDung.TrangThai.hoat_dong);
            nguoiDung.setSoLanDangNhapSai(0);
            nguoiDung.setKhoaDen(null);
            thongBao = "Đã mở khóa tài khoản thành công";
        }

        nguoiDungRepository.save(nguoiDung);
        return new NguoiDungResponse(true, thongBao, chuyenDoiSangNguoiDungData(nguoiDung));
    }

    private NguoiDungResponse.NguoiDungData chuyenDoiSangNguoiDungData(NguoiDung nd) {
        String tenVaiTro = nd.getVaiTro().getMaVaiTro().equals(2L) ? "quan_tri" : "thanh_vien";
        return new NguoiDungResponse.NguoiDungData(
                nd.getMaNguoiDung(),
                nd.getHoTen(),
                nd.getEmail(),
                nd.getSoDienThoai(),
                tenVaiTro,
                nd.getTrangThai().name(),
                nd.getNgayTao(),
                nd.getLanDangNhapCuoi());
    }
}
