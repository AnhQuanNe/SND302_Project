import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // Chú ý giữ nguyên baseURL của bạn
});

// BỘ LỌC CHIỀU ĐI
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// BỘ LỌC CHIỀU VỀ
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // 🚀 BƯỚC SỬA LỖI: Kiểm tra xem API đang gọi có phải là API đăng nhập không
    const originalRequestUrl = error.config.url;
    
    // Nếu trong đường dẫn API có chữ 'login' (ví dụ: /api/auth/login)
    // Thì return luôn để trang Đăng nhập tự hiện khung đỏ, KHÔNG chạy alert nữa
    if (originalRequestUrl && originalRequestUrl.includes('login')) {
      return Promise.reject(error);
    }

    // Các API khác nếu lỗi 401, 403 thì vẫn văng alert và đá ra ngoài như bình thường
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      alert(error.response.data.message || "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");
      localStorage.removeItem("token");
      window.location.href = "/"; 
    }
    
    return Promise.reject(error);
  }
);

export default api;