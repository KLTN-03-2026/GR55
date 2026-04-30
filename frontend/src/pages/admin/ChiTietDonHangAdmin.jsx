import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../services/api';
import './ChiTietDonHangAdmin.css';

export default function ChiTietDonHangAdmin() {
  const { id_dh } = useParams();
  const dieu_huong = useNavigate();

  const [don_hang, dat_don_hang] = useState(null);
  const [dang_tai, dat_dang_tai] = useState(true);
  const [trang_thai_moi, dat_trang_thai_moi] = useState('');
  const [dang_cap_nhat, dat_dang_cap_nhat] = useState(false);

  useEffect(() => {
    async function tai_chi_tiet() {
      try {
        const phan_hoi = await api.get(`/admin/don_hang/${id_dh}`);
        dat_don_hang(phan_hoi.data.data);
        dat_trang_thai_moi(phan_hoi.data.data.trang_thai);
      } catch {
        toast.error('Không thể tải chi tiết đơn hàng');
      } finally {
        dat_dang_tai(false);
      }
    }
    tai_chi_tiet();
  }, [id_dh]);

  async function cap_nhat_trang_thai() {
    dat_dang_cap_nhat(true);
    try {
      await api.put(`/admin/don_hang/${id_dh}/trang_thai`, { trang_thai: trang_thai_moi });
      toast.success('Cập nhật trạng thái thành công');
      dat_don_hang(prev => ({ ...prev, trang_thai: trang_thai_moi }));
    } catch {
      toast.error('Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      dat_dang_cap_nhat(false);
    }
  }

  const formatTien = (tien) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(tien);

  const renderBadge = (trang_thai) => {
    switch (trang_thai) {
      case 'cho_thanh_toan': return <span className="badge badge-warning">Chờ thanh toán</span>;
      case 'da_thanh_toan': return <span className="badge badge-success">Đã thanh toán</span>;
      case 'that_bai': return <span className="badge badge-danger">Thất bại</span>;
      case 'da_huy': return <span className="badge badge-secondary">Đã hủy</span>;
      default: return <span className="badge">{trang_thai}</span>;
    }
  };

  if (dang_tai) return <div className="spinner">Đang tải chi tiết...</div>;
  if (!don_hang) return <div className="error-state">Không tìm thấy thông tin đơn hàng</div>;

  return (
    <div className="chi-tiet-don-hang">
      <button className="btn-back" onClick={() => dieu_huong('/quan_tri/don_hang')}>
        &larr; Quay lại danh sách
      </button>

      <div className="grid-info">
        <div className="card-info">
          <h3>Thông tin đơn hàng</h3>
          <p><strong>Mã ĐH:</strong> {don_hang.ma_don_hang}</p>
          <p><strong>Ngày tạo:</strong> {don_hang.ngay_tao}</p>
          <p><strong>Tổng tiền:</strong> <span className="text-highlight">{formatTien(don_hang.tong_tien)}</span></p>
          <p><strong>Phương thức TT:</strong> {don_hang.phuong_thuc_thanh_toan}</p>
          <p><strong>Trạng thái hiện tại:</strong> {renderBadge(don_hang.trang_thai)}</p>
        </div>

        <div className="card-info">
          <h3>Thông tin khách hàng</h3>
          <p><strong>Họ tên:</strong> {don_hang.khach_hang?.ho_ten}</p>
          <p><strong>Email:</strong> {don_hang.khach_hang?.email}</p>
          <p><strong>Số điện thoại:</strong> {don_hang.khach_hang?.so_dien_thoai}</p>
        </div>
      </div>

      <div className="card-update-status">
        <h3>Cập nhật trạng thái</h3>
        <div className="flex-update">
          <select 
            value={trang_thai_moi} 
            onChange={(e) => dat_trang_thai_moi(e.target.value)}
            disabled={dang_cap_nhat}
            className="select-status"
          >
            <option value="cho_thanh_toan">Chờ thanh toán</option>
            <option value="da_thanh_toan">Đã thanh toán</option>
            <option value="that_bai">Thất bại</option>
            <option value="da_huy">Đã hủy</option>
          </select>
          <button 
            className="btn btn-primary" 
            onClick={cap_nhat_trang_thai}
            disabled={dang_cap_nhat || trang_thai_moi === don_hang.trang_thai}
          >
            {dang_cap_nhat ? 'Đang cập nhật...' : 'Cập nhật'}
          </button>
        </div>
      </div>

      <div className="card-books">
        <h3>Danh sách sản phẩm</h3>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Ảnh bìa</th>
              <th>Mã sách</th>
              <th>Tên sách</th>
              <th>Tác giả</th>
              <th>Đơn giá</th>
            </tr>
          </thead>
          <tbody>
            {don_hang.danh_sach_sach?.map((sach, index) => (
              <tr key={index}>
                <td>
                  <img src={sach.anh_bia_url} alt={sach.ten_sach} className="book-thumbnail" />
                </td>
                <td>{sach.ma_sach}</td>
                <td>{sach.ten_sach}</td>
                <td>{sach.tac_gia}</td>
                <td className="text-highlight">{formatTien(sach.don_gia)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}