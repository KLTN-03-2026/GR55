import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// Context & Bảo mật
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
// Import các trang Khách hàng
import DangKy from './pages/DangKy';
import DangNhap from './pages/DangNhap';
import TrangChu from './pages/TrangChu';
import QuenMatKhau from './pages/QuenMatKhau';

// Import các trang Quản trị (Admin)
import QuanTri from './pages/QuanTri';
import QuanLyDanhMuc from './pages/admin/QuanLyDanhMuc';
import QuanLySach from './pages/admin/QuanLySach';

import AdminLayout from './pages/admin/AdminLayout';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* =========================================================
              NHÓM 1: GIAO DIỆN KHÁCH HÀNG 
              (Các trang này sẽ có Header và Footer cố định từ App.js)
          ========================================================= */}
          <Route path="/" element={<Navigate to="/trang_chu" replace />} />
          
          <Route path="/trang_chu" element={<App><TrangChu /></App>} />
          <Route path="/dang_ky" element={<App><DangKy /></App>} />
          <Route path="/dang_nhap" element={<App><DangNhap /></App>} />
          <Route path="/quen_mat_khau" element={<App><QuenMatKhau /></App>} />

          {/* =========================================================
              NHÓM 2: GIAO DIỆN QUẢN TRỊ 
              (Các trang này KHÔNG bọc <App> để tự thiết kế layout riêng)
          ========================================================= */}
          <Route
            path="/quan_tri"
            element={
              // <ProtectedRoute vai_tro_duoc_phep={['quan_tri']}>
                <AdminLayout>
                  <QuanTri />
                </AdminLayout>
              // </ProtectedRoute>
            }
          />
          <Route
            path="/quan_tri/danh_muc"
            element={
              // <ProtectedRoute vai_tro_duoc_phep={['quan_tri']}>
                <AdminLayout>
                  <QuanLyDanhMuc />
                </AdminLayout>
              // </ProtectedRoute>
            }
          />
          <Route
            path="/quan_tri/sach"
            element={
              // <ProtectedRoute vai_tro_duoc_phep={['quan_tri']}>
                <AdminLayout>
                  <QuanLySach />
                </AdminLayout>
              // </ProtectedRoute>
            }
          />
        </Routes>

        {/* Thông báo toàn cục đặt ở đây để dùng chung cho cả Client và Admin */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          closeOnClick
          pauseOnHover
        />
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
