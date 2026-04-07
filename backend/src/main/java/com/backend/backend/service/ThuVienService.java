package com.backend.backend.service;

import com.backend.backend.dto.SachThuVienResponse;
import com.backend.backend.dto.YeuThichResponse;
import com.backend.backend.entity.Sach;
import com.backend.backend.entity.SachYeuThich;
import com.backend.backend.entity.TienDoDocSach;
import com.backend.backend.repository.DonHangRepository;
import com.backend.backend.repository.SachRepository;
import com.backend.backend.repository.SachYeuThichRepository;
import com.backend.backend.repository.TienDoDocSachRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ThuVienService {

    private final DonHangRepository donHangRepository;
    private final SachRepository sachRepository;
    private final SachYeuThichRepository sachYeuThichRepository;
    private final TienDoDocSachRepository tienDoDocSachRepository;

    // ── Sách đã mua ──────────────────────────────────────────────────────────

    @Cacheable(value = "sach_da_mua", key = "#maNd + '_' + #trang + '_' + #kichThuoc")
    public SachThuVienResponse laySachDaMua(Long maNd, int trang, int kichThuoc) {
        Pageable pageable = PageRequest.of(trang - 1, kichThuoc);
        Page<Object[]> page = donHangRepository.findSachDaMuaByMaNd(maNd, pageable);

        // Batch load sách — 1 query thay vì N queries
        List<Long> dsMaSach = page.getContent().stream()
                .map(row -> ((Number) row[0]).longValue())
                .collect(Collectors.toList());
        Map<Long, Sach> sachMap = sachRepository.findAllById(dsMaSach)
                .stream()
                .collect(Collectors.toMap(Sach::getMaSach, s -> s));

        List<SachThuVienResponse.SachThuVienData> danhSach = page.getContent().stream()
                .map(row -> {
                    Long maSach = ((Number) row[0]).longValue();
                    LocalDateTime ngayMua = row[1] != null
                            ? ((Timestamp) row[1]).toLocalDateTime()
                            : null;
                    Sach sach = sachMap.get(maSach);
                    if (sach == null) return null;
                    return new SachThuVienResponse.SachThuVienData(
                            sach.getMaSach(), sach.getTenSach(), sach.getTacGia(),
                            sach.getAnhBiaUrl(), sach.getGia(), ngayMua, null, null);
                })
                .filter(d -> d != null)
                .collect(Collectors.toList());

        return new SachThuVienResponse(true, "Lấy sách đã mua thành công", danhSach,
                trang, page.getTotalPages(), page.getTotalElements());
    }

    // ── Sách yêu thích ────────────────────────────────────────────────────────

    @Cacheable(value = "sach_yeu_thich", key = "#maNd + '_' + #trang + '_' + #kichThuoc")
    public YeuThichResponse laySachYeuThich(Long maNd, int trang, int kichThuoc) {
        Pageable pageable = PageRequest.of(trang - 1, kichThuoc);
        Page<SachYeuThich> page = sachYeuThichRepository.findByMaNd(maNd, pageable);

        // Batch load sách — 1 query thay vì N queries
        List<Long> dsMaSach = page.getContent().stream()
                .map(SachYeuThich::getMaSach)
                .collect(Collectors.toList());
        Map<Long, Sach> sachMap = sachRepository.findAllById(dsMaSach)
                .stream()
                .filter(s -> !Boolean.TRUE.equals(s.getDaXoa()))
                .collect(Collectors.toMap(Sach::getMaSach, s -> s));

        List<YeuThichResponse.SachYeuThichData> danhSach = page.getContent().stream()
                .map(yt -> {
                    Sach sach = sachMap.get(yt.getMaSach());
                    if (sach == null) return null;
                    return new YeuThichResponse.SachYeuThichData(
                            sach.getMaSach(), sach.getTenSach(), sach.getTacGia(),
                            sach.getAnhBiaUrl(), sach.getGia());
                })
                .filter(d -> d != null)
                .collect(Collectors.toList());

        return new YeuThichResponse(true, "Lấy sách yêu thích thành công", danhSach,
                trang, page.getTotalPages(), page.getTotalElements());
    }

    @CacheEvict(value = "sach_yeu_thich", allEntries = true)
    @Transactional
    public YeuThichResponse themYeuThich(Long maNd, Long maSach) {
        Sach sach = sachRepository.findById(maSach).orElse(null);
        if (sach == null || Boolean.TRUE.equals(sach.getDaXoa())) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Sách không tồn tại");
        }
        if (sachYeuThichRepository.daYeuThich(maNd, maSach)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Sách đã có trong danh sách yêu thích");
        }

        SachYeuThich yeuThich = new SachYeuThich();
        yeuThich.setMaNd(maNd);
        yeuThich.setMaSach(maSach);
        sachYeuThichRepository.save(yeuThich);

        return new YeuThichResponse(true, "Đã thêm vào yêu thích", null, 0, 0, 0);
    }

    @CacheEvict(value = "sach_yeu_thich", allEntries = true)
    @Transactional
    public YeuThichResponse xoaYeuThich(Long maNd, Long maSach) {
        SachYeuThich yeuThich = sachYeuThichRepository.findByMaNdAndMaSach(maNd, maSach)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Sách không có trong danh sách yêu thích"));
        sachYeuThichRepository.deleteById(yeuThich.getIdYt());

        return new YeuThichResponse(true, "Đã xóa khỏi yêu thích", null, 0, 0, 0);
    }

    // ── Sách đang đọc ─────────────────────────────────────────────────────────

    public SachThuVienResponse laySachDangDoc(Long maNd, int trang, int kichThuoc) {
        Pageable pageable = PageRequest.of(trang - 1, kichThuoc);
        Page<TienDoDocSach> page = tienDoDocSachRepository.findSachDangDoc(maNd, pageable);

        // Batch load sách — 1 query thay vì N queries
        List<Long> dsMaSach = page.getContent().stream()
                .map(TienDoDocSach::getMaSach)
                .collect(Collectors.toList());
        Map<Long, Sach> sachMap = sachRepository.findAllById(dsMaSach)
                .stream()
                .collect(Collectors.toMap(Sach::getMaSach, s -> s));

        List<SachThuVienResponse.SachThuVienData> danhSach = page.getContent().stream()
                .map(td -> {
                    Sach sach = sachMap.get(td.getMaSach());
                    if (sach == null) return null;
                    return new SachThuVienResponse.SachThuVienData(
                            sach.getMaSach(), sach.getTenSach(), sach.getTacGia(),
                            sach.getAnhBiaUrl(), sach.getGia(),
                            null, td.getTrangHienTai(), td.getPhanTram());
                })
                .filter(d -> d != null)
                .collect(Collectors.toList());

        return new SachThuVienResponse(true, "Lấy sách đang đọc thành công", danhSach,
                trang, page.getTotalPages(), page.getTotalElements());
    }
}
