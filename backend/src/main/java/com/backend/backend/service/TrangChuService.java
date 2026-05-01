package com.backend.backend.service;

import com.backend.backend.dto.*;
import com.backend.backend.entity.DanhMucSach;
import com.backend.backend.entity.Sach;
import com.backend.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TrangChuService {

    private final SachRepository sachRepository;
    private final DanhMucSachRepository danhMucSachRepository;
    private final TienDoDocSachRepository tienDoDocSachRepository;
    private final SachDanhMucRepository sachDanhMucRepository;
    private final QuanLyGiamGiaService quanLyGiamGiaService;

    private SachHomeResponse chuyenDoiSachSangDto(Sach sach) {
        GiamGiaInfo info = quanLyGiamGiaService.layGiamGiaInfo(sach.getMaSach());
        return new SachHomeResponse(
                sach.getMaSach(),
                sach.getTenSach(),
                sach.getTacGia(),
                sach.getGia(),
                sach.getAnhBiaUrl(),
                sach.getDanhGiaTrungBinh() != null ? sach.getDanhGiaTrungBinh().doubleValue() : 0.0,
                sach.getLuotXem() != null ? sach.getLuotXem() : 0,
                sach.getSoLuongDaBan() != null ? sach.getSoLuongDaBan() : 0,
                info != null ? info.getGia_sau_giam() : null,
                info != null ? info.getNhan_giam() : null);
    }

    private DanhSachSachHomeResponse taoKetQuaPhanTrang(Page<Sach> page) {
        List<SachHomeResponse> danhSach = page.getContent().stream()
                .map(this::chuyenDoiSachSangDto)
                .collect(Collectors.toList());
        return new DanhSachSachHomeResponse(
                danhSach,
                page.getNumber() + 1,
                page.getTotalPages(),
                page.getTotalElements());
    }

    @Cacheable(value = "danh_muc_trang_chu", key = "'all'")
    public List<DanhMucHomeResponse> layDanhSachDanhMuc() {
        return danhMucSachRepository.findAllOrderByTen().stream()
                .map(dm -> new DanhMucHomeResponse(
                        dm.getMaDm(),
                        dm.getTenDanhMuc(),
                        danhMucSachRepository.countSachByDanhMuc(dm.getMaDm())))
                .collect(Collectors.toList());
    }

    @Cacheable(value = "sach_noi_bat", key = "#trang + '_' + #kichThuoc")
    public DanhSachSachHomeResponse laySachNoiBat(int trang, int kichThuoc) {
        Pageable pageable = PageRequest.of(trang - 1, kichThuoc);
        return taoKetQuaPhanTrang(sachRepository.findSachNoiBat(pageable));
    }

    @Cacheable(value = "sach_mien_phi", key = "#trang + '_' + #kichThuoc")
    public DanhSachSachHomeResponse laySachMienPhi(int trang, int kichThuoc) {
        Pageable pageable = PageRequest.of(trang - 1, kichThuoc);
        return taoKetQuaPhanTrang(sachRepository.findSachMienPhi(pageable));
    }

    @Cacheable(value = "sach_hoi_vien", key = "#trang + '_' + #kichThuoc")
    public DanhSachSachHomeResponse laySachHoiVien(int trang, int kichThuoc) {
        Pageable pageable = PageRequest.of(trang - 1, kichThuoc);
        return taoKetQuaPhanTrang(sachRepository.findSachHoiVien(pageable));
    }

    @Cacheable(value = "sach_goi_y", key = "#trang + '_' + #kichThuoc", condition = "#maNd == null")
    public DanhSachSachHomeResponse laySachGoiY(Long maNd, int trang, int kichThuoc) {
        Pageable pageable = PageRequest.of(trang - 1, kichThuoc);
        Page<Sach> page;

        if (maNd == null) {
            page = sachRepository.findSachNoiBat(pageable);
        } else {
            List<Long> sachDaDoc = tienDoDocSachRepository.findSachDaDocByUserId(maNd);
            if (sachDaDoc.isEmpty()) {
                page = sachRepository.findSachNoiBat(pageable);
            } else {
                List<Long> danhMucIds = sachDanhMucRepository.findDanhMucIdsBySachIds(sachDaDoc);
                if (danhMucIds.isEmpty()) {
                    page = sachRepository.findSachNoiBat(pageable);
                } else {
                    page = sachRepository.findSachGoiYThanhVien(maNd, danhMucIds, pageable);
                }
            }
        }

        return taoKetQuaPhanTrang(page);
    }
}
