import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FiGrid, FiFolder, FiUsers, FiGlobe, FiShoppingCart, FiLogOut, FiMessageSquare, FiTag } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import '../../components/Header.css';

export default function AdminSidebar() {
    const { nguoiDung, dang_xuat } = useAuth();
    const navigate = useNavigate();
    const [moQuanLiChung, setMoQuanLiChung] = useState(true);
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
                <div className="sidebar-header">
                    <div className="menu-icon">≡</div>
                </div>

                <nav className="sidebar-nav">
                    <NavLink to="/quan_tri" end className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                        <FiGrid className="nav-icon" /> Tổng quan
                    </NavLink>

                    {/* Khối menu có menu con (Accordion) */}
                    <div className="nav-group">
                        <div className="nav-item group-title" onClick={() => setMoQuanLiChung(!moQuanLiChung)}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <FiFolder className="nav-icon" /> Quản lí chung
                            </div>
                            <span className={`arrow ${moQuanLiChung ? 'open' : ''}`}>›</span>
                        </div>

                        {moQuanLiChung && (
                            <div className="sub-menu">
                                <NavLink to="/quan_tri/danh_muc" className={({ isActive }) => isActive ? "sub-item active" : "sub-item"}>
                                    › Quản lý danh mục
                                </NavLink>
                                <NavLink to="/quan_tri/sach" className={({ isActive }) => isActive ? "sub-item active" : "sub-item"}>
                                    › Quản lý sách
                                </NavLink>
                                <NavLink to="/quan_tri/nguoi_dung" className={({ isActive }) => isActive ? "sub-item active" : "sub-item"}>
                                    › Quản lý người dùng
                                </NavLink>
                            </div>
                        )}
                    </div>

                    <NavLink to="/quan_tri/giao_dien" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                        <FiGlobe className="nav-icon" /> Giao diện
                    </NavLink>
                    <NavLink to="/quan_tri/don_hang" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                        <FiShoppingCart className="nav-icon" /> Đơn hàng
                    </NavLink>
                    <NavLink to="/quan_tri/danh_gia" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                        <FiMessageSquare className="nav-icon" /> Đánh giá
                    </NavLink>
                    <NavLink to="/quan_tri/khuyen_mai" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                        <FiTag className="nav-icon" /> Khuyến mãi
                    </NavLink>
                </nav>

                {/* Phần hiển thị User ở đáy Sidebar */}
                <div className="sidebar-footer">
                    <div className="user-avatar">
                        {nguoiDung?.ho_ten ? nguoiDung.ho_ten.charAt(0).toUpperCase() : 'A'}
                    </div>
                    <span className="user-name">{nguoiDung?.ho_ten || 'Admin'}</span>
                    <button
                        className="logout-btn"
                        onClick={() => dat_hien_modal(true)}
                        title="Đăng xuất"
                    >
                        <FiLogOut />
                    </button>
                </div>
            </aside>

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
