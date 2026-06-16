import API from "./api";

export const login = async (data) => {
  const response = await API.post("/auth/login", data);
  return response.data;
};

export const register = async (data) => {
  const response = await API.post("/auth/register", data);
  return response.data;
};

export const verifyEmail = async (data) => {
  const response = await API.post("/auth/verify-email", data);
  return response.data;
};

export const resendOTP = async (data) => {
  const response = await API.post("/auth/resend-otp", data);
  return response.data;
};