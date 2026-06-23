import { useState } from "react";
import "./Navbar.css";

const Navbar = ({ logoText = "SMART QUEUE", user, onLogout, onProfileClick, navItems = [] }) => {
  const [showMenu, setShowMenu] = useState(false);

  const getHomeLink = () => {
    if (user?.role === "admin") return "/admin/dashboard";
    if (user?.role === "staff") return "/staff/dashboard";
    return "/customer";
  };

  const homeLink = getHomeLink();

  return (
    <header className="dashboard-header">
      <a href={homeLink} className="logo-group">
        <div className="logo-badge">
          <i className="ti ti-activity-heartbeat" style={{ fontSize: "18px", color: "white" }}></i>
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

      {/* USER PROFILE */}
      <div style={{ position: "relative" }}>
        <div className="user-menu-trigger" onClick={() => setShowMenu(!showMenu)}>
          <div className="user-avatar">
            {(user?.fullName || "U").charAt(0).toUpperCase()}
          </div>
          <span className="user-fullname">{user?.fullName || "User"}</span>
          <i className="ti ti-chevron-down" style={{ fontSize: "12px", opacity: 0.7 }}></i>
        </div>

        {showMenu && (
          <div className="user-dropdown">
            <div className="dropdown-user-info">
              <p className="dropdown-user-name">{user?.fullName}</p>
              <p className="dropdown-user-email">{user?.email || "user@queue.com"}</p>
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
    </header>
  );
};

export default Navbar;