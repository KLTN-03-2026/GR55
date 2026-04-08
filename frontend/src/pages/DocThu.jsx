import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../services/api";
import "./DocThu.css";

export default function DocThu() {
  const { ma_sach } = useParams();
  const navigate = useNavigate();

  const [trang_hien_tai, dat_trang_hien_tai] = useState(1);
  const [tong_so_trang, dat_tong_so_trang] = useState(0);
  const [ti_le_phong_to, dat_ti_le_phong_to] = useState(1.0);
  const [che_do_toi, dat_che_do_toi] = useState(false);
  const [dang_tai_pdf, dat_dang_tai_pdf] = useState(true);
  const [loi_pdf, dat_loi_pdf] = useState("");
  const [hien_banner, dat_hien_banner] = useState(false);

  const canvas_ref = useRef(null);
  const pdf_ref = useRef(null);

  const { data: chi_tiet_sach } = useQuery({
    queryKey: ["chi_tiet_sach", ma_sach],
    queryFn: async () => {
      const phan_hoi = await api.get(`/sach/${ma_sach}`);
      return phan_hoi.data.du_lieu;
    },
    staleTime: 30 * 60 * 1000,
    enabled: !!ma_sach,
  });

  const so_trang_doc_thu = chi_tiet_sach?.so_trang_doc_thu || 0;

  // Kiểm tra khi đến trang cuối cho phép
  useEffect(() => {
    if (so_trang_doc_thu > 0 && trang_hien_tai >= so_trang_doc_thu) {
      dat_hien_banner(true);
    } else {
      dat_hien_banner(false);
    }
  }, [trang_hien_tai, so_trang_doc_thu]);

  // Load PDF
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
        // Giới hạn số trang hiển thị theo so_trang_doc_thu
        const gioi_han =
          so_trang_doc_thu > 0
            ? Math.min(so_trang_doc_thu, pdf.numPages)
            : pdf.numPages;
        dat_tong_so_trang(gioi_han);
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
  }, [chi_tiet_sach?.file_pdf_url, so_trang_doc_thu]);

  // Render trang PDF
  useEffect(() => {
    if (!pdf_ref.current || !canvas_ref.current || dang_tai_pdf) return;
    const render_trang = async () => {
      const trang = await pdf_ref.current.getPage(trang_hien_tai);
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

  return (
    <div className={`trang_doc_thu ${che_do_toi ? "che_do_toi" : ""}`}>
      {/* Thanh công cụ */}
      <div className="thanh_cong_cu_doc">
        <button className="nut_quay_lai_doc" onClick={() => navigate(-1)}>
          ← Quay lại
        </button>
        <span className="ten_sach_doc" title={chi_tiet_sach?.ten_sach}>
          {chi_tiet_sach?.ten_sach || "Đang tải..."}{" "}
          {so_trang_doc_thu > 0 && (
            <span className="nhan_doc_thu">
              Đọc thử — {so_trang_doc_thu} trang
            </span>
          )}
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
          >
            +
          </button>
        </div>
      </div>

      {/* Banner hết trang đọc thử */}
      {hien_banner && (
        <div className="banner_het_doc_thu">
          <span>
            Bạn đã đọc hết {so_trang_doc_thu} trang thử. Mua sách để đọc tiếp!
          </span>
          <Link to={`/sach/${ma_sach}`} className="nut_mua_ngay">
            Mua ngay →
          </Link>
        </div>
      )}

      {/* Canvas */}
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
            onChange={(e) => dat_trang_hien_tai(Number(e.target.value))}
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
