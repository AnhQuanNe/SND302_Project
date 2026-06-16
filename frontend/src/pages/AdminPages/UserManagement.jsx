import { useEffect, useState } from "react";
import {
  getUsers,
  // createUser,
  // updateUser,
  lockUser,
  unlockUser,
} from "../../services/admin.service";

// Import Component Table và CSS
import UserTable from "../../components/admin/UserManagement/UserTable";
import styles from "../../components/admin/UserManagement/UserManagement.module.css";

// Form Component được dự phòng, KHÔNG import:
// import UserForm from "../../components/admin/UserManagement/UserForm";

export default function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  /* =========================================
     STATE DỰ PHÒNG CHO VIỆC THÊM/SỬA
     ========================================= */
  // const [form, setForm] = useState({ fullName: "", email: "", password: "", role: "customer" });
  // const [editingId, setEditingId] = useState(null);

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

  /* =========================================
     LOGIC DỰ PHÒNG CHO VIỆC THÊM/SỬA
     ========================================= */
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     if (editingId) await updateUser(editingId, form);
  //     else await createUser(form);
  //     setForm({ fullName: "", email: "", password: "", role: "customer" });
  //     setEditingId(null);
  //     loadUsers();
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  // const handleEdit = (user) => {
  //   setEditingId(user._id);
  //   setForm({ fullName: user.fullName, email: user.email, password: "", role: user.role });
  // };

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

      {/* COMPONENT FORM DỰ PHÒNG */}
      {/* <UserForm 
          form={form} 
          setForm={setForm} 
          onSubmit={handleSubmit} 
          editingId={editingId} 
          onCancel={() => { setEditingId(null); setForm({...}); }} 
        /> 
      */}

      {/* Hiển thị danh sách */}
      {loading ? (
        <div>Đang tải dữ liệu...</div>
      ) : (
        <UserTable 
          users={users} 
          // onEdit={handleEdit} (Đã comment)
          onToggleLock={handleToggleLock}
        />
      )}
    </div>
  );
}