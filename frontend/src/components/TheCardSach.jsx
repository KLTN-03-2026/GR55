import { Link } from 'react-router-dom';
import './TheCardSach.css';

// Hàm helper định dạng [cite: 104, 107]
function dinh_dang_gia(gia) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(gia);
}

function dinh_dang_luot_xem(luot) {
    if (!luot) return '0';
    if (luot >= 1000) return (luot / 1000).toFixed(1) + 'k';
    return String(luot);
}

export default function TheCardSach({ sach, skeleton = false }) {
    // 1. Render Skeleton khi đang tải [cite: 72]
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

    // 2. Render Card thật [cite: 81]
    return (
        <Link to={`/sach/${sach.ma_sach}`} className="the_card_sach">
            <div className="khung_anh_bia">
                {sach.anh_bia_url ? (
                    <img src={sach.anh_bia_url} alt={sach.ten_sach} className="anh_bia_sach" loading="lazy" />
                ) : (
                    <div className="anh_bia_trong">?</div>
                )}
                {/* Badge giá [cite: 88] */}
                <span className={`nhan_gia ${Number(sach.gia) === 0 ? 'mien_phi' : 'tra_phi'}`}>
                    {Number(sach.gia) === 0 ? 'Miễn phí' : dinh_dang_gia(sach.gia)}
                </span>
            </div>

            <div className="noi_dung_card">
                <h3 className="ten_sach_card">{sach.ten_sach}</h3>
                <p className="tac_gia_card">{sach.tac_gia}</p>
                <div className="thong_tin_card">
                    {/* Đánh giá dùng text thay icon [cite: 97] */}
                    <span className="danh_gia_card"> ★ {sach.danh_gia_trung_binh?.toFixed(1) || '0.0'}</span>
                    <span className="luot_xem_card">{dinh_dang_luot_xem(sach.luot_xem)} lượt xem</span>
                </div>
            </div>
        </Link>
    );
}