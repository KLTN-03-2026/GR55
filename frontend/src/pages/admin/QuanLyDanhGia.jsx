import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import api from '../../services/api';
import './QuanLyDanhGia.css';

const KICH_THUOC_TRANG = 10;

export default function QuanLyDanhGia() {
    const [danh_sach, dat_danh_sach] = useState([]);
    const [trang_hien_tai, dat_trang] = useState(1);
    const [tong_so_trang, dat_tong_trang] = useState(1);
    const [tong_ban_ghi, dat_tong_ban_ghi] = useState(0);
    const [dang_tai, dat_dang_tai] = useState(false);

    const [bo_loc, dat_bo_loc] = useState({
        ten_sach: '', ten_nguoi_dung: '', so_sao: '', tu_ngay: '', den_ngay: '',
    });

    const tai_danh_sach = useCallback(async (trang = 1) => {
        dat_dang_tai(true);
        try {
            const res = await api.get('/admin/danh_gia', {
                params: { ...bo_loc, so_sao: bo_loc.so_sao || undefined, trang, kich_thuoc: KICH_THUOC_TRANG },
            });
            const d = res.data;
            dat_danh_sach(d.danh_sach || []);
            dat_trang(d.trang_hien_tai);
            dat_tong_trang(d.tong_so_trang);
            dat_tong_ban_ghi(d.tong_so_ban_ghi);
        } catch {
            toast.error('Không thể tải danh sách đánh giá');
        } finally {
            dat_dang_tai(false);
        }
    }, [bo_loc]);

    useEffect(() => { tai_danh_sach(1); }, [tai_danh_sach]);

    async function an_hien_danh_gia(ma_dg, hien_thi_hien_tai) {
        try {
            await api.put(`/admin/danh_gia/${ma_dg}/trang_thai`, { hien_thi: !hien_thi_hien_tai });
            toast.success(!hien_thi_hien_tai ? 'Đã hiện đánh giá' : 'Đã ẩn đánh giá');
            tai_danh_sach(trang_hien_tai);
        } catch {
            toast.error('Có lỗi xảy ra. Vui lòng thử lại.');
        }
    }

    async function xoa_danh_gia(ma_dg) {
        if (!window.confirm('Bạn có chắc muốn xóa đánh giá này không?')) return;
        try {
            await api.delete(`/admin/danh_gia/${ma_dg}`);
            toast.success('Đã xóa đánh giá');
            tai_danh_sach(trang_hien_tai);
        } catch {
            toast.error('Có lỗi xảy ra. Vui lòng thử lại.');
        }
    }

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
                <h1 className="tieu_de_trang">Quản lý đánh giá</h1>

                <div className="the_noi_dung">
                    {/* Bộ lọc */}
                    <div className="thanh_cong_cu thanh_loc_nhieu">
                        <input type="text" className="o_tim_kiem" placeholder="Tìm theo tên sách..."
                            value={bo_loc.ten_sach}
                            onChange={e => dat_bo_loc(p => ({ ...p, ten_sach: e.target.value }))} />
                        <input type="text" className="o_loc_phu" placeholder="Người dùng..."
                            value={bo_loc.ten_nguoi_dung}
                            onChange={e => dat_bo_loc(p => ({ ...p, ten_nguoi_dung: e.target.value }))} />
                        <select className="o_loc_phu" value={bo_loc.so_sao}
                            onChange={e => dat_bo_loc(p => ({ ...p, so_sao: e.target.value }))}>
                            <option value="">Tất cả sao</option>
                            {[5, 4, 3, 2, 1].map(s => <option key={s} value={s}>{s} ★</option>)}
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
                                    <th style={{ width: '55px' }}>ID</th>
                                    <th style={{ width: '130px' }}>Người dùng</th>
                                    <th>Sách</th>
                                    <th style={{ width: '70px' }}>Sao</th>
                                    <th>Nội dung</th>
                                    <th style={{ width: '110px' }}>Ngày</th>
                                    <th style={{ width: '100px' }}>Trạng thái</th>
                                    <th style={{ width: '120px' }}>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dang_tai ? (
                                    <tr><td colSpan={8} className="hang_trong">Đang tải...</td></tr>
                                ) : danh_sach.length === 0 ? (
                                    <tr><td colSpan={8} className="hang_trong">Không tìm thấy đánh giá phù hợp</td></tr>
                                ) : danh_sach.map(dg => (
                                    <tr key={dg.ma_dg}>
                                        <td>{dg.ma_dg}</td>
                                        <td>{dg.ten_nguoi_dung}</td>
                                        <td>{dg.ten_sach}</td>
                                        <td><span className="nhan_sao">{dg.so_sao} ★</span></td>
                                        <td title={dg.noi_dung} style={{ maxWidth: 200 }}>
                                            {dg.noi_dung?.substring(0, 60)}{dg.noi_dung?.length > 60 ? '...' : ''}
                                        </td>
                                        <td>{new Date(dg.ngay_tao).toLocaleDateString('vi-VN')}</td>
                                        <td>
                                            <span className={`nhan_hien_thi ${dg.hien_thi ? 'hien' : 'an'}`}>
                                                {dg.hien_thi ? 'Hiển thị' : 'Đã ẩn'}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="nhom_nut_thao_tac">
                                                <button
                                                    className={`nut_an_hien ${dg.hien_thi ? 'nut_an' : 'nut_hien'}`}
                                                    onClick={() => an_hien_danh_gia(dg.ma_dg, dg.hien_thi)}>
                                                    {dg.hien_thi ? 'Ẩn' : 'Hiện'}
                                                </button>
                                                <button className="nut_xoa" onClick={() => xoa_danh_gia(dg.ma_dg)}>Xóa</button>
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
                                Hiển thị {chi_so_bat_dau}–{Math.min(chi_so_bat_dau + KICH_THUOC_TRANG - 1, tong_ban_ghi)} / {tong_ban_ghi} đánh giá
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
