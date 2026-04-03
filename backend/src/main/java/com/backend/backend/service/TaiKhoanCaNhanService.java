package com.backend.backend.service;

import com.backend.backend.dto.CapNhatThongTinRequest;
import com.backend.backend.dto.DoiMatKhauRequest;
import com.backend.backend.dto.ThongTinNguoiDungResponse;
import com.backend.backend.entity.NguoiDung;
import com.backend.backend.repository.NguoiDungRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class TaiKhoanCaNhanService {

    private final NguoiDungRepository nguoiDungRepository;
    private final PasswordEncoder passwordEncoder;

    @Cacheable(value = "thong_tin_nguoi_dung", key = "#maNd")
    public ThongTinNguoiDungResponse layThongTin(Long maNd) {
        NguoiDung nguoiDung = nguoiDungRepository.findById(maNd)
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));

        return new ThongTinNguoiDungResponse(true, "Lấy thông tin thành công", xayDungThongTinData(nguoiDung));
    }

    @CacheEvict(value = "thong_tin_nguoi_dung", key = "#maNd")
    @Transactional
    public ThongTinNguoiDungResponse capNhatThongTin(Long maNd, CapNhatThongTinRequest yeuCau) {
        NguoiDung nguoiDung = nguoiDungRepository.findById(maNd)
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));

        nguoiDung.setHoTen(yeuCau.getHo_ten());
        nguoiDung.setSoDienThoai(yeuCau.getSo_dien_thoai());
        nguoiDungRepository.save(nguoiDung);

        return new ThongTinNguoiDungResponse(true, "Cập nhật thông tin thành công", xayDungThongTinData(nguoiDung));
    }

    @CacheEvict(value = "thong_tin_nguoi_dung", key = "#maNd")
    @Transactional
    public ThongTinNguoiDungResponse doiMatKhau(Long maNd, DoiMatKhauRequest yeuCau) {
        NguoiDung nguoiDung = nguoiDungRepository.findById(maNd)
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));

        if (!passwordEncoder.matches(yeuCau.getMat_khau_cu(), nguoiDung.getMatKhau())) {
            return new ThongTinNguoiDungResponse(false, "Mật khẩu cũ không chính xác", null);
        }

        if (!yeuCau.getMat_khau_moi().equals(yeuCau.getXac_nhan_mat_khau())) {
            return new ThongTinNguoiDungResponse(false, "Mật khẩu mới và xác nhận mật khẩu không khớp", null);
        }

        nguoiDung.setMatKhau(passwordEncoder.encode(yeuCau.getMat_khau_moi()));
        nguoiDungRepository.save(nguoiDung);

        return new ThongTinNguoiDungResponse(true, "Đổi mật khẩu thành công", null);
    }

    private ThongTinNguoiDungResponse.ThongTinData xayDungThongTinData(NguoiDung nguoiDung) {
        String vaiTro = nguoiDung.getVaiTro().getMaVaiTro().equals(2L) ? "quan_tri" : "thanh_vien";
        return new ThongTinNguoiDungResponse.ThongTinData(
                nguoiDung.getMaNguoiDung(),
                nguoiDung.getHoTen(),
                nguoiDung.getEmail(),
                nguoiDung.getSoDienThoai(),
                vaiTro
        );
    }
}
