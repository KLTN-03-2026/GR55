import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import './ChatbotWidget.css';

const MA_PHIEN = 'session_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);

const TIN_NHAN_CHAO = {
  vai_tro: 'bot',
  noi_dung: 'Xin chào! Tôi là trợ lý AI của BookNest 📚\nTôi có thể giúp bạn tìm sách, hướng dẫn mua hàng, thanh toán và nhiều hơn nữa!'
};

const GOI_Y_NHANH = [
  'Tìm sách văn học',
  'Gói hội viên là gì?',
  'Hướng dẫn mua sách',
  'Cách lấy lại mật khẩu',
];

export default function ChatbotWidget() {
  const [moRa, setMoRa] = useState(false);
  const [danhSachTinNhan, setDanhSachTinNhan] = useState([TIN_NHAN_CHAO]);
  const [noiDungNhap, setNoiDungNhap] = useState('');
  const [dangGui, setDangGui] = useState(false);
  const cuoiDanhSachRef = useRef(null);

  useEffect(() => {
    cuoiDanhSachRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [danhSachTinNhan, moRa]);

  const guiTinNhan = async (vanBanTuyChon) => {
    const noiDung = (vanBanTuyChon ?? noiDungNhap).trim();
    if (!noiDung || dangGui) return;

    setNoiDungNhap('');
    setDanhSachTinNhan(prev => [...prev, { vai_tro: 'user', noi_dung: noiDung }]);
    setDangGui(true);

    try {
      const res = await api.post('/chatbot/gui_tin_nhan', {
        maPhien: MA_PHIEN,
        noiDung: noiDung
      });
      setDanhSachTinNhan(prev => [...prev, {
        vai_tro: 'bot',
        noi_dung: res.data.phanHoi,
        sach_goi_y: res.data.sachGoiY || [],
        tu_khoa: res.data.tuKhoaTimKiem || null
      }]);
    } catch {
      setDanhSachTinNhan(prev => [
        ...prev,
        { vai_tro: 'bot', noi_dung: 'Xin lỗi, tôi đang gặp sự cố. Vui lòng thử lại sau.' }
      ]);
    } finally {
      setDangGui(false);
    }
  };

  const xuLyNhanPhim = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      guiTinNhan();
    }
  };

  return (
    <div className="chatbot-wrapper">
      {moRa && (
        <div className="chatbot-cua-so">
          <div className="chatbot-tieu-de">
            <div className="chatbot-tieu-de-trai">
              <span className="chatbot-avatar">🤖</span>
              <span>BookNest Assistant</span>
            </div>
            <button className="chatbot-nut-dong" onClick={() => setMoRa(false)}>✕</button>
          </div>

          <div className="chatbot-noi-dung">
            {danhSachTinNhan.map((tin, idx) => (
              <div key={idx} className={`chatbot-tin-nhan ${tin.vai_tro}`}>
                <div>
                  <div className="chatbot-bong-thoai">{tin.noi_dung}</div>
                  {tin.sach_goi_y?.length > 0 && (
                    <div className="chatbot-sach-list">
                      {tin.sach_goi_y.map(sach => (
                        <Link key={sach.ma_sach} to={`/sach/${sach.ma_sach}`} className="chatbot-sach-card">
                          <img
                            src={sach.anh_bia_url}
                            alt={sach.ten_sach}
                            className="chatbot-sach-anh"
                            onError={e => { e.target.style.display = 'none'; }}
                          />
                          <div className="chatbot-sach-thong-tin">
                            <div className="chatbot-sach-ten">{sach.ten_sach}</div>
                            <div className="chatbot-sach-tac-gia">{sach.tac_gia}</div>
                            <div className="chatbot-sach-gia">
                              {Number(sach.gia) > 0
                                ? Number(sach.gia).toLocaleString('vi-VN') + 'đ'
                                : 'Miễn phí'}
                            </div>
                            {sach.danh_gia_trung_binh > 0 && (
                              <div className="chatbot-sach-rating">
                                ⭐ {Number(sach.danh_gia_trung_binh).toFixed(1)}
                              </div>
                            )}
                          </div>
                        </Link>
                      ))}
                      {tin.tu_khoa && (
                        <Link
                          to={`/sach?tu_khoa=${encodeURIComponent(tin.tu_khoa)}`}
                          className="chatbot-xem-them"
                        >
                          Xem thêm kết quả →
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {danhSachTinNhan.length === 1 && (
              <div className="chatbot-goi-y-chips">
                {GOI_Y_NHANH.map(chip => (
                  <button
                    key={chip}
                    className="chatbot-chip"
                    onClick={() => guiTinNhan(chip)}
                    disabled={dangGui}
                  >
                    {chip}
                  </button>
                ))}
              </div>
            )}

            {dangGui && (
              <div className="chatbot-tin-nhan bot">
                <div className="chatbot-bong-thoai chatbot-dang-nhap">
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}
            <div ref={cuoiDanhSachRef} />
          </div>

          <div className="chatbot-nhap-lieu">
            <textarea
              className="chatbot-o-nhap"
              value={noiDungNhap}
              onChange={e => setNoiDungNhap(e.target.value)}
              onKeyDown={xuLyNhanPhim}
              placeholder="Nhập tin nhắn..."
              disabled={dangGui}
              rows={1}
            />
            <button
              className="chatbot-nut-gui"
              onClick={() => guiTinNhan()}
              disabled={dangGui || !noiDungNhap.trim()}
            >
              ➤
            </button>
          </div>
        </div>
      )}

      <button className="chatbot-nut-mo" onClick={() => setMoRa(!moRa)}>
        {moRa ? '✕' : '💬'}
      </button>
    </div>
  );
}
