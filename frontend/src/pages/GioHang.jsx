import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { dinh_dang_gia } from '../utils/dinh_dang';
import { FiTrash2, FiShoppingCart, FiBookOpen, FiPlus, FiMinus } from 'react-icons/fi';
import './GioHang.css';

function GioHang() {
  const { da_dang_nhap, nguoiDung } = useAuth();
  const dieu_huong = useNavigate();
  const queryClient = useQueryClient();

  // State quản lý số lượng từng item
  const [so_luong_map, dat_so_luong_map] = useState({});

  useEffect(() => {
    if (!da_dang_nhap) {
      dieu_huong('/dang_nhap');
    }
  }, [da_dang_nhap, dieu_huong]);

  const {
    data: gio_hang,
    isLoading: dang_tai,
  } = useQuery({
    queryKey: ['gio_hang', nguoiDung?.ma_nguoi_dung],
    queryFn: async () => {
      const phan_hoi = await api.get('/gio_hang');
      return phan_hoi.data.du_lieu;
    },
    staleTime: 0,
    enabled: da_dang_nhap,
  });

  const danh_sach = gio_hang?.danh_sach || [];

  // Đồng bộ số lượng ban đầu khi tải dữ liệu xong
  useEffect(() => {
    if (danh_sach.length > 0) {
      const initMap = {};
      danh_sach.forEach(item => {
        // Nếu backend có trả về số lượng từng món thì dùng item.so_luong, không thì mặc định là 1
        initMap[item.ma_sach] = item.so_luong || 1;
      });
      dat_so_luong_map(initMap);
    }
  }, [danh_sach]);

  const { mutate: xoa_item, isPending: dang_xoa } = useMutation({
    mutationFn: (ma_sach) => api.delete(`/gio_hang/${ma_sach}`),
    onSuccess: (_, ma_sach) => {
      queryClient.invalidateQueries({ queryKey: ['gio_hang'] });
      queryClient.invalidateQueries({ queryKey: ['so_luong_gio_hang'] });
      
      // Xóa item khỏi state số lượng
      dat_so_luong_map(cu => {
        const moi = { ...cu };
        delete moi[ma_sach];
        return moi;
      });
      
      toast.success('Đã xóa khỏi giỏ hàng');
    },
    onError: () => toast.error('Có lỗi xảy ra. Vui lòng thử lại.'),
  });

  // Hàm xử lý tăng/giảm số lượng
  const tang_so_luong = (ma_sach) => {
    dat_so_luong_map(cu => ({
      ...cu,
      [ma_sach]: Math.min((cu[ma_sach] || 1) + 1, 99) // Giới hạn tối đa 99 cuốn
    }));
  };

  const giam_so_luong = (ma_sach) => {
    dat_so_luong_map(cu => {
      const hien_tai = cu[ma_sach] || 1;
      if (hien_tai <= 1) return cu; // Không cho giảm dưới 1
      return { ...cu, [ma_sach]: hien_tai - 1 };
    });
  };

  // Tính toán tổng tiền và tổng số lượng thực tế
  const tong_so_luong_thuc = danh_sach.reduce((tong, item) => tong + (so_luong_map[item.ma_sach] || 1), 0);
  const tong_tien_thuc = danh_sach.reduce((tong, item) => tong + (item.don_gia * (so_luong_map[item.ma_sach] || 1)), 0);

  if (dang_tai) {
    return (
      <div className="trang_gio_hang">
        <div className="tieu_de_trang">
          <div className="icon_tieu_de_wrapper">
            <FiShoppingCart className="icon_tieu_de" />
          </div>
          <h1>Giỏ hàng của tôi</h1>
        </div>
        <div className="khung_gio_hang">
          <div className="danh_sach_item">
            {[1, 2, 3].map((i) => (
              <div className="item_gio_hang skeleton_item" key={i}>
                <div className="skeleton skeleton_anh" />
                <div className="thong_tin_item">
                  <div className="skeleton skeleton_ten" />
                  <div className="skeleton skeleton_tac_gia" />
                  <div className="skeleton skeleton_gia" />
                </div>
                <div className="skeleton skeleton_nut" />
              </div>
            ))}
          </div>
          <div className="khung_tom_tat skeleton_tomtat">
            <div className="skeleton skeleton_title_tomtat" />
            <div className="skeleton skeleton_dong" />
            <div className="skeleton skeleton_dong" style={{ width: '60%' }} />
            <div className="skeleton skeleton_nut_tt" />
          </div>
        </div>
      </div>
    );
  }

  if (danh_sach.length === 0) {
    return (
      <div className="trang_gio_hang">
        <div className="tieu_de_trang">
          <div className="icon_tieu_de_wrapper">
            <FiShoppingCart className="icon_tieu_de" />
          </div>
          <h1>Giỏ hàng của tôi</h1>
        </div>
        <div className="gio_hang_trong">
          <div className="icon_trong_wrapper">
            <FiBookOpen className="icon_gio_trong" />
          </div>
          <h2>Giỏ hàng đang trống</h2>
          <p>Hãy khám phá kho sách phong phú và thêm những cuốn bạn yêu thích!</p>
          <Link to="/trang_chu" className="nut_kham_pha">
            Khám phá sách ngay
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="trang_gio_hang">
      <div className="tieu_de_trang">
        <div className="icon_tieu_de_wrapper">
          <FiShoppingCart className="icon_tieu_de" />
        </div>
        <h1>Giỏ hàng của tôi</h1>
        <span className="badge_so_luong">{tong_so_luong_thuc} cuốn</span>
      </div>

      <div className="khung_gio_hang">
        <div className="danh_sach_item">
          {danh_sach.map((item, idx) => (
            <div
              className="item_gio_hang"
              key={item.ma_sach}
              style={{ animationDelay: `${idx * 0.07}s` }}
            >
              <Link to={`/sach/${item.ma_sach}`} className="anh_bia_link">
                <img src={item.anh_bia_url} alt={item.ten_sach} className="anh_bia_item" />
              </Link>

              <div className="thong_tin_item">
                <Link to={`/sach/${item.ma_sach}`} className="ten_sach_item">
                  {item.ten_sach}
                </Link>
                <p className="tac_gia_item">{item.tac_gia}</p>
                <p className="gia_item">{dinh_dang_gia(item.don_gia * (so_luong_map[item.ma_sach] || 1))}</p>
              </div>

              {/* KHU VỰC NÚT TĂNG GIẢM SỐ LƯỢNG */}
              <div className="khung_so_luong">
                <button
                  className="nut_so_luong nut_giam"
                  onClick={() => giam_so_luong(item.ma_sach)}
                  disabled={dang_xoa || so_luong_map[item.ma_sach] <= 1}
                >
                  <FiMinus />
                </button>
                <span className="hien_thi_so_luong">{so_luong_map[item.ma_sach] || 1}</span>
                <button
                  className="nut_so_luong nut_tang"
                  onClick={() => tang_so_luong(item.ma_sach)}
                  disabled={dang_xoa}
                >
                  <FiPlus />
                </button>
              </div>

              <button
                className="nut_xoa_item"
                onClick={() => xoa_item(item.ma_sach)}
                disabled={dang_xoa}
                title="Xóa khỏi giỏ hàng"
                aria-label="Xóa sách khỏi giỏ hàng"
              >
                <FiTrash2 />
              </button>
            </div>
          ))}
        </div>

        <div className="khung_tom_tat">
          <h3>Tóm tắt đơn hàng</h3>
          <div className="phan_cach_tomtat" />
          <div className="dong_chi_tiet">
            <span className="nhan_chi_tiet">Số lượng sách</span>
            <span className="gia_tri_chi_tiet">{tong_so_luong_thuc} cuốn</span>
          </div>
          <div className="dong_tong">
            <span>Tổng cộng</span>
            <span className="tong_tien">{dinh_dang_gia(tong_tien_thuc)}</span>
          </div>
          <button className="nut_thanh_toan" disabled title="Tính năng sắp ra mắt">
            Tiến hành thanh toán
          </button>
          <p className="chu_thich_thanh_toan">🔒 Tính năng thanh toán đang được phát triển</p>
        </div>
      </div>
    </div>
  );
}

export default GioHang;