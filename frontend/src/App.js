import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ChatbotWidget from "./components/ChatbotWidget";

function App(props) {
  return (
    <div className="app-wrapper">
      <Header />

      {/* Đây là phần khung xương cố định */}
      <section className="main-body-wrapper">
        <div className="container">
          <div className="row">
            {/* Nội dung riêng của mỗi trang sẽ đổ vào đây */}
            <main className="main-content">{props.children}</main>
          </div>
        </div>
      </section>

      <Footer />
      <ChatbotWidget />
    </div>
  );
}

export default App;
