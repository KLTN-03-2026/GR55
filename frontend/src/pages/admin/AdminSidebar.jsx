import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FiGrid, FiFolder, FiBook, FiUsers, FiGlobe, FiShoppingCart } from 'react-icons/fi';
// Lưu ý: Kiểm tra đường dẫn import AuthContext xem đã khớp với thư mục của bạn chưa nhé
import { useAuth } from '../../context/AuthContext'; 

export default function AdminSidebar() {
    const { nguoiDung } = useAuth();
    // State để mở/đóng menu con của phần "Quản lí chung"
    const [moQuanLiChung, setMoQuanLiChung] = useState(true);

    return (
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
            </nav>

            {/* Phần hiển thị User ở đáy Sidebar */}
            <div className="sidebar-footer">
                <div className="user-avatar">
                    <FiUsers />
                </div>
                <span className="user-name">{nguoiDung?.ho_ten || 'Admin'}</span>
            </div>
        </aside>
    );
}