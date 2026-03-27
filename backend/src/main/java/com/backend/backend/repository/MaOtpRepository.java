package com.backend.backend.repository;

import com.backend.backend.entity.MaOtp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Repository
public interface MaOtpRepository extends JpaRepository<MaOtp, Long> {

    Optional<MaOtp> findByMaNdAndMaOtpAndDaDungFalse(Long maNd, String maOtp);

    @Transactional
    void deleteByMaNd(Long maNd);
}
