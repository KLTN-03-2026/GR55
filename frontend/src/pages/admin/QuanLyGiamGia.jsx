import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import api from '../../services/api';
import './QuanLyGiamGia.css';

export default function QuanLyGiamGia() {
    const [danh_sach, dat_danh_sach] = useState([]);
    const [trang_hien_tai, dat_trang] = useState(1);
    const [tong_so_trang, dat_tong_trang] = useState(1);
    const [hien_modal_them, dat_hien_modal_them] = useState(false);
    const [sach_xem_truoc, dat_sach_xem_truoc] = useState([]);
    const [dang_tai_sach, dat_dang_tai_sach] = useState(false);

    const [gia_tri_form, dat_gia_tri_form] = useState({
        ten_chuong_trinh: '', ngay_bat_dau: '', ngay_ket_thuc: '', loai_giam: 'phan_tram', gia_tri_giam: '',
        cach_chon_sach: { loai: 'tat_ca', danh_sach_sach: [], danh_sach_danh_muc: [], so_luong: 20 }
    });

    const tai_danh_sach = useCallback(async (trang = 1) => {
        try {
            const res = await api.get('/admin/giam_gia', { params: { trang, kich_thuoc: 10 } });
            dat_danh_sach(res.data.danh_sach || []);
            dat_trang(res.data.trang_hien_tai);
            dat_tong_trang(res.data.tong_so_trang);
        } catch { toast.error('Lỗi tải danh sách'); }
    }, []);

    useEffect(() => { tai_danh_sach(1); }, [tai_danh_sach]);

    // Xử lý Preview sách tự động khi thay đổi tiêu chí
    useEffect(() => {
        const { loai, so_luong } = gia_tri_form.cach_chon_sach;
        if (loai === 'danh_sach' || !loai) return;

        async function preview() {
            dat_dang_tai_sach(true);
            try {
                const res = await api.get('/admin/giam_gia/sach', { params: { loai, so_luong } });
                dat_sach_xem_truoc(res.data || []);
            } catch { dat_sach_xem_truoc([]); }
            finally { dat_dang_tai_sach(false); }
        }
        preview();
    }, [gia_tri_form.cach_chon_sach]);

    async function them_chuong_trinh() {
        try {
            await api.post('/admin/giam_gia', gia_tri_form);
            toast.success('Thêm thành công!');
            dat_hien_modal_them(false);
            tai_danh_sach(1);
        } catch (err) { toast.error(err.response?.data?.message || 'Có lỗi xảy ra'); }
    }

    return (
        <div className="quan_ly_giam_gia">
            <div className="header_admin">
                <h2>Chương trình giảm giá</h2>
                <button className="nut_them_moi" onClick={() => dat_hien_modal_them(true)}>+ Thêm chương trình</button>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Tên chương trình</th><th>Bắt đầu</th><th>Kết thúc</th><th>Giảm</th><th>Số sách</th><th>Trạng thái</th><th>Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {danh_sach.map(ct => (
                        <tr key={ct.ma_ct}>
                            <td>{ct.ten_chuong_trinh}</td>
                            <td>{new Date(ct.ngay_bat_dau).toLocaleDateString('vi-VN')}</td>
                            <td>{new Date(ct.ngay_ket_thuc).toLocaleDateString('vi-VN')}</td>
                            <td>{ct.loai_giam === 'phan_tram' ? `${ct.gia_tri_giam}%` : new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(ct.gia_tri_giam)}</td>
                            <td>{ct.so_luong_sach}</td>
                            <td><span className={`badge ${ct.hoat_dong ? 'xanh' : 'xam'}`}>{ct.hoat_dong ? 'Đang bật' : 'Đã tắt'}</span></td>
                            <td><button className="nut_xoa" onClick={() => {/* Gọi API delete */ }}>Xóa</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Modal thêm mới đơn giản hóa */}
            {hien_modal_them && (
                <div className="modal_overlay">
                    <div className="modal_content">
                        <h3>Thêm chương trình giảm giá</h3>
                        <input type="text" placeholder="Tên chương trình" onChange={e => dat_gia_tri_form({ ...gia_tri_form, ten_chuong_trinh: e.target.value })} />
                        <div className="nhom_input">
                            <input type="datetime-local" onChange={e => dat_gia_tri_form({ ...gia_tri_form, ngay_bat_dau: e.target.value })} />
                            <input type="datetime-local" onChange={e => dat_gia_tri_form({ ...gia_tri_form, ngay_ket_thuc: e.target.value })} />
                        </div>
                        <select onChange={e => dat_gia_tri_form({ ...gia_tri_form, loai_giam: e.target.value })}>
                            <option value="phan_tram">Phần trăm (%)</option>
                            <option value="co_dinh">Cố định (VND)</option>
                        </select>
                        <input type="number" placeholder="Giá trị giảm" onChange={e => dat_gia_tri_form({ ...gia_tri_form, gia_tri_giam: e.target.value })} />

                        <label>Áp dụng cho:</label>
                        <select onChange={e => dat_gia_tri_form({ ...gia_tri_form, cach_chon_sach: { ...gia_tri_form.cach_chon_sach, loai: e.target.value } })}>
                            <option value="tat_ca">Tất cả sách</option>
                            <option value="sach_moi_nhat">Sách mới nhất</option>
                            <option value="sach_ban_chay">Sách bán chạy</option>
                            <option value="danh_sach">Nhập ID sách</option>
                        </select>

                        <div className="preview_sach">
                            {dang_tai_sach ? 'Đang tìm sách...' : `Sẽ áp dụng cho ${sach_xem_truoc.length} sách.`}
                        </div>

                        <div className="modal_actions">
                            <button onClick={() => dat_hien_modal_them(false)}>Hủy</button>
                            <button className="nut_chinh" onClick={them_chuong_trinh}>Lưu</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}