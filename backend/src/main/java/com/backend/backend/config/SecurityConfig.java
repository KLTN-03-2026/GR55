package com.backend.backend.config;

import com.backend.backend.filter.JwtAuthenticationFilter;
import com.backend.backend.service.CustomUserDetailsService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final CustomUserDetailsService customUserDetailsService;

    @Bean
    public SecurityFilterChain chuoiBaoMat(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .sessionManagement(phienLamViec ->
                phienLamViec.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(phanQuyen ->
                phanQuyen
                    .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                    .requestMatchers("/api/auth/**").permitAll()
                    .requestMatchers("/api/home/**").permitAll()
                    .requestMatchers("/api/sach/**").permitAll()
                    .anyRequest().authenticated())
            .authenticationProvider(nhaXacThuc())
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationProvider nhaXacThuc() {
        DaoAuthenticationProvider nhaXacThuc = new DaoAuthenticationProvider();
        nhaXacThuc.setUserDetailsService(customUserDetailsService);
        nhaXacThuc.setPasswordEncoder(boMaHoaMatKhau());
        return nhaXacThuc;
    }

    @Bean
    public AuthenticationManager boQuanLyXacThuc(AuthenticationConfiguration cauHinhXacThuc) throws Exception {
        return cauHinhXacThuc.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder boMaHoaMatKhau() {
        return new BCryptPasswordEncoder();
    }
}
