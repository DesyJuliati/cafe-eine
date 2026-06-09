// ============================================
// FILE: src/pages/auth/register.tsx
// ============================================
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, User, Coffee } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useState } from "react";
import api from "@/utils/api";

const registerSchema = z
  .object({
    name: z.string().min(2, "Nama minimal 2 karakter"),
    email: z.string().email("Format email tidak valid"),
    password: z.string().min(6, "Password minimal 6 karakter"),
    confirmPassword: z.string(),
    role: z.enum(["admin", "cashier"]),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password tidak cocok",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: "cashier" },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      await api.post("/auth/register", {
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
      });
      toast.success("Registrasi berhasil! Silakan login.");
      navigate("/login");
    } catch (error: unknown) {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message ?? "Registrasi gagal";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{ backgroundColor: "#F5EFE6" }}
    >
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white rounded-3xl p-8 shadow-lg"
      >
        <div className="flex items-center gap-2 mb-6">
          <Coffee size={28} style={{ color: "#7D301F" }} />
          <span className="font-bold text-xl" style={{ color: "#7D301F" }}>
            Caffeeine POS
          </span>
        </div>

        <h2 className="text-2xl font-bold mb-1" style={{ color: "#1E1E1E" }}>
          Daftar Akun
        </h2>
        <p className="mb-6" style={{ color: "#6B7280" }}>
          Sudah punya akun?{" "}
          <Link to="/login" style={{ color: "#7D301F", fontWeight: 600 }}>
            Masuk
          </Link>
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Nama */}
          <div>
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: "#1E1E1E" }}
            >
              Nama Lengkap
            </label>
            <div className="relative">
              <User
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2"
                style={{ color: "#9CA3AF" }}
              />
              <input
                {...register("name")}
                type="text"
                placeholder="Nama kamu"
                className="w-full pl-10 pr-4 py-3 rounded-xl border outline-none"
                style={{
                  borderColor: errors.name ? "#EF4444" : "#E8DDD0",
                  backgroundColor: "#FFFFFF",
                }}
              />
            </div>
            {errors.name && (
              <p className="text-sm mt-1" style={{ color: "#EF4444" }}>
                {errors.name.message}
              </p>
            )}
          </div>

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
                className="w-full pl-10 pr-4 py-3 rounded-xl border outline-none"
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
                className="w-full pl-10 pr-12 py-3 rounded-xl border outline-none"
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

          {/* Confirm Password */}
          <div>
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: "#1E1E1E" }}
            >
              Konfirmasi Password
            </label>
            <div className="relative">
              <Lock
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2"
                style={{ color: "#9CA3AF" }}
              />
              <input
                {...register("confirmPassword")}
                type={showConfirm ? "text" : "password"}
                placeholder="••••••••"
                className="w-full pl-10 pr-12 py-3 rounded-xl border outline-none"
                style={{
                  borderColor: errors.confirmPassword ? "#EF4444" : "#E8DDD0",
                  backgroundColor: "#FFFFFF",
                }}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ color: "#9CA3AF" }}
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-sm mt-1" style={{ color: "#EF4444" }}>
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Role */}
          <div>
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: "#1E1E1E" }}
            >
              Role
            </label>
            <select
              {...register("role")}
              className="w-full px-4 py-3 rounded-xl border outline-none"
              style={{ borderColor: "#E8DDD0", backgroundColor: "#FFFFFF" }}
            >
              <option value="cashier">Kasir</option>
              <option value="admin">Admin</option>
            </select>
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
            {isLoading ? "Mendaftar..." : "Daftar Sekarang"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
