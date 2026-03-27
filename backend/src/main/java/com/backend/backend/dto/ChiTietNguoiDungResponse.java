package com.backend.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.util.List;

@Data
@AllArgsConstructor
public class ChiTietNguoiDungResponse {
    private NguoiDungResponse.NguoiDungData thong_tin;
    private List<Object> lich_su_don_hang; // TODO: bổ sung khi hoàn thiện entity DonHang
}
