import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getServices,
  createService,
  updateService,
  deleteService,
} from "../../services/service.service";

export default function ServiceManagement() {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    averageWaitingTime: "",
    isActive: true,
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadServices = async () => {
    try {
      setLoading(true);
      const res = await getServices();
      setServices(res.data);
    } catch (err) {
      console.error("Lỗi khi tải danh sách dịch vụ:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        averageWaitingTime: Number(form.averageWaitingTime) || 0,
      };

      if (editingId) {
        await updateService(editingId, payload);
      } else {
        await createService(payload);
      }

      setForm({
        name: "",
        description: "",
        averageWaitingTime: "",
        isActive: true,
      });
      setEditingId(null);
      loadServices();
    } catch (err) {
      console.error("Lỗi khi lưu dịch vụ:", err);
    }
  };

  const handleEdit = (service) => {
    setEditingId(service._id);
    setForm({
      name: service.name || "",
      description: service.description || "",
      averageWaitingTime: service.averageWaitingTime || "",
      isActive: service.isActive !== undefined ? service.isActive : true,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa dịch vụ này không?")) return;
    try {
      await deleteService(id);
      loadServices();
    } catch (err) {
      console.error("Lỗi khi xóa dịch vụ:", err);
    }
  };

  return (
    <div style={{ padding: "1.5rem", fontFamily: "sans-serif", maxWidth: "1200px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
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
          <h1 style={{ fontSize: "28px", fontWeight: 600, margin: 0, color: "#1e2937" }}>
            Quản lý Dịch vụ
          </h1>
        </div>
      </div>

      {/* Form Card */}
      <div style={{
        background: "#fff",
        border: "0.5px solid #e5e5e5",
        borderRadius: "12px",
        padding: "1.75rem",
        marginBottom: "2rem",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
      }}>
        <h3 style={{ margin: "0 0 1.25rem 0", fontSize: "18px", fontWeight: 600 }}>
          {editingId ? "Cập nhật dịch vụ" : "Thêm dịch vụ mới"}
        </h3>

        <form onSubmit={handleSubmit}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              <label style={{ fontSize: "14px", fontWeight: 500, color: "#475569" }}>Tên dịch vụ</label>
              <input
                style={{
                  padding: "12px 14px",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  fontSize: "15px",
                  outline: "none"
                }}
                placeholder="Ví dụ: Rút tiền, Gửi tiết kiệm..."
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              <label style={{ fontSize: "14px", fontWeight: 500, color: "#475569" }}>Thời gian chờ trung bình (phút)</label>
              <input
                style={{
                  padding: "12px 14px",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  fontSize: "15px",
                  outline: "none"
                }}
                placeholder="Ví dụ: 15"
                type="number"
                min="0"
                value={form.averageWaitingTime}
                onChange={(e) => setForm({ ...form, averageWaitingTime: e.target.value })}
                required
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              <label style={{ fontSize: "14px", fontWeight: 500, color: "#475569" }}>Trạng thái</label>
              <select
                style={{
                  padding: "12px 14px",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  fontSize: "15px",
                  outline: "none",
                  background: "#fff"
                }}
                value={form.isActive}
                onChange={(e) => setForm({ ...form, isActive: e.target.value === "true" })}
              >
                <option value="true">Hoạt động</option>
                <option value="false">Tạm dừng</option>
              </select>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "5px", marginTop: "1rem" }}>
            <label style={{ fontSize: "14px", fontWeight: 500, color: "#475569" }}>Mô tả dịch vụ</label>
            <textarea
              style={{
                padding: "12px 14px",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                fontSize: "15px",
                outline: "none",
                minHeight: "80px",
                resize: "vertical",
                fontFamily: "sans-serif"
              }}
              placeholder="Nhập mô tả ngắn về dịch vụ..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          <div style={{ marginTop: "1.5rem", display: "flex", gap: "12px" }}>
            <button
              type="submit"
              style={{
                background: "#378ADD",
                color: "white",
                border: "none",
                padding: "12px 24px",
                borderRadius: "8px",
                fontWeight: 500,
                cursor: "pointer",
                fontSize: "15px"
              }}
            >
              {editingId ? "Cập nhật" : "Thêm mới"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setForm({ name: "", description: "", averageWaitingTime: "", isActive: true });
                }}
                style={{
                  background: "#f1f5f9",
                  color: "#64748b",
                  border: "none",
                  padding: "12px 24px",
                  borderRadius: "8px",
                  fontWeight: 500,
                  cursor: "pointer"
                }}
              >
                Hủy
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Services Table */}
      <div style={{
        background: "#fff",
        border: "1px solid #e5e5e5",
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
      }}>
        <div style={{ 
          padding: "1.25rem 1.75rem", 
          borderBottom: "1px solid #e5e5e5", 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center" 
        }}>
          <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 600 }}>Danh sách dịch vụ</h3>
          <span style={{ fontSize: "15px", color: "#64748b" }}>{services.length} dịch vụ</span>
        </div>

        <table style={{ 
          width: "100%", 
          borderCollapse: "collapse",
          tableLayout: "fixed"
        }}>
          <thead>
            <tr style={{ background: "#f8fafc" }}>
              <th style={{ 
                padding: "18px 20px", 
                textAlign: "left", 
                fontWeight: 600, 
                color: "#1e2937",
                borderBottom: "1px solid #e5e5e5",
                width: "25%"
              }}>Tên dịch vụ</th>
              <th style={{ 
                padding: "18px 20px", 
                textAlign: "left", 
                fontWeight: 600, 
                color: "#1e2937",
                borderBottom: "1px solid #e5e5e5",
                width: "35%"
              }}>Mô tả</th>
              <th style={{ 
                padding: "18px 20px", 
                textAlign: "center", 
                fontWeight: 600, 
                color: "#1e2937",
                borderBottom: "1px solid #e5e5e5",
                width: "15%"
              }}>Thời gian chờ (phút)</th>
              <th style={{ 
                padding: "18px 20px", 
                textAlign: "center", 
                fontWeight: 600, 
                color: "#1e2937",
                borderBottom: "1px solid #e5e5e5",
                width: "12%"
              }}>Trạng thái</th>
              <th style={{ 
                padding: "18px 20px", 
                textAlign: "center", 
                fontWeight: 600, 
                color: "#1e2937",
                borderBottom: "1px solid #e5e5e5",
                width: "13%"
              }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <tr key={service._id} style={{ 
                borderBottom: "1px solid #f1f5f9",
              }}>
                <td style={{ padding: "18px 20px", fontWeight: 500, color: "#1f2937" }}>
                  {service.name}
                </td>
                <td style={{ padding: "18px 20px", color: "#475569", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {service.description || <span style={{ color: "#cbd5e1", fontStyle: "italic" }}>Không có mô tả</span>}
                </td>
                <td style={{ padding: "18px 20px", textAlign: "center", color: "#475569" }}>
                  {service.averageWaitingTime}
                </td>
                <td style={{ padding: "18px 20px", textAlign: "center" }}>
                  <span style={{
                    padding: "4px 12px",
                    borderRadius: "9999px",
                    fontSize: "12.5px",
                    fontWeight: 500,
                    background: service.isActive ? "#f0fdf4" : "#fef2f2",
                    color: service.isActive ? "#166534" : "#991b1b",
                    display: "inline-block"
                  }}>
                    {service.isActive ? "Hoạt động" : "Tạm dừng"}
                  </span>
                </td>
                <td style={{ padding: "18px 20px", textAlign: "center" }}>
                  <button
                    onClick={() => handleEdit(service)}
                    style={{
                      background: "#eab308",
                      color: "white",
                      border: "none",
                      padding: "6px 12px",
                      borderRadius: "6px",
                      marginRight: "6px",
                      cursor: "pointer",
                      fontSize: "13px",
                      fontWeight: 500
                    }}
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(service._id)}
                    style={{
                      background: "#ef4444",
                      color: "white",
                      border: "none",
                      padding: "6px 12px",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontSize: "13px",
                      fontWeight: 500
                    }}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {loading && (
          <div style={{ textAlign: "center", padding: "2rem", color: "#94a3b8" }}>
            Đang tải dữ liệu...
          </div>
        )}

        {!loading && services.length === 0 && (
          <div style={{ textAlign: "center", padding: "3rem", color: "#94a3b8" }}>
            Chưa có dịch vụ nào
          </div>
        )}
      </div>
    </div>
  );
}
