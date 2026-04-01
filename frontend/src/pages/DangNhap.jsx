import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import './DangNhap.css';

export default function DangNhap() {
  const dieu_huong = useNavigate();
  const { dang_nhap } = useAuth();

  const [du_lieu, dat_du_lieu] = useState({ email: '', mat_khau: '' });
  const [loi, dat_loi] = useState({});
  const [loi_server, dat_loi_server] = useState('');
  const [dang_gui, dat_dang_gui] = useState(false);
  const [hien_mat_khau, dat_hien_mat_khau] = useState(false);

  function kiem_tra_truong(ten_truong, gia_tri) {
    if (!gia_tri.trim()) {
      return ten_truong === 'email'
        ? 'Email không được để trống'
        : 'Mật khẩu không được để trống';
    }
    return '';
  }

  function xu_ly_thay_doi(su_kien) {
    const { name, value } = su_kien.target;
    dat_du_lieu(truoc => ({ ...truoc, [name]: value }));
    dat_loi(truoc => ({ ...truoc, [name]: kiem_tra_truong(name, value) }));
  }

  async function xu_ly_dang_nhap(su_kien) {
    su_kien.preventDefault();
    dat_loi_server('');

    const loi_moi = {};
    Object.keys(du_lieu).forEach(ten => {
      const thong_bao = kiem_tra_truong(ten, du_lieu[ten]);
      if (thong_bao) loi_moi[ten] = thong_bao;
    });

    if (Object.keys(loi_moi).length > 0) {
      dat_loi(loi_moi);
      return;
    }

    dat_dang_gui(true);
    try {
      const phan_hoi = await api.post('/auth/dang_nhap', du_lieu);
      const { token, data } = phan_hoi.data;

      dang_nhap(token, data);
      toast.success('Đăng nhập thành công!');

      setTimeout(() => {
        if (data.vai_tro === 'quan_tri') {
          dieu_huong('/quan_tri');
        } else {
          dieu_huong('/trang_chu');
        }
      }, 1000);
    } catch (loi_api) {
      const thong_bao = loi_api.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại.';
      dat_loi_server(thong_bao);
    } finally {
      dat_dang_gui(false);
    }
  }

  return (
    <div className="trang_dang_nhap">
      <div className="hop_dang_nhap">
        <div className="logo_khu_vuc">
          <div className="logo_ten">Book<span>Nest</span></div>
        </div>

        <h1 className="tieu_de_dang_nhap">Đăng nhập</h1>

        {loi_server && (
          <div className="thong_bao_server_loi">{loi_server}</div>
        )}

        <form onSubmit={xu_ly_dang_nhap} noValidate>
          <div className="nhom_truong">
            <label className="nhan_truong" htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={du_lieu.email}
              onChange={xu_ly_thay_doi}
              placeholder="example@gmail.com"
              className={`o_nhap${loi.email ? ' loi' : ''}`}
              autoComplete="email"
            />
            <span className="thong_bao_loi">{loi.email || ''}</span>
          </div>

          <div className="nhom_truong">
            <label className="nhan_truong" htmlFor="mat_khau">Mật khẩu</label>
            <div className="khung_mat_khau">
              <input
                id="mat_khau"
                name="mat_khau"
                type={hien_mat_khau ? 'text' : 'password'}
                value={du_lieu.mat_khau}
                onChange={xu_ly_thay_doi}
                placeholder="Nhập mật khẩu"
                className={`o_nhap${loi.mat_khau ? ' loi' : ''}`}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="nut_hien_mat_khau"
                onClick={() => dat_hien_mat_khau(v => !v)}
                tabIndex={-1}
              >
                {hien_mat_khau ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            <span className="thong_bao_loi">{loi.mat_khau || ''}</span>
          </div>

          <button type="submit" className="nut_dang_nhap" disabled={dang_gui}>
            {dang_gui ? 'Đang xử lý...' : 'Đăng nhập'}
          </button>
        </form>

        <Link to="/quen_mat_khau" className="lien_ket_quen_mat_khau">
          Quên mật khẩu?
        </Link>

        <hr className="phan_cach" />

        <div className="khu_vuc_dang_ky">
          Chưa có tài khoản?{' '}
          <Link to="/dang_ky" className="lien_ket_dang_ky">Đăng ký</Link>
        </div>
      </div>
    </div>
  );
}
