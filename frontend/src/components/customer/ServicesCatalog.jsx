import { useState, useMemo, useEffect } from "react";
import Loading from "../common/Loading";
import ServiceDetailModal from "./ServiceDetailModal";
import "./ServicesCatalog.css";

const ITEMS_PER_PAGE = 8;

const ServicesCatalog = ({ services = [], onBook, loading }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // 'all', 'active'
  const [viewMode, setViewMode] = useState("grid"); // 'grid', 'list'
  const [selectedService, setSelectedService] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Tự động reset về trang 1 khi lọc hoặc tìm kiếm
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus]);

  // Lọc danh sách dịch vụ theo từ khoá và trạng thái
  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const matchesSearch =
        service.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        filterStatus === "all" ||
        (filterStatus === "active" && service.isActive !== false);

      return matchesSearch && matchesStatus;
    });
  }, [services, searchTerm, filterStatus]);

  // Thống kê phân trang
  const totalPages = Math.ceil(filteredServices.length / ITEMS_PER_PAGE) || 1;

  // Lấy danh sách dịch vụ cho trang hiện tại
  const paginatedServices = useMemo(() => {
    const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredServices.slice(startIdx, startIdx + ITEMS_PER_PAGE);
  }, [filteredServices, currentPage]);

  // Thống kê real-time từ Database Hàng Đợi (Queue)
  const stats = useMemo(() => {
    const total = services.length;
    const active = services.filter((s) => s.isActive !== false).length;
    const totalWaiting = services.reduce(
      (acc, s) => acc + (s.waitingCount || 0),
      0
    );

    return { total, active, totalWaiting };
  }, [services]);

  return (
    <div className="services-catalog-container">
      {/* HEADER BANNER */}
      <section className="catalog-hero">
        <div className="catalog-hero-content">
          <div className="catalog-badge">
            <i className="ti ti-apps-filled"></i> Dịch Vụ Hệ Thống
          </div>
          <h1 className="catalog-title">Khám Phá Dịch Vụ Giao Dịch</h1>
          <p className="catalog-subtitle">
            Tổng hợp tất cả các dịch vụ đang được hỗ trợ tại hệ thống Smart Queue.
            Lựa chọn dịch vụ phù hợp để lấy số thứ tự trực tuyến nhanh chóng.
          </p>
        </div>

        {/* QUICK STATS CARDS */}
        <div className="catalog-stats">
          <div className="stat-card">
            <div className="stat-icon blue">
              <i className="ti ti-list-check"></i>
            </div>
            <div className="stat-info">
              <span className="stat-value">{stats.total}</span>
              <span className="stat-label">Tổng số dịch vụ</span>
            </div>
          </div>

          <div className="stat-card green">
            <div className="stat-icon green">
              <i className="ti ti-circle-check"></i>
            </div>
            <div className="stat-info">
              <span className="stat-value">{stats.active}</span>
              <span className="stat-label">Đang sẵn sàng</span>
            </div>
          </div>
        </div>
      </section>

      {/* SEARCH & FILTER CONTROLS */}
      <div className="catalog-controls">
        <div className="search-box">
          <i className="ti ti-search search-icon"></i>
          <input
            type="text"
            placeholder="Tìm kiếm dịch vụ theo tên hoặc mô tả..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              className="clear-search-btn"
              onClick={() => setSearchTerm("")}
            >
              <i className="ti ti-x"></i>
            </button>
          )}
        </div>

        <div className="filter-actions">
          <div className="filter-tabs">
            <button
              className={`filter-tab ${filterStatus === "all" ? "active" : ""}`}
              onClick={() => setFilterStatus("all")}
            >
              Tất cả ({services.length})
            </button>
            <button
              className={`filter-tab ${filterStatus === "active" ? "active" : ""}`}
              onClick={() => setFilterStatus("active")}
            >
              Đang hoạt động ({stats.active})
            </button>
          </div>

          <div className="view-toggle">
            <button
              className={`view-btn ${viewMode === "grid" ? "active" : ""}`}
              onClick={() => setViewMode("grid")}
              title="Chế độ Lưới"
            >
              <i className="ti ti-layout-grid"></i>
            </button>
            <button
              className={`view-btn ${viewMode === "list" ? "active" : ""}`}
              onClick={() => setViewMode("list")}
              title="Chế độ Danh sách"
            >
              <i className="ti ti-list-details"></i>
            </button>
          </div>
        </div>
      </div>

      {/* CONTENT LISTING */}
      {loading ? (
        <Loading type="spinner" message="Đang tải danh sách dịch vụ..." />
      ) : filteredServices.length === 0 ? (
        <div className="empty-services-state">
          <div className="empty-icon-box">
            <i className="ti ti-search-off"></i>
          </div>
          <h3>Không tìm thấy dịch vụ phù hợp</h3>
          <p>
            Không tìm thấy dịch vụ nào khớp với từ khoá &quot;{searchTerm}&quot;. Vui lòng
            thử tìm kiếm bằng từ khoá khác.
          </p>
          <button className="reset-filter-btn" onClick={() => setSearchTerm("")}>
            Xoá bộ lọc tìm kiếm
          </button>
        </div>
      ) : (
        <>
          <div className={`services-display-${viewMode}`}>
            {paginatedServices.map((service, index) => {
              const iconConfig = getServiceCategoryIcon(service.name, index);
              const count = service.waitingCount || 0;

              return (
                <div
                  key={service._id}
                  className="catalog-service-card clickable"
                  onClick={() => setSelectedService(service)}
                >
                  <div className="card-header-row">
                    <div
                      className="service-badge-icon"
                      style={{
                        backgroundColor: iconConfig.bg,
                        color: iconConfig.color,
                      }}
                    >
                      <i className={iconConfig.icon}></i>
                    </div>
                    <span
                      className={`status-pill ${
                        service.isActive !== false ? "active" : "inactive"
                      }`}
                    >
                      {service.isActive !== false ? "Hoạt động" : "Tạm ngưng"}
                    </span>
                  </div>

                  <div className="card-body-content">
                    <h3 className="service-title">{service.name}</h3>
                    <p className="service-description">
                      {service.description || "Chưa có mô tả dịch vụ."}
                    </p>
                  </div>

                  <div className="card-footer-row">
                    <div className="time-estimate-badge">
                      <i className="ti ti-clock"></i>
                      <span>
                        {(() => {
                          const estPerTicket = service.estimatedTime ?? service.averageWaitingTime ?? 0;
                          const totalWait = count * estPerTicket;
                          return `${count} người chờ (${totalWait} phút)`;
                        })()}
                      </span>
                    </div>

                    <div className="card-action-btns">
                      <button
                        className="view-detail-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedService(service);
                        }}
                        title="Xem chi tiết dịch vụ"
                      >
                        <i className="ti ti-info-circle"></i>
                      </button>

                      <button
                        className="book-ticket-btn"
                        disabled={service.isActive === false}
                        onClick={(e) => {
                          e.stopPropagation();
                          onBook(service._id);
                        }}
                      >
                        <span>Lấy Vé</span>
                        <i className="ti ti-arrow-right"></i>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* PAGINATION CONTROLS */}
          {totalPages > 1 && (
            <div className="catalog-pagination-bar">
              <span className="pagination-info">
                Hiển thị{" "}
                <strong>
                  {(currentPage - 1) * ITEMS_PER_PAGE + 1} -{" "}
                  {Math.min(currentPage * ITEMS_PER_PAGE, filteredServices.length)}
                </strong>{" "}
                trong <strong>{filteredServices.length}</strong> dịch vụ
              </span>

              <div className="pagination-buttons">
                <button
                  className="page-nav-btn"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                >
                  <i className="ti ti-chevron-left"></i> Trước
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    className={`page-num-btn ${currentPage === page ? "active" : ""}`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                ))}

                <button
                  className="page-nav-btn"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                >
                  Sau <i className="ti ti-chevron-right"></i>
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* SERVICE DETAIL MODAL */}
      {selectedService && (
        <ServiceDetailModal
          service={selectedService}
          onClose={() => setSelectedService(null)}
          onBook={onBook}
        />
      )}
    </div>
  );
};

// Map tên dịch vụ ra icon & màu sắc trực quan
function getServiceCategoryIcon(name = "", index = 0) {
  const lower = name.toLowerCase();

  if (lower.includes("bank") || lower.includes("ngân hàng") || lower.includes("giao dịch")) {
    return { icon: "ti ti-building-bank", bg: "#eff6ff", color: "#2563eb" };
  }
  if (lower.includes("support") || lower.includes("hỗ trợ") || lower.includes("tư vấn")) {
    return { icon: "ti ti-headset", bg: "#f0fdfa", color: "#0d9488" };
  }
  if (lower.includes("loan") || lower.includes("vay") || lower.includes("tín dụng")) {
    return { icon: "ti ti-cash-banknote", bg: "#faf5ff", color: "#7c3aed" };
  }
  if (lower.includes("thẻ") || lower.includes("card") || lower.includes("thanh toán")) {
    return { icon: "ti ti-credit-card", bg: "#fff7ed", color: "#ea580c" };
  }
  if (lower.includes("vip") || lower.includes("ưu tiên") || lower.includes("doanh nghiệp")) {
    return { icon: "ti ti-crown", bg: "#fefce8", color: "#ca8a04" };
  }
  if (lower.includes("bảo hiểm") || lower.includes("insurance")) {
    return { icon: "ti ti-shield-check", bg: "#f0fdf4", color: "#16a34a" };
  }

  const defaultPalette = [
    { icon: "ti ti-building-bank", bg: "#eff6ff", color: "#2563eb" },
    { icon: "ti ti-headset", bg: "#f0fdfa", color: "#0d9488" },
    { icon: "ti ti-cash-banknote", bg: "#faf5ff", color: "#7c3aed" },
    { icon: "ti ti-file-text", bg: "#fff7ed", color: "#ea580c" },
    { icon: "ti ti-credit-card", bg: "#fdf2f8", color: "#db2777" },
  ];

  return defaultPalette[index % defaultPalette.length];
}

export default ServicesCatalog;
