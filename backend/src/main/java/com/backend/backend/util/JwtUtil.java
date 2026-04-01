package com.backend.backend.util;

import com.backend.backend.service.TokenBlacklistService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;

@Component
public class JwtUtil {

    private final Key khoaBiMat;
    private final long thoiGianHetHan;
    private TokenBlacklistService tokenBlacklistService;

    public JwtUtil(
            @Value("${jwt.secret}") String chuoiBiMat,
            @Value("${jwt.expiration}") long thoiGianHetHan) {
        this.khoaBiMat = Keys.hmacShaKeyFor(chuoiBiMat.getBytes());
        this.thoiGianHetHan = thoiGianHetHan;
    }

    @Autowired
    public void setTokenBlacklistService(@Lazy TokenBlacklistService tokenBlacklistService) {
        this.tokenBlacklistService = tokenBlacklistService;
    }

    public String taoToken(String email, String vaiTro) {
        Date bayGio = new Date();
        Date hetHan = new Date(bayGio.getTime() + thoiGianHetHan);

        return Jwts.builder()
                .setSubject(email)
                .claim("vai_tro", vaiTro)
                .setIssuedAt(bayGio)
                .setExpiration(hetHan)
                .signWith(khoaBiMat, SignatureAlgorithm.HS256)
                .compact();
    }

    public boolean xacThucToken(String token) {
        try {
            if (tokenBlacklistService != null && tokenBlacklistService.laTrongDanhSachDen(token)) {
                return false;
            }
        } catch (Exception ignored) {
            // DB failure: treat as not blacklisted, continue validation
        }
        try {
            layThongTinToken(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    public String layEmailTuToken(String token) {
        return layThongTinToken(token).getSubject();
    }

    public String layVaiTroTuToken(String token) {
        return layThongTinToken(token).get("vai_tro", String.class);
    }

    public void themVaoDanhSachDen(String token) {
        if (tokenBlacklistService != null) {
            Date ngayHetHan = layThongTinToken(token).getExpiration();
            LocalDateTime hetHan = ngayHetHan.toInstant()
                    .atZone(ZoneId.systemDefault())
                    .toLocalDateTime();
            tokenBlacklistService.themVao(token, hetHan);
        }
    }

    private Claims layThongTinToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(khoaBiMat)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
