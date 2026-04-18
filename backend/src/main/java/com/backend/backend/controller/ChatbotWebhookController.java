package com.backend.backend.controller;

import com.backend.backend.dto.DialogflowRequest;
import com.backend.backend.dto.DialogflowResponse;
import com.backend.backend.service.ChatbotWebhookService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/webhook")
@RequiredArgsConstructor
public class ChatbotWebhookController {

    private final ChatbotWebhookService chatbotWebhookService;

    @PostMapping("/chatbot")
    public ResponseEntity<DialogflowResponse> xuLyWebhook(@RequestBody DialogflowRequest request) {
        DialogflowResponse response = chatbotWebhookService.xuLyWebhook(request);
        return ResponseEntity.ok(response);
    }
}
