import React from "react";
import styles from "./UserManagement.module.css";

export default function UserTable({ users, onToggleLock }) {
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
      <div
        className={styles.cardTitle}
        style={{
          padding: "1.25rem 1.75rem",
          borderBottom: "1px solid #e5e5e5",
          margin: 0,
        }}
      >
        <h3 style={{ margin: 0 }}>Danh sách người dùng</h3>
        <span className={styles.userCount}>{users.length} người dùng</span>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th} style={{ width: "28%" }}>
              Họ tên
            </th>
            <th className={styles.th} style={{ width: "32%" }}>
              Email
            </th>
            <th className={styles.th} style={{ width: "20%" }}>
              Vai trò
            </th>
            <th
              className={styles.th}
              style={{ width: "20%", textAlign: "center" }}
            >
              Thao tác
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td className={`${styles.td} ${styles.tdName}`}>
                {user.fullName}
              </td>
              <td className={styles.td}>{user.email}</td>
              <td className={styles.td}>
                <span className={`${styles.badge} ${getRoleClass(user.role)}`}>
                  {getRoleName(user.role)}
                </span>
              </td>
              <td className={styles.td} style={{ textAlign: "center" }}>
                {/* Nút Sửa đã được comment lại theo nghiệp vụ dự phòng */}
                {/* <button 
                  // onClick={() => onEdit(user)} 
                  className={`${styles.btn} ${styles.btnSmall} ${styles.btnEdit}`}
                >
                  Sửa
                </button> 
                */}

                <button
                  onClick={() => onToggleLock(user)}
                  className={`${styles.btn} ${styles.btnSmall} ${
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

      {users.length === 0 && (
        <div className={styles.empty}>Chưa có người dùng nào</div>
      )}
    </div>
  );
}
