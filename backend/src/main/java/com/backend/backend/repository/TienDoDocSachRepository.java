package com.backend.backend.repository;

import com.backend.backend.entity.TienDoDocSach;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TienDoDocSachRepository extends JpaRepository<TienDoDocSach, Long> {

    @Query("SELECT DISTINCT td.maSach FROM TienDoDocSach td WHERE td.maNd = :maNd")
    List<Long> findSachDaDocByUserId(@Param("maNd") Long maNd);
}
