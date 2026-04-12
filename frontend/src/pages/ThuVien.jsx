import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { dinh_dang_gia } from '../utils/dinh_dang';
import { FiBookOpen, FiHeart, FiClock, FiShoppingBag, FiTrash2, FiCompass } from 'react-icons/fi';
import './ThuVien.css';

const TAB_DA_MUA = 'da_mua';
const TAB_YEU_THICH = 'yeu_thich';
const TAB_DANG_DOC = 'dang_doc';
const KICH_THUOC_TRANG = 12;

const cac_tab = [
    { ma: TAB_DA_MUA,    ten: 'Đã mua',     icon: <FiShoppingBag /> },
    { ma: TAB_YEU_THICH, ten: 'Yêu thích',  icon: <FiHeart /> },
    { ma: TAB_DANG_DOC,  ten: 'Đang đọc',   icon: <FiClock /> },
];

export default function ThuVien() {
    const { da_dang_nhap, nguoiDung } = useAuth();
    const dieu_huong = useNavigate();
    const queryClient = useQueryClient();

    const [tab_hien_tai, dat_tab] = useState(TAB_DA_MUA);
    const [trang_da_mua, dat_trang_da_mua] = useState(1);
    const [trang_yeu_thich, dat_trang_yeu_thich] = useState(1);
    const [trang_dang_doc, dat_trang_dang_doc] = useState(1);

    useEffect(() => {
        if (!da_dang_nhap) dieu_huong('/dang_nhap');
    }, [da_dang_nhap, dieu_huong]);

    function xu_ly_doi_tab(tab_moi) {
        dat_tab(tab_moi);
        dat_trang_da_mua(1);
        dat_trang_yeu_thich(1);
        dat_trang_dang_doc(1);
    }

    const { data: du_lieu_da_mua, isLoading: dang_tai_da_mua } = useQuery({
        queryKey: ['sach_da_mua', nguoiDung?.ma_nguoi_dung, trang_da_mua],
        queryFn: async () => {
            const res = await api.get('/thu_vien/sach_da_mua', {
                params: { trang: trang_da_mua, kich_thuoc: KICH_THUOC_TRANG },
            });
            return res.data;
        },
        staleTime: 30 * 60 * 1000,
        enabled: da_dang_nhap && tab_hien_tai === TAB_DA_MUA,
    });

    const { data: du_lieu_yeu_thich, isLoading: dang_tai_yeu_thich } = useQuery({
        queryKey: ['sach_yeu_thich', nguoiDung?.ma_nguoi_dung, trang_yeu_thich],
        queryFn: async () => {
            const res = await api.get('/thu_vien/sach_yeu_thich', {
                params: { trang: trang_yeu_thich, kich_thuoc: KICH_THUOC_TRANG },
            });
            return res.data;
        },
        staleTime: 30 * 60 * 1000,
        enabled: da_dang_nhap && tab_hien_tai === TAB_YEU_THICH,
    });

    const { mutate: bo_thich, isPending: dang_bo_thich } = useMutation({
        mutationFn: (ma_sach) => api.delete(`/thu_vien/yeu_thich/${ma_sach}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['sach_yeu_thich'] });
            toast.success('Đã bỏ khỏi danh sách yêu thích');
        },
        onError: () => toast.error('Có lỗi xảy ra. Vui lòng thử lại.'),
    });

    const { data: du_lieu_dang_doc, isLoading: dang_tai_dang_doc } = useQuery({
        queryKey: ['sach_dang_doc_thu_vien', nguoiDung?.ma_nguoi_dung, trang_dang_doc],
        queryFn: async () => {
            const res = await api.get('/thu_vien/sach_dang_doc', {
                params: { trang: trang_dang_doc, kich_thuoc: KICH_THUOC_TRANG },
            });
            return res.data;
        },
        staleTime: 0,
        enabled: da_dang_nhap && tab_hien_tai === TAB_DANG_DOC,
    });

    const so_luong = {
        [TAB_DA_MUA]:    du_lieu_da_mua?.tong_so_ban_ghi,
        [TAB_YEU_THICH]: du_lieu_yeu_thich?.tong_so_ban_ghi,
        [TAB_DANG_DOC]:  du_lieu_dang_doc?.tong_so_ban_ghi,
    };

    function render_skeleton() {
        return Array(6).fill(0).map((_, i) => (
            <div key={i} className="the_sach_skeleton">
                <div className="skeleton_anh_bia" />
                <div className="skeleton_noi_dung">
                    <div className="skeleton_dong" style={{ width: '85%' }} />
                    <div className="skeleton_dong" style={{ width: '55%' }} />
                    <div className="skeleton_dong" style={{ width: '40%', marginTop: 8 }} />
                    <div className="skeleton_nut" />
                </div>
            </div>
        ));
    }

    return (
        <div className="trang_thu_vien">
            {/* Header */}
            <div className="header_thu_vien">
                <div className="header_noi_dung">
                    <div className="header_icon_wrap">
                        <FiBookOpen />
                    </div>
                    <div>
                        <h1 className="header_tieu_de">Thư viện của tôi</h1>
                        <p className="header_mo_ta">Quản lý sách đã mua, yêu thích và tiến độ đọc</p>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="thanh_tab_thu_vien">
                {cac_tab.map(tab => (
                    <button
                        key={tab.ma}
                        className={`nut_tab_tv ${tab_hien_tai === tab.ma ? 'tab_active' : ''}`}
                        onClick={() => xu_ly_doi_tab(tab.ma)}
                    >
                        <span className="tab_icon">{tab.icon}</span>
                        <span>{tab.ten}</span>
                        {so_luong[tab.ma] > 0 && (
                            <span className="tab_badge">{so_luong[tab.ma]}</span>
                        )}
                    </button>
                ))}
            </div>

            {/* Nội dung */}
            <div className="luoi_sach_thu_vien">

                {/* Tab Đã mua */}
                {tab_hien_tai === TAB_DA_MUA && (
                    dang_tai_da_mua ? render_skeleton() :
                    du_lieu_da_mua?.du_lieu?.length > 0
                        ? du_lieu_da_mua.du_lieu.map(sach => (
                            <div key={sach.ma_sach} className="the_sach_thu_vien">
                                <Link to={`/sach/${sach.ma_sach}`} className="anh_bia_wrap">
                                    <img src={sach.anh_bia_url} alt={sach.ten_sach} />
                                </Link>
                                <div className="noi_dung_the">
                                    <div className="meta_sach">
                                        <h4 className="ten_sach">{sach.ten_sach}</h4>
                                        <p className="tac_gia">{sach.tac_gia}</p>
                                    </div>
                                    <div className="dong_gia_ngay">
                                        <span className="gia_sach">{dinh_dang_gia(sach.gia)}</span>
                                        <span className="ngay_mua">
                                            {new Date(sach.ngay_mua).toLocaleDateString('vi-VN')}
                                        </span>
                                    </div>
                                    <Link to={`/doc_sach/${sach.ma_sach}`} className="nut_hanh_dong">
                                        <FiBookOpen /> Đọc ngay
                                    </Link>
                                </div>
                            </div>
                        ))
                        : <EmptyState icon={<FiShoppingBag />} tieu_de="Chưa có sách nào" mo_ta="Khám phá và mua sách để bắt đầu hành trình đọc!" link="/trang_chu" ten_link="Khám phá sách" />
                )}

                {/* Tab Yêu thích */}
                {tab_hien_tai === TAB_YEU_THICH && (
                    dang_tai_yeu_thich ? render_skeleton() :
                    du_lieu_yeu_thich?.du_lieu?.length > 0
                        ? du_lieu_yeu_thich.du_lieu.map(sach => (
                            <div key={sach.ma_sach} className="the_sach_thu_vien">
                                <Link to={`/sach/${sach.ma_sach}`} className="anh_bia_wrap">
                                    <img src={sach.anh_bia_url} alt={sach.ten_sach} />
                                </Link>
                                <div className="noi_dung_the">
                                    <div className="meta_sach">
                                        <h4 className="ten_sach">{sach.ten_sach}</h4>
                                        <p className="tac_gia">{sach.tac_gia}</p>
                                    </div>
                                    <p className="gia_sach">{Number(sach.gia) === 0 ? 'Miễn phí' : dinh_dang_gia(sach.gia)}</p>
                                    <button
                                        className="nut_bo_thich"
                                        onClick={() => bo_thich(sach.ma_sach)}
                                        disabled={dang_bo_thich}
                                    >
                                        <FiTrash2 /> Bỏ yêu thích
                                    </button>
                                </div>
                            </div>
                        ))
                        : <EmptyState icon={<FiHeart />} tieu_de="Chưa có sách yêu thích" mo_ta="Nhấn ♡ trên trang chi tiết sách để lưu vào đây." />
                )}

                {/* Tab Đang đọc */}
                {tab_hien_tai === TAB_DANG_DOC && (
                    dang_tai_dang_doc ? render_skeleton() :
                    du_lieu_dang_doc?.du_lieu?.length > 0
                        ? du_lieu_dang_doc.du_lieu.map(sach => (
                            <div key={sach.ma_sach} className="the_sach_thu_vien">
                                <Link to={`/sach/${sach.ma_sach}`} className="anh_bia_wrap">
                                    <img src={sach.anh_bia_url} alt={sach.ten_sach} />
                                    <div className="overlay_phan_tram">
                                        {sach.phan_tram?.toFixed(0)}%
                                    </div>
                                </Link>
                                <div className="noi_dung_the">
                                    <div className="meta_sach">
                                        <h4 className="ten_sach">{sach.ten_sach}</h4>
                                        <p className="tac_gia">{sach.tac_gia}</p>
                                    </div>
                                    <div className="khung_tien_do">
                                        <div className="thanh_tien_do_nen">
                                            <div
                                                className="thanh_tien_do_day"
                                                style={{ width: `${sach.phan_tram}%` }}
                                            />
                                        </div>
                                        <span className="text_tien_do">
                                            {sach.phan_tram?.toFixed(0)}% · Trang {sach.trang_hien_tai}
                                        </span>
                                    </div>
                                    <Link to={`/doc_sach/${sach.ma_sach}`} className="nut_hanh_dong">
                                        <FiBookOpen /> Đọc tiếp
                                    </Link>
                                </div>
                            </div>
                        ))
                        : <EmptyState icon={<FiClock />} tieu_de="Chưa có sách đang đọc" mo_ta="Bắt đầu đọc một cuốn sách để theo dõi tiến độ tại đây." link="/trang_chu" ten_link="Tìm sách đọc" />
                )}
            </div>

            {/* Phân trang */}
            {tab_hien_tai === TAB_DA_MUA && du_lieu_da_mua?.tong_so_trang > 1 && (
                <div className="phan_trang_thu_vien">
                    <button className="nut_trang_tv" onClick={() => dat_trang_da_mua(p => p - 1)} disabled={trang_da_mua === 1}>‹</button>
                    <span className="so_trang_tv">{trang_da_mua} / {du_lieu_da_mua.tong_so_trang}</span>
                    <button className="nut_trang_tv" onClick={() => dat_trang_da_mua(p => p + 1)} disabled={trang_da_mua === du_lieu_da_mua.tong_so_trang}>›</button>
                </div>
            )}
            {tab_hien_tai === TAB_YEU_THICH && du_lieu_yeu_thich?.tong_so_trang > 1 && (
                <div className="phan_trang_thu_vien">
                    <button className="nut_trang_tv" onClick={() => dat_trang_yeu_thich(p => p - 1)} disabled={trang_yeu_thich === 1}>‹</button>
                    <span className="so_trang_tv">{trang_yeu_thich} / {du_lieu_yeu_thich.tong_so_trang}</span>
                    <button className="nut_trang_tv" onClick={() => dat_trang_yeu_thich(p => p + 1)} disabled={trang_yeu_thich === du_lieu_yeu_thich.tong_so_trang}>›</button>
                </div>
            )}
            {tab_hien_tai === TAB_DANG_DOC && du_lieu_dang_doc?.tong_so_trang > 1 && (
                <div className="phan_trang_thu_vien">
                    <button className="nut_trang_tv" onClick={() => dat_trang_dang_doc(p => p - 1)} disabled={trang_dang_doc === 1}>‹</button>
                    <span className="so_trang_tv">{trang_dang_doc} / {du_lieu_dang_doc.tong_so_trang}</span>
                    <button className="nut_trang_tv" onClick={() => dat_trang_dang_doc(p => p + 1)} disabled={trang_dang_doc === du_lieu_dang_doc.tong_so_trang}>›</button>
                </div>
            )}
        </div>
    );
}

function EmptyState({ icon, tieu_de, mo_ta, link, ten_link }) {
    return (
        <div className="empty_state">
            <div className="empty_icon">{icon}</div>
            <h3 className="empty_tieu_de">{tieu_de}</h3>
            <p className="empty_mo_ta">{mo_ta}</p>
            {link && (
                <Link to={link} className="empty_nut">
                    <FiCompass /> {ten_link}
                </Link>
            )}
        </div>
    );
}
