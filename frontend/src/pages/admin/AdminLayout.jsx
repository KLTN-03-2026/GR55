import React from 'react';
import AdminSidebar from './AdminSidebar';
import './AdminLayout.css';
import AdminHeader from './AdminHeader';

export default function AdminLayout({ children }) {
    return (
        <div className="admin-wrapper">
            <AdminSidebar />
            <div className="admin-main">
                <AdminHeader/>
                <div className="admin-content">
                    {children}
                </div>
            </div>
        </div>
    );
}