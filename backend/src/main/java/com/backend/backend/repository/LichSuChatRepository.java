package com.backend.backend.repository;

import com.backend.backend.entity.LichSuChat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LichSuChatRepository extends JpaRepository<LichSuChat, Long> {
}
