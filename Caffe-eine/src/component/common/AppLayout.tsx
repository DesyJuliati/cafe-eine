// ============================================
// FILE: src/component/common/AppLayout.tsx
// ============================================
import Sidebar from "./Sidebar";

interface AppLayoutProps {
  children: React.ReactNode;
  title: string;
}

export default function AppLayout({ children, title }: AppLayoutProps) {
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "#F5EFE6",
      }}
    >
      <Sidebar />
      <main style={{ flex: 1, overflow: "auto", minWidth: 0 }}>
        {/* Top bar */}
        <div
          style={{
            padding: "20px 32px",
            borderBottom: "1px solid #E8DDD0",
            backgroundColor: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: 20,
              fontWeight: 800,
              color: "#1E1E1E",
            }}
          >
            {title}
          </h1>
          <div style={{ fontSize: 13, color: "#9CA3AF" }}>
            {new Date().toLocaleDateString("id-ID", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </div>
        {/* Content */}
        <div style={{ padding: "28px 32px" }}>{children}</div>
      </main>
    </div>
  );
}
