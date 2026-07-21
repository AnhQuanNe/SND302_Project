import { useEffect, useState } from "react";
import {
  getUsers,
  lockUser,
  unlockUser,
} from "../../services/admin.service";

import UserTable from "../../components/admin/UserManagement/UserTable";
import styles from "../../components/admin/UserManagement/UserManagement.module.css";

export default function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [pagination, setPagination] = useState(null);
  
  // State cho chức năng tìm kiếm
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await getUsers(page, limit, "customer", searchTerm);
      setUsers(res.data.users);
      setPagination(res.data.pagination);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 LOGIC DEBOUNCE TÌM KIẾM REAL-TIME
  useEffect(() => {
    // Đặt bộ đếm thời gian: Sau khi ngừng gõ 500ms thì mới cập nhật searchTerm
    const delayDebounceFn = setTimeout(() => {
      setSearchTerm(searchInput);
      setPage(1); // Đưa về trang 1 mỗi khi có từ khóa mới
    }, 500);

    // Dọn dẹp bộ đếm nếu người dùng tiếp tục gõ (chống gọi API liên tục)
    return () => clearTimeout(delayDebounceFn);
  }, [searchInput]);

  // Load lại data mỗi khi page hoặc searchTerm chính thức thay đổi
  useEffect(() => {
    loadUsers();
  }, [page, searchTerm]);

  const handleToggleLock = async (user) => {
    try {
      if (user.status === "inactive") {
        await unlockUser(user._id);
      } else {
        await lockUser(user._id);
      }
      loadUsers();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Quản lý Người dùng</h1>

      {/* KHỐI TÌM KIẾM REAL-TIME */}
      <div style={{ marginBottom: "20px", display: "flex", justifyContent: "space-between" }}>
        <div style={{ display: "flex", gap: "10px", width: "100%" }}>
          <input
            type="text"
            placeholder="Gõ để tìm kiếm email hoặc họ tên..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)} // Gõ đến đâu, lưu vào searchInput đến đó
            style={{
              padding: "10px 16px",
              borderRadius: "8px",
              border: "1px solid #cbd5e1",
              width: "350px",
              outline: "none",
              fontSize: "14px"
            }}
          />
          {/* Chỉ hiện nút Xóa nếu input có chữ */}
          {searchInput && (
             <button 
               type="button"
               onClick={() => setSearchInput("")}
               style={{
                 padding: "8px 16px",
                 backgroundColor: "#f1f5f9",
                 color: "#64748b",
                 border: "1px solid #cbd5e1",
                 borderRadius: "6px",
                 cursor: "pointer",
                 fontWeight: "600"
               }}
             >
               Xóa
             </button>
          )}
        </div>
      </div>

      {/* Hiển thị danh sách */}
      {loading ? (
        <div>Đang tải dữ liệu...</div>
      ) : (
        <UserTable
          users={users}
          pagination={pagination}
          onToggleLock={handleToggleLock}
        />
      )}
      
      {pagination && (
        <div className={styles.paginationContainer}>
          <button
            className={styles.pageBtn}
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
          >
            Trước
          </button>

          <span className={styles.pageText}>
            Trang <strong>{pagination.currentPage}</strong> /{" "}
            <strong>{pagination.totalPages}</strong>
          </span>

          <button
            className={styles.pageBtn}
            disabled={page >= pagination.totalPages}
            onClick={() => setPage(page + 1)}
          >
            Sau
          </button>
        </div>
      )}
    </div>
  );
}