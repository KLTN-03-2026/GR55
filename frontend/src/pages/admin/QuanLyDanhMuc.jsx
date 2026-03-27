import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import api from '../../services/api';
import Header from '../../components/Header';
import './QuanLyDanhMuc.css';

const KICH_THUOC_TRANG = 10;

const TEN_QUY_TAC = {
  regex: /^[\p{L}0-9 ,\-&./()]+$/u,
  thong_bao: 'Tên danh mục chỉ được chứa chữ cái, số và các ký tự: , - & . / ( )',
};

function dinh_dang_ngay(chuoi_ngay) {
  if (!chuoi_ngay) return '—';
  const ngay = new Date(chuoi_ngay);
  return ngay.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export default function QuanLyDanhMuc() {
  const [danh_sach, dat_danh_sach] = useState([]);
  const [trang_hien_tai, dat_trang] = useState(1);
  const [tong_so_trang, dat_tong_trang] = useState(1);
  const [tong_ban_ghi, dat_tong_ban_ghi] = useState(0);
  const [tu_khoa_tim, dat_tu_khoa] = useState('');
  const [dang_tai, dat_dang_tai] = useState(false);

  // Modal thêm/sửa
  const [hien_modal_form, dat_hien_form] = useState(false);
  const [dang_sua, dat_dang_sua] = useState(null); // null = thêm mới, object = sửa
  const [ten_nhap, dat_ten_nhap] = useState('');
  const [loi_ten, dat_loi_ten] = useState('');
  const [loi_server_form, dat_loi_server_form] = useState('');
  const [dang_luu, dat_dang_luu] = useState(false);

  // Modal xóa
  const [danh_muc_xoa, dat_danh_muc_xoa] = useState(null);
  const [loi_server_xoa, dat_loi_server_xoa] = useState('');
  const [dang_xoa, dat_dang_xoa] = useState(false);

  const tai_danh_sach = useCallback(async (trang, tu_khoa) => {
    dat_dang_tai(true);
    try {
      const phan_hoi = await api.get('/admin/danh_muc', {
        params: { tim_kiem: tu_khoa || undefined, trang, kich_thuoc: KICH_THUOC_TRANG },
      });
      const du_lieu = phan_hoi.data;
      dat_danh_sach(du_lieu.danh_sach || []);
      dat_trang(du_lieu.trang_hien_tai);
      dat_tong_trang(du_lieu.tong_so_trang);
      dat_tong_ban_ghi(du_lieu.tong_so_ban_ghi);
    } catch {
      toast.error('Không thể tải danh sách danh mục');
    } finally {
      dat_dang_tai(false);
    }
  }, []);

  useEffect(() => {
    tai_danh_sach(1, '');
  }, [tai_danh_sach]);

  // Tìm kiếm với debounce
  useEffect(() => {
    const id_dem = setTimeout(() => {
      tai_danh_sach(1, tu_khoa_tim);
    }, 400);
    return () => clearTimeout(id_dem);
  }, [tu_khoa_tim, tai_danh_sach]);

  function mo_modal_them() {
    dat_dang_sua(null);
    dat_ten_nhap('');
    dat_loi_ten('');
    dat_loi_server_form('');
    dat_hien_form(true);
  }

  function mo_modal_sua(danh_muc) {
    dat_dang_sua(danh_muc);
    dat_ten_nhap(danh_muc.ten_danh_muc);
    dat_loi_ten('');
    dat_loi_server_form('');
    dat_hien_form(true);
  }

  function dong_modal_form() {
    dat_hien_form(false);
  }

  function kiem_tra_ten(gia_tri) {
    if (!gia_tri.trim()) return 'Tên danh mục không được để trống';
    if (!TEN_QUY_TAC.regex.test(gia_tri.trim())) return TEN_QUY_TAC.thong_bao;
    if (gia_tri.trim().length > 100) return 'Tên danh mục không được vượt quá 100 ký tự';
    return '';
  }

  async function xu_ly_luu() {
    dat_loi_server_form('');
    const loi = kiem_tra_ten(ten_nhap);
    if (loi) { dat_loi_ten(loi); return; }

    dat_dang_luu(true);
    try {
      if (dang_sua) {
        await api.put(`/admin/danh_muc/${dang_sua.ma_dm}`, { ten_danh_muc: ten_nhap.trim() });
        toast.success('Cập nhật danh mục thành công');
      } else {
        await api.post('/admin/danh_muc', { ten_danh_muc: ten_nhap.trim() });
        toast.success('Thêm danh mục thành công');
      }
      dong_modal_form();
      tai_danh_sach(trang_hien_tai, tu_khoa_tim);
    } catch (loi_api) {
      const thong_bao = loi_api.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại.';
      dat_loi_server_form(thong_bao);
    } finally {
      dat_dang_luu(false);
    }
  }

  function mo_modal_xoa(danh_muc) {
    dat_danh_muc_xoa(danh_muc);
    dat_loi_server_xoa('');
  }

  function dong_modal_xoa() {
    dat_danh_muc_xoa(null);
  }

  async function xu_ly_xoa() {
    dat_loi_server_xoa('');
    dat_dang_xoa(true);
    try {
      await api.delete(`/admin/danh_muc/${danh_muc_xoa.ma_dm}`);
      toast.success('Xóa danh mục thành công');
      dong_modal_xoa();
      const trang_moi = danh_sach.length === 1 && trang_hien_tai > 1
        ? trang_hien_tai - 1
        : trang_hien_tai;
      tai_danh_sach(trang_moi, tu_khoa_tim);
    } catch (loi_api) {
      const thong_bao = loi_api.response?.data?.message || 'Không thể xóa danh mục. Vui lòng thử lại.';
      dat_loi_server_xoa(thong_bao);
    } finally {
      dat_dang_xoa(false);
    }
  }

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
      <Header />

      <div className="noi_dung_chinh">
        <h1 className="tieu_de_trang">Quản lý danh mục sách</h1>

        <div className="the_noi_dung">
          {/* Thanh công cụ */}
          <div className="thanh_cong_cu">
            <input
              type="text"
              className="o_tim_kiem"
              placeholder="Tìm kiếm theo tên danh mục..."
              value={tu_khoa_tim}
              onChange={e => dat_tu_khoa(e.target.value)}
            />
            <button className="nut_them_moi" onClick={mo_modal_them}>
              + Thêm danh mục mới
            </button>
          </div>

          {/* Bảng dữ liệu */}
          <div className="khung_bang">
            <table className="bang_du_lieu">
              <thead>
                <tr>
                  <th style={{ width: '60px' }}>STT</th>
                  <th>Tên danh mục</th>
                  <th style={{ width: '140px' }}>Số lượng sách</th>
                  <th style={{ width: '140px' }}>Ngày tạo</th>
                  <th style={{ width: '140px' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {dang_tai ? (
                  <tr>
                    <td colSpan={5} className="hang_trong">Đang tải...</td>
                  </tr>
                ) : danh_sach.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="hang_trong">
                      {tu_khoa_tim ? 'Không tìm thấy danh mục phù hợp' : 'Chưa có danh mục nào'}
                    </td>
                  </tr>
                ) : (
                  danh_sach.map((dm, idx) => (
                    <tr key={dm.ma_dm}>
                      <td>{chi_so_bat_dau + idx}</td>
                      <td style={{ fontWeight: 500 }}>{dm.ten_danh_muc}</td>
                      <td>
                        <span className="nhan_so_luong">{dm.so_luong_sach}</span>
                      </td>
                      <td>{dinh_dang_ngay(dm.ngay_tao)}</td>
                      <td>
                        <div className="nhom_nut_thao_tac">
                          <button className="nut_sua" onClick={() => mo_modal_sua(dm)}>Sửa</button>
                          <button className="nut_xoa" onClick={() => mo_modal_xoa(dm)}>Xóa</button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Phân trang */}
          {tong_ban_ghi > 0 && (
            <div className="phan_trang">
              <span className="thong_tin_phan_trang">
                Hiển thị {chi_so_bat_dau}–{Math.min(chi_so_bat_dau + KICH_THUOC_TRANG - 1, tong_ban_ghi)} / {tong_ban_ghi} danh mục
              </span>
              <div className="nhom_nut_trang">
                <button
                  className="nut_trang"
                  onClick={() => tai_danh_sach(trang_hien_tai - 1, tu_khoa_tim)}
                  disabled={trang_hien_tai <= 1}
                >
                  ‹
                </button>
                {cac_so_trang.map((so, idx) => {
                  const trang_truoc = cac_so_trang[idx - 1];
                  return (
                    <span key={so}>
                      {trang_truoc && so - trang_truoc > 1 && (
                        <span style={{ padding: '0 4px', color: '#9ca3af' }}>…</span>
                      )}
                      <button
                        className={`nut_trang${so === trang_hien_tai ? ' hien_tai' : ''}`}
                        onClick={() => tai_danh_sach(so, tu_khoa_tim)}
                      >
                        {so}
                      </button>
                    </span>
                  );
                })}
                <button
                  className="nut_trang"
                  onClick={() => tai_danh_sach(trang_hien_tai + 1, tu_khoa_tim)}
                  disabled={trang_hien_tai >= tong_so_trang}
                >
                  ›
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal thêm / sửa */}
      {hien_modal_form && (
        <div className="nen_modal" onClick={e => e.target === e.currentTarget && dong_modal_form()}>
          <div className="hop_modal">
            <h2 className="tieu_de_modal">
              {dang_sua ? 'Sửa danh mục' : 'Thêm danh mục mới'}
            </h2>

            {loi_server_form && (
              <div className="thong_bao_server_modal">{loi_server_form}</div>
            )}

            <div className="nhom_truong_modal">
              <label className="nhan_truong_modal" htmlFor="ten_danh_muc_nhap">
                Tên danh mục
              </label>
              <input
                id="ten_danh_muc_nhap"
                type="text"
                className={`o_nhap_modal${loi_ten ? ' loi' : ''}`}
                value={ten_nhap}
                onChange={e => {
                  dat_ten_nhap(e.target.value);
                  dat_loi_ten(kiem_tra_ten(e.target.value));
                }}
                placeholder="Nhập tên danh mục"
                autoFocus
                maxLength={100}
              />
              <span className="thong_bao_loi_modal">{loi_ten || ''}</span>
            </div>

            <div className="nhom_nut_modal">
              <button className="nut_huy" onClick={dong_modal_form} disabled={dang_luu}>
                Hủy
              </button>
              <button className="nut_luu" onClick={xu_ly_luu} disabled={dang_luu}>
                {dang_luu ? 'Đang lưu...' : 'Lưu'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal xác nhận xóa */}
      {danh_muc_xoa && (
        <div className="nen_modal" onClick={e => e.target === e.currentTarget && dong_modal_xoa()}>
          <div className="hop_modal">
            <h2 className="tieu_de_modal">Xác nhận xóa</h2>

            <p className="noi_dung_modal_xoa">
              Bạn có chắc chắn muốn xóa danh mục{' '}
              <span className="ten_xoa_noi_bat">"{danh_muc_xoa.ten_danh_muc}"</span> không?
            </p>

            {loi_server_xoa && (
              <p className="canh_bao_xoa">{loi_server_xoa}</p>
            )}

            <div className="nhom_nut_modal">
              <button className="nut_huy" onClick={dong_modal_xoa} disabled={dang_xoa}>
                Không
              </button>
              <button className="nut_xoa_xac_nhan" onClick={xu_ly_xoa} disabled={dang_xoa}>
                {dang_xoa ? 'Đang xóa...' : 'Có, xóa'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
