import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import api from '../../services/api';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement,
  PointElement, LineElement, ArcElement, Title, Tooltip, Legend, Filler
} from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { FiUsers, FiBook, FiShoppingCart, FiDollarSign, FiStar, FiRefreshCw, FiDownload, FiChevronDown, FiList } from 'react-icons/fi';
import './ThongKe.css';

ChartJS.register(
  CategoryScale, LinearScale, BarElement,
  PointElement, LineElement, ArcElement,
  Title, Tooltip, Legend, Filler,
  ChartDataLabels
);

function dinh_dang_tien(so) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(so);
}

function ngay_hom_nay() {
  return new Date().toISOString().slice(0, 10);
}

function ngay_truoc_n_ngay(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

export default function ThongKe() {
  // Tổng quan
  const [tong_quan, dat_tong_quan] = useState(null);
  const [dang_tai_tong_quan, dat_dang_tai_tong_quan] = useState(true);

  // Doanh thu
  const [du_lieu_doanh_thu, dat_du_lieu_doanh_thu] = useState([]);
  const [dang_tai_doanh_thu, dat_dang_tai_doanh_thu] = useState(false);
  const [form_doanh_thu, dat_form_doanh_thu] = useState({
    tu_ngay: ngay_truoc_n_ngay(30),
    den_ngay: ngay_hom_nay(),
    loai: 'ngay',
  });
  const [loc_doanh_thu, dat_loc_doanh_thu] = useState({ ...form_doanh_thu });

  // Sách bán chạy
  const [sach_ban_chay, dat_sach_ban_chay] = useState([]);
  const [dang_tai_sach_ban_chay, dat_dang_tai_sach_ban_chay] = useState(false);
  const [form_sach_ban_chay, dat_form_sach_ban_chay] = useState({
    tu_ngay: ngay_truoc_n_ngay(30),
    den_ngay: ngay_hom_nay(),
  });
  const [loc_sach_ban_chay, dat_loc_sach_ban_chay] = useState({ ...form_sach_ban_chay });

  // Người dùng mới
  const [du_lieu_nguoi_dung, dat_du_lieu_nguoi_dung] = useState([]);
  const [dang_tai_nguoi_dung, dat_dang_tai_nguoi_dung] = useState(false);
  const [form_nguoi_dung, dat_form_nguoi_dung] = useState({
    tu_ngay: ngay_truoc_n_ngay(30),
    den_ngay: ngay_hom_nay(),
  });
  const [loc_nguoi_dung, dat_loc_nguoi_dung] = useState({ ...form_nguoi_dung });

  // Sách theo thể loại
  const [du_lieu_the_loai, dat_du_lieu_the_loai] = useState([]);
  const [dang_tai_the_loai, dat_dang_tai_the_loai] = useState(true);

  // Đơn hàng
  const [du_lieu_don_hang, dat_du_lieu_don_hang] = useState(null);
  const [dang_tai_don_hang, dat_dang_tai_don_hang] = useState(false);
  const [form_don_hang, dat_form_don_hang] = useState({
    tu_ngay: ngay_truoc_n_ngay(30),
    den_ngay: ngay_hom_nay(),
  });
  const [loc_don_hang, dat_loc_don_hang] = useState({
    tu_ngay: ngay_truoc_n_ngay(30),
    den_ngay: ngay_hom_nay(),
  });

  // Bảng số liệu doanh thu
  const [hien_bang_doanh_thu, dat_hien_bang_doanh_thu] = useState(false);

  // Bảng số liệu người dùng mới
  const [hien_bang_nguoi_dung, dat_hien_bang_nguoi_dung] = useState(false);

  // Bảng đơn hàng
  const [hien_bang_don_hang, dat_hien_bang_don_hang] = useState(false);

  // Hội viên
  const [du_lieu_hoi_vien, dat_du_lieu_hoi_vien] = useState(null);
  const [dang_tai_hoi_vien, dat_dang_tai_hoi_vien] = useState(true);

  // Đánh giá sách
  const [du_lieu_danh_gia, dat_du_lieu_danh_gia] = useState(null);
  const [dang_tai_danh_gia, dat_dang_tai_danh_gia] = useState(true);

  // Hiệu suất sách
  const [du_lieu_hieu_suat, dat_du_lieu_hieu_suat] = useState(null);
  const [dang_tai_hieu_suat, dat_dang_tai_hieu_suat] = useState(true);

  // Refresh cache
  const [dang_refresh, dat_dang_refresh] = useState(false);

  // 1. Fetch tổng quan + thể loại
  useEffect(() => {
    async function tai_du_lieu_dau() {
      try {
        const [phan_hoi_tq, phan_hoi_tl] = await Promise.all([
          api.get('/admin/thong_ke/tong_quan'),
          api.get('/admin/thong_ke/sach_theo_the_loai'),
        ]);
        dat_tong_quan(phan_hoi_tq.data);
        dat_du_lieu_the_loai(phan_hoi_tl.data.data || []);
      } catch (err) {
        toast.error(err.response?.data?.message || 'Không thể tải dữ liệu thống kê');
      } finally {
        dat_dang_tai_tong_quan(false);
        dat_dang_tai_the_loai(false);
      }
    }
    tai_du_lieu_dau();
  }, []);

  // 2. Fetch doanh thu
  const tai_doanh_thu = useCallback(async () => {
    dat_dang_tai_doanh_thu(true);
    try {
      const phan_hoi = await api.get('/admin/thong_ke/doanh_thu', { params: loc_doanh_thu });
      dat_du_lieu_doanh_thu(phan_hoi.data.data || []);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Không thể tải dữ liệu doanh thu');
    } finally {
      dat_dang_tai_doanh_thu(false);
    }
  }, [loc_doanh_thu]);

  useEffect(() => { tai_doanh_thu(); }, [tai_doanh_thu]);

  // 3. Fetch sách bán chạy
  const tai_sach_ban_chay = useCallback(async () => {
    dat_dang_tai_sach_ban_chay(true);
    try {
      const phan_hoi = await api.get('/admin/thong_ke/sach_ban_chay', { params: loc_sach_ban_chay });
      dat_sach_ban_chay(phan_hoi.data.data || []);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Không thể tải danh sách sách bán chạy');
    } finally {
      dat_dang_tai_sach_ban_chay(false);
    }
  }, [loc_sach_ban_chay]);

  useEffect(() => { tai_sach_ban_chay(); }, [tai_sach_ban_chay]);

  // 4. Fetch người dùng mới
  const tai_nguoi_dung_moi = useCallback(async () => {
    dat_dang_tai_nguoi_dung(true);
    try {
      const phan_hoi = await api.get('/admin/thong_ke/nguoi_dung_moi', { params: loc_nguoi_dung });
      dat_du_lieu_nguoi_dung(phan_hoi.data.data || []);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Không thể tải dữ liệu người dùng mới');
    } finally {
      dat_dang_tai_nguoi_dung(false);
    }
  }, [loc_nguoi_dung]);

  useEffect(() => { tai_nguoi_dung_moi(); }, [tai_nguoi_dung_moi]);

  // 5. Fetch thống kê đơn hàng
  const tai_don_hang = useCallback(async () => {
    dat_dang_tai_don_hang(true);
    try {
      const phan_hoi = await api.get('/admin/thong_ke/don_hang', { params: loc_don_hang });
      dat_du_lieu_don_hang(phan_hoi.data);
    } catch (err) {
      toast.error('Không thể tải dữ liệu đơn hàng');
    } finally {
      dat_dang_tai_don_hang(false);
    }
  }, [loc_don_hang]);

  useEffect(() => { tai_don_hang(); }, [tai_don_hang]);

  // 6. Fetch thống kê hội viên, đánh giá, hiệu suất
  useEffect(() => {
    async function tai_thong_ke_moi() {
      try {
        const [r_hv, r_dg, r_hs] = await Promise.all([
          api.get('/admin/thong_ke/hoi_vien'),
          api.get('/admin/thong_ke/danh_gia'),
          api.get('/admin/thong_ke/hieu_suat_sach'),
        ]);
        dat_du_lieu_hoi_vien(r_hv.data);
        dat_du_lieu_danh_gia(r_dg.data);
        dat_du_lieu_hieu_suat(r_hs.data);
      } catch (err) {
        toast.error('Không thể tải một số dữ liệu thống kê');
      } finally {
        dat_dang_tai_hoi_vien(false);
        dat_dang_tai_danh_gia(false);
        dat_dang_tai_hieu_suat(false);
      }
    }
    tai_thong_ke_moi();
  }, []);

  // 5. Refresh cache
  async function refresh_cache() {
    dat_dang_refresh(true);
    try {
      await api.post('/admin/thong_ke/refresh_cache');
      toast.success('Đã làm mới cache. Đang tải lại dữ liệu...');
      const [phan_hoi_tq, phan_hoi_tl] = await Promise.all([
        api.get('/admin/thong_ke/tong_quan'),
        api.get('/admin/thong_ke/sach_theo_the_loai'),
      ]);
      dat_tong_quan(phan_hoi_tq.data);
      dat_du_lieu_the_loai(phan_hoi_tl.data.data || []);
      await Promise.all([tai_doanh_thu(), tai_sach_ban_chay(), tai_nguoi_dung_moi(), tai_don_hang()]);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      dat_dang_refresh(false);
    }
  }

  // 6. Xuất CSV
  async function xuat_csv(endpoint, params, ten_file) {
    try {
      const phan_hoi = await api.get(`/admin/thong_ke/xuat_csv/${endpoint}`, {
        params,
        responseType: 'blob',
      });
      const url = URL.createObjectURL(new Blob([phan_hoi.data], { type: 'text/csv;charset=utf-8;' }));
      const lien_ket = document.createElement('a');
      lien_ket.href = url;
      lien_ket.download = ten_file;
      lien_ket.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      toast.error('Không thể xuất file CSV. Vui lòng thử lại.');
    }
  }

  // Cấu hình biểu đồ
  const tong_doanh_thu = du_lieu_doanh_thu.reduce((s, d) => s + d.doanh_thu, 0);
  const tong_don = du_lieu_doanh_thu.reduce((s, d) => s + d.so_luong_don, 0);

  const bieu_do_doanh_thu = {
    labels: du_lieu_doanh_thu.map(d => d.thoi_gian),
    datasets: [{
      label: 'Doanh thu',
      data: du_lieu_doanh_thu.map(d => d.doanh_thu),
      backgroundColor: 'rgba(37, 99, 235, 0.82)',
      hoverBackgroundColor: '#1d4ed8',
      borderRadius: 8,
      borderSkipped: false,
      borderWidth: 0,
    }],
  };

  const tuy_chon_doanh_thu = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      datalabels: { display: false },
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.92)',
        padding: 12,
        cornerRadius: 8,
        titleFont: { size: 13 },
        bodyFont: { size: 13 },
        callbacks: {
          label: ctx => `  Doanh thu: ${dinh_dang_tien(ctx.raw)}`,
          afterLabel: ctx => `  Số đơn: ${du_lieu_doanh_thu[ctx.dataIndex]?.so_luong_don}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: { color: '#6b7280', font: { size: 12 } },
      },
      y: {
        grid: { color: 'rgba(0,0,0,0.05)' },
        border: { display: false },
        ticks: { color: '#6b7280', font: { size: 12 }, callback: val => dinh_dang_tien(val) },
      },
    },
  };

  const bieu_do_nguoi_dung = {
    labels: du_lieu_nguoi_dung.map(d => d.thoi_gian),
    datasets: [{
      label: 'Người dùng đăng ký mới',
      data: du_lieu_nguoi_dung.map(d => d.so_luong),
      borderColor: 'rgba(16, 185, 129, 1)',
      backgroundColor: 'rgba(16, 185, 129, 0.08)',
      fill: true,
      tension: 0.4,
      pointRadius: 4,
      pointHoverRadius: 6,
      pointBackgroundColor: 'rgba(16, 185, 129, 1)',
      borderWidth: 2,
    }],
  };

  const tuy_chon_nguoi_dung = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      datalabels: { display: false },
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.92)',
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: ctx => `  Đăng ký mới: ${ctx.raw} người`,
        },
      },
    },
    scales: {
      x: { grid: { display: false }, border: { display: false }, ticks: { color: '#6b7280' } },
      y: {
        grid: { color: 'rgba(0,0,0,0.05)' },
        border: { display: false },
        ticks: { color: '#6b7280', stepSize: 1 },
      },
    },
  };
  const MAU_THE_LOAI = [
    '#3B82F6','#10B981','#F59E0B','#EF4444','#8B5CF6',
    '#06B6D4','#F97316','#84CC16','#EC4899','#6366F1',
    '#14B8A6','#F43F5E','#A855F7','#22C55E','#EAB308',
    '#0EA5E9','#E11D48','#7C3AED','#059669','#DC2626',
    '#2563EB','#D97706','#16A34A','#9333EA','#0891B2',
  ];
  const bieu_do_the_loai = {
    labels: du_lieu_the_loai.map(d => d.ten_the_loai),
    datasets: [{
      data: du_lieu_the_loai.map(d => d.so_luong),
      backgroundColor: du_lieu_the_loai.map((_, i) => MAU_THE_LOAI[i % MAU_THE_LOAI.length]),
      borderWidth: 2,
      borderColor: '#fff',
      hoverOffset: 8,
    }],
  };
  const tuy_chon_the_loai = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.92)',
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: ctx => `  ${ctx.label}: ${ctx.raw} sách (${du_lieu_the_loai[ctx.dataIndex]?.ty_le?.toFixed(1)}%)`,
        },
      },
      datalabels: {
        color: '#fff',
        font: { weight: 'bold', size: 11 },
        formatter: (value, ctx) => {
          const tyle = du_lieu_the_loai[ctx.dataIndex]?.ty_le;
          return tyle >= 3 ? tyle.toFixed(1) + '%' : '';
        },
      },
    },
  };

  return (
    <div className="trang-thong-ke">
      <div className="header-thong-ke">
        <h2>Thống kê & Báo cáo</h2>
        <button className="btn btn-cap-nhat" onClick={refresh_cache} disabled={dang_refresh}>
          <FiRefreshCw className={dang_refresh ? 'spin' : ''} />
          {dang_refresh ? 'Đang cập nhật...' : 'Cập nhật dữ liệu'}
        </button>
      </div>

      {/* DASHBOARD TỔNG QUAN */}
      <div className="dashboard-cards">
        <div className="card-stat">
          <div className="icon"><FiUsers /></div>
          <div className="info">
            <p>Tổng người dùng</p>
            <h3>{dang_tai_tong_quan ? '—' : tong_quan?.tong_nguoi_dung}</h3>
          </div>
        </div>
        <div className="card-stat">
          <div className="icon"><FiBook /></div>
          <div className="info">
            <p>Tổng sách</p>
            <h3>{dang_tai_tong_quan ? '—' : tong_quan?.tong_sach}</h3>
          </div>
        </div>
        <div className="card-stat">
          <div className="icon"><FiShoppingCart /></div>
          <div className="info">
            <p>Đơn hàng thành công</p>
            <h3>{dang_tai_tong_quan ? '—' : tong_quan?.tong_don_hang}</h3>
          </div>
        </div>
        <div className="card-stat">
          <div className="icon"><FiDollarSign /></div>
          <div className="info">
            <p>Tổng doanh thu</p>
            <h3 className="text-highlight">{dang_tai_tong_quan ? '—' : dinh_dang_tien(tong_quan?.tong_doanh_thu || 0)}</h3>
          </div>
        </div>
        <div className="card-stat">
          <div className="icon"><FiStar /></div>
          <div className="info">
            <p>Hội viên hiện tại</p>
            <h3>{dang_tai_tong_quan ? '—' : tong_quan?.tong_hoi_vien}</h3>
          </div>
        </div>
      </div>

      <div className="grid-bieu-do">
        {/* DOANH THU */}
        <div className="panel chart-panel">
          <h3>Doanh thu</h3>
          <div className="bo-loc-ngang">
            <label className="loc-ngay">Từ ngày <input type="date" value={form_doanh_thu.tu_ngay} onChange={e => dat_form_doanh_thu({ ...form_doanh_thu, tu_ngay: e.target.value })} /></label>
            <label className="loc-ngay">Đến ngày <input type="date" value={form_doanh_thu.den_ngay} onChange={e => dat_form_doanh_thu({ ...form_doanh_thu, den_ngay: e.target.value })} /></label>
            <select value={form_doanh_thu.loai} onChange={e => dat_form_doanh_thu({ ...form_doanh_thu, loai: e.target.value })}>
              <option value="ngay">Theo ngày</option>
              <option value="tuan">Theo tuần</option>
              <option value="thang">Theo tháng</option>
            </select>
            <button className="btn btn-primary" onClick={() => dat_loc_doanh_thu(form_doanh_thu)}>Xem</button>
            <button className="btn btn-csv" onClick={() => xuat_csv('doanh_thu', { ...loc_doanh_thu }, 'doanh_thu.csv')}><FiDownload /> Xuất CSV</button>
          </div>
          {dang_tai_doanh_thu ? <div className="spinner">Đang tải...</div> :
            du_lieu_doanh_thu.length > 0 ? (
              <>
                <div className="tom_tat_doanh_thu">
                  <div className="tom_tat_item">
                    <span className="tom_tat_nhan">Tổng doanh thu</span>
                    <span className="tom_tat_gia_tri tom_tat_highlight">{dinh_dang_tien(tong_doanh_thu)}</span>
                  </div>
                  <div className="tom_tat_phan_cach" />
                  <div className="tom_tat_item">
                    <span className="tom_tat_nhan">Tổng đơn hàng</span>
                    <span className="tom_tat_gia_tri">{tong_don} đơn</span>
                  </div>
                  <div className="tom_tat_phan_cach" />
                  <div className="tom_tat_item">
                    <span className="tom_tat_nhan">TB/{form_doanh_thu.loai === 'ngay' ? 'ngày' : form_doanh_thu.loai === 'tuan' ? 'tuần' : 'tháng'}</span>
                    <span className="tom_tat_gia_tri">{dinh_dang_tien(tong_doanh_thu / du_lieu_doanh_thu.length)}</span>
                  </div>
                </div>
                <div className="chart-container"><Bar data={bieu_do_doanh_thu} options={tuy_chon_doanh_thu} /></div>
                <button className="btn-xem-bang" onClick={() => dat_hien_bang_doanh_thu(prev => !prev)}>
                  <FiList />
                  {hien_bang_doanh_thu ? 'Ẩn bảng số liệu' : 'Xem bảng số liệu'}
                  <FiChevronDown className={`chevron-xem-bang ${hien_bang_doanh_thu ? 'xoay' : ''}`} />
                </button>
                {hien_bang_doanh_thu && (
                  <table className="bang-so-lieu">
                    <thead>
                      <tr><th>Thời gian</th><th>Doanh thu</th><th>Số đơn</th></tr>
                    </thead>
                    <tbody>
                      {du_lieu_doanh_thu.map((d, i) => (
                        <tr key={i}>
                          <td>{d.thoi_gian}</td>
                          <td className="text-highlight">{dinh_dang_tien(d.doanh_thu)}</td>
                          <td>{d.so_luong_don}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td><strong>Tổng</strong></td>
                        <td className="text-highlight"><strong>{dinh_dang_tien(du_lieu_doanh_thu.reduce((s, d) => s + d.doanh_thu, 0))}</strong></td>
                        <td><strong>{du_lieu_doanh_thu.reduce((s, d) => s + d.so_luong_don, 0)}</strong></td>
                      </tr>
                    </tfoot>
                  </table>
                )}
              </>
            ) : <p className="empty-text">Không có dữ liệu trong khoảng thời gian này</p>
          }
        </div>

        {/* NGƯỜI DÙNG MỚI */}
        <div className="panel chart-panel">
          <h3>Người dùng đăng ký mới</h3>
          <div className="bo-loc-ngang">
            <label className="loc-ngay">Từ ngày <input type="date" value={form_nguoi_dung.tu_ngay} onChange={e => dat_form_nguoi_dung({ ...form_nguoi_dung, tu_ngay: e.target.value })} /></label>
            <label className="loc-ngay">Đến ngày <input type="date" value={form_nguoi_dung.den_ngay} onChange={e => dat_form_nguoi_dung({ ...form_nguoi_dung, den_ngay: e.target.value })} /></label>
            <button className="btn btn-primary" onClick={() => dat_loc_nguoi_dung(form_nguoi_dung)}>Xem</button>
            <button className="btn btn-csv" onClick={() => xuat_csv('nguoi_dung_moi', { ...loc_nguoi_dung }, 'nguoi_dung_moi.csv')}><FiDownload /> Xuất CSV</button>
          </div>
          {dang_tai_nguoi_dung ? <div className="spinner">Đang tải...</div> :
            du_lieu_nguoi_dung.length > 0 ? (
              <>
                <div className="tom_tat_doanh_thu">
                  <div className="tom_tat_item">
                    <span className="tom_tat_nhan">Tổng đăng ký</span>
                    <span className="tom_tat_gia_tri tom_tat_xanh_la">{du_lieu_nguoi_dung.reduce((s, d) => s + d.so_luong, 0)} người</span>
                  </div>
                  <div className="tom_tat_phan_cach" />
                  <div className="tom_tat_item">
                    <span className="tom_tat_nhan">Ngày cao nhất</span>
                    <span className="tom_tat_gia_tri">{Math.max(...du_lieu_nguoi_dung.map(d => d.so_luong))} người</span>
                  </div>
                  <div className="tom_tat_phan_cach" />
                  <div className="tom_tat_item">
                    <span className="tom_tat_nhan">TB/ngày</span>
                    <span className="tom_tat_gia_tri">{(du_lieu_nguoi_dung.reduce((s, d) => s + d.so_luong, 0) / du_lieu_nguoi_dung.length).toFixed(1)} người</span>
                  </div>
                </div>
                <div className="chart-container"><Line data={bieu_do_nguoi_dung} options={tuy_chon_nguoi_dung} /></div>
                <button className="btn-xem-bang" onClick={() => dat_hien_bang_nguoi_dung(prev => !prev)}>
                  <FiList />
                  {hien_bang_nguoi_dung ? 'Ẩn bảng số liệu' : 'Xem bảng số liệu'}
                  <FiChevronDown className={`chevron-xem-bang ${hien_bang_nguoi_dung ? 'xoay' : ''}`} />
                </button>
                {hien_bang_nguoi_dung && (
                  <table className="bang-so-lieu">
                    <thead>
                      <tr><th>Thời gian</th><th>Số người đăng ký</th></tr>
                    </thead>
                    <tbody>
                      {du_lieu_nguoi_dung.map((d, i) => (
                        <tr key={i}>
                          <td>{d.thoi_gian}</td>
                          <td className="tom_tat_xanh_la">{d.so_luong} người</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td><strong>Tổng</strong></td>
                        <td><strong>{du_lieu_nguoi_dung.reduce((s, d) => s + d.so_luong, 0)} người</strong></td>
                      </tr>
                    </tfoot>
                  </table>
                )}
              </>
            ) : <p className="empty-text">Không có dữ liệu trong khoảng thời gian này</p>
          }
        </div>
      </div>

      {/* SÁCH BÁN CHẠY (TOP 10) — full width */}
      <div className="panel table-panel" style={{ marginBottom: 20 }}>
        <h3>Top 10 Sách Bán Chạy</h3>
        <div className="bo-loc-ngang">
          <label className="loc-ngay">Từ ngày <input type="date" value={form_sach_ban_chay.tu_ngay} onChange={e => dat_form_sach_ban_chay({ ...form_sach_ban_chay, tu_ngay: e.target.value })} /></label>
          <label className="loc-ngay">Đến ngày <input type="date" value={form_sach_ban_chay.den_ngay} onChange={e => dat_form_sach_ban_chay({ ...form_sach_ban_chay, den_ngay: e.target.value })} /></label>
          <button className="btn btn-primary" onClick={() => dat_loc_sach_ban_chay(form_sach_ban_chay)}>Xem</button>
          <button className="btn btn-csv" onClick={() => xuat_csv('sach_ban_chay', { ...loc_sach_ban_chay }, 'sach_ban_chay.csv')}><FiDownload /> Xuất CSV</button>
        </div>
        {dang_tai_sach_ban_chay ? <div className="spinner">Đang tải...</div> : (
          <table className="admin-table ban-chay-table">
            <thead>
              <tr>
                <th className="col-hang">#</th>
                <th>Tên sách</th>
                <th>Tác giả</th>
                <th className="col-so-luong">Số lượng bán</th>
                <th className="col-doanh-thu">Doanh thu</th>
              </tr>
            </thead>
            <tbody>
              {sach_ban_chay.map((sach, idx) => {
                const max_ban = sach_ban_chay[0]?.so_luong_ban || 1;
                const phan_tram = Math.round((sach.so_luong_ban / max_ban) * 100);
                return (
                  <tr key={sach.ma_sach} className={idx < 3 ? `hang-top hang-${idx + 1}` : ''}>
                    <td className="col-hang">
                      {idx === 0 && <span className="huy-hieu vang">1</span>}
                      {idx === 1 && <span className="huy-hieu bac">2</span>}
                      {idx === 2 && <span className="huy-hieu dong">3</span>}
                      {idx >= 3 && <span className="hang-thuong">{idx + 1}</span>}
                    </td>
                    <td className="col-ten-sach">{sach.ten_sach}</td>
                    <td className="col-tac-gia">{sach.tac_gia}</td>
                    <td className="col-so-luong">
                      <div className="o-so-luong">
                        <span className="so-luong-so">{sach.so_luong_ban}</span>
                        <div className="thanh-ban-nen">
                          <div className="thanh-ban-day" style={{ width: `${phan_tram}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="col-doanh-thu doanh-thu-xanh">{dinh_dang_tien(sach.doanh_thu)}</td>
                  </tr>
                );
              })}
              {sach_ban_chay.length === 0 && <tr><td colSpan="5" className="empty-text">Không có dữ liệu</td></tr>}
            </tbody>
          </table>
        )}
      </div>

      {/* THỂ LOẠI */}
      <div className="panel" style={{ marginBottom: 20 }}>
        <h3>Tỷ lệ sách theo thể loại</h3>
        {dang_tai_the_loai ? <div className="spinner">Đang tải...</div> : (
          <>
            <div className="chart-container-pie">
              <Pie data={bieu_do_the_loai} options={tuy_chon_the_loai} />
            </div>
            <div className="legend-the-loai">
              {du_lieu_the_loai.map((d, i) => (
                <div key={i} className="legend-item-tl">
                  <span className="legend-dot-tl" style={{ background: MAU_THE_LOAI[i % MAU_THE_LOAI.length] }} />
                  <span className="legend-ten-tl" title={d.ten_the_loai}>{d.ten_the_loai}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* BÁO CÁO ĐƠN HÀNG */}
      <div className="panel" style={{ marginBottom: 20 }}>
        <h3>Báo cáo đơn hàng</h3>
        <div className="bo-loc-ngang">
          <label className="loc-ngay">Từ ngày <input type="date" value={form_don_hang.tu_ngay} onChange={e => dat_form_don_hang({ ...form_don_hang, tu_ngay: e.target.value })} /></label>
          <label className="loc-ngay">Đến ngày <input type="date" value={form_don_hang.den_ngay} onChange={e => dat_form_don_hang({ ...form_don_hang, den_ngay: e.target.value })} /></label>
          <button className="btn btn-primary" onClick={() => dat_loc_don_hang(form_don_hang)}>Xem</button>
          <button className="btn btn-csv" onClick={() => xuat_csv('don_hang', { ...loc_don_hang }, 'don_hang.csv')}><FiDownload /> Xuất CSV</button>
        </div>

        {dang_tai_don_hang ? <div className="spinner">Đang tải...</div> : du_lieu_don_hang && (
          <>
            <div className="don-hang-stats">
              <div className="dh-stat-card">
                <span className="dh-stat-so">{du_lieu_don_hang.tong_don}</span>
                <span className="dh-stat-nhan">Tổng đơn</span>
              </div>
              <div className="dh-stat-card thanh-cong">
                <span className="dh-stat-so">{du_lieu_don_hang.da_thanh_toan}</span>
                <span className="dh-stat-nhan">Thành công</span>
              </div>
              <div className="dh-stat-card cho">
                <span className="dh-stat-so">{du_lieu_don_hang.cho_thanh_toan}</span>
                <span className="dh-stat-nhan">Chờ thanh toán</span>
              </div>
              <div className="dh-stat-card that-bai">
                <span className="dh-stat-so">{du_lieu_don_hang.that_bai}</span>
                <span className="dh-stat-nhan">Thất bại</span>
              </div>
              <div className="dh-stat-card doanh-thu">
                <span className="dh-stat-so">{dinh_dang_tien(du_lieu_don_hang.doanh_thu)}</span>
                <span className="dh-stat-nhan">Doanh thu</span>
              </div>
            </div>

            <div className="dh-ty-le">
              <div className="dh-ty-le-header">
                <span>Tỷ lệ thành công</span>
                <span className="dh-ty-le-so">{du_lieu_don_hang.ty_le_thanh_cong.toFixed(1)}%</span>
              </div>
              <div className="dh-thanh-tien-do-nen">
                <div className="dh-thanh-tien-do-day" style={{ width: `${du_lieu_don_hang.ty_le_thanh_cong}%` }} />
              </div>
            </div>

            {du_lieu_don_hang.danh_sach?.length > 0 && (
              <>
                <button className="btn-xem-bang" onClick={() => dat_hien_bang_don_hang(p => !p)}>
                  <FiList />
                  {hien_bang_don_hang ? 'Ẩn bảng số liệu' : 'Xem bảng số liệu'}
                  <FiChevronDown className={`chevron-xem-bang ${hien_bang_don_hang ? 'xoay' : ''}`} />
                </button>
                {hien_bang_don_hang && (
                  <table className="bang-so-lieu">
                    <thead>
                      <tr>
                        <th>Mã đơn hàng</th>
                        <th>Khách hàng</th>
                        <th>Email</th>
                        <th>Ngày tạo</th>
                        <th>Tổng tiền</th>
                        <th>Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody>
                      {du_lieu_don_hang.danh_sach.map((dh, i) => (
                        <tr key={i}>
                          <td style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{dh.ma_don_hang}</td>
                          <td>{dh.ho_ten}</td>
                          <td style={{ color: '#6b7280', fontSize: '0.85rem' }}>{dh.email}</td>
                          <td style={{ color: '#6b7280', fontSize: '0.85rem' }}>{new Date(dh.ngay_tao).toLocaleDateString('vi-VN')}</td>
                          <td className="text-highlight" style={{ color: '#2563eb', fontWeight: 700 }}>{dinh_dang_tien(dh.tong_tien)}</td>
                          <td>
                            <span className={`trang-thai-badge ${dh.trang_thai}`}>
                              {dh.trang_thai === 'da_thanh_toan' ? 'Thành công'
                                : dh.trang_thai === 'cho_thanh_toan' ? 'Chờ thanh toán'
                                : 'Thất bại'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan="4"><strong>Tổng</strong></td>
                        <td style={{ color: '#2563eb', fontWeight: 700 }}><strong>{dinh_dang_tien(du_lieu_don_hang.doanh_thu)}</strong></td>
                        <td></td>
                      </tr>
                    </tfoot>
                  </table>
                )}
              </>
            )}
          </>
        )}
      </div>

      {/* HỘI VIÊN */}
      <div className="panel" style={{ marginBottom: 20 }}>
        <h3>Thống kê Hội viên</h3>
        {dang_tai_hoi_vien ? <div className="spinner">Đang tải...</div> : du_lieu_hoi_vien && (
          <>
            <div className="hv-stats">
              <div className="hv-stat-card">
                <span className="hv-stat-so">{du_lieu_hoi_vien.hoi_vien_hoat_dong}</span>
                <span className="hv-stat-nhan">Hội viên hoạt động</span>
              </div>
              <div className="hv-stat-card">
                <span className="hv-stat-so">{du_lieu_hoi_vien.tong_nguoi_dung}</span>
                <span className="hv-stat-nhan">Tổng người dùng</span>
              </div>
              <div className="hv-stat-card ty-le">
                <span className="hv-stat-so">{du_lieu_hoi_vien.ty_le_hoi_vien.toFixed(1)}%</span>
                <span className="hv-stat-nhan">Tỷ lệ hội viên</span>
              </div>
              <div className="hv-stat-card doanh-thu">
                <span className="hv-stat-so">{dinh_dang_tien(du_lieu_hoi_vien.tong_doanh_thu)}</span>
                <span className="hv-stat-nhan">Doanh thu hội viên</span>
              </div>
            </div>
            {du_lieu_hoi_vien.theo_goi?.length > 0 && (
              <table className="bang-so-lieu">
                <thead>
                  <tr>
                    <th>Tên gói</th>
                    <th>Giá</th>
                    <th>Thời hạn</th>
                    <th>Đang hoạt động</th>
                    <th>Tổng lượt đăng ký</th>
                    <th>Doanh thu</th>
                  </tr>
                </thead>
                <tbody>
                  {du_lieu_hoi_vien.theo_goi.map((g, i) => (
                    <tr key={i}>
                      <td style={{ fontWeight: 600 }}>{g.ten_goi}</td>
                      <td>{dinh_dang_tien(g.gia)}</td>
                      <td>{g.thoi_han_thang} tháng</td>
                      <td style={{ color: '#16a34a', fontWeight: 600 }}>{g.dang_hoat_dong}</td>
                      <td>{g.tong_lan_dang_ky}</td>
                      <td style={{ color: '#2563eb', fontWeight: 700 }}>{dinh_dang_tien(g.doanh_thu)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="3"><strong>Tổng</strong></td>
                    <td style={{ color: '#16a34a', fontWeight: 600 }}><strong>{du_lieu_hoi_vien.hoi_vien_hoat_dong}</strong></td>
                    <td><strong>{du_lieu_hoi_vien.theo_goi.reduce((s, g) => s + Number(g.tong_lan_dang_ky), 0)}</strong></td>
                    <td style={{ color: '#2563eb', fontWeight: 700 }}><strong>{dinh_dang_tien(du_lieu_hoi_vien.tong_doanh_thu)}</strong></td>
                  </tr>
                </tfoot>
              </table>
            )}
          </>
        )}
      </div>

      {/* ĐÁNH GIÁ SÁCH */}
      <div className="panel" style={{ marginBottom: 20 }}>
        <h3>Thống kê Đánh giá sách</h3>
        {dang_tai_danh_gia ? <div className="spinner">Đang tải...</div> : du_lieu_danh_gia && (
          <>
            <div className="dg-stats">
              <div className="dg-stat-card">
                <span className="dg-stat-so">{du_lieu_danh_gia.tong_danh_gia.toLocaleString('vi-VN')}</span>
                <span className="dg-stat-nhan">Tổng đánh giá</span>
              </div>
              <div className="dg-stat-card diem">
                <span className="dg-stat-so">{du_lieu_danh_gia.diem_trung_binh.toFixed(2)} ★</span>
                <span className="dg-stat-nhan">Điểm trung bình</span>
              </div>
              <div className="dg-stat-card ty-le">
                <span className="dg-stat-so">{du_lieu_danh_gia.ty_le_nguoi_mua_danh_gia.toFixed(1)}%</span>
                <span className="dg-stat-nhan">Người mua có đánh giá</span>
              </div>
            </div>
            <div className="dg-layout">
              <div className="dg-phan-bo">
                <h4>Phân bổ đánh giá theo sao</h4>
                {[5, 4, 3, 2, 1].map(sao => {
                  const pb = du_lieu_danh_gia.phan_bo_sao?.find(p => p.so_sao === sao);
                  return (
                    <div key={sao} className="dg-sao-hang">
                      <span className="dg-sao-nhan">{sao} ★</span>
                      <div className="dg-sao-nen">
                        <div className="dg-sao-day" style={{ width: `${pb?.ty_le || 0}%` }} />
                      </div>
                      <span className="dg-sao-so">{pb?.so_luong || 0}</span>
                      <span className="dg-sao-pct">{(pb?.ty_le || 0).toFixed(1)}%</span>
                    </div>
                  );
                })}
              </div>
              <div className="dg-bang-sach">
                <div className="dg-bang-nhom">
                  <h4>Top 5 sách đánh giá cao nhất</h4>
                  <table className="bang-so-lieu">
                    <thead>
                      <tr><th>Tên sách</th><th>Điểm TB</th><th>Lượt ĐG</th></tr>
                    </thead>
                    <tbody>
                      {du_lieu_danh_gia.sach_cao_nhat?.map((s, i) => (
                        <tr key={i}>
                          <td>
                            <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{s.ten_sach}</div>
                            <div style={{ color: '#9ca3af', fontSize: '0.78rem' }}>{s.tac_gia}</div>
                          </td>
                          <td style={{ color: '#d97706', fontWeight: 700 }}>{s.diem_trung_binh.toFixed(2)} ★</td>
                          <td>{s.so_danh_gia}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="dg-bang-nhom">
                  <h4>Top 5 sách đánh giá thấp nhất</h4>
                  <table className="bang-so-lieu">
                    <thead>
                      <tr><th>Tên sách</th><th>Điểm TB</th><th>Lượt ĐG</th></tr>
                    </thead>
                    <tbody>
                      {du_lieu_danh_gia.sach_thap_nhat?.map((s, i) => (
                        <tr key={i}>
                          <td>
                            <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{s.ten_sach}</div>
                            <div style={{ color: '#9ca3af', fontSize: '0.78rem' }}>{s.tac_gia}</div>
                          </td>
                          <td style={{ color: '#e11d48', fontWeight: 700 }}>{s.diem_trung_binh.toFixed(2)} ★</td>
                          <td>{s.so_danh_gia}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* HIỆU SUẤT SÁCH */}
      <div className="panel" style={{ marginBottom: 20 }}>
        <h3>Hiệu suất Sách</h3>
        {dang_tai_hieu_suat ? <div className="spinner">Đang tải...</div> : du_lieu_hieu_suat && (
          <div className="hs-grid">
            <div>
              <h4 className="hs-bang-tieu-de">Top 10 sách được xem nhiều nhất</h4>
              <table className="bang-so-lieu">
                <thead>
                  <tr>
                    <th className="hs-col-stt">#</th>
                    <th>Tên sách</th>
                    <th>Lượt xem</th>
                    <th>Đã bán</th>
                    <th>Doanh thu</th>
                    <th>TL chuyển đổi</th>
                  </tr>
                </thead>
                <tbody>
                  {du_lieu_hieu_suat.top_xem?.map((s, i) => (
                    <tr key={s.ma_sach}>
                      <td style={{ textAlign: 'center', color: '#9ca3af', fontWeight: 600 }}>{i + 1}</td>
                      <td>
                        <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{s.ten_sach}</div>
                        <div style={{ color: '#9ca3af', fontSize: '0.78rem' }}>{s.tac_gia}</div>
                      </td>
                      <td style={{ fontWeight: 600 }}>{s.luot_xem.toLocaleString('vi-VN')}</td>
                      <td>{s.so_luong_da_ban}</td>
                      <td style={{ color: '#2563eb', fontWeight: 700 }}>{dinh_dang_tien(s.doanh_thu)}</td>
                      <td>
                        <span className={`hs-ty-le-badge ${s.ty_le_chuyen_doi >= 10 ? 'tot' : s.ty_le_chuyen_doi >= 5 ? 'trung' : 'thap'}`}>
                          {s.ty_le_chuyen_doi.toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div>
              <h4 className="hs-bang-tieu-de hs-canh-bao">Sách nhiều lượt xem, ít chuyển đổi</h4>
              <table className="bang-so-lieu">
                <thead>
                  <tr>
                    <th>Tên sách</th>
                    <th>Lượt xem</th>
                    <th>Đã bán</th>
                    <th>TL chuyển đổi</th>
                  </tr>
                </thead>
                <tbody>
                  {du_lieu_hieu_suat.it_chuyen_doi?.length > 0
                    ? du_lieu_hieu_suat.it_chuyen_doi.map((s, i) => (
                      <tr key={s.ma_sach}>
                        <td>
                          <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{s.ten_sach}</div>
                          <div style={{ color: '#9ca3af', fontSize: '0.78rem' }}>{s.tac_gia}</div>
                        </td>
                        <td style={{ fontWeight: 600 }}>{s.luot_xem.toLocaleString('vi-VN')}</td>
                        <td>{s.so_luong_da_ban}</td>
                        <td>
                          <span className="hs-ty-le-badge thap">{s.ty_le_chuyen_doi.toFixed(1)}%</span>
                        </td>
                      </tr>
                    ))
                    : <tr><td colSpan="4" className="empty-text">Không có sách nào cần chú ý</td></tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}