package com.backend.backend.controller;

import com.backend.backend.dto.ChatRequest;
import com.backend.backend.dto.ChatResponse;
import com.backend.backend.service.ChatbotService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chatbot")
@RequiredArgsConstructor
public class ChatbotController {

    private final ChatbotService chatbotService;

    @PostMapping("/gui_tin_nhan")
    public ResponseEntity<ChatResponse> guiTinNhan(@RequestBody ChatRequest request) {
        if (request.getNoiDung() == null || request.getNoiDung().isBlank()) {
            return ResponseEntity.badRequest()
                    .body(new ChatResponse(false, "Nội dung tin nhắn không được để trống", null));
        }
        return ResponseEntity.ok(chatbotService.xuLyTinNhan(request.getMaPhien(), request.getNoiDung()));
    }
}
