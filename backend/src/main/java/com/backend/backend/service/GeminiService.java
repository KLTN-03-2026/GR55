package com.backend.backend.service;

import com.backend.backend.entity.LichSuChat;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Slf4j
@Service
public class GeminiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    private static final String GEMINI_URL =
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

    private static final String HE_THONG_PROMPT =
            "Bạn là trợ lý AI của BookNest - nền tảng bán và đọc sách số trực tuyến tại Việt Nam.\n" +
            "Hỗ trợ khách hàng về:\n" +
            "- Tìm kiếm sách: theo tên, tác giả, thể loại. Ví dụ: 'Tìm sách của Nguyễn Nhật Ánh', 'Gợi ý sách trinh thám'.\n" +
            "- Mua sách và thanh toán VNPAY: vào Giỏ hàng → Thanh toán → chuyển hướng VNPAY → xác nhận đơn hàng.\n" +
            "- Đọc sách online: sau khi mua vào Thư viện → chọn sách → đọc. Tiến độ đọc tự động lưu.\n" +
            "- Gói hội viên: cho phép đọc thử sách hội viên và mua với giá ưu đãi. Có thể nâng cấp trong tài khoản.\n" +
            "- Quên mật khẩu: trang Đăng nhập → 'Quên mật khẩu' → nhập email → nhận link đặt lại qua email.\n" +
            "- Đăng ký tài khoản: trang Đăng ký → điền thông tin → xác nhận email.\n" +
            "- Đánh giá sách: sau khi mua, vào trang chi tiết sách để để lại đánh giá.\n" +
            "- Liên hệ hỗ trợ: email support@booknest.vn\n\n" +
            "Luôn trả về JSON hợp lệ theo schema sau:\n" +
            "{\"van_ban\": \"câu trả lời ngắn gọn thân thiện bằng tiếng Việt\", \"tu_khoa_tim_kiem\": null, \"y_dinh\": null}\n" +
            "Nếu người dùng muốn TÌM hoặc XEM DANH SÁCH SÁCH (theo tên, tác giả, thể loại, chủ đề), " +
            "hãy set tu_khoa_tim_kiem thành từ khóa phù hợp (ví dụ: \"văn học\", \"Nguyễn Nhật Ánh\", \"trinh thám\"). " +
            "Nếu tin nhắn hiện tại không có từ khóa rõ ràng nhưng người dùng đang yêu cầu tìm/gợi ý sách (ví dụ: 'tìm giúp tôi', 'gợi ý thêm', 'cho tôi xem'), " +
            "hãy suy ra từ khóa từ ngữ cảnh cuộc trò chuyện trước đó và set tu_khoa_tim_kiem.\n" +
            "Luôn phân tích sở thích đọc sách của người dùng từ cuộc trò chuyện và set y_dinh thành 1 từ khóa thể loại " +
            "ngắn gọn bằng tiếng Việt (ví dụ: \"trinh thám\", \"lập trình\", \"văn học\", \"kinh doanh\", \"tâm lý học\"). " +
            "Chỉ set y_dinh khi có thể xác định rõ sở thích từ tin nhắn, nếu không rõ thì để null.\n" +
            "Từ chối lịch sự nếu câu hỏi không liên quan đến sách hoặc BookNest.";

    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();
    private final RestTemplate restTemplate = new RestTemplate();

    public record KetQuaGemini(String vanBan, String tuKhoaTimSach, String yDinh) {}

    @SuppressWarnings("unchecked")
    public KetQuaGemini goiGemini(String noiDung, List<LichSuChat> lichSu) {
        String url = GEMINI_URL + "?key=" + apiKey;

        String tinNhanDayDu = HE_THONG_PROMPT + "\n\n---\nCâu hỏi của khách hàng: " + noiDung;

        List<Map<String, Object>> contents = new ArrayList<>();
        for (LichSuChat tin : lichSu) {
            String role = "bot".equals(tin.getVaiTro()) ? "model" : "user";
            contents.add(Map.of("role", role, "parts", List.of(Map.of("text", tin.getNoiDung()))));
        }
        contents.add(Map.of("role", "user", "parts", List.of(Map.of("text", tinNhanDayDu))));

        Map<String, Object> requestBody = Map.of("contents", contents);

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);
            String rawText = trichXuatVanBan(response.getBody());
            return phanTichJson(rawText);
        } catch (Exception e) {
            log.error("Lỗi gọi Gemini API: {}", e.getMessage());
            return new KetQuaGemini("Xin lỗi, tôi đang gặp sự cố kỹ thuật. Vui lòng thử lại sau.", null, null);
        }
    }

    @SuppressWarnings("unchecked")
    private String trichXuatVanBan(Map<String, Object> body) {
        try {
            List<Map<String, Object>> candidates = (List<Map<String, Object>>) body.get("candidates");
            Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
            List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
            return parts.get(0).get("text").toString();
        } catch (Exception e) {
            return "{\"van_ban\": \"Xin lỗi, tôi không thể xử lý câu hỏi này lúc này.\", \"tu_khoa_tim_kiem\": null, \"y_dinh\": null}";
        }
    }

    private KetQuaGemini phanTichJson(String rawText) {
        try {
            String json = rawText.trim();
            if (json.startsWith("```")) {
                json = json.replaceAll("^```[a-zA-Z]*\\n?", "").replaceAll("```$", "").trim();
            }
            Map<String, Object> map = OBJECT_MAPPER.readValue(json, new TypeReference<>() {});
            String vanBan = (String) map.getOrDefault("van_ban", rawText);
            Object tuKhoaObj = map.get("tu_khoa_tim_kiem");
            String tuKhoa = (tuKhoaObj instanceof String s && !s.isBlank() && !s.equals("null")) ? s : null;
            Object yDinhObj = map.get("y_dinh");
            String yDinh = (yDinhObj instanceof String s && !s.isBlank() && !s.equals("null")) ? s : null;
            return new KetQuaGemini(vanBan, tuKhoa, yDinh);
        } catch (Exception e) {
            return new KetQuaGemini(rawText, null, null);
        }
    }
}
