import "./ActiveTicket.css";

const ActiveTicket = ({ queue, service, onCancel }) => {
  if (!queue) return null;

  return (
    <section className="active-ticket-section">
      <div className="active-ticket-card">
        <div className="ticket-top-badge">
          VÉ HIỆN TẠI CỦA BẠN
        </div>

        <div className="ticket-wrapper">

          <div className="ticket-details">

            <div className="ticket-service-name">
              <i
                className="ti ti-bookmark"
                style={{ color: "#2563eb" }}
              ></i>
              {service?.name || "Dịch vụ"}
            </div>

            <p className="ticket-description">
              {service?.description ||
                "Đang chờ xếp hàng tại quầy phục vụ"}
            </p>

            <div className="ticket-meta-grid">

              <div className="ticket-meta-col">
                <span className="ticket-meta-label">
                  Trạng thái
                </span>

                <span
                  className={`ticket-status-badge ${
                    queue.status === "waiting"
                      ? "status-waiting"
                      : "status-serving"
                  }`}
                >
                  {queue.status === "waiting"
                    ? "Đang chờ"
                    : "Đang phục vụ"}
                </span>
              </div>

              {/* AI Prediction */}
              <div className="ticket-meta-col">
                <span className="ticket-meta-label">
                  🤖 AI dự đoán
                </span>

                <span className="ticket-wait-value">
                  {queue.predictedWaitTime != null ? (
                    <>⏱️ {Math.ceil(queue.predictedWaitTime)} phút</>
                  ) : (
                    <>Đang tính...</>
                  )}
                </span>
              </div>

            </div>

          </div>

          <div className="ticket-number-display">

            <div className="ticket-number-title">
              SỐ THỨ TỰ
            </div>

            <div className="serving-box">
              <span className="serving-label">
                Đang phục vụ
              </span>

              <span className="serving-number">
                {String(queue.currentServing || 0).padStart(3, "0")}
              </span>
            </div>

            <div className="ticket-divider"></div>

            <div className="ticket-number-digits">
              {String(queue.number).padStart(3, "0")}
            </div>

            <div className="queue-progress">
              <i className="ti ti-users"></i>
              Còn <strong>{queue.peopleAhead}</strong> khách phía trước
            </div>

            <button
              className="ticket-cancel-btn"
              onClick={onCancel}
            >
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