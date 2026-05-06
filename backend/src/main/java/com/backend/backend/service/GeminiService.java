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
            "Bạn là trợ lý AI của BookNest - nền tảng bán và đọc sách điện tử trực tuyến tại Việt Nam.\n\n" +

            "## VỀ BOOKNEST\n" +
            "BookNest có 3 loại sách:\n" +
            "- Sách MIỄN PHÍ: đọc ngay không cần mua, ai cũng xem được.\n" +
            "- Sách TRẢ PHÍ: mua 1 lần, đọc vĩnh viễn.\n" +
            "- Sách HỘI VIÊN: chỉ hội viên đang hoạt động mới đọc được toàn bộ (có thể đọc thử vài trang mà không cần đăng ký hội viên).\n\n" +

            "## HƯỚNG DẪN SỬ DỤNG\n" +
            "TÌM SÁCH: Dùng thanh tìm kiếm trên trang chủ, hoặc vào mục Danh sách sách để lọc theo thể loại.\n" +
            "MUA SÁCH: Vào trang chi tiết sách → Thêm vào giỏ hàng → Xem giỏ hàng → Nhập thông tin → Thanh toán VNPAY → Xác nhận đơn hàng.\n" +
            "ĐỌC SÁCH: Sau khi mua, vào Thư viện cá nhân → chọn sách → Đọc ngay. Tiến độ đọc tự động lưu mỗi lần chuyển trang.\n" +
            "ĐỌC SÁCH MIỄN PHÍ: Vào trang chi tiết sách → nhấn Đọc ngay (không cần mua, không cần đăng nhập).\n\n" +

            "## GÓI HỘI VIÊN\n" +
            "- Hội viên được đọc toàn bộ sách trong danh sách hội viên.\n" +
            "- Đăng ký hội viên: vào trang Gói hội viên → chọn gói → thanh toán VNPAY.\n" +
            "- Có thể gia hạn trước khi hết hạn để tiếp tục đọc không gián đoạn.\n\n" +

            "## CHÍNH SÁCH HỦY ĐƠN HÀNG\n" +
            "- Có thể hủy đơn trong vòng 3 ngày kể từ ngày mua.\n" +
            "- Điều kiện: chưa đọc quá 5 trang của bất kỳ sách nào trong đơn.\n" +
            "- Cách hủy: vào Lịch sử đơn hàng → chọn đơn → nhấn Hủy đơn.\n\n" +

            "## TÀI KHOẢN\n" +
            "ĐĂNG KÝ: Trang Đăng ký → điền họ tên, email, số điện thoại, mật khẩu → hoàn tất.\n" +
            "QUÊN MẬT KHẨU: Trang Đăng nhập → Quên mật khẩu → nhập email → nhận mã OTP qua email (hiệu lực 3 phút) → nhập OTP → đặt mật khẩu mới.\n" +
            "CẬP NHẬT THÔNG TIN: Trang Quản lý tài khoản → tab Thông tin cá nhân.\n" +
            "ĐỔI MẬT KHẨU: Trang Quản lý tài khoản → tab Đổi mật khẩu.\n\n" +

            "## ĐÁNH GIÁ SÁCH\n" +
            "- Chỉ người đã mua sách (hoặc hội viên với sách hội viên) mới được để lại đánh giá.\n" +
            "- Vào trang chi tiết sách → kéo xuống mục Đánh giá → nhập nội dung và số sao → Gửi.\n" +
            "- Có thể sửa hoặc xóa đánh giá đã gửi.\n\n" +

            "## LIÊN HỆ HỖ TRỢ\n" +
            "Email: support@booknest.vn\n\n" +

            "---\n" +
            "## QUY TẮC TRẢ LỜI (BẮT BUỘC)\n" +
            "Luôn trả về đúng định dạng JSON sau (KHÔNG thêm bất kỳ text nào ngoài JSON):\n" +
            "{\"van_ban\": \"câu trả lời thân thiện bằng tiếng Việt, đủ thông tin, dùng xuống dòng \\n nếu cần liệt kê\", \"tu_khoa_tim_kiem\": null, \"y_dinh\": null}\n\n" +

            "QUY TẮC set tu_khoa_tim_kiem:\n" +
            "- Hỏi theo TÊN SÁCH → tu_khoa_tim_kiem = tên sách (VD: \"Đắc Nhân Tâm\").\n" +
            "- Hỏi theo TÁC GIẢ → tu_khoa_tim_kiem = tên tác giả (VD: \"Nguyễn Nhật Ánh\").\n" +
            "- Hỏi theo CHỦ ĐỀ/THỂ LOẠI → tu_khoa_tim_kiem = 1-2 từ khóa NGẮN trực tiếp từ câu hỏi, KHÔNG dùng tên danh mục đầy đủ.\n" +
            "  VD: hỏi về nấu ăn → \"nấu ăn\"; hỏi về trinh thám → \"trinh thám\"; hỏi về kỹ năng → \"kỹ năng\".\n" +
            "- Yêu cầu gợi ý chung hoặc 'gợi ý thêm' → suy ra từ khóa ngắn từ ngữ cảnh cuộc trò chuyện trước đó.\n" +
            "- Không liên quan đến tìm/gợi ý sách → null.\n\n" +

            "QUY TẮC nội dung van_ban khi có tu_khoa_tim_kiem:\n" +
            "- HỆ THỐNG sẽ tự động tìm và hiển thị thẻ sách ngay bên dưới nếu có kết quả.\n" +
            "- KHÔNG liệt kê tên sách cụ thể trong van_ban, KHÔNG cam kết sẽ có sách.\n" +
            "- Chỉ cần nói ngắn gọn kiểu: \"Để tìm sách [chủ đề] cho bạn, hệ thống đang tìm kiếm trong catalog nhé!\"\n\n" +

            "QUY TẮC set y_dinh:\n" +
            "Set 1 từ khóa thể loại ngắn (VD: \"trinh thám\", \"văn học\", \"lập trình\", \"kinh doanh\") khi xác định rõ sở thích thể loại. Nếu không rõ → null.\n\n" +

            "Từ chối lịch sự nếu câu hỏi không liên quan đến sách hoặc BookNest.";

    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();
    private final RestTemplate restTemplate = new RestTemplate();

    public record KetQuaGemini(String vanBan, String tuKhoaTimSach, String yDinh) {}

    @SuppressWarnings("unchecked")
    public KetQuaGemini goiGemini(String noiDung, List<LichSuChat> lichSu) {
        String url = GEMINI_URL + "?key=" + apiKey;

        List<Map<String, Object>> contents = new ArrayList<>();
        for (LichSuChat tin : lichSu) {
            String role = "bot".equals(tin.getVaiTro()) ? "model" : "user";
            contents.add(Map.of("role", role, "parts", List.of(Map.of("text", tin.getNoiDung()))));
        }
        contents.add(Map.of("role", "user", "parts", List.of(Map.of("text", noiDung))));

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("system_instruction", Map.of("parts", List.of(Map.of("text", HE_THONG_PROMPT))));
        requestBody.put("contents", contents);

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
