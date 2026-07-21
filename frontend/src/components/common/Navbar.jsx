// Navbar.jsx
import { useState } from "react";
import "./Navbar.css";

const Navbar = ({
  logoText = "SMART QUEUE",
  user,
  notifications = [], // ===== NEW =====
  onLogout,
  onNotificationClick,
  onProfileClick,
  navItems = [],
}) => {
  const [showMenu, setShowMenu] = useState(false);

  // ===== NEW =====
  const [showNotification, setShowNotification] = useState(false);

  const getHomeLink = () => {
    if (user?.role === "admin") return "/admin/dashboard";
    if (user?.role === "staff") return "/staff/dashboard";
    return "/customer";
  };

  const homeLink = getHomeLink();

  // ===== NEW =====
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <header className="dashboard-header">
      <a href={homeLink} className="logo-group">
        <div className="logo-badge">
          <i
            className="ti ti-activity-heartbeat"
            style={{ fontSize: "18px", color: "white" }}
          ></i>
        </div>

        <span className="logo-text">{logoText}</span>
      </a>

      <nav className="dashboard-nav">
        {navItems.map((item, index) => (
          <span
            key={index}
            className={`nav-link ${item.active ? "active" : ""}`}
            onClick={item.onClick}
          >
            {item.label}
          </span>
        ))}
      </nav>

      <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
        {/* ================== NOTIFICATION ================== */}
        <div
          style={{ position: "relative", cursor: "pointer" }}
          onClick={() => setShowNotification(!showNotification)}
        >
          <i
            className="ti ti-bell"
            style={{ fontSize: 24, color: "#1e293b" }}
          ></i>

          {unreadCount > 0 && (
            <span className="notification-badge">{unreadCount}</span>
          )}

          {showNotification && (
            <div className="notification-dropdown">
              <div className="notification-header">Thông báo</div>

              {notifications.length === 0 ? (
                <div className="notification-empty">Chưa có thông báo</div>
              ) : (
                notifications.map((item) => (
                  <div
                    key={item._id}
                    className={`notification-item ${
                      item.isRead ? "" : "unread"
                    }`}
                    onClick={() => {
                      setShowNotification(false);
                      if (onNotificationClick) {
                        onNotificationClick(item);
                      }
                    }}
                  >
                    <div className="notification-icon">
                      {item.type === "called" && (
                        <i className="ti ti-speakerphone"></i>
                      )}
                      {item.type === "completed" && (
                        <i className="ti ti-circle-check"></i>
                      )}
                      {item.type === "skipped" && (
                        <i className="ti ti-player-skip-forward"></i>
                      )}
                    </div>

                    <div className="notification-content">
                      <div className="notification-title">{item.title}</div>
                      <div className="notification-message">
                        {item.message}
                      </div>
                      <div className="notification-time">
                        {new Date(item.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* ================= USER ================= */}
        <div style={{ position: "relative" }}>
          <div
            className="user-menu-trigger"
            onClick={() => setShowMenu(!showMenu)}
          >
            <div className="user-avatar">
              {(user?.fullName || "U").charAt(0).toUpperCase()}
            </div>

            <span className="user-fullname">
              {user?.fullName || "User"}
            </span>

            <i
              className="ti ti-chevron-down"
              style={{ fontSize: "12px", opacity: 0.7 }}
            ></i>
          </div>

          {showMenu && (
            <div className="user-dropdown">
              <div className="dropdown-user-info">
                <p className="dropdown-user-name">{user?.fullName}</p>
                <p className="dropdown-user-email">
                  {user?.email || "user@queue.com"}
                </p>
              </div>

              <div className="dropdown-divider"></div>

              <button
                className="dropdown-item"
                onClick={() => {
                  setShowMenu(false);
                  if (onProfileClick) onProfileClick();
                }}
              >
                <i className="ti ti-user"></i>
                Trang cá nhân
              </button>

              <div className="dropdown-divider"></div>

              <button className="dropdown-logout-btn" onClick={onLogout}>
                <i className="ti ti-logout"></i>
                Đăng xuất
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;