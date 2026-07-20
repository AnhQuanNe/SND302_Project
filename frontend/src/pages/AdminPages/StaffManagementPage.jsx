import { useEffect, useState } from "react";
import {
  getUsers,
  createStaff,
  resetStaffPassword,
  lockUser,
  unlockUser,
} from "../../services/admin.service";
import styles from "./StaffManagement.module.css";

export default function StaffManagementPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [pagination, setPagination] = useState(null);

  // STATE CHO TÌM KIẾM
  const [searchTerm, setSearchTerm] = useState("");

  const [latestCredential, setLatestCredential] = useState(null);
  const [notification, setNotification] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  // LOAD DỮ LIỆU CÓ KÈM SEARCH
  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await getUsers(page, limit, "staff", searchTerm);
      setUsers(res.data.users);
      setPagination(res.data.pagination);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // EFFECT TÌM KIẾM REAL-TIME (Dùng Debounce)
  useEffect(() => {
    // Chỉ gọi API sau khi người dùng ngừng gõ 500ms (tránh spam API liên tục)
    const delayDebounceFn = setTimeout(() => {
      loadUsers();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, page]); // Chạy lại khi searchTerm hoặc page thay đổi

  const generateRandomPassword = () => {
    const chars =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    return Array.from({ length: 10 }, () =>
      chars.charAt(Math.floor(Math.random() * chars.length)),
    ).join("");
  };

  const copyToClipboard = async (text, label) => {
    try {
      // Đợi quá trình sao chép hoàn tất
      await navigator.clipboard.writeText(text);
      
      // Sử dụng state notification sẵn có của bạn để hiển thị thay vì dùng alert
      setNotification(`✅ Đã sao chép ${label} thành công!`);
      
      // (Tùy chọn) Tự động ẩn thông báo sau 3 giây cho gọn màn hình
      setTimeout(() => {
        setNotification("");
      }, 3000);

    } catch (err) {
      console.error("Lỗi khi sao chép: ", err);
      setNotification(`❌ Có lỗi xảy ra khi sao chép ${label}.`);
    }
  };

  // TẠO TÀI KHOẢN MỚI
  const handleCreateStaff = async () => {
    try {
      // Tạo mã 5 số ngẫu nhiên để không bao giờ trùng lặp
      const uniqueId = Math.floor(10000 + Math.random() * 90000);
      const mockEmail = `staff_${uniqueId}@staff.local`;
      const mockPassword = generateRandomPassword();
      const timeNow = new Date().toLocaleString("vi-VN");

      // Gửi đúng key là "email" xuống Backend
      await createStaff({ email: mockEmail, password: mockPassword });

      setLatestCredential({
        email: mockEmail,
        password: mockPassword,
        time: timeNow,
      });
      setNotification(
        `✅ Đã tạo ${mockEmail}. Hãy sao chép mật khẩu để cấp cho nhân viên.`,
      );
      loadUsers();
    } catch (err) {
      alert("Lỗi: " + (err.response?.data?.message || err.message));
    }
  };

  // THU HỒI VÀ RESET PASSWORD
  const handleRevokeAndReset = async (userId, email) => {
    if (
      window.confirm(`Bạn có chắc muốn thu hồi và reset mật khẩu của ${email}?`)
    ) {
      try {
        const newPassword = generateRandomPassword();
        const timeNow = new Date().toLocaleString("vi-VN");

        await resetStaffPassword(userId, newPassword);

        setLatestCredential({
          email: email,
          password: newPassword,
          time: timeNow,
        });
        setNotification(`✅ Đã reset mật khẩu cho ${email}.`);
        loadUsers();
      } catch (err) {
        alert("Lỗi: " + (err.response?.data?.message || err.message));
      }
    }
  };

  // FIX LỖI: KHÓA / MỞ KHÓA TỰ ĐỘNG CẬP NHẬT TRẠNG THÁI NGAY LẬP TỨC
  const handleToggleLock = async (user) => {
    const isLocking = user.status === "active";
    const confirmMsg = isLocking
      ? `Bạn có chắc muốn KHÓA tài khoản ${user.email} không?`
      : `Bạn có chắc muốn MỞ KHÓA tài khoản ${user.email} không?`;

    if (window.confirm(confirmMsg)) {
      try {
        if (isLocking) {
          await lockUser(user._id);
        } else {
          await unlockUser(user._id);
        }

        const newStatus = isLocking ? "inactive" : "active";

        // 1. Cập nhật ngay trạng thái trong mảng danh sách (Table)
        setUsers(
          users.map((u) =>
            u._id === user._id ? { ...u, status: newStatus } : u,
          ),
        );

        // 2. Cập nhật ngay trạng thái trong Popup (nếu đang mở)
        if (selectedUser && selectedUser._id === user._id) {
          setSelectedUser((prev) => ({ ...prev, status: newStatus }));
        }

        alert(`Đã ${isLocking ? "khóa" : "mở khóa"} tài khoản thành công!`);
      } catch (err) {
        alert("Lỗi: " + (err.response?.data?.message || err.message));
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Chưa cập nhật";
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Quản lý Nhân sự (Staff)</h1>
        <button className={styles.btnPrimary} onClick={handleCreateStaff}>
          + Tạo tài khoản Staff
        </button>
      </div>

      {/* THỐNG KÊ */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statTitle}>Tổng tài khoản Staff</div>
          <div className={styles.statValue}>{pagination?.totalUsers || 0}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statTitle}>Tài khoản trắng</div>
          <div className={styles.statValue} style={{ color: "#475569" }}>
            {users.filter((u) => u.fullName === "Tài khoản trắng").length}
          </div>
        </div>
      </div>

      {/* THÔNG TIN CẤP GẦN NHẤT */}
      {latestCredential && (
        <div className={styles.credentialBox}>
          <div className={styles.credentialHeader}>
            <span className={styles.credentialBadge}>
              Thông tin cấp gần nhất
            </span>
            <div>
              <button
                className={styles.btnOutline}
                onClick={() =>
                  copyToClipboard(
                    latestCredential.email,
                    "Email / Tên đăng nhập",
                  )
                }
              >
                Sao chép Tên đăng nhập
              </button>
              <button
                className={styles.btnOutline}
                onClick={() =>
                  copyToClipboard(latestCredential.password, "Mật khẩu")
                }
              >
                Sao chép mật khẩu
              </button>
            </div>
          </div>
          <h2 style={{ margin: "0 0 10px 0" }}>{latestCredential.email}</h2>
          <p style={{ margin: "5px 0" }}>
            Mật khẩu hiện hành: <strong>{latestCredential.password}</strong>
          </p>
          <p style={{ margin: "0", fontSize: "13px", color: "#64748b" }}>
            Cấp lúc: {latestCredential.time}
          </p>
        </div>
      )}

      {/* HIỂN THỊ THÔNG BÁO */}
      {notification && (
        <div
          style={{
            marginBottom: "20px",
            padding: "12px 16px",
            background: "#f0fdf4",
            color: "#166534",
            borderRadius: "8px",
            border: "1px solid #bbf7d0",
          }}
        >
          {notification}
        </div>
      )}

      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Gõ email hoặc họ tên để tìm kiếm..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1);
          }}
          className={styles.searchInput}
        />

        {searchTerm && (
          <button
            type="button"
            onClick={() => {
              setSearchTerm("");
              setPage(1);
            }}
            className={styles.clearSearchBtn}
          >
            Xóa
          </button>
        )}
      </div>

      {/* BẢNG DỮ LIỆU */}
      <div className={styles.tableWrapper}>
        <table className={styles.staffTable}>
          <thead>
            <tr>
              <th>Tài khoản</th>
              <th>Hồ sơ cá nhân</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>
                  <strong>{user.email}</strong>
                  <br />
                  <span
                    className={
                      user.status === "active"
                        ? styles.badgeActive
                        : styles.badgeInactive
                    }
                  >
                    {user.status === "active"
                      ? "ACTIVE"
                      : user.status === "inactive"
                        ? "LOCKED"
                        : "BANNED"}
                  </span>
                </td>
                <td style={{ color: "#475569" }}>{user.fullName}</td>
                <td>
                  <span className={styles.tagWhite}>
                    {user.fullName === "Tài khoản trắng"
                      ? "Tài khoản trắng"
                      : "Đã cập nhật"}
                  </span>
                </td>
                <td className={styles.actionGroup}>
                  {/* NÚT XEM */}
                  <button
                    className={styles.btnInfo}
                    onClick={() => setSelectedUser(user)}
                  >
                    Xem
                  </button>

                  {/* NÚT KHÓA / MỞ KHÓA */}
                  <button
                    className={
                      user.status === "active"
                        ? styles.btnWarning
                        : styles.btnSuccess
                    }
                    onClick={() => handleToggleLock(user)}
                  >
                    {user.status === "active" ? "Khóa" : "Mở khóa"}
                  </button>

                  {/* NÚT THU HỒI */}
                  <button
                    className={styles.btnDanger}
                    onClick={() => handleRevokeAndReset(user._id, user.email)}
                  >
                    Thu hồi & reset
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && !loading && (
              <tr>
                <td
                  colSpan="4"
                  style={{ textAlign: "center", padding: "20px" }}
                >
                  Chưa có tài khoản Staff nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* POPUP XEM CHI TIẾT */}
      {selectedUser && (
        <div
          className={styles.modalOverlay}
          onClick={() => setSelectedUser(null)}
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h3>Hồ sơ nhân viên</h3>
              <button
                className={styles.closeBtn}
                onClick={() => setSelectedUser(null)}
              >
                &times;
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Tên đăng nhập:</span>
                <span className={styles.infoValue}>{selectedUser.email}</span>
              </div>

              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Họ và tên:</span>
                <span className={styles.infoValue}>
                  {selectedUser.fullName || "Chưa cập nhật"}
                </span>
              </div>

              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Trạng thái:</span>
                <span className={styles.infoValue}>
                  <span
                    className={
                      selectedUser.status === "active"
                        ? styles.badgeActive
                        : styles.badgeInactive
                    }
                  >
                    {selectedUser.status === "active"
                      ? "ĐANG HOẠT ĐỘNG"
                      : "ĐÃ KHÓA"}
                  </span>
                </span>
              </div>

              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Giới tính:</span>
                <span className={styles.infoValue}>
                  {selectedUser.gender || "Chưa cập nhật"}
                </span>
              </div>

              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Ngày sinh:</span>
                <span className={styles.infoValue}>
                  {formatDate(selectedUser.dob)}
                </span>
              </div>

              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Số điện thoại:</span>
                <span className={styles.infoValue}>
                  {selectedUser.phone || "Chưa cập nhật"}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
