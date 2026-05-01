import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import TheCardSach from '../components/TheCardSach';
import './TrangChu.css';

const SO_SACH_TRANG_CHU = 8;

// 1. Section Khám phá sách
function SectionKhamPha() {
  const { data: ket_qua, isLoading: dang_tai } = useQuery({
    queryKey: ['sach_kham_pha', SO_SACH_TRANG_CHU],
    queryFn: async () => {
      const phan_hoi = await api.get('/home/sach_noi_bat', {
        params: { trang: 1, kich_thuoc: SO_SACH_TRANG_CHU },
      });
      return phan_hoi.data;
    },
    staleTime: 30 * 60 * 1000,
  });

  const danh_sach = ket_qua?.danh_sach || [];
  const co_them = (ket_qua?.tong_so_ban_ghi || 0) > SO_SACH_TRANG_CHU;

  return (
    <section className="section_trang_chu">
      <div className="tieu_de_section">
        <h2>Khám phá sách</h2>
        {co_them && (
          <Link to="/sach_noi_bat" className="nut_xem_them">
            Xem thêm →
          </Link>
        )}
      </div>
      <div className="luoi_sach">
        {dang_tai
          ? Array.from({ length: SO_SACH_TRANG_CHU }).map((_, i) => (
            <TheCardSach key={i} skeleton />
          ))
          : danh_sach.length === 0
            ? <p className="chua_co_du_lieu">Chưa có sách nào.</p>
            : danh_sach.map((sach) => (
              <TheCardSach key={sach.ma_sach} sach={sach} />
            ))}
      </div>
    </section>
  );
}

// 2. Section Sách chung (Hội viên, Miễn phí)
function SectionSach({ tieu_de, query_key, endpoint, duong_dan_xem_them }) {
  const { data: ket_qua, isLoading: dang_tai } = useQuery({
    queryKey: [query_key, 1, SO_SACH_TRANG_CHU],
    queryFn: async () => {
      const phan_hoi = await api.get(endpoint, {
        params: { trang: 1, kich_thuoc: SO_SACH_TRANG_CHU },
      });
      return phan_hoi.data;
    },
    staleTime: 30 * 60 * 1000,
  });

  const danh_sach = ket_qua?.danh_sach || [];
  const co_them = (ket_qua?.tong_so_ban_ghi || 0) > SO_SACH_TRANG_CHU;

  return (
    <section className="section_trang_chu">
      <div className="tieu_de_section">
        <h2>{tieu_de}</h2>
        {co_them && (
          <Link to={duong_dan_xem_them} className="nut_xem_them">
            Xem thêm →
          </Link>
        )}
      </div>
      <div className="luoi_sach">
        {dang_tai
          ? Array.from({ length: SO_SACH_TRANG_CHU }).map((_, i) => (
            <TheCardSach key={i} skeleton />
          ))
          : danh_sach.length === 0
            ? <p className="chua_co_du_lieu">Chưa có sách nào.</p>
            : danh_sach.map((sach) => (
              <TheCardSach key={sach.ma_sach} sach={sach} />
            ))}
      </div>
    </section>
  );
}

// 3. Section Giảm giá
function demNguocThoiGian(ngayKetThuc) {
  const con_lai = new Date(ngayKetThuc) - Date.now();
  if (con_lai <= 0) return 'Đã kết thúc';
  const gio = Math.floor(con_lai / 3600000);
  const phut = Math.floor((con_lai % 3600000) / 60000);
  const giay = Math.floor((con_lai % 60000) / 1000);
  if (gio >= 24) {
    const ngay = Math.floor(gio / 24);
    return `${ngay} ngày ${gio % 24}h`;
  }
  return `${String(gio).padStart(2, '0')}:${String(phut).padStart(2, '0')}:${String(giay).padStart(2, '0')}`;
}

function TabChuongTrinh({ label, soSach, ngayKetThuc, active, onClick }) {
  const [dem, setDem] = useState(() => ngayKetThuc ? demNguocThoiGian(ngayKetThuc) : null);
  useEffect(() => {
    if (!ngayKetThuc) return;
    const timer = setInterval(() => setDem(demNguocThoiGian(ngayKetThuc)), 1000);
    return () => clearInterval(timer);
  }, [ngayKetThuc]);
  return (
    <button className={`tab_giam_gia ${active ? 'active' : ''}`} onClick={onClick}>
      <span className="tab_gg_ten">{label}</span>
      {dem && <span className="tab_gg_dem">{dem}</span>}
      <span className="tab_gg_so_sach">{soSach} sách</span>
    </button>
  );
}

function SectionGiamGia() {
  const [activeTab, setActiveTab] = useState(null); // null = Tất cả
  const { data, isLoading } = useQuery({
    queryKey: ['giam_gia_homepage'],
    queryFn: async () => {
      const res = await api.get('/giam_gia/hien_thi');
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) return null;
  if (!data?.thanh_cong || !data.danh_sach_sach?.length) return null;

  const sachHienThi = activeTab === null
    ? data.danh_sach_sach
    : (data.cac_chuong_trinh.find(ct => ct.ma_ct === activeTab)?.danh_sach_sach ?? []);

  return (
    <section className="section_trang_chu section_giam_gia">
      <div className="banner_giam_gia">
        <div className="tieu_de_giam_gia">
          <span className="icon_lua">🔥</span>
          <h2>Đang giảm giá</h2>
        </div>
        <div className="danh_sach_tab_gg">
          <TabChuongTrinh
            label="Tất cả"
            soSach={data.danh_sach_sach.length}
            ngayKetThuc={null}
            active={activeTab === null}
            onClick={() => setActiveTab(null)}
          />
          {data.cac_chuong_trinh.map(ct => (
            <TabChuongTrinh
              key={ct.ma_ct}
              label={ct.ten_chuong_trinh}
              soSach={ct.so_sach}
              ngayKetThuc={ct.ngay_ket_thuc}
              active={activeTab === ct.ma_ct}
              onClick={() => setActiveTab(ct.ma_ct)}
            />
          ))}
        </div>
      </div>
      <div className="luoi_sach">
        {sachHienThi.map(sach => (
          <TheCardSach key={sach.ma_sach} sach={sach} />
        ))}
      </div>
    </section>
  );
}

// 4. Section Gợi ý (Cá nhân hóa) - Đã cập nhật cho API /goi_y
function SectionGoiY() {
  const { da_dang_nhap, nguoiDung } = useAuth();
  const ma_nd = da_dang_nhap ? nguoiDung?.ma_nguoi_dung : undefined;

  const { data: ket_qua, isLoading: dang_tai } = useQuery({
    queryKey: ['goi_y_sach', ma_nd ?? 'khach', SO_SACH_TRANG_CHU],
    queryFn: async () => {
      const phan_hoi = await api.get('/goi_y', {
        params: { so_luong: SO_SACH_TRANG_CHU },
      });
      return phan_hoi.data;
    },
    staleTime: da_dang_nhap ? 30 * 60 * 1000 : 60 * 60 * 1000,
  });

  const danh_sach = ket_qua?.danh_sach || [];

  // Empty state: Nếu danh sách rỗng và không đang tải -> ẩn toàn bộ section
  if (!dang_tai && danh_sach.length === 0) {
    return null;
  }

  return (
    <section className="section_trang_chu">
      <div className="tieu_de_section">
        <h2>Gợi ý cho bạn</h2>
        {/* Luôn hiển thị xem thêm vì endpoint không hỗ trợ tổng số bản ghi */}
        <Link to="/sach_goi_y" className="nut_xem_them">
          Xem thêm →
        </Link>
      </div>
      <div className="luoi_sach">
        {dang_tai
          ? Array.from({ length: SO_SACH_TRANG_CHU }).map((_, i) => (
            <TheCardSach key={i} skeleton />
          ))
          : danh_sach.map((sach) => (
            <TheCardSach key={sach.ma_sach} sach={sach} />
          ))}
      </div>
    </section>
  );
}

export default function TrangChu() {
  return (
    <div className="trang_chu">
      <SectionGiamGia />
      <SectionGoiY />
      <SectionKhamPha />
      <SectionSach
        tieu_de="Sách hội viên"
        query_key="sach_hoi_vien"
        endpoint="/home/sach_hoi_vien"
        duong_dan_xem_them="/sach_hoi_vien"
      />
      <SectionSach
        tieu_de="Sách miễn phí"
        query_key="sach_mien_phi"
        endpoint="/home/sach_mien_phi"
        duong_dan_xem_them="/sach_mien_phi"
      />
    </div>
  );
}