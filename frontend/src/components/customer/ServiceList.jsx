import "./ServiceList.css";

const ServiceList = ({ services = [], onBook }) => {
  if (!services || services.length === 0) {
    return <p className="text-center">Không tìm thấy dịch vụ nào</p>;
  }

  return (
    <div className="compact-services-list">
      {services.map((s, index) => {
        const serviceIcon = getServiceIcon(s.name, index);
        return (
          <div key={s._id} className="service-row-card">
            {/* Left Icon Badge */}
            <div className="service-row-icon-box" style={{ background: serviceIcon.bgColor }}>
              {serviceIcon.element}
            </div>

            {/* Middle Info */}
            <div className="service-row-info">
              <h3 className="service-row-name">{s.name}</h3>
              <p className="service-row-desc">{s.description}</p>
            </div>

            {/* Right Action & Estimated Time */}
            <div className="service-row-actions">
              <div className="service-row-time-badge">
                <i className="ti ti-clock"></i>
                {s.estimatedTime ? `${s.estimatedTime} - ${s.estimatedTime + 5} phút` : "10 phút"}
              </div>
              <button
                className="service-row-book-btn"
                onClick={() => onBook(s._id)}
              >
                Lấy Vé
                <i className="ti ti-arrow-right" style={{ fontSize: "14px" }}></i>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Helper for Service Icon matching
function getServiceIcon(name, index) {
  const lower = name.toLowerCase();
  const icons = [
    {
      element: <i className="ti ti-building-bank" style={{ fontSize: "22px", color: "#2563eb" }}></i>,
      bgColor: "#eff6ff"
    },
    {
      element: <i className="ti ti-headset" style={{ fontSize: "22px", color: "#0d9488" }}></i>,
      bgColor: "#f0fdfa"
    },
    {
      element: <i className="ti ti-cash-banknote" style={{ fontSize: "22px", color: "#7c3aed" }}></i>,
      bgColor: "#faf5ff"
    },
    {
      element: <i className="ti ti-file-text" style={{ fontSize: "22px", color: "#ea580c" }}></i>,
      bgColor: "#fff7ed"
    }
  ];

  if (lower.includes("bank") || lower.includes("ngân hàng")) return icons[0];
  if (lower.includes("support") || lower.includes("hỗ trợ") || lower.includes("chăm sóc")) return icons[1];
  if (lower.includes("loan") || lower.includes("vay")) return icons[2];

  return icons[index % icons.length];
}

export default ServiceList;