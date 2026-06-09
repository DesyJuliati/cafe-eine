// ============================================
// FILE: src/pages/stock/StockPage.tsx
// ============================================
import { useState } from "react";
import { Plus, AlertTriangle } from "lucide-react";
import AppLayout from "@/component/common/AppLayout";

interface StockItem {
  id: number;
  name: string;
  unit: string;
  current: number;
  minAlert: number;
  category: string;
  emoji: string;
}

const initialStock: StockItem[] = [
  {
    id: 1,
    name: "Biji Kopi Arabica",
    unit: "kg",
    current: 12,
    minAlert: 5,
    category: "Kopi",
    emoji: "☕",
  },
  {
    id: 2,
    name: "Biji Kopi Robusta",
    unit: "kg",
    current: 8,
    minAlert: 5,
    category: "Kopi",
    emoji: "☕",
  },
  {
    id: 3,
    name: "Susu Full Cream",
    unit: "liter",
    current: 15,
    minAlert: 10,
    category: "Susu",
    emoji: "🥛",
  },
  {
    id: 4,
    name: "Oat Milk",
    unit: "liter",
    current: 6,
    minAlert: 8,
    category: "Susu",
    emoji: "🥛",
  },
  {
    id: 5,
    name: "Gula Pasir",
    unit: "kg",
    current: 4,
    minAlert: 5,
    category: "Bahan",
    emoji: "🍬",
  },
  {
    id: 6,
    name: "Matcha Powder",
    unit: "gr",
    current: 350,
    minAlert: 200,
    category: "Bahan",
    emoji: "🍵",
  },
  {
    id: 7,
    name: "Sirup Karamel",
    unit: "botol",
    current: 3,
    minAlert: 5,
    category: "Sirup",
    emoji: "🍯",
  },
  {
    id: 8,
    name: "Gelas Kertas M",
    unit: "pcs",
    current: 200,
    minAlert: 100,
    category: "Packaging",
    emoji: "🥤",
  },
];

export default function StockPage() {
  const [stock, setStock] = useState<StockItem[]>(initialStock);
  const [addAmounts, setAddAmounts] = useState<Record<number, string>>({});
  const [minAlerts, setMinAlerts] = useState<Record<number, string>>({});

  const handleAddStock = (id: number) => {
    const amount = Number(addAmounts[id] || 0);
    if (amount <= 0) return;
    setStock((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, current: s.current + amount } : s,
      ),
    );
    setAddAmounts((prev) => ({ ...prev, [id]: "" }));
  };

  const handleSetAlert = (id: number) => {
    const val = Number(minAlerts[id]);
    if (!val || val <= 0) return;
    setStock((prev) =>
      prev.map((s) => (s.id === id ? { ...s, minAlert: val } : s)),
    );
    setMinAlerts((prev) => ({ ...prev, [id]: "" }));
  };

  const lowStock = stock.filter((s) => s.current <= s.minAlert);

  return (
    <AppLayout title="📦 Manajemen Stok">
      {/* Alert banner */}
      {lowStock.length > 0 && (
        <div
          style={{
            backgroundColor: "#FEF3E2",
            border: "1px solid #FDE68A",
            borderRadius: 12,
            padding: "14px 20px",
            marginBottom: 20,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <AlertTriangle size={20} color="#D97706" />
          <div>
            <span style={{ fontWeight: 700, color: "#D97706" }}>
              ⚠️ {lowStock.length} item stok menipis!{" "}
            </span>
            <span style={{ color: "#92400E", fontSize: 14 }}>
              {lowStock.map((s) => s.name).join(", ")}
            </span>
          </div>
        </div>
      )}

      {/* Summary */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 14,
          marginBottom: 24,
        }}
      >
        <div
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: 14,
            padding: 20,
            border: "1px solid #E8DDD0",
          }}
        >
          <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 4 }}>
            Total Item
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, color: "#1E1E1E" }}>
            {stock.length}
          </div>
        </div>
        <div
          style={{
            backgroundColor: "#DCFCE7",
            borderRadius: 14,
            padding: 20,
            border: "1px solid #86EFAC",
          }}
        >
          <div style={{ fontSize: 12, color: "#16A34A", marginBottom: 4 }}>
            Stok Aman
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, color: "#16A34A" }}>
            {stock.filter((s) => s.current > s.minAlert).length}
          </div>
        </div>
        <div
          style={{
            backgroundColor: "#FEF3E2",
            borderRadius: 14,
            padding: 20,
            border: "1px solid #FDE68A",
          }}
        >
          <div style={{ fontSize: 12, color: "#D97706", marginBottom: 4 }}>
            Stok Menipis
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, color: "#D97706" }}>
            {lowStock.length}
          </div>
        </div>
      </div>

      {/* Stock table */}
      <div
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: 16,
          border: "1px solid #E8DDD0",
          overflow: "hidden",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#F9F9F9" }}>
              {[
                "Bahan",
                "Kategori",
                "Stok Saat Ini",
                "Min. Alert",
                "Tambah Stok",
              ].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: "14px 20px",
                    textAlign: "left",
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#6B7280",
                    borderBottom: "1px solid #E8DDD0",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {stock.map((item) => {
              const isLow = item.current <= item.minAlert;
              return (
                <tr
                  key={item.id}
                  style={{
                    borderBottom: "1px solid #F3F4F6",
                    backgroundColor: isLow ? "#FFFBF0" : "#FFFFFF",
                  }}
                >
                  <td style={{ padding: "14px 20px" }}>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 10 }}
                    >
                      <span style={{ fontSize: 22 }}>{item.emoji}</span>
                      <div>
                        <div
                          style={{
                            fontWeight: 600,
                            fontSize: 14,
                            color: "#1E1E1E",
                          }}
                        >
                          {item.name}
                        </div>
                        {isLow && (
                          <div
                            style={{
                              fontSize: 11,
                              color: "#D97706",
                              fontWeight: 600,
                            }}
                          >
                            ⚠️ Stok menipis!
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "14px 20px" }}>
                    <span
                      style={{
                        padding: "4px 12px",
                        borderRadius: 20,
                        backgroundColor: "#F5EFE6",
                        color: "#7D301F",
                        fontSize: 12,
                        fontWeight: 600,
                      }}
                    >
                      {item.category}
                    </span>
                  </td>
                  <td style={{ padding: "14px 20px" }}>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      <span
                        style={{
                          fontSize: 18,
                          fontWeight: 800,
                          color: isLow ? "#D97706" : "#1E1E1E",
                        }}
                      >
                        {item.current}
                      </span>
                      <span style={{ fontSize: 13, color: "#9CA3AF" }}>
                        {item.unit}
                      </span>
                      <div
                        style={{
                          flex: 1,
                          height: 6,
                          backgroundColor: "#F3F4F6",
                          borderRadius: 3,
                          overflow: "hidden",
                          minWidth: 60,
                        }}
                      >
                        <div
                          style={{
                            height: "100%",
                            width: `${Math.min(100, (item.current / (item.minAlert * 3)) * 100)}%`,
                            backgroundColor: isLow ? "#F59E0B" : "#22C55E",
                            borderRadius: 3,
                          }}
                        />
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "14px 20px" }}>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 6 }}
                    >
                      <input
                        type="number"
                        placeholder={String(item.minAlert)}
                        value={minAlerts[item.id] || ""}
                        onChange={(e) =>
                          setMinAlerts((prev) => ({
                            ...prev,
                            [item.id]: e.target.value,
                          }))
                        }
                        style={{
                          width: 60,
                          padding: "6px 10px",
                          borderRadius: 8,
                          border: "1px solid #E8DDD0",
                          fontSize: 13,
                          outline: "none",
                        }}
                      />
                      <button
                        onClick={() => handleSetAlert(item.id)}
                        style={{
                          padding: "6px 10px",
                          borderRadius: 8,
                          border: "1px solid #E8DDD0",
                          backgroundColor: "#F9F9F9",
                          cursor: "pointer",
                          fontSize: 12,
                        }}
                      >
                        Set
                      </button>
                    </div>
                  </td>
                  <td style={{ padding: "14px 20px" }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <input
                        type="number"
                        placeholder="Jumlah"
                        value={addAmounts[item.id] || ""}
                        onChange={(e) =>
                          setAddAmounts((prev) => ({
                            ...prev,
                            [item.id]: e.target.value,
                          }))
                        }
                        style={{
                          width: 80,
                          padding: "8px 12px",
                          borderRadius: 8,
                          border: "1px solid #E8DDD0",
                          fontSize: 13,
                          outline: "none",
                        }}
                      />
                      <button
                        onClick={() => handleAddStock(item.id)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                          padding: "8px 14px",
                          borderRadius: 8,
                          border: "none",
                          backgroundColor: "#7D301F",
                          color: "#FFF",
                          cursor: "pointer",
                          fontWeight: 600,
                          fontSize: 13,
                        }}
                      >
                        <Plus size={14} /> Tambah
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </AppLayout>
  );
}
