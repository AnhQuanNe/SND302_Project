import { useEffect, useState } from "react";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../../services/admin.service";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "customer",
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await getUsers();
      setUsers(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateUser(editingId, form);
      } else {
        await createUser(form);
      }

      setForm({
        fullName: "",
        email: "",
        password: "",
        role: "customer",
      });
      setEditingId(null);
      loadUsers();
    } catch (err) {
      console.log(err);
    }
  };

  const handleEdit = (user) => {
    setEditingId(user._id);
    setForm({
      fullName: user.fullName,
      email: user.email,
      password: "",
      role: user.role,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa người dùng này?")) return;
    try {
      await deleteUser(id);
      loadUsers();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div style={{ padding: "1.5rem", fontFamily: "sans-serif", maxWidth: "1200px" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "28px", fontWeight: 600, margin: 0, color: "#1e2937" }}>
          Quản lý Người dùng
        </h1>
       
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
          {editingId ? "Cập nhật người dùng" : "Thêm người dùng mới"}
        </h3>

        <form onSubmit={handleSubmit}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
            <input
              style={{
                padding: "12px 14px",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                fontSize: "15px",
                outline: "none"
              }}
              placeholder="Họ và tên"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              required
            />

            <input
              style={{
                padding: "12px 14px",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                fontSize: "15px",
                outline: "none"
              }}
              placeholder="Email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />

            <input
              style={{
                padding: "12px 14px",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                fontSize: "15px",
                outline: "none"
              }}
              placeholder="Mật khẩu"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required={!editingId}
            />

            <select
              style={{
                padding: "12px 14px",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                fontSize: "15px",
                outline: "none",
                background: "#fff"
              }}
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="admin">Admin</option>
              <option value="staff">Nhân viên</option>
              <option value="customer">Khách hàng</option>
            </select>
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
                  setForm({ fullName: "", email: "", password: "", role: "customer" });
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

            {/* Users Table - Đã fix lệch */}
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
          <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 600 }}>Danh sách người dùng</h3>
          <span style={{ fontSize: "15px", color: "#64748b" }}>{users.length} người dùng</span>
        </div>

        <table style={{ 
          width: "100%", 
          borderCollapse: "collapse",
          tableLayout: "fixed"   // ← Rất quan trọng
        }}>
          <thead>
            <tr style={{ background: "#f8fafc" }}>
              <th style={{ 
                padding: "18px 20px", 
                textAlign: "left", 
                fontWeight: 600, 
                color: "#1e2937",
                borderBottom: "1px solid #e5e5e5",
                width: "28%"
              }}>Họ tên</th>
              <th style={{ 
                padding: "18px 20px", 
                textAlign: "left", 
                fontWeight: 600, 
                color: "#1e2937",
                borderBottom: "1px solid #e5e5e5",
                width: "32%"
              }}>Email</th>
              <th style={{ 
                padding: "18px 20px", 
                textAlign: "left", 
                fontWeight: 600, 
                color: "#1e2937",
                borderBottom: "1px solid #e5e5e5",
                width: "20%"
              }}>Vai trò</th>
              <th style={{ 
                padding: "18px 20px", 
                textAlign: "center", 
                fontWeight: 600, 
                color: "#1e2937",
                borderBottom: "1px solid #e5e5e5",
                width: "20%"
              }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} style={{ 
                borderBottom: "1px solid #f1f5f9",
              }}>
                <td style={{ padding: "18px 20px", fontWeight: 500, color: "#1f2937" }}>
                  {user.fullName}
                </td>
                <td style={{ padding: "18px 20px", color: "#475569" }}>
                  {user.email}
                </td>
                <td style={{ padding: "18px 20px" }}>
                  <span style={{
                    padding: "6px 16px",
                    borderRadius: "9999px",
                    fontSize: "13.5px",
                    fontWeight: 500,
                    background: user.role === "admin" ? "#dbeafe" : 
                               user.role === "staff" ? "#f1f5f9" : "#f0fdf4",
                    color: user.role === "admin" ? "#1e40af" : 
                           user.role === "staff" ? "#475569" : "#166534",
                    display: "inline-block"
                  }}>
                    {user.role === "admin" ? "Quản trị viên" : 
                     user.role === "staff" ? "Nhân viên" : "Khách hàng"}
                  </span>
                </td>
                <td style={{ padding: "18px 20px", textAlign: "center" }}>
                  <button
                    onClick={() => handleEdit(user)}
                    style={{
                      background: "#eab308",
                      color: "white",
                      border: "none",
                      padding: "8px 18px",
                      borderRadius: "6px",
                      marginRight: "10px",
                      cursor: "pointer",
                      fontSize: "14px",
                      fontWeight: 500
                    }}
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(user._id)}
                    style={{
                      background: "#ef4444",
                      color: "white",
                      border: "none",
                      padding: "8px 18px",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontSize: "14px",
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
      

        {users.length === 0 && (
          <div style={{ textAlign: "center", padding: "3rem", color: "#94a3b8" }}>
            Chưa có người dùng nào
          </div>
        )}
      </div>
    </div>
  );
}