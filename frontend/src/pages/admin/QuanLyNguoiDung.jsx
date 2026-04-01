import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../services/api';
import './QuanLyNguoiDung.css';

const KICH_THUOC_TRANG = 10;

export default function QuanLyNguoiDung() {
  const navigate = useNavigate();

  // Bộ lọc & tìm kiếm
  const [tu_khoa_tim, dat_tu_khoa_tim] = useState('');
  const [vai_tro_loc, dat_vai_tro_loc] = useState('');
  const [trang_thai_loc, dat_trang_thai_loc] = useState('');
  const [trang_hien_tai, dat_trang_hien_tai] = useState(1);

  // State quản lý dữ liệu thay thế cho useQuery
  const [danh_sach, dat_danh_sach] = useState([]);
  const [tong_so_trang, dat_tong_so_trang] = useState(1);
  const [tong_ban_ghi, dat_tong_ban_ghi] = useState(0);
  const [dang_tai, dat_dang_tai] = useState(true);

  // Modal xác nhận khóa/mở khóa
  const [nguoi_dung_khoa, dat_nguoi_dung_khoa] = useState(null);
  const [dang_xu_ly, dat_dang_xu_ly] = useState(false);

  // Hàm gọi API lấy danh sách người dùng
  const layDanhSachNguoiDung = useCallback(async () => {
    dat_dang_tai(true);
    try {
      const phan_hoi = await api.get('/admin/nguoi_dung', {
        params: {
          tu_khoa: tu_khoa_tim || undefined,
          vai_tro: vai_tro_loc || undefined,
          trang_thai: trang_thai_loc || undefined,
          trang: trang_hien_tai,
          kich_thuoc: KICH_THUOC_TRANG,
        },
      });
      
      dat_danh_sach(phan_hoi.data.danh_sach || []);
      dat_tong_so_trang(phan_hoi.data.tong_so_trang || 1);
      dat_tong_ban_ghi(phan_hoi.data.tong_so_ban_ghi || 0);
    } catch (loi) {
      console.error('Lỗi khi lấy danh sách người dùng:', loi);
      toast.error('Không thể tải danh sách người dùng');
    } finally {
      dat_dang_tai(false);
    }
  }, [tu_khoa_tim, vai_tro_loc, trang_thai_loc, trang_hien_tai]);

  // Debounce reset trang về 1 khi thay đổi bộ lọc
  useEffect(() => {
    const id_dem = setTimeout(() => {
      dat_trang_hien_tai(1);
    }, 400);
    return () => clearTimeout(id_dem);
  }, [tu_khoa_tim, vai_tro_loc, trang_thai_loc]);

  // Gọi API mỗi khi filter hoặc trang thay đổi
  useEffect(() => {
    // Thêm một chút delay (debounce) để tránh gọi API liên tục khi gõ tìm kiếm
    const id_tim_kiem = setTimeout(() => {
      layDanhSachNguoiDung();
    }, 400);
    return () => clearTimeout(id_tim_kiem);
  }, [layDanhSachNguoiDung]);

  // Hàm thay thế cho useMutation — khóa/mở khóa
  const thuc_hien_khoa_mo = async (ma_nd) => {
    dat_dang_xu_ly(true);
    try {
      const phan_hoi = await api.put(`/admin/nguoi_dung/${ma_nd}/khoa_mo`);
      toast.success(phan_hoi.data.message);
      dat_nguoi_dung_khoa(null);
      // Gọi lại hàm lấy danh sách để cập nhật dữ liệu mới nhất (Giống invalidateQueries)
      layDanhSachNguoiDung(); 
    } catch (loi) {
      const thong_bao = loi.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại.';
      toast.error(thong_bao);
    } finally {
      dat_dang_xu_ly(false);
    }
  };

  function mo_modal_khoa_mo(nguoi_dung) {
    dat_nguoi_dung_khoa(nguoi_dung);
    dat_dang_xu_ly(false);
  }

  function dong_modal_khoa_mo() {
    dat_nguoi_dung_khoa(null);
  }

  function xu_ly_khoa_mo() {
    if (nguoi_dung_khoa) {
      thuc_hien_khoa_mo(nguoi_dung_khoa.ma_nguoi_dung);
    }
  }

  // Phân trang
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

  function thay_doi_trang(so_trang) {
    dat_trang_hien_tai(so_trang);
  }

  function dinh_dang_ngay(ngay_str) {
    if (!ngay_str) return '—';
    return new Date(ngay_str).toLocaleDateString('vi-VN');
  }

  return (
    <div className="trang_quan_ly">
      <div className="noi_dung_chinh">
        <h1 className="tieu_de_trang">Quản lý người dùng</h1>

        <div className="the_noi_dung">
          {/* Thanh công cụ */}
          <div className="thanh_cong_cu">
            <div className="nhom_bo_loc">
              <input
                type="text"
                className="o_tim_kiem"
                placeholder="Tìm theo tên, email..."
                value={tu_khoa_tim}
                onChange={e => dat_tu_khoa_tim(e.target.value)}
              />
              <select
                className="o_loc_danh_muc"
                value={vai_tro_loc}
                onChange={e => dat_vai_tro_loc(e.target.value)}
              >
                <option value="">Tất cả vai trò</option>
                <option value="thanh_vien">Thành viên</option>
                <option value="quan_tri">Quản trị viên</option>
              </select>
              <select
                className="o_loc_danh_muc"
                value={trang_thai_loc}
                onChange={e => dat_trang_thai_loc(e.target.value)}
              >
                <option value="">Tất cả trạng thái</option>
                <option value="hoat_dong">Hoạt động</option>
                <option value="khoa">Bị khóa</option>
              </select>
            </div>
          </div>

          {/* Bảng dữ liệu */}
          <div className="khung_bang">
            <table className="bang_du_lieu">
              <thead>
                <tr>
                  <th style={{ width: '60px' }}>ID</th>
                  <th>Họ tên</th>
                  <th style={{ width: '200px' }}>Email</th>
                  <th style={{ width: '140px' }}>Số ĐT</th>
                  <th style={{ width: '120px' }}>Vai trò</th>
                  <th style={{ width: '110px' }}>Trạng thái</th>
                  <th style={{ width: '130px' }}>Ngày đăng ký</th>
                  <th style={{ width: '160px' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {dang_tai ? (
                  Array.from({ length: KICH_THUOC_TRANG }).map((_, i) => (
                    <tr key={i} className="hang_skeleton">
                      <td><div className="o_skeleton o_skeleton_nho" /></td>
                      <td><div className="o_skeleton" /></td>
                      <td><div className="o_skeleton o_skeleton_vua" /></td>
                      <td><div className="o_skeleton o_skeleton_nho" /></td>
                      <td><div className="o_skeleton o_skeleton_nho" /></td>
                      <td><div className="o_skeleton o_skeleton_nho" /></td>
                      <td><div className="o_skeleton o_skeleton_nho" /></td>
                      <td><div className="o_skeleton o_skeleton_vua" /></td>
                    </tr>
                  ))
                ) : danh_sach.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="hang_trong">
                      {tu_khoa_tim || vai_tro_loc || trang_thai_loc ? 'Không tìm thấy người dùng phù hợp' : 'Chưa có người dùng nào'}
                    </td>
                  </tr>
                ) : (
                  danh_sach.map((nd) => (
                    <tr key={nd.ma_nguoi_dung}>
                      <td>{nd.ma_nguoi_dung}</td>
                      <td title={nd.ho_ten}>{nd.ho_ten}</td>
                      <td>{nd.email}</td>
                      <td>{nd.so_dien_thoai || '—'}</td>
                      <td>
                        <span className={`nhan_vai_tro ${nd.vai_tro}`}>
                          {nd.vai_tro === 'thanh_vien' ? 'Thành viên' : 'Quản trị viên'}
                        </span>
                      </td>
                      <td>
                        <span className={`nhan_trang_thai ${nd.trang_thai}`}>
                          {nd.trang_thai === 'hoat_dong' ? 'Hoạt động' : 'Bị khóa'}
                        </span>
                      </td>
                      <td>{dinh_dang_ngay(nd.ngay_tao)}</td>
                      <td>
                        <div className="nhom_nut_thao_tac">
                          <button 
                            className="nut_xem" 
                            onClick={() => navigate(`/quan_tri/nguoi_dung/${nd.ma_nguoi_dung}`)}
                          >
                            Xem
                          </button>
                          {nd.vai_tro !== 'quan_tri' && (
                            <button
                              className={nd.trang_thai === 'hoat_dong' ? 'nut_khoa' : 'nut_mo_khoa'}
                              onClick={() => mo_modal_khoa_mo(nd)}
                            >
                              {nd.trang_thai === 'hoat_dong' ? 'Khóa' : 'Mở khóa'}
                            </button>
                          )}
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
                Hiển thị {chi_so_bat_dau}–{Math.min(chi_so_bat_dau + KICH_THUOC_TRANG - 1, tong_ban_ghi)} / {tong_ban_ghi} người dùng
              </span>
              <div className="nhom_nut_trang">
                <button
                  className="nut_trang"
                  onClick={() => thay_doi_trang(trang_hien_tai - 1)}
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
                        onClick={() => thay_doi_trang(so)}
                      >
                        {so}
                      </button>
                    </span>
                  );
                })}
                <button
                  className="nut_trang"
                  onClick={() => thay_doi_trang(trang_hien_tai + 1)}
                  disabled={trang_hien_tai >= tong_so_trang}
                >
                  ›
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal xác nhận khóa/mở khóa */}
      {nguoi_dung_khoa && (
        <div className="nen_modal" onClick={e => e.target === e.currentTarget && dong_modal_khoa_mo()}>
          <div className="hop_modal">
            <h2 className="tieu_de_modal">
              {nguoi_dung_khoa.trang_thai === 'hoat_dong' ? 'Xác nhận khóa tài khoản' : 'Xác nhận mở khóa tài khoản'}
            </h2>
            <p className="noi_dung_modal_xoa">
              Bạn có chắc chắn muốn {nguoi_dung_khoa.trang_thai === 'hoat_dong' ? 'khóa' : 'mở khóa'} tài khoản{' '}
              <span className="ten_xoa_noi_bat">"{nguoi_dung_khoa.ho_ten}" ({nguoi_dung_khoa.email})</span> không?
            </p>
            <div className="nhom_nut_modal">
              <button 
                className="nut_huy" 
                onClick={dong_modal_khoa_mo} 
                disabled={dang_xu_ly}
              >
                Hủy
              </button>
              <button
                className={nguoi_dung_khoa.trang_thai === 'hoat_dong' ? "nut_xoa_xac_nhan" : "nut_luu"}
                onClick={xu_ly_khoa_mo}
                disabled={dang_xu_ly}
              >
                {dang_xu_ly ? 'Đang xử lý...' : (nguoi_dung_khoa.trang_thai === 'hoat_dong' ? 'Có, khóa' : 'Có, mở khóa')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}