import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import "./DocSach.css";

export default function DocSach() {
  const { ma_sach } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { da_dang_nhap, nguoiDung } = useAuth();

  const [trang_hien_tai, dat_trang_hien_tai] = useState(1);
  const [tong_so_trang, dat_tong_so_trang] = useState(0);
  const [ti_le_phong_to, dat_ti_le_phong_to] = useState(1.0);
  const [che_do_toi, dat_che_do_toi] = useState(false);
  const [dang_tai_pdf, dat_dang_tai_pdf] = useState(true);
  const [loi_pdf, dat_loi_pdf] = useState("");

  const ref_trang = useRef(trang_hien_tai);
  const ref_tong_trang = useRef(tong_so_trang);
  const canvas_ref = useRef(null);
  const pdf_ref = useRef(null);
  const interval_ref = useRef(null);

  // Sync ref với state để tránh stale closure
  useEffect(() => {
    ref_trang.current = trang_hien_tai;
  }, [trang_hien_tai]);
  useEffect(() => {
    ref_tong_trang.current = tong_so_trang;
  }, [tong_so_trang]);

  // Lấy chi tiết sách từ cache hoặc gọi API
  const { data: chi_tiet_sach } = useQuery({
    queryKey: ["chi_tiet_sach", ma_sach],
    queryFn: async () => {
      const phan_hoi = await api.get(`/sach/${ma_sach}`);
      return phan_hoi.data.du_lieu;
    },
    staleTime: 30 * 60 * 1000,
    enabled: !!ma_sach,
  });

  // Lấy tiến độ ban đầu — key gắn user ID để tránh cache nhầm giữa các tài khoản
  const queryKey_tien_do = useMemo(
    () => ["tien_do_doc", ma_sach, nguoiDung?.ma_nguoi_dung],
    [ma_sach, nguoiDung?.ma_nguoi_dung],
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

  // Khôi phục trang đã đọc
  useEffect(() => {
    if (tien_do_ban_dau?.trang_hien_tai) {
      dat_trang_hien_tai(tien_do_ban_dau.trang_hien_tai);
    }
  }, [tien_do_ban_dau]);

  // Hàm lưu tiến độ (dùng api trực tiếp, không qua useMutation)
  const luu_tien_do = useCallback(
    async (trang) => {
      if (!da_dang_nhap || !ref_tong_trang.current) return;
      const phan_tram = parseFloat(
        ((trang / ref_tong_trang.current) * 100).toFixed(2),
      );
      try {
        await api.post("/tien_do_doc", {
          ma_sach: Number(ma_sach),
          trang_hien_tai: trang,
          phan_tram,
        });
        // Sync React Query cache để restore đúng trang khi navigate lại
        queryClient.setQueryData(queryKey_tien_do, (cu) => ({
          ...cu,
          trang_hien_tai: trang,
          phan_tram,
        }));
      } catch {
        // silent – không hiện toast khi auto-save
      }
    },
    [da_dang_nhap, ma_sach, queryKey_tien_do],
  );

  // Auto-save mỗi 30 giây
  useEffect(() => {
    if (!da_dang_nhap) return;
    interval_ref.current = setInterval(() => {
      luu_tien_do(ref_trang.current);
    }, 30000);
    return () => {
      clearInterval(interval_ref.current);
      // Lưu lần cuối khi unmount
      luu_tien_do(ref_trang.current);
    };
  }, [da_dang_nhap, luu_tien_do]);

  // Load và render PDF
  useEffect(() => {
    const file_pdf_url = chi_tiet_sach?.file_pdf_url;
    if (!file_pdf_url) {
      if (chi_tiet_sach) {
        dat_loi_pdf("Sách này chưa có file PDF.");
        dat_dang_tai_pdf(false);
      }
      return;
    }

    dat_dang_tai_pdf(true);
    dat_loi_pdf("");

    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
    script.onload = async () => {
      const pdfjsLib = window["pdfjs-dist/build/pdf"];
      pdfjsLib.GlobalWorkerOptions.workerSrc =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

      try {
        const pdf = await pdfjsLib.getDocument(file_pdf_url).promise;
        pdf_ref.current = pdf;
        dat_tong_so_trang(pdf.numPages);
        ref_tong_trang.current = pdf.numPages;
        dat_dang_tai_pdf(false);
      } catch {
        dat_loi_pdf("Không thể tải file PDF. Vui lòng thử lại.");
        dat_dang_tai_pdf(false);
      }
    };
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) document.head.removeChild(script);
    };
  }, [chi_tiet_sach?.file_pdf_url]);

  // Render trang PDF khi trang hoặc tỉ lệ thay đổi
  useEffect(() => {
    if (!pdf_ref.current || !canvas_ref.current || dang_tai_pdf) return;

    const render_trang = async () => {
      const pdf = pdf_ref.current;
      const trang = await pdf.getPage(trang_hien_tai);
      const viewport = trang.getViewport({ scale: ti_le_phong_to });
      const canvas = canvas_ref.current;
      const ctx = canvas.getContext("2d");
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      await trang.render({ canvasContext: ctx, viewport }).promise;
    };

    render_trang();
  }, [trang_hien_tai, ti_le_phong_to, dang_tai_pdf]);

  function chuyen_trang_truoc() {
    if (trang_hien_tai <= 1) return;
    dat_trang_hien_tai((t) => t - 1);
  }

  function chuyen_trang_sau() {
    if (trang_hien_tai >= tong_so_trang) return;
    dat_trang_hien_tai((t) => t + 1);
  }

  function phong_to() {
    dat_ti_le_phong_to((t) => Math.min(2.0, parseFloat((t + 0.25).toFixed(2))));
  }

  function thu_nho() {
    dat_ti_le_phong_to((t) => Math.max(0.5, parseFloat((t - 0.25).toFixed(2))));
  }

  function xu_ly_thanh_truot(e) {
    dat_trang_hien_tai(Number(e.target.value));
  }

  return (
    <div className={`trang_doc_sach ${che_do_toi ? "che_do_toi" : ""}`}>
      {/* Thanh công cụ */}
      <div className="thanh_cong_cu_doc">
        <button className="nut_quay_lai_doc" onClick={() => navigate(-1)}>
          ← Quay lại
        </button>
        <span className="ten_sach_doc" title={chi_tiet_sach?.ten_sach}>
          {chi_tiet_sach?.ten_sach || "Đang tải..."}
        </span>
        <div className="nhom_nut_cong_cu">
          <button
            className="nut_cong_cu"
            onClick={() => dat_che_do_toi((v) => !v)}
            title={che_do_toi ? "Chế độ sáng" : "Chế độ tối"}
          >
            {che_do_toi ? "☀" : "☾"}
          </button>
          <button
            className="nut_cong_cu"
            onClick={thu_nho}
            disabled={ti_le_phong_to <= 0.5}
            title="Thu nhỏ"
          >
            −
          </button>
          <span className="ti_le_phong_to">
            {Math.round(ti_le_phong_to * 100)}%
          </span>
          <button
            className="nut_cong_cu"
            onClick={phong_to}
            disabled={ti_le_phong_to >= 2.0}
            title="Phóng to"
          >
            +
          </button>
        </div>
      </div>

      {/* Vùng hiển thị PDF */}
      <div className="khung_canvas">
        {loi_pdf ? (
          <div className="thong_bao_loi_pdf">
            <p>{loi_pdf}</p>
            <button className="nut_quay_lai_doc" onClick={() => navigate(-1)}>
              ← Quay lại
            </button>
          </div>
        ) : dang_tai_pdf ? (
          <div className="skeleton_pdf o_skeleton" />
        ) : (
          <canvas ref={canvas_ref} className="canvas_pdf" />
        )}
      </div>

      {/* Thanh phân trang */}
      {!loi_pdf && (
        <div className="thanh_phan_trang_doc">
          <button
            className="nut_chuyen_trang"
            onClick={chuyen_trang_truoc}
            disabled={trang_hien_tai <= 1}
          >
            ‹
          </button>
          <input
            type="range"
            className="thanh_truot_trang"
            min={1}
            max={tong_so_trang || 1}
            value={trang_hien_tai}
            step={1}
            onChange={xu_ly_thanh_truot}
          />
          <button
            className="nut_chuyen_trang"
            onClick={chuyen_trang_sau}
            disabled={trang_hien_tai >= tong_so_trang}
          >
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
