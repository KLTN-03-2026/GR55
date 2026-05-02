import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { dinh_dang_gia } from "../utils/dinh_dang";
import TheCardSach from "../components/TheCardSach";
import DanhGiaSach from "./DanhGiaSach";
import { FiShoppingCart } from "react-icons/fi";
import "./SachChiTiet.css";

const MO_TA_NGAN = 300;

export default function SachChiTiet() {
  const { ma_sach } = useParams();
  const dieu_huong = useNavigate();
  const { da_dang_nhap, nguoiDung } = useAuth();
  const queryClient = useQueryClient();

  const [dang_xu_ly_yeu_thich, dat_dang_xu_ly_yeu_thich] = useState(false);
  const [hien_mo_ta_day_du, dat_hien_mo_ta_day_du] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [ma_sach]);

  const {
    data: chi_tiet,
    isLoading: dang_tai,
    isError: co_loi,
  } = useQuery({
    queryKey: ["chi_tiet_sach", ma_sach, nguoiDung?.ma_nguoi_dung ?? null],
    queryFn: async () => {
      const phan_hoi = await api.get(`/sach/${ma_sach}`, {
        headers: da_dang_nhap ? { "X-User-Id": nguoiDung?.ma_nguoi_dung } : {},
      });
      return phan_hoi.data.du_lieu;
    },
    staleTime: 0,
    enabled: !!ma_sach,
  });

  const { data: sach_lien_quan, isLoading: dang_tai_lien_quan } = useQuery({
    queryKey: ["sach_lien_quan", ma_sach, 1, 8],
    queryFn: async () => {
      const phan_hoi = await api.get(`/sach/${ma_sach}/lien_quan`, {
        params: { trang: 1, kich_thuoc: 8 },
      });
      return phan_hoi.data;
    },
    staleTime: 30 * 60 * 1000,
    enabled: !!ma_sach,
  });

  const { mutate: them_vao_gio, isPending: dang_them } = useMutation({
    mutationFn: () => api.post("/gio_hang", { ma_sach: chi_tiet.ma_sach }),
    onSuccess: (phan_hoi) => {
      if (phan_hoi.data.thanh_cong) {
        toast.success("Đã thêm vào giỏ hàng");
        queryClient.invalidateQueries({ queryKey: ["so_luong_gio_hang"] });
        queryClient.invalidateQueries({ queryKey: ["gio_hang"] });
      } else {
        toast.info(phan_hoi.data.thong_bao);
      }
    },
    onError: () => toast.error("Có lỗi xảy ra. Vui lòng thử lại."),
  });

  const { mutate: mua_ngay, isPending: dang_mua } = useMutation({
    mutationFn: () => api.post("/gio_hang", { ma_sach: chi_tiet.ma_sach }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["so_luong_gio_hang"] });
      queryClient.invalidateQueries({ queryKey: ["gio_hang"] });
      dieu_huong("/thanh_toan/xac_nhan");
    },
    onError: () => {
      // Sách đã trong giỏ hoặc lỗi khác — vẫn chuyển đến thanh toán
      dieu_huong("/thanh_toan/xac_nhan");
    },
  });

  async function xu_ly_yeu_thich() {
    if (!da_dang_nhap) {
      toast.info("Vui lòng đăng nhập để thêm vào yêu thích");
      dieu_huong("/dang_nhap");
      return;
    }
    dat_dang_xu_ly_yeu_thich(true);
    try {
      if (chi_tiet.da_yeu_thich) {
        await api.delete(`/thu_vien/yeu_thich/${chi_tiet.ma_sach}`);
      } else {
        await api.post(`/thu_vien/yeu_thich/${chi_tiet.ma_sach}`);
      }
      toast.success(
        chi_tiet.da_yeu_thich ? "Đã bỏ yêu thích" : "Đã thêm vào yêu thích",
      );
      queryClient.invalidateQueries({ queryKey: ["chi_tiet_sach", ma_sach] });
      queryClient.invalidateQueries({ queryKey: ["sach_yeu_thich"] });
    } catch {
      toast.error("Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      dat_dang_xu_ly_yeu_thich(false);
    }
  }

  function xac_dinh_nut_hanh_dong(sach) {
    const mien_phi = Number(sach.gia) === 0;
    const { da_mua, la_hoi_vien, sach_thuoc_goi_hoi_vien, da_bat_dau_doc } =
      sach;

    const co_quyen_doc =
      mien_phi || da_mua || (la_hoi_vien && sach_thuoc_goi_hoi_vien);
    if (co_quyen_doc) return da_bat_dau_doc ? "doc_tiep" : "doc_ngay";
    if (sach_thuoc_goi_hoi_vien && !la_hoi_vien) return "nang_cap_hoi_vien";
    return "mua_ngay";
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
                style={{
                  width: `${w}%`,
                  height: i === 4 ? 80 : 20,
                  marginBottom: 12,
                }}
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
        <button
          className="nut_chinh nut_doc_sach"
          onClick={() => dieu_huong(-1)}
        >
          Quay lại
        </button>
      </div>
    );
  }

  const loai_nut = xac_dinh_nut_hanh_dong(chi_tiet);

  return (
    <div className="trang_chi_tiet_sach">
      {/* === Khu vực chi tiết chính === */}
      <div className="khung_chi_tiet_chinh">
        {/* Cột trái: ảnh bìa, nút yêu thích, nút đọc thử */}
        <div className="cot_anh_bia">
          <div className="khung_anh_bia_lon">
            <img
              src={chi_tiet.anh_bia_url}
              alt={chi_tiet.ten_sach}
              className="anh_bia_lon"
            />
          </div>
          {da_dang_nhap && (
            <button
              className={`nut_yeu_thich ${chi_tiet.da_yeu_thich ? "da_yeu_thich" : ""}`}
              onClick={xu_ly_yeu_thich}
              disabled={dang_xu_ly_yeu_thich}
            >
              {chi_tiet.da_yeu_thich ? "♥ Đã yêu thích" : "♡ Yêu thích"}
            </button>
          )}

          {/* ĐỌC THỬ ĐƯỢC CHUYỂN SANG ĐÂY */}
          {chi_tiet.cho_phep_doc_thu && Number(chi_tiet.gia) > 0 && (
            <button
              className="nut_phu nut_doc_thu"
              onClick={() => dieu_huong(`/doc_thu/${chi_tiet.ma_sach}`)}
            >
              Đọc thử ({chi_tiet.so_trang_doc_thu} trang)
            </button>
          )}
        </div>

        {/* Cột phải: thông tin + nút hành động */}
        <div className="cot_thong_tin">
          <div className="nhom_badge_danh_muc">
            {chi_tiet.danh_sach_danh_muc?.map((dm) => (
              <span key={dm.ma_dm} className="badge_danh_muc">
                {dm.ten_danh_muc}
              </span>
            ))}
          </div>

          <h1 className="ten_sach_chi_tiet">{chi_tiet.ten_sach}</h1>
          <p className="tac_gia_chi_tiet">Tác giả: {chi_tiet.tac_gia}</p>

          <div className="khung_danh_gia_ngan">
            <span className="sao_danh_gia">★</span>
            <span className="diem_so">
              {chi_tiet.danh_gia_trung_binh?.toFixed(1) || "0.0"}
            </span>
            <span className="so_luot_ngan">
              ({chi_tiet.so_luot_danh_gia || 0} đánh giá)
            </span>
            {Number(chi_tiet.gia) > 0 && (
              <>
                <span>•</span>
                <span className="luot_xem_ngan">
                  {chi_tiet.so_luong_da_ban || 0} đã bán
                </span>
              </>
            )}
          </div>

          <div className="khung_gia">
            {Number(chi_tiet.gia) === 0 ? (
              <span className="gia_mien_phi">Miễn phí</span>
            ) : chi_tiet.gia_giam ? (
              <>
                <span className="gia_goc_gach_chan">
                  {dinh_dang_gia(chi_tiet.gia)}
                </span>
                <span className="gia_sau_giam">
                  {dinh_dang_gia(chi_tiet.gia_giam)}
                </span>
              </>
            ) : (
              <span className="gia_chinh">{dinh_dang_gia(chi_tiet.gia)}</span>
            )}
          </div>

          <div className="khung_mo_ta">
            <p
              className={`mo_ta_sach ${!hien_mo_ta_day_du ? "mo_ta_rut_gon" : ""}`}
            >
              {chi_tiet.mo_ta}
            </p>
            {(chi_tiet.mo_ta?.length || 0) > MO_TA_NGAN && (
              <button
                className="nut_xem_mo_ta"
                onClick={() => dat_hien_mo_ta_day_du((v) => !v)}
              >
                {hien_mo_ta_day_du ? "Thu gọn" : "Xem thêm"}
              </button>
            )}
          </div>

          <div className="nhom_nut_hanh_dong">
            {loai_nut === "doc_ngay" && (
              <button
                className="nut_chinh nut_doc_sach"
                onClick={() => {
                  const duong_dan = Number(chi_tiet.gia) === 0
                    ? `/doc_sach_mien_phi/${chi_tiet.ma_sach}`
                    : `/doc_sach/${chi_tiet.ma_sach}`;
                  dieu_huong(duong_dan);
                }}
              >
                Đọc sách
              </button>
            )}

            {loai_nut === "doc_tiep" && (
              <button
                className="nut_chinh nut_doc_sach"
                onClick={() => {
                  const duong_dan = Number(chi_tiet.gia) === 0
                    ? `/doc_sach_mien_phi/${chi_tiet.ma_sach}`
                    : `/doc_sach/${chi_tiet.ma_sach}`;
                  dieu_huong(duong_dan);
                }}
              >
                Đọc tiếp
              </button>
            )}

            {loai_nut === "nang_cap_hoi_vien" && (
              <button
                className="nut_chinh nut_hoi_vien"
                onClick={() => dieu_huong("/hoi_vien")}
              >
                Nâng cấp hội viên
              </button>
            )}

            {loai_nut === "mua_ngay" && (
              <div className="nhom_mua_gio">
                <button
                  className="nut_chinh nut_mua"
                  disabled={dang_mua}
                  onClick={() => {
                    if (!da_dang_nhap) {
                      dieu_huong("/dang_nhap");
                      return;
                    }
                    mua_ngay();
                  }}
                >
                  {dang_mua ? "Đang xử lý..." : `Mua ngay — ${dinh_dang_gia(chi_tiet.gia_giam ?? chi_tiet.gia)}`}
                </button>

                <button
                  className="nut_phu nut_gio_hang"
                  onClick={() => {
                    if (!da_dang_nhap) {
                      dieu_huong("/dang_nhap");
                      return;
                    }
                    them_vao_gio();
                  }}
                  disabled={dang_them}
                >
                  <FiShoppingCart />
                  {dang_them ? "Đang thêm..." : "Thêm vào giỏ"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* === Phần đánh giá === */}
      <DanhGiaSach ma_sach={ma_sach} />

      {/* === Sách liên quan === */}
      <section className="section_sach_lien_quan">
        <div className="tieu_de_section">
          <h2 className="tieu_de_section_chi_tiet">Sách liên quan</h2>
          {(sach_lien_quan?.tong_so_ban_ghi || 0) > 8 && (
            <Link
              to={`/tim_kiem?danh_muc=${chi_tiet?.danh_sach_danh_muc?.[0]?.ma_dm || ""}`}
              className="nut_xem_them"
            >
              Xem thêm →
            </Link>
          )}
        </div>

        <div className="luoi_sach">
          {dang_tai_lien_quan ? (
            Array.from({ length: 8 }).map((_, i) => (
              <TheCardSach key={i} skeleton={true} />
            ))
          ) : (sach_lien_quan?.danh_sach || []).length === 0 ? (
            <p className="chua_co_du_lieu">Không có sách liên quan.</p>
          ) : (
            (sach_lien_quan?.danh_sach || []).map((s) => (
              <TheCardSach key={s.ma_sach} sach={s} />
            ))
          )}
        </div>
      </section>
    </div>
  );
}
