import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FiPieChart, FiList, FiChevronDown, FiLogOut } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

export default function AdminSidebar() {
    const { nguoiDung, dang_xuat } = useAuth();
    const navigate = useNavigate();
    const [moQuanLy, setMoQuanLy] = useState(true);
    const [hien_modal_xac_nhan, dat_hien_modal] = useState(false);
    const [dang_xuat_loading, dat_dang_xuat_loading] = useState(false);

    async function xac_nhan_dang_xuat() {
        dat_dang_xuat_loading(true);
        try {
            await api.post('/auth/dang_xuat');
        } catch {
            // Vẫn đăng xuất phía client dù API lỗi
        } finally {
            dang_xuat();
            dat_hien_modal(false);
            dat_dang_xuat_loading(false);
            toast.success('Đăng xuất thành công!');
            navigate('/dang_nhap', { replace: true });
        }
    }

    return (
        <>
            <aside className="admin-sidebar">
                {/* Logo */}
                <div className="sidebar-brand">
                    <span className="brand-icon">📚</span>
                    <span className="brand-name">BookNest</span>
                    <span className="brand-badge">Admin</span>
                </div>

                <nav className="sidebar-nav">
                    {/* Tổng quan */}
                    <div className="nav-section-label">Tổng quan</div>
                    <NavLink to="/quan_tri/thong_ke" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                        <FiPieChart className="nav-icon" />
                        <span>Thống kê</span>
                    </NavLink>

                    {/* Quản lý — accordion chứa tất cả */}
                    <div className="nav-section-label">Quản lý</div>
                    <div className="nav-group">
                        <div className="nav-item group-title" onClick={() => setMoQuanLy(!moQuanLy)}>
                            <div className="nav-item-left">
                                <FiList className="nav-icon" />
                                <span>Tất cả chức năng</span>
                            </div>
                            <FiChevronDown className={`arrow-icon ${moQuanLy ? 'open' : ''}`} />
                        </div>

                        {moQuanLy && (
                            <div className="sub-menu">
                                <NavLink to="/quan_tri/danh_muc" className={({ isActive }) => isActive ? "sub-item active" : "sub-item"}>
                                    Danh mục
                                </NavLink>
                                <NavLink to="/quan_tri/sach" className={({ isActive }) => isActive ? "sub-item active" : "sub-item"}>
                                    Sách
                                </NavLink>
                                <NavLink to="/quan_tri/nguoi_dung" className={({ isActive }) => isActive ? "sub-item active" : "sub-item"}>
                                    Người dùng
                                </NavLink>
                                <NavLink to="/quan_tri/don_hang" className={({ isActive }) => isActive ? "sub-item active" : "sub-item"}>
                                    Đơn hàng
                                </NavLink>
                                <NavLink to="/quan_tri/danh_gia" className={({ isActive }) => isActive ? "sub-item active" : "sub-item"}>
                                    Đánh giá
                                </NavLink>
                                <NavLink to="/quan_tri/giam_gia" className={({ isActive }) => isActive ? "sub-item active" : "sub-item"}>
                                    Giảm giá
                                </NavLink>
                                <NavLink to="/quan_tri/goi_hoi_vien" className={({ isActive }) => isActive ? "sub-item active" : "sub-item"}>
                                    Gói hội viên
                                </NavLink>
                            </div>
                        )}
                    </div>
                </nav>

                {/* Footer user */}
                <div className="sidebar-footer">
                    <div className="user-avatar">
                        {nguoiDung?.ho_ten ? nguoiDung.ho_ten.charAt(0).toUpperCase() : 'A'}
                    </div>
                    <div className="user-info">
                        <span className="user-name">{nguoiDung?.ho_ten || 'Admin'}</span>
                        <span className="user-role">Quản trị viên</span>
                    </div>
                    <button className="logout-btn" onClick={() => dat_hien_modal(true)} title="Đăng xuất">
                        <FiLogOut />
                    </button>
                </div>
            </aside>

            {hien_modal_xac_nhan && (
                <div className="modal-overlay" onClick={e => e.target === e.currentTarget && dat_hien_modal(false)}>
                    <div className="modal-box">
                        <h2 className="modal-title">Xác nhận đăng xuất</h2>
                        <p className="modal-content">Bạn có chắc chắn muốn đăng xuất không?</p>
                        <div className="modal-actions">
                            <button className="btn-cancel" onClick={() => dat_hien_modal(false)} disabled={dang_xuat_loading}>
                                Hủy bỏ
                            </button>
                            <button className="btn-confirm" onClick={xac_nhan_dang_xuat} disabled={dang_xuat_loading}>
                                {dang_xuat_loading ? 'Đang xử lý...' : 'Đăng xuất'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
