import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import './Header.css';

// Import Icons
import { FiSearch, FiShoppingCart, FiUser, FiLogOut, FiMenu } from 'react-icons/fi';
import { MdOutlineClose } from 'react-icons/md';

export default function Header() {
  const { da_dang_nhap, nguoiDung, dang_xuat } = useAuth();
  const dieu_huong = useNavigate();

  const [mo_dropdown, dat_mo_dropdown] = useState(false);
  const [hien_modal_xac_nhan, dat_hien_modal] = useState(false);
  const [dang_xuat_loading, dat_dang_xuat_loading] = useState(false);
  const [tu_khoa_tim_kiem, dat_tu_khoa_tim_kiem] = useState('');
  const [mo_menu_mobile, dat_mo_menu_mobile] = useState(false);

  const ref_dropdown = useRef(null);

  // Xử lý click ra ngoài để đóng dropdown user
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
    if (cac_tu.length === 0) return 'U';
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
      dieu_huong('/dang_nhap', { replace: true });
    }
  }

  // Xử lý khi ấn Enter hoặc click nút Tìm kiếm
  const xu_ly_tim_kiem = (e) => {
    e.preventDefault();
    if (tu_khoa_tim_kiem.trim()) {
      // Điều hướng sang trang tìm kiếm (bạn cần tạo trang này sau)
      dieu_huong(`/tim_kiem?q=${tu_khoa_tim_kiem}`);
    }
  };

  return (
    <>
      <header className="header-container">
        <div className="header-main">
          {/* Logo */}
          <Link to="/trang_chu" className="header-logo">
            Book<span>Nest</span>
          </Link>

          {/* Nút Toggle Menu Mobile */}
          <button className="mobile-menu-btn" onClick={() => dat_mo_menu_mobile(!mo_menu_mobile)}>
            {mo_menu_mobile ? <MdOutlineClose /> : <FiMenu />}
          </button>

          {/* Thanh tìm kiếm */}
          <div className="header-search">
            <form onSubmit={xu_ly_tim_kiem}>
              <input
                type="text"
                placeholder="Tìm kiếm tên sách, tác giả..."
                value={tu_khoa_tim_kiem}
                onChange={(e) => dat_tu_khoa_tim_kiem(e.target.value)}
              />
              <button type="submit" className="search-btn">
                <FiSearch />
              </button>
            </form>
          </div>

          {/* Các công cụ bên phải (Giỏ hàng, User) */}
          <div className="header-actions">
            {/* Giỏ hàng */}
            <Link to="/gio_hang" className="action-item cart-item">
              <FiShoppingCart className="action-icon" />
              <span className="cart-badge">3</span> {/* Số 3 là mô phỏng, bạn thay bằng state giỏ hàng sau */}
            </Link>

            {/* Tài khoản Người dùng */}
            <div className="action-item user-dropdown-container" ref={ref_dropdown}>
              {da_dang_nhap ? (
                <>
                  <div
                    className="user-trigger"
                    onClick={() => dat_mo_dropdown(truoc => !truoc)}
                  >
                    <div className="user-avatar">
                      {lay_chu_viet_tat(nguoiDung?.ho_ten)}
                    </div>
                    <span className="user-name">{nguoiDung?.ho_ten?.split(' ').pop()}</span>
                  </div>

                  {mo_dropdown && (
                    <div className="dropdown-menu">
                      <div className="dropdown-header">
                        <div className="dropdown-name">{nguoiDung?.ho_ten}</div>
                        <div className="dropdown-role">{nguoiDung?.vai_tro === 'quan_tri' ? 'Quản trị viên' : 'Thành viên'}</div>
                      </div>
                      
                      {/* Nếu là Admin thì hiện nút vào trang Quản trị */}
                      {nguoiDung?.vai_tro === 'quan_tri' && (
                        <Link to="/quan_tri" className="dropdown-item" onClick={() => dat_mo_dropdown(false)}>
                          Bảng điều khiển (Admin)
                        </Link>
                      )}

                      <Link to="/tai_khoan" className="dropdown-item" onClick={() => dat_mo_dropdown(false)}>
                        <FiUser className="dropdown-icon" /> Thông tin tài khoản
                      </Link>
                      
                      <button
                        className="dropdown-item text-danger"
                        onClick={() => {
                          dat_mo_dropdown(false);
                          dat_hien_modal(true);
                        }}
                      >
                        <FiLogOut className="dropdown-icon" /> Đăng xuất
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <Link to="/dang_nhap" className="login-btn">
                  Đăng nhập
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Thanh Điều hướng (Navigation) */}
        <nav className={`header-nav ${mo_menu_mobile ? 'open' : ''}`}>
          <ul className="nav-list">
            <li><Link to="/trang_chu" onClick={() => dat_mo_menu_mobile(false)}>Trang chủ</Link></li>
            <li><Link to="/danh_muc" onClick={() => dat_mo_menu_mobile(false)}>Danh mục sách</Link></li>
            <li><Link to="/khuyen_mai" onClick={() => dat_mo_menu_mobile(false)}>Khuyến mãi</Link></li>
            <li><Link to="/gioi_thieu" onClick={() => dat_mo_menu_mobile(false)}>Giới thiệu</Link></li>
            <li><Link to="/lien_he" onClick={() => dat_mo_menu_mobile(false)}>Liên hệ</Link></li>
          </ul>
        </nav>
      </header>

      {/* Modal Xác nhận Đăng xuất */}
      {hien_modal_xac_nhan && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && dat_hien_modal(false)}>
          <div className="modal-box">
            <h2 className="modal-title">Xác nhận đăng xuất</h2>
            <p className="modal-content">Bạn có chắc chắn muốn đăng xuất không?</p>
            <div className="modal-actions">
              <button
                className="btn-cancel"
                onClick={() => dat_hien_modal(false)}
                disabled={dang_xuat_loading}
              >
                Hủy bỏ
              </button>
              <button
                className="btn-confirm"
                onClick={xac_nhan_dang_xuat}
                disabled={dang_xuat_loading}
              >
                {dang_xuat_loading ? 'Đang xử lý...' : 'Đăng xuất'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}