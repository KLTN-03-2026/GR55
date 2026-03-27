import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import './Header.css';

export default function Header() {
  const { da_dang_nhap, nguoiDung, dang_xuat } = useAuth();
  const dieu_huong = useNavigate();

  const [mo_dropdown, dat_mo_dropdown] = useState(false);
  const [hien_modal_xac_nhan, dat_hien_modal] = useState(false);
  const [dang_xuat_loading, dat_dang_xuat_loading] = useState(false);

  const ref_dropdown = useRef(null);

  useEffect(() => {
    function xu_ly_click_ngoai(su_kien) {
      if (ref_dropdown.current && !ref_dropdown.current.contains(su_kien.target)) {
        dat_mo_dropdown(false);
      }
    }
    document.addEventListener('mousedown', xu_ly_click_ngoai);
    return () => document.removeEventListener('mousedown', xu_ly_click_ngoai);
  }, []);

  function lay_chu_viet_tat(ho_ten) {
    const cac_tu = ho_ten?.trim().split(' ') || [];
    if (cac_tu.length === 1) return cac_tu[0][0].toUpperCase();
    return (cac_tu[0][0] + cac_tu[cac_tu.length - 1][0]).toUpperCase();
  }

  async function xac_nhan_dang_xuat() {
    dat_dang_xuat_loading(true);
    try {
      await api.post('/auth/dang_xuat');
    } catch {
      // Vẫn đăng xuất phía client dù API lỗi
    } finally {
      dang_xuat();
      dat_hien_modal(false);
      dat_mo_dropdown(false);
      dat_dang_xuat_loading(false);
      toast.success('Đăng xuất thành công!');
      dieu_huong('/trang_chu');
    }
  }

  return (
    <>
      <header className="header">
        <Link to="/trang_chu" className="header_logo">
          Book<span>Nest</span>
        </Link>

        <div className="header_nguoi_dung" ref={ref_dropdown}>
          {da_dang_nhap ? (
            <>
              <button
                className="nut_nguoi_dung"
                onClick={() => dat_mo_dropdown(truoc => !truoc)}
              >
                <div className="ten_viet_tat">
                  {lay_chu_viet_tat(nguoiDung?.ho_ten)}
                </div>
                <span>{nguoiDung?.ho_ten}</span>
                <span className={`mui_ten${mo_dropdown ? ' mo' : ''}`}>▼</span>
              </button>

              {mo_dropdown && (
                <div className="menu_dropdown">
                  <div className="menu_thong_tin">
                    <div className="menu_ho_ten">{nguoiDung?.ho_ten}</div>
                    <div className="menu_vai_tro">{nguoiDung?.vai_tro}</div>
                  </div>
                  <button
                    className="menu_muc dang_xuat"
                    onClick={() => {
                      dat_mo_dropdown(false);
                      dat_hien_modal(true);
                    }}
                  >
                    Đăng xuất
                  </button>
                </div>
              )}
            </>
          ) : (
            <Link to="/dang_nhap" className="nut_nguoi_dung">
              Đăng nhập
            </Link>
          )}
        </div>
      </header>

      {hien_modal_xac_nhan && (
        <div className="nen_modal" onClick={e => e.target === e.currentTarget && dat_hien_modal(false)}>
          <div className="hop_modal">
            <h2 className="modal_tieu_de">Xác nhận đăng xuất</h2>
            <p className="modal_noi_dung">
              Bạn có chắc chắn muốn đăng xuất không?
            </p>
            <div className="modal_nut_nhom">
              <button
                className="nut_khong"
                onClick={() => dat_hien_modal(false)}
                disabled={dang_xuat_loading}
              >
                Không
              </button>
              <button
                className="nut_co"
                onClick={xac_nhan_dang_xuat}
                disabled={dang_xuat_loading}
              >
                {dang_xuat_loading ? 'Đang xử lý...' : 'Có, đăng xuất'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
