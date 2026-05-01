import { useState, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import TheCardSach from '../components/TheCardSach';
import './TimKiem.css';

const KICH_THUOC_TRANG = 12;

export default function TimKiem() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tu_khoa = searchParams.get('q') || '';
  const trang_hien_tai = Number(searchParams.get('trang') || 1);

  const [bo_loc, dat_bo_loc] = useState({
    ma_danh_muc: null,
    min_gia: null,
    max_gia: null,
    min_danh_gia: null,
    sach_mien_phi: null,
    sach_hoi_vien: null,
    sap_xep: 'doc_nhieu',
  });

  const [bo_loc_tam, dat_bo_loc_tam] = useState({ ...bo_loc });

  const { data: danh_muc = [] } = useQuery({
    queryKey: ['danh_muc_trang_chu'],
    queryFn: async () => {
      const res = await api.get('/home/danh_muc');
      return res.data;
    },
    staleTime: 60 * 60 * 1000,
  });

  const { data: ket_qua, isLoading: dang_tim_kiem } = useQuery({
    queryKey: ['tim_kiem_sach', tu_khoa, trang_hien_tai, bo_loc],
    queryFn: async () => {
      const phan_hoi = await api.get('/tim_kiem', {
        params: {
          tu_khoa: tu_khoa || undefined,
          trang: trang_hien_tai,
          kich_thuoc: KICH_THUOC_TRANG,
          ma_danh_muc: bo_loc.ma_danh_muc ?? undefined,
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
    enabled: true,
  });

  const xu_ly_ap_dung_bo_loc = useCallback(() => {
    dat_bo_loc({ ...bo_loc_tam });
    setSearchParams({ q: tu_khoa, trang: 1 });
  }, [bo_loc_tam, tu_khoa, setSearchParams]);

  const xu_ly_doi_trang = useCallback((trang_moi) => {
    setSearchParams({ q: tu_khoa, trang: trang_moi });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [tu_khoa, setSearchParams]);

  const xu_ly_sap_xep = useCallback((gia_tri) => {
    dat_bo_loc_tam((prev) => ({ ...prev, sap_xep: gia_tri }));
    dat_bo_loc((prev) => ({ ...prev, sap_xep: gia_tri }));
    setSearchParams({ q: tu_khoa, trang: 1 });
  }, [tu_khoa, setSearchParams]);

  const xu_ly_thay_doi_bo_loc = useCallback((ten, gia_tri) => {
    dat_bo_loc_tam((prev) => ({ ...prev, [ten]: gia_tri }));
  }, []);

  return (
    <div className="trang_tim_kiem">
      <div className="tieu_de_tim_kiem">
        {tu_khoa ? (
          <h1>
            {ket_qua?.tong_so_ban_ghi ?? '...'} kết quả cho &ldquo;{tu_khoa}&rdquo;
          </h1>
        ) : (
          <h1>Tất cả sách</h1>
        )}
      </div>

      <div className="bo_cuc_chinh">
        {/* Bộ lọc bên trái */}
        <aside className="bo_loc_ben_trai">
          <h3 className="tieu_de_bo_loc">Bộ lọc</h3>

          <div className="nhom_bo_loc">
            <label className="nhan_bo_loc">Thể loại</label>
            <select
              className="chon_sap_xep"
              value={bo_loc_tam.ma_danh_muc ?? ''}
              onChange={(e) =>
                xu_ly_thay_doi_bo_loc('ma_danh_muc', e.target.value ? Number(e.target.value) : null)
              }
            >
              <option value="">Tất cả</option>
              {danh_muc.map((dm) => (
                <option key={dm.ma_dm} value={dm.ma_dm}>
                  {dm.ten_danh_muc}
                </option>
              ))}
            </select>
          </div>

          <div className="nhom_bo_loc">
            <label className="nhan_bo_loc">Sắp xếp</label>
            <select
              className="chon_sap_xep"
              value={bo_loc.sap_xep}
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
                  xu_ly_thay_doi_bo_loc('min_gia', e.target.value ? Number(e.target.value) : null)
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
                  xu_ly_thay_doi_bo_loc('max_gia', e.target.value ? Number(e.target.value) : null)
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
                xu_ly_thay_doi_bo_loc('min_danh_gia', e.target.value ? Number(e.target.value) : null)
              }
            >
              <option value="">Tất cả</option>
              {[1, 2, 3, 4, 5].map((sao) => (
                <option key={sao} value={sao}>
                  {sao} sao trở lên
                </option>
              ))}
            </select>
          </div>

          <div className="nhom_bo_loc">
            <label className="nhan_checkbox">
              <input
                type="checkbox"
                checked={!!bo_loc_tam.sach_mien_phi}
                onChange={(e) =>
                  xu_ly_thay_doi_bo_loc('sach_mien_phi', e.target.checked ? true : null)
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
                  xu_ly_thay_doi_bo_loc('sach_hoi_vien', e.target.checked ? true : null)
                }
              />
              Sách hội viên
            </label>
          </div>

          <button className="nut_ap_dung" onClick={xu_ly_ap_dung_bo_loc}>
            Áp dụng
          </button>
        </aside>

        {/* Khu vực kết quả */}
        <main className="khu_vuc_ket_qua">
          {dang_tim_kiem ? (
            <div className="luoi_ket_qua">
              {Array.from({ length: KICH_THUOC_TRANG }).map((_, i) => (
                <TheCardSach key={i} skeleton />
              ))}
            </div>
          ) : ket_qua?.danh_sach?.length > 0 ? (
            <>
              <div className="luoi_ket_qua">
                {ket_qua.danh_sach.map((sach) => (
                  <TheCardSach key={sach.ma_sach} sach={sach} />
                ))}
              </div>

              {/* Phân trang */}
              {ket_qua.tong_so_trang > 1 && (
                <div className="phan_trang">
                  <button
                    className="nut_phan_trang"
                    disabled={trang_hien_tai <= 1}
                    onClick={() => xu_ly_doi_trang(trang_hien_tai - 1)}
                  >
                    ← Trước
                  </button>
                  <span className="vi_tri_trang">
                    Trang {trang_hien_tai} / {ket_qua.tong_so_trang}
                  </span>
                  <button
                    className="nut_phan_trang"
                    disabled={trang_hien_tai >= ket_qua.tong_so_trang}
                    onClick={() => xu_ly_doi_trang(trang_hien_tai + 1)}
                  >
                    Sau →
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="khong_co_ket_qua">
              <p>Không tìm thấy sách phù hợp với từ khóa.</p>
              <Link to="/tim_kiem" className="nut_xem_tat_ca">
                Xem tất cả sách
              </Link>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}