package com.backend.backend.service;

import com.backend.backend.entity.NguoiDung;
import com.backend.backend.repository.NguoiDungRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final NguoiDungRepository nguoiDungRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        NguoiDung nguoiDung = nguoiDungRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Không tìm thấy người dùng với email: " + email));

        String tenVaiTro = "ROLE_" + nguoiDung.getVaiTro().getTenVaiTro().toUpperCase();

        return new User(
                nguoiDung.getEmail(),
                nguoiDung.getMatKhau(),
                List.of(new SimpleGrantedAuthority(tenVaiTro))
        );
    }
}
