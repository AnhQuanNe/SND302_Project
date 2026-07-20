import { useEffect, useState } from "react";
import {
  getServices,
  createQueue,
  getMyQueue,
  cancelQueue,
} from "../../services/queue.service";
import Navbar from "../common/Navbar";
import Footer from "../common/Footer";
import ActiveTicket from "./ActiveTicket";
import ServiceList from "./ServiceList";
import Loading from "../common/Loading";
import Profile from "./Profile";
import Feedback from "./Feedback";
import "./CustomerDashboard.css";

const CustomerDashboard = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentQueue, setCurrentQueue] = useState(null);
  const [activeView, setActiveView] = useState("dashboard");

  // lấy user từ localStorage dưới dạng state để tự động cập nhật
  const [currentUser, setCurrentUser] = useState(() =>
    JSON.parse(localStorage.getItem("user") || "{}"),
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        // lấy services
        const resService = await getServices();
        setServices(Array.isArray(resService.data) ? resService.data : []);

        // lấy queue user
        const resQueue = await getMyQueue();
        setCurrentQueue(resQueue.data || null);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

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
      alert(
        "⚠️ Bạn đang có một vé xếp hàng hoạt động. Vui lòng hoàn thành hoặc huỷ vé hiện tại trước khi đăng ký vé mới.",
      );
      return;
    }
    try {
      const res = await createQueue(serviceId);

      alert(`🎟️ Lấy vé thành công! Số thứ tự của bạn là: ${res.data.number}`);
      // lấy lại queue đầy đủ
      const queueRes = await getMyQueue();

      setCurrentQueue(queueRes.data);
    } catch (err) {
      console.error(err);
      alert("❌ Lấy vé thất bại. Vui lòng thử lại sau.");
    }
  };

  const handleCancelQueue = async () => {
    if (!currentQueue) return;

    if (window.confirm("Bạn có chắc muốn huỷ vé không?")) {
      try {
        await cancelQueue(currentQueue._id);
        setCurrentQueue(null);
      } catch (err) {
        console.error(err);
        alert("❌ Huỷ vé thất bại");
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.clear(); // 🔥 xoá sạch
    window.location.href = "/";
  };

  // Lấy thông tin dịch vụ của vé đang chọn
  const getActiveQueueService = () => {
    if (!currentQueue || !services.length) return null;

    // Ép kiểu về String để so sánh an toàn tuyệt đối
    return services.find(
      (s) => String(s._id) === String(currentQueue.serviceId),
    );
  };

  const activeService = getActiveQueueService();

  // Danh sách các mục menu trên Navbar
  const navItems = [
    {
      label: "Home",
      active: activeView === "dashboard",
      onClick: () => setActiveView("dashboard"),
    },
    {
      label: "Services",
      active: false,
      onClick: () => setActiveView("dashboard"),
    },
    {
      label: "Track Queue",
      active: false,
      onClick: () => setActiveView("track"),
    },
    {
      label: "Feedback",
      active: activeView === "feedback",
      onClick: () => setActiveView("feedback"),
    },
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
        ) : activeView === "feedback" ? (
          <Feedback />
        ) : activeView === "track" ? (
          /* --- MÀN HÌNH TRACK QUEUE RIÊNG BIỆT --- */
          <section className="track-queue-section">
            <h2 style={{ marginBottom: "20px", color: "#2563eb" }}>Theo dõi vé của bạn</h2>

            {currentQueue ? (
              <div className="active-queue-container">
                {/* Thêm phần hiển thị tên dịch vụ ở đây */}
                <h3 style={{ marginBottom: "15px" }}>
                  Dịch vụ đang chọn:{" "}
                  {activeService?.name ||
                    currentQueue?.serviceId?.name ||
                    "Đang tải..."}
                </h3>

                <ActiveTicket
                  queue={currentQueue}
                  service={activeService}
                  onCancel={handleCancelQueue}
                />
              </div>
            ) : (
              <div className="empty-queue-message">
                <p>Bạn chưa có vé nào đang hoạt động.</p>
                <button onClick={() => setActiveView("services")}>
                  Đi tới Lấy vé
                </button>
              </div>
            )}
          </section>
        ) : (
          /* --- MÀN HÌNH HOME TỔNG HỢP (activeView === "dashboard") --- */
          <>
            <section className="hero-banner">
              <h1 className="hero-title">
                Xin chào,{" "}
                <span className="hero-highlight">
                  {currentUser?.fullName || "bạn"}
                </span>
                !
              </h1>
              <p className="hero-subtitle">
                Hệ thống đặt lịch xếp hàng trực tuyến tiện lợi. Chọn một dịch vụ
                dưới đây để bắt đầu lấy vé thứ tự của bạn.
              </p>
            </section>

            {/* Chỉ hiện ActiveTicket ở Home nếu có vé */}
            {currentQueue && (
              <ActiveTicket
                queue={currentQueue}
                service={activeService}
                onCancel={handleCancelQueue}
              />
            )}

            <section className="services-section">
              <div className="services-list-header">
                <h2 className="services-list-title">
                  <i
                    className="ti ti-grid-dots"
                    style={{ color: "#2563eb" }}
                  ></i>
                  Chọn dịch vụ cần giao dịch
                </h2>
                <p className="services-list-subtitle">
                  Nhấn lấy số để đăng ký số thứ tự tự động
                </p>
              </div>

              {loading ? (
                <Loading
                  type="spinner"
                  message="Đang tải danh sách dịch vụ..."
                />
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
