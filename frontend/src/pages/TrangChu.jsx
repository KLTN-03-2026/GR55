import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import TheCardSach from '../components/TheCardSach';
import './TrangChu.css';

const SO_SACH_TRANG_CHU = 10;

// 1. Section Danh mục
function SectionDanhMuc() {
  const { data: danh_muc = [], isLoading: dang_tai_dm } = useQuery({
    queryKey: ['danh_muc_trang_chu'],
    queryFn: async () => {
      const phan_hoi = await api.get('/home/danh_muc');
      return phan_hoi.data;
    },
    staleTime: 60 * 60 * 1000, // 1 giờ [cite: 167]
  });

  return (
    <section className="section_trang_chu">
      <div className="tieu_de_section">
        <h2>Danh mục sách</h2>
      </div>
      <div className="luoi_danh_muc">
        {dang_tai_dm
          ? Array.from({ length: 8 }).map((_, i) => <div key={i} className="the_danh_muc_skeleton" />)
          : danh_muc.map(dm => (
            <Link key={dm.ma_dm} to={`/tim_kiem?danh_muc=${dm.ma_dm}`} className="the_danh_muc">
              <span className="ten_danh_muc_card">{dm.ten_danh_muc}</span>
              <span className="so_sach_danh_muc">{dm.so_luong_sach} cuốn</span>
            </Link>
          ))
        }
      </div>
    </section>
  );
}

// 2. Section Sách chung (Nổi bật, Mới, Hội viên)
function SectionSach({ tieu_de, query_key, endpoint, duong_dan_xem_them }) {
  const { data: ket_qua, isLoading: dang_tai } = useQuery({
    queryKey: [query_key, 1, SO_SACH_TRANG_CHU],
    queryFn: async () => {
      const phan_hoi = await api.get(endpoint, {
        params: { trang: 1, kich_thuoc: SO_SACH_TRANG_CHU }
      });
      return phan_hoi.data;
    },
    staleTime: 30 * 60 * 1000, // 30 phút [cite: 182]
  });

  const danh_sach = ket_qua?.danh_sach || [];
  const co_them = (ket_qua?.tong_so_ban_ghi || 0) > SO_SACH_TRANG_CHU;

  return (
    <section className="section_trang_chu">
      <div className="tieu_de_section">
        <h2>{tieu_de}</h2>
        {co_them && <Link to={duong_dan_xem_them} className="nut_xem_them">Xem thêm →</Link>}
      </div>
      <div className="luoi_sach">
        {dang_tai
          ? Array.from({ length: SO_SACH_TRANG_CHU }).map((_, i) => <TheCardSach key={i} skeleton />)
          : danh_sach.length === 0
            ? <p className="chua_co_du_lieu">Chưa có sách nào.</p>
            : danh_sach.map(sach => <TheCardSach key={sach.ma_sach} sach={sach} />)
        }
      </div>
    </section>
  );
}

// 3. Section Gợi ý (Cá nhân hóa)
function SectionGoiY() {
  const { da_dang_nhap, nguoiDung } = useAuth();
  const ma_nd = da_dang_nhap ? nguoiDung?.ma_nguoi_dung : undefined;

  const { data: ket_qua, isLoading: dang_tai } = useQuery({
    queryKey: ['sach_goi_y', ma_nd, 1, SO_SACH_TRANG_CHU],
    queryFn: async () => {
      const phan_hoi = await api.get('/home/sach_goi_y', {
        params: { ma_nd: ma_nd || undefined, trang: 1, kich_thuoc: SO_SACH_TRANG_CHU }
      });
      return phan_hoi.data;
    },
    staleTime: da_dang_nhap ? 5 * 60 * 1000 : 30 * 60 * 1000, // [cite: 216]
  });

  const danh_sach = ket_qua?.danh_sach || [];

  return (
    <section className="section_trang_chu">
      <div className="tieu_de_section">
        <h2>Gợi ý cho bạn</h2>
        <Link to="/sach_goi_y" className="nut_xem_them">Xem thêm →</Link>
      </div>
      <div className="luoi_sach">
        {dang_tai
          ? Array.from({ length: SO_SACH_TRANG_CHU }).map((_, i) => <TheCardSach key={i} skeleton />)
          : danh_sach.map(sach => <TheCardSach key={sach.ma_sach} sach={sach} />)
        }
      </div>
    </section>
  );
}

export default function TrangChu() {
  return (
    <div className="trang_chu">
      <SectionDanhMuc />
      <SectionSach tieu_de="Sách nổi bật" query_key="sach_noi_bat" endpoint="/home/sach_noi_bat" duong_dan_xem_them="/sach_noi_bat" />
      <SectionSach tieu_de="Sách mới nhất" query_key="sach_moi_nhat" endpoint="/home/sach_moi_nhat" duong_dan_xem_them="/sach_moi_nhat" />
      <SectionSach tieu_de="Sách hội viên" query_key="sach_hoi_vien" endpoint="/home/sach_hoi_vien" duong_dan_xem_them="/sach_hoi_vien" />
      <SectionGoiY />
    </div>
  );
}