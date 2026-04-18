package com.backend.backend.service;

import com.backend.backend.dto.DialogflowRequest;
import com.backend.backend.dto.DialogflowResponse;
import com.backend.backend.entity.LichSuChat;
import com.backend.backend.repository.LichSuChatRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ChatbotWebhookService {

    private final LichSuChatRepository lichSuChatRepository;
    private final FaqService faqService;

    private static final String SUPPORT_EMAIL = "support@booknest.vn";
    private static final String SUPPORT_HOTLINE = "1900xxxx";
    private static final String BASE_URL = "https://booknest.vn";

    public DialogflowResponse xuLyWebhook(DialogflowRequest request) {
        String intent = request.getQueryResult().getIntent() != null
                ? request.getQueryResult().getIntent().getDisplayName()
                : "";
        String session = request.getSession();
        String queryText = request.getQueryResult().getQueryText();
        Map<String, Object> parameters = request.getQueryResult().getParameters();

        luuLichSuChat(session, "user", queryText, intent);

        DialogflowResponse response = switch (intent) {
            case "greeting"       -> xuLyGreeting();
            case "payment.guide"  -> xuLyPaymentGuide();
            case "faq"            -> xuLyFaq(parameters);
            case "search.redirect"-> xuLySearchRedirect(parameters);
            default               -> xuLyFallback();
        };

        luuLichSuChat(session, "bot", response.getFulfillmentText(), intent);

        return response;
    }

    private DialogflowResponse xuLyGreeting() {
        String van_ban = "Xin chào! Tôi là trợ lý ảo của BookNest. Tôi có thể giúp gì cho bạn hôm nay?\n\n"
            + "Tôi có thể:\n"
            + "• Hướng dẫn thanh toán và mua sách\n"
            + "• Giải đáp thắc mắc về tài khoản, đọc sách\n"
            + "• Tìm sách theo thể loại, tác giả\n\n"
            + "Hãy cho tôi biết bạn cần hỗ trợ gì nhé!";
        return DialogflowResponse.builder().fulfillmentText(van_ban).build();
    }

    private DialogflowResponse xuLyPaymentGuide() {
        String van_ban = "📚 HƯỚNG DẪN MUA SÁCH TRÊN BOOKNEST\n\n"
            + "1️⃣ Đăng nhập tài khoản BookNest của bạn\n"
            + "2️⃣ Tìm sách bạn muốn mua và nhấn 'Mua ngay'\n"
            + "3️⃣ Kiểm tra lại đơn hàng và nhấn 'Tiến hành thanh toán'\n"
            + "4️⃣ Chọn phương thức thanh toán VNPAY\n"
            + "5️⃣ Hoàn tất thanh toán theo hướng dẫn của VNPAY\n\n"
            + "Sau khi thanh toán thành công, sách sẽ được thêm vào Thư viện cá nhân của bạn.\n\n"
            + "Bạn cần hỗ trợ thêm gì không?";
        return DialogflowResponse.builder().fulfillmentText(van_ban).build();
    }

    private DialogflowResponse xuLyFaq(Map<String, Object> parameters) {
        String cauHoi = parameters != null && parameters.get("question") != null
                ? parameters.get("question").toString()
                : "";
        String dapAn = faqService.layDapAn(cauHoi);
        return DialogflowResponse.builder().fulfillmentText(dapAn).build();
    }

    private DialogflowResponse xuLySearchRedirect(Map<String, Object> parameters) {
        String tuKhoa = parameters != null && parameters.get("tu_khoa") != null
                ? parameters.get("tu_khoa").toString()
                : "";
        String searchUrl = BASE_URL + "/tim_kiem?q=" + URLEncoder.encode(tuKhoa, StandardCharsets.UTF_8);
        String van_ban = "🔍 TÌM KIẾM SÁCH\n\n"
            + "Tôi tìm thấy kết quả cho từ khóa '" + tuKhoa + "'!\n\n"
            + "👉 Bấm vào link này để xem danh sách sách: " + searchUrl + "\n\n"
            + "Bạn cần tìm sách khác không?";
        return DialogflowResponse.builder().fulfillmentText(van_ban).build();
    }

    private DialogflowResponse xuLyFallback() {
        String van_ban = "Xin lỗi, tôi chưa hiểu câu hỏi của bạn.\n\n"
            + "Bạn có thể:\n"
            + "• Hỏi về hướng dẫn thanh toán\n"
            + "• Hỏi về quên mật khẩu\n"
            + "• Yêu cầu tìm sách theo thể loại/tác giả\n"
            + "• Hỏi về cách đọc sách, lưu tiến độ\n\n"
            + "Hoặc liên hệ hỗ trợ:\n"
            + "📧 Email: " + SUPPORT_EMAIL + "\n"
            + "📞 Hotline: " + SUPPORT_HOTLINE;
        return DialogflowResponse.builder().fulfillmentText(van_ban).build();
    }

    private void luuLichSuChat(String maPhien, String vaiTro, String noiDung, String yDinh) {
        LichSuChat chat = new LichSuChat();
        chat.setMaPhien(maPhien);
        chat.setVaiTro(vaiTro);
        chat.setNoiDung(noiDung != null ? noiDung : "");
        chat.setYDinh(yDinh);
        lichSuChatRepository.save(chat);
    }
}
