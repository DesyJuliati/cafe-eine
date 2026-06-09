import { useState, useRef } from "react";
import { Plus, Edit2, Trash2, Camera } from "lucide-react";
import { Emoji } from "react-emoji-render";
import AppLayout from "@/component/common/AppLayout";
import { useEmployeeStore, type Employee } from "@/store/employeeStore";
import toast from "react-hot-toast";

// Daftar emoji yang bisa dipilih (bisa diperbanyak)
const EMOJI_LIST = [
  "😀",
  "😃",
  "😄",
  "😁",
  "😎",
  "🤩",
  "🥳",
  "😇",
  "😊",
  "☺️",
  "👩‍💼",
  "👨‍💼",
  "👩‍🍳",
  "👨‍🍳",
  "👩‍🔧",
  "👨‍🔧",
  "🧑‍💻",
  "👩‍💻",
  "🧢",
  "👒",
  "🐱",
  "🐶",
  "🦊",
  "🐼",
  "🦁",
  "🐸",
  "☕",
  "🍵",
  "🍰",
  "🥐",
];

const EMPTY_FORM: Omit<Employee, "id" | "joinDate"> = {
  name: "",
  role: "cashier",
  email: "",
  phone: "",
  isActive: true,
  pin: "",
  avatar: "👤",
};

export default function EmployeePage() {
  const {
    employees,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    toggleActive,
  } = useEmployeeStore();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] =
    useState<Omit<Employee, "id" | "joinDate">>(EMPTY_FORM);
  const [filterRole, setFilterRole] = useState<"semua" | "admin" | "cashier">(
    "semua",
  );
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filtered =
    filterRole === "semua"
      ? employees
      : employees.filter((e) => e.role === filterRole);

  const handleOpenAdd = () => {
    setEditId(null);
    setForm({ ...EMPTY_FORM });
    setShowForm(true);
  };

  const handleOpenEdit = (emp: Employee) => {
    setEditId(emp.id);
    setForm({
      name: emp.name,
      role: emp.role,
      email: emp.email,
      phone: emp.phone,
      isActive: emp.isActive,
      pin: emp.pin,
      avatar: emp.avatar || "👤",
    });
    setShowForm(true);
  };

  const handleSave = () => {
    if (!form.name.trim()) {
      toast.error("Nama karyawan wajib diisi!");
      return;
    }
    if (!form.email.trim()) {
      toast.error("Email wajib diisi!");
      return;
    }
    if (editId) {
      updateEmployee(editId, form);
      toast.success(`${form.name} berhasil diupdate!`);
    } else {
      addEmployee(form);
      toast.success(`${form.name} berhasil ditambahkan!`);
    }
    setShowForm(false);
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm({ ...form, avatar: reader.result as string }); // base64
    };
    reader.readAsDataURL(file);
  };

  const adminCount = employees.filter((e) => e.role === "admin").length;
  const cashierCount = employees.filter((e) => e.role === "cashier").length;
  const activeCount = employees.filter((e) => e.isActive).length;

  return (
    <AppLayout title="Manajemen Karyawan">
      {/* Stats - sama seperti sebelumnya */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        {[
          {
            label: "Total Karyawan",
            val: employees.length,
            bg: "#F5EFE6",
            color: "#7D301F",
          },
          { label: "Admin", val: adminCount, bg: "#FEF3E2", color: "#D97706" },
          {
            label: "Kasir",
            val: cashierCount,
            bg: "#DBEAFE",
            color: "#2563EB",
          },
          { label: "Aktif", val: activeCount, bg: "#DCFCE7", color: "#16A34A" },
        ].map((s) => (
          <div
            key={s.label}
            style={{
              flex: 1,
              background: s.bg,
              borderRadius: 12,
              padding: "14px 18px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ fontWeight: 600, fontSize: 13, color: s.color }}>
              {s.label}
            </span>
            <span style={{ fontWeight: 800, fontSize: 26, color: s.color }}>
              {s.val}
            </span>
          </div>
        ))}
      </div>

      {/* Filter + Add */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <div style={{ display: "flex", gap: 8 }}>
          {(["semua", "admin", "cashier"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setFilterRole(r)}
              style={{
                padding: "7px 18px",
                borderRadius: 20,
                fontWeight: 600,
                fontSize: 13,
                border: "1px solid",
                borderColor: filterRole === r ? "#7D301F" : "#E8DDD0",
                backgroundColor: filterRole === r ? "#7D301F" : "#fff",
                color: filterRole === r ? "#fff" : "#6B7280",
                cursor: "pointer",
                textTransform: "capitalize",
              }}
            >
              {r === "semua" ? "Semua" : r === "cashier" ? "Kasir" : "Admin"}
            </button>
          ))}
        </div>
        <button
          onClick={handleOpenAdd}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 20px",
            borderRadius: 10,
            background: "#7D301F",
            border: "none",
            color: "#fff",
            fontWeight: 700,
            cursor: "pointer",
            fontSize: 14,
          }}
        >
          <Plus size={16} /> Tambah Karyawan
        </button>
      </div>

      {/* Employees Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 16,
        }}
      >
        {filtered.map((emp) => (
          <div
            key={emp.id}
            style={{
              background: "#fff",
              borderRadius: 16,
              padding: 20,
              border: `2px solid ${emp.isActive ? "#E8DDD0" : "#FCA5A5"}`,
              opacity: emp.isActive ? 1 : 0.6,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              {/* Avatar dengan react-emoji */}
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: emp.role === "admin" ? "#FEF3E2" : "#DBEAFE",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 28,
                  overflow: "hidden",
                }}
              >
                {emp.avatar ? (
                  emp.avatar.startsWith("data:") ? (
                    <img
                      src={emp.avatar}
                      alt="avatar"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <Emoji text={emp.avatar} />
                  )
                ) : (
                  <Emoji text="👤" />
                )}
              </div>
              <span
                style={{
                  padding: "3px 10px",
                  borderRadius: 20,
                  fontSize: 11,
                  fontWeight: 700,
                  background: emp.role === "admin" ? "#FEF3E2" : "#DBEAFE",
                  color: emp.role === "admin" ? "#D97706" : "#2563EB",
                  textTransform: "capitalize",
                }}
              >
                {emp.role === "cashier" ? "Kasir" : "Admin"}
              </span>
            </div>
            <div style={{ marginTop: 14 }}>
              <div style={{ fontWeight: 700, fontSize: 16, color: "#1E1E1E" }}>
                {emp.name}
              </div>
              <div style={{ fontSize: 13, color: "#9CA3AF", marginTop: 2 }}>
                {emp.email}
              </div>
              {emp.phone && (
                <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2 }}>
                  📱 {emp.phone}
                </div>
              )}
              <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2 }}>
                📅 Bergabung:{" "}
                {new Date(emp.joinDate).toLocaleDateString("id-ID", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
              {emp.role === "cashier" && emp.pin && (
                <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2 }}>
                  🔑 PIN: {"•".repeat(emp.pin.length)}
                </div>
              )}
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
              <button
                onClick={() => toggleActive(emp.id)}
                style={{
                  flex: 1,
                  padding: "7px 0",
                  borderRadius: 8,
                  fontWeight: 600,
                  fontSize: 12,
                  background: emp.isActive ? "#FEE2E2" : "#DCFCE7",
                  border: "1px solid",
                  borderColor: emp.isActive ? "#FCA5A5" : "#86EFAC",
                  color: emp.isActive ? "#DC2626" : "#16A34A",
                  cursor: "pointer",
                }}
              >
                {emp.isActive ? "Nonaktifkan" : "Aktifkan"}
              </button>
              <button
                onClick={() => handleOpenEdit(emp)}
                style={{
                  padding: "7px 12px",
                  borderRadius: 8,
                  background: "#F5EFE6",
                  border: "1px solid #E8DDD0",
                  color: "#7D301F",
                  cursor: "pointer",
                }}
              >
                <Edit2 size={14} />
              </button>
              {deleteConfirm === emp.id ? (
                <>
                  <button
                    onClick={() => {
                      deleteEmployee(emp.id);
                      setDeleteConfirm(null);
                      toast.success("Karyawan dihapus");
                    }}
                    style={{
                      padding: "7px 10px",
                      borderRadius: 8,
                      background: "#EF4444",
                      border: "none",
                      color: "#fff",
                      cursor: "pointer",
                      fontSize: 12,
                      fontWeight: 700,
                    }}
                  >
                    Ya
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(null)}
                    style={{
                      padding: "7px 10px",
                      borderRadius: 8,
                      background: "#F3F4F6",
                      border: "1px solid #E8DDD0",
                      cursor: "pointer",
                      fontSize: 12,
                    }}
                  >
                    Batal
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setDeleteConfirm(emp.id)}
                  style={{
                    padding: "7px 12px",
                    borderRadius: 8,
                    background: "#FEE2E2",
                    border: "1px solid #FCA5A5",
                    color: "#EF4444",
                    cursor: "pointer",
                  }}
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* FORM MODAL – dengan avatar editor */}
      {showForm && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 20,
              padding: 32,
              width: 520,
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <h2 style={{ margin: "0 0 24px", fontSize: 18, fontWeight: 800 }}>
              {editId ? "✏️ Edit Karyawan" : "➕ Tambah Karyawan"}
            </h2>
            <div style={{ display: "grid", gap: 14 }}>
              <div>
                <label style={fLbl}>Nama Lengkap *</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Budi Santoso"
                  style={fInput}
                />
              </div>
              <div>
                <label style={fLbl}>Email *</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="budi@caffeeine.id"
                  style={fInput}
                />
              </div>
              <div>
                <label style={fLbl}>No. Telepon</label>
                <input
                  value={form.phone || ""}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="08123456789"
                  style={fInput}
                />
              </div>
              <div>
                <label style={fLbl}>Role</label>
                <div style={{ display: "flex", gap: 8 }}>
                  {(["admin", "cashier"] as const).map((r) => (
                    <button
                      key={r}
                      onClick={() => setForm({ ...form, role: r })}
                      style={{
                        flex: 1,
                        padding: "9px 0",
                        borderRadius: 10,
                        fontWeight: 600,
                        fontSize: 13,
                        border: "2px solid",
                        borderColor: form.role === r ? "#7D301F" : "#E8DDD0",
                        background: form.role === r ? "#7D301F" : "#fff",
                        color: form.role === r ? "#fff" : "#6B7280",
                        cursor: "pointer",
                      }}
                    >
                      {r === "admin" ? "👑 Admin" : "🧾 Kasir"}
                    </button>
                  ))}
                </div>
              </div>
              {form.role === "cashier" && (
                <div>
                  <label style={fLbl}>PIN Kasir (4 digit)</label>
                  <input
                    type="password"
                    maxLength={4}
                    value={form.pin || ""}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        pin: e.target.value.replace(/\D/g, "").slice(0, 4),
                      })
                    }
                    placeholder="••••"
                    style={fInput}
                  />
                </div>
              )}
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 13,
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) =>
                    setForm({ ...form, isActive: e.target.checked })
                  }
                  style={{ width: 16, height: 16, accentColor: "#7D301F" }}
                />
                ✅ Status Aktif
              </label>

              {/* AVATAR SECTION */}
              <div>
                <label style={fLbl}>Avatar</label>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    marginBottom: 14,
                  }}
                >
                  <div
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: 16,
                      background: form.role === "admin" ? "#FEF3E2" : "#DBEAFE",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 36,
                      overflow: "hidden",
                      border: "2px solid #E8DDD0",
                    }}
                  >
                    {form.avatar?.startsWith("data:") ? (
                      <img
                        src={form.avatar}
                        alt="preview"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <Emoji text={form.avatar || "👤"} />
                    )}
                  </div>
                  <div
                    style={{ display: "flex", flexDirection: "column", gap: 8 }}
                  >
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "6px 14px",
                        borderRadius: 8,
                        background: "#F5EFE6",
                        border: "1px solid #E8DDD0",
                        color: "#7D301F",
                        fontWeight: 600,
                        fontSize: 13,
                        cursor: "pointer",
                      }}
                    >
                      <Camera size={14} /> Upload Foto
                    </button>
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      style={{ display: "none" }}
                      onChange={handleAvatarUpload}
                    />
                    <span style={{ fontSize: 11, color: "#9CA3AF" }}>
                      atau pilih emoji di bawah
                    </span>
                  </div>
                </div>

                {/* Emoji Grid */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(10, 1fr)",
                    gap: 6,
                    padding: 8,
                    borderRadius: 10,
                    background: "#F9F9F9",
                    border: "1px solid #F3F4F6",
                    maxHeight: 140,
                    overflowY: "auto",
                  }}
                >
                  {EMOJI_LIST.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setForm({ ...form, avatar: emoji })}
                      style={{
                        fontSize: 20,
                        padding: 4,
                        borderRadius: 6,
                        background:
                          form.avatar === emoji ? "#7D301F" : "transparent",
                        border:
                          form.avatar === emoji
                            ? "2px solid #7D301F"
                            : "1px solid transparent",
                        cursor: "pointer",
                        lineHeight: 1,
                      }}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditId(null);
                }}
                style={{
                  flex: 1,
                  padding: "12px 0",
                  borderRadius: 12,
                  fontWeight: 600,
                  background: "#F3F4F6",
                  border: "1px solid #E8DDD0",
                  cursor: "pointer",
                }}
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                style={{
                  flex: 2,
                  padding: "12px 0",
                  borderRadius: 12,
                  fontWeight: 700,
                  background: "#7D301F",
                  border: "none",
                  color: "#fff",
                  cursor: "pointer",
                }}
              >
                {editId ? "💾 Simpan" : "➕ Tambah"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}

const fLbl: React.CSSProperties = {
  display: "block",
  fontSize: 12,
  fontWeight: 600,
  color: "#6B7280",
  marginBottom: 6,
  textTransform: "uppercase",
  letterSpacing: 0.5,
};
const fInput: React.CSSProperties = {
  width: "100%",
  padding: "10px 14px",
  borderRadius: 10,
  border: "1px solid #E8DDD0",
  fontSize: 14,
  outline: "none",
  boxSizing: "border-box",
};
