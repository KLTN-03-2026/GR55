import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { FiBookOpen, FiTrash2 } from 'react-icons/fi';
import './ThuVien.css';

const TAB_DA_MUA = 'da_mua';
const TAB_YEU_THICH = 'yeu_thich';
const TAB_DANG_DOC = 'dang_doc';
const KICH_THUOC_TRANG = 12;

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

    // Query Sách đã mua
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

    // Query Sách yêu thích
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

    // Mutation Bỏ yêu thích
    const { mutate: bo_thich, isPending: dang_bo_thich } = useMutation({
        mutationFn: (ma_sach) => api.delete(`/thu_vien/yeu_thich/${ma_sach}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['sach_yeu_thich'] });
            toast.success('Đã bỏ khỏi danh sách yêu thích');
        },
        onError: () => toast.error('Có lỗi xảy ra. Vui lòng thử lại.'),
    });

    // Query Sách đang đọc
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

    return (
        <div className="trang_thu_vien">
            <div className="thanh_tab_thu_vien">
                {[
                    { ma: TAB_DA_MUA, ten: 'Sách đã mua' },
                    { ma: TAB_YEU_THICH, ten: 'Yêu thích' },
                    { ma: TAB_DANG_DOC, ten: 'Đang đọc' },
                ].map(tab => (
                    <button
                        key={tab.ma}
                        className={`nut_tab_tv ${tab_hien_tai === tab.ma ? 'tab_active' : ''}`}
                        onClick={() => xu_ly_doi_tab(tab.ma)}
                    >
                        {tab.ten}
                    </button>
                ))}
            </div>

            <div className="luoi_sach_thu_vien">
                {/* Render Tab Đã mua */}
                {tab_hien_tai === TAB_DA_MUA && (
                    dang_tai_da_mua ? Array(6).fill(0).map((_, i) => <div key={i} className="the_sach_skeleton" />) :
                        du_lieu_da_mua?.du_lieu?.length > 0 ? du_lieu_da_mua.du_lieu.map(sach => (
                            <div key={sach.ma_sach} className="the_sach_thu_vien">
                                <Link to={`/sach/${sach.ma_sach}`}><img src={sach.anh_bia_url} alt={sach.ten_sach} /></Link>
                                <div className="noi_dung_the">
                                    <h4>{sach.ten_sach}</h4>
                                    <p>{sach.tac_gia}</p>
                                    <span className="ngay_mua">Đã mua: {new Date(sach.ngay_mua).toLocaleDateString('vi-VN')}</span>
                                    <Link to={`/doc_sach/${sach.ma_sach}`} className="nut_hanh_dong"><FiBookOpen /> Đọc ngay</Link>
                                </div>
                            </div>
                        )) : <div className="empty_state">Bạn chưa mua sách nào <Link to="/trang_chu">Khám phá sách</Link></div>
                )}

                {/* Render Tab Yêu thích */}
                {tab_hien_tai === TAB_YEU_THICH && (
                    dang_tai_yeu_thich ? Array(6).fill(0).map((_, i) => <div key={i} className="the_sach_skeleton" />) :
                        du_lieu_yeu_thich?.du_lieu?.length > 0 ? du_lieu_yeu_thich.du_lieu.map(sach => (
                            <div key={sach.ma_sach} className="the_sach_thu_vien">
                                <Link to={`/sach/${sach.ma_sach}`}><img src={sach.anh_bia_url} alt={sach.ten_sach} /></Link>
                                <div className="noi_dung_the">
                                    <h4>{sach.ten_sach}</h4>
                                    <button
                                        className="nut_hanh_dong nut_bo_thich"
                                        onClick={() => bo_thich(sach.ma_sach)}
                                        disabled={dang_bo_thich}
                                    >
                                        <FiTrash2 /> Bỏ thích
                                    </button>
                                </div>
                            </div>
                        )) : <div className="empty_state">Chưa có sách yêu thích</div>
                )}

                {/* Render Tab Đang đọc */}
                {tab_hien_tai === TAB_DANG_DOC && (
                    dang_tai_dang_doc ? Array(6).fill(0).map((_, i) => <div key={i} className="the_sach_skeleton" />) :
                        du_lieu_dang_doc?.du_lieu?.length > 0 ? du_lieu_dang_doc.du_lieu.map(sach => (
                            <div key={sach.ma_sach} className="the_sach_thu_vien">
                                <Link to={`/sach/${sach.ma_sach}`}><img src={sach.anh_bia_url} alt={sach.ten_sach} /></Link>
                                <div className="noi_dung_the">
                                    <h4>{sach.ten_sach}</h4>
                                    <div className="thanh_tien_do_nen">
                                        <div className="thanh_tien_do_day" style={{ width: `${sach.phan_tram}%` }} />
                                    </div>
                                    <span className="text_tien_do">{sach.phan_tram?.toFixed(0)}% · Trang {sach.trang_hien_tai}</span>
                                    <Link to={`/doc_sach/${sach.ma_sach}`} className="nut_hanh_dong"><FiBookOpen /> Đọc tiếp</Link>
                                </div>
                            </div>
                        )) : <div className="empty_state">Bạn chưa đọc sách nào</div>
                )}
            </div>
        </div>
    );
}