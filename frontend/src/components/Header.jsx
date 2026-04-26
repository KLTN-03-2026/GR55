import { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import './Header.css';
import { FiSearch, FiShoppingCart, FiUser, FiLogOut, FiBookOpen, FiX } from 'react-icons/fi';
import { useQuery } from '@tanstack/react-query';

export default function Header() {
  const { da_dang_nhap, nguoiDung, dang_xuat } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const debounceRef = useRef(null);
  const dropdownRef = useRef(null);
  // Sync ô tìm kiếm với URL khi đang ở trang /tim_kiem
  useEffect(() => {
    if (location.pathname === '/tim_kiem') {
      setSearchQuery(searchParams.get('q') || '');
    }
  }, [location.pathname, searchParams]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cleanup debounce timer khi unmount
  useEffect(() => {
    return () => clearTimeout(debounceRef.current);
  }, []);

  const getInitials = (name) => {
    const words = name?.trim().split(' ') || [];
    if (words.length === 0) return 'U';
    if (words.length === 1) return words[0][0].toUpperCase();
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await api.post('/auth/dang_xuat');
    } catch {
      // Client-side logout even if API fails
    } finally {
      dang_xuat();
      setShowLogoutModal(false);
      setIsDropdownOpen(false);
      setIsLoggingOut(false);
      toast.success('Đăng xuất thành công!');
      navigate('/trang_chu');
    }
  };

  // Khi gõ: debounce 300ms rồi navigate đến trang tìm kiếm
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      const q = value.trim();
      if (q.length >= 1) {
        navigate(`/tim_kiem?q=${encodeURIComponent(q)}`, { replace: location.pathname === '/tim_kiem' });
      } else if (location.pathname === '/tim_kiem') {
        navigate('/tim_kiem', { replace: true });
      }
    }, 300);
  };

  // Enter cũng navigate
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    clearTimeout(debounceRef.current);
    const q = searchQuery.trim();
    if (q) {
      navigate(`/tim_kiem?q=${encodeURIComponent(q)}`, { replace: location.pathname === '/tim_kiem' });
    }
  };

  // Nút xóa nhanh nội dung tìm kiếm
  const clearSearch = () => {
    setSearchQuery('');
    clearTimeout(debounceRef.current);
    if (location.pathname === '/tim_kiem') {
      navigate('/tim_kiem', { replace: true });
    }
  };

  const toggleDropdown = useCallback(() => {
    setIsDropdownOpen(prev => !prev);
  }, []);

  const { data: danh_muc = [] } = useQuery({
    queryKey: ['danh_muc_trang_chu'],
    queryFn: async () => {
      const phan_hoi = await api.get('/home/danh_muc');
      return phan_hoi.data;
    },
    staleTime: 60 * 60 * 1000,
  });

  const { data: cartCount = 0 } = useQuery({
    queryKey: ['so_luong_gio_hang', nguoiDung?.ma_nguoi_dung],
    queryFn: async () => {
      const phan_hoi = await api.get('/gio_hang/so_luong');
      return phan_hoi.data;
    },
    staleTime: 0,
    enabled: da_dang_nhap,
  });

  return (
    <>
      <header className="header">
        <div className="header-container">
          {/* Logo */}
          <Link to="/trang_chu" className="logo">
            <span className="logo-icon">📚</span>
            <span className="logo-text">
              BookNest
            </span>
          </Link>

          {/* Search Bar */}
          <form className="search-form" onSubmit={handleSearchSubmit}>
            <div className="search-input-wrapper">
              <FiSearch className="search-icon" />
              <input
                className="search-input"
                type="text"
                placeholder="Tìm kiếm sách, tác giả..."
                value={searchQuery}
                onChange={handleSearchChange}
              />
              
              {/* Nút xóa từ khóa */}
              {searchQuery && (
                <button type="button" className="clear-search-btn" onClick={clearSearch}>
                  <FiX />
                </button>
              )}

            </div>
          </form>

          {/* Right Actions */}
          <div className="header-actions">
            <Link to="/gio_hang" className="cart-btn" title="Giỏ hàng">
              <FiShoppingCart className="cart-icon" />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </Link>

            {/* User Menu */}
            <div className="user-menu" ref={dropdownRef}>
              {da_dang_nhap ? (
                <>
                  <button className="user-btn" onClick={toggleDropdown} aria-expanded={isDropdownOpen}>
                    <div className="user-avatar">
                      {getInitials(nguoiDung?.ho_ten)}
                    </div>
                    <span className="user-name">{nguoiDung?.ho_ten?.split(' ').pop()}</span>
                  </button>

                  {isDropdownOpen && (
                    <div className="dropdown">
                      <div className="dropdown-header">
                        <div className="dropdown-avatar">
                          {getInitials(nguoiDung?.ho_ten)}
                        </div>
                        <div>
                          <div className="dropdown-name">{nguoiDung?.ho_ten}</div>
                          <div className="dropdown-role">
                            {nguoiDung?.vai_tro === 'quan_tri' ? '👑 Quản trị viên' : '👤 Thành viên'}
                          </div>
                        </div>
                      </div>
                      
                      {nguoiDung?.vai_tro === 'quan_tri' && (
                        <Link to="/quan_tri" className="dropdown-item" onClick={() => setIsDropdownOpen(false)}>
                          <span className="item-icon">⚙️</span>
                          Bảng điều khiển Admin
                        </Link>
                      )}

                      <Link to="/thu_vien" className="dropdown-item" onClick={() => setIsDropdownOpen(false)}>
                        <FiBookOpen className="item-icon" />
                        Thư viện của tôi
                      </Link>

                      <Link to="/tai_khoan" className="dropdown-item" onClick={() => setIsDropdownOpen(false)}>
                        <FiUser className="item-icon" />
                        Tài khoản cá nhân
                      </Link>

                      <button 
                        className="dropdown-item logout-item"
                        onClick={() => setShowLogoutModal(true)}
                      >
                        <FiLogOut className="item-icon" />
                        Đăng xuất
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="auth-buttons">
                  <Link to="/dang_nhap" className="btn-login">Đăng nhập</Link>
                  <Link to="/dang_ky" className="btn-signup">Đăng ký</Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="nav">
          <ul className="nav-list">
            <li><Link to="/trang_chu" className="nav-link">Trang chủ</Link></li>
            
            <li className="mega-nav-item">
              <span className="nav-link mega-trigger">Danh mục sách</span>
              <div className="mega-menu">
                <div className="mega-column">
                  <h4>📖 Thể loại sách</h4>
                  {danh_muc
                    .map(dm => (
                      <Link key={dm.ma_dm} to={`/the_loai/${dm.ma_dm}`} className="mega-link">
                        {dm.ten_danh_muc}
                      </Link>
                    ))}
                </div>
              </div>
            </li>

            <li><Link to="/khuyen_mai" className="nav-link">Khuyến mãi</Link></li>
            <li><Link to="/gioi_thieu" className="nav-link">Giới thiệu</Link></li>
          </ul>
        </nav>
      </header>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowLogoutModal(false)}>
          <div className="modal">
            <div className="modal-icon">🚪</div>
            <h3 className="modal-title">Xác nhận đăng xuất</h3>
            <p className="modal-text">Bạn có chắc muốn rời khỏi BookNest?</p>
            <div className="modal-actions">
              <button 
                className="btn-secondary" 
                onClick={() => setShowLogoutModal(false)}
                disabled={isLoggingOut}
              >
                Hủy
              </button>
              <button 
                className="btn-primary" 
                onClick={handleLogout}
                disabled={isLoggingOut}
              >
                {isLoggingOut ? 'Đang đăng xuất...' : 'Đăng xuất'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}