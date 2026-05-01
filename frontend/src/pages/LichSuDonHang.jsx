import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { dinh_dang_gia } from '../utils/dinh_dang';
import './LichSuDonHang.css';

const LichSuDonHang = () => {
  const { nguoiDung } = useAuth();
  const navigate = useNavigate();
  
  const [bo_loc, dat_bo_loc] = useState({
    trang_thai: '',
    tu_ngay: '',
    den_ngay: '',
    trang: 1,
  });

  const { data, isLoading } = useQuery({
    queryKey: ['lich_su_don_hang', nguoiDung?.ma_nguoi_dung, bo_loc],
    queryFn: async () => {
      const phan_hoi = await api.get('/lich_su_don_hang', { 
        params: { ...bo_loc, kich_thuoc: 10 } 
      });
      return phan_hoi.data;
    },
    staleTime: 30 * 60 * 1000,
  });

  const xuLyLoc = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    dat_bo_loc({
      ...bo_loc,
      trang_thai: formData.get('trang_thai'),
      tu_ngay: formData.get('tu_ngay'),
      den_ngay: formData.get('den_ngay'),
      trang: 1,
    });
  };

  const chuyenTrang = (trang_moi) => {
    if (trang_moi >= 1 && trang_moi <= (data?.tong_so_trang || 1)) {
      dat_bo_loc({ ...bo_loc, trang: trang_moi });
    }
  };

  const layMauTrangThai = (trang_thai) => {
    switch(trang_thai) {
      case 'da_thanh_toan': return 'badge-xanh-la';
      case 'cho_thanh_toan': return 'badge-vang';
      case 'that_bai': return 'badge-do';
      case 'da_huy': return 'badge-xam';
      default: return 'badge-xam';
    }
  };

  const layTenTrangThai = (trang_thai) => {
    switch(trang_thai) {
      case 'da_thanh_toan': return 'Đã thanh toán';
      case 'cho_thanh_toan': return 'Chờ thanh toán';
      case 'that_bai': return 'Thất bại';
      case 'da_huy': return 'Đã hủy';
      default: return trang_thai;
    }
  };

  const dinhDangNgay = (chuoiNgay) => {
    return new Date(chuoiNgay).toLocaleDateString('vi-VN');
  };

  return (
    <div className="lich-su-don-hang-container">
      <h2 className="tieu-de-trang">Lịch sử đơn hàng</h2>

      <form className="bo-loc-don-hang" onSubmit={xuLyLoc}>
        <div className="nhom-input">
          <label>Trạng thái</label>
          <select name="trang_thai" defaultValue={bo_loc.trang_thai}>
            <option value="">Tất cả</option>
            <option value="cho_thanh_toan">Chờ thanh toán</option>
            <option value="da_thanh_toan">Đã thanh toán</option>
            <option value="that_bai">Thất bại</option>
            <option value="da_huy">Đã hủy</option>
          </select>
        </div>
        <div className="nhom-input">
          <label>Từ ngày</label>
          <input type="date" name="tu_ngay" defaultValue={bo_loc.tu_ngay} />
        </div>
        <div className="nhom-input">
          <label>Đến ngày</label>
          <input type="date" name="den_ngay" defaultValue={bo_loc.den_ngay} />
        </div>
        <button type="submit" className="btn-loc">Lọc</button>
      </form>

      {isLoading ? (
        <div className="skeleton-container">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="skeleton-item"></div>
          ))}
        </div>
      ) : data?.danh_sach?.length > 0 ? (
        <>
          <div className="danh-sach-don-hang">
            {data.danh_sach.map((item) => (
              <Link to={`/lich_su_don_hang/${item.id_dh}`} key={item.id_dh} className="card-don-hang">
                <div className="thong-tin-chinh">
                  <span className="ma-don">Mã ĐH: {item.ma_don_hang}</span>
                  <span className="ngay-tao">{dinhDangNgay(item.ngay_tao)}</span>
                </div>
                <div className="thong-tin-phu">
                  <span className="tong-tien">{dinh_dang_gia(item.tong_tien)}</span>
                  <span className={`badge ${layMauTrangThai(item.trang_thai)}`}>
                    {layTenTrangThai(item.trang_thai)}
                  </span>
                  {item.trang_thai === 'cho_thanh_toan' && (
                    <button
                      className="btn-tai-tt-nho"
                      onClick={(e) => { e.preventDefault(); navigate(`/lich_su_don_hang/${item.id_dh}`); }}
                    >
                      💳 Thanh toán lại
                    </button>
                  )}
                </div>
              </Link>
            ))}
          </div>

          <div className="phan-trang">
            <button 
              onClick={() => chuyenTrang(bo_loc.trang - 1)} 
              disabled={bo_loc.trang === 1}
              className="btn-phan-trang"
            >
              Trước
            </button>
            <span className="thong-tin-trang">
              Trang {data.trang_hien_tai} / {data.tong_so_trang}
            </span>
            <button 
              onClick={() => chuyenTrang(bo_loc.trang + 1)} 
              disabled={bo_loc.trang === data.tong_so_trang}
              className="btn-phan-trang"
            >
              Sau
            </button>
          </div>
        </>
      ) : (
        <div className="trang-thai-rong">
          <p>Chưa có đơn hàng nào phù hợp với tìm kiếm của bạn.</p>
        </div>
      )}
    </div>
  );
};

export default LichSuDonHang;