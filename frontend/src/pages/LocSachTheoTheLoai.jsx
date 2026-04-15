import { useState, useCallback } from 'react'; // [cite: 1212]
import { useParams, useSearchParams, Link, useNavigate } from 'react-router-dom'; // [cite: 1213]
import { useQuery } from '@tanstack/react-query'; // [cite: 1214]
import api from '../services/api'; // [cite: 1215]
import TheCardSach from '../components/TheCardSach'; // [cite: 1216]
import './LocSachTheoTheLoai.css'; // [cite: 1217]

const KICH_THUOC_TRANG = 12; // [cite: 1210]

export default function LocSachTheoTheLoai() {
    const { ma_the_loai } = useParams(); // [cite: 1259]
    const [searchParams, setSearchParams] = useSearchParams(); // [cite: 1260]
    const trang_hien_tai = Number(searchParams.get('trang') || 1); // [cite: 1261]
    const dieu_huong = useNavigate();

    // Bộ lọc dual state [cite: 1262, 1263]
    const [bo_loc, dat_bo_loc] = useState({
        min_gia: null,
        max_gia: null,
        min_danh_gia: null,
        sach_mien_phi: null,
        sap_xep: 'moi_nhat',
    });
    const [bo_loc_tam, dat_bo_loc_tam] = useState({ ...bo_loc }); // [cite: 1270]

    // Query dữ liệu [cite: 1272]
    const { data: ket_qua, isLoading: dang_tai, error: loi_api } = useQuery({
        queryKey: ['sach_theo_the_loai', ma_the_loai, trang_hien_tai, bo_loc], // [cite: 1273]
        queryFn: async () => {
            const phan_hoi = await api.get(`/the_loai/${ma_the_loai}/sach`, {
                params: {
                    trang: trang_hien_tai,
                    kich_thuoc: KICH_THUOC_TRANG,
                    ...bo_loc,
                },
            });
            return phan_hoi.data; // [cite: 1282]
        },
        staleTime: 5 * 60 * 1000, // 
        placeholderData: (prev) => prev, // [cite: 1285]
        enabled: !!ma_the_loai,
        retry: false,
    });

    const xu_ly_sap_xep = (e) => {
        const value = e.target.value;
        dat_bo_loc_tam(prev => ({ ...prev, sap_xep: value }));
        dat_bo_loc(prev => ({ ...prev, sap_xep: value })); // Áp dụng ngay [cite: 1292]
        setSearchParams({ trang: 1 });
    };

    const xu_ly_ap_dung_loc = () => {
        dat_bo_loc({ ...bo_loc_tam }); // [cite: 1296]
        setSearchParams({ trang: 1 });
    };

    const xu_ly_doi_trang = (huong) => {
        const trang_moi = huong === 'truoc' ? trang_hien_tai - 1 : trang_hien_tai + 1;
        setSearchParams({ trang: trang_moi });
        window.scrollTo(0, 0); // [cite: 1299]
    };

    if (loi_api?.response?.status === 404) {
        return (
            <div className="loi_the_loai">
                <p>Thể loại không tồn tại</p>
                <button onClick={() => dieu_huong(-1)}>Quay lại</button>
            </div>
        ); // [cite: 1301]
    }

    return (
        <div className="trang_the_loai">
            <header className="header_the_loai">
                <h1>{ket_qua?.thong_tin_the_loai?.ten_the_loai}</h1>
                <span>({ket_qua?.thong_tin_the_loai?.so_luong_sach || 0} sách)</span>
            </header>

            <div className="khung_noi_dung">
                <aside className="bo_loc_ben_trai">
                    <div className="nhom_loc">
                        <label>Sắp xếp</label>
                        <select value={bo_loc_tam.sap_xep} onChange={xu_ly_sap_xep}>
                            <option value="moi_nhat">Mới nhất</option>
                            <option value="ban_chay">Bán chạy</option>
                            <option value="gia_tang_dan">Giá tăng dần</option>
                            <option value="gia_giam_dan">Giá giảm dần</option>
                        </select>
                    </div>

                    <div className="nhom_loc">
                        <label>Giá từ</label>
                        <input type="number" value={bo_loc_tam.min_gia || ''}
                            onChange={e => dat_bo_loc_tam({ ...bo_loc_tam, min_gia: e.target.value })} />
                        <label>Đến</label>
                        <input type="number" value={bo_loc_tam.max_gia || ''}
                            onChange={e => dat_bo_loc_tam({ ...bo_loc_tam, max_gia: e.target.value })} />
                    </div>

                    <div className="nhom_loc">
                        <label>Đánh giá ít nhất</label>
                        <select value={bo_loc_tam.min_danh_gia || ''}
                            onChange={e => dat_bo_loc_tam({ ...bo_loc_tam, min_danh_gia: e.target.value })}>
                            <option value="">Tất cả</option>
                            {[5, 4, 3, 2, 1].map(s => <option key={s} value={s}>{s} sao trở lên</option>)}
                        </select>
                    </div>

                    <div className="nhom_loc_checkbox">
                        <input type="checkbox" checked={!!bo_loc_tam.sach_mien_phi}
                            onChange={e => dat_bo_loc_tam({ ...bo_loc_tam, sach_mien_phi: e.target.checked || null })} />
                        <span>Sách miễn phí</span>
                    </div>

                    <button className="nut_ap_dung" onClick={xu_ly_ap_dung_loc}>Áp dụng</button>
                </aside>

                <main className="vung_ket_qua">
                    <div className="luoi_ket_qua">
                        {dang_tai ? (
                            Array.from({ length: KICH_THUOC_TRANG }).map((_, i) => <TheCardSach key={i} skeleton />)
                        ) : ket_qua?.danh_sach?.length === 0 ? (
                            <div className="chua_co_sach">
                                <p>Không có sách trong thể loại này</p>
                                <Link to="/tim_kiem">Xem tất cả sách</Link>
                            </div>
                        ) : (
                            ket_qua.danh_sach.map(sach => <TheCardSach key={sach.ma_sach} sach={sach} />)
                        )}
                    </div>

                    {ket_qua?.tong_so_trang > 1 && (
                        <div className="phan_trang">
                            <button disabled={trang_hien_tai <= 1} onClick={() => xu_ly_doi_trang('truoc')}>Trước</button>
                            <span>Trang {trang_hien_tai} / {ket_qua.tong_so_trang}</span>
                            <button disabled={trang_hien_tai >= ket_qua.tong_so_trang} onClick={() => xu_ly_doi_trang('sau')}>Sau</button>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}