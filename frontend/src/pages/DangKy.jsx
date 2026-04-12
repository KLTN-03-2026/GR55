import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import api from '../services/api';
import './DangKy.css';

const quy_tac_kiem_tra = {
  ho_ten: {
    regex: /^[\p{L} ]{2,50}$/u,
    thong_bao: 'Họ tên phải từ 2-50 ký tự và không chứa số hoặc ký tự đặc biệt',
  },
  email: {
    regex: /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/,
    thong_bao: 'Email không đúng định dạng',
  },
  so_dien_thoai: {
    regex: /^0[0-9]{9}$/,
    thong_bao: 'Số điện thoại phải là 10 số và bắt đầu bằng 0',
  },
  mat_khau: {
    regex: /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,64}$/,
    thong_bao: 'Mật khẩu phải từ 8-64 ký tự, bao gồm ít nhất 1 chữ cái và 1 số',
  },
};

export default function DangKy() {
  const dieu_huong = useNavigate();

  const [du_lieu, dat_du_lieu] = useState({
    ho_ten: '',
    email: '',
    so_dien_thoai: '',
    mat_khau: '',
    xac_nhan_mat_khau: '',
  });

  const [loi, dat_loi] = useState({});
  const [loi_server, dat_loi_server] = useState('');
  const [dang_gui, dat_dang_gui] = useState(false);
  const [hien_mat_khau, dat_hien_mat_khau] = useState({
    mat_khau: false,
    xac_nhan_mat_khau: false,
  });

  function bat_tat_hien(ten) {
    dat_hien_mat_khau(prev => ({ ...prev, [ten]: !prev[ten] }));
  }

  function kiem_tra_truong(ten_truong, gia_tri) {
    if (!gia_tri.trim()) {
      return 'Trường này không được để trống';
    }
    if (ten_truong === 'xac_nhan_mat_khau') {
      return gia_tri !== du_lieu.mat_khau ? 'Xác nhận mật khẩu không khớp' : '';
    }
    const quy_tac = quy_tac_kiem_tra[ten_truong];
    if (quy_tac && !quy_tac.regex.test(gia_tri)) {
      return quy_tac.thong_bao;
    }
    return '';
  }

  function xu_ly_thay_doi(su_kien) {
    const { name, value } = su_kien.target;
    dat_du_lieu(truoc => ({ ...truoc, [name]: value }));

    const thong_bao_loi = kiem_tra_truong(name, value);
    dat_loi(truoc => ({ ...truoc, [name]: thong_bao_loi }));

    if (name === 'mat_khau' && du_lieu.xac_nhan_mat_khau) {
      const loi_xac_nhan = du_lieu.xac_nhan_mat_khau !== value ? 'Xác nhận mật khẩu không khớp' : '';
      dat_loi(truoc => ({ ...truoc, xac_nhan_mat_khau: loi_xac_nhan }));
    }
  }

  async function xu_ly_dang_ky(su_kien) {
    su_kien.preventDefault();
    dat_loi_server('');

    const loi_moi = {};
    Object.keys(du_lieu).forEach(ten_truong => {
      const thong_bao = kiem_tra_truong(ten_truong, du_lieu[ten_truong]);
      if (thong_bao) loi_moi[ten_truong] = thong_bao;
    });

    if (Object.keys(loi_moi).length > 0) {
      dat_loi(loi_moi);
      return;
    }

    dat_dang_gui(true);
    try {
      const phan_hoi = await api.post('/auth/dang_ky', du_lieu);
      if (phan_hoi.status === 201 && phan_hoi.data.success) {
        toast.success('Đăng ký thành công!');
        setTimeout(() => dieu_huong('/dang_nhap'), 2000);
      }
    } catch (loi_api) {
      const du_lieu_loi = loi_api.response?.data;
      if (du_lieu_loi?.errors) {
        dat_loi(truoc => ({ ...truoc, ...du_lieu_loi.errors }));
      } else if (du_lieu_loi?.message) {
        dat_loi_server(du_lieu_loi.message);
      } else {
        dat_loi_server('Có lỗi xảy ra. Vui lòng thử lại sau.');
      }
    } finally {
      dat_dang_gui(false);
    }
  }

  const cac_truong = [
    { ten: 'ho_ten', nhan: 'Họ và tên', loai: 'text', placeholder: 'Nhập họ và tên' },
    { ten: 'email', nhan: 'Email', loai: 'email', placeholder: 'example@gmail.com' },
    { ten: 'so_dien_thoai', nhan: 'Số điện thoại', loai: 'tel', placeholder: '0xxxxxxxxx' },
    { ten: 'mat_khau', nhan: 'Mật khẩu', loai: 'password', placeholder: 'Tối thiểu 8 ký tự' },
    { ten: 'xac_nhan_mat_khau', nhan: 'Xác nhận mật khẩu', loai: 'password', placeholder: 'Nhập lại mật khẩu' },
  ];

  return (
    <div className="trang_dang_ky">
      <div className="hop_dang_ky">
        <div className="logo_khu_vuc">
          <div className="logo_ten">
            Book<span>Nest</span>
          </div>
        </div>

        <h1 className="tieu_de_dang_ky">Tạo tài khoản</h1>

        {loi_server && (
          <div className="thong_bao_server_loi">{loi_server}</div>
        )}

        <form onSubmit={xu_ly_dang_ky} noValidate>
          {cac_truong.map(({ ten, nhan, loai, placeholder }) => (
            <div className="nhom_truong" key={ten}>
              <label className="nhan_truong" htmlFor={ten}>{nhan}</label>
              {loai === 'password' ? (
                <div className="khung_mat_khau">
                  <input
                    id={ten}
                    name={ten}
                    type={hien_mat_khau[ten] ? 'text' : 'password'}
                    value={du_lieu[ten]}
                    onChange={xu_ly_thay_doi}
                    placeholder={placeholder}
                    className={`o_nhap${loi[ten] ? ' loi' : ''}`}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="nut_hien_mat_khau"
                    onClick={() => bat_tat_hien(ten)}
                    tabIndex={-1}
                  >
                    {hien_mat_khau[ten] ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              ) : (
                <input
                  id={ten}
                  name={ten}
                  type={loai}
                  value={du_lieu[ten]}
                  onChange={xu_ly_thay_doi}
                  placeholder={placeholder}
                  className={`o_nhap${loi[ten] ? ' loi' : ''}`}
                  autoComplete="off"
                />
              )}
              <span className="thong_bao_loi">{loi[ten] || ''}</span>
            </div>
          ))}

          <button
            type="submit"
            className="nut_dang_ky"
            disabled={dang_gui}
          >
            {dang_gui ? 'Đang xử lý...' : 'Đăng ký'}
          </button>
        </form>

        <div className="khu_vuc_lien_ket">
          <Link to="/dang_nhap" className="lien_ket">
            Đã có tài khoản? Đăng nhập
          </Link>
          <Link to="/quen_mat_khau" className="lien_ket">
            Quên mật khẩu?
          </Link>
        </div>
      </div>
    </div>
  );
}
