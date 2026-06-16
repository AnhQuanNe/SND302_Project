import api from "../api/api";

const register = async (data) => {
    const response = await api.post("/auth/register", data);
    return response.data;
}

const login = async (data) => {
    const response = await api.post("/auth/login", data);
    return response.data;
}

const verifyEmail = async (data) => {
    const response = await api.post("/auth/verify-email", data);
    return response.data;
}

const resendOTP = async (data) => {
    const response = await api.post("/auth/resend-otp", data);
    return response.data;
}

export default {register, login, verifyEmail, resendOTP};