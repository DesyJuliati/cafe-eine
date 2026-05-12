import { StrictMode } from "react"; //first doorway
import { createRoot } from "react-dom/client"; // ini wat ap**buat ini root atau alur ga si?
import "./index.css";
import App from "./App.tsx";
// diatas untuk import componen(?)CMIIW
import { Toaster } from "react-hot-toast";
createRoot(document.getElementById("root")!).render(
  //serc elemnt `<div id="root">` di file index trs react bakal ngisi keselurhan apk me *aisaid
  <StrictMode>
    <App />
    <Toaster
      position="top-right"
      // ini Notifikasi muncul di pojok kanan atas

      toastOptions={{
        duration: 3000,
        // ini Notifikasi hilang setelah 3 detik

        style: {
          background: "#F5EFE6",
          //  Warna bg  = cream ada di index.css
          color: "#1E1E1E",
          // ini teks hytam
          fontFamily: "Roboto, sans-serif", //lho kok iki iso?
          fontSize: "14px",
          borderRadius: "12px",
          border: "1px solid #E8DDD0",
          // ↑ Border soft Caffeeine
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        },
      }}
    />
  </StrictMode>,
);
//  open to localhost 5173 => vite run main ini => main cari root yang di bungkus sama dic di index di dlm caffe-eine,
// React isi div itu dengan <App /> (jujur ini gw masih bingung ) trs,
// App.tsx tentukan halaman mana yang ditampilkan trs,
// Halaman yang sesuai URL ditampilkan ke user
