import axios from "axios";

// Buat "pintu" dengan alamat backend
const api = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// INTERCEPTOR REQUEST: Otomatis sisipkan token sebelum request dikirim
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // nanti kita simpan token di sini
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// INTERCEPTOR RESPONSE: Tangani error global (misal token kadaluarsa)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token invalid atau expired
      localStorage.removeItem("token");
      // Redirect ke halaman login (nanti kita buat)
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default api;

//     baseURL = alamat pokok backend. Semua request nanti cukup tulis /auth/login, dia otomatis lengkap jadi http://localhost:3000/api/auth/login.

//     Request interceptor: sebelum kirim, cek apakah ada token di localStorage. Kalau ada, tempel di header.

//     Response interceptor: kalau dapat error 401 (Unauthorized), hapus token dan redirect ke login.
