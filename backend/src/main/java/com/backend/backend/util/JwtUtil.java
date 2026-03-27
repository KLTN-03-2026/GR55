package com.backend.backend.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class JwtUtil {

    private final Key khoaBiMat;
    private final long thoiGianHetHan;
    private final Set<String> danhSachDenToken = ConcurrentHashMap.newKeySet();

    public JwtUtil(
            @Value("${jwt.secret}") String chuoiBiMat,
            @Value("${jwt.expiration}") long thoiGianHetHan) {
        this.khoaBiMat = Keys.hmacShaKeyFor(chuoiBiMat.getBytes());
        this.thoiGianHetHan = thoiGianHetHan;
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
        if (danhSachDenToken.contains(token)) {
            return false;
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
        danhSachDenToken.add(token);
    }

    private Claims layThongTinToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(khoaBiMat)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
