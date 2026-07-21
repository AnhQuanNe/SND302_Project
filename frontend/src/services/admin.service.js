import API from "./api";

const BASE = "/admin/users";

export const getUsers = (page, limit, role, search = "") => 
  API.get(`${BASE}?page=${page}&limit=${limit}&role=${role}&search=${search}`);

// export const createUser = (data) =>
//   API.post(BASE, data);

// export const updateUser = (id, data) =>
//   API.put(`${BASE}/${id}`, data);

// export const deleteUser = (id) =>
//   API.delete(`${BASE}/${id}`);

export const lockUser = (id) => 
  API.patch(`${BASE}/${id}/lock`);

export const unlockUser = (id) =>
  API.patch(`${BASE}/${id}/unlock`);

export const createStaff = (data) => 
  API.post(`${BASE}/staff`, data); 

export const resetStaffPassword = (id, newPassword) => 
  API.put(`${BASE}/staff/${id}/reset-password`, { newPassword });