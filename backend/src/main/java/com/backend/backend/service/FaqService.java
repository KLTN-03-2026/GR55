package com.backend.backend.service;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

@Service
public class FaqService {

    @Cacheable(value = "faq_chatbot", key = "#cauHoi")
    public String layDapAn(String cauHoi) {
        String chuanHoa = cauHoi != null ? cauHoi.toLowerCase().trim() : "";

        if (chuanHoa.contains("quên mật khẩu") || chuanHoa.contains("quen mat khau")) {
            return "🔐 QUÊN MẬT KHẨU\n\n"
                + "Bạn vui lòng thực hiện các bước sau:\n"
                + "1. Vào trang Đăng nhập, chọn 'Quên mật khẩu'\n"
                + "2. Nhập email đã đăng ký tài khoản\n"
                + "3. Kiểm tra email để nhận mã OTP (có hiệu lực 3 phút)\n"
                + "4. Nhập mã OTP và tạo mật khẩu mới\n\n"
                + "Sau đó bạn có thể đăng nhập với mật khẩu mới nhé!";
        }

        if (chuanHoa.contains("đọc sách") || chuanHoa.contains("doc sach")) {
            return "📖 CÁCH ĐỌC SÁCH\n\n"
                + "Sau khi mua sách hoặc đối với sách miễn phí:\n"
                + "1. Vào 'Thư viện cá nhân' từ menu\n"
                + "2. Chọn sách muốn đọc và nhấn 'Đọc ngay'\n"
                + "3. Sách sẽ hiển thị ngay trên trình duyệt\n\n"
                + "Bạn có thể phóng to/thu nhỏ, chuyển trang và lưu tiến độ đọc nhé!";
        }

        if (chuanHoa.contains("lưu tiến độ") || chuanHoa.contains("luu tien do")) {
            return "💾 LƯU TIẾN ĐỘ ĐỌC\n\n"
                + "Khi bạn đã đăng nhập, hệ thống sẽ tự động:\n"
                + "• Lưu trang bạn đang đọc mỗi 30 giây\n"
                + "• Khi mở lại sách, tự động đến trang đã lưu\n"
                + "• Hiển thị phần trăm hoàn thành trong Thư viện\n\n"
                + "Bạn không cần thao tác gì thêm, mọi thứ đều tự động!";
        }

        return "📚 CÂU HỎI THƯỜNG GẶP\n\n"
            + "Tôi có thể giúp bạn với các câu hỏi về:\n"
            + "• Quên mật khẩu\n"
            + "• Cách đọc sách\n"
            + "• Lưu tiến độ đọc\n"
            + "• Hướng dẫn thanh toán\n\n"
            + "Bạn hãy thử hỏi một trong những chủ đề trên nhé!";
    }
}
