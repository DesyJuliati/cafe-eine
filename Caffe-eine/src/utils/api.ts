// ============================================
// FILE: src/utils/api.ts
// ============================================
// Axios instance terpusat untuk semua HTTP request ke backend.
// Gunakan file ini untuk semua API call, BUKAN import axios langsung.

import axios from "axios";

// ===== BUAT INSTANCE =====
const api = axios.create({
  baseURL: "https://demo-api-three-pied.vercel.app/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// ===== REQUEST INTERCEPTOR =====
// Otomatis sisipkan Bearer token sebelum setiap request dikirim
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ===== RESPONSE INTERCEPTOR =====
// Tangani error global secara terpusat
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default api;
