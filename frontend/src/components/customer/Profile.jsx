import { useState, useEffect } from "react";
import { getProfile, updateProfile } from "../../services/user.service";
import "./Profile.css";

const Profile = ({ onBack }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    gender: "",
    dob: "",
    phone: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    return date.toISOString().split("T")[0];
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await getProfile();
        const data = response.data;
        setFormData({
          fullName: data.fullName || "",
          email: data.email || "",
          gender: data.gender || "",
          dob: formatDateForInput(data.dob),
          phone: data.phone || "",
        });
      } catch (err) {
        console.error("Error fetching profile:", err);
        setMessage({
          type: "error",
          text: "Không thể tải thông tin cá nhân. Vui lòng thử lại sau.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });

    // Validate họ tên
    if (!formData.fullName.trim()) {
      setMessage({ type: "error", text: "Họ và tên không được để trống." });
      setSaving(false);
      return;
    }

    // Validate số điện thoại (nếu có nhập)
    if (formData.phone && !/^[0-9]{9,11}$/.test(formData.phone.trim())) {
      setMessage({
        type: "error",
        text: "Số điện thoại không hợp lệ. Phải từ 9 đến 11 chữ số.",
      });
      setSaving(false);
      return;
    }

    try {
      const payload = {
        fullName: formData.fullName.trim(),
        gender: formData.gender,
        dob: formData.dob || null,
        phone: formData.phone.trim(),
      };

      const response = await updateProfile(payload);
      const updatedUser = response.data;

      // Cập nhật state cục bộ
      setFormData((prev) => ({
        ...prev,
        fullName: updatedUser.fullName,
        gender: updatedUser.gender || "",
        dob: formatDateForInput(updatedUser.dob),
        phone: updatedUser.phone || "",
      }));

      // Đồng bộ thông tin user mới vào localStorage
      const localUser = JSON.parse(localStorage.getItem("user") || "{}");
      const syncedUser = {
        ...localUser,
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        gender: updatedUser.gender,
        dob: updatedUser.dob,
        phone: updatedUser.phone,
      };
      localStorage.setItem("user", JSON.stringify(syncedUser));

      setMessage({ type: "success", text: "Cập nhật thông tin cá nhân thành công!" });
      
      // Kích hoạt sự kiện storage để đồng bộ tức thì trên Header/Navbar
      window.dispatchEvent(new Event("storage"));
    } catch (err) {
      console.error("Error updating profile:", err);
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Cập nhật thông tin thất bại. Vui lòng thử lại.",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-loading-container">
        <div className="profile-spinner"></div>
        <p>Đang tải thông tin cá nhân...</p>
      </div>
    );
  }

  return (
    <div className="profile-card">
      <div className="profile-header">
        <button className="profile-back-btn" onClick={onBack}>
          <i className="ti ti-arrow-left"></i> Quay lại
        </button>
        <h2 className="profile-title">Thông Tin Cá Nhân</h2>
        <p className="profile-subtitle">Xem và cập nhật thông tin tài khoản của bạn</p>
      </div>

      {message.text && (
        <div className={`profile-message ${message.type}`}>
          <i className={`ti ${message.type === "success" ? "ti-circle-check" : "ti-alert-circle"}`}></i>
          <span>{message.text}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="profile-form">
        <div className="profile-avatar-section">
          <div className="profile-avatar-large">
            {formData.fullName.charAt(0).toUpperCase()}
          </div>
          <div className="profile-avatar-info">
            <h3>{formData.fullName || "User"}</h3>
            <p className="profile-role-badge">Khách hàng</p>
          </div>
        </div>

        <div className="profile-grid">
          {/* Họ và tên */}
          <div className="profile-form-group">
            <label htmlFor="fullName">Họ và tên <span className="required-star">*</span></label>
            <div className="input-with-icon">
              <i className="ti ti-user"></i>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Nhập họ và tên"
                required
              />
            </div>
          </div>

          {/* Email (Khóa, không sửa) */}
          <div className="profile-form-group disabled">
            <label htmlFor="email">Email (Không được chỉnh sửa)</label>
            <div className="input-with-icon">
              <i className="ti ti-mail"></i>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                placeholder="email@example.com"
                disabled
                readOnly
              />
            </div>
          </div>

          {/* Giới tính */}
          <div className="profile-form-group">
            <label htmlFor="gender">Giới tính</label>
            <div className="input-with-icon">
              <i className="ti ti-gender-transgender"></i>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="">Chọn giới tính</option>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </select>
            </div>
          </div>

          {/* Ngày sinh */}
          <div className="profile-form-group">
            <label htmlFor="dob">Ngày sinh</label>
            <div className="input-with-icon">
              <i className="ti ti-calendar"></i>
              <input
                type="date"
                id="dob"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Số điện thoại */}
          <div className="profile-form-group">
            <label htmlFor="phone">Số điện thoại</label>
            <div className="input-with-icon">
              <i className="ti ti-phone"></i>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Nhập số điện thoại"
              />
            </div>
          </div>
        </div>

        <div className="profile-actions">
          <button type="button" className="btn-cancel" onClick={onBack}>
            Hủy
          </button>
          <button type="submit" className="btn-save" disabled={saving}>
            {saving ? (
              <>
                <span className="profile-btn-spinner"></span> Đang lưu...
              </>
            ) : (
              <>
                <i className="ti ti-device-floppy"></i> Lưu thay đổi
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
