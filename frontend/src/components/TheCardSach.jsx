import { Link } from "react-router-dom";
import "./TheCardSach.css";

// Hàm helper định dạng [cite: 104, 107]
function dinh_dang_gia(gia) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(gia);
}

function dinh_dang_luot_xem(luot) {
  if (!luot) return "0";
  if (luot >= 1000) return (luot / 1000).toFixed(1) + "k";
  return String(luot);
}

export default function TheCardSach({ sach, skeleton = false }) {
  if (skeleton) {
    return (
      <div className="the_card_sach the_card_skeleton">
        <div className="skeleton_anh_bia" />
        <div className="skeleton_noi_dung">
          <div className="o_skeleton" />
          <div className="o_skeleton o_skeleton_ngan" />
          <div className="o_skeleton o_skeleton_gia" />
        </div>
      </div>
    );
  }

  const coGiamGia = sach.gia_sau_giam != null;
  const giaGoc = sach.gia_goc ?? sach.gia;
  const giaHienThi = coGiamGia ? sach.gia_sau_giam : sach.gia;
  const laMienPhi = Number(giaHienThi) === 0;

  return (
    <Link to={`/sach/${sach.ma_sach}`} className="the_card_sach">
      <div className="khung_anh_bia">
        {sach.anh_bia_url ? (
          <img
            src={sach.anh_bia_url}
            alt={sach.ten_sach}
            className="anh_bia_sach"
            loading="lazy"
          />
        ) : (
          <div className="anh_bia_trong">?</div>
        )}
        {coGiamGia && (
          <span className="badge_giam">{sach.nhan_giam}</span>
        )}
        <span className={`nhan_gia ${laMienPhi ? "mien_phi" : coGiamGia ? "da_giam" : "tra_phi"}`}>
          {laMienPhi ? "Miễn phí" : dinh_dang_gia(giaHienThi)}
        </span>
      </div>

      <div className="noi_dung_card">
        <h3 className="ten_sach_card">{sach.ten_sach}</h3>
        <p className="tac_gia_card">{sach.tac_gia}</p>
        {coGiamGia && (
          <p className="gia_goc_gach_ngang">{dinh_dang_gia(giaGoc)}</p>
        )}
        <div className="thong_tin_card">
          <span className="danh_gia_card">
            ★ {sach.danh_gia_trung_binh?.toFixed(1) || "0.0"}
          </span>
          {Number(giaHienThi) > 0 && (
            <span className="luot_xem_card">
              {dinh_dang_luot_xem(sach.so_luong_da_ban)} đã bán
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
