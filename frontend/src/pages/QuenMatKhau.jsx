import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';
import './QuenMatKhau.css';

const THOI_GIAN_OTP = 180; // 3 phút = 180 giây

const quy_tac_mat_khau = {
  regex: /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,64}$/,
  thong_bao: 'Mật khẩu phải từ 8-64 ký tự, có ít nhất 1 chữ và 1 số',
};

export default function QuenMatKhau() {
  const dieu_huong = useNavigate();

  const [buoc_hien_tai, dat_buoc] = useState(1);
  const [email, dat_email] = useState('');
  const [loi_email, dat_loi_email] = useState('');
  const [loi_server, dat_loi_server] = useState('');
  const [dang_gui, dat_dang_gui] = useState(false);

  const [du_lieu_buoc2, dat_du_lieu_buoc2] = useState({
    otp: '',
    mat_khau_moi: '',
    xac_nhan_mat_khau_moi: '',
  });
  const [loi_buoc2, dat_loi_buoc2] = useState({});

  const [thoi_gian_con, dat_thoi_gian_con] = useState(THOI_GIAN_OTP);
  const [co_the_gui_lai, dat_co_the_gui_lai] = useState(false);

  useEffect(() => {
    if (buoc_hien_tai !== 2) return;

    if (thoi_gian_con <= 0) {
      dat_co_the_gui_lai(true);
      return;
    }

    const bo_dem = setTimeout(() => dat_thoi_gian_con(t => t - 1), 1000);
    return () => clearTimeout(bo_dem);
  }, [thoi_gian_con, buoc_hien_tai]);

  function dinh_dang_thoi_gian(giay) {
    const phut = Math.floor(giay / 60).toString().padStart(2, '0');
    const s = (giay % 60).toString().padStart(2, '0');
    return `${phut}:${s}`;
  }

  async function xu_ly_gui_otp(su_kien) {
    su_kien?.preventDefault();
    dat_loi_server('');

    if (!email.trim()) {
      dat_loi_email('Email không được để trống');
      return;
    }
    dat_loi_email('');

    dat_dang_gui(true);
    try {
      await api.post('/auth/quen_mat_khau/gui_otp', { email });
      dat_buoc(2);
      dat_thoi_gian_con(THOI_GIAN_OTP);
      dat_co_the_gui_lai(false);
      toast.info('Mã OTP đã được gửi đến email của bạn');
    } catch (loi_api) {
      const thong_bao = loi_api.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại.';
      dat_loi_server(thong_bao);
    } finally {
      dat_dang_gui(false);
    }
  }

  async function xu_ly_gui_lai() {
    dat_loi_server('');
    dat_dang_gui(true);
    try {
      await api.post('/auth/quen_mat_khau/gui_otp', { email });
      dat_thoi_gian_con(THOI_GIAN_OTP);
      dat_co_the_gui_lai(false);
      dat_du_lieu_buoc2(truoc => ({ ...truoc, otp: '' }));
      toast.info('Đã gửi lại mã OTP mới đến email của bạn');
    } catch (loi_api) {
      const thong_bao = loi_api.response?.data?.message || 'Không thể gửi lại OTP. Vui lòng thử lại.';
      dat_loi_server(thong_bao);
    } finally {
      dat_dang_gui(false);
    }
  }

  function kiem_tra_truong_buoc2(ten, gia_tri) {
    if (!gia_tri.trim()) {
      if (ten === 'otp') return 'Vui lòng nhập mã OTP 6 số';
      if (ten === 'mat_khau_moi') return 'Mật khẩu mới không được để trống';
      return 'Xác nhận mật khẩu không được để trống';
    }
    if (ten === 'otp' && !/^[0-9]{6}$/.test(gia_tri)) {
      return 'Vui lòng nhập mã OTP 6 số';
    }
    if (ten === 'mat_khau_moi' && !quy_tac_mat_khau.regex.test(gia_tri)) {
      return quy_tac_mat_khau.thong_bao;
    }
    if (ten === 'xac_nhan_mat_khau_moi' && gia_tri !== du_lieu_buoc2.mat_khau_moi) {
      return 'Xác nhận mật khẩu không khớp';
    }
    return '';
  }

  function xu_ly_thay_doi_buoc2(su_kien) {
    const { name, value } = su_kien.target;
    dat_du_lieu_buoc2(truoc => ({ ...truoc, [name]: value }));
    dat_loi_buoc2(truoc => ({ ...truoc, [name]: kiem_tra_truong_buoc2(name, value) }));

    if (name === 'mat_khau_moi' && du_lieu_buoc2.xac_nhan_mat_khau_moi) {
      const loi_xn = du_lieu_buoc2.xac_nhan_mat_khau_moi !== value ? 'Xác nhận mật khẩu không khớp' : '';
      dat_loi_buoc2(truoc => ({ ...truoc, xac_nhan_mat_khau_moi: loi_xn }));
    }
  }

  async function xu_ly_dat_lai_mat_khau(su_kien) {
    su_kien.preventDefault();
    dat_loi_server('');

    const loi_moi = {};
    Object.keys(du_lieu_buoc2).forEach(ten => {
      const thong_bao = kiem_tra_truong_buoc2(ten, du_lieu_buoc2[ten]);
      if (thong_bao) loi_moi[ten] = thong_bao;
    });

    if (Object.keys(loi_moi).length > 0) {
      dat_loi_buoc2(loi_moi);
      return;
    }

    dat_dang_gui(true);
    try {
      await api.post('/auth/quen_mat_khau/xac_thuc_otp', {
        email,
        ...du_lieu_buoc2,
      });
      toast.success('Đặt lại mật khẩu thành công!');
      setTimeout(() => dieu_huong('/dang_nhap'), 2000);
    } catch (loi_api) {
      const thong_bao = loi_api.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại.';
      dat_loi_server(thong_bao);
    } finally {
      dat_dang_gui(false);
    }
  }

  return (
    <div className="trang_quen_mat_khau">
      <div className="hop_quen_mat_khau">
        <div className="logo_khu_vuc">
          <div className="logo_ten">Book<span>Nest</span></div>
        </div>

        {/* Thanh tiến trình */}
        <div className="thanh_tien_trinh">
          <div className={`buoc_so ${buoc_hien_tai >= 1 ? (buoc_hien_tai > 1 ? 'hoan_thanh' : 'hien_tai') : ''}`}>
            {buoc_hien_tai > 1 ? '✓' : '1'}
          </div>
          <div className={`duong_noi_buoc ${buoc_hien_tai > 1 ? 'hoan_thanh' : ''}`} />
          <div className={`buoc_so ${buoc_hien_tai >= 2 ? 'hien_tai' : ''}`}>2</div>
        </div>

        {loi_server && (
          <div className="thong_bao_server_loi">{loi_server}</div>
        )}

        {/* ---- BƯỚC 1: Nhập email ---- */}
        {buoc_hien_tai === 1 && (
          <>
            <h1 className="tieu_de_buoc">Quên mật khẩu</h1>
            <p className="mo_ta_buoc">
              Nhập địa chỉ email đã đăng ký. Chúng tôi sẽ gửi mã xác thực đến email của bạn.
            </p>

            <form onSubmit={xu_ly_gui_otp} noValidate>
              <div className="nhom_truong">
                <label className="nhan_truong" htmlFor="email_buoc1">Email</label>
                <input
                  id="email_buoc1"
                  name="email_buoc1"
                  type="email"
                  value={email}
                  onChange={e => {
                    dat_email(e.target.value);
                    if (loi_email) dat_loi_email('');
                  }}
                  placeholder="example@gmail.com"
                  className={`o_nhap${loi_email ? ' loi' : ''}`}
                  autoComplete="email"
                />
                <span className="thong_bao_loi">{loi_email || ''}</span>
              </div>

              <button type="submit" className="nut_chinh" disabled={dang_gui}>
                {dang_gui ? 'Đang gửi...' : 'Gửi mã xác thực'}
              </button>
            </form>

            <Link to="/dang_nhap" className="lien_ket_quay_lai">
              Quay lại đăng nhập
            </Link>
          </>
        )}

        {/* ---- BƯỚC 2: Nhập OTP + mật khẩu mới ---- */}
        {buoc_hien_tai === 2 && (
          <>
            <h1 className="tieu_de_buoc">Đặt lại mật khẩu</h1>

            <div className="thong_bao_otp">
              Mã OTP đã được gửi đến <strong>{email}</strong>. Mã có hiệu lực trong 3 phút.
            </div>

            {/* Đồng hồ đếm ngược */}
            <div className="dem_nguoc_khu_vuc">
              <span className="dem_nguoc_text">
                {co_the_gui_lai
                  ? 'Mã OTP đã hết hạn'
                  : <>Hiệu lực: <span className={`dem_nguoc_so${thoi_gian_con <= 30 ? ' het_han' : ''}`}>
                      {dinh_dang_thoi_gian(thoi_gian_con)}
                    </span></>
                }
              </span>
              <button
                className="nut_gui_lai"
                onClick={xu_ly_gui_lai}
                disabled={!co_the_gui_lai || dang_gui}
              >
                {dang_gui ? 'Đang gửi...' : 'Gửi lại mã'}
              </button>
            </div>

            <form onSubmit={xu_ly_dat_lai_mat_khau} noValidate>
              <div className="nhom_truong">
                <label className="nhan_truong" htmlFor="otp">Mã OTP</label>
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  maxLength={6}
                  value={du_lieu_buoc2.otp}
                  onChange={xu_ly_thay_doi_buoc2}
                  placeholder="______"
                  className={`o_nhap o_nhap_otp${loi_buoc2.otp ? ' loi' : ''}`}
                  autoComplete="one-time-code"
                  inputMode="numeric"
                />
                <span className="thong_bao_loi">{loi_buoc2.otp || ''}</span>
              </div>

              <div className="nhom_truong">
                <label className="nhan_truong" htmlFor="mat_khau_moi">Mật khẩu mới</label>
                <input
                  id="mat_khau_moi"
                  name="mat_khau_moi"
                  type="password"
                  value={du_lieu_buoc2.mat_khau_moi}
                  onChange={xu_ly_thay_doi_buoc2}
                  placeholder="Tối thiểu 8 ký tự"
                  className={`o_nhap${loi_buoc2.mat_khau_moi ? ' loi' : ''}`}
                  autoComplete="new-password"
                />
                <span className="thong_bao_loi">{loi_buoc2.mat_khau_moi || ''}</span>
              </div>

              <div className="nhom_truong">
                <label className="nhan_truong" htmlFor="xac_nhan_mat_khau_moi">Xác nhận mật khẩu mới</label>
                <input
                  id="xac_nhan_mat_khau_moi"
                  name="xac_nhan_mat_khau_moi"
                  type="password"
                  value={du_lieu_buoc2.xac_nhan_mat_khau_moi}
                  onChange={xu_ly_thay_doi_buoc2}
                  placeholder="Nhập lại mật khẩu mới"
                  className={`o_nhap${loi_buoc2.xac_nhan_mat_khau_moi ? ' loi' : ''}`}
                  autoComplete="new-password"
                />
                <span className="thong_bao_loi">{loi_buoc2.xac_nhan_mat_khau_moi || ''}</span>
              </div>

              <button type="submit" className="nut_chinh" disabled={dang_gui}>
                {dang_gui ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
              </button>
            </form>

            <button
              className="lien_ket_quay_lai"
              style={{ background: 'none', border: 'none', cursor: 'pointer', width: '100%' }}
              onClick={() => { dat_buoc(1); dat_loi_server(''); }}
            >
              Quay lại nhập email
            </button>
          </>
        )}
      </div>
    </div>
  );
}
