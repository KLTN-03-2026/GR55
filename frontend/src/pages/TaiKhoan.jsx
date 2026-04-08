import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import "./TaiKhoan.css";

const TAB_THONG_TIN = "thong_tin";
const TAB_MAT_KHAU = "mat_khau";

function FormThongTin({ thong_tin, dang_tai, dang_luu_tt, loi_server_tt, loi_tt, gia_tri_tt, dat_gia_tri_tt, dat_loi_tt, kiem_tra_truong_tt, xu_ly_cap_nhat }) {
  return (
    <form onSubmit={xu_ly_cap_nhat} noValidate>
      {loi_server_tt && (
        <div className="thong_bao_server_loi">{loi_server_tt}</div>
      )}
      <div className="nhom_truong">
        <label className="nhan_truong">Email <span className="nhan_chi_xem">(không thể thay đổi)</span></label>
        {dang_tai ? <div className="o_skeleton skeleton_input" /> : (
          <input type="email" className="o_nhap o_nhap_disabled" value={thong_tin?.email || ""} readOnly />
        )}
      </div>
      <div className="nhom_truong">
        <label className="nhan_truong">Họ tên <span className="dau_bat_buoc">*</span></label>
        {dang_tai ? <div className="o_skeleton skeleton_input" /> : (
          <input type="text" className={`o_nhap ${loi_tt.ho_ten ? "loi" : ""}`} value={gia_tri_tt.ho_ten}
            onChange={(e) => {
              dat_gia_tri_tt((prev) => ({ ...prev, ho_ten: e.target.value }));
              dat_loi_tt((prev) => ({ ...prev, ho_ten: kiem_tra_truong_tt("ho_ten", e.target.value) }));
            }}
            placeholder="Nhập họ và tên đầy đủ" maxLength={50}
          />
        )}
        <span className="thong_bao_loi">{loi_tt.ho_ten}</span>
      </div>
      <div className="nhom_truong">
        <label className="nhan_truong">Số điện thoại <span className="dau_bat_buoc">*</span></label>
        {dang_tai ? <div className="o_skeleton skeleton_input" /> : (
          <input type="tel" className={`o_nhap ${loi_tt.so_dien_thoai ? "loi" : ""}`} value={gia_tri_tt.so_dien_thoai}
            onChange={(e) => {
              dat_gia_tri_tt((prev) => ({ ...prev, so_dien_thoai: e.target.value }));
              dat_loi_tt((prev) => ({ ...prev, so_dien_thoai: kiem_tra_truong_tt("so_dien_thoai", e.target.value) }));
            }}
            placeholder="0xxxxxxxxx" maxLength={10}
          />
        )}
        <span className="thong_bao_loi">{loi_tt.so_dien_thoai}</span>
      </div>
      <button type="submit" className="nut_luu_thong_tin" disabled={dang_luu_tt || dang_tai}>
        {dang_luu_tt ? "Đang lưu..." : "Cập nhật thông tin"}
      </button>
    </form>
  );
}

function FormMatKhau({ dang_luu_mk, loi_server_mk, loi_mk, gia_tri_mk, dat_gia_tri_mk, dat_loi_mk, hien_mat_khau, dat_hien_mat_khau, kiem_tra_truong_mk, xu_ly_doi_mat_khau }) {
  const ds_truong = [
    { ten: "mat_khau_cu", nhan: "Mật khẩu cũ", key: "cu" },
    { ten: "mat_khau_moi", nhan: "Mật khẩu mới", key: "moi" },
    { ten: "xac_nhan_mat_khau", nhan: "Xác nhận mật khẩu mới", key: "xac_nhan" },
  ];
  return (
    <form onSubmit={xu_ly_doi_mat_khau} noValidate>
      {loi_server_mk && (
        <div className="thong_bao_server_loi">{loi_server_mk}</div>
      )}
      {ds_truong.map((truong) => (
        <div key={truong.ten} className="nhom_truong">
          <label className="nhan_truong">{truong.nhan} <span className="dau_bat_buoc">*</span></label>
          <div className="khung_mat_khau">
            <input
              type={hien_mat_khau[truong.key] ? "text" : "password"}
              className={`o_nhap ${loi_mk[truong.ten] ? "loi" : ""}`}
              value={gia_tri_mk[truong.ten]}
              onChange={(e) => {
                dat_gia_tri_mk((prev) => ({ ...prev, [truong.ten]: e.target.value }));
                dat_loi_mk((prev) => ({ ...prev, [truong.ten]: kiem_tra_truong_mk(truong.ten, e.target.value, gia_tri_mk) }));
              }}
              placeholder={`Nhập ${truong.nhan.toLowerCase()}`}
              autoComplete="new-password"
            />
            <button type="button" className="nut_hien_mat_khau"
              onClick={() => dat_hien_mat_khau((prev) => ({ ...prev, [truong.key]: !prev[truong.key] }))}
              tabIndex={-1}
            >
              {hien_mat_khau[truong.key] ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
          <span className="thong_bao_loi">{loi_mk[truong.ten]}</span>
        </div>
      ))}
      <button type="submit" className="nut_luu_thong_tin" disabled={dang_luu_mk}>
        {dang_luu_mk ? "Đang xử lý..." : "Đổi mật khẩu"}
      </button>
    </form>
  );
}

const GIA_TRI_THONG_TIN_MAC_DINH = { ho_ten: "", so_dien_thoai: "" };
const LOI_THONG_TIN_MAC_DINH = { ho_ten: "", so_dien_thoai: "" };

const GIA_TRI_MAT_KHAU_MAC_DINH = {
  mat_khau_cu: "",
  mat_khau_moi: "",
  xac_nhan_mat_khau: "",
};
const LOI_MAT_KHAU_MAC_DINH = {
  mat_khau_cu: "",
  mat_khau_moi: "",
  xac_nhan_mat_khau: "",
};

export default function TaiKhoan() {
  const queryClient = useQueryClient();
  const { cap_nhat_nguoi_dung } = useAuth();

  const [tab_hien_tai, dat_tab] = useState(TAB_THONG_TIN);
  const [gia_tri_tt, dat_gia_tri_tt] = useState(GIA_TRI_THONG_TIN_MAC_DINH);
  const [loi_tt, dat_loi_tt] = useState(LOI_THONG_TIN_MAC_DINH);
  const [loi_server_tt, dat_loi_server_tt] = useState("");
  const [gia_tri_mk, dat_gia_tri_mk] = useState(GIA_TRI_MAT_KHAU_MAC_DINH);
  const [loi_mk, dat_loi_mk] = useState(LOI_MAT_KHAU_MAC_DINH);
  const [loi_server_mk, dat_loi_server_mk] = useState("");
  const [hien_mat_khau, dat_hien_mat_khau] = useState({
    cu: false,
    moi: false,
    xac_nhan: false,
  });

  /* ── Lấy thông tin ─────────────────────────────── */
  const { data: thong_tin, isLoading: dang_tai } = useQuery({
    queryKey: ["thong_tin_tai_khoan"],
    queryFn: async () => {
      const phan_hoi = await api.get("/nguoi_dung/thong_tin");
      return phan_hoi.data.data;
    },
    staleTime: 30 * 60 * 1000,
  });

  useEffect(() => {
    if (thong_tin) {
      dat_gia_tri_tt({
        ho_ten: thong_tin.ho_ten || "",
        so_dien_thoai: thong_tin.so_dien_thoai || "",
      });
    }
  }, [thong_tin]);

  /* ── Validation ────────────────────────────────── */
  function kiem_tra_truong_tt(ten, gia_tri) {
    switch (ten) {
      case "ho_ten":
        if (!gia_tri.trim()) return "Họ tên không được để trống";
        if (!/^[\p{L} ]{2,50}$/u.test(gia_tri.trim()))
          return "Họ tên phải từ 2-50 ký tự và không chứa số hoặc ký tự đặc biệt";
        return "";
      case "so_dien_thoai":
        if (!gia_tri.trim()) return "Số điện thoại không được để trống";
        if (!/^0[0-9]{9}$/.test(gia_tri))
          return "Số điện thoại phải là 10 số và bắt đầu bằng 0";
        return "";
      default:
        return "";
    }
  }

  function kiem_tra_truong_mk(ten, gia_tri, gia_tri_form) {
    switch (ten) {
      case "mat_khau_cu":
        if (!gia_tri.trim()) return "Mật khẩu cũ không được để trống";
        return "";
      case "mat_khau_moi":
        if (!gia_tri.trim()) return "Mật khẩu mới không được để trống";
        if (!/^(?=.*[a-zA-Z])(?=.*[0-9]).{8,64}$/.test(gia_tri))
          return "Mật khẩu phải từ 8-64 ký tự, bao gồm ít nhất 1 chữ cái và 1 số";
        return "";
      case "xac_nhan_mat_khau":
        if (!gia_tri.trim()) return "Xác nhận mật khẩu không được để trống";
        if (gia_tri !== (gia_tri_form?.mat_khau_moi || ""))
          return "Mật khẩu xác nhận không khớp";
        return "";
      default:
        return "";
    }
  }

  /* ── Mutation: cập nhật thông tin ─────────────── */
  const { mutate: cap_nhat_tt, isPending: dang_luu_tt } = useMutation({
    mutationFn: (du_lieu) => api.put("/nguoi_dung/thong_tin", du_lieu),
    onSuccess: (phan_hoi) => {
      const du_lieu_moi = phan_hoi.data.data;
      toast.success("Cập nhật thông tin thành công");
      dat_loi_server_tt("");
      queryClient.invalidateQueries({ queryKey: ["thong_tin_tai_khoan"] });
      cap_nhat_nguoi_dung({ ho_ten: du_lieu_moi.ho_ten });
    },
    onError: (loi) => {
      const thong_bao =
        loi.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại.";
      dat_loi_server_tt(thong_bao);
    },
  });

  function xu_ly_cap_nhat(su_kien) {
    su_kien.preventDefault();
    dat_loi_server_tt("");
    const loi_moi = {
      ho_ten: kiem_tra_truong_tt("ho_ten", gia_tri_tt.ho_ten),
      so_dien_thoai: kiem_tra_truong_tt(
        "so_dien_thoai",
        gia_tri_tt.so_dien_thoai,
      ),
    };
    dat_loi_tt(loi_moi);
    if (Object.values(loi_moi).some((v) => v)) return;
    cap_nhat_tt({
      ho_ten: gia_tri_tt.ho_ten.trim(),
      so_dien_thoai: gia_tri_tt.so_dien_thoai.trim(),
    });
  }

  /* ── Mutation: đổi mật khẩu ───────────────────── */
  const { mutate: doi_mat_khau, isPending: dang_luu_mk } = useMutation({
    mutationFn: (du_lieu) => api.put("/nguoi_dung/doi_mat_khau", du_lieu),
    onSuccess: () => {
      toast.success("Đổi mật khẩu thành công");
      dat_gia_tri_mk(GIA_TRI_MAT_KHAU_MAC_DINH);
      dat_loi_mk(LOI_MAT_KHAU_MAC_DINH);
      dat_loi_server_mk("");
    },
    onError: (loi) => {
      const thong_bao =
        loi.response?.data?.message ||
        loi.response?.data?.thong_bao ||
        "Có lỗi xảy ra. Vui lòng thử lại.";
      dat_loi_server_mk(thong_bao);
    },
  });

  function xu_ly_doi_mat_khau(su_kien) {
    su_kien.preventDefault();
    dat_loi_server_mk("");
    const loi_moi = {
      mat_khau_cu: kiem_tra_truong_mk("mat_khau_cu", gia_tri_mk.mat_khau_cu),
      mat_khau_moi: kiem_tra_truong_mk("mat_khau_moi", gia_tri_mk.mat_khau_moi),
      xac_nhan_mat_khau: kiem_tra_truong_mk(
        "xac_nhan_mat_khau",
        gia_tri_mk.xac_nhan_mat_khau,
        gia_tri_mk,
      ),
    };
    dat_loi_mk(loi_moi);
    if (Object.values(loi_moi).some((v) => v)) return;
    doi_mat_khau(gia_tri_mk);
  }

  /* ── Render ─────────────────────────────────────── */
  return (
    <div className="trang_tai_khoan">
      <div className="khung_tai_khoan">
        <div className="dau_trang_tai_khoan">
          <div className="avatar_lon">
            {thong_tin?.ho_ten?.charAt(0).toUpperCase() || "?"}
          </div>
          {dang_tai ? (
            <div className="o_skeleton skeleton_ten_lon" />
          ) : (
            <h2 className="ten_nguoi_dung_lon">{thong_tin?.ho_ten}</h2>
          )}
          <span className="nhan_vai_tro">
            {thong_tin?.vai_tro === "quan_tri" ? "Quản trị viên" : "Thành viên"}
          </span>
        </div>

        <div className="thanh_tab">
          <button
            className={`nut_tab ${tab_hien_tai === TAB_THONG_TIN ? "tab_active" : ""}`}
            onClick={() => dat_tab(TAB_THONG_TIN)}
          >
            Thông tin cá nhân
          </button>
          <button
            className={`nut_tab ${tab_hien_tai === TAB_MAT_KHAU ? "tab_active" : ""}`}
            onClick={() => dat_tab(TAB_MAT_KHAU)}
          >
            Đổi mật khẩu
          </button>
        </div>

        <div className="noi_dung_tab" key={tab_hien_tai}>
          {tab_hien_tai === TAB_THONG_TIN && (
            <FormThongTin
              thong_tin={thong_tin}
              dang_tai={dang_tai}
              dang_luu_tt={dang_luu_tt}
              loi_server_tt={loi_server_tt}
              loi_tt={loi_tt}
              gia_tri_tt={gia_tri_tt}
              dat_gia_tri_tt={dat_gia_tri_tt}
              dat_loi_tt={dat_loi_tt}
              kiem_tra_truong_tt={kiem_tra_truong_tt}
              xu_ly_cap_nhat={xu_ly_cap_nhat}
            />
          )}
          {tab_hien_tai === TAB_MAT_KHAU && (
            <FormMatKhau
              dang_luu_mk={dang_luu_mk}
              loi_server_mk={loi_server_mk}
              loi_mk={loi_mk}
              gia_tri_mk={gia_tri_mk}
              dat_gia_tri_mk={dat_gia_tri_mk}
              dat_loi_mk={dat_loi_mk}
              hien_mat_khau={hien_mat_khau}
              dat_hien_mat_khau={dat_hien_mat_khau}
              kiem_tra_truong_mk={kiem_tra_truong_mk}
              xu_ly_doi_mat_khau={xu_ly_doi_mat_khau}
            />
          )}
        </div>
      </div>
    </div>
  );
}
