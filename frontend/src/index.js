import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Context & Bảo mật
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Trang khách hàng
import TrangChu from "./pages/TrangChu";
import DangKy from "./pages/DangKy";
import DangNhap from "./pages/DangNhap";
import QuenMatKhau from "./pages/QuenMatKhau";
import SachChiTiet from "./pages/SachChiTiet";
import DocSach from "./pages/DocSach";
import DocThu from "./pages/DocThu";
import DocSachMienPhi from "./pages/DocSachMienPhi";
import TaiKhoan from "./pages/TaiKhoan";
import ThuVien from "./pages/ThuVien";
import GioHang from "./pages/GioHang";
import XacNhanDonHang from "./pages/XacNhanDonHang";
import KetQuaThanhToan from "./pages/KetQuaThanhToan";
import TimKiem from "./pages/TimKiem";
import LocSachTheoTheLoai from "./pages/LocSachTheoTheLoai";

// Danh sách sách
import DanhSachNoiBat from "./pages/booklist/DanhSachNoiBat";
import DanhSachMienPhi from "./pages/booklist/DanhSachMienPhi";
import DanhSachHoiVien from "./pages/booklist/DanhSachHoiVien";
import DanhSachGoiY from "./pages/booklist/DanhSachGoiY";

// Admin
import AdminLayout from "./pages/admin/AdminLayout";
import QuanLyDanhMuc from "./pages/admin/QuanLyDanhMuc";
import QuanLySach from "./pages/admin/QuanLySach";
import QuanLyNguoiDung from "./pages/admin/QuanLyNguoiDung";
import LichSuDonHang from "./pages/LichSuDonHang";
import ChiTietDonHang from "./pages/ChiTietDonHang";
import QuanLyDanhGia from "./pages/admin/QuanLyDanhGia";
import QuanLyGiamGia from "./pages/admin/QuanLyGiamGia";
import QuanLyDonHang from "./pages/admin/QuanLyDonHang";
import ChiTietDonHangAdmin from "./pages/admin/ChiTietDonHangAdmin";
import ThongKe from "./pages/admin/ThongKe";
import GoiHoiVien from "./pages/GoiHoiVien";
import KetQuaHoiVien from "./pages/KetQuaHoiVien";
import QuanLyGoiHoiVien from "./pages/admin/QuanLyGoiHoiVien";

const queryClient = new QueryClient();
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>

            <Route path="/" element={<Navigate to="/trang_chu" replace />} />

            <Route path="/trang_chu" element={<App><TrangChu /></App>} />
            <Route path="/dang_ky" element={<App><DangKy /></App>} />
            <Route path="/dang_nhap" element={<App><DangNhap /></App>} />
            <Route path="/quen_mat_khau" element={<App><QuenMatKhau /></App>} />

            <Route path="/sach/:ma_sach" element={<App><SachChiTiet /></App>} />
            <Route path="/tim_kiem" element={<App><TimKiem /></App>} />

            {/* Danh sách sách */}
            <Route path="/sach_noi_bat" element={<App><DanhSachNoiBat /></App>} />
            <Route path="/sach_mien_phi" element={<App><DanhSachMienPhi /></App>} />
            <Route path="/sach_hoi_vien" element={<App><DanhSachHoiVien /></App>} />
            <Route path="/sach_goi_y" element={<App><DanhSachGoiY /></App>} />
            <Route path="/the_loai/:ma_the_loai" element={<App><LocSachTheoTheLoai /></App>} />

            {/* Đọc sách */}
            <Route path="/doc_thu/:ma_sach" element={<DocThu />} />
            <Route path="/doc_sach_mien_phi/:ma_sach" element={<DocSachMienPhi />} />

            <Route path="/doc_sach/:ma_sach" element={
              <ProtectedRoute vai_tro_duoc_phep={["thanh_vien", "quan_tri"]}>
                <App><DocSach /></App>
              </ProtectedRoute>
            } />

            {/* User */}
            <Route path="/gio_hang" element={
              <ProtectedRoute vai_tro_duoc_phep={["thanh_vien", "quan_tri"]}>
                <App><GioHang /></App>
              </ProtectedRoute>
            } />

            <Route path="/thanh_toan/xac_nhan" element={
              <ProtectedRoute vai_tro_duoc_phep={["thanh_vien", "quan_tri"]}>
                <App><XacNhanDonHang /></App>
              </ProtectedRoute>
            } />
            <Route path="/thanh_toan/ket_qua" element={
              <ProtectedRoute vai_tro_duoc_phep={["thanh_vien", "quan_tri"]}>
                <App><KetQuaThanhToan /></App>
              </ProtectedRoute>
            } />

            <Route path="/thu_vien" element={
              <ProtectedRoute vai_tro_duoc_phep={["thanh_vien", "quan_tri"]}>
                <App><ThuVien /></App>
              </ProtectedRoute>
            } />

            <Route path="/tai_khoan" element={
              <ProtectedRoute vai_tro_duoc_phep={["thanh_vien", "quan_tri"]}>
                <App><TaiKhoan /></App>
              </ProtectedRoute>
            } />

            <Route path="/lich_su_don_hang" element={
              <ProtectedRoute vai_tro_duoc_phep={["thanh_vien", "quan_tri"]}>
                <App><LichSuDonHang /></App>
              </ProtectedRoute>
            } />

            <Route path="/lich_su_don_hang/:id_dh" element={
              <ProtectedRoute vai_tro_duoc_phep={["thanh_vien", "quan_tri"]}>
                <App><ChiTietDonHang /></App>
              </ProtectedRoute>
            } />

            <Route path="/hoi_vien/ket_qua" element={
              <ProtectedRoute vai_tro_duoc_phep={["thanh_vien", "quan_tri"]}>
                <App><KetQuaHoiVien /></App>
              </ProtectedRoute>

            } />
            {/* ADMIN */}
            <Route path="/quan_tri" element={<Navigate to="/quan_tri/thong_ke" replace />} />
            <Route path="/quan_tri/danh_muc" element={<AdminLayout><QuanLyDanhMuc /></AdminLayout>} />
            <Route path="/quan_tri/sach" element={<AdminLayout><QuanLySach /></AdminLayout>} />
            <Route path="/quan_tri/nguoi_dung" element={<AdminLayout><QuanLyNguoiDung /></AdminLayout>} />
            <Route path="/quan_tri/danh_gia" element={<AdminLayout><QuanLyDanhGia /></AdminLayout>} />
            <Route path="/quan_tri/giam_gia" element={<AdminLayout><QuanLyGiamGia /></AdminLayout>} />
            <Route path="/quan_tri/don_hang" element={<AdminLayout><QuanLyDonHang /></AdminLayout>} />
            <Route path="/quan_tri/don_hang/:id_dh" element={<AdminLayout><ChiTietDonHangAdmin /></AdminLayout>} />
            <Route path="/quan_tri/thong_ke" element={<AdminLayout><ThongKe /></AdminLayout>} />
            <Route path="/hoi_vien" element={<App><GoiHoiVien /></App>} />
            <Route path="/quan_tri/goi_hoi_vien" element={<AdminLayout><QuanLyGoiHoiVien /></AdminLayout>} />
          </Routes>

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

reportWebVitals();