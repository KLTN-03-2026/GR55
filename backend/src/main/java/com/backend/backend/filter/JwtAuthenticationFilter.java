package com.backend.backend.filter;

import com.backend.backend.service.CustomUserDetailsService;
import com.backend.backend.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final CustomUserDetailsService customUserDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest yeuCau,
                                    HttpServletResponse phanHoi,
                                    FilterChain chuoiFilter)
            throws ServletException, IOException {

        String tieuDeAuthorization = yeuCau.getHeader("Authorization");

        if (tieuDeAuthorization == null || !tieuDeAuthorization.startsWith("Bearer ")) {
            chuoiFilter.doFilter(yeuCau, phanHoi);
            return;
        }

        String token = tieuDeAuthorization.substring(7);

        if (!jwtUtil.xacThucToken(token)) {
            chuoiFilter.doFilter(yeuCau, phanHoi);
            return;
        }

        String email = jwtUtil.layEmailTuToken(token);

        if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails thongTinNguoiDung = customUserDetailsService.loadUserByUsername(email);

            UsernamePasswordAuthenticationToken xacThuc = new UsernamePasswordAuthenticationToken(
                    thongTinNguoiDung, null, thongTinNguoiDung.getAuthorities());
            xacThuc.setDetails(new WebAuthenticationDetailsSource().buildDetails(yeuCau));

            SecurityContextHolder.getContext().setAuthentication(xacThuc);
        }

        chuoiFilter.doFilter(yeuCau, phanHoi);
    }
}
