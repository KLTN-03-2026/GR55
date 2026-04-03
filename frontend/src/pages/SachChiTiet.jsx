import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';                   
import { dinh_dang_gia } from '../utils/dinh_dang';
import TheCardSach from '../components/TheCardSach';
import './SachChiTiet.css';

const MO_TA_NGAN = 300; // Số ký tự tối đa trước khi cắt ngắn

export default function SachChiTiet() {
  const { ma_sach } = useParams();
  const dieu_huong = useNavigate();
  const { da_dang_nhap, nguoiDung } = useAuth();
  const queryClient = useQueryClient();

  const [dang_xu_ly_yeu_thich, dat_dang_xu_ly_yeu_thich] = useState(false);
  const [hien_mo_ta_day_du, dat_hien_mo_ta_day_du] = useState(false);

  // Cuộn lên đầu khi chuyển sách
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [ma_sach]);

  // React Query — Lấy chi tiết sách
  const {
    data: chi_tiet,
    isLoading: dang_tai,
    isError: co_loi,
  } = useQuery({
    queryKey: ['chi_tiet_sach', ma_sach, nguoiDung?.ma_nguoi_dung ?? null],
    queryFn: async () => {
      const phan_hoi = await api.get(`/sach/${ma_sach}`, {
        headers: da_dang_nhap ? { 'X-User-Id': nguoiDung?.ma_nguoi_dung } : {},
      });
      return phan_hoi.data.du_lieu;
    },
    staleTime: 10 * 60 * 1000, // 10 phút
    enabled: !!ma_sach,
  });

  // React Query — Lấy sách liên quan
  const { 
    data: sach_lien_quan, 
    isLoading: dang_tai_lien_quan 
  } = useQuery({
    queryKey: ['sach_lien_quan', ma_sach, 1, 8],
    queryFn: async () => {
      const phan_hoi = await api.get(`/sach/${ma_sach}/lien_quan`, {
        params: { trang: 1, kich_thuoc: 8 },
      });
      return phan_hoi.data;
    },
    staleTime: 30 * 60 * 1000,
    enabled: !!ma_sach,
  });

  // Xử lý nút yêu thích
  async function xu_ly_yeu_thich() {
    if (!da_dang_nhap) {
      toast.info('Vui lòng đăng nhập để thêm vào yêu thích');
      dieu_huong('/dang_nhap');
      return;
    }
    dat_dang_xu_ly_yeu_thich(true);
    try {
      // TODO: gọi API yêu thích khi backend mở endpoint
      // await api.post(`/sach/${ma_sach}/yeu_thich`);
      
      // Giả lập delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast.success(chi_tiet.da_yeu_thich ? 'Đã bỏ yêu thích' : 'Đã thêm vào yêu thích');
      queryClient.invalidateQueries({ queryKey: ['chi_tiet_sach', ma_sach] });
    } catch {
      toast.error('Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      dat_dang_xu_ly_yeu_thich(false);
    }
  }

  // Xác định nút hành động cần render
  function xac_dinh_nut_hanh_dong(sach) {
    const mien_phi = Number(sach.gia) === 0;
    const { da_mua, la_hoi_vien, sach_thuoc_goi_hoi_vien } = sach;

    if (mien_phi) return 'doc_ngay';
    if (da_mua || (la_hoi_vien && sach_thuoc_goi_hoi_vien)) return 'doc_sach';
    if (sach_thuoc_goi_hoi_vien && !la_hoi_vien) return 'nang_cap_hoi_vien';
    return 'mua_ngay';
  }

  if (dang_tai) {
    return (
      <div className="trang_chi_tiet_sach">
        <div className="khung_chi_tiet_chinh">
          <div className="cot_anh_bia">
            <div className="skeleton_anh_bia_lon" />
          </div>
          <div className="cot_thong_tin">
            {[80, 50, 120, 60, 200, 100].map((w, i) => (
              <div 
                key={i} 
                className="o_skeleton" 
                style={{ width: `${w}%`, height: i === 4 ? 80 : 20, marginBottom: 12 }} 
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (co_loi || !chi_tiet) {
    return (
      <div className="trang_loi">
        <p>Không thể tải thông tin sách. Sách có thể không tồn tại.</p>
        <button className="nut_chinh nut_doc_sach" onClick={() => dieu_huong(-1)}>Quay lại</button>
      </div>
    );
  }

  const loai_nut = xac_dinh_nut_hanh_dong(chi_tiet);

  return (
    <div className="trang_chi_tiet_sach">
      
      {/* === Khu vực chi tiết chính === */}
      <div className="khung_chi_tiet_chinh">
        {/* Cột trái: ảnh bìa */}
        <div className="cot_anh_bia">
          <div className="khung_anh_bia_lon">
            <img src={chi_tiet.anh_bia_url} alt={chi_tiet.ten_sach} className="anh_bia_lon" />
          </div>
          {da_dang_nhap && (
            <button
              className={`nut_yeu_thich ${chi_tiet.da_yeu_thich ? 'da_yeu_thich' : ''}`}
              onClick={xu_ly_yeu_thich}
              disabled={dang_xu_ly_yeu_thich}
            >
              {chi_tiet.da_yeu_thich ? '♥ Đã yêu thích' : '♡ Yêu thích'}
            </button>
          )}
        </div>

        {/* Cột phải: thông tin + nút hành động */}
        <div className="cot_thong_tin">
          <div className="nhom_badge_danh_muc">
            {chi_tiet.danh_sach_danh_muc?.map((dm, index) => (
              <span key={index} className="badge_danh_muc">{dm}</span>
            ))}
          </div>
          
          <h1 className="ten_sach_chi_tiet">{chi_tiet.ten_sach}</h1>
          <p className="tac_gia_chi_tiet">Tác giả: {chi_tiet.tac_gia}</p>
          
          <div className="khung_danh_gia_ngan">
            <span className="sao_danh_gia">★</span>
            <span className="diem_so">{chi_tiet.danh_gia_trung_binh?.toFixed(1) || '0.0'}</span>
            <span className="so_luot_ngan">({chi_tiet.so_luot_danh_gia || 0} đánh giá)</span>
            <span>•</span>
            <span className="luot_xem_ngan">{chi_tiet.luot_xem || 0} lượt xem</span>
          </div>

          <div className="khung_gia">
            {Number(chi_tiet.gia) === 0 ? (
              <span className="gia_mien_phi">Miễn phí</span>
            ) : chi_tiet.gia_giam ? (
              <>
                <span className="gia_goc_gach_chan">{dinh_dang_gia(chi_tiet.gia)}</span>
                <span className="gia_sau_giam">{dinh_dang_gia(chi_tiet.gia_giam)}</span>
              </>
            ) : (
              <span className="gia_chinh">{dinh_dang_gia(chi_tiet.gia)}</span>
            )}
          </div>

          <div className="khung_mo_ta">
            <p className={`mo_ta_sach ${!hien_mo_ta_day_du ? 'mo_ta_rut_gon' : ''}`}>
              {chi_tiet.mo_ta}
            </p>
            {(chi_tiet.mo_ta?.length || 0) > MO_TA_NGAN && (
              <button className="nut_xem_mo_ta" onClick={() => dat_hien_mo_ta_day_du(v => !v)}>
                {hien_mo_ta_day_du ? 'Thu gọn' : 'Xem thêm'}
              </button>
            )}
          </div>

          <div className="nhom_nut_hanh_dong">
            {loai_nut === 'doc_ngay' && (
              <button className="nut_chinh nut_doc_sach" onClick={() => dieu_huong(`/doc_sach/${chi_tiet.ma_sach}`)}>
                Đọc ngay
              </button>
            )}
            
            {loai_nut === 'doc_sach' && (
              <button className="nut_chinh nut_doc_sach" onClick={() => dieu_huong(`/doc_sach/${chi_tiet.ma_sach}`)}>
                Đọc sách
              </button>
            )}
            
            {loai_nut === 'nang_cap_hoi_vien' && (
              <button className="nut_chinh nut_hoi_vien" onClick={() => dieu_huong('/hoi_vien')}>
                Nâng cấp hội viên
              </button>
            )}
            
            {loai_nut === 'mua_ngay' && (
              <>
                <button 
                  className="nut_chinh nut_mua"
                  onClick={() => {
                    if (!da_dang_nhap) { dieu_huong('/dang_nhap'); return; }
                    // TODO: chuyển đến trang thanh toán
                  }}
                >
                  Mua ngay — {dinh_dang_gia(chi_tiet.gia_giam ?? chi_tiet.gia)}
                </button>
                {chi_tiet.cho_phep_doc_thu && (
                  <button className="nut_phu nut_doc_thu" onClick={() => dieu_huong(`/doc_thu/${chi_tiet.ma_sach}`)}>
                    Đọc thử ({chi_tiet.so_trang_doc_thu} trang)
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* === Phần đánh giá === */}
      <section className="section_danh_gia">
        <h2 className="tieu_de_section_chi_tiet">Đánh giá</h2>
        <div className="tong_quan_danh_gia">
          <div className="diem_trung_binh_lon">
            <span className="so_diem">{chi_tiet.danh_gia_trung_binh?.toFixed(1) || '0.0'}</span>
            <span className="sao_lon">★</span>
          </div>
          <div className="thong_ke_danh_gia">
            <div className="sao_hien_thi">
              {'★'.repeat(Math.round(chi_tiet.danh_gia_trung_binh || 0))}
              {'☆'.repeat(5 - Math.round(chi_tiet.danh_gia_trung_binh || 0))}
            </div>
            <span className="so_luot_danh_gia">{chi_tiet.so_luot_danh_gia || 0} lượt đánh giá</span>
          </div>
        </div>
        <p className="chua_co_du_lieu" style={{ marginTop: 16 }}>
          Danh sách đánh giá đang được phát triển.
        </p>
      </section>

      {/* === Sách liên quan === */}
      <section className="section_sach_lien_quan">
        <div className="tieu_de_section">
          <h2 className="tieu_de_section_chi_tiet">Sách cùng thể loại</h2>
          {(sach_lien_quan?.tong_so_ban_ghi || 0) > 8 && (
            <Link to={`/tim_kiem?danh_muc=${chi_tiet?.danh_sach_danh_muc?.[0] || ''}`} className="nut_xem_them">
              Xem thêm →
            </Link>
          )}
        </div>
        
        <div className="luoi_sach">
          {dang_tai_lien_quan
            ? Array.from({ length: 8 }).map((_, i) => <TheCardSach key={i} skeleton={true} />)
            : (sach_lien_quan?.danh_sach || []).length === 0
              ? <p className="chua_co_du_lieu">Không có sách liên quan.</p>
              : (sach_lien_quan?.danh_sach || []).map(s => <TheCardSach key={s.ma_sach} sach={s} />)
          }
        </div>
      </section>
      
    </div>
  );
}