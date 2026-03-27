import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, vai_tro_duoc_phep }) {
  const { da_dang_nhap, nguoiDung } = useAuth();

  if (!da_dang_nhap) {
    return <Navigate to="/dang_nhap" replace />;
  }

  if (vai_tro_duoc_phep && !vai_tro_duoc_phep.includes(nguoiDung?.vai_tro)) {
    return <Navigate to="/trang_chu" replace />;
  }

  return children;
}
