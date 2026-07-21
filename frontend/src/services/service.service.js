import API from "./api";

const BASE = "/services";

export const getServices = (params = {}) => API.get(BASE, { params });

export const createService = (data) => API.post(BASE, data);

export const updateService = (id, data) => API.put(`${BASE}/${id}`, data);

export const toggleServiceStatus = (id) => API.patch(`${BASE}/${id}/toggle`);

export const deleteService = (id) => API.delete(`${BASE}/${id}`);

