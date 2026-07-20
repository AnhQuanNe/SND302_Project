// import axios from "axios";

// const API =
//   "http://localhost:5000/api/auth";

// export const login = (data) =>
//   axios.post(`${API}/login`, data);

// export const register = (data) =>
//   axios.post(`${API}/register`, data);
import API from "./api";

const BASE = "/auth";

const register = async (data) => {
  const response = await API.post(`${BASE}/register`, data);
  return response.data;
};

const login = async (data) => {
  const response = await API.post(`${BASE}/login`, data);
  return response.data;
};

const verifyEmail = async (data) => {
  const response = await API.post(`${BASE}/verify-email`, data);
  return response.data;
};

// Gửi OTP quên mật khẩu
const forgotPassword = async (data) => {
  const response = await API.post(`${BASE}/forgot-password`, data);
  return response.data;
};

// Đặt lại mật khẩu
const resetPassword = async (data) => {
  const response = await API.post(`${BASE}/reset-password`, data);
  return response.data;
};

const resendOTP = async (data) => {
  const response = await API.post(`${BASE}/resend-otp`, data);
  return response.data;
};

export default { register, login, verifyEmail, resendOTP, forgotPassword, resetPassword };
