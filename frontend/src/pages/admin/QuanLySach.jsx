import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'react-toastify';
import api from '../../services/api';
// import Header from '../../components/Header';
import './QuanLySach.css';

const KICH_THUOC_TRANG = 10;

function dinh_dang_gia(gia) {
  if (gia == null) return '—';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(gia);
}

const GIA_TRI_FORM_MAC_DINH = {
  ten_sach: '',
  tac_gia: '',
  mo_ta: '',
  gia: '',
  danh_muc_ids: [],
  cho_phep_doc_thu: false,
  so_trang_doc_thu: 5,
};

const LOI_FORM_MAC_DINH = {
  ten_sach: '',
  tac_gia: '',
  gia: '',
  anh_bia: '',
  file_pdf: '',
  danh_muc: '',
};

export default function QuanLySach() {
  const [danh_sach, dat_danh_sach] = useState([]);
  const [trang_hien_tai, dat_trang] = useState(1);
  const [tong_so_trang, dat_tong_trang] = useState(1);
  const [tong_ban_ghi, dat_tong_ban_ghi] = useState(0);
  const [tu_khoa_tim, dat_tu_khoa] = useState('');
  const [ma_danh_muc_loc, dat_ma_dm_loc] = useState('');
  const [dang_tai, dat_dang_tai] = useState(false);

  const [tat_ca_danh_muc, dat_tat_ca_danh_muc] = useState([]);

  // Modal thêm/sửa
  const [hien_modal_form, dat_hien_form] = useState(false);
  const [dang_sua, dat_dang_sua] = useState(null);
  const [gia_tri_form, dat_gia_tri_form] = useState(GIA_TRI_FORM_MAC_DINH);
  const [loi_form, dat_loi_form] = useState(LOI_FORM_MAC_DINH);
  const [loi_server_form, dat_loi_server_form] = useState('');
  const [dang_luu, dat_dang_luu] = useState(false);

  const [tap_tin_anh_bia, dat_tap_tin_anh_bia] = useState(null);
  const [xem_truoc_anh, dat_xem_truoc_anh] = useState('');
  const [tap_tin_pdf, dat_tap_tin_pdf] = useState(null);
  const [ten_pdf, dat_ten_pdf] = useState('');

  const ref_o_nhap_anh = useRef(null);
  const ref_o_nhap_pdf = useRef(null);

  // Modal xóa
  const [sach_xoa, dat_sach_xoa] = useState(null);
  const [loi_server_xoa, dat_loi_server_xoa] = useState('');
  const [dang_xoa, dat_dang_xoa] = useState(false);

  const tai_danh_muc = useCallback(async () => {
    try {
      const phan_hoi = await api.get('/admin/danh_muc', {
        params: { trang: 1, kich_thuoc: 200 },
      });
      dat_tat_ca_danh_muc(phan_hoi.data.danh_sach || []);
    } catch {
      // không cần báo lỗi riêng
    }
  }, []);

  const tai_danh_sach = useCallback(async (trang, tu_khoa, ma_dm) => {
    dat_dang_tai(true);
    try {
      const phan_hoi = await api.get('/admin/sach', {
        params: {
          tu_khoa: tu_khoa || undefined,
          ma_danh_muc: ma_dm || undefined,
          trang,
          kich_thuoc: KICH_THUOC_TRANG,
        },
      });
      const du_lieu = phan_hoi.data;
      dat_danh_sach(du_lieu.danh_sach || []);
      dat_trang(du_lieu.trang_hien_tai);
      dat_tong_trang(du_lieu.tong_so_trang);
      dat_tong_ban_ghi(du_lieu.tong_so_ban_ghi);
    } catch {
      toast.error('Không thể tải danh sách sách');
    } finally {
      dat_dang_tai(false);
    }
  }, []);

  useEffect(() => {
    tai_danh_muc();
    tai_danh_sach(1, '', '');
  }, [tai_danh_muc, tai_danh_sach]);

  useEffect(() => {
    const id_dem = setTimeout(() => {
      tai_danh_sach(1, tu_khoa_tim, ma_danh_muc_loc);
    }, 400);
    return () => clearTimeout(id_dem);
  }, [tu_khoa_tim, ma_danh_muc_loc, tai_danh_sach]);

  // ── Helpers form ──────────────────────────────────────────────
  function cap_nhat_truong(ten, gia_tri) {
    dat_gia_tri_form(prev => ({ ...prev, [ten]: gia_tri }));
  }

  function kiem_tra_truong(ten, gia_tri) {
    switch (ten) {
      case 'ten_sach':
        if (!gia_tri.trim()) return 'Tên sách không được để trống';
        if (gia_tri.trim().length > 255) return 'Tên sách không được vượt quá 255 ký tự';
        return '';
      case 'tac_gia':
        if (!gia_tri.trim()) return 'Tác giả không được để trống';
        if (gia_tri.trim().length > 150) return 'Tác giả không được vượt quá 150 ký tự';
        return '';
      case 'gia':
        if (gia_tri === '' || gia_tri == null) return 'Giá không được để trống';
        if (isNaN(Number(gia_tri)) || Number(gia_tri) < 0) return 'Giá phải là số không âm';
        return '';
      default:
        return '';
    }
  }

  function xu_ly_chon_anh(e) {
    const tap_tin = e.target.files[0];
    if (!tap_tin) return;
    if (!tap_tin.type.startsWith('image/')) {
      dat_loi_form(prev => ({ ...prev, anh_bia: 'Vui lòng chọn file ảnh (JPG, PNG, ...)' }));
      return;
    }
    dat_tap_tin_anh_bia(tap_tin);
    dat_loi_form(prev => ({ ...prev, anh_bia: '' }));
    const doc = new FileReader();
    doc.onload = ev => dat_xem_truoc_anh(ev.target.result);
    doc.readAsDataURL(tap_tin);
  }

  function xu_ly_chon_pdf(e) {
    const tap_tin = e.target.files[0];
    if (!tap_tin) return;
    if (tap_tin.type !== 'application/pdf') {
      dat_loi_form(prev => ({ ...prev, file_pdf: 'Vui lòng chọn file PDF' }));
      return;
    }
    dat_tap_tin_pdf(tap_tin);
    dat_ten_pdf(tap_tin.name);
    dat_loi_form(prev => ({ ...prev, file_pdf: '' }));
  }

  function bat_tat_danh_muc(ma_dm) {
    dat_gia_tri_form(prev => {
      const ids = prev.danh_muc_ids.includes(ma_dm)
        ? prev.danh_muc_ids.filter(id => id !== ma_dm)
        : [...prev.danh_muc_ids, ma_dm];
      return { ...prev, danh_muc_ids: ids };
    });
  }

  // ── Mở / đóng modal ──────────────────────────────────────────
  function mo_modal_them() {
    dat_dang_sua(null);
    dat_gia_tri_form(GIA_TRI_FORM_MAC_DINH);
    dat_loi_form(LOI_FORM_MAC_DINH);
    dat_loi_server_form('');
    dat_tap_tin_anh_bia(null);
    dat_xem_truoc_anh('');
    dat_tap_tin_pdf(null);
    dat_ten_pdf('');
    dat_hien_form(true);
  }

  function mo_modal_sua(sach) {
    dat_dang_sua(sach);
    dat_gia_tri_form({
      ten_sach: sach.ten_sach,
      tac_gia: sach.tac_gia,
      mo_ta: sach.mo_ta || '',
      gia: sach.gia,
      danh_muc_ids: sach.danh_muc_ids || [],
      cho_phep_doc_thu: sach.cho_phep_doc_thu || false,
      so_trang_doc_thu: sach.so_trang_doc_thu || 5,
    });
    dat_loi_form(LOI_FORM_MAC_DINH);
    dat_loi_server_form('');
    dat_tap_tin_anh_bia(null);
    dat_xem_truoc_anh(sach.anh_bia_url || '');
    dat_tap_tin_pdf(null);
    dat_ten_pdf('');
    dat_hien_form(true);
  }

  function dong_modal_form() {
    dat_hien_form(false);
  }

  // ── Lưu sách ─────────────────────────────────────────────────
  async function xu_ly_luu() {
    dat_loi_server_form('');

    const loi_moi = {
      ten_sach: kiem_tra_truong('ten_sach', gia_tri_form.ten_sach),
      tac_gia: kiem_tra_truong('tac_gia', gia_tri_form.tac_gia),
      gia: kiem_tra_truong('gia', gia_tri_form.gia),
      anh_bia: !dang_sua && !tap_tin_anh_bia ? 'Vui lòng chọn ảnh bìa' : '',
      file_pdf: !dang_sua && !tap_tin_pdf ? 'Vui lòng chọn file PDF' : '',
      danh_muc: '',
    };
    dat_loi_form(loi_moi);

    const co_loi = Object.values(loi_moi).some(v => v !== '');
    if (co_loi) return;

    dat_dang_luu(true);
    try {
      const form_data = new FormData();

      const du_lieu_json = JSON.stringify({
        ten_sach: gia_tri_form.ten_sach.trim(),
        tac_gia: gia_tri_form.tac_gia.trim(),
        mo_ta: gia_tri_form.mo_ta,
        gia: Number(gia_tri_form.gia),
        danh_muc_ids: gia_tri_form.danh_muc_ids,
        cho_phep_doc_thu: gia_tri_form.cho_phep_doc_thu,
        so_trang_doc_thu: Number(gia_tri_form.so_trang_doc_thu) || 5,
      });

      form_data.append('du_lieu', new Blob([du_lieu_json], { type: 'application/json' }));

      if (tap_tin_anh_bia) form_data.append('anh_bia', tap_tin_anh_bia);
      if (tap_tin_pdf) form_data.append('file_pdf', tap_tin_pdf);

      if (dang_sua) {
        if (!tap_tin_anh_bia) {
          form_data.append('anh_bia', new Blob([], { type: 'application/octet-stream' }), '');
        }
        if (!tap_tin_pdf) {
          form_data.append('file_pdf', new Blob([], { type: 'application/octet-stream' }), '');
        }
        await api.put(`/admin/sach/${dang_sua.ma_sach}`, form_data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Cập nhật sách thành công');
      } else {
        await api.post('/admin/sach', form_data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Thêm sách thành công');
      }

      dong_modal_form();
      tai_danh_sach(trang_hien_tai, tu_khoa_tim, ma_danh_muc_loc);
    } catch (loi_api) {
      const thong_bao = loi_api.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại.';
      dat_loi_server_form(thong_bao);
    } finally {
      dat_dang_luu(false);
    }
  }

  // ── Xóa sách ─────────────────────────────────────────────────
  function mo_modal_xoa(sach) {
    dat_sach_xoa(sach);
    dat_loi_server_xoa('');
  }

  function dong_modal_xoa() {
    dat_sach_xoa(null);
  }

  async function xu_ly_xoa() {
    dat_loi_server_xoa('');
    dat_dang_xoa(true);
    try {
      await api.delete(`/admin/sach/${sach_xoa.ma_sach}`);
      toast.success('Xóa sách thành công');
      dong_modal_xoa();
      const trang_moi = danh_sach.length === 1 && trang_hien_tai > 1
        ? trang_hien_tai - 1
        : trang_hien_tai;
      tai_danh_sach(trang_moi, tu_khoa_tim, ma_danh_muc_loc);
    } catch (loi_api) {
      const thong_bao = loi_api.response?.data?.message || 'Không thể xóa sách. Vui lòng thử lại.';
      dat_loi_server_xoa(thong_bao);
    } finally {
      dat_dang_xoa(false);
    }
  }

  // ── Phân trang ────────────────────────────────────────────────
  function tao_mang_so_trang() {
    if (tong_so_trang <= 7) {
      return Array.from({ length: tong_so_trang }, (_, i) => i + 1);
    }
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
      {/* <Header /> */}

      <div className="noi_dung_chinh">
        {/* (1) & (2) Header Toolbar */}
        <div className="thanh_tieu_de_va_nut">
          <h1 className="tieu_de_trang">Quản lý trang sách</h1>
          <div className="nhom_nut_hanh_dong_top">
            <button className="nut_top vang" onClick={mo_modal_them}>Tạo mới</button>
            <button className="nut_top xanh_la">Cập nhật</button>
            <button className="nut_top xanh_duong">Lưu</button>
            <button className="nut_top do">Xóa</button>
            <button className="nut_top xam">Trở về</button>
          </div>
        </div>

        <div className="the_noi_dung">
          {/* (3) & (4) Thanh công cụ bộ lọc */}
          <div className="thanh_bo_loc_chuyen_nghiep">
            <div className="o_nhom_loc">
              <label>Danh mục</label>
              <select
                className="o_loc_danh_muc"
                value={ma_danh_muc_loc}
                onChange={e => dat_ma_dm_loc(e.target.value)}
              >
                <option value="">== Tất cả ==</option>
                {tat_ca_danh_muc.map(dm => (
                  <option key={dm.ma_dm} value={dm.ma_dm}>{dm.ten_danh_muc}</option>
                ))}
              </select>
            </div>
            
            <div className="o_nhom_loc">
              <label>Từ khóa</label>
              <div className="khung_nhap_tim_kiem">
                <input
                  type="text"
                  placeholder="Nhập tên sách, tác giả..."
                  value={tu_khoa_tim}
                  onChange={e => dat_tu_khoa(e.target.value)}
                />
                <button className="nut_bam_tim">Tìm</button>
              </div>
            </div>
          </div>

          {/* (5, 6, 7) Bảng dữ liệu */}
          <div className="khung_bang_tran_vien">
            <table className="bang_du_lieu_chinh">
              <thead>
                <tr>
                  <th style={{ width: '40px' }}><input type="checkbox" /></th>
                  <th style={{ width: '50px' }}>STT</th>
                  <th style={{ width: '70px' }}>Bìa</th>
                  <th>Tên sách</th>
                  <th style={{ width: '150px' }}>Tác giả</th>
                  <th style={{ width: '150px' }}>Danh mục</th>
                  <th style={{ width: '80px' }}>Số lượng</th>
                  <th style={{ width: '110px' }}>Giá</th>
                  <th>Mô tả</th>
                  <th style={{ width: '110px' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {dang_tai ? (
                  <tr><td colSpan={10} className="hang_trong">Đang tải...</td></tr>
                ) : danh_sach.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="hang_trong">
                      {tu_khoa_tim || ma_danh_muc_loc ? 'Không tìm thấy sách phù hợp' : 'Chưa có sách nào'}
                    </td>
                  </tr>
                ) : (
                  danh_sach.map((sach, idx) => (
                    <tr key={sach.ma_sach}>
                      <td><input type="checkbox" /></td>
                      <td className="text_center">{chi_so_bat_dau + idx}</td>
                      <td>
                        {sach.anh_bia_url 
                          ? <img src={sach.anh_bia_url} alt={sach.ten_sach} className="anh_bia_thu_nho" />
                          : <div className="anh_bia_trong">?</div>
                        }
                      </td>
                      <td className="text_left font_bold">{sach.ten_sach}</td>
                      <td className="text_left">{sach.tac_gia}</td>
                      <td>
                        <div className="nhom_nhan_danh_muc">
                          {(sach.ten_danh_muc || []).slice(0, 1).map((ten, i) => (
                            <span key={i} className="nhan_danh_muc">{ten}</span>
                          ))}
                        </div>
                      </td>
                      <td className="text_center">100</td>
                      <td className="text_right">{dinh_dang_gia(sach.gia)}</td>
                      <td className="text_left text_truncate" title={sach.mo_ta}>{sach.mo_ta}</td>
                      <td>
                        <div className="nhom_nut_icon_action">
                          <div className={`nut_switch ${sach.gia > 0 ? 'active' : ''}`}></div>
                          <button className="nut_icon_action edit" onClick={() => mo_modal_sua(sach)}>🔄</button>
                          <button className="nut_icon_action delete" onClick={() => mo_modal_xoa(sach)}>🗑️</button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* (8, 9) Thanh phân trang đẹp hơn */}
          <div className="thanh_footer_table">
            <div className="phan_hien_thi_trai">
              <span>Hiển thị</span>
              <select className="select_small_custom">
                <option value="20">20</option>
                <option value="50">50</option>
              </select>
              <span className="thong_tin_ban_ghi">
                Từ {chi_so_bat_dau} đến {Math.min(chi_so_bat_dau + KICH_THUOC_TRANG - 1, tong_ban_ghi)} trong <strong>{tong_ban_ghi}</strong> sách
              </span>
            </div>

            <div className="cum_phan_trang_phai">
              <button 
                className="nut_dieu_huong_nho"
                onClick={() => tai_danh_sach(trang_hien_tai - 1, tu_khoa_tim, ma_danh_muc_loc)}
                disabled={trang_hien_tai <= 1}
              >
                &lt;
              </button>
              
              <div className="danh_sach_so">
                {cac_so_trang.map((so, idx) => {
                  const trang_truoc = cac_so_trang[idx - 1];
                  return (
                    <span key={so} className="cum_so_trang">
                      {trang_truoc && so - trang_truoc > 1 && <span className="dau_ba_cham">...</span>}
                      <button
                        className={`nut_so_trang_nho ${so === trang_hien_tai ? 'active' : ''}`}
                        onClick={() => tai_danh_sach(so, tu_khoa_tim, ma_danh_muc_loc)}
                      >
                        {so}
                      </button>
                    </span>
                  );
                })}
              </div>

              <button 
                className="nut_dieu_huong_nho"
                onClick={() => tai_danh_sach(trang_hien_tai + 1, tu_khoa_tim, ma_danh_muc_loc)}
                disabled={trang_hien_tai >= tong_so_trang}
              >
                &gt;
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── GIỮ NGUYÊN TOÀN BỘ LOGIC MODAL CỦA BẠN DƯỚI ĐÂY ── */}
      {hien_modal_form && (
        <div className="nen_modal" onClick={e => e.target === e.currentTarget && dong_modal_form()}>
          <div className="hop_modal hop_modal_lon">
            <h2 className="tieu_de_modal">{dang_sua ? 'Sửa thông tin sách' : 'Thêm sách mới'}</h2>
            {loi_server_form && <div className="thong_bao_server_modal">{loi_server_form}</div>}
            <div className="luoi_form_sach">
              <div className="cot_form">
                <div className="nhom_truong_modal">
                  <label className="nhan_truong_modal">Tên sách <span className="dau_bat_buoc">*</span></label>
                  <input
                    type="text"
                    className={`o_nhap_modal${loi_form.ten_sach ? ' loi' : ''}`}
                    value={gia_tri_form.ten_sach}
                    onChange={e => {
                      cap_nhat_truong('ten_sach', e.target.value);
                      dat_loi_form(prev => ({ ...prev, ten_sach: kiem_tra_truong('ten_sach', e.target.value) }));
                    }}
                    placeholder="Nhập tên sách"
                  />
                  <span className="thong_bao_loi_modal">{loi_form.ten_sach}</span>
                </div>
                <div className="nhom_truong_modal">
                  <label className="nhan_truong_modal">Tác giả <span className="dau_bat_buoc">*</span></label>
                  <input
                    type="text"
                    className={`o_nhap_modal${loi_form.tac_gia ? ' loi' : ''}`}
                    value={gia_tri_form.tac_gia}
                    onChange={e => {
                      cap_nhat_truong('tac_gia', e.target.value);
                      dat_loi_form(prev => ({ ...prev, tac_gia: kiem_tra_truong('tac_gia', e.target.value) }));
                    }}
                    placeholder="Nhập tên tác giả"
                  />
                  <span className="thong_bao_loi_modal">{loi_form.tac_gia}</span>
                </div>
                <div className="nhom_truong_modal">
                  <label className="nhan_truong_modal">Giá (VNĐ) <span className="dau_bat_buoc">*</span></label>
                  <input
                    type="number"
                    className={`o_nhap_modal${loi_form.gia ? ' loi' : ''}`}
                    value={gia_tri_form.gia}
                    onChange={e => {
                      cap_nhat_truong('gia', e.target.value);
                      dat_loi_form(prev => ({ ...prev, gia: kiem_tra_truong('gia', e.target.value) }));
                    }}
                  />
                </div>
                <div className="nhom_truong_modal">
                  <label className="nhan_truong_modal">Mô tả</label>
                  <textarea
                    className="o_mo_ta_modal"
                    value={gia_tri_form.mo_ta}
                    onChange={e => cap_nhat_truong('mo_ta', e.target.value)}
                    rows={4}
                  />
                </div>
              </div>
              <div className="cot_form">
                <div className="nhom_truong_modal">
                  <label className="nhan_truong_modal">Ảnh bìa</label>
                  <div className="khung_chon_tap_tin" onClick={() => ref_o_nhap_anh.current?.click()}>
                    {xem_truoc_anh ? <img src={xem_truoc_anh} className="xem_truoc_anh_bia" /> : "Chọn ảnh"}
                  </div>
                  <input ref={ref_o_nhap_anh} type="file" accept="image/*" style={{ display: 'none' }} onChange={xu_ly_chon_anh} />
                </div>
                <div className="nhom_truong_modal">
                  <label className="nhan_truong_modal">File PDF</label>
                  <div className="khung_chon_tap_tin" onClick={() => ref_o_nhap_pdf.current?.click()}>
                    {tap_tin_pdf ? ten_pdf : "Chọn file PDF"}
                  </div>
                  <input ref={ref_o_nhap_pdf} type="file" accept="application/pdf" style={{ display: 'none' }} onChange={xu_ly_chon_pdf} />
                </div>
              </div>
            </div>
            <div className="nhom_nut_modal">
              <button className="nut_huy" onClick={dong_modal_form} disabled={dang_luu}>Hủy</button>
              <button className="nut_luu" onClick={xu_ly_luu} disabled={dang_luu}>{dang_luu ? 'Đang lưu...' : 'Lưu'}</button>
            </div>
          </div>
        </div>
      )}

      {sach_xoa && (
        <div className="nen_modal" onClick={e => e.target === e.currentTarget && dong_modal_xoa()}>
          <div className="hop_modal">
            <h2 className="tieu_de_modal">Xác nhận xóa</h2>
            <p className="noi_dung_modal_xoa">Bạn có chắc muốn xóa <b>"{sach_xoa.ten_sach}"</b>?</p>
            <div className="nhom_nut_modal">
              <button className="nut_huy" onClick={dong_modal_xoa}>Không</button>
              <button className="nut_xoa_xac_nhan" onClick={xu_ly_xoa} disabled={dang_xoa}>Xóa</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
