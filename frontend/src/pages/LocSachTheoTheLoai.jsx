import { useState } from 'react';
import { useParams, useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import TheCardSach from '../components/TheCardSach';
import './LocSachTheoTheLoai.css';

const KICH_THUOC_TRANG = 12;

export default function LocSachTheoTheLoai() {
    const { ma_the_loai } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const trang_hien_tai = Number(searchParams.get('trang') || 1);
    const dieu_huong = useNavigate();

    const [bo_loc, dat_bo_loc] = useState({
        min_gia: null,
        max_gia: null,
        min_danh_gia: null,
        sach_mien_phi: null,
        sach_hoi_vien: null,
        sap_xep: 'doc_nhieu',
    });
    const [bo_loc_tam, dat_bo_loc_tam] = useState({ ...bo_loc });

    const { data: ket_qua, isLoading: dang_tai, error: loi_api } = useQuery({
        queryKey: ['sach_theo_the_loai', ma_the_loai, trang_hien_tai, bo_loc],
        queryFn: async () => {
            const phan_hoi = await api.get(`/the_loai/${ma_the_loai}/sach`, {
                params: {
                    trang: trang_hien_tai,
                    kich_thuoc: KICH_THUOC_TRANG,
                    min_gia: bo_loc.min_gia ?? undefined,
                    max_gia: bo_loc.max_gia ?? undefined,
                    min_danh_gia: bo_loc.min_danh_gia ?? undefined,
                    sach_mien_phi: bo_loc.sach_mien_phi ?? undefined,
                    sach_hoi_vien: bo_loc.sach_hoi_vien ?? undefined,
                    sap_xep: bo_loc.sap_xep,
                },
            });
            return phan_hoi.data;
        },
        staleTime: 5 * 60 * 1000,
        placeholderData: (prev) => prev,
        enabled: !!ma_the_loai,
        retry: false,
    });

    const xu_ly_sap_xep = (gia_tri) => {
        dat_bo_loc_tam(prev => ({ ...prev, sap_xep: gia_tri }));
        dat_bo_loc(prev => ({ ...prev, sap_xep: gia_tri }));
        setSearchParams({ trang: 1 });
    };

    const xu_ly_ap_dung_loc = () => {
        dat_bo_loc({ ...bo_loc_tam });
        setSearchParams({ trang: 1 });
    };

    const xu_ly_doi_trang = (huong) => {
        const trang_moi = huong === 'truoc' ? trang_hien_tai - 1 : trang_hien_tai + 1;
        setSearchParams({ trang: trang_moi });
        window.scrollTo(0, 0);
    };

    if (loi_api?.response?.status === 404) {
        return (
            <div className="loi_the_loai">
                <p>Thể loại không tồn tại</p>
                <button onClick={() => dieu_huong(-1)}>Quay lại</button>
            </div>
        );
    }

    return (
        <div className="trang_the_loai">
            {/* Dùng <div> thay vì <header> để tránh bị App.css áp sticky+z-index */}
            <div className="tieu_de_the_loai">
                <h1>{ket_qua?.thong_tin_the_loai?.ten_the_loai || '...'}</h1>
                <span>({ket_qua?.thong_tin_the_loai?.so_luong_sach || 0} sách)</span>
            </div>

            <div className="bo_cuc_chinh">
                {/* BỘ LỌC — cùng cấu trúc với TimKiem */}
                <aside className="bo_loc_ben_trai">
                    <p className="tieu_de_bo_loc">Bộ lọc</p>

                    <div className="nhom_bo_loc">
                        <label className="nhan_bo_loc">Sắp xếp</label>
                        <select
                            className="chon_sap_xep"
                            value={bo_loc_tam.sap_xep}
                            onChange={(e) => xu_ly_sap_xep(e.target.value)}
                        >
                            <option value="doc_nhieu">Đọc nhiều nhất</option>
                            <option value="gia_tang_dan">Giá tăng dần</option>
                            <option value="gia_giam_dan">Giá giảm dần</option>
                        </select>
                    </div>

                    <div className="nhom_bo_loc">
                        <label className="nhan_bo_loc">Khoảng giá</label>
                        <div className="nhom_gia">
                            <input
                                type="number"
                                className="nhap_gia"
                                placeholder="Từ"
                                min={0}
                                value={bo_loc_tam.min_gia ?? ''}
                                onChange={(e) =>
                                    dat_bo_loc_tam(prev => ({ ...prev, min_gia: e.target.value ? Number(e.target.value) : null }))
                                }
                            />
                            <span className="ky_tu_den">–</span>
                            <input
                                type="number"
                                className="nhap_gia"
                                placeholder="Đến"
                                min={0}
                                value={bo_loc_tam.max_gia ?? ''}
                                onChange={(e) =>
                                    dat_bo_loc_tam(prev => ({ ...prev, max_gia: e.target.value ? Number(e.target.value) : null }))
                                }
                            />
                        </div>
                    </div>

                    <div className="nhom_bo_loc">
                        <label className="nhan_bo_loc">Đánh giá tối thiểu</label>
                        <select
                            className="chon_danh_gia"
                            value={bo_loc_tam.min_danh_gia ?? ''}
                            onChange={(e) =>
                                dat_bo_loc_tam(prev => ({ ...prev, min_danh_gia: e.target.value ? Number(e.target.value) : null }))
                            }
                        >
                            <option value="">Tất cả</option>
                            {[1, 2, 3, 4, 5].map((sao) => (
                                <option key={sao} value={sao}>{sao} sao trở lên</option>
                            ))}
                        </select>
                    </div>

                    <div className="nhom_bo_loc">
                        <label className="nhan_checkbox">
                            <input
                                type="checkbox"
                                checked={!!bo_loc_tam.sach_mien_phi}
                                onChange={(e) =>
                                    dat_bo_loc_tam(prev => ({ ...prev, sach_mien_phi: e.target.checked ? true : null }))
                                }
                            />
                            Sách miễn phí
                        </label>
                    </div>

                    <div className="nhom_bo_loc">
                        <label className="nhan_checkbox">
                            <input
                                type="checkbox"
                                checked={!!bo_loc_tam.sach_hoi_vien}
                                onChange={(e) =>
                                    dat_bo_loc_tam(prev => ({ ...prev, sach_hoi_vien: e.target.checked ? true : null }))
                                }
                            />
                            Sách hội viên
                        </label>
                    </div>

                    <button className="nut_ap_dung" onClick={xu_ly_ap_dung_loc}>
                        Áp dụng
                    </button>
                </aside>

                {/* KẾT QUẢ */}
                <main className="khu_vuc_ket_qua">
                    <div className="luoi_ket_qua">
                        {dang_tai ? (
                            Array.from({ length: KICH_THUOC_TRANG }).map((_, i) => (
                                <TheCardSach key={i} skeleton />
                            ))
                        ) : ket_qua?.danh_sach?.length === 0 ? (
                            <div className="khong_co_ket_qua">
                                <p>Không có sách phù hợp với bộ lọc.</p>
                                <Link to="/tim_kiem" className="nut_xem_tat_ca">Xem tất cả sách</Link>
                            </div>
                        ) : (
                            ket_qua?.danh_sach?.map((sach) => (
                                <TheCardSach key={sach.ma_sach} sach={sach} />
                            ))
                        )}
                    </div>

                    {ket_qua?.tong_so_trang > 1 && (
                        <div className="phan_trang">
                            <button
                                className="nut_phan_trang"
                                disabled={trang_hien_tai <= 1}
                                onClick={() => xu_ly_doi_trang('truoc')}
                            >
                                ← Trước
                            </button>
                            <span className="vi_tri_trang">
                                Trang {trang_hien_tai} / {ket_qua.tong_so_trang}
                            </span>
                            <button
                                className="nut_phan_trang"
                                disabled={trang_hien_tai >= ket_qua.tong_so_trang}
                                onClick={() => xu_ly_doi_trang('sau')}
                            >
                                Sau →
                            </button>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
