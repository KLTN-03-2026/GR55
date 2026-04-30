import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import api from '../../services/api';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement,
  PointElement, LineElement, ArcElement, Title, Tooltip, Legend
} from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { FiUsers, FiBook, FiShoppingCart, FiDollarSign, FiStar, FiRefreshCw } from 'react-icons/fi';
import './ThongKe.css';

ChartJS.register(
  CategoryScale, LinearScale, BarElement,
  PointElement, LineElement, ArcElement,
  Title, Tooltip, Legend
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

  // Đơn hàng (chỉ dùng để xuất CSV)
  const [loc_don_hang, dat_loc_don_hang] = useState({
    tu_ngay: ngay_truoc_n_ngay(30),
    den_ngay: ngay_hom_nay(),
  });

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
      await Promise.all([tai_doanh_thu(), tai_sach_ban_chay(), tai_nguoi_dung_moi()]);
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
  const bieu_do_doanh_thu = {
    labels: du_lieu_doanh_thu.map(d => d.thoi_gian),
    datasets: [{
      label: 'Doanh thu (VNĐ)',
      data: du_lieu_doanh_thu.map(d => d.doanh_thu),
      backgroundColor: 'rgba(59, 130, 246, 0.7)',
    }],
  };
  const bieu_do_nguoi_dung = {
    labels: du_lieu_nguoi_dung.map(d => d.thoi_gian),
    datasets: [{
      label: 'Người dùng đăng ký mới',
      data: du_lieu_nguoi_dung.map(d => d.so_luong),
      borderColor: 'rgba(16, 185, 129, 1)',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      fill: true,
      tension: 0.3,
    }],
  };
  const bieu_do_the_loai = {
    labels: du_lieu_the_loai.map(d => d.ten_the_loai),
    datasets: [{
      data: du_lieu_the_loai.map(d => d.so_luong),
      backgroundColor: [
        '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
        '#06B6D4', '#F97316', '#84CC16', '#EC4899', '#6B7280',
      ],
    }],
  };
  const tuy_chon_the_loai = {
    responsive: true,
    plugins: {
      legend: { position: 'right' },
      tooltip: {
        callbacks: {
          label: ctx => `${ctx.label}: ${ctx.raw} sách (${du_lieu_the_loai[ctx.dataIndex]?.ty_le?.toFixed(1)}%)`,
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
            <input type="date" value={form_doanh_thu.tu_ngay} onChange={e => dat_form_doanh_thu({ ...form_doanh_thu, tu_ngay: e.target.value })} />
            <input type="date" value={form_doanh_thu.den_ngay} onChange={e => dat_form_doanh_thu({ ...form_doanh_thu, den_ngay: e.target.value })} />
            <select value={form_doanh_thu.loai} onChange={e => dat_form_doanh_thu({ ...form_doanh_thu, loai: e.target.value })}>
              <option value="ngay">Theo ngày</option>
              <option value="tuan">Theo tuần</option>
              <option value="thang">Theo tháng</option>
            </select>
            <button className="btn btn-primary" onClick={() => dat_loc_doanh_thu(form_doanh_thu)}>Xem</button>
            <button className="btn btn-outline" onClick={() => xuat_csv('doanh_thu', { ...loc_doanh_thu }, 'doanh_thu.csv')}>Xuất CSV</button>
          </div>
          {dang_tai_doanh_thu ? <div className="spinner">Đang tải...</div> : 
            du_lieu_doanh_thu.length > 0 ? (
              <div className="chart-container"><Bar data={bieu_do_doanh_thu} options={{ responsive: true, plugins: { legend: { position: 'top' } }, scales: { y: { ticks: { callback: val => dinh_dang_tien(val) } } } }} /></div>
            ) : <p className="empty-text">Không có dữ liệu trong khoảng thời gian này</p>
          }
        </div>

        {/* NGƯỜI DÙNG MỚI */}
        <div className="panel chart-panel">
          <h3>Người dùng đăng ký mới</h3>
          <div className="bo-loc-ngang">
            <input type="date" value={form_nguoi_dung.tu_ngay} onChange={e => dat_form_nguoi_dung({ ...form_nguoi_dung, tu_ngay: e.target.value })} />
            <input type="date" value={form_nguoi_dung.den_ngay} onChange={e => dat_form_nguoi_dung({ ...form_nguoi_dung, den_ngay: e.target.value })} />
            <button className="btn btn-primary" onClick={() => dat_loc_nguoi_dung(form_nguoi_dung)}>Xem</button>
            <button className="btn btn-outline" onClick={() => xuat_csv('nguoi_dung_moi', { ...loc_nguoi_dung }, 'nguoi_dung_moi.csv')}>Xuất CSV</button>
          </div>
          {dang_tai_nguoi_dung ? <div className="spinner">Đang tải...</div> : 
            du_lieu_nguoi_dung.length > 0 ? (
              <div className="chart-container"><Line data={bieu_do_nguoi_dung} options={{ responsive: true }} /></div>
            ) : <p className="empty-text">Không có dữ liệu trong khoảng thời gian này</p>
          }
        </div>
      </div>

      <div className="grid-bieu-do layout-khac">
        {/* SÁCH BÁN CHẠY (TOP 10) */}
        <div className="panel table-panel">
          <h3>Top 10 Sách Bán Chạy</h3>
          <div className="bo-loc-ngang">
            <input type="date" value={form_sach_ban_chay.tu_ngay} onChange={e => dat_form_sach_ban_chay({ ...form_sach_ban_chay, tu_ngay: e.target.value })} />
            <input type="date" value={form_sach_ban_chay.den_ngay} onChange={e => dat_form_sach_ban_chay({ ...form_sach_ban_chay, den_ngay: e.target.value })} />
            <button className="btn btn-primary" onClick={() => dat_loc_sach_ban_chay(form_sach_ban_chay)}>Xem</button>
            <button className="btn btn-outline" onClick={() => xuat_csv('sach_ban_chay', { ...loc_sach_ban_chay }, 'sach_ban_chay.csv')}>Xuất CSV</button>
          </div>
          {dang_tai_sach_ban_chay ? <div className="spinner">Đang tải...</div> : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Tên sách</th>
                  <th>Tác giả</th>
                  <th>Số lượng bán</th>
                  <th>Doanh thu</th>
                </tr>
              </thead>
              <tbody>
                {sach_ban_chay.map((sach, idx) => (
                  <tr key={sach.ma_sach}>
                    <td>{idx + 1}</td>
                    <td>{sach.ten_sach}</td>
                    <td>{sach.tac_gia}</td>
                    <td>{sach.so_luong_ban}</td>
                    <td className="text-highlight">{dinh_dang_tien(sach.doanh_thu)}</td>
                  </tr>
                ))}
                {sach_ban_chay.length === 0 && <tr><td colSpan="5" className="empty-text">Không có dữ liệu</td></tr>}
              </tbody>
            </table>
          )}
        </div>

        {/* THỂ LOẠI & XUẤT ĐƠN HÀNG */}
        <div className="panel layout-doc">
          <div className="pie-panel">
            <h3>Tỷ lệ sách theo thể loại</h3>
            {dang_tai_the_loai ? <div className="spinner">Đang tải...</div> : (
              <div className="chart-container-pie">
                <Pie data={bieu_do_the_loai} options={tuy_chon_the_loai} />
              </div>
            )}
          </div>
          
          <div className="csv-don-hang-panel">
            <h3>Báo cáo đơn hàng</h3>
            <div className="bo-loc-ngang wrap-loc">
              <input type="date" value={loc_don_hang.tu_ngay} onChange={e => dat_loc_don_hang({ ...loc_don_hang, tu_ngay: e.target.value })} />
              <input type="date" value={loc_don_hang.den_ngay} onChange={e => dat_loc_don_hang({ ...loc_don_hang, den_ngay: e.target.value })} />
              <button className="btn btn-outline w-full" onClick={() => xuat_csv('don_hang', { ...loc_don_hang }, 'don_hang.csv')}>Xuất CSV Đơn hàng</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}