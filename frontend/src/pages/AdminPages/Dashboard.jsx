import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";   
function Dashboard() {
  const user = JSON.parse(
  localStorage.getItem("user") || "{}"
);
  const navigate = useNavigate();
  const location = useLocation();
  const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  navigate("/");
};

  const stats = [
    { label: "Người dùng", value: 120, change: "+12% tháng này", trend: "up", color: "blue", icon: "ti-users" },
    { label: "Hàng đợi",   value: 450, change: "+5% hôm nay",    trend: "up", color: "green",  icon: "ti-list" },
    { label: "Dịch vụ",    value: 15,  change: "2 mới",           trend: "up", color: "purple", icon: "ti-layout-grid" },
    { label: "Quầy",       value: 8,   change: "1 offline",       trend: "down", color: "red",  icon: "ti-device-desktop" },
  ];

  const activities = [
    { dot: "blue",   text: "Người dùng mới đăng ký",  time: "2 phút trước" },
    { dot: "green",  text: "Hàng đợi #450 hoàn thành", time: "5 phút trước" },
    { dot: "amber",  text: "Quầy Q3 tạm dừng",         time: "14 phút trước" },
    { dot: "purple", text: "Dịch vụ mới được thêm",    time: "1 giờ trước" },
  ];

  const services = [
    { name: "Đăng ký hộ khẩu",    pct: 85, barColor: "#378ADD", badge: "Online",  badgeClass: "badge-green" },
    { name: "Cấp giấy phép",       pct: 62, barColor: "#1D9E75", badge: "Online",  badgeClass: "badge-green" },
    { name: "Xác nhận lý lịch",    pct: 40, barColor: "#BA7517", badge: "Bận",     badgeClass: "badge-amber" },
    { name: "Chứng thực chữ ký",   pct: 0,  barColor: "#E24B4A", badge: "Offline", badgeClass: "badge-red"   },
  ];

  const colorMap = {
    blue:   { icon: "#185FA5", iconBg: "#E6F1FB", bar: "#378ADD" },
    green:  { icon: "#0F6E56", iconBg: "#E1F5EE", bar: "#1D9E75" },
    purple: { icon: "#534AB7", iconBg: "#EEEDFE", bar: "#7F77DD" },
    red:    { icon: "#A32D2D", iconBg: "#FCEBEB", bar: "#E24B4A" },
  };

  const dotMap = {
    blue: "#378ADD", green: "#1D9E75", purple: "#7F77DD", amber: "#BA7517",
  };

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: "ti-dashboard", path: "/admin/dashboard" },
    { id: "users",     label: "Người dùng", icon: "ti-users",     path: "/admin/users" },        // ← Route bạn yêu cầu
    { id: "queue",     label: "Hàng đợi", icon: "ti-list",        path: "/admin/queue" },
    { id: "services",  label: "Dịch vụ", icon: "ti-layout-grid",  path: "/admin/services" },
    { id: "counters",  label: "Quầy phục vụ", icon: "ti-device-desktop", path: "/admin/counters" },
    { id: "reports",   label: "Báo cáo", icon: "ti-bar-chart",    path: "/admin/reports" },
    { id: "settings",  label: "Cài đặt", icon: "ti-settings",     path: "/admin/settings" },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "sans-serif", background: "#f8f9fa" }}>
      {/* Sidebar */}
      <div style={{
        width: "260px",
        background: "#fff",
        borderRight: "1px solid #e5e5e5",
        padding: "1.5rem 0",
        display: "flex",
        flexDirection: "column",
      }}>
        <div style={{ padding: "0 1.5rem", marginBottom: "2rem" }}>
          <h2 style={{ margin: 0, fontSize: "1.4rem", fontWeight: 600, color: "#1e2937" }}>
            Admin<span style={{ color: "#378ADD" }}>.</span>
          </h2>
        </div>

        <div style={{ padding: "0 1rem" }}>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <div
                key={item.id}
                onClick={() => navigate(item.path)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "12px 16px",
                  margin: "4px 0",
                  borderRadius: "8px",
                  cursor: "pointer",
                  background: isActive ? "#f0f7ff" : "transparent",
                  color: isActive ? "#1e40af" : "#475569",
                  fontWeight: isActive ? "600" : "500",
                }}
              >
                <i className={`ti ${item.icon}`} style={{ fontSize: "1.1rem" }} />
                <span>{item.label}</span>
              </div>
            );
          })}
        </div>
<div
  style={{
    marginTop: "auto",
    padding: "1.5rem",
    borderTop: "1px solid #e5e5e5",
  }}
>
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 10,
      marginBottom: 15,
    }}
  >
    <div
      style={{
        width: 40,
        height: 40,
        borderRadius: "50%",
        background: "#378ADD",
        color: "#fff",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontWeight: "bold",
      }}
    >
      {user.fullName?.charAt(0).toUpperCase() || "A"}
    </div>

    <div>
      <div
        style={{
          fontSize: 14,
          fontWeight: 500,
        }}
      >
        {user.fullName}
      </div>

      <div
        style={{
          fontSize: 12,
          color: "#888",
          textTransform: "capitalize",
        }}
      >
        {user.role}
      </div>
    </div>
  </div>

  <button
    onClick={handleLogout}
    style={{
      width: "100%",
      padding: "10px",
      border: "none",
      borderRadius: "8px",
      background: "#ef4444",
      color: "#fff",
      cursor: "pointer",
      fontWeight: 500,
    }}
  >
    Logout
  </button>
</div> 
</div>
      {/* Main Content */}
      <div style={{ flex: 1, padding: "1.5rem", overflow: "auto" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.75rem" }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 500, margin: 0 }}>
  Xin chào, {user.fullName || "Admin"}
</h1>

<p style={{ fontSize: 13, color: "#888", margin: "3px 0 0" }}>
  Vai trò: {user.role || "admin"}
</p>
          </div>
          <span style={{ fontSize: 12, color: "#888", background: "#f5f5f5", border: "0.5px solid #ddd", padding: "6px 12px", borderRadius: 8 }}>
            📅 Tháng 6, 2026
          </span>
        </div>

        {/* Stat Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12, marginBottom: "1.5rem" }}>
          {stats.map((s) => {
            const c = colorMap[s.color];
            return (
              <div key={s.label} style={{ background: "#fff", border: "0.5px solid #e5e5e5", borderRadius: 12, padding: "1rem 1.25rem", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: c.bar, borderRadius: "12px 12px 0 0" }} />
                <div style={{ width: 36, height: 36, borderRadius: 8, background: c.iconBg, color: c.icon, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12, fontSize: 18 }}>
                  <i className={`ti ${s.icon}`} />
                </div>
                <div style={{ fontSize: 12, color: "#888", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 4 }}>{s.label}</div>
                <div style={{ fontSize: 28, fontWeight: 500, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 12, marginTop: 8, color: s.trend === "up" ? "#0F6E56" : "#A32D2D" }}>
                  {s.trend === "up" ? "↑" : "↓"} {s.change}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {/* Activity */}
          <div style={{ background: "#fff", border: "0.5px solid #e5e5e5", borderRadius: 12, padding: "1rem 1.25rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <span style={{ fontSize: 14, fontWeight: 500 }}>Hoạt động gần đây</span>
              <span style={{ fontSize: 12, color: "#888", cursor: "pointer" }}>Xem tất cả →</span>
            </div>
            {activities.map((a, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: i < activities.length - 1 ? "0.5px solid #eee" : "none" }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: dotMap[a.dot], flexShrink: 0 }} />
                <span style={{ fontSize: 13, flex: 1 }}>{a.text}</span>
                <span style={{ fontSize: 11, color: "#aaa" }}>{a.time}</span>
              </div>
            ))}
          </div>

          {/* Services */}
          <div style={{ background: "#fff", border: "0.5px solid #e5e5e5", borderRadius: 12, padding: "1rem 1.25rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <span style={{ fontSize: 14, fontWeight: 500 }}>Trạng thái dịch vụ</span>
              <span style={{ fontSize: 12, color: "#888", cursor: "pointer" }}>Quản lý →</span>
            </div>
            {services.map((s, i) => {
              const badgeStyle = {
                "badge-green": { background: "#E1F5EE", color: "#0F6E56" },
                "badge-amber": { background: "#FAEEDA", color: "#854F0B" },
                "badge-red":   { background: "#FCEBEB", color: "#A32D2D" },
              }[s.badgeClass];
              return (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: i < services.length - 1 ? "0.5px solid #eee" : "none" }}>
                  <span style={{ fontSize: 13, flex: 1 }}>{s.name}</span>
                  <div style={{ width: 90, height: 6, background: "#f0f0f0", borderRadius: 99, overflow: "hidden" }}>
                    <div style={{ width: `${s.pct}%`, height: "100%", background: s.barColor, borderRadius: 99 }} />
                  </div>
                  <span style={{ fontSize: 12, color: "#aaa", width: 32, textAlign: "right" }}>{s.pct}%</span>
                  <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 99, fontWeight: 500, ...badgeStyle }}>{s.badge}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;