import Header from '../components/Header';

export default function TrangChu() {
  return (
    <>
      <Header />
      <main style={{ padding: '40px 24px', fontFamily: 'system-ui, sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1e3a5f' }}>
          Chào mừng đến với <span style={{ color: '#2563eb' }}>BookNest</span>
        </h1>
        <p style={{ color: '#6b7280', marginTop: '12px', fontSize: '16px' }}>
          Nền tảng sách số trực tuyến hàng đầu Việt Nam.
        </p>
      </main>
    </>
  );
}
