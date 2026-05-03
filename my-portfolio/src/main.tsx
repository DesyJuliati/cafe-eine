import { StrictMode } from "react"; //first doorway
import { createRoot } from "react-dom/client"; // ini wat ap**buat ini root atau alur ga si?
import "./index.css";
import App from "./App.tsx";
// diatas untuk import componen(?)CMIIW
createRoot(document.getElementById("root")!).render(
  //serc elemnt `<div id="root">` di file index trs react bakal ngisi keselurhan apk me *aisaid
  <StrictMode>
    <App />
  </StrictMode>,
);
//  open to localhost 5173 => vite run main ini => main cari root yang di bungkus sama dic di index di dlm my-portfolio,
// React isi div itu dengan <App /> (jujur ini gw masih bingung )
//         ↓
// App.tsx tentukan halaman mana yang ditampilkan
//         ↓
// Halaman yang sesuai URL ditampilkan ke user
