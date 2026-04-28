package com.backend.backend.service;

import com.backend.backend.repository.DonHangRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.CacheManager;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class HuyDonHangScheduler {

    private final DonHangRepository donHangRepository;
    private final CacheManager cacheManager;

    private static final int TIMEOUT_PHUT = 15;

    @Scheduled(fixedDelay = 5 * 60 * 1000) // chạy mỗi 5 phút
    @Transactional
    public void huyCacDonHangQuaHan() {
        LocalDateTime deadline = LocalDateTime.now().minusMinutes(TIMEOUT_PHUT);
        int soLuong = donHangRepository.huyDonHangQuaHan(deadline);

        if (soLuong > 0) {
            log.info("Tự động hủy {} đơn hàng chờ thanh toán quá {} phút", soLuong, TIMEOUT_PHUT);
            xoaCache();
        }
    }

    private void xoaCache() {
        List.of("lich_su_don_hang", "chi_tiet_don_hang",
                "don_hang_admin", "chi_tiet_don_hang_admin",
                "thong_ke_tong_quan")
            .forEach(ten -> {
                var cache = cacheManager.getCache(ten);
                if (cache != null) cache.clear();
            });
    }
}
