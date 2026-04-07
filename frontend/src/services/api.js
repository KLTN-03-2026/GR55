import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8081/api",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((cau_hinh) => {
  const token = localStorage.getItem("booknest_token");
  if (token) {
    cau_hinh.headers.Authorization = `Bearer ${token}`;
  }
  return cau_hinh;
});

api.interceptors.response.use(
  (phan_hoi) => phan_hoi,
  (loi) => {
    if (loi.response?.status === 401) {
      localStorage.removeItem("booknest_token");
      localStorage.removeItem("booknest_user");
      window.location.href = "/dang_nhap";
    }
    return Promise.reject(loi);
  },
);

export default api;
