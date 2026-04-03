package com.backend.backend.service;

import com.backend.backend.dto.DanhMucRequest;
import com.backend.backend.dto.DanhMucResponse;
import com.backend.backend.dto.DanhSachDanhMucResponse;
import com.backend.backend.entity.DanhMucSach;
import com.backend.backend.repository.ChuongTrinhGiamGiaSachRepository;
import com.backend.backend.repository.DanhMucSachRepository;
import com.backend.backend.repository.GoiHoiVienSachRepository;
import com.backend.backend.repository.SachDanhMucRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DanhMucSachService {

    private final DanhMucSachRepository danhMucSachRepository;
    private final SachDanhMucRepository sachDanhMucRepository;
    private final ChuongTrinhGiamGiaSachRepository chuongTrinhGiamGiaSachRepository;
    private final GoiHoiVienSachRepository goiHoiVienSachRepository;

    @Cacheable(value = "danh_muc", key = "(#tenTimKiem != null ? #tenTimKiem : '') + '_' + #trang + '_' + #kichThuoc")
    public DanhSachDanhMucResponse layDanhSachDanhMuc(String tenTimKiem, int trang, int kichThuoc) {
        Pageable phanTrang = PageRequest.of(trang - 1, kichThuoc, Sort.by("ngayTao").descending());
        Page<DanhMucSach> trangKetQua;

        if (tenTimKiem != null && !tenTimKiem.trim().isEmpty()) {
            trangKetQua = danhMucSachRepository.findByTenDanhMucContainingIgnoreCase(tenTimKiem.trim(), phanTrang);
        } else {
            trangKetQua = danhMucSachRepository.findAll(phanTrang);
        }

        List<DanhMucResponse.DuLieuDanhMuc> danhSach = trangKetQua.getContent().stream()
                .map(dm -> new DanhMucResponse.DuLieuDanhMuc(
                        dm.getMaDm(),
                        dm.getTenDanhMuc(),
                        dm.getNgayTao(),
                        sachDanhMucRepository.countByMaDm(dm.getMaDm())
                ))
                .collect(Collectors.toList());

        return new DanhSachDanhMucResponse(
                danhSach,
                trangKetQua.getNumber() + 1,
                trangKetQua.getTotalPages(),
                trangKetQua.getTotalElements()
        );
    }

    @CacheEvict(value = "danh_muc", allEntries = true)
    public DanhMucResponse themDanhMuc(DanhMucRequest yeuCau) {
        if (danhMucSachRepository.existsByTenDanhMuc(yeuCau.getTen_danh_muc().trim())) {
            return new DanhMucResponse(false, "Tên danh mục đã tồn tại", null);
        }

        DanhMucSach danhMucMoi = new DanhMucSach();
        danhMucMoi.setTenDanhMuc(yeuCau.getTen_danh_muc().trim());
        DanhMucSach daLuu = danhMucSachRepository.save(danhMucMoi);

        return new DanhMucResponse(
                true,
                "Thêm danh mục thành công",
                new DanhMucResponse.DuLieuDanhMuc(daLuu.getMaDm(), daLuu.getTenDanhMuc(), daLuu.getNgayTao(), 0)
        );
    }

    @CacheEvict(value = "danh_muc", allEntries = true)
    public DanhMucResponse suaDanhMuc(Long maDm, DanhMucRequest yeuCau) {
        DanhMucSach danhMuc = danhMucSachRepository.findById(maDm)
                .orElse(null);

        if (danhMuc == null) {
            return new DanhMucResponse(false, "Danh mục không tồn tại", null);
        }

        if (danhMucSachRepository.existsByTenDanhMucAndMaDmNot(yeuCau.getTen_danh_muc().trim(), maDm)) {
            return new DanhMucResponse(false, "Tên danh mục đã tồn tại", null);
        }

        danhMuc.setTenDanhMuc(yeuCau.getTen_danh_muc().trim());
        DanhMucSach daCapNhat = danhMucSachRepository.save(danhMuc);

        int soLuongSach = sachDanhMucRepository.countByMaDm(maDm);
        return new DanhMucResponse(
                true,
                "Cập nhật danh mục thành công",
                new DanhMucResponse.DuLieuDanhMuc(daCapNhat.getMaDm(), daCapNhat.getTenDanhMuc(), daCapNhat.getNgayTao(), soLuongSach)
        );
    }

    @CacheEvict(value = "danh_muc", allEntries = true)
    @Transactional
    public DanhMucResponse xoaDanhMuc(Long maDm) {
        DanhMucSach danhMuc = danhMucSachRepository.findById(maDm)
                .orElse(null);

        if (danhMuc == null) {
            return new DanhMucResponse(false, "Danh mục không tồn tại", null);
        }

        int soLuongSach = sachDanhMucRepository.countByMaDm(maDm);
        if (soLuongSach > 0) {
            return new DanhMucResponse(false,
                    "Không thể xóa danh mục đang có " + soLuongSach + " sách", null);
        }

        if (chuongTrinhGiamGiaSachRepository.countSachTrongDanhMucCoGiamGia(maDm) > 0) {
            return new DanhMucResponse(false,
                    "Vui lòng xóa sách khỏi chương trình giảm giá trước khi xóa danh mục", null);
        }

        if (goiHoiVienSachRepository.countSachTrongDanhMucCoTrongGoiHoiVien(maDm) > 0) {
            return new DanhMucResponse(false,
                    "Vui lòng xóa sách khỏi gói hội viên trước khi xóa danh mục", null);
        }

        danhMucSachRepository.delete(danhMuc);
        return new DanhMucResponse(true, "Xóa danh mục thành công", null);
    }
}
