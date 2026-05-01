import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../services/api';
import './QuanLyDonHang.css';

const KICH_THUOC_TRANG = 10;

const TEN_TRANG_THAI = {
    cho_thanh_toan: 'Chờ thanh toán',
    da_thanh_toan: 'Đã thanh toán',
    that_bai: 'Thất bại',
    da_huy: 'Đã hủy',
};

function dinh_dang_tien(tien) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(tien);
}

function dinh_dang_ngay(ngay) {
    if (!ngay) return '—';
    return new Date(ngay).toLocaleDateString('vi-VN');
}

export default function QuanLyDonHang() {
    const [danh_sach, dat_danh_sach] = useState([]);
    const [trang_hien_tai, dat_trang] = useState(1);
    const [tong_so_trang, dat_tong_trang] = useState(1);
    const [tong_ban_ghi, dat_tong_ban_ghi] = useState(0);
    const [dang_tai, dat_dang_tai] = useState(false);
    const [bo_loc, dat_bo_loc] = useState({
        trang_thai: '', ten_khach_hang: '', tu_ngay: '', den_ngay: '',
    });

    const navigate = useNavigate();

    const tai_danh_sach = useCallback(async (trang = 1) => {
        dat_dang_tai(true);
        try {
            const res = await api.get('/admin/don_hang', {
                params: { ...bo_loc, trang, kich_thuoc: KICH_THUOC_TRANG },
            });
            const d = res.data;
            dat_danh_sach(d.danh_sach || []);
            dat_trang(d.trang_hien_tai);
            dat_tong_trang(d.tong_so_trang);
            dat_tong_ban_ghi(d.tong_so_ban_ghi || 0);
        } catch {
            toast.error('Không thể tải danh sách đơn hàng');
        } finally {
            dat_dang_tai(false);
        }
    }, [bo_loc]);

    useEffect(() => { tai_danh_sach(1); }, [tai_danh_sach]);

    function tao_mang_so_trang() {
        if (tong_so_trang <= 7) return Array.from({ length: tong_so_trang }, (_, i) => i + 1);
        const cac_trang = new Set([1, tong_so_trang, trang_hien_tai]);
        [-2, -1, 1, 2].forEach(d => {
            const t = trang_hien_tai + d;
            if (t >= 1 && t <= tong_so_trang) cac_trang.add(t);
        });
        return [...cac_trang].sort((a, b) => a - b);
    }

    const cac_so_trang = tao_mang_so_trang();
    const chi_so_bat_dau = (trang_hien_tai - 1) * KICH_THUOC_TRANG + 1;

    return (
        <div className="trang_quan_ly">
            <div className="noi_dung_chinh">
                <h1 className="tieu_de_trang">Quản lý đơn hàng</h1>

                <div className="the_noi_dung">
                    {/* Bộ lọc */}
                    <div className="thanh_cong_cu thanh_loc_nhieu">
                        <input type="text" className="o_tim_kiem" placeholder="Tên khách hàng..."
                            value={bo_loc.ten_khach_hang}
                            onChange={e => dat_bo_loc(p => ({ ...p, ten_khach_hang: e.target.value }))} />
                        <select className="o_loc_phu" value={bo_loc.trang_thai}
                            onChange={e => dat_bo_loc(p => ({ ...p, trang_thai: e.target.value }))}>
                            <option value="">Tất cả trạng thái</option>
                            <option value="cho_thanh_toan">Chờ thanh toán</option>
                            <option value="da_thanh_toan">Đã thanh toán</option>
                            <option value="that_bai">Thất bại</option>
                            <option value="da_huy">Đã hủy</option>
                        </select>
                        <input type="date" className="o_loc_phu" value={bo_loc.tu_ngay}
                            onChange={e => dat_bo_loc(p => ({ ...p, tu_ngay: e.target.value }))} />
                        <input type="date" className="o_loc_phu" value={bo_loc.den_ngay}
                            onChange={e => dat_bo_loc(p => ({ ...p, den_ngay: e.target.value }))} />
                    </div>

                    {/* Bảng */}
                    <div className="khung_bang">
                        <table className="bang_du_lieu">
                            <thead>
                                <tr>
                                    <th style={{ width: '130px' }}>Mã đơn hàng</th>
                                    <th>Khách hàng</th>
                                    <th style={{ width: '200px' }}>Email</th>
                                    <th style={{ width: '110px' }}>Ngày mua</th>
                                    <th style={{ width: '130px' }}>Tổng tiền</th>
                                    <th style={{ width: '150px' }}>Trạng thái</th>
                                    <th style={{ width: '90px' }}>PTTT</th>
                                    <th style={{ width: '110px' }}>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dang_tai ? (
                                    <tr><td colSpan={8} className="hang_trong">Đang tải...</td></tr>
                                ) : danh_sach.length === 0 ? (
                                    <tr><td colSpan={8} className="hang_trong">Không có đơn hàng nào</td></tr>
                                ) : danh_sach.map(item => (
                                    <tr key={item.id_dh}>
                                        <td style={{ fontWeight: 500 }}>{item.ma_don_hang}</td>
                                        <td>{item.ten_khach_hang}</td>
                                        <td>{item.email}</td>
                                        <td>{dinh_dang_ngay(item.ngay_mua)}</td>
                                        <td className="tong_tien_dh">{dinh_dang_tien(item.tong_tien)}</td>
                                        <td>
                                            <span className={`nhan_don_hang ${item.trang_thai}`}>
                                                {TEN_TRANG_THAI[item.trang_thai] || item.trang_thai}
                                            </span>
                                        </td>
                                        <td>{item.phuong_thuc_thanh_toan}</td>
                                        <td>
                                            <div className="nhom_nut_thao_tac">
                                                <button className="nut_xem_dh"
                                                    onClick={() => navigate(`/quan_tri/don_hang/${item.id_dh}`)}>
                                                    Chi tiết
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Phân trang */}
                    {tong_ban_ghi > 0 && (
                        <div className="phan_trang">
                            <span className="thong_tin_phan_trang">
                                Hiển thị {chi_so_bat_dau}–{Math.min(chi_so_bat_dau + KICH_THUOC_TRANG - 1, tong_ban_ghi)} / {tong_ban_ghi} đơn hàng
                            </span>
                            <div className="nhom_nut_trang">
                                <button className="nut_trang" onClick={() => tai_danh_sach(trang_hien_tai - 1)} disabled={trang_hien_tai <= 1}>‹</button>
                                {cac_so_trang.map((so, idx) => {
                                    const trang_truoc = cac_so_trang[idx - 1];
                                    return (
                                        <span key={so}>
                                            {trang_truoc && so - trang_truoc > 1 && <span style={{ padding: '0 4px', color: '#9ca3af' }}>…</span>}
                                            <button className={`nut_trang${so === trang_hien_tai ? ' hien_tai' : ''}`} onClick={() => tai_danh_sach(so)}>{so}</button>
                                        </span>
                                    );
                                })}
                                <button className="nut_trang" onClick={() => tai_danh_sach(trang_hien_tai + 1)} disabled={trang_hien_tai >= tong_so_trang}>›</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
