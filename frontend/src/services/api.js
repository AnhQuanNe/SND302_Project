import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "https://snd302-project.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// BỘ LỌC CHIỀU ĐI
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// BỘ LỌC CHIỀU VỀ
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequestUrl = error.config?.url;

    // API login tự xử lý thông báo lỗi tại trang đăng nhập
    if (originalRequestUrl?.includes("/auth/login")) {
      return Promise.reject(error);
    }

    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      alert(
        error.response.data?.message ||
          "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!"
      );

      localStorage.removeItem("token");
      window.location.href = "/";
    }

    return Promise.reject(error);
  }
);

export default api;