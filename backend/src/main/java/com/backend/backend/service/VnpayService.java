package com.backend.backend.service;

import com.backend.backend.repository.DonHangRepository;
import com.backend.backend.repository.GoiHoiVienRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;

@Service
@RequiredArgsConstructor
public class VnpayService {

    private final DonHangRepository donHangRepository;
    private final GoiHoiVienRepository goiHoiVienRepository;

    @Value("${vnpay.vnp_TmnCode}")
    private String vnpTmnCode;

    @Value("${vnpay.vnp_HashSecret}")
    private String vnpHashSecret;

    @Value("${vnpay.vnp_Url}")
    private String vnpUrl;

    @Value("${vnpay.vnp_ReturnUrl}")
    private String vnpReturnUrl;

    public String taoUrlThanhToan(Long idDh, BigDecimal tongTien, String maDonHang, boolean dungQr) {
        Map<String, String> thamSo = new TreeMap<>();
        thamSo.put("vnp_Version", "2.1.0");
        thamSo.put("vnp_Command", "pay");
        thamSo.put("vnp_TmnCode", vnpTmnCode);
        thamSo.put("vnp_Amount", tongTien.multiply(BigDecimal.valueOf(100)).toBigInteger().toString());
        if (dungQr) thamSo.put("vnp_BankCode", "VNPAYQR");
        thamSo.put("vnp_CurrCode", "VND");
        thamSo.put("vnp_TxnRef", idDh.toString());
        thamSo.put("vnp_OrderInfo", "Thanh toan don hang " + maDonHang);
        thamSo.put("vnp_OrderType", "book");
        thamSo.put("vnp_Locale", "vn");
        thamSo.put("vnp_ReturnUrl", vnpReturnUrl);
        thamSo.put("vnp_IpAddr", "127.0.0.1");

        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");
        thamSo.put("vnp_CreateDate", sdf.format(cld.getTime()));
        cld.add(Calendar.MINUTE, 15);
        thamSo.put("vnp_ExpireDate", sdf.format(cld.getTime()));

        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();
        for (Map.Entry<String, String> entry : thamSo.entrySet()) {
            String encodedValue = URLEncoder.encode(entry.getValue(), StandardCharsets.US_ASCII);
            hashData.append(entry.getKey()).append('=').append(encodedValue).append('&');
            query.append(URLEncoder.encode(entry.getKey(), StandardCharsets.US_ASCII))
                 .append('=')
                 .append(encodedValue)
                 .append('&');
        }
        hashData.setLength(hashData.length() - 1);
        query.setLength(query.length() - 1);

        String chuKy = hmacSHA512(vnpHashSecret, hashData.toString());
        return vnpUrl + "?" + query + "&vnp_SecureHash=" + chuKy;
    }

    public boolean xacThucChuKy(Map<String, String> params) {
        String secureHash = params.get("vnp_SecureHash");
        if (secureHash == null) return false;

        Map<String, String> fields = new TreeMap<>();
        for (Map.Entry<String, String> entry : params.entrySet()) {
            String key = entry.getKey();
            if (!key.equals("vnp_SecureHash") && !key.equals("vnp_SecureHashType")) {
                fields.put(key, entry.getValue());
            }
        }

        StringBuilder hashData = new StringBuilder();
        for (Map.Entry<String, String> entry : fields.entrySet()) {
            String encodedValue = URLEncoder.encode(entry.getValue(), StandardCharsets.US_ASCII);
            hashData.append(entry.getKey()).append('=').append(encodedValue).append('&');
        }
        hashData.setLength(hashData.length() - 1);

        String chuKyTinh = hmacSHA512(vnpHashSecret, hashData.toString());
        return chuKyTinh.equalsIgnoreCase(secureHash);
    }

    public boolean kiemTraSoTien(Long idDh, String vnpAmount) {
        return donHangRepository.findById(idDh)
                .map(dh -> {
                    BigDecimal soTienVnpay = new BigDecimal(vnpAmount).divide(BigDecimal.valueOf(100));
                    return dh.getTongTien().compareTo(soTienVnpay) == 0;
                })
                .orElse(false);
    }

    public String taoUrlThanhToanHoiVien(Long maNd, Long maHv, BigDecimal gia, boolean dungQr) {
        // Format: HV{maNd}P{maHv}T{timestamp_5digits} — dễ parse tại callback
        String txnRef = "HV" + maNd + "P" + maHv + "T" + (System.currentTimeMillis() % 100000);
        String returnUrlHoiVien = vnpReturnUrl.replaceAll("/api/mua_sach/vnpay_callback.*", "/api/hoi_vien/vnpay_callback");

        Map<String, String> thamSo = new TreeMap<>();
        thamSo.put("vnp_Version", "2.1.0");
        thamSo.put("vnp_Command", "pay");
        thamSo.put("vnp_TmnCode", vnpTmnCode);
        thamSo.put("vnp_Amount", gia.multiply(BigDecimal.valueOf(100)).toBigInteger().toString());
        if (dungQr) thamSo.put("vnp_BankCode", "VNPAYQR");
        thamSo.put("vnp_CurrCode", "VND");
        thamSo.put("vnp_TxnRef", txnRef);
        thamSo.put("vnp_OrderInfo", "Nang cap hoi vien BookNest");
        thamSo.put("vnp_OrderType", "membership");
        thamSo.put("vnp_Locale", "vn");
        thamSo.put("vnp_ReturnUrl", returnUrlHoiVien);
        thamSo.put("vnp_IpAddr", "127.0.0.1");

        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");
        thamSo.put("vnp_CreateDate", sdf.format(cld.getTime()));
        cld.add(Calendar.MINUTE, 15);
        thamSo.put("vnp_ExpireDate", sdf.format(cld.getTime()));

        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();
        for (Map.Entry<String, String> entry : thamSo.entrySet()) {
            String encodedValue = URLEncoder.encode(entry.getValue(), StandardCharsets.US_ASCII);
            hashData.append(entry.getKey()).append('=').append(encodedValue).append('&');
            query.append(URLEncoder.encode(entry.getKey(), StandardCharsets.US_ASCII))
                 .append('=').append(encodedValue).append('&');
        }
        hashData.setLength(hashData.length() - 1);
        query.setLength(query.length() - 1);

        String chuKy = hmacSHA512(vnpHashSecret, hashData.toString());
        return vnpUrl + "?" + query + "&vnp_SecureHash=" + chuKy;
    }

    // Trả về [maNd, maHv] từ txnRef dạng "HV{maNd}P{maHv}T{ts}"
    public long[] phanTichTxnRefHoiVien(String txnRef) {
        String phan = txnRef.substring(2); // bỏ "HV"
        String[] pParts = phan.split("P");
        long maNd = Long.parseLong(pParts[0]);
        long maHv = Long.parseLong(pParts[1].split("T")[0]);
        return new long[]{maNd, maHv};
    }

    public boolean kiemTraSoTienHoiVien(Long maHv, String vnpAmount) {
        return goiHoiVienRepository.findByMaHvAndHoatDongTrue(maHv)
                .map(goi -> {
                    BigDecimal soTienVnpay = new BigDecimal(vnpAmount).divide(BigDecimal.valueOf(100));
                    return goi.getGia().compareTo(soTienVnpay) == 0;
                })
                .orElse(false);
    }

    private String hmacSHA512(String key, String data) {
        try {
            Mac mac = Mac.getInstance("HmacSHA512");
            mac.init(new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA512"));
            byte[] rawHmac = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder();
            for (byte b : rawHmac) sb.append(String.format("%02x", b));
            return sb.toString();
        } catch (Exception e) {
            throw new RuntimeException("Lỗi tạo chữ ký HMAC", e);
        }
    }
}
