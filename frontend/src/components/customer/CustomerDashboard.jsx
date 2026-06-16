import { useEffect, useState } from "react";
import { getServices, createQueue } from "../../services/queue.service";

const CustomerDashboard = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(false);

  // 👇 lấy user từ localStorage
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await getServices(); // ✅ dùng service
        setServices(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const handleCreateQueue = async (serviceId) => {
  try {
    const res = await createQueue(serviceId);

    console.log(res.data);

    // 👉 lưu lại queue để dùng sau
    localStorage.setItem("currentQueue", JSON.stringify(res.data));

    // 👉 hiển thị số thứ tự
    alert(`🎟 Your queue number is: ${res.data.number}`);
    
  } catch (err) {
    console.error(err);
    alert("❌ Failed to create queue");
  }
};

const handleLogout = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");

  window.location.href = "/"; // hoặc navigate("/")
};

  return (
    <div style={styles.page}>
      
      {/* HEADER NAV */}
      <header style={styles.header}>
        <h2 style={styles.logo}>SMART QUEUE</h2>

        <nav style={styles.nav}>
          <span style={styles.active}>Home</span>
          <span>Services</span>
          <span>Track Queue</span>
          <span>Feedback</span>
        </nav>

        {/* 👇 USER LOGIN */}
<div style={{ position: "relative" }}>
  <div 
    style={styles.userBox}
    onClick={() => setShowMenu(!showMenu)}
  >
    👤 {user?.fullName || "User"}
  </div>

  {showMenu && (
    <div style={styles.dropdown}>
      <p style={styles.dropdownName}>
        {user?.fullName}
      </p>

      <button style={styles.logoutBtn} onClick={handleLogout}>
        Logout
      </button>
    </div>
  )}
</div>
      </header>

      {/* MAIN */}
      <main style={styles.main}>
        <h1 style={styles.title}>Select a Service</h1>
        <p style={styles.subtitle}>
          Choose a service to get a queue number
        </p>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div style={styles.grid}>
            {services.map((s, index) => (
              <div
                key={s._id}
                style={styles.card}
                onClick={() => handleCreateQueue(s._id)}
              >
                
                {/* ICON (fake icon đơn giản) */}
                <div style={styles.icon}>
                  {getIcon(index)}
                </div>

                <h3>{s.name}</h3>

                <p style={styles.desc}>{s.description}</p>

                <p style={styles.time}>
                  Est. wait time <br />
                  <b>{s.estimatedTime} - {s.estimatedTime + 5} min</b>
                </p>

              </div>
            ))}
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer style={styles.footer}>
        © {new Date().getFullYear()} Smart Queue System
      </footer>
    </div>
  );
};

export default CustomerDashboard;

// 👇 đặt ở dưới cùng file
function getIcon(index) {
  const icons = ["🏦", "➕", "🎧", "📄", "🛡", "💻"];
  return icons[index % icons.length];
}


/* ================= STYLE ================= */

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f3f4f6",
    fontFamily: "Arial"
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 40px",
    background: "white",
    borderBottom: "1px solid #e5e7eb"
  },

  dropdown: {
  position: "absolute",
  top: "45px",
  right: 0,
  background: "white",
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  padding: "10px",
  width: "150px",
  zIndex: 1000
},

dropdownName: {
  margin: "0 0 10px 0",
  fontWeight: "bold",
  fontSize: "14px"
},

logoutBtn: {
  width: "100%",
  padding: "6px",
  border: "none",
  background: "#ef4444",
  color: "white",
  borderRadius: "6px",
  cursor: "pointer"
},

  logo: {
    color: "#2563eb",
    margin: 0
  },

  nav: {
    display: "flex",
    gap: "20px",
    fontSize: "14px",
    color: "#374151"
  },

  active: {
    color: "#2563eb",
    borderBottom: "2px solid #2563eb",
    paddingBottom: "4px"
  },

  userBox: {
    border: "1px solid #2563eb",
    padding: "6px 12px",
    borderRadius: "8px",
    color: "#2563eb",
    fontSize: "14px"
  },

  main: {
    textAlign: "center",
    padding: "40px 60px"
  },

  title: {
    marginBottom: "10px"
  },

  subtitle: {
    color: "#6b7280",
    marginBottom: "30px"
  },

grid: {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
  gap: "24px"
},

  card: {
    background: "white",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    textAlign: "center",
    transition: "0.2s",
    cursor: "pointer"
  },

  icon: {
    fontSize: "30px",
    marginBottom: "10px"
  },

  desc: {
    fontSize: "13px",
    color: "#6b7280",
    margin: "10px 0"
  },

  time: {
    fontSize: "13px",
    color: "#10b981"
  },

  footer: {
    marginTop: "40px",
    textAlign: "center",
    padding: "10px",
    fontSize: "13px",
    color: "#6b7280"
  }
};