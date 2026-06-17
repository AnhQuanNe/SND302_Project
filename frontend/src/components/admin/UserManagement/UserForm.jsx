import React from "react";
import styles from "./UserManagement.module.css";

export default function UserForm({ form, setForm, onSubmit, editingId, onCancel }) {
  return (
    <div className={styles.card}>
      <h3 className={styles.cardTitle}>
        {editingId ? "Cập nhật người dùng" : "Thêm người dùng mới"}
      </h3>

      <form onSubmit={onSubmit}>
        <div className={styles.formGrid}>
          <input
            className={styles.input}
            placeholder="Họ và tên"
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            required
          />
          <input
            className={styles.input}
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            className={styles.input}
            placeholder="Mật khẩu"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required={!editingId}
          />
          <select
            className={styles.input}
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            <option value="admin">Admin</option>
            <option value="staff">Nhân viên</option>
            <option value="customer">Khách hàng</option>
          </select>
        </div>

        <div className={styles.btnGroup}>
          <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>
            {editingId ? "Cập nhật" : "Thêm mới"}
          </button>

          {editingId && (
            <button type="button" onClick={onCancel} className={`${styles.btn} ${styles.btnSecondary}`}>
              Hủy
            </button>
          )}
        </div>
      </form>
    </div>
  );
}