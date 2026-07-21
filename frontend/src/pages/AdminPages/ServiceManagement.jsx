import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getServices,
  createService,
  updateService,
  toggleServiceStatus,
} from "../../services/service.service";

export default function ServiceManagement() {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all"); // "all", "active", "inactive"
  const [loading, setLoading] = useState(false);

  const initialFormState = {
    name: "",
    description: "",
    averageWaitingTime: "",
    location: "",
    hotline: "",
    workingHours: "",
    requirements: "",
    isActive: true,
  };

  // State cho Thêm mới
  const [showAddModal, setShowAddModal] = useState(false);
  const [createForm, setCreateForm] = useState(initialFormState);

  // State cho Modal Sửa dịch vụ
  const [editingService, setEditingService] = useState(null);
  const [editForm, setEditForm] = useState(initialFormState);

  const loadServices = async (filter = statusFilter) => {
    try {
      setLoading(true);
      const params = {};
      if (filter === "active") params.isActive = true;
      if (filter === "inactive") params.isActive = false;
      const res = await getServices(params);
      setServices(res.data);
    } catch (err) {
      console.error("Lỗi khi tải danh sách dịch vụ:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices(statusFilter);
  }, [statusFilter]);

  // Xử lý tạo mới
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...createForm,
        averageWaitingTime: Number(createForm.averageWaitingTime) || 0,
      };
      await createService(payload);
      setCreateForm(initialFormState);
      setShowAddModal(false);
      loadServices();
    } catch (err) {
      console.error("Lỗi khi tạo dịch vụ:", err);
    }
  };

  // Mở modal sửa
  const handleEdit = (service) => {
    setEditingService(service);
    setEditForm({
      name: service.name || "",
      description: service.description || "",
      averageWaitingTime: service.averageWaitingTime || "",
      location: service.location || "",
      hotline: service.hotline || "",
      workingHours: service.workingHours || "",
      requirements: Array.isArray(service.requirements)
        ? service.requirements.join(", ")
        : service.requirements || "",
      isActive: service.isActive !== undefined ? service.isActive : true,
    });
  };

  // Xử lý cập nhật từ modal sửa
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!editingService) return;
    try {
      const payload = {
        ...editForm,
        averageWaitingTime: Number(editForm.averageWaitingTime) || 0,
      };
      await updateService(editingService._id, payload);
      setEditingService(null);
      loadServices();
    } catch (err) {
      console.error("Lỗi khi cập nhật dịch vụ:", err);
    }
  };

  // Khóa / Mở khóa
  const handleToggleStatus = async (service) => {
    const actionName = service.isActive
      ? "khóa (ngưng hoạt động)"
      : "mở khóa (kích hoạt lại)";
    if (
      !window.confirm(
        `Bạn có chắc chắn muốn ${actionName} dịch vụ "${service.name}" không?`
      )
    )
      return;
    try {
      await toggleServiceStatus(service._id);
      loadServices();
    } catch (err) {
      console.error("Lỗi khi thay đổi trạng thái dịch vụ:", err);
    }
  };

  return (
    <div
      style={{
        padding: "1.5rem",
        fontFamily: "sans-serif",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div>
          <button
            onClick={() => navigate("/admin/dashboard")}
            style={{
              background: "none",
              border: "none",
              color: "#378ADD",
              fontSize: "14px",
              cursor: "pointer",
              padding: 0,
              display: "flex",
              alignItems: "center",
              gap: "5px",
              marginBottom: "8px",
              fontWeight: 500,
            }}
          >
            ← Quay lại Dashboard
          </button>
          <h1
            style={{
              fontSize: "28px",
              fontWeight: 600,
              margin: 0,
              color: "#1e2937",
            }}
          >
            Quản lý Dịch vụ
          </h1>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          style={{
            background: "#378ADD",
            color: "white",
            border: "none",
            padding: "12px 20px",
            borderRadius: "8px",
            fontWeight: 600,
            cursor: "pointer",
            fontSize: "14.5px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            boxShadow: "0 2px 4px rgba(55, 138, 221, 0.2)",
          }}
        >
          <span>+</span> Thêm dịch vụ mới
        </button>
      </div>

      {/* Services Table */}
      <div
        style={{
          background: "#fff",
          border: "1px solid #e5e5e5",
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        }}
      >
        <div
          style={{
            padding: "1.25rem 1.75rem",
            borderBottom: "1px solid #e5e5e5",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 600 }}>
            Danh sách dịch vụ
          </h3>

          {/* Filter Tabs */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span
              style={{ fontSize: "14px", fontWeight: 500, color: "#64748b" }}
            >
              Trạng thái:
            </span>
            <div
              style={{
                display: "inline-flex",
                background: "#f1f5f9",
                borderRadius: "8px",
                padding: "3px",
              }}
            >
              <button
                onClick={() => setStatusFilter("all")}
                style={{
                  border: "none",
                  padding: "6px 14px",
                  borderRadius: "6px",
                  fontSize: "13.5px",
                  fontWeight: 500,
                  cursor: "pointer",
                  background: statusFilter === "all" ? "#ffffff" : "transparent",
                  color: statusFilter === "all" ? "#0f172a" : "#64748b",
                  boxShadow:
                    statusFilter === "all"
                      ? "0 1px 2px rgba(0,0,0,0.08)"
                      : "none",
                }}
              >
                Tất cả
              </button>
              <button
                onClick={() => setStatusFilter("active")}
                style={{
                  border: "none",
                  padding: "6px 14px",
                  borderRadius: "6px",
                  fontSize: "13.5px",
                  fontWeight: 500,
                  cursor: "pointer",
                  background:
                    statusFilter === "active" ? "#ffffff" : "transparent",
                  color: statusFilter === "active" ? "#166534" : "#64748b",
                  boxShadow:
                    statusFilter === "active"
                      ? "0 1px 2px rgba(0,0,0,0.08)"
                      : "none",
                }}
              >
                Đang hoạt động
              </button>
              <button
                onClick={() => setStatusFilter("inactive")}
                style={{
                  border: "none",
                  padding: "6px 14px",
                  borderRadius: "6px",
                  fontSize: "13.5px",
                  fontWeight: 500,
                  cursor: "pointer",
                  background:
                    statusFilter === "inactive" ? "#ffffff" : "transparent",
                  color: statusFilter === "inactive" ? "#991b1b" : "#64748b",
                  boxShadow:
                    statusFilter === "inactive"
                      ? "0 1px 2px rgba(0,0,0,0.08)"
                      : "none",
                }}
              >
                Ngưng hoạt động
              </button>
            </div>
            <span
              style={{
                fontSize: "14px",
                color: "#64748b",
                marginLeft: "8px",
              }}
            >
              ({services.length} dịch vụ)
            </span>
          </div>
        </div>

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            tableLayout: "fixed",
          }}
        >
          <thead>
            <tr style={{ background: "#f8fafc" }}>
              <th
                style={{
                  padding: "18px 20px",
                  textAlign: "left",
                  fontWeight: 600,
                  color: "#1e2937",
                  borderBottom: "1px solid #e5e5e5",
                  width: "22%",
                }}
              >
                Tên dịch vụ
              </th>
              <th
                style={{
                  padding: "18px 20px",
                  textAlign: "left",
                  fontWeight: 600,
                  color: "#1e2937",
                  borderBottom: "1px solid #e5e5e5",
                  width: "30%",
                }}
              >
                Mô tả
              </th>
              <th
                style={{
                  padding: "18px 20px",
                  textAlign: "center",
                  fontWeight: 600,
                  color: "#1e2937",
                  borderBottom: "1px solid #e5e5e5",
                  width: "18%",
                }}
              >
                Vị trí / Quầy
              </th>
              <th
                style={{
                  padding: "18px 20px",
                  textAlign: "center",
                  fontWeight: 600,
                  color: "#1e2937",
                  borderBottom: "1px solid #e5e5e5",
                  width: "14%",
                }}
              >
                Trạng thái
              </th>
              <th
                style={{
                  padding: "18px 20px",
                  textAlign: "center",
                  fontWeight: 600,
                  color: "#1e2937",
                  borderBottom: "1px solid #e5e5e5",
                  width: "16%",
                }}
              >
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <tr
                key={service._id}
                style={{
                  borderBottom: "1px solid #f1f5f9",
                  background: service.isActive ? "#ffffff" : "#fcfcfc",
                }}
              >
                <td
                  style={{
                    padding: "18px 20px",
                    fontWeight: 500,
                    color: service.isActive ? "#1f2937" : "#64748b",
                  }}
                >
                  {service.name}
                </td>
                <td
                  style={{
                    padding: "18px 20px",
                    color: service.isActive ? "#475569" : "#94a3b8",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {service.description || (
                    <span style={{ color: "#cbd5e1", fontStyle: "italic" }}>
                      Không có mô tả
                    </span>
                  )}
                </td>
                <td
                  style={{
                    padding: "18px 20px",
                    textAlign: "center",
                    color: service.isActive ? "#475569" : "#94a3b8",
                  }}
                >
                  {service.location || "Chưa cập nhật"}
                </td>
                <td style={{ padding: "18px 20px", textAlign: "center" }}>
                  <span
                    style={{
                      padding: "4px 12px",
                      borderRadius: "9999px",
                      fontSize: "12.5px",
                      fontWeight: 500,
                      background: service.isActive ? "#f0fdf4" : "#fef2f2",
                      color: service.isActive ? "#166534" : "#991b1b",
                      display: "inline-block",
                    }}
                  >
                    {service.isActive ? "Đang hoạt động" : "Ngưng hoạt động"}
                  </span>
                </td>
                <td style={{ padding: "18px 20px", textAlign: "center" }}>
                  <button
                    onClick={() => handleEdit(service)}
                    style={{
                      background: "#378ADD",
                      color: "white",
                      border: "none",
                      padding: "6px 14px",
                      borderRadius: "6px",
                      marginRight: "6px",
                      cursor: "pointer",
                      fontSize: "13px",
                      fontWeight: 500,
                    }}
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleToggleStatus(service)}
                    style={{
                      background: service.isActive ? "#ef4444" : "#16a34a",
                      color: "white",
                      border: "none",
                      padding: "6px 14px",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontSize: "13px",
                      fontWeight: 500,
                    }}
                  >
                    {service.isActive ? "Khóa" : "Mở khóa"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {loading && (
          <div
            style={{ textAlign: "center", padding: "2rem", color: "#94a3b8" }}
          >
            Đang tải dữ liệu...
          </div>
        )}

        {!loading && services.length === 0 && (
          <div
            style={{ textAlign: "center", padding: "3rem", color: "#94a3b8" }}
          >
            Chưa có dịch vụ nào trong danh mục này
          </div>
        )}
      </div>

      {/* ================= MODAL CHỈNH SỬA DỊCH VỤ ================= */}
      {editingService && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(15, 23, 42, 0.65)",
            backdropFilter: "blur(4px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
            padding: "1.5rem",
          }}
          onClick={() => setEditingService(null)}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: "16px",
              maxWidth: "750px",
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow:
                "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)",
              border: "1px solid #e2e8f0",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: "1.25rem 1.75rem",
                borderBottom: "1px solid #e2e8f0",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "#f8fafc",
                borderTopLeftRadius: "16px",
                borderTopRightRadius: "16px",
              }}
            >
              <h3
                style={{
                  margin: 0,
                  fontSize: "19px",
                  fontWeight: 600,
                  color: "#1e293b",
                }}
              >
                ✏️ Chỉnh sửa dịch vụ:{" "}
                <span style={{ color: "#378ADD" }}>{editingService.name}</span>
              </h3>
              <button
                onClick={() => setEditingService(null)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "22px",
                  cursor: "pointer",
                  color: "#64748b",
                  fontWeight: "bold",
                  lineHeight: 1,
                }}
              >
                ✕
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleUpdateSubmit} style={{ padding: "1.75rem" }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                  gap: "1.25rem",
                }}
              >
                <div
                  style={{ display: "flex", flexDirection: "column", gap: "6px" }}
                >
                  <label
                    style={{ fontSize: "14px", fontWeight: 500, color: "#475569" }}
                  >
                    Tên dịch vụ *
                  </label>
                  <input
                    style={{
                      padding: "12px 14px",
                      border: "1px solid #cbd5e1",
                      borderRadius: "8px",
                      fontSize: "15px",
                      outline: "none",
                    }}
                    placeholder="Ví dụ: Rút tiền, Gửi tiết kiệm..."
                    value={editForm.name}
                    onChange={(e) =>
                      setEditForm({ ...editForm, name: e.target.value })
                    }
                    required
                  />
                </div>

                <div
                  style={{ display: "flex", flexDirection: "column", gap: "6px" }}
                >
                  <label
                    style={{ fontSize: "14px", fontWeight: 500, color: "#475569" }}
                  >
                    Thời gian chờ trung bình (phút) *
                  </label>
                  <input
                    style={{
                      padding: "12px 14px",
                      border: "1px solid #cbd5e1",
                      borderRadius: "8px",
                      fontSize: "15px",
                      outline: "none",
                    }}
                    type="number"
                    min="0"
                    placeholder="Ví dụ: 15"
                    value={editForm.averageWaitingTime}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        averageWaitingTime: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div
                  style={{ display: "flex", flexDirection: "column", gap: "6px" }}
                >
                  <label
                    style={{ fontSize: "14px", fontWeight: 500, color: "#475569" }}
                  >
                    Địa điểm / Quầy
                  </label>
                  <input
                    style={{
                      padding: "12px 14px",
                      border: "1px solid #cbd5e1",
                      borderRadius: "8px",
                      fontSize: "15px",
                      outline: "none",
                    }}
                    placeholder="Ví dụ: Quầy 1, Tầng 1"
                    value={editForm.location}
                    onChange={(e) =>
                      setEditForm({ ...editForm, location: e.target.value })
                    }
                  />
                </div>

                <div
                  style={{ display: "flex", flexDirection: "column", gap: "6px" }}
                >
                  <label
                    style={{ fontSize: "14px", fontWeight: 500, color: "#475569" }}
                  >
                    Hotline hỗ trợ
                  </label>
                  <input
                    style={{
                      padding: "12px 14px",
                      border: "1px solid #cbd5e1",
                      borderRadius: "8px",
                      fontSize: "15px",
                      outline: "none",
                    }}
                    placeholder="Ví dụ: 1900 1234"
                    value={editForm.hotline}
                    onChange={(e) =>
                      setEditForm({ ...editForm, hotline: e.target.value })
                    }
                  />
                </div>

                <div
                  style={{ display: "flex", flexDirection: "column", gap: "6px" }}
                >
                  <label
                    style={{ fontSize: "14px", fontWeight: 500, color: "#475569" }}
                  >
                    Giờ làm việc
                  </label>
                  <input
                    style={{
                      padding: "12px 14px",
                      border: "1px solid #cbd5e1",
                      borderRadius: "8px",
                      fontSize: "15px",
                      outline: "none",
                    }}
                    placeholder="Ví dụ: 08:00 - 17:00 (T2 - T6)"
                    value={editForm.workingHours}
                    onChange={(e) =>
                      setEditForm({ ...editForm, workingHours: e.target.value })
                    }
                  />
                </div>

                <div
                  style={{ display: "flex", flexDirection: "column", gap: "6px" }}
                >
                  <label
                    style={{ fontSize: "14px", fontWeight: 500, color: "#475569" }}
                  >
                    Trạng thái
                  </label>
                  <select
                    style={{
                      padding: "12px 14px",
                      border: "1px solid #cbd5e1",
                      borderRadius: "8px",
                      fontSize: "15px",
                      outline: "none",
                      background: "#fff",
                    }}
                    value={editForm.isActive}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        isActive: e.target.value === "true",
                      })
                    }
                  >
                    <option value="true">Đang hoạt động</option>
                    <option value="false">Ngưng hoạt động (Khóa)</option>
                  </select>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                  marginTop: "1.25rem",
                }}
              >
                <label
                  style={{ fontSize: "14px", fontWeight: 500, color: "#475569" }}
                >
                  Yêu cầu giấy tờ (phân cách bởi dấu phẩy)
                </label>
                <input
                  style={{
                    padding: "12px 14px",
                    border: "1px solid #cbd5e1",
                    borderRadius: "8px",
                    fontSize: "15px",
                    outline: "none",
                  }}
                  placeholder="Ví dụ: CMND/CCCD, Sổ hộ khẩu, Thẻ ATM"
                  value={editForm.requirements}
                  onChange={(e) =>
                    setEditForm({ ...editForm, requirements: e.target.value })
                  }
                />
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                  marginTop: "1.25rem",
                }}
              >
                <label
                  style={{ fontSize: "14px", fontWeight: 500, color: "#475569" }}
                >
                  Mô tả dịch vụ
                </label>
                <textarea
                  style={{
                    padding: "12px 14px",
                    border: "1px solid #cbd5e1",
                    borderRadius: "8px",
                    fontSize: "15px",
                    outline: "none",
                    minHeight: "90px",
                    resize: "vertical",
                    fontFamily: "sans-serif",
                  }}
                  placeholder="Nhập mô tả ngắn về dịch vụ..."
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm({ ...editForm, description: e.target.value })
                  }
                />
              </div>

              {/* Modal Footer Buttons */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "12px",
                  marginTop: "1.75rem",
                  paddingTop: "1.25rem",
                  borderTop: "1px solid #f1f5f9",
                }}
              >
                <button
                  type="button"
                  onClick={() => setEditingService(null)}
                  style={{
                    padding: "11px 22px",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    background: "#ffffff",
                    color: "#475569",
                    fontWeight: 500,
                    cursor: "pointer",
                    fontSize: "14.5px",
                  }}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  style={{
                    padding: "11px 26px",
                    borderRadius: "8px",
                    border: "none",
                    background: "#378ADD",
                    color: "#ffffff",
                    fontWeight: 600,
                    cursor: "pointer",
                    fontSize: "14.5px",
                    boxShadow: "0 2px 4px rgba(55, 138, 221, 0.25)",
                  }}
                >
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL THÊM DỊCH VỤ MỚI ================= */}
      {showAddModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(15, 23, 42, 0.65)",
            backdropFilter: "blur(4px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
            padding: "1.5rem",
          }}
          onClick={() => setShowAddModal(false)}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: "16px",
              maxWidth: "750px",
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow:
                "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)",
              border: "1px solid #e2e8f0",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: "1.25rem 1.75rem",
                borderBottom: "1px solid #e2e8f0",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "#f8fafc",
                borderTopLeftRadius: "16px",
                borderTopRightRadius: "16px",
              }}
            >
              <h3
                style={{
                  margin: 0,
                  fontSize: "19px",
                  fontWeight: 600,
                  color: "#1e293b",
                }}
              >
                ✨ Thêm dịch vụ mới
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "22px",
                  cursor: "pointer",
                  color: "#64748b",
                  fontWeight: "bold",
                  lineHeight: 1,
                }}
              >
                ✕
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleCreateSubmit} style={{ padding: "1.75rem" }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                  gap: "1.25rem",
                }}
              >
                <div
                  style={{ display: "flex", flexDirection: "column", gap: "6px" }}
                >
                  <label
                    style={{ fontSize: "14px", fontWeight: 500, color: "#475569" }}
                  >
                    Tên dịch vụ *
                  </label>
                  <input
                    style={{
                      padding: "12px 14px",
                      border: "1px solid #cbd5e1",
                      borderRadius: "8px",
                      fontSize: "15px",
                      outline: "none",
                    }}
                    placeholder="Ví dụ: Rút tiền, Gửi tiết kiệm..."
                    value={createForm.name}
                    onChange={(e) =>
                      setCreateForm({ ...createForm, name: e.target.value })
                    }
                    required
                  />
                </div>

                <div
                  style={{ display: "flex", flexDirection: "column", gap: "6px" }}
                >
                  <label
                    style={{ fontSize: "14px", fontWeight: 500, color: "#475569" }}
                  >
                    Thời gian chờ trung bình (phút) *
                  </label>
                  <input
                    style={{
                      padding: "12px 14px",
                      border: "1px solid #cbd5e1",
                      borderRadius: "8px",
                      fontSize: "15px",
                      outline: "none",
                    }}
                    type="number"
                    min="0"
                    placeholder="Ví dụ: 15"
                    value={createForm.averageWaitingTime}
                    onChange={(e) =>
                      setCreateForm({
                        ...createForm,
                        averageWaitingTime: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div
                  style={{ display: "flex", flexDirection: "column", gap: "6px" }}
                >
                  <label
                    style={{ fontSize: "14px", fontWeight: 500, color: "#475569" }}
                  >
                    Địa điểm / Quầy
                  </label>
                  <input
                    style={{
                      padding: "12px 14px",
                      border: "1px solid #cbd5e1",
                      borderRadius: "8px",
                      fontSize: "15px",
                      outline: "none",
                    }}
                    placeholder="Ví dụ: Quầy 1, Tầng 1"
                    value={createForm.location}
                    onChange={(e) =>
                      setCreateForm({ ...createForm, location: e.target.value })
                    }
                  />
                </div>

                <div
                  style={{ display: "flex", flexDirection: "column", gap: "6px" }}
                >
                  <label
                    style={{ fontSize: "14px", fontWeight: 500, color: "#475569" }}
                  >
                    Hotline hỗ trợ
                  </label>
                  <input
                    style={{
                      padding: "12px 14px",
                      border: "1px solid #cbd5e1",
                      borderRadius: "8px",
                      fontSize: "15px",
                      outline: "none",
                    }}
                    placeholder="Ví dụ: 1900 1234"
                    value={createForm.hotline}
                    onChange={(e) =>
                      setCreateForm({ ...createForm, hotline: e.target.value })
                    }
                  />
                </div>

                <div
                  style={{ display: "flex", flexDirection: "column", gap: "6px" }}
                >
                  <label
                    style={{ fontSize: "14px", fontWeight: 500, color: "#475569" }}
                  >
                    Giờ làm việc
                  </label>
                  <input
                    style={{
                      padding: "12px 14px",
                      border: "1px solid #cbd5e1",
                      borderRadius: "8px",
                      fontSize: "15px",
                      outline: "none",
                    }}
                    placeholder="Ví dụ: 08:00 - 17:00 (T2 - T6)"
                    value={createForm.workingHours}
                    onChange={(e) =>
                      setCreateForm({
                        ...createForm,
                        workingHours: e.target.value,
                      })
                    }
                  />
                </div>

                <div
                  style={{ display: "flex", flexDirection: "column", gap: "6px" }}
                >
                  <label
                    style={{ fontSize: "14px", fontWeight: 500, color: "#475569" }}
                  >
                    Trạng thái
                  </label>
                  <select
                    style={{
                      padding: "12px 14px",
                      border: "1px solid #cbd5e1",
                      borderRadius: "8px",
                      fontSize: "15px",
                      outline: "none",
                      background: "#fff",
                    }}
                    value={createForm.isActive}
                    onChange={(e) =>
                      setCreateForm({
                        ...createForm,
                        isActive: e.target.value === "true",
                      })
                    }
                  >
                    <option value="true">Đang hoạt động</option>
                    <option value="false">Ngưng hoạt động (Khóa)</option>
                  </select>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                  marginTop: "1.25rem",
                }}
              >
                <label
                  style={{ fontSize: "14px", fontWeight: 500, color: "#475569" }}
                >
                  Yêu cầu giấy tờ (phân cách bởi dấu phẩy)
                </label>
                <input
                  style={{
                    padding: "12px 14px",
                    border: "1px solid #cbd5e1",
                    borderRadius: "8px",
                    fontSize: "15px",
                    outline: "none",
                  }}
                  placeholder="Ví dụ: CMND/CCCD, Sổ hộ khẩu, Thẻ ATM"
                  value={createForm.requirements}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, requirements: e.target.value })
                  }
                />
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                  marginTop: "1.25rem",
                }}
              >
                <label
                  style={{ fontSize: "14px", fontWeight: 500, color: "#475569" }}
                >
                  Mô tả dịch vụ
                </label>
                <textarea
                  style={{
                    padding: "12px 14px",
                    border: "1px solid #cbd5e1",
                    borderRadius: "8px",
                    fontSize: "15px",
                    outline: "none",
                    minHeight: "90px",
                    resize: "vertical",
                    fontFamily: "sans-serif",
                  }}
                  placeholder="Nhập mô tả ngắn về dịch vụ..."
                  value={createForm.description}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, description: e.target.value })
                  }
                />
              </div>

              {/* Modal Footer Buttons */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "12px",
                  marginTop: "1.75rem",
                  paddingTop: "1.25rem",
                  borderTop: "1px solid #f1f5f9",
                }}
              >
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{
                    padding: "11px 22px",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    background: "#ffffff",
                    color: "#475569",
                    fontWeight: 500,
                    cursor: "pointer",
                    fontSize: "14.5px",
                  }}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  style={{
                    padding: "11px 26px",
                    borderRadius: "8px",
                    border: "none",
                    background: "#378ADD",
                    color: "#ffffff",
                    fontWeight: 600,
                    cursor: "pointer",
                    fontSize: "14.5px",
                    boxShadow: "0 2px 4px rgba(55, 138, 221, 0.25)",
                  }}
                >
                  Thêm mới
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
