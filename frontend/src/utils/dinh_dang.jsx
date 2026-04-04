export function dinh_dang_gia(gia) {
  if (gia === null || gia === undefined) return "0 ₫";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(gia);
}
