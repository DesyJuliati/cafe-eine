// ============================================
// FILE: src/pages/report/ReportPage.tsx
// ============================================
import { useState } from "react";
import { TrendingUp, Download } from "lucide-react";
import AppLayout from "@/component/common/AppLayout";

const reportData = {
  Hari: {
    total: "Rp 1.240.000",
    transactions: 34,
    topMenu: "Caramel Latte",
    peakHour: "10:00 - 11:00",
  },
  Minggu: {
    total: "Rp 8.750.000",
    transactions: 218,
    topMenu: "Caramel Latte",
    peakHour: "09:00 - 11:00",
  },
  Bulan: {
    total: "Rp 34.200.000",
    transactions: 870,
    topMenu: "Espresso",
    peakHour: "08:00 - 10:00",
  },
};

const menuStats = [
  { name: "Caramel Latte", sold: 24, revenue: "Rp 768.000", pct: 90 },
  { name: "Espresso", sold: 18, revenue: "Rp 324.000", pct: 67 },
  { name: "Cappuccino", sold: 15, revenue: "Rp 375.000", pct: 56 },
  { name: "Matcha Latte", sold: 12, revenue: "Rp 336.000", pct: 44 },
  { name: "Cold Brew", sold: 10, revenue: "Rp 300.000", pct: 37 },
];

const hourlyData = [
  { hour: "07-08", pct: 20 },
  { hour: "08-09", pct: 45 },
  { hour: "09-10", pct: 75 },
  { hour: "10-11", pct: 100 },
  { hour: "11-12", pct: 85 },
  { hour: "12-13", pct: 70 },
  { hour: "13-14", pct: 55 },
  { hour: "14-15", pct: 40 },
  { hour: "15-16", pct: 60 },
  { hour: "16-17", pct: 50 },
  { hour: "17-18", pct: 35 },
];

export default function ReportPage() {
  const [period, setPeriod] = useState<"Hari" | "Minggu" | "Bulan">("Hari");
  const data = reportData[period];

  return (
    <AppLayout title="📊 Laporan">
      {/* Period selector */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {(["Hari", "Minggu", "Bulan"] as const).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            style={{
              padding: "9px 24px",
              borderRadius: 10,
              fontWeight: 600,
              fontSize: 14,
              border: "2px solid",
              borderColor: period === p ? "#7D301F" : "#E8DDD0",
              backgroundColor: period === p ? "#7D301F" : "#FFFFFF",
              color: period === p ? "#FFF" : "#6B7280",
              cursor: "pointer",
            }}
          >
            {p} Ini
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <button
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "9px 20px",
            borderRadius: 10,
            fontWeight: 600,
            fontSize: 14,
            backgroundColor: "#22C55E",
            color: "#FFF",
            border: "none",
            cursor: "pointer",
          }}
        >
          <Download size={16} /> Export PDF
        </button>
        <button
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "9px 20px",
            borderRadius: 10,
            fontWeight: 600,
            fontSize: 14,
            backgroundColor: "#3B82F6",
            color: "#FFF",
            border: "none",
            cursor: "pointer",
          }}
        >
          <Download size={16} /> Export Excel
        </button>
      </div>

      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 16,
          marginBottom: 24,
        }}
      >
        {[
          { label: "Total Penjualan", value: data.total, icon: "💰" },
          {
            label: "Total Transaksi",
            value: `${data.transactions} pesanan`,
            icon: "🧾",
          },
          { label: "Menu Terlaris", value: data.topMenu, icon: "🏆" },
          { label: "Jam Sibuk", value: data.peakHour, icon: "⏰" },
        ].map((s) => (
          <div
            key={s.label}
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: 16,
              padding: 20,
              border: "1px solid #E8DDD0",
            }}
          >
            <div style={{ fontSize: 28, marginBottom: 8 }}>{s.icon}</div>
            <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 4 }}>
              {s.label}
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#1E1E1E" }}>
              {s.value}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* Menu stats */}
        <div
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: 16,
            padding: 24,
            border: "1px solid #E8DDD0",
          }}
        >
          <h3
            style={{
              margin: "0 0 16px",
              fontSize: 16,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <TrendingUp size={18} color="#7D301F" /> Menu Terlaris
          </h3>
          {menuStats.map((item, idx) => (
            <div key={item.name} style={{ marginBottom: 14 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 6,
                }}
              >
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: idx === 0 ? 700 : 400,
                    color: "#1E1E1E",
                  }}
                >
                  {idx === 0
                    ? "🥇"
                    : idx === 1
                      ? "🥈"
                      : idx === 2
                        ? "🥉"
                        : `${idx + 1}.`}{" "}
                  {item.name}
                </span>
                <span
                  style={{ fontSize: 13, color: "#7D301F", fontWeight: 600 }}
                >
                  {item.sold} terjual
                </span>
              </div>
              <div
                style={{
                  height: 8,
                  backgroundColor: "#F3F4F6",
                  borderRadius: 4,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${item.pct}%`,
                    backgroundColor: "#7D301F",
                    borderRadius: 4,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Peak hours */}
        <div
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: 16,
            padding: 24,
            border: "1px solid #E8DDD0",
          }}
        >
          <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 700 }}>
            ⏰ Jam Sibuk (Peak Hour)
          </h3>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              gap: 6,
              height: 140,
            }}
          >
            {hourlyData.map((h) => (
              <div
                key={h.hour}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <div
                  style={{
                    width: "100%",
                    borderRadius: "4px 4px 0 0",
                    height: `${h.pct * 1.2}px`,
                    backgroundColor:
                      h.pct === 100
                        ? "#7D301F"
                        : h.pct >= 70
                          ? "#DC9E6B"
                          : "#E8DDD0",
                  }}
                />
                <span
                  style={{
                    fontSize: 9,
                    color: "#9CA3AF",
                    writingMode: "vertical-rl",
                    transform: "rotate(180deg)",
                    height: 28,
                  }}
                >
                  {h.hour}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
