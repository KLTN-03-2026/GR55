import { createContext, useContext, useState, useCallback } from "react";

const NguCanhXacThuc = createContext(null);

export function AuthProvider({ children }) {
  const [nguoiDung, dat_nguoi_dung] = useState(() => {
    try {
      const du_lieu = localStorage.getItem("booknest_user");
      return du_lieu ? JSON.parse(du_lieu) : null;
    } catch {
      return null;
    }
  });

  const [token, dat_token] = useState(
    () => localStorage.getItem("booknest_token") || null,
  );

  const dang_nhap = useCallback((token_moi, thong_tin_nguoi_dung) => {
    localStorage.setItem("booknest_token", token_moi);
    localStorage.setItem("booknest_user", JSON.stringify(thong_tin_nguoi_dung));
    dat_token(token_moi);
    dat_nguoi_dung(thong_tin_nguoi_dung);
  }, []);

  const dang_xuat = useCallback(() => {
    localStorage.removeItem("booknest_token");
    localStorage.removeItem("booknest_user");
    dat_token(null);
    dat_nguoi_dung(null);
  }, []);

  const cap_nhat_nguoi_dung = useCallback(
    (thong_tin_moi) => {
      const nguoi_dung_moi = { ...nguoiDung, ...thong_tin_moi };
      localStorage.setItem("booknest_user", JSON.stringify(nguoi_dung_moi));
      dat_nguoi_dung(nguoi_dung_moi);
    },
    [nguoiDung],
  );

  const da_dang_nhap = Boolean(token && nguoiDung);

  return (
    <NguCanhXacThuc.Provider
      value={{
        da_dang_nhap,
        nguoiDung,
        token,
        dang_nhap,
        dang_xuat,
        cap_nhat_nguoi_dung,
      }}
    >
      {children}
    </NguCanhXacThuc.Provider>
  );
}

export function useAuth() {
  const nguCanh = useContext(NguCanhXacThuc);
  if (!nguCanh) {
    throw new Error("useAuth phải được dùng bên trong AuthProvider");
  }
  return nguCanh;
}
