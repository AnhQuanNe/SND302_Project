import { NavLink, useNavigate } from "react-router-dom";
import styles from "./AdminLayout.module.css";

export default function AdminSidebar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const menuGroups = [
    {
      title: "Tổng quan",
      items: [
        { label: "Dashboard", icon: "ti-dashboard", path: "/admin/dashboard" },
      ],
    },
    {
      title: "Quản lý",
      items: [
        { label: "Người dùng", icon: "ti-users", path: "/admin/users" },
        { label: "Hàng đợi", icon: "ti-list", path: "/admin/queue" },
        { label: "Dịch vụ", icon: "ti-layout-grid", path: "/admin/services" },
        { label: "Quầy phục vụ", icon: "ti-device-desktop", path: "/admin/counters" },
      ],
    },
    {
      title: "Hệ thống",
      items: [
        { label: "Cài đặt", icon: "ti-settings", path: "/admin/settings" },
      ],
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <aside className={styles.sidebar}>
      {/* Brand Section */}
      <div className={styles.brand}>
        <div className={styles.brandMark}>
          <i className="ti-layers" /> 
        </div>
        <div className={styles.brandText}>
          <h2 className={styles.logo}>
            Admin<span className={styles.dot}></span>
          </h2>
          <p className={styles.tagline}>Queue System</p>
        </div>
      </div>

      {/* Navigation Section */}
      <nav className={styles.nav}>
        {menuGroups.map((group) => (
          <div key={group.title} className={styles.navGroup}>
            <div className={styles.navTitle}>{group.title}</div>
            <div className={styles.navItemsWrapper}>
              {group.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `${styles.navItem} ${isActive ? styles.active : ""}`
                  }
                >
                  <i className={`ti ${item.icon}`} />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Profile Section */}
      <div className={styles.profile}>
        <div className={styles.profileCard}>
          <div className={styles.profileHeader}>
            <div className={styles.avatar}>
              {user.fullName?.charAt(0).toUpperCase() || "A"}
            </div>
            <div className={styles.userInfo}>
              <strong>{user.fullName || "Administrator"}</strong>
              <span>{user.role || "Quản trị viên"}</span>
            </div>
          </div>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            <i className="ti-power-off" />
            <span>Đăng xuất</span>
          </button>
        </div>
      </div>
    </aside>
  );
}