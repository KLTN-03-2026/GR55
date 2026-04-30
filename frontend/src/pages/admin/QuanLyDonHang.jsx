import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../services/api';
import './QuanLyDonHang.css';

export default function QuanLyDonHang() {
  const KICH_THUOC_TRANG = 10;
  
  const [danh_sach, dat_danh_sach] = useState([]);
  const [trang_hien_tai, dat_trang] = useState(1);
  const [tong_so_trang, dat_tong_trang] = useState(1);
  const [tong_ban_ghi, dat_tong_ban_ghi] = useState(0);
  const [dang_tai, dat_dang_tai] = useState(false);

  const [bo_loc, dat_bo_loc] = useState({
    trang_thai: '',
    ten_khach_hang: '',
    tu_ngay: '',
    den_ngay: '',
  });

  const navigate = useNavigate();

  const tai_danh_sach = useCallback(async (trang = 1) => {
    dat_dang_tai(true);
    try {
      const phan_hoi = await api.get('/admin/don_hang', {
        params: { ...bo_loc, trang, kich_thuoc: KICH_THUOC_TRANG },
      });
      const d = phan_hoi.data;
      dat_danh_sach(d.danh_sach || []);
      dat_trang(d.trang_hien_tai);
      dat_tong_trang(d.tong_so_trang);
      dat_tong_ban_ghi(d.tong_so_ban_ghi);
    } catch {
      toast.error('Không thể tải danh sách đơn hàng');
    } finally {
      dat_dang_tai(false);
    }
  }, [bo_loc]);

  useEffect(() => {
    tai_danh_sach(1);
  }, [tai_danh_sach]);

  const xuLyThayDoiBoLoc = (e) => {
    const { name, value } = e.target;
    dat_bo_loc(prev => ({ ...prev, [name]: value }));
  };

  const xuLyTimKiem = (e) => {
    e.preventDefault();
    tai_danh_sach(1);
  };

  const xuLyDatLai = () => {
    dat_bo_loc({ trang_thai: '', ten_khach_hang: '', tu_ngay: '', den_ngay: '' });
  };

  const formatTien = (tien) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(tien);
  const formatNgay = (ngay) => new Date(ngay).toLocaleDateString('vi-VN');

  const renderBadge = (trang_thai) => {
    switch (trang_thai) {
      case 'cho_thanh_toan': return <span className="badge badge-warning">Chờ thanh toán</span>;
      case 'da_thanh_toan': return <span className="badge badge-success">Đã thanh toán</span>;
      case 'that_bai': return <span className="badge badge-danger">Thất bại</span>;
      case 'da_huy': return <span className="badge badge-secondary">Đã hủy</span>;
      default: return <span className="badge">{trang_thai}</span>;
    }
  };

  return (
    <div className="quan-ly-don-hang">
      <h2>Quản lý đơn hàng</h2>

      <form className="bo-loc-form" onSubmit={xuLyTimKiem}>
        <select name="trang_thai" value={bo_loc.trang_thai} onChange={xuLyThayDoiBoLoc}>
          <option value="">Tất cả trạng thái</option>
          <option value="cho_thanh_toan">Chờ thanh toán</option>
          <option value="da_thanh_toan">Đã thanh toán</option>
          <option value="that_bai">Thất bại</option>
          <option value="da_huy">Đã hủy</option>
        </select>
        <input 
          type="text" 
          name="ten_khach_hang" 
          placeholder="Tên khách hàng..." 
          value={bo_loc.ten_khach_hang} 
          onChange={xuLyThayDoiBoLoc} 
        />
        <input type="date" name="tu_ngay" value={bo_loc.tu_ngay} onChange={xuLyThayDoiBoLoc} />
        <input type="date" name="den_ngay" value={bo_loc.den_ngay} onChange={xuLyThayDoiBoLoc} />
        <button type="submit" className="btn btn-primary">Tìm kiếm</button>
        <button type="button" className="btn btn-outline" onClick={xuLyDatLai}>Đặt lại</button>
      </form>

      {dang_tai ? (
        <div className="spinner">Đang tải...</div>
      ) : danh_sach.length === 0 ? (
        <div className="empty-state">Không có đơn hàng nào</div>
      ) : (
        <>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Mã ĐH</th>
                <th>Khách hàng</th>
                <th>Email</th>
                <th>Ngày mua</th>
                <th>Tổng tiền</th>
                <th>Trạng thái</th>
                <th>PTTT</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {danh_sach.map(item => (
                <tr key={item.id_dh}>
                  <td>{item.ma_don_hang}</td>
                  <td>{item.ten_khach_hang}</td>
                  <td>{item.email}</td>
                  <td>{formatNgay(item.ngay_mua)}</td>
                  <td className="text-highlight">{formatTien(item.tong_tien)}</td>
                  <td>{renderBadge(item.trang_thai)}</td>
                  <td>{item.phuong_thuc_thanh_toan}</td>
                  <td>
                    <button 
                      className="btn btn-sm btn-info" 
                      onClick={() => navigate(`/quan_tri/don_hang/${item.id_dh}`)}
                    >
                      Xem chi tiết
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="phan-trang">
            <span className="tong-ban-ghi">Tổng: <strong>{tong_ban_ghi}</strong> bản ghi</span>
            <div className="pagination-controls">
              <button 
                className="btn btn-sm"
                disabled={trang_hien_tai <= 1} 
                onClick={() => tai_danh_sach(trang_hien_tai - 1)}
              >
                Trước
              </button>
              <span className="trang-hien-tai">Trang {trang_hien_tai} / {tong_so_trang}</span>
              <button 
                className="btn btn-sm"
                disabled={trang_hien_tai >= tong_so_trang} 
                onClick={() => tai_danh_sach(trang_hien_tai + 1)}
              >
                Sau
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}