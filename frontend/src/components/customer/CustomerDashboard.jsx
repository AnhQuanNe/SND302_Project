import { useEffect, useState } from "react";
import { getServices, createQueue } from "../../services/queue.service";
import Navbar from "../common/Navbar";
import Footer from "../common/Footer";
import ActiveTicket from "./ActiveTicket";
import ServiceList from "./ServiceList";
import Loading from "../common/Loading";
import Profile from "./Profile";
import "./CustomerDashboard.css";

const CustomerDashboard = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentQueue, setCurrentQueue] = useState(null);
  const [activeView, setActiveView] = useState("dashboard");

  // lấy user từ localStorage dưới dạng state để tự động cập nhật
  const [currentUser, setCurrentUser] = useState(() => 
    JSON.parse(localStorage.getItem("user") || "{}")
  );

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await getServices();
        setServices(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();

    // Check if there is an active queue ticket saved locally
    const savedQueue = localStorage.getItem("currentQueue");
    if (savedQueue) {
      try {
        setCurrentQueue(JSON.parse(savedQueue));
      } catch (e) {
        console.error(e);
      }
    }

    // Lắng nghe thay đổi của localStorage (bao gồm custom event từ trang profile)
    const handleStorageChange = () => {
      setCurrentUser(JSON.parse(localStorage.getItem("user") || "{}"));
    };
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleCreateQueue = async (serviceId) => {
    if (currentQueue) {
      alert("⚠️ Bạn đang có một vé xếp hàng hoạt động. Vui lòng hoàn thành hoặc huỷ vé hiện tại trước khi đăng ký vé mới.");
      return;
    }

    try {
      const res = await createQueue(serviceId);
      const queueData = res.data;

      // Lưu lại queue để dùng sau
      setCurrentQueue(queueData);
      localStorage.setItem("currentQueue", JSON.stringify(queueData));

      // Hiển thị số thứ tự
      alert(`🎟️ Lấy vé thành công! Số thứ tự của bạn là: ${queueData.number}`);
    } catch (err) {
      console.error(err);
      alert("❌ Lấy vé thất bại. Vui lòng thử lại sau.");
    }
  };

  const handleCancelQueue = () => {
    if (window.confirm("Bạn có chắc chắn muốn huỷ vé xếp hàng hiện tại không?")) {
      localStorage.removeItem("currentQueue");
      setCurrentQueue(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  // Lấy thông tin dịch vụ của vé đang chọn
  const getActiveQueueService = () => {
    if (!currentQueue) return null;
    return services.find((s) => s._id === currentQueue.serviceId);
  };

  const activeService = getActiveQueueService();

  // Danh sách các mục menu trên Navbar
  const navItems = [
    { label: "Home", active: activeView === "dashboard", onClick: () => setActiveView("dashboard") },
    { label: "Services", active: false, onClick: () => setActiveView("dashboard") },
    { label: "Track Queue", active: false, onClick: () => setActiveView("dashboard") },
    { label: "Feedback", active: false, onClick: () => {} }
  ];

  return (
    <div className="dashboard-container">
      {/* REUSABLE NAVBAR */}
      <Navbar 
        logoText="SMART QUEUE" 
        user={currentUser} 
        onLogout={handleLogout} 
        onProfileClick={() => setActiveView("profile")}
        navItems={navItems} 
      />

      {/* MAIN CONTENT */}
      <main className="dashboard-main">
        {activeView === "profile" ? (
          <Profile onBack={() => setActiveView("dashboard")} />
        ) : (
          <>
            {/* HERO */}
            <section className="hero-banner">
              <h1 className="hero-title">
                Xin chào, <span className="hero-highlight">{currentUser?.fullName || "bạn"}</span>! 
              </h1>
              <p className="hero-subtitle">
                Hệ thống đặt lịch xếp hàng trực tuyến tiện lợi. Chọn một dịch vụ dưới đây để bắt đầu lấy vé thứ tự của bạn.
              </p>
            </section>

            {/* ACTIVE TICKET (Spotlight Card) */}
            <ActiveTicket 
              queue={currentQueue} 
              service={activeService} 
              onCancel={handleCancelQueue} 
            />

            {/* SERVICES LIST */}
            <section className="services-section">
              <div className="services-list-header">
                <h2 className="services-list-title">
                  <i className="ti ti-grid-dots" style={{ color: "#2563eb" }}></i>
                  Chọn dịch vụ cần giao dịch
                </h2>
                <p className="services-list-subtitle">Nhấn lấy số để đăng ký số thứ tự tự động</p>
              </div>

              {loading ? (
                <Loading type="spinner" message="Đang tải danh sách dịch vụ..." />
              ) : (
                <ServiceList services={services} onBook={handleCreateQueue} />
              )}
            </section>
          </>
        )}
      </main>

      {/* REUSABLE FOOTER */}
      <Footer />
    </div>
  );
};

export default CustomerDashboard;