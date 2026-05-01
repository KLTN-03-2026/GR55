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
  const [mo_modal_huy, dat_mo_modal_huy] = useState(false);
  const [dang_huy, dat_dang_huy] = useState(false);
  useEffect(() => {
    async function tai_chi_tiet() {
      try {
        const phan_hoi = await api.get(`/admin/don_hang/${id_dh}`);
        dat_don_hang(phan_hoi.data.data);
      } catch {
        toast.error('Không thể tải chi tiết đơn hàng');
      } finally {
        dat_dang_tai(false);
      }
    }
    tai_chi_tiet();
  }, [id_dh]);

  const formatTien = (tien) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(tien);

  const huy_don_hang = async () => {
    dat_dang_huy(true);
    try {
      await api.put(`/admin/don_hang/${id_dh}/trang_thai`, { trang_thai: 'da_huy' });
      toast.success('Hủy đơn hàng thành công');
      dat_don_hang(prev => ({ ...prev, trang_thai: 'da_huy' }));
      dat_mo_modal_huy(false);
    } catch {
      toast.error('Có lỗi xảy ra, vui lòng thử lại');
    } finally {
      dat_dang_huy(false);
    }
  };

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
      <div className="header-chi-tiet-admin">
        <button className="btn-back" onClick={() => dieu_huong('/quan_tri/don_hang')}>
          &larr; Quay lại danh sách
        </button>
        {don_hang.trang_thai === 'da_thanh_toan' && (
          <button className="btn-huy-admin" onClick={() => dat_mo_modal_huy(true)}>
            Hủy đơn hàng
          </button>
        )}
      </div>

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
      {mo_modal_huy && (
        <div className="modal-overlay-admin" onClick={(e) => e.target === e.currentTarget && dat_mo_modal_huy(false)}>
          <div className="modal-box-admin">
            <h3 className="modal-tieu-de-admin">Xác nhận hủy đơn hàng</h3>
            <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.6, margin: '0 0 6px' }}>
              Bạn có chắc chắn muốn hủy đơn <strong>{don_hang.ma_don_hang}</strong> không?
            </p>
            <p style={{ fontSize: 13, color: '#94a3b8', margin: '0 0 20px' }}>
              Hành động này không thể hoàn tác. Đơn hàng sẽ chuyển sang trạng thái <strong>Đã hủy</strong>.
            </p>
            <div className="modal-nut-admin">
              <button className="btn-modal-dong" onClick={() => dat_mo_modal_huy(false)} disabled={dang_huy}>
                Không
              </button>
              <button className="btn-modal-xac-nhan-huy" onClick={huy_don_hang} disabled={dang_huy}>
                {dang_huy ? 'Đang xử lý...' : 'Xác nhận hủy'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}