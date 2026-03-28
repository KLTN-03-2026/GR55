import React from 'react';
import { FiBell, FiSearch, FiMenu } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import './AdminHeader.css';

export default function AdminHeader() {
    const { nguoiDung } = useAuth();

    return (
        <header className="admin-header">
            <div className="admin-header-left">
                {/* Nút menu dùng cho màn hình nhỏ sau này */}
                <button className="menu-toggle-btn">
                    <FiMenu />
                </button>
                
                {/* Thanh tìm kiếm toàn cục của Admin */}
                <div className="admin-search-bar">
                    <FiSearch className="search-icon" />
                    <input type="text" placeholder="Tìm kiếm nhanh..." />
                </div>
            </div>

            <div className="admin-header-right">
                {/* Nút thông báo */}
                <button className="icon-btn notification-btn">
                    <FiBell />
                    <span className="badge">3</span>
                </button>
                
                {/* Thông tin tài khoản Admin */}
                <div className="admin-profile">
                    <div className="admin-avatar">
                        {nguoiDung?.ho_ten ? nguoiDung.ho_ten.charAt(0).toUpperCase() : 'A'}
                    </div>
                    <span className="admin-name">{nguoiDung?.ho_ten || 'Admin'}</span>
                </div>
            </div>
        </header>
    );
}