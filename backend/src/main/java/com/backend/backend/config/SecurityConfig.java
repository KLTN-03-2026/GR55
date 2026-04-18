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
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

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
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(AbstractHttpConfigurer::disable)
            .sessionManagement(phienLamViec ->
                phienLamViec.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(phanQuyen ->
                phanQuyen
                    .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                    .requestMatchers("/error").permitAll()
                    .requestMatchers("/api/auth/**").permitAll()
                    .requestMatchers("/api/home/**").permitAll()
                    .requestMatchers("/api/sach/**").permitAll()
                    .requestMatchers("/api/doc_sach_mien_phi/**").permitAll()
                    .requestMatchers("/api/doc_thu/**").permitAll()
                    .requestMatchers("/api/tim_kiem/**").permitAll()
                    .requestMatchers("/api/the_loai/**").permitAll()
                    .requestMatchers("/api/goi_y/**").permitAll()
                    .requestMatchers("/api/webhook/**").permitAll()
                    .anyRequest().authenticated())
            .authenticationProvider(nhaXacThuc())
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:3000"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    AuthenticationProvider nhaXacThuc() {
        DaoAuthenticationProvider nhaXacThuc = new DaoAuthenticationProvider();
        nhaXacThuc.setUserDetailsService(customUserDetailsService);
        nhaXacThuc.setPasswordEncoder(boMaHoaMatKhau());
        return nhaXacThuc;
    }

    @Bean
    AuthenticationManager boQuanLyXacThuc(AuthenticationConfiguration cauHinhXacThuc) throws Exception {
        return cauHinhXacThuc.getAuthenticationManager();
    }

    @Bean
    PasswordEncoder boMaHoaMatKhau() {
        return new BCryptPasswordEncoder();
    }
}
