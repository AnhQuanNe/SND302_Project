import React from "react";
import styles from "./UserManagement.module.css";

export default function UserTable({ users, pagination, onToggleLock }) {
  const getRoleClass = (role) => {
    if (role === "admin") return styles.roleAdmin;
    if (role === "staff") return styles.roleStaff;
    return styles.roleCustomer;
  };

  const getRoleName = (role) => {
    if (role === "admin") return "Quản trị viên";
    if (role === "staff") return "Nhân viên";
    return "Khách hàng";
  };

  return (
    <div className={styles.tableContainer}>
      {/* Header của bảng */}
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>Danh sách người dùng</h3>
        <span className={styles.userCount}>
          {pagination?.totalUsers ?? users.length} người dùng
        </span>
      </div>

      {/* Vùng chứa bảng có thể cuộn ngang nếu màn hình nhỏ */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={`${styles.th} ${styles.colName}`}>Họ tên</th>
              <th className={`${styles.th} ${styles.colEmail}`}>Email</th>
              <th className={`${styles.th} ${styles.colRole}`}>Vai trò</th>
              <th className={`${styles.th} ${styles.colActions}`}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className={styles.tableRow}>
                <td className={`${styles.td} ${styles.tdName}`}>
                  {user.fullName}
                </td>
                <td className={styles.td}>{user.email}</td>
                <td className={styles.td}>
                  <span className={`${styles.badge} ${getRoleClass(user.role)}`}>
                    {getRoleName(user.role)}
                  </span>
                </td>
                <td className={`${styles.td} ${styles.tdActions}`}>
                  <button
                    onClick={() => onToggleLock(user)}
                    className={`${styles.btn} ${
                      user.status === "inactive"
                        ? styles.btnUnlock
                        : styles.btnLock
                    }`}
                  >
                    {user.status === "inactive" ? "Mở khóa" : "Khóa"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Trạng thái trống */}
        {users.length === 0 && (
          <div className={styles.emptyState}>
            Chưa có người dùng nào
          </div>
        )}
      </div>
    </div>
  );
}