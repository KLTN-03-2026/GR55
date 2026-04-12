import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import "./DanhGiaSach.css";

const KICH_THUOC_DANH_GIA = 5;
const DIEM_TOI_DA = 5;

export default function DanhGiaSach({ ma_sach }) {
  const { da_dang_nhap, nguoiDung } = useAuth();

  const [sap_xep, dat_sap_xep] = useState("moi_nhat");
  const [trang_hien_tai, dat_trang_hien_tai] = useState(1);

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

  function hien_thi_sao(diem) {
    const diem_so = Math.round(diem || 0);
    return "★".repeat(diem_so) + "☆".repeat(DIEM_TOI_DA - diem_so);
  }

  function xu_ly_doi_sap_xep(loai_moi) {
    dat_sap_xep(loai_moi);
    dat_trang_hien_tai(1);
  }

  if (dang_tai_dg) {
    return (
      <div className="section_danh_gia_sach">
        <h2 className="tieu_de_lon">Đánh giá từ độc giả</h2>
        {/* Skeleton: tổng quan */}
        <div className="khung_tong_quan_danh_gia">
          <div className="cot_diem_so" style={{ borderRight: "1px solid #e5e7eb", paddingRight: 32 }}>
            <div className="skeleton_dg" style={{ width: 80, height: 64, margin: "0 auto 12px" }} />
            <div className="skeleton_dg" style={{ width: 120, height: 20, margin: "0 auto 8px" }} />
            <div className="skeleton_dg" style={{ width: 80, height: 14, margin: "0 auto" }} />
          </div>
          <div className="cot_bieu_do_sao">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="hang_sao">
                <div className="skeleton_dg" style={{ width: 50, height: 14 }} />
                <div className="skeleton_dg" style={{ flex: 1, height: 8 }} />
                <div className="skeleton_dg" style={{ width: 24, height: 14 }} />
              </div>
            ))}
          </div>
        </div>
        {/* Skeleton: danh sách đánh giá */}
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="the_nhan_xet">
            <div className="dong_dau_the">
              <div className="thong_tin_nguoi_dung">
                <div className="skeleton_dg" style={{ width: 44, height: 44, borderRadius: 10, flexShrink: 0 }} />
                <div>
                  <div className="skeleton_dg" style={{ width: 120, height: 14, marginBottom: 8 }} />
                  <div className="skeleton_dg" style={{ width: 160, height: 12 }} />
                </div>
              </div>
            </div>
            <div className="skeleton_dg" style={{ width: "80%", height: 14, marginTop: 16, marginLeft: 60 }} />
            <div className="skeleton_dg" style={{ width: "60%", height: 14, marginTop: 8, marginLeft: 60 }} />
          </div>
        ))}
      </div>
    );
  }

  const { diem_trung_binh, tong_so_danh_gia, phan_bo_sao, danh_sach, tong_so_trang } =
    du_lieu_dg || {};

  return (
    <div className="section_danh_gia_sach">
      <h2 className="tieu_de_lon">Đánh giá từ độc giả</h2>

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

      <div className="thanh_dieu_khien_dg">
        <span className="chu_label">Sắp xếp:</span>
        <div className="nhom_nut_loc">
          {[
            { ma: "moi_nhat", ten: "Mới nhất" },
            { ma: "cao_nhat", ten: "Điểm cao" },
            { ma: "cu_nhat", ten: "Cũ nhất" },
          ].map((item) => (
            <button
              key={item.ma}
              className={`nut_loc_dg ${sap_xep === item.ma ? "dang_chon" : ""}`}
              onClick={() => xu_ly_doi_sap_xep(item.ma)}
            >
              {item.ten}
            </button>
          ))}
        </div>
      </div>

      <div className="danh_sach_nhan_xet">
        {!danh_sach || danh_sach.length === 0 ? (
          <p className="thong_bao_trong">Sách này chưa có đánh giá nào.</p>
        ) : (
          danh_sach.map((dg) => (
            <div key={dg.ma_dg} className={`the_nhan_xet ${dg.la_cua_toi ? "nhan_xet_cua_toi" : ""}`}>
              <div className="dong_dau_the">
                <div className="thong_tin_nguoi_dung">
                  <div className="avatar_chu_cai">
                    {dg.ten_nguoi_dung?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <span className="ten_hien_thi">{dg.ten_nguoi_dung}</span>
                    {dg.la_cua_toi && <span className="nhan_so_huu">Của bạn</span>}
                    <div className="sao_va_ngay">
                      <span className="sao_nho">{hien_thi_sao(dg.so_sao)}</span>
                      <span className="ngay_dang">
                        {new Date(dg.ngay_tao).toLocaleDateString("vi-VN")}
                      </span>
                    </div>
                  </div>
                </div>
                {dg.la_cua_toi && (
                  <div className="nhom_nut_tac_vu">
                    <button className="nut_sua_dg">Sửa</button>
                    <button className="nut_xoa_dg">Xóa</button>
                  </div>
                )}
              </div>
              <p className="noi_dung_text">{dg.noi_dung}</p>
            </div>
          ))
        )}
      </div>

      {tong_so_trang > 1 && (
        <div className="thanh_phan_trang_dg">
          <button
            className="nut_trang_dg"
            disabled={trang_hien_tai === 1}
            onClick={() => dat_trang_hien_tai((t) => t - 1)}
          >
            ‹
          </button>
          <span className="so_trang_hien_tai">Trang {trang_hien_tai} / {tong_so_trang}</span>
          <button
            className="nut_trang_dg"
            disabled={trang_hien_tai === tong_so_trang}
            onClick={() => dat_trang_hien_tai((t) => t + 1)}
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
}
