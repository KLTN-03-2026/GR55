package com.backend.backend.service;

import com.backend.backend.dto.SachGiamGiaHomepageResponse;
import com.backend.backend.entity.ChuongTrinhGiamGia;
import com.backend.backend.entity.Sach;
import com.backend.backend.repository.ChuongTrinhGiamGiaRepository;
import com.backend.backend.repository.ChuongTrinhGiamGiaSachRepository;
import com.backend.backend.repository.SachRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.text.NumberFormat;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GiamGiaPublicService {

    private final ChuongTrinhGiamGiaRepository chuongTrinhGiamGiaRepository;
    private final ChuongTrinhGiamGiaSachRepository chuongTrinhGiamGiaSachRepository;
    private final SachRepository sachRepository;

    private static final int SO_SACH_HIEN_THI = 12;

    @Cacheable(value = "giam_gia_home")
    public SachGiamGiaHomepageResponse laySachGiamGia() {
        LocalDateTime now = LocalDateTime.now();
        List<ChuongTrinhGiamGia> chuongTrinhList = chuongTrinhGiamGiaRepository.findDangHoatDong(now);

        if (chuongTrinhList.isEmpty()) {
            return new SachGiamGiaHomepageResponse(true, Collections.emptyList(), Collections.emptyList());
        }

        // Load sachIds cho mỗi chương trình một lần duy nhất
        Map<Long, List<Long>> ctSachIdsMap = new LinkedHashMap<>();
        Set<Long> allSachIds = new LinkedHashSet<>();
        for (ChuongTrinhGiamGia ct : chuongTrinhList) {
            List<Long> ids = chuongTrinhGiamGiaSachRepository.findSachIdsByMaCt(ct.getMaCt());
            ctSachIdsMap.put(ct.getMaCt(), ids);
            allSachIds.addAll(ids);
        }

        if (allSachIds.isEmpty()) {
            return new SachGiamGiaHomepageResponse(true,
                    buildChuongTrinhItems(chuongTrinhList, ctSachIdsMap, Collections.emptyMap()),
                    Collections.emptyList());
        }

        Map<Long, Sach> sachMap = sachRepository.findAllById(allSachIds).stream()
                .collect(Collectors.toMap(Sach::getMaSach, s -> s));

        // Tab "Tất cả": mỗi sách lấy chương trình cho mức giảm tiền cao nhất
        Map<Long, BigDecimal> giaSauGiamMap = new HashMap<>();
        Map<Long, String> nhanGiamMap = new HashMap<>();
        Map<Long, Double> sachBestTienGiamMap = new HashMap<>();

        for (ChuongTrinhGiamGia ct : chuongTrinhList) {
            for (Long maSach : ctSachIdsMap.get(ct.getMaCt())) {
                Sach sach = sachMap.get(maSach);
                if (sach == null) continue;
                BigDecimal giaSauGiam = tinhGiaSauGiam(sach.getGia(), ct);
                double tienGiam = sach.getGia().subtract(giaSauGiam).doubleValue();
                if (!sachBestTienGiamMap.containsKey(maSach) || tienGiam > sachBestTienGiamMap.get(maSach)) {
                    sachBestTienGiamMap.put(maSach, tienGiam);
                    giaSauGiamMap.put(maSach, giaSauGiam);
                    nhanGiamMap.put(maSach, taoNhanGiam(ct));
                }
            }
        }

        List<SachGiamGiaHomepageResponse.SachGiamGiaItem> danhSachTatCa = sachBestTienGiamMap.entrySet().stream()
                .sorted((a, b) -> Double.compare(b.getValue(), a.getValue()))
                .limit(SO_SACH_HIEN_THI)
                .map(entry -> {
                    Sach sach = sachMap.get(entry.getKey());
                    return toItem(sach, giaSauGiamMap.get(sach.getMaSach()), nhanGiamMap.get(sach.getMaSach()));
                })
                .collect(Collectors.toList());

        return new SachGiamGiaHomepageResponse(true,
                buildChuongTrinhItems(chuongTrinhList, ctSachIdsMap, sachMap),
                danhSachTatCa);
    }

    private List<SachGiamGiaHomepageResponse.ChuongTrinhItem> buildChuongTrinhItems(
            List<ChuongTrinhGiamGia> list,
            Map<Long, List<Long>> ctSachIdsMap,
            Map<Long, Sach> sachMap) {
        return list.stream()
                .map(ct -> {
                    List<Long> sachIds = ctSachIdsMap.getOrDefault(ct.getMaCt(), Collections.emptyList());
                    List<SachGiamGiaHomepageResponse.SachGiamGiaItem> sachItems = sachIds.stream()
                            .map(sachMap::get)
                            .filter(Objects::nonNull)
                            .map(sach -> toItem(sach, tinhGiaSauGiam(sach.getGia(), ct), taoNhanGiam(ct)))
                            .sorted((a, b) -> Double.compare(
                                    b.getGia_goc().subtract(b.getGia_sau_giam()).doubleValue(),
                                    a.getGia_goc().subtract(a.getGia_sau_giam()).doubleValue()))
                            .limit(SO_SACH_HIEN_THI)
                            .collect(Collectors.toList());
                    return new SachGiamGiaHomepageResponse.ChuongTrinhItem(
                            ct.getMaCt(), ct.getTenChuongTrinh(), ct.getLoaiGiam(), ct.getGiaTriGiam(),
                            ct.getNgayKetThuc(), sachIds.size(), sachItems);
                })
                .collect(Collectors.toList());
    }

    private SachGiamGiaHomepageResponse.SachGiamGiaItem toItem(Sach sach, BigDecimal giaSauGiam, String nhanGiam) {
        double danhGia = sach.getDanhGiaTrungBinh() != null ? sach.getDanhGiaTrungBinh().doubleValue() : 0.0;
        return new SachGiamGiaHomepageResponse.SachGiamGiaItem(
                sach.getMaSach(), sach.getTenSach(), sach.getTacGia(), sach.getAnhBiaUrl(),
                sach.getGia(), giaSauGiam, nhanGiam, danhGia, sach.getSoLuongDaBan());
    }

    public Map<Long, BigDecimal> layGiaSauGiamBatch(Set<Long> sachIds, Map<Long, BigDecimal> giaGocMap) {
        if (sachIds == null || sachIds.isEmpty()) return Collections.emptyMap();
        LocalDateTime now = LocalDateTime.now();
        List<ChuongTrinhGiamGia> programs = chuongTrinhGiamGiaRepository.findDangHoatDong(now);
        if (programs.isEmpty()) return Collections.emptyMap();

        Map<Long, BigDecimal> giaSauGiamMap = new HashMap<>();
        Map<Long, Double> bestTienGiamMap = new HashMap<>();

        for (ChuongTrinhGiamGia ct : programs) {
            List<Long> ctSachIds = chuongTrinhGiamGiaSachRepository.findSachIdsByMaCt(ct.getMaCt());
            for (Long maSach : ctSachIds) {
                if (!sachIds.contains(maSach)) continue;
                BigDecimal giaGoc = giaGocMap.get(maSach);
                if (giaGoc == null || giaGoc.compareTo(BigDecimal.ZERO) == 0) continue;
                BigDecimal giaSauGiam = tinhGiaSauGiam(giaGoc, ct);
                double tienGiam = giaGoc.subtract(giaSauGiam).doubleValue();
                if (!bestTienGiamMap.containsKey(maSach) || tienGiam > bestTienGiamMap.get(maSach)) {
                    bestTienGiamMap.put(maSach, tienGiam);
                    giaSauGiamMap.put(maSach, giaSauGiam);
                }
            }
        }
        return giaSauGiamMap;
    }

    private BigDecimal tinhGiaSauGiam(BigDecimal gia, ChuongTrinhGiamGia ct) {
        if ("phan_tram".equals(ct.getLoaiGiam())) {
            return gia.multiply(BigDecimal.valueOf(1 - ct.getGiaTriGiam().doubleValue() / 100))
                      .setScale(0, RoundingMode.HALF_UP);
        }
        BigDecimal result = gia.subtract(ct.getGiaTriGiam());
        return result.compareTo(BigDecimal.ZERO) < 0 ? BigDecimal.ZERO : result;
    }

    private String taoNhanGiam(ChuongTrinhGiamGia ct) {
        if ("phan_tram".equals(ct.getLoaiGiam())) {
            return "-" + ct.getGiaTriGiam().stripTrailingZeros().toPlainString() + "%";
        }
        return "-" + NumberFormat.getNumberInstance(Locale.forLanguageTag("vi-VN"))
                                 .format(ct.getGiaTriGiam().longValue()) + "đ";
    }
}
