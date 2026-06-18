import "./ActiveTicket.css";

const ActiveTicket = ({ queue, service, onCancel }) => {
  if (!queue) return null;

  return (
    <section className="active-ticket-section">
      <div className="active-ticket-card">
        <div className="ticket-top-badge">VÉ HIỆN TẠI CỦA BẠN</div>

        <div className="ticket-wrapper">
          <div className="ticket-details">
            <div className="ticket-service-name">
              <i className="ti ti-bookmark" style={{ color: "#2563eb" }}></i>
              {service ? service.name : "Dịch vụ đã chọn"}
            </div>
            <p className="ticket-description">
              {service ? service.description : "Đang chờ xếp hàng tại quầy phục vụ"}
            </p>

            <div className="ticket-meta-grid">
              <div className="ticket-meta-col">
                <span className="ticket-meta-label">Trạng thái</span>
                <span className={`ticket-status-badge ${queue.status === "waiting" ? "status-waiting" : "status-serving"
                  }`}>
                  {queue.status === "waiting" ? "Đang chờ" : "Đang phục vụ"}
                </span>
              </div>

              <div className="ticket-meta-col">
                <span className="ticket-meta-label">Chờ ước tính</span>
                <span className="ticket-wait-value">
                  ⏱️ {service ? `${service.estimatedTime} - ${service.estimatedTime + 5}` : "5 - 10"} phút
                </span>
              </div>
            </div>
          </div>

          <div className="ticket-number-display">
            <div className="ticket-number-title">SỐ THỨ TỰ</div>
            <div className="ticket-number-digits">
              {String(queue.number).padStart(3, "0")}
            </div>
            <button className="ticket-cancel-btn" onClick={onCancel}>
              <i className="ti ti-square-x"></i>
              Huỷ vé xếp hàng
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ActiveTicket;
