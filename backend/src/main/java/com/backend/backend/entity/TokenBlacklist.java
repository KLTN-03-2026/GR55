package com.backend.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "token_blacklist")
@Getter
@Setter
@NoArgsConstructor
public class TokenBlacklist {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 512)
    private String token;

    @Column(name = "het_han", nullable = false)
    private LocalDateTime hetHan;

    public TokenBlacklist(String token, LocalDateTime hetHan) {
        this.token = token;
        this.hetHan = hetHan;
    }
}
