import "./ServiceDetailModal.css";

const ServiceDetailModal = ({ service, onClose, onBook }) => {
  if (!service) return null;

  const count = service.waitingCount || 0;
  const avgTime = service.averageWaitingTime ?? service.estimatedTime ?? 0;
  const totalWait = count * avgTime;

  const handleBook = () => {
    if (onBook) {
      onBook(service._id);
    }
    onClose();
  };

  return (
    <div className="service-modal-overlay" onClick={onClose}>
      <div
        className="service-modal-content"
        onClick={(e) => e.stopPropagation()} // Ngăn đóng modal khi click bên trong
      >
        {/* HEADER */}
        <div className="service-modal-header">
          <div className="modal-header-info">
            <span className="modal-category-badge">
              <i className="ti ti-info-circle"></i> Chi Tiết Dịch Vụ
            </span>
            <h2 className="modal-service-title">{service.name}</h2>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <i className="ti ti-x"></i>
          </button>
        </div>

        {/* BODY */}
        <div className="service-modal-body">
          {/* MÔ TẢ DỊCH Vụ */}
          <div className="modal-section">
            <h4 className="modal-section-title">
              <i className="ti ti-file-description"></i> Mô tả dịch vụ
            </h4>
            <p className="modal-service-desc">
              {service.description || "Chưa có mô tả chi tiết."}
            </p>
          </div>

          {/* THÔNG TIN CHI TIẾT DỊCH VỤ */}
          <div className="modal-details-grid">
            <div className="detail-info-card orange">
              <div className="detail-icon orange">
                <i className="ti ti-clock"></i>
              </div>
              <div className="detail-text">
                <span className="detail-label">Đang xếp hàng (Real-time)</span>
                <span className="detail-value">
                  {count} người chờ ({totalWait} phút)
                </span>
              </div>
            </div>

            <div className="detail-info-card green">
              <div className="detail-icon green">
                <i className="ti ti-circle-check"></i>
              </div>
              <div className="detail-text">
                <span className="detail-label">Trạng thái quầy</span>
                <span className="detail-value">
                  {service.isActive !== false ? "Đang hoạt động" : "Tạm ngưng"}
                </span>
              </div>
            </div>

            <div className="detail-info-card blue">
              <div className="detail-icon blue">
                <i className="ti ti-map-pin"></i>
              </div>
              <div className="detail-text">
                <span className="detail-label">Địa điểm / Quầy</span>
                <span className="detail-value">
                  {service.location || "Chưa cập nhật"}
                </span>
              </div>
            </div>

            <div className="detail-info-card purple">
              <div className="detail-icon purple">
                <i className="ti ti-phone-call"></i>
              </div>
              <div className="detail-text">
                <span className="detail-label">Hotline hỗ trợ</span>
                <span className="detail-value">
                  {service.hotline || "Chưa cập nhật"}
                </span>
              </div>
            </div>

            <div className="detail-info-card teal">
              <div className="detail-icon teal">
                <i className="ti ti-calendar-time"></i>
              </div>
              <div className="detail-text">
                <span className="detail-label">Giờ làm việc</span>
                <span className="detail-value">
                  {service.workingHours || "Chưa cập nhật"}
                </span>
              </div>
            </div>

            <div className="detail-info-card indigo">
              <div className="detail-icon indigo">
                <i className="ti ti-hourglass"></i>
              </div>
              <div className="detail-text">
                <span className="detail-label">Thời gian TB / lượt</span>
                <span className="detail-value">
                  {avgTime ? `${avgTime} phút` : "Chưa cập nhật"}
                </span>
              </div>
            </div>
          </div>

          {/* YÊU CẦU GIẤY TỜ */}
          <div className="modal-section" style={{ marginTop: "16px" }}>
            <h4 className="modal-section-title">
              <i className="ti ti-checkbox"></i> Yêu cầu giấy tờ khi làm thủ tục
            </h4>
            {Array.isArray(service.requirements) && service.requirements.length > 0 ? (
              <ul className="modal-requirements-list" style={{ paddingLeft: "20px", margin: "8px 0", color: "#334155" }}>
                {service.requirements.map((req, idx) => (
                  <li key={idx} style={{ marginBottom: "4px" }}>{req}</li>
                ))}
              </ul>
            ) : (
              <p className="modal-service-desc" style={{ color: "#64748b" }}>
                {service.requirements ? String(service.requirements) : "Chưa có yêu cầu giấy tờ đặc biệt."}
              </p>
            )}
          </div>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="service-modal-footer">
          <button className="modal-cancel-btn" onClick={onClose}>
            Đóng
          </button>

          <button
            className="modal-book-btn"
            disabled={service.isActive === false}
            onClick={handleBook}
          >
            <i className="ti ti-ticket"></i>
            <span>Lấy Vé Thứ Tự Ngay</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailModal;
