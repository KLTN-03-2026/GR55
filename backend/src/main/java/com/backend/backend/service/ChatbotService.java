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

    public ChatResponse xuLyTinNhan(String maPhien, String noiDung, Long maNd) {
        List<LichSuChat> lichSu = lichSuChatRepository.findTop10ByMaPhienOrderByNgayTaoDesc(maPhien);
        Collections.reverse(lichSu);

        luuTinNhan(maPhien, "user", noiDung, maNd, null);

        GeminiService.KetQuaGemini ketQua = geminiService.goiGemini(noiDung, lichSu);

        luuTinNhan(maPhien, "bot", ketQua.vanBan(), maNd, ketQua.yDinh());

        List<ChatResponse.SachData> sachGoiY = null;
        String phanHoi = ketQua.vanBan();
        String tuKhoa = ketQua.tuKhoaTimSach();

        if (tuKhoa != null && !tuKhoa.isBlank()) {
            sachGoiY = sachRepository
                    .timKiemSach(tuKhoa, null, null, null, null, null, null, PageRequest.of(0, 4))
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

            if (sachGoiY.isEmpty()) {
                phanHoi = "Rất tiếc, BookNest hiện chưa có sách nào phù hợp với từ khóa \"" + tuKhoa + "\" trong catalog.\n"
                        + "Bạn có thể thử tìm với từ khóa khác, hoặc liên hệ support@booknest.vn để được hỗ trợ thêm nhé!";
                sachGoiY = null;
                tuKhoa = null;
            }
        }

        return new ChatResponse(true, phanHoi, sachGoiY, tuKhoa);
    }

    private void luuTinNhan(String maPhien, String vaiTro, String noiDung, Long maNd, String yDinh) {
        LichSuChat chat = new LichSuChat();
        chat.setMaPhien(maPhien);
        chat.setVaiTro(vaiTro);
        chat.setNoiDung(noiDung != null ? noiDung : "");
        chat.setMaNd(maNd);
        chat.setYDinh(yDinh);
        lichSuChatRepository.save(chat);
    }
}
