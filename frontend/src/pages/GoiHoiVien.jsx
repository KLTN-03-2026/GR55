import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import './GoiHoiVien.css';

const QUYEN_LOI_CO_DINH = [
    '✓ Đọc không giới hạn sách hội viên',
    '✓ Không quảng cáo',
    '✓ Hủy bất cứ lúc nào',
];

function dinh_dang_gia(gia) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(gia);
}

function dinh_dang_thoi_han(thoi_han_thang) {
    return thoi_han_thang === 1 ? '1 tháng' : thoi_han_thang + ' tháng';
}

export default function GoiHoiVien() {
    const { nguoiDung } = useAuth();
    const dieu_huong = useNavigate();
    const [dang_dang_ky, dat_dang_dang_ky] = useState(null);
    const [phuong_thuc, dat_phuong_thuc] = useState('atm');

    const { data: phan_hoi, isLoading: dang_tai, isError } = useQuery({
        queryKey: ['goi_hoi_vien'],
        queryFn: async () => {
            const res = await api.get('/hoi_vien/goi');
            return res.data;
        },
        staleTime: 60 * 60 * 1000,
    });

    const danh_sach_goi = phan_hoi?.data || [];

    async function dang_ky_goi(ma_goi) {
        if (!nguoiDung) {
            dieu_huong('/dang_nhap');
            return;
        }
        dat_dang_dang_ky(ma_goi);
        try {
            const res = await api.post('/hoi_vien/dang_ky', { ma_goi, dungQr: phuong_thuc === 'qr' });
            if (res.data.success) {
                window.location.href = res.data.data.thanh_toan_url;
            } else {
                toast.error(res.data.message);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
        } finally {
            dat_dang_dang_ky(null);
        }
    }

    return (
        <div className="trang_goi_hoi_vien">
            <div className="tieu_de_hoi_vien">
                <h1>Nâng cấp tài khoản Hội viên</h1>
                <p className="mo_ta_hoi_vien">
                    Trở thành Hội viên để đọc không giới hạn hàng trăm đầu sách độc quyền
                </p>
            </div>

            {dang_tai && (
                <div className="khung_spinner">
                    <div className="spinner_hoi_vien" />
                </div>
            )}

            {isError && !dang_tai && (
                <div className="thong_bao_loi">
                    Không thể tải danh sách gói. Vui lòng thử lại.
                </div>
            )}

            {!dang_tai && !isError && (
                <div className="luoi_goi_hoi_vien">
                    {danh_sach_goi.map((goi) => (
                        <div key={goi.ma_hv} className="card_goi_hoi_vien">
                            <div className="dau_card_goi">
                                <h2 className="ten_goi_hv">{goi.ten_goi}</h2>
                                <div className="gia_goi_hv">{dinh_dang_gia(goi.gia)}</div>
                                <div className="thoi_han_goi_hv">{dinh_dang_thoi_han(goi.thoi_han_thang)}</div>
                            </div>

                            {goi.mo_ta && (
                                <p className="mo_ta_goi_hv">{goi.mo_ta}</p>
                            )}

                            <ul className="danh_sach_quyen_loi">
                                {QUYEN_LOI_CO_DINH.map((quyen_loi, i) => (
                                    <li key={i} className="muc_quyen_loi">{quyen_loi}</li>
                                ))}
                            </ul>

                            <div className="chon_phuong_thuc_hv">
                                <label className={`pt_hv_option${phuong_thuc === 'atm' ? ' pt_hv_active' : ''}`}>
                                    <input
                                        type="radio"
                                        name="phuong_thuc_hv"
                                        value="atm"
                                        checked={phuong_thuc === 'atm'}
                                        onChange={() => dat_phuong_thuc('atm')}
                                    />
                                    <span>🏧 Thẻ ATM</span>
                                </label>
                                <label className={`pt_hv_option${phuong_thuc === 'qr' ? ' pt_hv_active' : ''}`}>
                                    <input
                                        type="radio"
                                        name="phuong_thuc_hv"
                                        value="qr"
                                        checked={phuong_thuc === 'qr'}
                                        onChange={() => dat_phuong_thuc('qr')}
                                    />
                                    <span>📱 Mã QR</span>
                                </label>
                            </div>

                            <button
                                className="nut_dang_ky_goi"
                                disabled={dang_dang_ky === goi.ma_hv}
                                onClick={() => dang_ky_goi(goi.ma_hv)}
                            >
                                {dang_dang_ky === goi.ma_hv
                                    ? 'Đang xử lý...'
                                    : !nguoiDung
                                        ? 'Đăng nhập để đăng ký'
                                        : 'Đăng ký ngay'}
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}