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
import QuanLyNguoiDung from './pages/admin/QuanLyNguoiDung';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import DanhSachNoiBat from './pages/booklist/DanhSachNoiBat';
import DanhSachMoiNhat from './pages/booklist/DanhSachMoiNhat';
import DanhSachHoiVien from './pages/booklist/DanhSachHoiVien';
import DanhSachGoiY from './pages/booklist/DanhSachGoiY';
import TheCardSach from './components/TheCardSach';
import SachChiTiet from './pages/SachChiTiet';
import DocSach from './pages/DocSach';
import DocThu from './pages/DocThu';
import TaiKhoan from './pages/TaiKhoan';
import ThuVien from './pages/ThuVien';

const queryClient = new QueryClient();
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            {/* NHÓM 1: GIAO DIỆN KHÁCH HÀNG (Các trang này sẽ có Header và Footer cố định từ App.js) */}
            <Route path="/" element={<Navigate to="/trang_chu" replace />} />

            <Route path="/trang_chu" element={<App><TrangChu /></App>} />
            <Route path="/dang_ky" element={<App><DangKy /></App>} />
            <Route path="/dang_nhap" element={<App><DangNhap /></App>} />
            <Route path="/quen_mat_khau" element={<App><QuenMatKhau /></App>} />
            <Route path="/sach_chi_tiet/:ma_sach" element={<App><SachChiTiet /></App>} />
            <Route path='/doc_sach/:ma_sach' element={<App><DocSach /></App>} />
            <Route path="/doc_thu/:ma_sach" element={<DocThu />} />

            <Route path='/sach/:masach' element={<App><TheCardSach /> </App>} />
            <Route path="/sach_moi_nhat" element={<App><DanhSachMoiNhat /></App>} />
            <Route path="/sach_hoi_vien" element={<App><DanhSachHoiVien /></App>} />
            <Route path="/sach_goi_y" element={<App><DanhSachGoiY /></App>} />
            <Route path="/sach_noi_bat" element={<App><DanhSachNoiBat /></App>} />
            <Route path="/thu_vien" element={<App><ThuVien /></App>} />
            {/* NHÓM 2: GIAO DIỆN QUẢN TRỊ (Các trang này KHÔNG bọc <App> để tự thiết kế layout riêng)*/}
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
            <Route
              path="/quan_tri/nguoi_dung"
              element={
                // <ProtectedRoute vai_tro_duoc_phep={['quan_tri']}>
                <AdminLayout>
                  <QuanLyNguoiDung />
                </AdminLayout>
                // </ProtectedRoute>
              }
            />
            <Route
              path="/tai_khoan"
              element={
                <ProtectedRoute vai_tro_duoc_phep={['thanh_vien', 'quan_tri']}>
                  <App>
                    <TaiKhoan />
                  </App>
                </ProtectedRoute>
              }
            />
          </Routes>
          {/* <Route path='/sach_noi_bat' element={<App><DanhSachSachNoiBat /></App>} />
        <Route path='/sach_moi_nhat' element={<App><DanhSachSachMoi /></App>} />
        <Route path='/sach_hoi_vien' element={<App><DanhSachSachHoiVien /></App>} />
        <Route path='/sach_goi_y' element={<App><DanhSachSachGoiY /></App>} /> */}

          {/* Thông báo toàn cục đặt ở đây để dùng chung cho cả Client và Admin */}
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            closeOnClick
            pauseOnHover
          />
        </BrowserRouter>
      </QueryClientProvider>
    </AuthProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
