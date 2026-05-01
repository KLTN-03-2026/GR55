import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import api from '../services/api';
import { dinh_dang_gia } from '../utils/dinh_dang';
import './ChiTietDonHang.css';

const ChiTietDonHang = () => {
  const { id_dh } = useParams();
  const queryClient = useQueryClient();

  const [modalData, setModalData] = useState(null);
  const [dangKiemTra, setDangKiemTra] = useState(false);
  const [moModalHuy, setMoModalHuy] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['chi_tiet_don_hang', id_dh],
    queryFn: async () => {
      const phan_hoi = await api.get(`/lich_su_don_hang/${id_dh}`);
      return phan_hoi.data.data;
    },
    staleTime: 60 * 60 * 1000,
  });

  const { mutate: huyDonHang, isPending: dangHuy } = useMutation({
    mutationFn: () => api.put(`/lich_su_don_hang/${id_dh}/huy`),
    onSuccess: (res) => {
      if (res.data.success) {
        toast.success(res.data.message);
        setMoModalHuy(false);
        queryClient.invalidateQueries({ queryKey: ['lich_su_don_hang'] });
        queryClient.invalidateQueries({ queryKey: ['chi_tiet_don_hang', id_dh] });
      } else {
        toast.error(res.data.message);
        setMoModalHuy(false);
      }
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại');
      setMoModalHuy(false);
    },
  });

  const { mutate: taiThanhToan, isPending: dangTaiThanhToan } = useMutation({
    mutationFn: () => api.post(`/lich_su_don_hang/${id_dh}/tai_thanh_toan`),
    onSuccess: (res) => {
      if (res.data.success) {
        queryClient.invalidateQueries({ queryKey: ['lich_su_don_hang'] });
        queryClient.invalidateQueries({ queryKey: ['chi_tiet_don_hang', id_dh] });
        window.location.href = res.data.data.thanh_toan_url;
      } else {
        toast.info(res.data.message);
        setModalData(null);
        queryClient.invalidateQueries({ queryKey: ['lich_su_don_hang'] });
        queryClient.invalidateQueries({ queryKey: ['chi_tiet_don_hang', id_dh] });
      }
    },
    onError: () => toast.error('Có lỗi xảy ra, vui lòng thử lại'),
  });

  const moModal = async () => {
    setDangKiemTra(true);
    try {
      const res = await api.get(`/lich_su_don_hang/${id_dh}/kiem_tra_tai_thanh_toan`);
      if (res.data.success) {
        setModalData(res.data.data);
      } else {
        toast.error(res.data.message);
      }
    } catch {
      toast.error('Có lỗi xảy ra, vui lòng thử lại');
    } finally {
      setDangKiemTra(false);
    }
  };

  const layMauTrangThai = (trang_thai) => {
    switch (trang_thai) {
      case 'da_thanh_toan': return 'badge-xanh-la';
      case 'cho_thanh_toan': return 'badge-vang';
      case 'that_bai': return 'badge-do';
      case 'da_huy': return 'badge-xam';
      default: return 'badge-xam';
    }
  };

  const layTenTrangThai = (trang_thai) => {
    switch (trang_thai) {
      case 'da_thanh_toan': return 'Đã thanh toán';
      case 'cho_thanh_toan': return 'Chờ thanh toán';
      case 'that_bai': return 'Thất bại';
      case 'da_huy': return 'Đã hủy';
      default: return trang_thai;
    }
  };

  if (isLoading) return <div className="chi-tiet-container"><div className="skeleton-chi-tiet"></div></div>;
  if (!data) return null;

  const tatCaDaSoHuu = modalData && modalData.sach_chua_so_huu.length === 0;
  const coTheHuy = data.trang_thai === 'da_thanh_toan' &&
    new Date(data.ngay_tao) > new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);

  return (
    <div className="chi-tiet-container">
      <div className="header-chi-tiet">
        <Link to="/lich_su_don_hang" className="link-quay-lai">&larr; Quay lại lịch sử đơn hàng</Link>
        <div className="nhom-nut-header">
          {data.trang_thai === 'cho_thanh_toan' && (
            <button className="btn-tai-thanh-toan" onClick={moModal} disabled={dangKiemTra}>
              {dangKiemTra ? 'Đang kiểm tra...' : '💳 Thanh toán lại'}
            </button>
          )}
          {coTheHuy && (
            <button className="btn-huy-don" onClick={() => setMoModalHuy(true)}>
              Hủy đơn
            </button>
          )}
          <button onClick={() => toast.info('Vui lòng liên hệ admin qua email hoặc hotline.')} className="btn-ho-tro">
            Yêu cầu hỗ trợ
          </button>
        </div>
      </div>

      <div className="thong-tin-grid">
        <div className="card-thong-tin">
          <h3>Thông tin đơn hàng</h3>
          <p><strong>Mã đơn:</strong> {data.ma_don_hang}</p>
          <p><strong>Ngày tạo:</strong> {new Date(data.ngay_tao).toLocaleString('vi-VN')}</p>
          <p><strong>PTTT:</strong> {data.phuong_thuc_thanh_toan}</p>
          <p>
            <strong>Trạng thái: </strong>
            <span className={`badge ${layMauTrangThai(data.trang_thai)}`}>{layTenTrangThai(data.trang_thai)}</span>
          </p>
          <p className="tong-tien-lon"><strong>Tổng tiền:</strong> {dinh_dang_gia(data.tong_tien)}</p>
        </div>
        <div className="card-thong-tin">
          <h3>Thông tin người mua</h3>
          <p><strong>Họ tên:</strong> {data.khach_hang.ho_ten}</p>
          <p><strong>Email:</strong> {data.khach_hang.email}</p>
          <p><strong>SĐT:</strong> {data.khach_hang.so_dien_thoai}</p>
        </div>
      </div>

      <div className="danh-sach-sach">
        <h3>Sản phẩm trong đơn</h3>
        <div className="grid-sach">
          {data.danh_sach_sach.map((sach) => (
            <div key={sach.ma_sach} className="card-sach">
              <img src={sach.anh_bia_url} alt={sach.ten_sach} className="anh-bia-sach" />
              <div className="thong-tin-sach">
                <h4>{sach.ten_sach}</h4>
                <p className="tac-gia">{sach.tac_gia}</p>
                <p className="don-gia">{dinh_dang_gia(sach.don_gia)}</p>
                {data.trang_thai === 'da_thanh_toan' && (
                  <Link to={`/doc_sach/${sach.ma_sach}`} className="btn-doc-ngay">Đọc ngay</Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal xác nhận hủy đơn */}
      {moModalHuy && (
        <div className="modal-overlay-dh" onClick={(e) => e.target === e.currentTarget && setMoModalHuy(false)}>
          <div className="modal-tai-thanh-toan">
            <h3 className="modal-tieu-de">Xác nhận hủy đơn hàng</h3>
            <p style={{ fontSize: '0.95rem', color: '#475569', lineHeight: 1.6, margin: '0 0 8px' }}>
              Bạn có chắc chắn muốn hủy đơn <strong>{data.ma_don_hang}</strong> không?
            </p>
            <p style={{ fontSize: '0.875rem', color: '#64748b', margin: '0 0 20px' }}>
              Điều kiện hủy: trong vòng 3 ngày kể từ khi mua và chưa đọc quá 5 trang bất kỳ sách nào trong đơn.
            </p>
            <div className="nhom-nut-modal">
              <button className="btn-huy-modal" onClick={() => setMoModalHuy(false)} disabled={dangHuy}>
                Không
              </button>
              <button className="btn-xac-nhan-huy" onClick={() => huyDonHang()} disabled={dangHuy}>
                {dangHuy ? 'Đang xử lý...' : 'Xác nhận hủy'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal xác nhận thanh toán lại */}
      {modalData && (
        <div className="modal-overlay-dh" onClick={(e) => e.target === e.currentTarget && setModalData(null)}>
          <div className="modal-tai-thanh-toan">
            <h3 className="modal-tieu-de">Xác nhận thanh toán lại</h3>

            {modalData.sach_chua_so_huu.length > 0 && (
              <div className="nhom-sach-modal">
                <p className="nhan-nhom co-the-mua">✅ Sách có thể mua ({modalData.sach_chua_so_huu.length})</p>
                {modalData.sach_chua_so_huu.map((s) => (
                  <div key={s.ma_sach} className="item-sach-modal">
                    <img src={s.anh_bia_url} alt={s.ten_sach} />
                    <div>
                      <p className="ten-sach-modal">{s.ten_sach}</p>
                      <p className="gia-modal">{dinh_dang_gia(s.don_gia)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {modalData.sach_da_so_huu.length > 0 && (
              <div className="nhom-sach-modal da-so-huu">
                <p className="nhan-nhom">🔒 Đã sở hữu — không tính tiền ({modalData.sach_da_so_huu.length})</p>
                {modalData.sach_da_so_huu.map((s) => (
                  <div key={s.ma_sach} className="item-sach-modal mo">
                    <img src={s.anh_bia_url} alt={s.ten_sach} />
                    <div>
                      <p className="ten-sach-modal">{s.ten_sach}</p>
                      <p className="gia-modal">{dinh_dang_gia(s.don_gia)}</p>
                    </div>
                    <span className="badge-so-huu">Đã sở hữu</span>
                  </div>
                ))}
              </div>
            )}

            {tatCaDaSoHuu ? (
              <p className="thong-bao-so-huu">Bạn đã sở hữu toàn bộ sách trong đơn này. Đơn hàng sẽ được hủy.</p>
            ) : (
              <div className="tong-tien-modal">
                <span>Tổng thanh toán mới:</span>
                <strong>{dinh_dang_gia(modalData.tong_tien_moi)}</strong>
              </div>
            )}

            <div className="nhom-nut-modal">
              <button className="btn-huy-modal" onClick={() => setModalData(null)}>Đóng</button>
              <button
                className="btn-xac-nhan-modal"
                onClick={() => taiThanhToan()}
                disabled={dangTaiThanhToan}
              >
                {dangTaiThanhToan ? 'Đang xử lý...' : tatCaDaSoHuu ? 'Xác nhận hủy đơn' : `Thanh toán ${dinh_dang_gia(modalData.tong_tien_moi)}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChiTietDonHang;
