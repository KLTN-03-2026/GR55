package com.backend.backend.repository;

import com.backend.backend.entity.LichSuChat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LichSuChatRepository extends JpaRepository<LichSuChat, Long> {

    List<LichSuChat> findTop10ByMaPhienOrderByNgayTaoDesc(String maPhien);

    @Query("SELECT l.yDinh FROM LichSuChat l WHERE l.maNd = :maNd AND l.yDinh IS NOT NULL ORDER BY l.ngayTao DESC")
    List<String> findYDinhMoiNhatByMaNd(@Param("maNd") Long maNd, org.springframework.data.domain.Pageable pageable);
}
