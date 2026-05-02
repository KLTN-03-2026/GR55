import { useSearchParams, Link } from 'react-router-dom';
import './KetQuaHoiVien.css';

export default function KetQuaHoiVien() {
    const [searchParams] = useSearchParams();
    const thanh_cong = searchParams.get('thanh_cong') === 'true';

    return (
        <div className="trang_ket_qua">
            {thanh_cong ? (
                <>
                    <div className="icon_ket_qua thanh_cong">✓</div>
                    <h1 className="tieu_de_ket_qua">Nâng cấp thành công!</h1>
                    <p className="mo_ta_ket_qua">
                        Tài khoản của bạn đã được nâng cấp lên Hội viên. Bắt đầu đọc sách ngay!
                    </p>
                    <Link to="/sach_hoi_vien" className="nut_chinh_ket_qua">
                        Khám phá sách hội viên
                    </Link>
                    <Link to="/trang_chu" className="nut_phu_ket_qua">
                        Về trang chủ
                    </Link>
                </>
            ) : (
                <>
                    <div className="icon_ket_qua that_bai">✗</div>
                    <h1 className="tieu_de_ket_qua">Thanh toán không thành công</h1>
                    <p className="mo_ta_ket_qua">
                        Giao dịch chưa hoàn tất. Bạn có thể thử lại hoặc chọn gói khác.
                    </p>
                    <Link to="/hoi_vien" className="nut_chinh_ket_qua">
                        Thử lại
                    </Link>
                    <Link to="/trang_chu" className="nut_phu_ket_qua">
                        Về trang chủ
                    </Link>
                </>
            )}
        </div>
    );
}