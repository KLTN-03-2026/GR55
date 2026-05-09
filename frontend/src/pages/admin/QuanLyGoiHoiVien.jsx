import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import api from '../../services/api';
import { dinh_dang_gia } from '../../utils/dinh_dang';
import './QuanLyGoiHoiVien.css';

const FORM_TRONG = { ten_goi: '', gia: '', thoi_han_thang: '', mo_ta: '', hoat_dong: true };

function kiemTraForm(f) {
    if (!f.ten_goi.trim()) return 'Tên gói không được để trống';
    const gia = parseFloat(f.gia);
    if (f.gia === '' || isNaN(gia) || gia < 0) return 'Giá phải lớn hơn hoặc bằng 0';
    const han = parseInt(f.thoi_han_thang);
    if (f.thoi_han_thang === '' || isNaN(han) || han < 1) return 'Thời hạn phải ít nhất 1 tháng';
    return null;
}

export default function QuanLyGoiHoiVien() {
    // Danh sách
    const [danh_sach, dat_danh_sach] = useState([]);
    const [tong_trang, dat_tong_trang] = useState(1);
    const [trang, dat_trang] = useState(1);
    const [tim_kiem, dat_tim_kiem] = useState('');

    // Modal form (tạo / sửa)
    const [mo_form, dat_mo_form] = useState(false);
    const [ma_hv_sua, dat_ma_hv_sua] = useState(null);
    const [form, dat_form] = useState(FORM_TRONG);
    const [dang_luu, dat_dang_luu] = useState(false);

    // Modal chọn sách
    const [mo_chon_sach, dat_mo_chon_sach] = useState(false);
    const [ma_hv_chon, dat_ma_hv_chon] = useState(null);
    const [ten_goi_chon, dat_ten_goi_chon] = useState('');
    const [tu_khoa, dat_tu_khoa] = useState('');
    const [sach_list, dat_sach_list] = useState([]);
    const [trang_sach, dat_trang_sach] = useState(1);
    const [tong_trang_sach, dat_tong_trang_sach] = useState(1);
    const [dang_tim, dat_dang_tim] = useState(false);
    const [da_chon, dat_da_chon] = useState(new Set());
    const [dang_them, dat_dang_them] = useState(false);

    // Modal chi tiết
    const [chi_tiet, dat_chi_tiet] = useState(null);
    const [dang_tai_ct, dat_dang_tai_ct] = useState(false);

    // ===== Danh sách =====
    const tai_danh_sach = useCallback(async (t = 1) => {
        try {
            const res = await api.get('/admin/goi_hoi_vien', {
                params: { trang: t, kich_thuoc: 10, ten: tim_kiem || undefined }
            });
            if (res.data.thanh_cong) {
                dat_danh_sach(res.data.danh_sach);
                dat_tong_trang(res.data.tong_so_trang || 1);
                dat_trang(t);
            }
        } catch { toast.error('Lỗi tải danh sách'); }
    }, [tim_kiem]);

    useEffect(() => { tai_danh_sach(1); }, [tai_danh_sach]);

    // ===== Form tạo / sửa =====
    function mo_form_tao() {
        dat_form(FORM_TRONG);
        dat_ma_hv_sua(null);
        dat_mo_form(true);
    }

    function mo_form_sua(goi) {
        dat_form({
            ten_goi: goi.ten_goi,
            gia: String(goi.gia),
            thoi_han_thang: String(goi.thoi_han_thang),
            mo_ta: goi.mo_ta || '',
            hoat_dong: goi.hoat_dong,
        });
        dat_ma_hv_sua(goi.ma_hv);
        dat_mo_form(true);
    }

    async function luu_form() {
        const loi = kiemTraForm(form);
        if (loi) { toast.error(loi); return; }
        dat_dang_luu(true);
        try {
            const payload = {
                ten_goi: form.ten_goi.trim(),
                gia: parseFloat(form.gia),
                thoi_han_thang: parseInt(form.thoi_han_thang),
                mo_ta: form.mo_ta.trim() || null,
                hoat_dong: form.hoat_dong,
            };
            if (ma_hv_sua) {
                const res = await api.put(`/admin/goi_hoi_vien/${ma_hv_sua}`, payload);
                if (!res.data.thanh_cong) { toast.error(res.data.thong_bao); return; }
                toast.success('Cập nhật gói thành công');
                dat_mo_form(false);
                tai_danh_sach(trang);
                if (chi_tiet?.ma_hv === ma_hv_sua) tai_chi_tiet(ma_hv_sua);
            } else {
                const res = await api.post('/admin/goi_hoi_vien', payload);
                if (!res.data.thanh_cong) { toast.error(res.data.thong_bao); return; }
                const { ma_hv: ma_hv_moi, ten_goi: ten_goi_moi } = res.data.du_lieu;
                toast.success('Tạo gói thành công! Hãy thêm sách.');
                dat_mo_form(false);
                tai_danh_sach(1);
                mo_chon_sach_modal(ma_hv_moi, ten_goi_moi);
            }
        } catch (err) {
            toast.error(err.response?.data?.thong_bao || err.response?.data?.message || 'Có lỗi xảy ra');
        } finally {
            dat_dang_luu(false);
        }
    }

    // ===== Bước 2: Chọn sách =====
    function mo_chon_sach_modal(maHv, tenGoi) {
        dat_ma_hv_chon(maHv);
        dat_ten_goi_chon(tenGoi);
        dat_tu_khoa('');
        dat_da_chon(new Set());
        dat_trang_sach(1);
        dat_mo_chon_sach(true);
    }

    const tai_sach = useCallback(async (t = 1, kw = '') => {
        if (!ma_hv_chon) return;
        dat_dang_tim(true);
        try {
            const res = await api.get('/admin/goi_hoi_vien/sach', {
                params: { tu_khoa: kw || undefined, ma_hv: ma_hv_chon, trang: t, kich_thuoc: 12 }
            });
            if (res.data.success) {
                dat_sach_list(res.data.danh_sach || []);
                dat_trang_sach(res.data.trang_hien_tai);
                dat_tong_trang_sach(res.data.tong_so_trang);
            }
        } catch { dat_sach_list([]); }
        finally { dat_dang_tim(false); }
    }, [ma_hv_chon]);

    useEffect(() => {
        if (mo_chon_sach) tai_sach(1, tu_khoa);
    }, [mo_chon_sach, tai_sach, tu_khoa]);

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
            const res = await api.post(`/admin/goi_hoi_vien/${ma_hv_chon}/sach`, [...da_chon]);
            if (res.data.thanh_cong) {
                toast.success(res.data.thong_bao);
                dat_da_chon(new Set());
                tai_sach(trang_sach, tu_khoa);
                tai_danh_sach(trang);
            } else {
                toast.error(res.data.thong_bao);
            }
        } catch { toast.error('Có lỗi xảy ra'); }
        finally { dat_dang_them(false); }
    }

    function dong_chon_sach() {
        dat_mo_chon_sach(false);
        dat_sach_list([]);
        dat_da_chon(new Set());
        if (chi_tiet?.ma_hv === ma_hv_chon) tai_chi_tiet(ma_hv_chon);
    }

    // ===== Chi tiết =====
    async function tai_chi_tiet(maHv) {
        dat_dang_tai_ct(true);
        try {
            const res = await api.get(`/admin/goi_hoi_vien/${maHv}`);
            if (res.data.thanh_cong) dat_chi_tiet(res.data.du_lieu);
        } catch { toast.error('Lỗi tải chi tiết'); }
        finally { dat_dang_tai_ct(false); }
    }

    async function xoa_sach_khoi_goi(maHv, maSach) {
        try {
            await api.delete(`/admin/goi_hoi_vien/${maHv}/sach/${maSach}`);
            tai_chi_tiet(maHv);
            tai_danh_sach(trang);
        } catch { toast.error('Có lỗi xảy ra'); }
    }

    // ===== Bật/Tắt & Xóa =====
    async function bat_tat(maHv, hoatDong) {
        try {
            const res = await api.put(`/admin/goi_hoi_vien/${maHv}/trang_thai`, null, {
                params: { hoat_dong: !hoatDong }
            });
            if (res.data.thanh_cong) {
                toast.success(!hoatDong ? 'Đã kích hoạt gói' : 'Đã vô hiệu hóa gói');
                tai_danh_sach(trang);
                if (chi_tiet?.ma_hv === maHv) tai_chi_tiet(maHv);
            }
        } catch { toast.error('Có lỗi xảy ra'); }
    }

    async function xoa_goi(maHv) {
        if (!window.confirm('Bạn có chắc muốn xóa gói này không?')) return;
        try {
            const res = await api.delete(`/admin/goi_hoi_vien/${maHv}`);
            if (res.data.thanh_cong) {
                toast.success(res.data.thong_bao);
                if (chi_tiet?.ma_hv === maHv) dat_chi_tiet(null);
                tai_danh_sach(trang);
            } else {
                toast.error(res.data.thong_bao);
            }
        } catch { toast.error('Có lỗi xảy ra'); }
    }

    // ===== Render =====
    return (
        <div className="quan_ly_goi_hoi_vien">
            {/* Header */}
            <div className="header_admin">
                <h2>Gói hội viên</h2>
                <button className="nut_them_moi" onClick={mo_form_tao}>+ Thêm gói mới</button>
            </div>

            {/* Bộ lọc */}
            <div className="bo_loc_giam_gia">
                <input type="text" placeholder="Tìm theo tên gói..."
                    value={tim_kiem}
                    onChange={e => { dat_tim_kiem(e.target.value); dat_trang(1); }} />
            </div>

            {/* Bảng */}
            <table>
                <thead>
                    <tr>
                        <th>Tên gói</th>
                        <th>Giá</th>
                        <th>Thời hạn</th>
                        <th>Số sách</th>
                        <th>Người dùng</th>
                        <th>Trạng thái</th>
                        <th>Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {danh_sach.map(goi => (
                        <tr key={goi.ma_hv}>
                            <td>{goi.ten_goi}</td>
                            <td>{dinh_dang_gia(goi.gia)}</td>
                            <td>{goi.thoi_han_thang} tháng</td>
                            <td>{goi.so_luong_sach}</td>
                            <td>{goi.so_nguoi_dung}</td>
                            <td>
                                <span className={`badge ${goi.hoat_dong ? 'xanh' : 'xam'}`}>
                                    {goi.hoat_dong ? 'Đang bật' : 'Đã tắt'}
                                </span>
                            </td>
                            <td>
                                <div className="nhom_nut_thao_tac">
                                    <button className="nut_chi_tiet"
                                        onClick={() => { dat_chi_tiet(null); tai_chi_tiet(goi.ma_hv); }}>
                                        Chi tiết
                                    </button>
                                    <button className="nut_sua" onClick={() => mo_form_sua(goi)}>Sửa</button>
                                    <button className="nut_them_sach_ct"
                                        onClick={() => mo_chon_sach_modal(goi.ma_hv, goi.ten_goi)}>
                                        + Sách
                                    </button>
                                    <button className={`nut_trang_thai ${goi.hoat_dong ? 'nut_tat' : 'nut_bat'}`}
                                        onClick={() => bat_tat(goi.ma_hv, goi.hoat_dong)}>
                                        {goi.hoat_dong ? 'Tắt' : 'Bật'}
                                    </button>
                                    <button className="nut_xoa" onClick={() => xoa_goi(goi.ma_hv)}>Xóa</button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    {danh_sach.length === 0 && (
                        <tr><td colSpan={7} className="trong_bang">Chưa có gói hội viên nào</td></tr>
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
                        <h3>{ma_hv_sua ? 'Chỉnh sửa gói hội viên' : 'Tạo gói hội viên'}</h3>

                        <div className="truong_nhap">
                            <label>Tên gói *</label>
                            <input type="text" placeholder="VD: Hội Viên Cơ Bản"
                                value={form.ten_goi}
                                onChange={e => dat_form(p => ({ ...p, ten_goi: e.target.value }))} />
                        </div>

                        <div className="nhom_input">
                            <div className="truong_nhap">
                                <label>Giá (VNĐ) *</label>
                                <input type="number" min="0" step="1000" placeholder="VD: 99000"
                                    value={form.gia}
                                    onChange={e => dat_form(p => ({ ...p, gia: e.target.value }))} />
                            </div>
                            <div className="truong_nhap">
                                <label>Thời hạn (tháng) *</label>
                                <input type="number" min="1" step="1" placeholder="VD: 3"
                                    value={form.thoi_han_thang}
                                    onChange={e => dat_form(p => ({ ...p, thoi_han_thang: e.target.value }))} />
                            </div>
                        </div>

                        <div className="truong_nhap">
                            <label>Mô tả</label>
                            <textarea rows="3" placeholder="Mô tả ngắn về gói hội viên..."
                                className="truong_nhap_textarea"
                                value={form.mo_ta}
                                onChange={e => dat_form(p => ({ ...p, mo_ta: e.target.value }))} />
                        </div>

                        <label className="label_checkbox">
                            <input type="checkbox" checked={form.hoat_dong}
                                onChange={e => dat_form(p => ({ ...p, hoat_dong: e.target.checked }))} />
                            Kích hoạt ngay
                        </label>

                        <div className="modal_actions">
                            <button onClick={() => dat_mo_form(false)}>Hủy</button>
                            <button className="nut_chinh" onClick={luu_form} disabled={dang_luu}>
                                {dang_luu ? 'Đang lưu...' : ma_hv_sua ? 'Lưu thay đổi' : 'Tạo gói'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ===== Modal Chọn Sách ===== */}
            {mo_chon_sach && (
                <div className="modal_overlay" onClick={e => e.target === e.currentTarget && dong_chon_sach()}>
                    <div className="modal_chon_sach">
                        <div className="header_chon_sach">
                            <div>
                                <h3>Thêm sách vào gói hội viên</h3>
                                <p className="ten_ct_chon_sach">{ten_goi_chon}</p>
                            </div>
                            <button className="nut_dong_x" onClick={dong_chon_sach}>✕</button>
                        </div>

                        <div className="thanh_tim_kiem_sach">
                            <input type="text" placeholder="Tìm theo tên sách hoặc tác giả..."
                                value={tu_khoa}
                                onChange={e => dat_tu_khoa(e.target.value)} />
                            {da_chon.size > 0 && <span className="so_da_chon">Đã chọn: {da_chon.size}</span>}
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
                                <button onClick={() => tai_sach(trang_sach - 1, tu_khoa)} disabled={trang_sach === 1}>‹</button>
                                <span>{trang_sach} / {tong_trang_sach}</span>
                                <button onClick={() => tai_sach(trang_sach + 1, tu_khoa)} disabled={trang_sach === tong_trang_sach}>›</button>
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
                                <h3>{chi_tiet.ten_goi}</h3>
                                <span className={`badge ${chi_tiet.hoat_dong ? 'xanh' : 'xam'}`}>
                                    {chi_tiet.hoat_dong ? 'Đang bật' : 'Đã tắt'}
                                </span>
                            </div>
                            <button className="nut_dong_x" onClick={() => dat_chi_tiet(null)}>✕</button>
                        </div>

                        {dang_tai_ct ? (
                            <div className="dang_tai" style={{ padding: '32px' }}>Đang tải...</div>
                        ) : (
                            <>
                                <div className="card_thong_tin_ct">
                                    <div className="hang_thong_tin">
                                        <span>💰 Giá:</span>
                                        <strong>{dinh_dang_gia(chi_tiet.gia)}</strong>
                                    </div>
                                    <div className="hang_thong_tin">
                                        <span>⏱️ Thời hạn:</span>
                                        <span>{chi_tiet.thoi_han_thang} tháng</span>
                                    </div>
                                    {chi_tiet.mo_ta && (
                                        <div className="hang_thong_tin">
                                            <span>📝 Mô tả:</span>
                                            <span>{chi_tiet.mo_ta}</span>
                                        </div>
                                    )}
                                    <div className="hang_thong_tin">
                                        <span>📚 Số sách:</span>
                                        <span>{chi_tiet.so_luong_sach} sách</span>
                                    </div>
                                </div>

                                <div className="header_sach_trong_ct">
                                    <h4>Danh sách sách ({chi_tiet.so_luong_sach})</h4>
                                    <button className="nut_them_sach_ct"
                                        onClick={() => { dat_chi_tiet(null); mo_chon_sach_modal(chi_tiet.ma_hv, chi_tiet.ten_goi); }}>
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
                                                <p className="gia_sach_chon" style={{ margin: 0 }}>
                                                    {dinh_dang_gia(s.gia)}
                                                </p>
                                            </div>
                                            <button className="nut_xoa_sach_ct"
                                                title="Xóa khỏi gói"
                                                onClick={() => xoa_sach_khoi_goi(chi_tiet.ma_hv, s.ma_sach)}>
                                                ✕
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                <div className="modal_actions">
                                    <button onClick={() => dat_chi_tiet(null)}>Đóng</button>
                                    <button className="nut_sua"
                                        onClick={() => { dat_chi_tiet(null); mo_form_sua(chi_tiet); }}>
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
