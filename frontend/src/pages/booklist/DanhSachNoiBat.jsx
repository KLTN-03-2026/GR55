import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../../services/api";
import TheCardSach from "../../components/TheCardSach";
import "./DanhSachSach.css";

const KICH_THUOC_TRANG = 20;

export default function DanhSachNoiBat() {
  const [trang_hien_tai, dat_trang_hien_tai] = useState(1);

  const { data: ket_qua, isLoading: dang_tai } = useQuery({
    queryKey: ["sach_noi_bat", trang_hien_tai, KICH_THUOC_TRANG],
    queryFn: async () => {
      const phan_hoi = await api.get("/home/sach_noi_bat", {
        params: { trang: trang_hien_tai, kich_thuoc: KICH_THUOC_TRANG },
      });
      return phan_hoi.data;
    },
    staleTime: 30 * 60 * 1000,
  });

  const danh_sach = ket_qua?.danh_sach || [];
  const tong_so_trang = ket_qua?.tong_so_trang || 1;
  const tong_ban_ghi = ket_qua?.tong_so_ban_ghi || 0;

  return (
    <div className="trang_danh_sach">
      <div className="dau_trang_danh_sach">
        <Link to="/trang_chu" className="nut_quay_lai_ds">← Trang chủ</Link>
        <h1 className="tieu_de_danh_sach">Sách nổi bật</h1>
        {tong_ban_ghi > 0 && (
          <span className="so_luong_sach">{tong_ban_ghi} cuốn sách</span>
        )}
      </div>

      <div className="luoi_sach_ds">
        {dang_tai
          ? Array.from({ length: KICH_THUOC_TRANG }).map((_, i) => (
              <TheCardSach key={i} skeleton />
            ))
          : danh_sach.length === 0
            ? <p className="chua_co_du_lieu_ds">Chưa có sách nào.</p>
            : danh_sach.map((sach) => (
                <TheCardSach key={sach.ma_sach} sach={sach} />
              ))}
      </div>

      {tong_so_trang > 1 && (
        <div className="phan_trang_ds">
          <button
            className="nut_trang_ds"
            onClick={() => dat_trang_hien_tai((t) => t - 1)}
            disabled={trang_hien_tai <= 1}
          >
            ‹
          </button>
          <span className="vi_tri_trang_ds">
            Trang {trang_hien_tai} / {tong_so_trang}
          </span>
          <button
            className="nut_trang_ds"
            onClick={() => dat_trang_hien_tai((t) => t + 1)}
            disabled={trang_hien_tai >= tong_so_trang}
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
}
