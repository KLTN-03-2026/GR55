import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import api from '../../services/api';
import { dinh_dang_gia } from '../../utils/dinh_dang';
import './QuanLyGiamGia.css';

const FORM_TRONG = { ten_chuong_trinh: '', ngay_bat_dau: '', ngay_ket_thuc: '', loai_giam: 'phan_tram', gia_tri_giam: '' };

function kiemTraForm(f) {
    if (!f.ten_chuong_trinh.trim()) return 'Tên chương trình không được để trống';
    if (!f.ngay_bat_dau) return 'Chưa chọn ngày bắt đầu';
    if (!f.ngay_ket_thuc) return 'Chưa chọn ngày kết thúc';
    if (new Date(f.ngay_ket_thuc) <= new Date(f.ngay_bat_dau)) return 'Ngày kết thúc phải sau ngày bắt đầu';
    const val = parseFloat(f.gia_tri_giam);
    if (!f.gia_tri_giam || isNaN(val) || val <= 0) return 'Giá trị giảm phải lớn hơn 0';
    if (f.loai_giam === 'phan_tram' && val > 99) return 'Phần trăm giảm không được vượt quá 99%';
    return null;
}

function hienThi_giam(loai, gia_tri) {
    return loai === 'phan_tram' ? `${gia_tri}%` : dinh_dang_gia(gia_tri);
}

export default function QuanLyGiamGia() {
    // Danh sách
    const [danh_sach, dat_danh_sach] = useState([]);
    const [tong_trang, dat_tong_trang] = useState(1);
    const [trang, dat_trang] = useState(1);
    const [bo_loc, dat_bo_loc] = useState({ ten: '', hoat_dong: '', tu_ngay: '', den_ngay: '' });

    // Modal form (tạo / sửa)
    const [mo_form, dat_mo_form] = useState(false);
    const [ma_ct_sua, dat_ma_ct_sua] = useState(null);
    const [form, dat_form] = useState(FORM_TRONG);
    const [dang_luu, dat_dang_luu] = useState(false);

    // Modal chọn sách (bước 2)
    const [mo_chon_sach, dat_mo_chon_sach] = useState(false);
    const [ma_ct_chon, dat_ma_ct_chon] = useState(null);
    const [ten_ct_chon, dat_ten_ct_chon] = useState('');
    const [tu_khoa, dat_tu_khoa] = useState('');
    const [bo_loc_sach, dat_bo_loc_sach] = useState({ ma_danh_muc: '', gia_tu: '', gia_den: '' });
    const [danh_muc_list, dat_danh_muc_list] = useState([]);
    const [sach_list, dat_sach_list] = useState([]);
    const [trang_sach, dat_trang_sach] = useState(1);
    const [tong_trang_sach, dat_tong_trang_sach] = useState(1);
    const [tong_sach, dat_tong_sach] = useState(0);
    const [dang_tim, dat_dang_tim] = useState(false);
    const [da_chon, dat_da_chon] = useState(new Set());
    const [dang_them, dat_dang_them] = useState(false);

    // Modal chi tiết
    const [chi_tiet, dat_chi_tiet] = useState(null);
    const [dang_tai_ct, dat_dang_tai_ct] = useState(false);

    // ===== Danh sách =====
    const tai_danh_sach = useCallback(async (t = 1) => {
        try {
            const res = await api.get('/admin/giam_gia', {
                params: {
                    trang: t, kich_thuoc: 10,
                    ten: bo_loc.ten || undefined,
                    hoat_dong: bo_loc.hoat_dong !== '' ? bo_loc.hoat_dong : undefined,
                    tu_ngay: bo_loc.tu_ngay || undefined,
                    den_ngay: bo_loc.den_ngay || undefined,
                }
            });
            dat_danh_sach(res.data.danh_sach || []);
            dat_tong_trang(res.data.tong_so_trang || 1);
            dat_trang(t);
        } catch { toast.error('Lỗi tải danh sách'); }
    }, [bo_loc]);

    useEffect(() => { tai_danh_sach(1); }, [tai_danh_sach]);

    // ===== Form tạo / sửa =====
    function mo_form_tao() {
        dat_form(FORM_TRONG);
        dat_ma_ct_sua(null);
        dat_mo_form(true);
    }

    function mo_form_sua_ct(ct) {
        dat_form({
            ten_chuong_trinh: ct.ten_chuong_trinh,
            ngay_bat_dau: ct.ngay_bat_dau?.slice(0, 16) ?? '',
            ngay_ket_thuc: ct.ngay_ket_thuc?.slice(0, 16) ?? '',
            loai_giam: ct.loai_giam,
            gia_tri_giam: String(ct.gia_tri_giam),
        });
        dat_ma_ct_sua(ct.ma_ct);
        dat_mo_form(true);
    }

    async function luu_form() {
        const loi = kiemTraForm(form);
        if (loi) { toast.error(loi); return; }
        dat_dang_luu(true);
        try {
            const payload = {
                ...form,
                gia_tri_giam: parseFloat(form.gia_tri_giam),
            };
            if (ma_ct_sua) {
                // Sửa
                const res = await api.put(`/admin/giam_gia/${ma_ct_sua}`, payload);
                if (!res.data.success) { toast.error(res.data.message); return; }
                toast.success('Cập nhật chương trình thành công');
                dat_mo_form(false);
                tai_danh_sach(trang);
                // Nếu chi tiết đang mở, reload
                if (chi_tiet?.ma_ct === ma_ct_sua) tai_chi_tiet(ma_ct_sua);
            } else {
                // Tạo mới → chuyển sang bước 2
                const res = await api.post('/admin/giam_gia', payload);
                if (!res.data.success) { toast.error(res.data.message); return; }
                const ma_ct_moi = res.data.data.ma_ct;
                const ten_ct_moi = res.data.data.ten_chuong_trinh;
                toast.success('Tạo chương trình thành công! Hãy thêm sách.');
                dat_mo_form(false);
                tai_danh_sach(1);
                mo_chon_sach_modal(ma_ct_moi, ten_ct_moi);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Có lỗi xảy ra');
        } finally {
            dat_dang_luu(false);
        }
    }

    // ===== Bước 2: Chọn sách =====
    function mo_chon_sach_modal(maCt, tenCt) {
        dat_ma_ct_chon(maCt);
        dat_ten_ct_chon(tenCt);
        dat_tu_khoa('');
        dat_bo_loc_sach({ ma_danh_muc: '', gia_tu: '', gia_den: '' });
        dat_da_chon(new Set());
        dat_trang_sach(1);
        dat_mo_chon_sach(true);
    }

    useEffect(() => {
        if (mo_chon_sach && danh_muc_list.length === 0) {
            api.get('/admin/danh_muc', { params: { trang: 1, kich_thuoc: 100 } })
               .then(res => dat_danh_muc_list(res.data.danh_sach || []))
               .catch(() => {});
        }
    }, [mo_chon_sach]);

    const tai_sach = useCallback(async (t = 1, kw = '', boLoc = {}) => {
        if (!ma_ct_chon) return;
        dat_dang_tim(true);
        try {
            const res = await api.get('/admin/giam_gia/sach_tim_kiem', {
                params: {
                    tu_khoa: kw || undefined,
                    ma_ct: ma_ct_chon,
                    trang: t,
                    kich_thuoc: 12,
                    ma_danh_muc: boLoc.ma_danh_muc || undefined,
                    gia_tu: boLoc.gia_tu || undefined,
                    gia_den: boLoc.gia_den || undefined,
                }
            });
            dat_sach_list(res.data.danh_sach || []);
            dat_trang_sach(res.data.trang_hien_tai);
            dat_tong_trang_sach(res.data.tong_so_trang);
            dat_tong_sach(res.data.tong_so_ban_ghi);
        } catch { dat_sach_list([]); }
        finally { dat_dang_tim(false); }
    }, [ma_ct_chon]);

    useEffect(() => {
        if (mo_chon_sach) tai_sach(1, tu_khoa, bo_loc_sach);
    }, [mo_chon_sach, tai_sach, tu_khoa, bo_loc_sach.ma_danh_muc, bo_loc_sach.gia_tu, bo_loc_sach.gia_den]);

    function toggle_chon(ma_sach) {
        dat_da_chon(prev => {
            const next = new Set(prev);
            next.has(ma_sach) ? next.delete(ma_sach) : next.add(ma_sach);
            return next;
        });
    }

    async function them_sach_da_chon() {
        if (da_chon.size === 0) return;
        dat_dang_them(true);
        try {
            const res = await api.post(`/admin/giam_gia/${ma_ct_chon}/sach`, [...da_chon]);
            if (res.data.success) {
                toast.success(res.data.message);
                dat_da_chon(new Set());
                tai_sach(trang_sach, tu_khoa, bo_loc_sach);
                tai_danh_sach(trang);
            } else {
                toast.error(res.data.message);
            }
        } catch { toast.error('Có lỗi xảy ra'); }
        finally { dat_dang_them(false); }
    }

    function dong_chon_sach() {
        dat_mo_chon_sach(false);
        dat_sach_list([]);
        dat_da_chon(new Set());
        dat_bo_loc_sach({ ma_danh_muc: '', gia_tu: '', gia_den: '' });
        if (chi_tiet?.ma_ct === ma_ct_chon) tai_chi_tiet(ma_ct_chon);
    }

    // ===== Chi tiết =====
    async function tai_chi_tiet(maCt) {
        dat_dang_tai_ct(true);
        try {
            const res = await api.get(`/admin/giam_gia/${maCt}`);
            dat_chi_tiet(res.data.data);
        } catch { toast.error('Lỗi tải chi tiết'); }
        finally { dat_dang_tai_ct(false); }
    }

    async function xoa_sach_khoi_ct(maCt, maSach) {
        try {
            await api.delete(`/admin/giam_gia/${maCt}/sach/${maSach}`);
            tai_chi_tiet(maCt);
            tai_danh_sach(trang);
        } catch { toast.error('Có lỗi xảy ra'); }
    }

    // ===== Bật/Tắt & Xóa =====
    async function bat_tat(maCt, hoatDong) {
        try {
            await api.put(`/admin/giam_gia/${maCt}/trang_thai`, null, { params: { hoat_dong: !hoatDong } });
            toast.success(!hoatDong ? 'Đã bật chương trình' : 'Đã tắt chương trình');
            tai_danh_sach(trang);
            if (chi_tiet?.ma_ct === maCt) tai_chi_tiet(maCt);
        } catch { toast.error('Có lỗi xảy ra'); }
    }

    async function xoa_ct(maCt) {
        if (!window.confirm('Bạn có chắc muốn xóa chương trình này không?')) return;
        try {
            const res = await api.delete(`/admin/giam_gia/${maCt}`);
            if (res.data.success) {
                toast.success('Đã xóa chương trình');
                if (chi_tiet?.ma_ct === maCt) dat_chi_tiet(null);
                tai_danh_sach(trang);
            } else {
                toast.error(res.data.message);
            }
        } catch { toast.error('Có lỗi xảy ra'); }
    }

    // ===== Render =====
    return (
        <div className="quan_ly_giam_gia">
            {/* Header */}
            <div className="header_admin">
                <h2>Chương trình giảm giá</h2>
                <button className="nut_them_moi" onClick={mo_form_tao}>+ Thêm chương trình</button>
            </div>

            {/* Bộ lọc */}
            <div className="bo_loc_giam_gia">
                <input type="text" placeholder="Tên chương trình..."
                    value={bo_loc.ten} onChange={e => dat_bo_loc(p => ({ ...p, ten: e.target.value }))} />
                <select value={bo_loc.hoat_dong} onChange={e => dat_bo_loc(p => ({ ...p, hoat_dong: e.target.value }))}>
                    <option value="">Tất cả trạng thái</option>
                    <option value="true">Đang bật</option>
                    <option value="false">Đã tắt</option>
                </select>
                <label className="loc-ngay">Từ ngày <input type="date" value={bo_loc.tu_ngay} onChange={e => dat_bo_loc(p => ({ ...p, tu_ngay: e.target.value }))} /></label>
                <label className="loc-ngay">Đến ngày <input type="date" value={bo_loc.den_ngay} onChange={e => dat_bo_loc(p => ({ ...p, den_ngay: e.target.value }))} /></label>
            </div>

            {/* Bảng */}
            <table>
                <thead>
                    <tr>
                        <th>Tên chương trình</th>
                        <th>Bắt đầu</th>
                        <th>Kết thúc</th>
                        <th>Giảm</th>
                        <th>Số sách</th>
                        <th>Trạng thái</th>
                        <th>Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {danh_sach.map(ct => (
                        <tr key={ct.ma_ct}>
                            <td>{ct.ten_chuong_trinh}</td>
                            <td>{new Date(ct.ngay_bat_dau).toLocaleDateString('vi-VN')}</td>
                            <td>{new Date(ct.ngay_ket_thuc).toLocaleDateString('vi-VN')}</td>
                            <td>{hienThi_giam(ct.loai_giam, ct.gia_tri_giam)}</td>
                            <td>{ct.so_luong_sach}</td>
                            <td>
                                <span className={`badge ${ct.hoat_dong ? 'xanh' : 'xam'}`}>
                                    {ct.hoat_dong ? 'Đang bật' : 'Đã tắt'}
                                </span>
                            </td>
                            <td>
                                <div className="nhom_nut_thao_tac">
                                    <button className="nut_chi_tiet" onClick={() => { dat_chi_tiet(null); tai_chi_tiet(ct.ma_ct); }}>
                                        Chi tiết
                                    </button>
                                    <button className="nut_sua" onClick={() => mo_form_sua_ct(ct)}>Sửa</button>
                                    <button className={`nut_trang_thai ${ct.hoat_dong ? 'nut_tat' : 'nut_bat'}`}
                                        onClick={() => bat_tat(ct.ma_ct, ct.hoat_dong)}>
                                        {ct.hoat_dong ? 'Tắt' : 'Bật'}
                                    </button>
                                    <button className="nut_xoa" onClick={() => xoa_ct(ct.ma_ct)}>Xóa</button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    {danh_sach.length === 0 && (
                        <tr><td colSpan={7} className="trong_bang">Chưa có chương trình nào</td></tr>
                    )}
                </tbody>
            </table>

            {/* Phân trang */}
            {tong_trang > 1 && (
                <div className="phan_trang">
                    <button onClick={() => tai_danh_sach(trang - 1)} disabled={trang === 1}>‹</button>
                    <span>Trang {trang} / {tong_trang}</span>
                    <button onClick={() => tai_danh_sach(trang + 1)} disabled={trang === tong_trang}>›</button>
                </div>
            )}

            {/* ===== Modal Form (Tạo / Sửa) ===== */}
            {mo_form && (
                <div className="modal_overlay" onClick={e => e.target === e.currentTarget && dat_mo_form(false)}>
                    <div className="modal_content">
                        <h3>{ma_ct_sua ? 'Chỉnh sửa chương trình' : 'Tạo chương trình giảm giá'}</h3>

                        <div className="truong_nhap">
                            <label>Tên chương trình *</label>
                            <input type="text" placeholder="VD: Sale tháng 12" value={form.ten_chuong_trinh}
                                onChange={e => dat_form(p => ({ ...p, ten_chuong_trinh: e.target.value }))} />
                        </div>

                        <div className="nhom_input">
                            <div className="truong_nhap">
                                <label>Ngày bắt đầu *</label>
                                <input type="datetime-local" value={form.ngay_bat_dau}
                                    onChange={e => dat_form(p => ({ ...p, ngay_bat_dau: e.target.value }))} />
                            </div>
                            <div className="truong_nhap">
                                <label>Ngày kết thúc *</label>
                                <input type="datetime-local" value={form.ngay_ket_thuc}
                                    onChange={e => dat_form(p => ({ ...p, ngay_ket_thuc: e.target.value }))} />
                            </div>
                        </div>

                        <div className="nhom_input">
                            <div className="truong_nhap">
                                <label>Loại giảm *</label>
                                <select value={form.loai_giam}
                                    onChange={e => dat_form(p => ({ ...p, loai_giam: e.target.value, gia_tri_giam: '' }))}>
                                    <option value="phan_tram">Phần trăm (%)</option>
                                    <option value="tien_co_dinh">Cố định (VND)</option>
                                </select>
                            </div>
                            <div className="truong_nhap">
                                <label>
                                    Giá trị giảm *
                                    <span className="goi_y_gia_tri">
                                        {form.loai_giam === 'phan_tram' ? '(1–99%)' : '(> 0đ)'}
                                    </span>
                                </label>
                                <input type="number" min="0.01" step={form.loai_giam === 'phan_tram' ? '1' : '1000'}
                                    max={form.loai_giam === 'phan_tram' ? '99' : undefined}
                                    placeholder={form.loai_giam === 'phan_tram' ? 'VD: 20' : 'VD: 50000'}
                                    value={form.gia_tri_giam}
                                    onChange={e => dat_form(p => ({ ...p, gia_tri_giam: e.target.value }))} />
                            </div>
                        </div>

                        <div className="modal_actions">
                            <button onClick={() => dat_mo_form(false)}>Hủy</button>
                            <button className="nut_chinh" onClick={luu_form} disabled={dang_luu}>
                                {dang_luu ? 'Đang lưu...' : ma_ct_sua ? 'Lưu thay đổi' : 'Tạo chương trình'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ===== Modal Chọn Sách (Bước 2) ===== */}
            {mo_chon_sach && (
                <div className="modal_overlay" onClick={e => e.target === e.currentTarget && dong_chon_sach()}>
                    <div className="modal_chon_sach">
                        <div className="header_chon_sach">
                            <div>
                                <h3>Thêm sách vào chương trình</h3>
                                <p className="ten_ct_chon_sach">{ten_ct_chon}</p>
                            </div>
                            <button className="nut_dong_x" onClick={dong_chon_sach}>✕</button>
                        </div>

                        <div className="thanh_tim_kiem_sach">
                            <input type="text" placeholder="Tìm theo tên sách hoặc tác giả..."
                                value={tu_khoa}
                                onChange={e => dat_tu_khoa(e.target.value)} />
                            {da_chon.size > 0 && <span className="so_da_chon">Đã chọn: {da_chon.size}</span>}
                        </div>

                        <div className="bo_loc_sach">
                            <select value={bo_loc_sach.ma_danh_muc}
                                onChange={e => dat_bo_loc_sach(p => ({ ...p, ma_danh_muc: e.target.value }))}>
                                <option value="">Tất cả thể loại</option>
                                {danh_muc_list.map(dm => (
                                    <option key={dm.ma_dm} value={dm.ma_dm}>{dm.ten_danh_muc}</option>
                                ))}
                            </select>
                            <input type="number" placeholder="Giá từ (đ)" min="0"
                                value={bo_loc_sach.gia_tu}
                                onChange={e => dat_bo_loc_sach(p => ({ ...p, gia_tu: e.target.value }))} />
                            <input type="number" placeholder="Giá đến (đ)" min="0"
                                value={bo_loc_sach.gia_den}
                                onChange={e => dat_bo_loc_sach(p => ({ ...p, gia_den: e.target.value }))} />
                            {(bo_loc_sach.ma_danh_muc || bo_loc_sach.gia_tu || bo_loc_sach.gia_den) && (
                                <button className="nut_dat_lai_loc"
                                    onClick={() => dat_bo_loc_sach({ ma_danh_muc: '', gia_tu: '', gia_den: '' })}>
                                    Đặt lại
                                </button>
                            )}
                        </div>

                        <div className="luoi_sach_chon">
                            {dang_tim ? (
                                <div className="dang_tai">Đang tìm kiếm...</div>
                            ) : sach_list.length === 0 ? (
                                <div className="dang_tai">Không tìm thấy sách phù hợp</div>
                            ) : sach_list.map(s => (
                                <div key={s.ma_sach}
                                    className={`the_sach_chon ${da_chon.has(s.ma_sach) ? 'dang_chon' : ''} ${s.trong_chuong_trinh ? 'da_co_trong_ct' : ''}`}
                                    onClick={() => !s.trong_chuong_trinh && toggle_chon(s.ma_sach)}>
                                    <img src={s.anh_bia_url} alt={s.ten_sach} />
                                    <div className="thong_tin_sach_chon">
                                        <p className="ten_sach_chon">{s.ten_sach}</p>
                                        <p className="tac_gia_chon">{s.tac_gia}</p>
                                        <p className="gia_sach_chon">{dinh_dang_gia(s.gia)}</p>
                                    </div>
                                    {s.trong_chuong_trinh
                                        ? <span className="badge_da_co">Đã có</span>
                                        : da_chon.has(s.ma_sach)
                                            ? <span className="badge_da_chon">✓</span>
                                            : null
                                    }
                                </div>
                            ))}
                        </div>

                        {tong_trang_sach > 1 && (
                            <div className="phan_trang_sach">
                                <button onClick={() => tai_sach(trang_sach - 1, tu_khoa, bo_loc_sach)} disabled={trang_sach === 1}>‹</button>
                                <span>{trang_sach} / {tong_trang_sach}</span>
                                <button onClick={() => tai_sach(trang_sach + 1, tu_khoa, bo_loc_sach)} disabled={trang_sach === tong_trang_sach}>›</button>
                            </div>
                        )}

                        <div className="modal_actions">
                            <button onClick={dong_chon_sach}>Hoàn thành</button>
                            <button className="nut_chinh" onClick={them_sach_da_chon}
                                disabled={da_chon.size === 0 || dang_them}>
                                {dang_them ? 'Đang thêm...' : `Thêm ${da_chon.size > 0 ? da_chon.size + ' sách' : 'sách đã chọn'}`}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ===== Modal Chi Tiết ===== */}
            {chi_tiet && (
                <div className="modal_overlay" onClick={e => e.target === e.currentTarget && dat_chi_tiet(null)}>
                    <div className="modal_chi_tiet">
                        <div className="header_chi_tiet">
                            <div>
                                <h3>{chi_tiet.ten_chuong_trinh}</h3>
                                <span className={`badge ${chi_tiet.hoat_dong ? 'xanh' : 'xam'}`}>
                                    {chi_tiet.hoat_dong ? 'Đang bật' : 'Đã tắt'}
                                </span>
                            </div>
                            <button className="nut_dong_x" onClick={() => dat_chi_tiet(null)}>✕</button>
                        </div>

                        {dang_tai_ct ? (
                            <div className="dang_tai">Đang tải...</div>
                        ) : (
                            <>
                                <div className="card_thong_tin_ct">
                                    <div className="hang_thong_tin">
                                        <span>📅 Thời gian:</span>
                                        <span>{new Date(chi_tiet.ngay_bat_dau).toLocaleString('vi-VN')} → {new Date(chi_tiet.ngay_ket_thuc).toLocaleString('vi-VN')}</span>
                                    </div>
                                    <div className="hang_thong_tin">
                                        <span>🏷️ Giảm:</span>
                                        <strong className="gia_tri_giam_ct">{hienThi_giam(chi_tiet.loai_giam, chi_tiet.gia_tri_giam)}</strong>
                                        <span className="loai_giam_ct">({chi_tiet.loai_giam === 'phan_tram' ? 'phần trăm' : 'cố định'})</span>
                                    </div>
                                    <div className="hang_thong_tin">
                                        <span>📚 Số sách:</span>
                                        <span>{chi_tiet.tong_so_sach} sách</span>
                                    </div>
                                </div>

                                <div className="header_sach_trong_ct">
                                    <h4>Danh sách sách ({chi_tiet.tong_so_sach})</h4>
                                    <button className="nut_them_sach_ct"
                                        onClick={() => { dat_chi_tiet(null); mo_chon_sach_modal(chi_tiet.ma_ct, chi_tiet.ten_chuong_trinh); }}>
                                        + Thêm sách
                                    </button>
                                </div>

                                <div className="luoi_sach_ct">
                                    {chi_tiet.danh_sach_sach.length === 0 ? (
                                        <p className="chua_co_sach">Chưa có sách nào.</p>
                                    ) : chi_tiet.danh_sach_sach.map(s => (
                                        <div key={s.ma_sach} className="the_sach_ct">
                                            <img src={s.anh_bia_url} alt={s.ten_sach} />
                                            <div className="thong_tin_sach_ct">
                                                <p className="ten_sach_ct">{s.ten_sach}</p>
                                                <p className="tac_gia_ct">{s.tac_gia}</p>
                                                <div className="gia_sach_ct">
                                                    <span className="gia_goc">{dinh_dang_gia(s.gia_goc)}</span>
                                                    <span className="mui_ten_gia">→</span>
                                                    <span className="gia_sau_giam">{dinh_dang_gia(s.gia_sau_giam)}</span>
                                                </div>
                                            </div>
                                            <button className="nut_xoa_sach_ct"
                                                title="Xóa khỏi chương trình"
                                                onClick={() => xoa_sach_khoi_ct(chi_tiet.ma_ct, s.ma_sach)}>
                                                ✕
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                <div className="modal_actions">
                                    <button onClick={() => dat_chi_tiet(null)}>Đóng</button>
                                    <button className="nut_sua" onClick={() => { dat_chi_tiet(null); mo_form_sua_ct(chi_tiet); }}>
                                        Chỉnh sửa thông tin
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
