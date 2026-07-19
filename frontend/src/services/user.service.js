import API from "./api";

const BASE = "/users";

export const getProfile = () => API.get(`${BASE}/profile`);

export const updateProfile = (data) => API.put(`${BASE}/profile`, data);

// Admin lấy danh sách nhân viên
export const getStaffList = () => 
    API.get(`${BASE}/staff`);