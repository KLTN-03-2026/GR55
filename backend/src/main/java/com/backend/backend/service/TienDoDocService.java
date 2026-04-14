package com.backend.backend.service;

import com.backend.backend.dto.DanhSachSachDangDocResponse;
import com.backend.backend.dto.LuuTienDoRequest;
import com.backend.backend.dto.TienDoDocResponse;
import com.backend.backend.entity.TienDoDocSach;
import com.backend.backend.repository.SachRepository;
import com.backend.backend.repository.TienDoDocSachRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TienDoDocService {

    private final TienDoDocSachRepository tienDoDocSachRepository;
    private final SachRepository sachRepository;

    @Transactional
    public TienDoDocResponse luuTienDo(Long maNd, LuuTienDoRequest yeuCau) {
        var sach = sachRepository.findById(yeuCau.getMa_sach())
                .orElseThrow(() -> new RuntimeException("Sách không tồn tại"));

        TienDoDocSach tienDo = tienDoDocSachRepository
                .findByMaNdAndMaSach(maNd, yeuCau.getMa_sach())
                .orElse(new TienDoDocSach());

        if (tienDo.getIdTd() == null) {
            tienDo.setMaNd(maNd);
            tienDo.setMaSach(yeuCau.getMa_sach());
        }

        tienDo.setTrangHienTai(yeuCau.getTrang_hien_tai());
        tienDo.setPhanTram(yeuCau.getPhan_tram());
        tienDo.setLanDocCuoi(LocalDateTime.now());
        tienDoDocSachRepository.save(tienDo);

        TienDoDocResponse.TienDoData duLieu = new TienDoDocResponse.TienDoData(
                sach.getMaSach(),
                sach.getTenSach(),
                sach.getAnhBiaUrl(),
                yeuCau.getTrang_hien_tai(),
                yeuCau.getPhan_tram()
        );

        return new TienDoDocResponse(true, "Lưu tiến độ thành công", duLieu);
    }

    public TienDoDocResponse layTienDo(Long maNd, Long maSach) {
        var sach = sachRepository.findById(maSach)
                .orElseThrow(() -> new RuntimeException("Sách không tồn tại"));

        var tienDo = tienDoDocSachRepository.findByMaNdAndMaSach(maNd, maSach).orElse(null);

        TienDoDocResponse.TienDoData duLieu = new TienDoDocResponse.TienDoData(
                sach.getMaSach(),
                sach.getTenSach(),
                sach.getAnhBiaUrl(),
                tienDo != null ? tienDo.getTrangHienTai() : 1,
                tienDo != null ? tienDo.getPhanTram() : 0.0
        );

        return new TienDoDocResponse(true, "Lấy tiến độ thành công", duLieu);
    }

    public DanhSachSachDangDocResponse laySachDangDoc(Long maNd, int trang, int kichThuoc) {
        Page<TienDoDocSach> page = tienDoDocSachRepository
                .findSachDangDoc(maNd, PageRequest.of(trang - 1, kichThuoc));

        // Batch 1 query thay vì N queries
        List<Long> danhSachMaSach = page.getContent().stream()
                .map(TienDoDocSach::getMaSach)
                .collect(Collectors.toList());
        Map<Long, com.backend.backend.entity.Sach> sachMap = sachRepository.findAllById(danhSachMaSach)
                .stream()
                .collect(Collectors.toMap(com.backend.backend.entity.Sach::getMaSach, s -> s));

        List<DanhSachSachDangDocResponse.SachDangDocData> danhSach = page.getContent().stream()
                .map(td -> {
                    var sach = sachMap.get(td.getMaSach());
                    if (sach == null) return null;
                    return new DanhSachSachDangDocResponse.SachDangDocData(
                            sach.getMaSach(),
                            sach.getTenSach(),
                            sach.getTacGia(),
                            sach.getAnhBiaUrl(),
                            td.getTrangHienTai(),
                            td.getPhanTram()
                    );
                })
                .filter(data -> data != null)
                .collect(Collectors.toList());

        return new DanhSachSachDangDocResponse(
                danhSach,
                page.getNumber() + 1,
                page.getTotalPages(),
                page.getTotalElements()
        );
    }
}
