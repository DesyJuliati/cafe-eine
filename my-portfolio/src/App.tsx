// App.tsx for rute
// Import tools routing dari react-router-dom(auto ga si?)
import { BrowserRouter, Routes, Route } from "react-router-dom";
import POSPage from "@/pages/pos/POSPage";
import MenuPage from "@/pages/menu/MenuPage";
import AboutPage from "@/pages/about/AboutPage";
import ContactPage from "@/pages/contact/ContactPage";

const App = () => {
  // ini function ka yak, klw iya jan apme salah lagi
  return (
    <BrowserRouter>
      {/*  //ni yang membuat URL di browser bisa berubah tanpa me-reload halaman.
      Tanpa ini, navigasi antar halaman akan reload browser setiap kali —
      seperti website jadul. // auto import ga si dr = react-router-dom // turn
      on the system */}
      <Routes>
        {" "}
        {/* //bungkus */}
        <Route path="/" element={<POSPage />} />
        <Route path="/menu" element={<MenuPage />} />{" "}
        {/* // Setiap Route = satu
        aturan "kalau URL ini → tampilkan ini" */}
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
