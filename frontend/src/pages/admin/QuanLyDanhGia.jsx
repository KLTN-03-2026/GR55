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
        ten_sach: '',
        ten_nguoi_dung: '',
        so_sao: '',
        tu_ngay: '',
        den_ngay: '',
    });

    const tai_danh_sach = useCallback(async (trang = 1) => {
        dat_dang_tai(true);
        try {
            const phan_hoi = await api.get('/admin/danh_gia', {
                params: { ...bo_loc, so_sao: bo_loc.so_sao || undefined, trang, kich_thuoc: KICH_THUOC_TRANG },
            });
            const d = phan_hoi.data;
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

    return (
        <div className="quan_ly_danh_gia">
            <h2>Quản lý đánh giá ({tong_ban_ghi})</h2>
            {/* Form bộ lọc */}
            <div className="thanh_cong_cu_admin">
                <input type="text" placeholder="Tên sách..." value={bo_loc.ten_sach} onChange={e => dat_bo_loc({ ...bo_loc, ten_sach: e.target.value })} />
                <input type="text" placeholder="Người dùng..." value={bo_loc.ten_nguoi_dung} onChange={e => dat_bo_loc({ ...bo_loc, ten_nguoi_dung: e.target.value })} />
                <select value={bo_loc.so_sao} onChange={e => dat_bo_loc({ ...bo_loc, so_sao: e.target.value })}>
                    <option value="">Tất cả sao</option>
                    {[5, 4, 3, 2, 1].map(s => <option key={s} value={s}>{s} sao</option>)}
                </select>
                <input type="date" value={bo_loc.tu_ngay} onChange={e => dat_bo_loc({ ...bo_loc, tu_ngay: e.target.value })} />
                <input type="date" value={bo_loc.den_ngay} onChange={e => dat_bo_loc({ ...bo_loc, den_ngay: e.target.value })} />
                <button onClick={() => tai_danh_sach(1)}>Tìm kiếm</button>
            </div>

            {dang_tai ? <p>Đang tải...</p> : (
                <table>
                    <thead>
                        <tr>
                            <th>ID</th><th>Người dùng</th><th>Sách</th><th>Sao</th><th>Nội dung</th><th>Ngày</th><th>Trạng thái</th><th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {danh_sach.map(dg => (
                            <tr key={dg.ma_dg}>
                                <td>{dg.ma_dg}</td>
                                <td>{dg.ten_nguoi_dung}</td>
                                <td>{dg.ten_sach}</td>
                                <td>{dg.so_sao} ★</td>
                                <td title={dg.noi_dung}>{dg.noi_dung?.substring(0, 50)}...</td>
                                <td>{new Date(dg.ngay_tao).toLocaleDateString('vi-VN')}</td>
                                <td><span className={`badge ${dg.hien_thi ? 'xanh' : 'xam'}`}>{dg.hien_thi ? 'Hiển thị' : 'Đã ẩn'}</span></td>
                                <td>
                                    <button onClick={() => an_hien_danh_gia(dg.ma_dg, dg.hien_thi)}>{dg.hien_thi ? 'Ẩn' : 'Hiện'}</button>
                                    <button className="nut_xoa" onClick={() => xoa_danh_gia(dg.ma_dg)}>Xóa</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            {/* Phân trang đơn giản */}
            <div className="phan_trang_admin">
                <button disabled={trang_hien_tai <= 1} onClick={() => tai_danh_sach(trang_hien_tai - 1)}>Trước</button>
                <span>Trang {trang_hien_tai} / {tong_so_trang}</span>
                <button disabled={trang_hien_tai >= tong_so_trang} onClick={() => tai_danh_sach(trang_hien_tai + 1)}>Sau</button>
            </div>
        </div>
    );
}