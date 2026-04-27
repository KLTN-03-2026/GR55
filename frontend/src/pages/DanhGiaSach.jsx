import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { Link } from "react-router-dom"; // Thêm để điều hướng đăng nhập
import "./DanhGiaSach.css";

const KICH_THUOC_DANH_GIA = 5;
const DIEM_TOI_DA = 5;

export default function DanhGiaSach({ ma_sach }) {
  const queryClient = useQueryClient();
  const { da_dang_nhap, nguoiDung } = useAuth();

  // State điều khiển danh sách
  const [sap_xep, dat_sap_xep] = useState("moi_nhat");
  const [trang_hien_tai, dat_trang_hien_tai] = useState(1);

  // State cho form thêm mới
  const [so_sao_moi, dat_so_sao_moi] = useState(0);
  const [noi_dung_moi, dat_noi_dung_moi] = useState("");

  // State cho form sửa (inline)
  const [dang_sua_id, dat_dang_sua_id] = useState(null); // Lưu ma_dg đang sửa
  const [so_sao_sua, dat_so_sao_sua] = useState(0);
  const [noi_dung_sua, dat_noi_dung_sua] = useState("");

  // 1. Query lấy danh sách đánh giá
  const { data: du_lieu_dg, isLoading: dang_tai_dg } = useQuery({
    queryKey: ["danh_gia_sach", ma_sach, sap_xep, trang_hien_tai],
    queryFn: async () => {
      const phan_hoi = await api.get(`/sach/${ma_sach}/danh_gia`, {
        params: {
          sort: sap_xep,
          trang: trang_hien_tai,
          kich_thuoc: KICH_THUOC_DANH_GIA,
        },
        headers: da_dang_nhap ? { "X-User-Id": nguoiDung?.ma_nguoi_dung } : {},
      });
      return phan_hoi.data;
    },
    enabled: !!ma_sach,
    placeholderData: (prev) => prev,
    staleTime: 10 * 60 * 1000,
  });

  // 2. Mutations (Thêm, Sửa, Xóa)
  const invalidate_va_toast = (message) => {
    toast.success(message);
    queryClient.invalidateQueries({ queryKey: ["danh_gia_sach", ma_sach] });
    queryClient.invalidateQueries({ queryKey: ["chi_tiet_sach", ma_sach] }); // Cập nhật điểm trung bình ngoài trang chi tiết
  };

  const { mutate: them_danh_gia, isPending: dang_them } = useMutation({
    mutationFn: () => api.post(`/sach/${ma_sach}/danh_gia`, { so_sao: so_sao_moi, noi_dung: noi_dung_moi }),
    onSuccess: (res) => {
      if (res.data.success) {
        dat_so_sao_moi(0); dat_noi_dung_moi("");
        invalidate_va_toast("Đánh giá thành công!");
      } else toast.error(res.data.message);
    },
    onError: (err) => toast.error(err.response?.data?.message || "Lỗi khi thêm đánh giá"),
  });

  const { mutate: sua_danh_gia, isPending: dang_luu_sua } = useMutation({
    mutationFn: () => api.put(`/sach/${ma_sach}/danh_gia`, { so_sao: so_sao_sua, noi_dung: noi_dung_sua }),
    onSuccess: (res) => {
      if (res.data.success) {
        dat_dang_sua_id(null);
        invalidate_va_toast("Đã cập nhật đánh giá");
      } else toast.error(res.data.message);
    },
    onError: (err) => toast.error(err.response?.data?.message || "Lỗi khi sửa"),
  });

  const { mutate: xoa_danh_gia, isPending: dang_xoa } = useMutation({
    mutationFn: () => api.delete(`/sach/${ma_sach}/danh_gia`),
    onSuccess: (res) => {
      if (res.data.success) invalidate_va_toast("Đã xóa đánh giá");
      else toast.error(res.data.message);
    },
    onError: (err) => toast.error(err.response?.data?.message || "Lỗi khi xóa"),
  });

  // Helper hiển thị sao
  function hien_thi_sao(diem, loai = "static", callback = null) {
    const diem_so = Math.round(diem || 0);
    if (loai === "interactive") {
      return Array.from({ length: DIEM_TOI_DA }).map((_, i) => (
        <span key={i} className={`sao_bam ${diem >= i + 1 ? "kich_hoat" : ""}`} onClick={() => callback(i + 1)}>
          ★
        </span>
      ));
    }
    return "★".repeat(diem_so) + "☆".repeat(DIEM_TOI_DA - diem_so);
  }

  if (dang_tai_dg) return <div className="section_danh_gia_sach">Đang tải đánh giá...</div>;

  const { diem_trung_binh, tong_so_danh_gia, phan_bo_sao, danh_sach, tong_so_trang } = du_lieu_dg || {};
  const da_co_danh_gia_cua_toi = danh_sach?.some(dg => dg.la_cua_toi);

  return (
    <div className="section_danh_gia_sach">
      <h2 className="tieu_de_lon">Đánh giá từ độc giả</h2>

      {/* 1. Tổng quan */}
      <div className="khung_tong_quan_danh_gia">
        <div className="cot_diem_so">
          <span className="con_so_trung_binh">{diem_trung_binh?.toFixed(1) || 0}</span>
          <div className="sao_vang_lon">{hien_thi_sao(diem_trung_binh)}</div>
          <p className="chu_phu">{tong_so_danh_gia || 0} đánh giá</p>
        </div>
        <div className="cot_bieu_do_sao">
          {(phan_bo_sao || []).map((hang) => (
            <div key={hang.so_sao} className="hang_sao">
              <span className="nhan_sao">{hang.so_sao} sao</span>
              <div className="thanh_phan_bo_nen">
                <div className="thanh_phan_bo_day" style={{ width: `${hang.phan_tram}%` }} />
              </div>
              <span className="so_luong_phu">{hang.so_luong}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Form thêm đánh giá */}
      <div className="khung_viet_danh_gia">
        {!da_dang_nhap ? (
          <p className="thong_bao_login">
            <Link to="/dang_nhap">Đăng nhập</Link> để để lại nhận xét của bạn.
          </p>
        ) : !da_co_danh_gia_cua_toi ? (
          <div className="form_nhap_dg">
            <h3>Viết nhận xét của bạn</h3>
            <div className="nhom_chon_sao">{hien_thi_sao(so_sao_moi, "interactive", dat_so_sao_moi)}</div>
            <textarea
              placeholder="Cảm nhận của bạn về cuốn sách (tối đa 500 ký tự)..."
              value={noi_dung_moi}
              onChange={(e) => dat_noi_dung_moi(e.target.value)}
              maxLength={500}
            />
            <div className="thanh_duoi_form">
              <span>{noi_dung_moi.length}/500</span>
              <button disabled={so_sao_moi === 0 || dang_them} onClick={() => them_danh_gia()}>
                {dang_them ? "Đang gửi..." : "Gửi đánh giá"}
              </button>
            </div>
          </div>
        ) : null}
      </div>

      {/* 3. Bộ lọc */}
      <div className="thanh_dieu_khien_dg">
        <span className="chu_label">Sắp xếp:</span>
        <div className="nhom_nut_loc">
          {[{ ma: "moi_nhat", ten: "Mới nhất" }, { ma: "cao_nhat", ten: "Điểm cao" }, { ma: "cu_nhat", ten: "Cũ nhất" }].map((item) => (
            <button
              key={item.ma}
              className={`nut_loc_dg ${sap_xep === item.ma ? "dang_chon" : ""}`}
              onClick={() => { dat_sap_xep(item.ma); dat_trang_hien_tai(1); }}
            >
              {item.ten}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Danh sách nhận xét */}
      <div className="danh_sach_nhan_xet">
        {danh_sach?.map((dg) => (
          <div key={dg.ma_dg} className={`the_nhan_xet ${dg.la_cua_toi ? "nhan_xet_cua_toi" : ""}`}>
            <div className="dong_dau_the">
              <div className="thong_tin_nguoi_dung">
                <div className="avatar_chu_cai">{dg.ten_nguoi_dung?.charAt(0).toUpperCase()}</div>
                <div>
                  <span className="ten_hien_thi">{dg.ten_nguoi_dung}</span>
                  {dg.la_cua_toi && <span className="nhan_so_huu">Của bạn</span>}
                  <div className="sao_va_ngay">
                    <span className="sao_nho">{hien_thi_sao(dg.so_sao)}</span>
                    <span className="ngay_dang">{new Date(dg.ngay_tao).toLocaleDateString("vi-VN")}</span>
                  </div>
                </div>
              </div>
              {dg.la_cua_toi && (
                <div className="nhom_nut_tac_vu">
                  <button className="nut_sua_dg" onClick={() => {
                    dat_dang_sua_id(dg.ma_dg);
                    dat_so_sao_sua(dg.so_sao);
                    dat_noi_dung_sua(dg.noi_dung);
                  }}>Sửa</button>
                  <button className="nut_xoa_dg" onClick={() => { if (window.confirm("Xóa đánh giá này?")) xoa_danh_gia(); }}>Xóa</button>
                </div>
              )}
            </div>

            {dang_sua_id === dg.ma_dg ? (
              <div className="form_sua_inline">
                <div className="nhom_chon_sao">{hien_thi_sao(so_sao_sua, "interactive", dat_so_sao_sua)}</div>
                <textarea value={noi_dung_sua} onChange={(e) => dat_noi_dung_sua(e.target.value)} maxLength={500} />
                <div className="nhom_nut_sua">
                  <button onClick={() => sua_danh_gia()} disabled={dang_luu_sua}>Lưu</button>
                  <button className="nut_huy" onClick={() => dat_dang_sua_id(null)}>Hủy</button>
                </div>
              </div>
            ) : (
              <p className="noi_dung_text">{dg.noi_dung}</p>
            )}
          </div>
        ))}
      </div>

      {/* 5. Phân trang */}
      {tong_so_trang > 1 && (
        <div className="thanh_phan_trang_dg">
          <button disabled={trang_hien_tai === 1} onClick={() => dat_trang_hien_tai(t => t - 1)}>‹</button>
          <span className="so_trang_hien_tai">Trang {trang_hien_tai} / {tong_so_trang}</span>
          <button disabled={trang_hien_tai === tong_so_trang} onClick={() => dat_trang_hien_tai(t => t + 1)}>›</button>
        </div>
      )}
    </div>
  );
}