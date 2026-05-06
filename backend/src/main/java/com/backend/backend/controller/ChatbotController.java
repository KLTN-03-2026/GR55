package com.backend.backend.controller;

import com.backend.backend.dto.ChatRequest;
import com.backend.backend.dto.ChatResponse;
import com.backend.backend.service.ChatbotService;
import com.backend.backend.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chatbot")
@RequiredArgsConstructor
public class ChatbotController {

    private final ChatbotService chatbotService;
    private final JwtUtil jwtUtil;

    @PostMapping("/gui_tin_nhan")
    public ResponseEntity<ChatResponse> guiTinNhan(
            HttpServletRequest httpRequest,
            @RequestBody ChatRequest request) {
        if (request.getNoiDung() == null || request.getNoiDung().isBlank()) {
            return ResponseEntity.badRequest()
                    .body(new ChatResponse(false, "Nội dung tin nhắn không được để trống"));
        }
        Long maNd = layMaNdTuyChon(httpRequest);
        return ResponseEntity.ok(chatbotService.xuLyTinNhan(request.getMaPhien(), request.getNoiDung(), maNd));
    }

    private Long layMaNdTuyChon(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            try {
                return jwtUtil.layMaNdTuToken(authHeader.substring(7));
            } catch (Exception e) {
                return null;
            }
        }
        return null;
    }
}
