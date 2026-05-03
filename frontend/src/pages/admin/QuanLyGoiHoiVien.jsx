import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import api from '../../services/api';
import './QuanLyGoiHoiVien.css';

const QuanLyGoiHoiVien = () => {
    // === STATE ===
    // Danh sách
    const [danh_sach, dat_danh_sach] = useState([]);
    const [dang_tai, dat_dang_tai] = useState(false);
    const [tim_kiem, dat_tim_kiem] = useState('');
    const [trang, dat_trang] = useState(1);
    const [tong_so_trang, dat_tong_so_trang] = useState(1);

    // Modal thêm / sửa (2 bước)
    const [hien_modal, dat_hien_modal] = useState(false);
    const [buoc, dat_buoc] = useState(1);
    const [goi_dang_sua, dat_goi_dang_sua] = useState(null);
    const [form, dat_form] = useState({
        ten_goi: '', gia: '', thoi_han_thang: '', mo_ta: '', hoat_dong: true
    });
    const [sach_da_chon, dat_sach_da_chon] = useState([]);

    // Bước 2 — tìm sách
    const [ds_sach_tim, dat_ds_sach_tim] = useState([]);
    const [tu_khoa_sach, dat_tu_khoa_sach] = useState('');
    const [trang_sach, dat_trang_sach] = useState(1);
    const [tong_trang_sach, dat_tong_trang_sach] = useState(1);
    const [dang_tai_sach, dat_dang_tai_sach] = useState(false);

    // Toggle trạng thái
    const [dang_toggle, dat_dang_toggle] = useState(new Set());

    // Modal chi tiết
    const [chi_tiet, dat_chi_tiet] = useState(null);
    const [hien_chi_tiet, dat_hien_chi_tiet] = useState(false);

    // Modal xác nhận xóa
    const [hien_xoa, dat_hien_xoa] = useState(false);
    const [ma_xoa, dat_ma_xoa] = useState(null);
    const [dang_xoa, dat_dang_xoa] = useState(false);

    // === HÀM XỬ LÝ ===
    const tai_danh_sach = useCallback(async (trang_hien_tai, tu_khoa) => {
        dat_dang_tai(true);
        try {
            const res = await api.get('/admin/goi_hoi_vien', {
                params: { ten: tu_khoa || undefined, trang: trang_hien_tai, kich_thuoc: 10 }
            });
            if (res.data.thanh_cong) {
                dat_danh_sach(res.data.danh_sach);
                dat_tong_so_trang(res.data.tong_so_trang);
            }
        } catch {
            toast.error('Không thể tải danh sách gói hội viên');
        } finally {
            dat_dang_tai(false);
        }
    }, []);

    useEffect(() => {
        tai_danh_sach(trang, tim_kiem);
    }, [trang, tim_kiem, tai_danh_sach]);

    async function toggle_trang_thai(ma_hv, hoat_dong_hien_tai) {
        const moi = !hoat_dong_hien_tai;
        dat_dang_toggle(prev => new Set([...prev, ma_hv]));
        try {
            const res = await api.put(`/admin/goi_hoi_vien/${ma_hv}/trang_thai`, null, {
                params: { hoat_dong: moi }
            });
            if (res.data.thanh_cong) {
                dat_danh_sach(prev =>
                    prev.map(g => g.ma_hv === ma_hv ? { ...g, hoat_dong: moi } : g)
                );
                toast.success(res.data.thong_bao);
            } else {
                toast.error(res.data.thong_bao);
            }
        } catch {
            toast.error('Không thể cập nhật trạng thái');
        } finally {
            dat_dang_toggle(prev => {
                const s = new Set(prev);
                s.delete(ma_hv);
                return s;
            });
        }
    }

    function mo_them() {
        dat_goi_dang_sua(null);
        dat_form({ ten_goi: '', gia: '', thoi_han_thang: '', mo_ta: '', hoat_dong: true });
        dat_sach_da_chon([]);
        dat_buoc(1);
        dat_hien_modal(true);
    }

    async function mo_sua(ma_hv) {
        try {
            const res = await api.get(`/admin/goi_hoi_vien/${ma_hv}`);
            if (res.data.thanh_cong) {
                const d = res.data.du_lieu;
                dat_goi_dang_sua(d);
                dat_form({
                    ten_goi: d.ten_goi,
                    gia: d.gia,
                    thoi_han_thang: d.thoi_han_thang,
                    mo_ta: d.mo_ta || '',
                    hoat_dong: d.hoat_dong
                });
                dat_sach_da_chon([]);
                dat_buoc(1);
                dat_hien_modal(true);
            }
        } catch {
            toast.error('Không thể lấy chi tiết gói');
        }
    }

    const tai_sach_tim = useCallback(async (trang_hien_tai, tu_khoa, ma_hv_filter) => {
        dat_dang_tai_sach(true);
        try {
            const res = await api.get('/admin/goi_hoi_vien/sach', {
                params: {
                    tu_khoa: tu_khoa || undefined,
                    ma_hv: ma_hv_filter || undefined,
                    trang: trang_hien_tai,
                    kich_thuoc: 20
                }
            });
            if (res.data.success) {
                dat_ds_sach_tim(res.data.danh_sach);
                dat_tong_trang_sach(res.data.tong_so_trang);
                
                if (trang_hien_tai === 1 && ma_hv_filter) {
                    const pre = res.data.danh_sach
                        .filter(s => s.trong_chuong_trinh)
                        .map(s => ({
                            ma_sach: s.ma_sach, ten_sach: s.ten_sach,
                            tac_gia: s.tac_gia, anh_bia_url: s.anh_bia_url, gia: s.gia
                        }));
                    dat_sach_da_chon(pre);
                }
            }
        } catch {
            toast.error('Không thể tải danh sách sách');
        } finally {
            dat_dang_tai_sach(false);
        }
    }, []);

    useEffect(() => {
        if (buoc === 2) tai_sach_tim(trang_sach, tu_khoa_sach, goi_dang_sua?.ma_hv);
    }, [trang_sach, tu_khoa_sach, buoc, goi_dang_sua, tai_sach_tim]);

    function chuyen_buoc_2() {
        if (!form.ten_goi.trim() || !form.gia || !form.thoi_han_thang) {
            toast.error('Vui lòng nhập đầy đủ thông tin bắt buộc (Tên, Giá, Thời hạn)');
            return;
        }
        dat_tu_khoa_sach('');
        dat_trang_sach(1);
        dat_buoc(2);
        tai_sach_tim(1, '', goi_dang_sua?.ma_hv);
    }

    function toggle_chon_sach(sach_item) {
        dat_sach_da_chon(prev => {
            const da_co = prev.some(s => s.ma_sach === sach_item.ma_sach);
            if (da_co) return prev.filter(s => s.ma_sach !== sach_item.ma_sach);
            return [...prev, {
                ma_sach: sach_item.ma_sach, ten_sach: sach_item.ten_sach,
                tac_gia: sach_item.tac_gia, anh_bia_url: sach_item.anh_bia_url, gia: sach_item.gia
            }];
        });
    }

    const la_da_chon = (ma_sach) => sach_da_chon.some(s => s.ma_sach === ma_sach);

    async function luu_goi() {
        const payload = {
            ten_goi: form.ten_goi.trim(),
            gia: Number(form.gia),
            thoi_han_thang: Number(form.thoi_han_thang),
            mo_ta: form.mo_ta.trim() || null,
            hoat_dong: form.hoat_dong,
            danh_sach_sach: sach_da_chon.map(s => s.ma_sach)
        };
        try {
            let res;
            if (goi_dang_sua) {
                res = await api.put(`/admin/goi_hoi_vien/${goi_dang_sua.ma_hv}`, payload);
            } else {
                res = await api.post('/admin/goi_hoi_vien', payload);
            }
            if (res.data.thanh_cong) {
                toast.success(res.data.thong_bao);
                dat_hien_modal(false);
                tai_danh_sach(trang, tim_kiem);
            } else {
                toast.error(res.data.thong_bao);
            }
        } catch {
            toast.error('Có lỗi xảy ra. Vui lòng thử lại.');
        }
    }

    async function xem_chi_tiet(ma_hv) {
        try {
            const res = await api.get(`/admin/goi_hoi_vien/${ma_hv}`);
            if (res.data.thanh_cong) {
                dat_chi_tiet(res.data.du_lieu);
                dat_hien_chi_tiet(true);
            }
        } catch {
            toast.error('Không thể tải chi tiết gói');
        }
    }

    async function xac_nhan_xoa() {
        dat_dang_xoa(true);
        try {
            const res = await api.delete(`/admin/goi_hoi_vien/${ma_xoa}`);
            if (res.data.thanh_cong) {
                toast.success(res.data.thong_bao);
                dat_hien_xoa(false);
                tai_danh_sach(trang, tim_kiem);
            } else {
                toast.error(res.data.thong_bao);
            }
        } catch {
            toast.error('Có lỗi xảy ra khi xóa');
        } finally {
            dat_dang_xoa(false);
        }
    }

    // === RENDER ===
    return (
        <div className="quan-ly-goi-hoi-vien">
            <div className="page-header">
                <h2>Quản lý gói hội viên</h2>
                <button className="btn-them" onClick={mo_them}>+ Thêm gói mới</button>
            </div>

            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Tìm kiếm gói hội viên..."
                    value={tim_kiem}
                    onChange={(e) => {
                        dat_trang(1);
                        dat_tim_kiem(e.target.value);
                    }}
                />
            </div>

            <div className="table-container">
                {dang_tai ? (
                    <div className="spinner">Đang tải...</div>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Tên gói</th>
                                <th>Giá</th>
                                <th>Thời hạn</th>
                                <th>Số sách</th>
                                <th>Người dùng</th>
                                <th>Trạng thái</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {danh_sach.map((goi, idx) => (
                                <tr key={goi.ma_hv}>
                                    <td>{(trang - 1) * 10 + idx + 1}</td>
                                    <td>{goi.ten_goi}</td>
                                    <td>{Intl.NumberFormat('vi-VN').format(goi.gia)} ₫</td>
                                    <td>{goi.thoi_han_thang} tháng</td>
                                    <td>{goi.so_luong_sach}</td>
                                    <td>{goi.so_nguoi_dung}</td>
                                    <td>
                                        <label className="toggle-switch">
                                            <input
                                                type="checkbox"
                                                checked={goi.hoat_dong}
                                                disabled={dang_toggle.has(goi.ma_hv)}
                                                onChange={() => toggle_trang_thai(goi.ma_hv, goi.hoat_dong)}
                                            />
                                            <span className="slider round"></span>
                                        </label>
                                    </td>
                                    <td className="actions">
                                        <button className="btn-xem" onClick={() => xem_chi_tiet(goi.ma_hv)}>Chi tiết</button>
                                        <button className="btn-sua" onClick={() => mo_sua(goi.ma_hv)}>Sửa</button>
                                        <button className="btn-xoa" onClick={() => { dat_ma_xoa(goi.ma_hv); dat_hien_xoa(true); }}>Xóa</button>
                                    </td>
                                </tr>
                            ))}
                            {danh_sach.length === 0 && (
                                <tr>
                                    <td colSpan="8" style={{ textAlign: 'center' }}>Không tìm thấy gói hội viên nào.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {tong_so_trang > 1 && (
                <div className="pagination">
                    <button disabled={trang === 1} onClick={() => dat_trang(t => t - 1)}>Trước</button>
                    <span>Trang {trang} / {tong_so_trang}</span>
                    <button disabled={trang === tong_so_trang} onClick={() => dat_trang(t => t + 1)}>Sau</button>
                </div>
            )}

            {/* MODAL THÊM / SỬA (2 BƯỚC) */}
            {hien_modal && (
                <div className="modal-overlay">
                    <div className={`modal-content ${buoc === 2 ? 'modal-lg' : ''}`}>
                        <div className="modal-header">
                            <h3>{goi_dang_sua ? 'Sửa gói hội viên' : 'Thêm gói hội viên'} <span className="step-badge">(Bước {buoc}/2)</span></h3>
                        </div>

                        {buoc === 1 && (
                            <div className="modal-body form-step-1">
                                <div className="form-group">
                                    <label>Tên gói *</label>
                                    <input type="text" value={form.ten_goi} onChange={e => dat_form({ ...form, ten_goi: e.target.value })} required />
                                </div>
                                <div className="form-group row">
                                    <div className="col">
                                        <label>Giá (VNĐ) *</label>
                                        <input type="number" value={form.gia} onChange={e => dat_form({ ...form, gia: e.target.value })} required />
                                    </div>
                                    <div className="col">
                                        <label>Thời hạn (tháng) *</label>
                                        <input type="number" value={form.thoi_han_thang} onChange={e => dat_form({ ...form, thoi_han_thang: e.target.value })} required />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Mô tả</label>
                                    <textarea rows="3" value={form.mo_ta} onChange={e => dat_form({ ...form, mo_ta: e.target.value })}></textarea>
                                </div>
                                <div className="form-group checkbox-group">
                                    <label>
                                        <input type="checkbox" checked={form.hoat_dong} onChange={e => dat_form({ ...form, hoat_dong: e.target.checked })} />
                                        Kích hoạt ngay
                                    </label>
                                </div>
                                <div className="modal-actions">
                                    <button className="btn-huy" onClick={() => dat_hien_modal(false)}>Hủy</button>
                                    <button className="btn-tiep" onClick={chuyen_buoc_2}>Tiếp theo</button>
                                </div>
                            </div>
                        )}

                        {buoc === 2 && (
                            <div className="modal-body form-step-2">
                                <div className="step-2-header">
                                    <input 
                                        type="text" 
                                        placeholder="Tìm sách để thêm..." 
                                        value={tu_khoa_sach}
                                        onChange={e => { dat_trang_sach(1); dat_tu_khoa_sach(e.target.value); }}
                                        className="search-book-input"
                                    />
                                    <span className="badge-chon">Đã chọn {sach_da_chon.length} sách</span>
                                </div>
                                
                                <div className="book-list-container">
                                    {dang_tai_sach ? <div className="spinner">Đang tải sách...</div> : (
                                        <table className="book-table">
                                            <thead>
                                                <tr>
                                                    <th>Chọn</th>
                                                    <th>Ảnh</th>
                                                    <th>Tên sách</th>
                                                    <th>Tác giả</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {ds_sach_tim.map(sach => (
                                                    <tr key={sach.ma_sach} onClick={() => toggle_chon_sach(sach)} className="clickable-row">
                                                        <td>
                                                            <input 
                                                                type="checkbox" 
                                                                checked={la_da_chon(sach.ma_sach)} 
                                                                onChange={() => {}} // Handle on tr click
                                                            />
                                                        </td>
                                                        <td><img src={sach.anh_bia_url} alt={sach.ten_sach} className="thumb-anh" /></td>
                                                        <td>{sach.ten_sach}</td>
                                                        <td>{sach.tac_gia}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    )}
                                </div>
                                
                                {tong_trang_sach > 1 && (
                                    <div className="pagination small">
                                        <button disabled={trang_sach === 1} onClick={() => dat_trang_sach(t => t - 1)}>Trước</button>
                                        <span>{trang_sach}/{tong_trang_sach}</span>
                                        <button disabled={trang_sach === tong_trang_sach} onClick={() => dat_trang_sach(t => t + 1)}>Sau</button>
                                    </div>
                                )}

                                <div className="modal-actions">
                                    <button className="btn-huy" onClick={() => dat_buoc(1)}>Quay lại</button>
                                    <button className="btn-luu" onClick={luu_goi}>Lưu gói hội viên</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* MODAL CHI TIẾT */}
            {hien_chi_tiet && chi_tiet && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>Chi tiết gói: {chi_tiet.ten_goi}</h3>
                        </div>
                        <div className="modal-body detail-view">
                            <p><strong>Giá:</strong> {Intl.NumberFormat('vi-VN').format(chi_tiet.gia)} ₫</p>
                            <p><strong>Thời hạn:</strong> {chi_tiet.thoi_han_thang} tháng</p>
                            <p><strong>Trạng thái:</strong> <span className={`status-badge ${chi_tiet.hoat_dong ? 'active' : ''}`}>{chi_tiet.hoat_dong ? 'Đang hoạt động' : 'Tạm khóa'}</span></p>
                            <p><strong>Số lượng sách:</strong> {chi_tiet.so_luong_sach}</p>
                            <p><strong>Mô tả:</strong> {chi_tiet.mo_ta || 'Không có mô tả'}</p>
                        </div>
                        <div className="modal-actions right">
                            <button className="btn-huy" onClick={() => dat_hien_chi_tiet(false)}>Đóng</button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL XÁC NHẬN XÓA */}
            {hien_xoa && (
                <div className="modal-overlay">
                    <div className="modal-content modal-sm">
                        <div className="modal-header">
                            <h3>Xác nhận xóa</h3>
                        </div>
                        <div className="modal-body">
                            <p>Bạn có chắc chắn muốn xóa gói này không?</p>
                        </div>
                        <div className="modal-actions">
                            <button className="btn-huy" onClick={() => dat_hien_xoa(false)}>Hủy</button>
                            <button className="btn-xoa" onClick={xac_nhan_xoa} disabled={dang_xoa}>
                                {dang_xoa ? 'Đang xóa...' : 'Xóa'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QuanLyGoiHoiVien;