import React from 'react';
import AdminSidebar from './AdminSidebar';
import './AdminLayout.css';

export default function AdminLayout({ children }) {
    return (
        <div className="admin-wrapper">
            <AdminSidebar />
            <div className="admin-main">
                <div className="admin-content">
                    {children}
                </div>
            </div>
        </div>
    );
}