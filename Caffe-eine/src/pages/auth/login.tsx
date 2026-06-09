// ============================================
// FILE: src/pages/auth/login.tsx
// ============================================
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, Coffee } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import useAuthStore from "@/store/authStore";

const loginSchema = z.object({
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password);
      const user = useAuthStore.getState().user;
      toast.success(`Selamat datang, ${user?.name}! ☕`);
      if (user?.role === "admin") {
        navigate("/dashboard");
      } else {
        navigate("/pos"); // untuk role 'cashier'
      }
    } catch {
      toast.error(useAuthStore.getState().error ?? "Login gagal");
    }
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "#F5EFE6" }}>
      {/* KIRI: Brand Panel */}
      <motion.div
        initial={{ x: -60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:flex w-5/12 flex-col items-center justify-center p-12 relative overflow-hidden"
        style={{ backgroundColor: "#7D301F" }}
      >
        {/* Dekorasi lingkaran */}
        <div
          className="absolute top-[-80px] left-[-80px] w-64 h-64 rounded-full opacity-10"
          style={{ backgroundColor: "#F5EFE6" }}
        />
        <div
          className="absolute bottom-[-60px] right-[-60px] w-48 h-48 rounded-full opacity-10"
          style={{ backgroundColor: "#F5EFE6" }}
        />

        <Coffee size={64} color="#F5EFE6" className="mb-6" />
        <h1 className="text-4xl font-bold text-white mb-3 text-center">
          Caffeeine POS
        </h1>
        <p
          className="text-center text-lg"
          style={{ color: "#F5EFE6", opacity: 0.8 }}
        >
          Sistem kasir kafe modern.
          <br />
          Mudah, cepat, dan terpercaya.
        </p>

        <div
          className="mt-12 p-4 rounded-2xl w-full max-w-xs"
          style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
        >
          <p className="text-white text-sm text-center opacity-80">
            💡 Tips: Kelola transaksi kafe kamu dengan lebih efisien bersama
            Caffeeine POS
          </p>
        </div>
      </motion.div>

      {/* KANAN: Form Panel */}
      <motion.div
        initial={{ x: 60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="flex-1 flex flex-col items-center justify-center p-8"
      >
        <div className="w-full max-w-md">
          {/* Logo mobile */}
          <div className="flex lg:hidden items-center gap-2 mb-8">
            <Coffee size={28} style={{ color: "#7D301F" }} />
            <span className="font-bold text-xl" style={{ color: "#7D301F" }}>
              Caffeeine POS
            </span>
          </div>

          <h2 className="text-3xl font-bold mb-2" style={{ color: "#1E1E1E" }}>
            Masuk
          </h2>
          <p className="mb-8" style={{ color: "#6B7280" }}>
            Belum punya akun?{" "}
            <Link to="/register" style={{ color: "#7D301F", fontWeight: 600 }}>
              Daftar sekarang
            </Link>
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <div>
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: "#1E1E1E" }}
              >
                Email
              </label>
              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: "#9CA3AF" }}
                />
                <input
                  {...register("email")}
                  type="email"
                  placeholder="kamu@caffeeine.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border outline-none transition-all focus:ring-2"
                  style={{
                    borderColor: errors.email ? "#EF4444" : "#E8DDD0",
                    backgroundColor: "#FFFFFF",
                  }}
                />
              </div>
              {errors.email && (
                <p className="text-sm mt-1" style={{ color: "#EF4444" }}>
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: "#1E1E1E" }}
              >
                Password
              </label>
              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: "#9CA3AF" }}
                />
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3 rounded-xl border outline-none transition-all focus:ring-2"
                  style={{
                    borderColor: errors.password ? "#EF4444" : "#E8DDD0",
                    backgroundColor: "#FFFFFF",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: "#9CA3AF" }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm mt-1" style={{ color: "#EF4444" }}>
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl font-semibold text-white transition-all mt-2"
              style={{
                backgroundColor: isLoading ? "#B07060" : "#7D301F",
                cursor: isLoading ? "not-allowed" : "pointer",
              }}
            >
              {isLoading ? "Sedang masuk..." : "Masuk ke Caffeeine"}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
