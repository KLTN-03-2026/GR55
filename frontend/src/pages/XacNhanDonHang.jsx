import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { dinh_dang_gia } from '../utils/dinh_dang';
import './XacNhanDonHang.css';

function XacNhanDonHang() {
  const { nguoiDung } = useAuth();
  const dieu_huong = useNavigate();

  const [thong_tin, dat_thong_tin] = useState({
    ho_ten: nguoiDung?.ho_ten || '',
    email: nguoiDung?.email || '',
    so_dien_thoai: '',
  });

  const [phuong_thuc, dat_phuong_thuc] = useState('atm');

  const { data: gio_hang, isLoading: dang_tai_gio } = useQuery({
    queryKey: ['gio_hang', nguoiDung?.ma_nguoi_dung],
    queryFn: async () => {
      const phan_hoi = await api.get('/gio_hang');
      return phan_hoi.data.du_lieu;
    },
    staleTime: 0,
  });

  useEffect(() => {
    if (!dang_tai_gio && gio_hang && gio_hang.danh_sach?.length === 0) {
      dieu_huong('/gio_hang');
    }
  }, [gio_hang, dang_tai_gio, dieu_huong]);

  const { mutate: tao_don, isPending: dang_xu_ly } = useMutation({
    mutationFn: () => api.post('/mua_sach/tao_don', {
      hoTen: thong_tin.ho_ten,
      email: thong_tin.email,
      soDienThoai: thong_tin.so_dien_thoai,
      dungQr: phuong_thuc === 'qr',
    }),
    onSuccess: (phan_hoi) => {
      if (phan_hoi.data.success) {
        window.location.href = phan_hoi.data.data.thanhToanUrl;
      } else {
        toast.error(phan_hoi.data.message);
      }
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại.'),
  });

  const xu_ly_thay_doi = (e) => {
    const { name, value } = e.target;
    dat_thong_tin(prev => ({ ...prev, [name]: value }));
  };

  const xu_ly_xac_nhan = (e) => {
    e.preventDefault();
    if (!thong_tin.ho_ten.trim()) return toast.error('Vui lòng nhập họ tên');
    if (!thong_tin.email.trim()) return toast.error('Vui lòng nhập email');
    if (!thong_tin.so_dien_thoai.trim()) return toast.error('Vui lòng nhập số điện thoại');
    tao_don();
  };

  if (dang_tai_gio) {
    return (
      <div className="trang_xac_nhan">
        <div className="xn_skeleton_wrap">
          {[1, 2, 3].map(i => (
            <div key={i} className="xn_skeleton_item">
              <div className="skeleton xn_sk_anh" />
              <div className="xn_sk_thong_tin">
                <div className="skeleton xn_sk_ten" />
                <div className="skeleton xn_sk_gia" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const danh_sach = gio_hang?.danh_sach || [];

  return (
    <div className="trang_xac_nhan">
      <h1 className="xn_tieu_de">Xác nhận đơn hàng</h1>

      <div className="xn_noi_dung">
        <div className="xn_cot_trai">
          <div className="xn_khung">
            <h2 className="xn_khung_tieu_de">Sách trong giỏ hàng</h2>
            <div className="xn_danh_sach_sach">
              {danh_sach.map(item => (
                <div key={item.ma_sach} className="xn_item_sach">
                  <img src={item.anh_bia_url} alt={item.ten_sach} className="xn_anh_bia" />
                  <div className="xn_thong_tin_sach">
                    <p className="xn_ten_sach">{item.ten_sach}</p>
                    <p className="xn_tac_gia">{item.tac_gia}</p>
                    {item.gia_giam ? (
                      <div className="xn_gia_khu_vuc">
                        <span className="xn_gia_goc">{dinh_dang_gia(item.don_gia)}</span>
                        <span className="xn_gia xn_gia_giam">{dinh_dang_gia(item.gia_giam)}</span>
                      </div>
                    ) : (
                      <p className="xn_gia">{dinh_dang_gia(item.don_gia)}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="xn_khung">
            <h2 className="xn_khung_tieu_de">Thông tin người mua</h2>
            <form onSubmit={xu_ly_xac_nhan} className="xn_form">
              <div className="xn_truong">
                <label className="xn_nhan">Họ và tên</label>
                <input
                  className="xn_input"
                  type="text"
                  name="ho_ten"
                  value={thong_tin.ho_ten}
                  onChange={xu_ly_thay_doi}
                  placeholder="Nhập họ và tên"
                />
              </div>
              <div className="xn_truong">
                <label className="xn_nhan">Email</label>
                <input
                  className="xn_input"
                  type="email"
                  name="email"
                  value={thong_tin.email}
                  onChange={xu_ly_thay_doi}
                  placeholder="Nhập email"
                />
              </div>
              <div className="xn_truong">
                <label className="xn_nhan">Số điện thoại</label>
                <input
                  className="xn_input"
                  type="tel"
                  name="so_dien_thoai"
                  value={thong_tin.so_dien_thoai}
                  onChange={xu_ly_thay_doi}
                  placeholder="Nhập số điện thoại"
                />
              </div>

              <div className="xn_phuong_thuc">
                <label className="xn_nhan">Phương thức thanh toán</label>
                <div className="xn_chon_phuong_thuc">
                  <label className={`xn_pt_option${phuong_thuc === 'atm' ? ' xn_pt_active' : ''}`}>
                    <input
                      type="radio"
                      name="phuong_thuc"
                      value="atm"
                      checked={phuong_thuc === 'atm'}
                      onChange={() => dat_phuong_thuc('atm')}
                    />
                    <span>🏧 Thẻ ATM nội địa</span>
                  </label>
                  <label className={`xn_pt_option${phuong_thuc === 'qr' ? ' xn_pt_active' : ''}`}>
                    <input
                      type="radio"
                      name="phuong_thuc"
                      value="qr"
                      checked={phuong_thuc === 'qr'}
                      onChange={() => dat_phuong_thuc('qr')}
                    />
                    <span>📱 Quét mã QR</span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="xn_nut_xac_nhan"
                disabled={dang_xu_ly}
              >
                {dang_xu_ly ? 'Đang xử lý...' : 'Xác nhận & Thanh toán VNPAY'}
              </button>
            </form>
          </div>
        </div>

        <div className="xn_cot_phai">
          <div className="xn_khung xn_tom_tat">
            <h2 className="xn_khung_tieu_de">Tóm tắt</h2>
            <div className="xn_dong_chi_tiet">
              <span>Số lượng sách</span>
              <span>{danh_sach.length} cuốn</span>
            </div>
            <div className="xn_phan_cach" />
            <div className="xn_dong_tong">
              <span>Tổng cộng</span>
              <span className="xn_tong_tien">{dinh_dang_gia(gio_hang?.tong_tien)}</span>
            </div>
          </div>
          <Link to="/gio_hang" className="xn_link_quay_lai">← Quay lại giỏ hàng</Link>
        </div>
      </div>
    </div>
  );
}

export default XacNhanDonHang;
