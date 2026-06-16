import API from "./api";

const BASE = "/admin/users";

export const getUsers = () => API.get(BASE);

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