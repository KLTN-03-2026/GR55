import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Context & Bảo mật
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Import các trang Khách hàng
import DangKy from "./pages/DangKy";
import DangNhap from "./pages/DangNhap";
import TrangChu from "./pages/TrangChu";
import QuenMatKhau from "./pages/QuenMatKhau";
import SachChiTiet from "./pages/SachChiTiet";
import DocSach from "./pages/DocSach";
import DocThu from "./pages/DocThu";
import TaiKhoan from "./pages/TaiKhoan";
import ThuVien from "./pages/ThuVien";
import GioHang from "./pages/GioHang";
import DocSachMienPhi from "./pages/DocSachMienPhi";
import TimKiem from "./pages/TimKiem";

// Danh sách sách
import DanhSachNoiBat from "./pages/booklist/DanhSachNoiBat";
import DanhSachMoiNhat from "./pages/booklist/DanhSachMoiNhat";
import DanhSachHoiVien from "./pages/booklist/DanhSachHoiVien";
import DanhSachGoiY from "./pages/booklist/DanhSachGoiY";

// Admin
import AdminLayout from "./pages/admin/AdminLayout";
import QuanTri from "./pages/QuanTri";
import QuanLyDanhMuc from "./pages/admin/QuanLyDanhMuc";
import QuanLySach from "./pages/admin/QuanLySach";
import QuanLyNguoiDung from "./pages/admin/QuanLyNguoiDung";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import LocSachTheoTheLoai from "./pages/LocSachTheoTheLoai";

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
            <Route path="/doc_sach/:ma_sach" element={<App><DocSach /></App>} />
            <Route path="/doc_thu/:ma_sach" element={<DocThu />} />
            <Route path="/doc_sach_mien_phi/:ma_sach" element={<DocSachMienPhi />} />

            <Route path="/sach_moi_nhat" element={<App><DanhSachMoiNhat /></App>} />
            <Route path="/sach_hoi_vien" element={<App><DanhSachHoiVien /></App>} />
            <Route path="/sach_goi_y" element={<App><DanhSachGoiY /></App>} />
            <Route path="/sach_noi_bat" element={<App><DanhSachNoiBat /></App>} />
            <Route path="/the_loai/:ma_the_loai" element={<App><LocSachTheoTheLoai /></App>} />

            <Route path="/gio_hang" element={<App><GioHang /></App>} />
            <Route path="/thu_vien" element={<App><ThuVien /></App>} />
            <Route path="/tim_kiem" element={<App><TimKiem /></App>} />

            <Route
              path="/tai_khoan"
              element={
                <ProtectedRoute vai_tro_duoc_phep={["thanh_vien", "quan_tri"]}>
                  <App><TaiKhoan /></App>
                </ProtectedRoute>
              }
            />

            {/* ADMIN */}
            <Route path="/quan_tri" element={<AdminLayout><QuanTri /></AdminLayout>} />
            <Route path="/quan_tri/danh_muc" element={<AdminLayout><QuanLyDanhMuc /></AdminLayout>} />
            <Route path="/quan_tri/sach" element={<AdminLayout><QuanLySach /></AdminLayout>} />
            <Route path="/quan_tri/nguoi_dung" element={<AdminLayout><QuanLyNguoiDung /></AdminLayout>} />

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