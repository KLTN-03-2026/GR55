import { useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import './KetQuaThanhToan.css';

function KetQuaThanhToan() {
  const [searchParams] = useSearchParams();
  const thanh_cong = searchParams.get('thanh_cong') === 'true';
  const id_dh = searchParams.get('id_dh');
  const queryClient = useQueryClient();

  useEffect(() => {
    if (thanh_cong) {
      queryClient.invalidateQueries({ queryKey: ['chi_tiet_sach'] });
      queryClient.invalidateQueries({ queryKey: ['gio_hang'] });
      queryClient.invalidateQueries({ queryKey: ['so_luong_gio_hang'] });
      queryClient.invalidateQueries({ queryKey: ['thu_vien'] });
    }
  }, [thanh_cong, queryClient]);

  return (
    <div className="trang_ket_qua">
      <div className="kq_khung">
        {thanh_cong ? (
          <>
            <div className="kq_icon kq_icon_thanh_cong">✓</div>
            <h1 className="kq_tieu_de kq_thanh_cong">Thanh toán thành công!</h1>
            <p className="kq_mo_ta">Cảm ơn bạn đã mua sách tại BookNest.</p>
            {id_dh && (
              <p className="kq_ma_don">Mã đơn hàng: <strong>#{id_dh}</strong></p>
            )}
            <div className="kq_nut_nhom">
              <Link to="/thu_vien" className="kq_nut kq_nut_chinh">
                Vào thư viện đọc ngay
              </Link>
              <Link to="/trang_chu" className="kq_nut kq_nut_phu">
                Về trang chủ
              </Link>
            </div>
          </>
        ) : (
          <>
            <div className="kq_icon kq_icon_that_bai">✕</div>
            <h1 className="kq_tieu_de kq_that_bai">Thanh toán thất bại</h1>
            <p className="kq_mo_ta">Đã có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại.</p>
            <div className="kq_nut_nhom">
              <Link to="/gio_hang" className="kq_nut kq_nut_chinh">
                Thử lại
              </Link>
              <Link to="/trang_chu" className="kq_nut kq_nut_phu">
                Về trang chủ
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default KetQuaThanhToan;
