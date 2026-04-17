import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import TheCardSach from "../../components/TheCardSach";
import "./DanhSachSach.css";

const SO_LUONG_GOI_Y = 20;

export default function DanhSachGoiY() {
  // Đã gỡ bỏ state trang_hien_tai
  const { da_dang_nhap, nguoiDung } = useAuth();
  const ma_nd = da_dang_nhap ? nguoiDung?.ma_nguoi_dung : undefined;

  const { data: ket_qua, isLoading: dang_tai } = useQuery({
    queryKey: ["goi_y_sach", ma_nd ?? "khach"], // Đồng bộ key để share cache với TrangChu
    queryFn: async () => {
      const phan_hoi = await api.get("/goi_y", {
        params: { so_luong: SO_LUONG_GOI_Y }, // Chỉ truyền số lượng theo API mới
      });
      return phan_hoi.data;
    },
    // Stale time: 30 phút cho user đã đăng nhập, 60 phút cho khách
    staleTime: da_dang_nhap ? 30 * 60 * 1000 : 60 * 60 * 1000,
  });

  const danh_sach = ket_qua?.danh_sach || [];
  
  // Tính tổng số bản ghi trực tiếp dựa trên số lượng trả về
  const tong_ban_ghi = danh_sach.length;

  return (
    <div className="trang_danh_sach">
      <div className="dau_trang_danh_sach">
        <Link to="/trang_chu" className="nut_quay_lai_ds">← Trang chủ</Link>
        <h1 className="tieu_de_danh_sach">Gợi ý cho bạn</h1>
        {tong_ban_ghi > 0 && (
          <span className="so_luong_sach">{tong_ban_ghi} cuốn sách</span>
        )}
      </div>

      <div className="luoi_sach_ds">
        {dang_tai
          ? Array.from({ length: SO_LUONG_GOI_Y }).map((_, i) => (
              <TheCardSach key={i} skeleton />
            ))
          : danh_sach.length === 0
            ? <p className="chua_co_du_lieu_ds">Chưa có gợi ý nào cho bạn lúc này.</p>
            : danh_sach.map((sach) => (
                <TheCardSach key={sach.ma_sach} sach={sach} />
              ))}
      </div>

      {/* Toàn bộ khối UI phân_trang_ds đã được gỡ bỏ vì API không còn hỗ trợ */}
    </div>
  );
}