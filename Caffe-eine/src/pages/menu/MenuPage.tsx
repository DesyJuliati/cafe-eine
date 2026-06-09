import { useState, useRef } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  ToggleLeft,
  ToggleRight,
  RefreshCw,
  Camera,
} from "lucide-react";
import { Emoji } from "react-emoji-render";
import AppLayout from "@/component/common/AppLayout";
import {
  useMenuStore,
  type MenuItem,
  type MenuCategory,
} from "@/store/menuStore";
import toast from "react-hot-toast";

const CATEGORIES: MenuCategory[] = ["Coffee", "Non-Coffee", "Food"];

// Daftar emoji tetap sebagai string, akan dirender melalui <Emoji>
const EMOJI_LIST = [
  "☕",
  "🍵",
  "🍫",
  "🧊",
  "🍨",
  "🫖",
  "🥐",
  "🍰",
  "🍮",
  "🥪",
  "🧃",
  "🥤",
  "🍩",
  "🍪",
  "🥛",
];

const EMPTY_FORM: Omit<MenuItem, "id"> = {
  name: "",
  price: 0,
  image: "☕",
  category: "Coffee",
  hasSugar: true,
  hasMilk: false,
  hasTemp: true,
  isAvailable: true,
  description: "",
};

export default function MenuManagement() {
  const {
    menu,
    addMenu,
    updateMenu,
    deleteMenu,
    toggleAvailability,
    resetToDefault,
  } = useMenuStore();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<Omit<MenuItem, "id">>(EMPTY_FORM);
  const [filterCat, setFilterCat] = useState<MenuCategory | "Semua">("Semua");
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filtered =
    filterCat === "Semua" ? menu : menu.filter((m) => m.category === filterCat);

  const handleOpenAdd = () => {
    setEditId(null);
    setForm({ ...EMPTY_FORM });
    setShowForm(true);
  };

  const handleOpenEdit = (item: MenuItem) => {
    setEditId(item.id);
    setForm({
      name: item.name,
      price: item.price,
      image: item.image,
      category: item.category,
      hasSugar: item.hasSugar,
      hasMilk: item.hasMilk,
      hasTemp: item.hasTemp,
      isAvailable: item.isAvailable,
      description: item.description,
    });
    setShowForm(true);
  };

  const handleSave = () => {
    if (!form.name.trim()) {
      toast.error("Nama menu wajib diisi!");
      return;
    }
    if (form.price <= 0) {
      toast.error("Harga harus lebih dari 0!");
      return;
    }

    if (editId !== null) {
      updateMenu(editId, form);
      toast.success(`${form.name} berhasil diupdate!`);
    } else {
      addMenu(form);
      toast.success(`${form.name} berhasil ditambahkan ke menu POS!`);
    }
    setShowForm(false);
    setEditId(null);
  };

  const handleDelete = (id: number) => {
    const item = menu.find((m) => m.id === id);
    deleteMenu(id);
    setDeleteConfirm(null);
    toast.success(`${item?.name} dihapus dari menu`);
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm({ ...form, image: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  return (
    <AppLayout title="Management Menu">
      {/* Header actions */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <div style={{ display: "flex", gap: 8 }}>
          {(["Semua", ...CATEGORIES] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCat(cat)}
              style={{
                padding: "7px 18px",
                borderRadius: 20,
                fontWeight: 600,
                fontSize: 13,
                border: "1px solid",
                borderColor: filterCat === cat ? "#7D301F" : "#E8DDD0",
                backgroundColor: filterCat === cat ? "#7D301F" : "#fff",
                color: filterCat === cat ? "#fff" : "#6B7280",
                cursor: "pointer",
              }}
            >
              {cat}{" "}
              {cat !== "Semua" &&
                `(${menu.filter((m) => m.category === cat).length})`}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={() => {
              resetToDefault();
              toast.success("Menu direset ke default");
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "10px 16px",
              borderRadius: 10,
              background: "#F5EFE6",
              border: "1px solid #E8DDD0",
              color: "#7D301F",
              fontWeight: 600,
              cursor: "pointer",
              fontSize: 13,
            }}
          >
            <RefreshCw size={14} /> Reset Default
          </button>
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
            <Plus size={16} /> Tambah Menu
          </button>
        </div>
      </div>

      {/* Info banner */}
      <div
        style={{
          background: "#EFF6FF",
          borderRadius: 10,
          padding: "12px 16px",
          marginBottom: 20,
          fontSize: 13,
          color: "#3B82F6",
          border: "1px solid #BFDBFE",
        }}
      >
        💡 Menu yang diubah di sini akan{" "}
        <strong>langsung terlihat di halaman POS/Kasir</strong>. Menu yang
        dinonaktifkan tidak akan muncul di POS.
      </div>

      {/* Stats */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        {[
          {
            label: "Total Menu",
            val: menu.length,
            bg: "#F5EFE6",
            color: "#7D301F",
          },
          {
            label: "Aktif",
            val: menu.filter((m) => m.isAvailable).length,
            bg: "#DCFCE7",
            color: "#16A34A",
          },
          {
            label: "Nonaktif",
            val: menu.filter((m) => !m.isAvailable).length,
            bg: "#FEE2E2",
            color: "#DC2626",
          },
          {
            label: "Coffee",
            val: menu.filter((m) => m.category === "Coffee").length,
            bg: "#FEF3E2",
            color: "#D97706",
          },
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

      {/* Menu Table */}
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          border: "1px solid #E8DDD0",
          overflow: "hidden",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr
              style={{
                background: "#F9F9F9",
                borderBottom: "1px solid #E8DDD0",
              }}
            >
              {[
                "Menu",
                "Kategori",
                "Harga",
                "Gula",
                "Susu",
                "Suhu",
                "Status",
                "Aksi",
              ].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: "12px 16px",
                    textAlign: "left",
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#6B7280",
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <tr
                key={item.id}
                style={{
                  borderBottom: "1px solid #F3F4F6",
                  opacity: item.isAvailable ? 1 : 0.5,
                }}
              >
                <td style={{ padding: "14px 16px" }}>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 10 }}
                  >
                    {/* ✅ Preview gambar/emoji lewat <Emoji> */}
                    <span style={{ fontSize: 28 }}>
                      {item.image.startsWith("data:") ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          style={{
                            width: 28,
                            height: 28,
                            objectFit: "cover",
                            borderRadius: 6,
                          }}
                        />
                      ) : (
                        <Emoji text={item.image} />
                      )}
                    </span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>
                        {item.name}
                      </div>
                      {item.description && (
                        <div
                          style={{
                            fontSize: 11,
                            color: "#9CA3AF",
                            marginTop: 1,
                          }}
                        >
                          {item.description}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td style={{ padding: "14px 16px" }}>
                  <span
                    style={{
                      padding: "3px 10px",
                      borderRadius: 20,
                      fontSize: 11,
                      fontWeight: 600,
                      background:
                        item.category === "Coffee"
                          ? "#FEF3E2"
                          : item.category === "Food"
                            ? "#F0FFF4"
                            : "#EFF6FF",
                      color:
                        item.category === "Coffee"
                          ? "#D97706"
                          : item.category === "Food"
                            ? "#16A34A"
                            : "#3B82F6",
                    }}
                  >
                    {item.category}
                  </span>
                </td>
                <td
                  style={{
                    padding: "14px 16px",
                    fontWeight: 700,
                    color: "#7D301F",
                  }}
                >
                  Rp {item.price.toLocaleString("id-ID")}
                </td>
                <td style={{ padding: "14px 16px" }}>
                  {item.hasSugar ? "✅" : "❌"}
                </td>
                <td style={{ padding: "14px 16px" }}>
                  {item.hasMilk ? "✅" : "❌"}
                </td>
                <td style={{ padding: "14px 16px" }}>
                  {item.hasTemp ? "✅" : "❌"}
                </td>
                <td style={{ padding: "14px 16px" }}>
                  <button
                    onClick={() => toggleAvailability(item.id)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "5px 12px",
                      borderRadius: 8,
                      border: "1px solid",
                      borderColor: item.isAvailable ? "#86EFAC" : "#FCA5A5",
                      background: item.isAvailable ? "#DCFCE7" : "#FEE2E2",
                      color: item.isAvailable ? "#16A34A" : "#DC2626",
                      cursor: "pointer",
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  >
                    {item.isAvailable ? (
                      <ToggleRight size={14} />
                    ) : (
                      <ToggleLeft size={14} />
                    )}
                    {item.isAvailable ? "Aktif" : "Nonaktif"}
                  </button>
                </td>
                <td style={{ padding: "14px 16px" }}>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      onClick={() => handleOpenEdit(item)}
                      style={{
                        padding: "6px 12px",
                        borderRadius: 8,
                        background: "#F5EFE6",
                        border: "1px solid #E8DDD0",
                        color: "#7D301F",
                        cursor: "pointer",
                        fontSize: 12,
                        fontWeight: 600,
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      <Edit2 size={12} /> Edit
                    </button>
                    {deleteConfirm === item.id ? (
                      <div style={{ display: "flex", gap: 4 }}>
                        <button
                          onClick={() => handleDelete(item.id)}
                          style={{
                            padding: "6px 10px",
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
                            padding: "6px 10px",
                            borderRadius: 8,
                            background: "#F3F4F6",
                            border: "1px solid #E8DDD0",
                            cursor: "pointer",
                            fontSize: 12,
                          }}
                        >
                          Batal
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirm(item.id)}
                        style={{
                          padding: "6px 12px",
                          borderRadius: 8,
                          background: "#FEE2E2",
                          border: "1px solid #FCA5A5",
                          color: "#EF4444",
                          cursor: "pointer",
                          fontSize: 12,
                          fontWeight: 600,
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        <Trash2 size={12} /> Hapus
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* FORM MODAL – dengan upload foto */}
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
            <h2
              style={{
                margin: "0 0 24px",
                fontSize: 18,
                fontWeight: 800,
                color: "#1E1E1E",
              }}
            >
              {editId !== null ? "✏️ Edit Menu" : "➕ Tambah Menu Baru"}
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 14,
              }}
            >
              <div style={{ gridColumn: "1/-1" }}>
                <label style={fLbl}>Nama Menu *</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="cth: Vanilla Latte"
                  style={fInput}
                />
              </div>
              <div>
                <label style={fLbl}>Harga (Rp) *</label>
                <input
                  type="number"
                  value={form.price || ""}
                  onChange={(e) =>
                    setForm({ ...form, price: Number(e.target.value) })
                  }
                  placeholder="25000"
                  style={fInput}
                />
              </div>
              <div>
                <label style={fLbl}>Icon / Foto</label>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <div style={{ flex: 1 }}>
                    <input
                      value={
                        form.image && !form.image.startsWith("data:")
                          ? form.image
                          : ""
                      }
                      onChange={(e) =>
                        setForm({ ...form, image: e.target.value })
                      }
                      placeholder="☕"
                      style={fInput}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "8px 12px",
                      borderRadius: 10,
                      background: "#F5EFE6",
                      border: "1px solid #E8DDD0",
                      color: "#7D301F",
                      fontWeight: 600,
                      fontSize: 13,
                      cursor: "pointer",
                    }}
                  >
                    <Camera size={14} /> Foto
                  </button>
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={handleAvatarUpload}
                  />
                </div>
                {/* Preview */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginTop: 10,
                  }}
                >
                  <span style={{ fontSize: 32 }}>
                    {form.image.startsWith("data:") ? (
                      <img
                        src={form.image}
                        alt="preview"
                        style={{
                          width: 40,
                          height: 40,
                          objectFit: "cover",
                          borderRadius: 8,
                        }}
                      />
                    ) : (
                      <Emoji text={form.image} />
                    )}
                  </span>
                  <span style={{ fontSize: 12, color: "#9CA3AF" }}>
                    Preview
                  </span>
                </div>
                {/* Emoji Grid — sekarang semua via <Emoji> */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(8, 1fr)",
                    gap: 6,
                    padding: 8,
                    borderRadius: 10,
                    background: "#F9F9F9",
                    border: "1px solid #F3F4F6",
                    maxHeight: 100,
                    overflowY: "auto",
                    marginTop: 10,
                  }}
                >
                  {EMOJI_LIST.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setForm({ ...form, image: emoji })}
                      style={{
                        fontSize: 20,
                        padding: 4,
                        borderRadius: 6,
                        background:
                          form.image === emoji ? "#7D301F" : "transparent",
                        border:
                          form.image === emoji
                            ? "2px solid #7D301F"
                            : "1px solid transparent",
                        cursor: "pointer",
                        lineHeight: 1,
                      }}
                    >
                      <Emoji text={emoji} />{" "}
                      {/* ✅ emoji dirender lewat library */}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ gridColumn: "1/-1" }}>
                <label style={fLbl}>Kategori</label>
                <div style={{ display: "flex", gap: 8 }}>
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setForm({ ...form, category: cat })}
                      style={{
                        flex: 1,
                        padding: "9px 0",
                        borderRadius: 10,
                        fontWeight: 600,
                        fontSize: 13,
                        border: "2px solid",
                        borderColor:
                          form.category === cat ? "#7D301F" : "#E8DDD0",
                        background: form.category === cat ? "#7D301F" : "#fff",
                        color: form.category === cat ? "#fff" : "#6B7280",
                        cursor: "pointer",
                      }}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ gridColumn: "1/-1" }}>
                <label style={fLbl}>Deskripsi</label>
                <textarea
                  value={form.description || ""}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  placeholder="Deskripsi singkat menu..."
                  rows={2}
                  style={{ ...fInput, resize: "vertical" }}
                />
              </div>
              <div style={{ gridColumn: "1/-1" }}>
                <label style={fLbl}>Opsi Kustomisasi</label>
                <div style={{ display: "flex", gap: 12 }}>
                  {[
                    { key: "hasSugar", label: "🍬 Bisa pilih gula" },
                    { key: "hasMilk", label: "🥛 Pilih jenis susu" },
                    { key: "hasTemp", label: "🌡️ Pilih suhu" },
                  ].map(({ key, label }) => (
                    <label
                      key={key}
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
                        checked={
                          (form as Record<string, unknown>)[key] as boolean
                        }
                        onChange={(e) =>
                          setForm({ ...form, [key]: e.target.checked })
                        }
                        style={{
                          width: 16,
                          height: 16,
                          accentColor: "#7D301F",
                        }}
                      />
                      {label}
                    </label>
                  ))}
                </div>
              </div>
              <div style={{ gridColumn: "1/-1" }}>
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
                    checked={form.isAvailable}
                    onChange={(e) =>
                      setForm({ ...form, isAvailable: e.target.checked })
                    }
                    style={{ width: 16, height: 16, accentColor: "#7D301F" }}
                  />
                  ✅ Tersedia di POS (aktif)
                </label>
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
                  fontSize: 14,
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
                  fontSize: 14,
                }}
              >
                {editId !== null ? "💾 Simpan Perubahan" : "➕ Tambah ke Menu"}
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
