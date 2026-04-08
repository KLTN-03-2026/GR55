export function dinh_dang_gia(gia) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(gia);
}
