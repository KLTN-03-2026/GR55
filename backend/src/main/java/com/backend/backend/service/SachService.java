package com.backend.backend.service;

import com.backend.backend.dto.DanhSachSachResponse;
import com.backend.backend.dto.SachRequest;
import com.backend.backend.dto.SachResponse;
import com.backend.backend.entity.DanhMucSach;
import com.backend.backend.entity.Sach;
import com.backend.backend.entity.SachDanhMuc;
import com.backend.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SachService {

    private final SachRepository sachRepository;
    private final SachDanhMucRepository sachDanhMucRepository;
    private final DanhMucSachRepository danhMucSachRepository;
    private final DonHangRepository donHangRepository;
    private final ChuongTrinhGiamGiaSachRepository chuongTrinhGiamGiaSachRepository;
    private final GoiHoiVienSachRepository goiHoiVienSachRepository;
    private final S3Service s3Service;

    public DanhSachSachResponse layDanhSachSach(String tuKhoa, Long maDanhMuc, int trang, int kichThuoc) {
        Pageable phanTrang = PageRequest.of(trang - 1, kichThuoc, Sort.by("ngayTao").descending());

        String tuKhoaLoc = (tuKhoa != null && !tuKhoa.trim().isEmpty()) ? tuKhoa.trim() : null;
        Long maDmLoc = (maDanhMuc != null && maDanhMuc > 0) ? maDanhMuc : null;

        Page<Sach> trangKetQua = sachRepository.timKiemVaLocSach(tuKhoaLoc, maDmLoc, phanTrang);

        List<SachResponse.DuLieuSach> danhSach = trangKetQua.getContent().stream()
                .map(this::chuyenSangDuLieuSach)
                .collect(Collectors.toList());

        return new DanhSachSachResponse(
                danhSach,
                trangKetQua.getNumber() + 1,
                trangKetQua.getTotalPages(),
                trangKetQua.getTotalElements()
        );
    }

    @Transactional
    public SachResponse themSachMoi(SachRequest yeuCau, MultipartFile anhBia, MultipartFile filePdf) throws IOException {
        if (sachRepository.existsByTenSachAndDaXoaFalse(yeuCau.getTen_sach().trim())) {
            return new SachResponse(false, "Tên sách đã tồn tại trong hệ thống", null);
        }

        if (anhBia == null || anhBia.isEmpty()) {
            return new SachResponse(false, "Vui lòng chọn ảnh bìa", null);
        }
        if (filePdf == null || filePdf.isEmpty()) {
            return new SachResponse(false, "Vui lòng chọn file PDF", null);
        }

        String urlAnhBia = s3Service.uploadFile(anhBia, "covers/");
        String urlPdf;
        try {
            urlPdf = s3Service.uploadFile(filePdf, "books/");
        } catch (IOException e) {
            s3Service.xoaFile(urlAnhBia);
            throw e;
        }

        Sach sachMoi = new Sach();
        sachMoi.setTenSach(yeuCau.getTen_sach().trim());
        sachMoi.setTacGia(yeuCau.getTac_gia().trim());
        sachMoi.setMoTa(yeuCau.getMo_ta());
        sachMoi.setGia(yeuCau.getGia());
        sachMoi.setAnhBiaUrl(urlAnhBia);
        sachMoi.setFilePdfUrl(urlPdf);
        sachMoi.setChoPhepDocThu(Boolean.TRUE.equals(yeuCau.getCho_phep_doc_thu()));
        sachMoi.setSoTrangDocThu(yeuCau.getSo_trang_doc_thu() != null ? yeuCau.getSo_trang_doc_thu() : 5);

        Sach daLuu = sachRepository.save(sachMoi);
        luuDanhMuc(daLuu.getMaSach(), yeuCau.getDanh_muc_ids());

        return new SachResponse(true, "Thêm sách thành công", chuyenSangDuLieuSach(daLuu));
    }

    @Transactional
    public SachResponse suaSach(Long maSach, SachRequest yeuCau, MultipartFile anhBia, MultipartFile filePdf) throws IOException {
        Sach sach = sachRepository.findById(maSach).orElse(null);
        if (sach == null || Boolean.TRUE.equals(sach.getDaXoa())) {
            return new SachResponse(false, "Sách không tồn tại", null);
        }

        if (sachRepository.existsByTenSachAndMaSachNotAndDaXoaFalse(yeuCau.getTen_sach().trim(), maSach)) {
            return new SachResponse(false, "Tên sách đã tồn tại trong hệ thống", null);
        }

        if (anhBia != null && !anhBia.isEmpty()) {
            s3Service.xoaFile(sach.getAnhBiaUrl());
            sach.setAnhBiaUrl(s3Service.uploadFile(anhBia, "covers/"));
        }
        if (filePdf != null && !filePdf.isEmpty()) {
            s3Service.xoaFile(sach.getFilePdfUrl());
            sach.setFilePdfUrl(s3Service.uploadFile(filePdf, "books/"));
        }

        sach.setTenSach(yeuCau.getTen_sach().trim());
        sach.setTacGia(yeuCau.getTac_gia().trim());
        sach.setMoTa(yeuCau.getMo_ta());
        sach.setGia(yeuCau.getGia());
        sach.setChoPhepDocThu(Boolean.TRUE.equals(yeuCau.getCho_phep_doc_thu()));
        sach.setSoTrangDocThu(yeuCau.getSo_trang_doc_thu() != null ? yeuCau.getSo_trang_doc_thu() : 5);

        Sach daCapNhat = sachRepository.save(sach);

        sachDanhMucRepository.deleteByMaSach(maSach);
        luuDanhMuc(maSach, yeuCau.getDanh_muc_ids());

        return new SachResponse(true, "Cập nhật sách thành công", chuyenSangDuLieuSach(daCapNhat));
    }

    @Transactional
    public SachResponse xoaSach(Long maSach) {
        Sach sach = sachRepository.findById(maSach).orElse(null);
        if (sach == null || Boolean.TRUE.equals(sach.getDaXoa())) {
            return new SachResponse(false, "Sách không tồn tại", null);
        }

        if (donHangRepository.kiemTraSachDaBan(maSach)) {
            return new SachResponse(false, "Không thể xóa sách đã có người mua", null);
        }
        if (chuongTrinhGiamGiaSachRepository.existsByMaSach(maSach)) {
            return new SachResponse(false, "Vui lòng xóa sách khỏi chương trình giảm giá trước", null);
        }
        if (goiHoiVienSachRepository.existsByMaSach(maSach)) {
            return new SachResponse(false, "Vui lòng xóa sách khỏi gói hội viên trước", null);
        }

        s3Service.xoaFile(sach.getAnhBiaUrl());
        s3Service.xoaFile(sach.getFilePdfUrl());

        sach.setDaXoa(true);
        sach.setNgayXoa(LocalDateTime.now());
        sachRepository.save(sach);

        return new SachResponse(true, "Xóa sách thành công", null);
    }

    private void luuDanhMuc(Long maSach, List<Long> danhMucIds) {
        if (danhMucIds == null || danhMucIds.isEmpty()) return;
        for (Long maDm : danhMucIds) {
            if (danhMucSachRepository.existsById(maDm)) {
                SachDanhMuc lienKet = new SachDanhMuc();
                lienKet.setMaSach(maSach);
                lienKet.setMaDm(maDm);
                sachDanhMucRepository.save(lienKet);
            }
        }
    }

    private SachResponse.DuLieuSach chuyenSangDuLieuSach(Sach sach) {
        List<SachDanhMuc> cácLienKet = sachDanhMucRepository.findByMaSach(sach.getMaSach());

        List<Long> danhMucIds = cácLienKet.stream()
                .map(SachDanhMuc::getMaDm)
                .collect(Collectors.toList());

        List<String> tenDanhMuc = cácLienKet.stream()
                .map(lk -> danhMucSachRepository.findById(lk.getMaDm())
                        .map(DanhMucSach::getTenDanhMuc).orElse(""))
                .filter(ten -> !ten.isEmpty())
                .collect(Collectors.toList());

        return new SachResponse.DuLieuSach(
                sach.getMaSach(),
                sach.getTenSach(),
                sach.getTacGia(),
                sach.getMoTa(),
                sach.getGia(),
                sach.getAnhBiaUrl(),
                sach.getFilePdfUrl(),
                sach.getChoPhepDocThu(),
                sach.getSoTrangDocThu(),
                sach.getLuotXem(),
                sach.getDanhGiaTrungBinh(),
                danhMucIds,
                tenDanhMuc,
                sach.getNgayTao()
        );
    }
}
