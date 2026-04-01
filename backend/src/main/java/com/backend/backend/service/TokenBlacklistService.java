package com.backend.backend.service;

import com.backend.backend.entity.TokenBlacklist;
import com.backend.backend.repository.TokenBlacklistRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class TokenBlacklistService {

    private final TokenBlacklistRepository tokenBlacklistRepository;

    public void themVao(String token, LocalDateTime hetHan) {
        if (!tokenBlacklistRepository.existsByToken(token)) {
            tokenBlacklistRepository.save(new TokenBlacklist(token, hetHan));
        }
    }

    public boolean laTrongDanhSachDen(String token) {
        return tokenBlacklistRepository.existsByToken(token);
    }

    // Tự động dọn dẹp token đã hết hạn mỗi ngày lúc 2 giờ sáng
    @Scheduled(cron = "0 0 2 * * *")
    public void xoaTokenHetHan() {
        tokenBlacklistRepository.xoaTokenHetHan(LocalDateTime.now());
    }
}
