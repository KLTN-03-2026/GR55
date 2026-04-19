package com.backend.backend.service;

import com.backend.backend.dto.ChatResponse;
import com.backend.backend.entity.LichSuChat;
import com.backend.backend.repository.LichSuChatRepository;
import com.backend.backend.repository.SachRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatbotService {

    private final LichSuChatRepository lichSuChatRepository;
    private final GeminiService geminiService;
    private final SachRepository sachRepository;

    public ChatResponse xuLyTinNhan(String maPhien, String noiDung) {
        List<LichSuChat> lichSu = lichSuChatRepository.findTop10ByMaPhienOrderByNgayTaoDesc(maPhien);
        Collections.reverse(lichSu);

        luuTinNhan(maPhien, "user", noiDung);

        GeminiService.KetQuaGemini ketQua = geminiService.goiGemini(noiDung, lichSu);

        luuTinNhan(maPhien, "bot", ketQua.vanBan());

        List<ChatResponse.SachData> sachGoiY = null;
        if (ketQua.tuKhoaTimSach() != null && !ketQua.tuKhoaTimSach().isBlank()) {
            sachGoiY = sachRepository
                    .timKiemSach(ketQua.tuKhoaTimSach(), null, null, null, null, null, null, PageRequest.of(0, 4))
                    .getContent().stream()
                    .map(s -> new ChatResponse.SachData(
                            s.getMaSach(),
                            s.getTenSach(),
                            s.getTacGia(),
                            s.getAnhBiaUrl(),
                            s.getGia(),
                            s.getDanhGiaTrungBinh() != null ? s.getDanhGiaTrungBinh().doubleValue() : 0.0
                    ))
                    .collect(Collectors.toList());
        }

        return new ChatResponse(true, ketQua.vanBan(), sachGoiY);
    }

    private void luuTinNhan(String maPhien, String vaiTro, String noiDung) {
        LichSuChat chat = new LichSuChat();
        chat.setMaPhien(maPhien);
        chat.setVaiTro(vaiTro);
        chat.setNoiDung(noiDung != null ? noiDung : "");
        lichSuChatRepository.save(chat);
    }
}
