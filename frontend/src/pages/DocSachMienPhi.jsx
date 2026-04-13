import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import "./DocThu.css"; // Sử dụng chung CSS với DocThu theo yêu cầu

const TRANG_HIEN_POPUP = 5; // [cite: 1111]

export default function DocSachMienPhi() {
    const { ma_sach } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { da_dang_nhap, nguoiDung } = useAuth();

    // State [cite: 1013, 1074]
    const [trang_hien_tai, dat_trang_hien_tai] = useState(1);
    const [tong_so_trang, dat_tong_so_trang] = useState(0);
    const [ti_le_phong_to, dat_ti_le_phong_to] = useState(1.0);
    const [che_do_toi, dat_che_do_toi] = useState(false);
    const [dang_tai_pdf, dat_dang_tai_pdf] = useState(true);
    const [loi_pdf, dat_loi_pdf] = useState("");
    const [hien_popup, dat_hien_popup] = useState(false);

    // Refs [cite: 1092, 1113]
    const canvas_ref = useRef(null);
    const pdf_ref = useRef(null);
    const ref_trang = useRef(trang_hien_tai);
    const ref_tong_trang = useRef(0);
    const da_hien_popup_ref = useRef(false);

    // Sync ref để tránh stale closure [cite: 1092]
    useEffect(() => {
        ref_trang.current = trang_hien_tai;
        ref_tong_trang.current = tong_so_trang;

        // Xử lý hiện popup đăng nhập 1 lần duy nhất [cite: 1112, 1113]
        if (!da_dang_nhap && trang_hien_tai >= TRANG_HIEN_POPUP && !da_hien_popup_ref.current) {
            dat_hien_popup(true);
            da_hien_popup_ref.current = true;
        }
    }, [trang_hien_tai, tong_so_trang, da_dang_nhap]);

    // 1. Lấy thông tin sách miễn phí [cite: 1061, 1062, 1065]
    const { data: thong_tin_sach, isLoading: dang_tai_thong_tin, error: loi_api } = useQuery({
        queryKey: ['doc_sach_mien_phi', ma_sach],
        queryFn: async () => {
            const phan_hoi = await api.get(`/doc_sach_mien_phi/${ma_sach}`);
            return phan_hoi.data.du_lieu;
        },
        staleTime: 0,
        retry: false,
        enabled: !!ma_sach,
    });

    // 2. Lấy tiến độ cũ (nếu đã login) [cite: 1076, 1083]
    const queryKey_tien_do = useMemo(
        () => ['tien_do_doc', ma_sach, nguoiDung?.ma_nguoi_dung],
        [ma_sach, nguoiDung?.ma_nguoi_dung]
    );

    const { data: tien_do_ban_dau } = useQuery({
        queryKey: queryKey_tien_do,
        queryFn: async () => {
            const phan_hoi = await api.get(`/tien_do_doc/${ma_sach}`);
            return phan_hoi.data.du_lieu;
        },
        staleTime: 60 * 60 * 1000,
        enabled: !!ma_sach && da_dang_nhap,
    });

    useEffect(() => {
        if (tien_do_ban_dau?.trang_hien_tai) {
            dat_trang_hien_tai(tien_do_ban_dau.trang_hien_tai);
        }
    }, [tien_do_ban_dau]);

    // 3. Lưu tiến độ [cite: 1090, 1091, 1093]
    const luu_tien_do = useCallback(async (trang) => {
        if (!da_dang_nhap || ref_tong_trang.current === 0) return;
        const phan_tram = parseFloat(((trang / ref_tong_trang.current) * 100).toFixed(2));
        try {
            await api.post("/tien_do_doc", {
                ma_sach: Number(ma_sach),
                trang_hien_tai: trang,
                phan_tram
            });
            queryClient.setQueryData(queryKey_tien_do, (cu) => ({ ...cu, trang_hien_tai: trang, phan_tram }));
        } catch (e) { /* Silent */ }
    }, [da_dang_nhap, ma_sach, queryClient, queryKey_tien_do]);

    useEffect(() => {
        const interval = setInterval(() => luu_tien_do(ref_trang.current), 30000);
        return () => {
            clearInterval(interval);
            luu_tien_do(ref_trang.current);
        };
    }, [luu_tien_do]);

    // 4. Load & Render PDF [cite: 1094, 1098, 1101]
    useEffect(() => {
        const file_pdf_url = thong_tin_sach?.file_pdf_url;
        if (!file_pdf_url) return;

        dat_dang_tai_pdf(true);
        const script = document.createElement('script');
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
        script.onload = async () => {
            const pdfjsLib = window['pdfjs-dist/build/pdf'];
            pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

            try {
                const pdf = await pdfjsLib.getDocument(file_pdf_url).promise;
                pdf_ref.current = pdf;
                dat_tong_so_trang(pdf.numPages);
                dat_dang_tai_pdf(false);
            } catch (err) {
                dat_loi_pdf("Không thể tải file PDF. Vui lòng thử lại.");
                dat_dang_tai_pdf(false);
            }
        };
        document.head.appendChild(script);
        return () => script.remove();
    }, [thong_tin_sach?.file_pdf_url]);

    useEffect(() => {
        if (!pdf_ref.current || !canvas_ref.current || dang_tai_pdf) return;
        const render = async () => {
            const page = await pdf_ref.current.getPage(trang_hien_tai);
            const viewport = page.getViewport({ scale: ti_le_phong_to });
            const canvas = canvas_ref.current;
            const context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            await page.render({ canvasContext: context, viewport }).promise;
        };
        render();
    }, [trang_hien_tai, ti_le_phong_to, dang_tai_pdf]);

    // Xử lý lỗi hệ thống [cite: 1072]
    if (loi_api?.response?.status === 404) {
        return (
            <div className="thong_bao_loi_pdf">
                <p>Không tìm thấy sách này.</p>
                <Link to="/trang_chu" className="nut_mua_ngay">Về trang chủ</Link>
            </div>
        );
    }

    if (loi_api?.response?.status === 403) {
        return (
            <div className="thong_bao_loi_pdf">
                <p>Sách này không miễn phí. Vui lòng mua để đọc.</p>
                <Link to={`/sach/${ma_sach}`} className="nut_mua_ngay">Xem chi tiết</Link>
            </div>
        );
    }

    return (
        <div className={`trang_doc_thu ${che_do_toi ? "che_do_toi" : ""}`}>
            {/* Thanh công cụ (Header) */}
            <div className="thanh_cong_cu_doc">
                <button className="nut_quay_lai_doc" onClick={() => navigate(-1)}>
                    ← Quay lại
                </button>
                <span className="ten_sach_doc" title={thong_tin_sach?.ten_sach}>
                    {thong_tin_sach?.ten_sach || "Đang tải..."}
                </span>
                <div className="nhom_nut_cong_cu">
                    <button className="nut_cong_cu" onClick={() => dat_che_do_toi(!che_do_toi)}>
                        {che_do_toi ? "☀" : "☾"}
                    </button>
                    <button className="nut_cong_cu" onClick={() => dat_ti_le_phong_to(p => Math.max(0.5, p - 0.25))} disabled={ti_le_phong_to <= 0.5}>
                        −
                    </button>
                    <span className="ti_le_phong_to">{Math.round(ti_le_phong_to * 100)}%</span>
                    <button className="nut_cong_cu" onClick={() => dat_ti_le_phong_to(p => Math.min(2.0, p + 0.25))} disabled={ti_le_phong_to >= 2.0}>
                        +
                    </button>
                </div>
            </div>

            {/* Popup gợi ý đăng nhập (Tương đương banner trong DocThu) [cite: 1114, 1117] */}
            {hien_popup && (
                <div className="banner_het_doc_thu">
                    <span>Đăng nhập để lưu tiến độ đọc sách của bạn!</span>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <Link to="/dang_nhap" className="nut_mua_ngay">Đăng nhập</Link>
                        <button className="nut_mua_ngay" onClick={() => dat_hien_popup(false)} style={{ background: '#6b7280' }}>Đọc tiếp</button>
                    </div>
                </div>
            )}

            {/* Nội dung Canvas */}
            <div className="khung_canvas">
                {loi_pdf ? (
                    <div className="thong_bao_loi_pdf">
                        <p>{loi_pdf}</p>
                        <button className="nut_quay_lai_doc" onClick={() => navigate(-1)}>← Quay lại</button>
                    </div>
                ) : (dang_tai_thong_tin || dang_tai_pdf) ? (
                    <div className="skeleton_pdf o_skeleton" />
                ) : (
                    <canvas ref={canvas_ref} className="canvas_pdf" />
                )}
            </div>

            {/* Thanh phân trang (Footer) */}
            {!loi_pdf && (
                <div className="thanh_phan_trang_doc">
                    <button className="nut_chuyen_trang" onClick={() => dat_trang_hien_tai(t => Math.max(1, t - 1))} disabled={trang_hien_tai <= 1}>
                        ‹
                    </button>
                    <input
                        type="range"
                        className="thanh_truot_trang"
                        min={1}
                        max={tong_so_trang || 1}
                        value={trang_hien_tai}
                        step={1}
                        onChange={(e) => dat_trang_hien_tai(Number(e.target.value))}
                    />
                    <button className="nut_chuyen_trang" onClick={() => dat_trang_hien_tai(t => Math.min(tong_so_trang, t + 1))} disabled={trang_hien_tai >= tong_so_trang}>
                        ›
                    </button>
                    <span className="so_trang_hien_thi">
                        {trang_hien_tai} / {tong_so_trang || "..."}
                    </span>
                </div>
            )}
        </div>
    );
}