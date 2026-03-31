import { useNavigate } from 'react-router-dom';
import './QuanTri.css';
import Header from '../components/Header';

const MENU_QUAN_TRI = [
  {
    duong_dan: '/quan_tri/danh_muc',
    tieu_de: 'Quản lý danh mục',
    mo_ta: 'Thêm, sửa, xóa danh mục sách',
  },
  {
    duong_dan: '/quan_tri/sach',
    tieu_de: 'Quản lý sách',
    mo_ta: 'Thêm, sửa, xóa sách và file PDF',
  },
];

export default function QuanTri() {
  const navigate = useNavigate();

  return (
    <div className="trang_quan_tri">
      {/* <Header/> */}
      <div className="noi_dung_quan_tri">
        <h1 className="tieu_de_quan_tri">Trang quản trị</h1>
        <p className="mo_ta_quan_tri">Chọn chức năng cần quản lý</p>

        <div className="luoi_menu_quan_tri">
          {MENU_QUAN_TRI.map((muc) => (
            <button
              key={muc.duong_dan}
              className="the_menu_quan_tri"
              onClick={() => navigate(muc.duong_dan)}
            >
              <span className="tieu_de_the">{muc.tieu_de}</span>
              <span className="mo_ta_the">{muc.mo_ta}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
