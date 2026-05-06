import React from "react";
import "./Footer.css";
function Footer() {
  return (
    <footer className="bn-footer">
      <div className="bn-container">
        <div className="bn-footer-row">
          {/* Cột 1: Thông tin Đồ án */}
          <div className="bn-footer-col">
            <a href="/" className="bn-footer-logo">
              <span className="bn-logo-book" style={{ color: "white" }}>
                Book
              </span>
              <span
                className="bn-logo-nest"
                style={{ color: "rgb(37, 99, 235)" }}
              >
                Nest
              </span>
            </a>
            <p className="bn-footer-desc">
              Hệ thống cung cấp sách số trực tuyến tích hợp trí tuệ nhân tạo
              (Chatbot AI). Sản phẩm KLTN của nhóm 55.
            </p>
          </div>

          {/* Cột 2: Dịch vụ */}
          <div className="bn-footer-col">
            <h4>Dịch Vụ</h4>
            <ul>
              <li>
                <a href="/books">Đọc sách trực tuyến</a>
              </li>
              <li>
                <a href="/membership">Gói Hội viên</a>
              </li>
              <li>
                <a href="/ai">Hỗ trợ bằng AI</a>
              </li>
            </ul>
          </div>

          {/* Cột 3: Hỗ trợ & Chính sách */}
          <div className="bn-footer-col">
            <h4>Chính Sách</h4>
            <ul>
              <li>
                <a href="/terms">Điều khoản sử dụng</a>
              </li>
              <li>
                <a href="/privacy">Bảo mật thông tin</a>
              </li>
              <li>
                <a href="/payment">Hướng dẫn thanh toán</a>
              </li>
              <li>
                <a href="/faq">Câu hỏi thường gặp</a>
              </li>
            </ul>
          </div>

          {/* Cột 4: Liên hệ */}
          <div className="bn-footer-col">
            <h4>Thông tin liên hệ</h4>
            <div className="bn-contact-item">
              <svg
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <span>Nhóm KLTN 55 chuyên ngành Công Nghệ phần mề</span>
            </div>
            <div className="bn-contact-item">
              <svg
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
              <span>booknest.team55@gmail.com</span>
            </div>
            <div className="bn-contact-item">
              <svg
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"></path>
              </svg>
              <span>0347.316.743</span>
            </div>
          </div>
        </div>

        <div className="bn-footer-bottom">
          <p>&copy; 2026 KLTN BookNest.</p>
          <p>
            Phát triển bởi <span>Team 5 người - DTU</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
