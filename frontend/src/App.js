import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import DangKy from "./pages/DangKy";
import DangNhap from "./pages/DangNhap";
import TrangChu from "./pages/TrangChu";
import QuanTri from "./pages/QuanTri";
import QuenMatKhau from "./pages/QuenMatKhau";
import QuanLyDanhMuc from "./pages/admin/QuanLyDanhMuc";
import QuanLySach from "./pages/admin/QuanLySach";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/trang_chu" replace />} />
          <Route path="/dang_ky" element={<DangKy />} />
          <Route path="/dang_nhap" element={<DangNhap />} />
          <Route path="/quen_mat_khau" element={<QuenMatKhau />} />
          <Route path="/trang_chu" element={<TrangChu />} />
          <Route
            path="/quan_tri"
            element={
              <ProtectedRoute vai_tro_duoc_phep={["quan_tri"]}>
                <QuanTri />
              </ProtectedRoute>
            }
          />
          <Route
            path="/quan_tri/danh_muc"
            element={
              <ProtectedRoute vai_tro_duoc_phep={["quan_tri"]}>
                <QuanLyDanhMuc />
              </ProtectedRoute>
            }
          />
          <Route
            path="/quan_tri/sach"
            element={
              <ProtectedRoute vai_tro_duoc_phep={["quan_tri"]}>
                <QuanLySach />
              </ProtectedRoute>
            }
          />
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          closeOnClick
          pauseOnHover
        />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
