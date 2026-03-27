package com.backend.backend.repository;

import com.backend.backend.entity.SachYeuThich;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SachYeuThichRepository extends JpaRepository<SachYeuThich, Long> {

    @Query("SELECT COUNT(s) > 0 FROM SachYeuThich s WHERE s.maNd = :maNd AND s.maSach = :maSach")
    boolean daYeuThich(@Param("maNd") Long maNd, @Param("maSach") Long maSach);

    Optional<SachYeuThich> findByMaNdAndMaSach(Long maNd, Long maSach);
}
