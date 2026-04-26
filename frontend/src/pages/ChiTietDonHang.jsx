import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { dinh_dang_gia } from '../utils/dinh_dang';
import './ChiTietDonHang.css';

const ChiTietDonHang = () => {
  const { id_dh } = useParams();

  const { data, isLoading } = useQuery({
    queryKey: ['chi_tiet_don_hang', id_dh],
    queryFn: async () => {
      const phan_hoi = await api.get(`/lich_su_don_hang/${id_dh}`);
      return phan_hoi.data.data;
    },
    staleTime: 60 * 60 * 1000,
  });

  const xuLyHoTro = () => {
    toast.info('Vui lòng liên hệ admin qua email hoặc hotline để được hỗ trợ.');
  };

  const layMauTrangThai = (trang_thai) => {
    switch(trang_thai) {
      case 'da_thanh_toan': return 'badge-xanh-la';
      case 'cho_thanh_toan': return 'badge-vang';
      case 'that_bai': return 'badge-do';
      default: return 'badge-xam';
    }
  };

  const dinhDangNgay = (chuoiNgay) => {
    return new Date(chuoiNgay).toLocaleString('vi-VN');
  };

  if (isLoading) {
    return (
      <div className="chi-tiet-container">
        <div className="skeleton-chi-tiet"></div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="chi-tiet-container">
      <div className="header-chi-tiet">
        <Link to="/lich_su_don_hang" className="link-quay-lai">
          &larr; Quay lại lịch sử đơn hàng
        </Link>
        <button onClick={xuLyHoTro} className="btn-ho-tro">
          Yêu cầu hỗ trợ
        </button>
      </div>

      <div className="thong-tin-grid">
        <div className="card-thong-tin">
          <h3>Thông tin đơn hàng</h3>
          <p><strong>Mã đơn:</strong> {data.ma_don_hang}</p>
          <p><strong>Ngày tạo:</strong> {dinhDangNgay(data.ngay_tao)}</p>
          <p><strong>PTTT:</strong> {data.phuong_thuc_thanh_toan}</p>
          <p>
            <strong>Trạng thái:</strong> 
            <span className={`badge ${layMauTrangThai(data.trang_thai)}`}>
              {data.trang_thai}
            </span>
          </p>
          <p className="tong-tien-lon">
            <strong>Tổng tiền:</strong> {dinh_dang_gia(data.tong_tien)}
          </p>
        </div>

        <div className="card-thong-tin">
          <h3>Thông tin người mua</h3>
          <p><strong>Họ tên:</strong> {data.khach_hang.ho_ten}</p>
          <p><strong>Email:</strong> {data.khach_hang.email}</p>
          <p><strong>SĐT:</strong> {data.khach_hang.so_dien_thoai}</p>
        </div>
      </div>

      <div className="danh-sach-sach">
        <h3>Sản phẩm đã mua</h3>
        <div className="grid-sach">
          {data.danh_sach_sach.map((sach) => (
            <div key={sach.ma_sach} className="card-sach">
              <img src={sach.anh_bia_url} alt={sach.ten_sach} className="anh-bia-sach" />
              <div className="thong-tin-sach">
                <h4>{sach.ten_sach}</h4>
                <p className="tac-gia">{sach.tac_gia}</p>
                <p className="don-gia">{dinh_dang_gia(sach.don_gia)}</p>
                
                {data.trang_thai === 'da_thanh_toan' && (
                  <Link to={`/doc_sach/${sach.ma_sach}`} className="btn-doc-ngay">
                    Đọc ngay
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChiTietDonHang;