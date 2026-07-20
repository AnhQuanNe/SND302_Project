import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// BỘ LỌC CHIỀU ĐI: Tự động gắn Token vào mỗi request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// BỘ LỌC CHIỀU VỀ: Lắng nghe lỗi từ Backend trả về
api.interceptors.response.use(
  (response) => {
    // Nếu API gọi thành công, cứ để nó đi qua bình thường
    return response;
  },
  (error) => {
    // Nếu Backend báo lỗi 401 (Hết hạn/Đổi pass) hoặc 403 (Bị khóa)
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      
      // 1. Hiển thị thông báo cho người dùng biết lý do
      alert(error.response.data.message || "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");
      
      // 2. Xóa sạch dữ liệu lưu trữ
      localStorage.removeItem("token");
      // Nếu bạn có lưu thông tin user trong localStorage thì xóa luôn (ví dụ: localStorage.removeItem("user");)
      
      // 3. Đá thẳng về trang đăng nhập
      // Lưu ý: Thay đổi "/login" thành đường dẫn trang đăng nhập thực tế của bạn nếu cần
      window.location.href = "/"; 
    }
    
    // Ném lỗi tiếp để các file gọi API (như admin.service.js) có thể .catch() được
    return Promise.reject(error);
  }
);

export default api;